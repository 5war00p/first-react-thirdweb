import {
  AsyncStorage,
  DAppMetaData,
  WagmiConnector,
  UserRejectedRequestError,
  SwitchChainError,
  ProviderRpcError,
} from "@thirdweb-dev/wallets";
import type { Chain } from "@thirdweb-dev/chains";
import type WalletConnectProvider from "@walletconnect/ethereum-provider";
import { providers, utils } from "ethers";
import { walletIds } from "../walletIds";
import { QRModalOptions } from "./qrModalOptions";

const chainsToRequest = new Set([88705]);

type WalletConnectOptions = {
  qrModalOptions?: QRModalOptions;
  projectId: string;
  qrcode?: boolean;
  dappMetadata: DAppMetaData;
  storage: AsyncStorage;
  /**
   * If a new chain is added to a previously existing configured connector `chains`, this flag
   * will determine if that chain should be considered as stale. A stale chain is a chain that
   * WalletConnect has yet to establish a relationship with (ie. the user has not approved or
   * rejected the chain).
   * Defaults to `true`.
   *
   * Preface: Whereas WalletConnect v1 supported dynamic chain switching, WalletConnect v2 requires
   * the user to pre-approve a set of chains up-front. This comes with consequent UX nuances (see below) when
   * a user tries to switch to a chain that they have not approved.
   *
   * This flag mainly affects the behavior when a wallet does not support dynamic chain authorization
   * with WalletConnect v2.
   *
   * If `true` (default), the new chain will be treated as a stale chain. If the user
   * has yet to establish a relationship (approved/rejected) with this chain in their WalletConnect
   * session, the connector will disconnect upon the dapp auto-connecting, and the user will have to
   * reconnect to the dapp (revalidate the chain) in order to approve the newly added chain.
   * This is the default behavior to avoid an unexpected error upon switching chains which may
   * be a confusing user experience (ie. the user will not know they have to reconnect
   * unless the dapp handles these types of errors).
   *
   * If `false`, the new chain will be treated as a validated chain. This means that if the user
   * has yet to establish a relationship with the chain in their WalletConnect session, wagmi will successfully
   * auto-connect the user. This comes with the trade-off that the connector will throw an error
   * when attempting to switch to the unapproved chain. This may be useful in cases where a dapp constantly
   * modifies their configured chains, and they do not want to disconnect the user upon
   * auto-connecting. If the user decides to switch to the unapproved chain, it is important that the
   * dapp handles this error and prompts the user to reconnect to the dapp in order to approve
   * the newly added chain.
   *
   */
  isNewChainsStale?: boolean;
};
type WalletConnectSigner = providers.JsonRpcSigner;

type ConnectConfig = {
  /** Target chain to connect to. */
  chainId?: number;
  /** If provided, will attempt to connect to an existing pairing. */
  pairingTopic?: string;
};

const REQUESTED_CHAINS_KEY = "ton.requestedChains";
const ADD_CHAIN_METHOD = "wallet_addChain";
const LAST_USED_CHAIN_ID = "last-used-chain-id";

/**
 * ! NEED REVIEW
 * This is the class where all the core functions of a wallet needs to be implemented.
 * It referred from the thirdweb's WalletConnect V2.
 * ? Reference: https://github.com/thirdweb-dev/js/blob/main/packages/wallets/src/evm/connectors/wallet-connect/index.ts
 *
 * Problem is thirdweb uses methods that are returned by walletConnectProvider,
 * but in TonConnect we don't have any namespace methods.
 * Also some methods (eg: switchChain - as we don't need to switchChain with TON Network) are not at all useful in TON case, which are needs to be removed or
 * we need to implment empty logics for those kind of functions.
 *
 * If we are able to map this Provider properly without any typescript errors then user can properly do basic functions like connect/disconnect.
 * To do this, we need to map TonConnect (provider) from @tonconnect/sdk (refer: node_modules\@tonconnect\sdk\lib\types\index.d.ts) to thhe WagmiConnector.
 */

export class TonConnectConnector extends WagmiConnector<
  WalletConnectProvider,
  WalletConnectOptions,
  WalletConnectSigner
> {
  readonly id = walletIds.tonConnect;
  readonly name = "TonConnect";
  readonly ready = true;

  #provider?: WalletConnectProvider;
  #initProviderPromise?: Promise<void>;
  #storage: AsyncStorage;
  filteredChains: Chain[];

  constructor(config: { chains?: Chain[]; options: WalletConnectOptions }) {
    super({
      ...config,
      options: { isNewChainsStale: true, ...config.options },
    });
    this.#storage = config.options.storage;
    this.#createProvider();

    this.filteredChains =
      this.chains.length > 50
        ? this.chains.filter((c) => {
            return chainsToRequest.has(c.chainId);
          })
        : this.chains;
  }

  async connect({ chainId: chainIdP, pairingTopic }: ConnectConfig = {}) {
    try {
      let targetChainId = chainIdP;
      if (!targetChainId) {
        const lastUsedChainIdStr = await this.#storage.getItem(
          LAST_USED_CHAIN_ID
        );
        const lastUsedChainId = lastUsedChainIdStr
          ? parseInt(lastUsedChainIdStr)
          : undefined;
        if (lastUsedChainId && !this.isChainUnsupported(lastUsedChainId)) {
          targetChainId = lastUsedChainId;
        } else {
          targetChainId = this.filteredChains[0]?.chainId;
        }
      }
      if (!targetChainId) {
        throw new Error("No chains found on connector.");
      }

      const provider = await this.getProvider();
      this.setupListeners();

      const isChainsStale = await this.#isChainsStale();

      // If there is an active session with stale chains, disconnect the current session.
      if (provider.session && isChainsStale) {
        await provider.disconnect();
      }

      // If there no active session, or the chains are stale, connect.
      if (!provider.session || isChainsStale) {
        const optionalChains = this.filteredChains
          .filter((chain) => chain.chainId !== targetChainId)
          .map((optionalChain) => optionalChain.chainId);

        this.emit("message", { type: "connecting" });

        await provider.connect({
          pairingTopic,
          chains: [targetChainId],
          optionalChains:
            optionalChains.length > 0 ? optionalChains : [targetChainId],
        });

        await this.#setRequestedChainsIds(
          this.filteredChains.map(({ chainId }) => chainId)
        );
      }

      // If session exists and chains are authorized, enable provider for required chain
      const accounts = await provider.enable();
      if (accounts.length === 0) {
        throw new Error("No accounts found on provider.");
      }
      const account = utils.getAddress(accounts[0]);
      const id = await this.getChainId();
      const unsupported = this.isChainUnsupported(id);

      return {
        account,
        chain: { id, unsupported },
        provider: new providers.Web3Provider(provider),
      };
    } catch (error) {
      if (/user rejected/i.test((error as ProviderRpcError)?.message)) {
        throw new UserRejectedRequestError(error);
      }
      throw error;
    }
  }

  async disconnect() {
    const provider = await this.getProvider();
    try {
      await provider.disconnect();
    } catch (error) {
      if (!/No matching key/i.test((error as Error).message)) {
        throw error;
      }
    } finally {
      this.#removeListeners();
      await this.#setRequestedChainsIds([]);
    }
  }

  async getAccount() {
    const { accounts } = await this.getProvider();
    if (!accounts) {
      throw new Error("No account found on provider.");
    }
    return utils.getAddress(accounts[0]);
  }

  async getChainId() {
    const { chainId } = await this.getProvider();
    return chainId;
  }

  async getProvider({ chainId }: { chainId?: number } = {}) {
    if (!this.#provider) {
      await this.#createProvider();
    }
    if (chainId) {
      await this.switchChain(chainId);
    }
    if (!this.#provider) {
      throw new Error("No provider found.");
    }

    return this.#provider;
  }

  async getSigner({ chainId }: { chainId?: number } = {}) {
    const [provider, account] = await Promise.all([
      this.getProvider({ chainId }),
      this.getAccount(),
    ]);
    return new providers.Web3Provider(provider, chainId).getSigner(account);
  }

  async isAuthorized() {
    try {
      const [account, provider] = await Promise.all([
        this.getAccount(),
        this.getProvider(),
      ]);
      const isChainsStale = await this.#isChainsStale();

      // If an account does not exist on the session, then the connector is unauthorized.
      if (!account) {
        return false;
      }

      // If the chains are stale on the session, then the connector is unauthorized.
      if (isChainsStale && provider.session) {
        try {
          await provider.disconnect();
        } catch {} // eslint-disable-line no-empty
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  async switchChain(chainId: number) {
    const chain = this.chains.find((chain_) => chain_.chainId === chainId);

    if (!chain) {
      throw new SwitchChainError(
        `Chain with ID: ${chainId}, not found on connector.`
      );
    }

    try {
      const provider = await this.getProvider();
      const namespaceChains = this.#getNamespaceChainsIds();
      const namespaceMethods = this.#getNamespaceMethods();
      const isChainApproved = namespaceChains.includes(chainId);

      if (!isChainApproved && namespaceMethods.includes(ADD_CHAIN_METHOD)) {
        const blockExplorerUrls = chain.explorers?.length
          ? { blockExplorerUrls: [chain.explorers[0].url] }
          : {};
        await provider.request({
          method: ADD_CHAIN_METHOD,
          params: [
            {
              chainId: utils.hexValue(chain.chainId),
              chainName: chain.name,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: [...chain.rpc],
              ...blockExplorerUrls,
            },
          ],
        });
        const requestedChains = await this.#getRequestedChainsIds();
        requestedChains.push(chainId);
        await this.#setRequestedChainsIds(requestedChains);
      }
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: utils.hexValue(chainId) }],
      });

      return chain;
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : (error as ProviderRpcError)?.message;
      if (/user rejected request/i.test(message)) {
        throw new UserRejectedRequestError(error);
      }

      throw new SwitchChainError(error);
    }
  }

  async #createProvider() {
    if (!this.#initProviderPromise && typeof window !== "undefined") {
      this.#initProviderPromise = this.#initProvider();
    }
    return this.#initProviderPromise;
  }

  async #initProvider() {
    // This entire logic needs to be updated with TonConnect class from @tonconnect/sdk

    const {
      default: EthereumProvider,
      OPTIONAL_EVENTS,
      OPTIONAL_METHODS,
    } = await import("@walletconnect/ethereum-provider");
    const [defaultChain, ...optionalChains] = this.filteredChains.map(
      ({ chainId }) => chainId
    );

    if (defaultChain) {
      // EthereumProvider populates & deduplicates required methods and events internally
      this.#provider = await EthereumProvider.init({
        showQrModal: this.options.qrcode !== false,
        projectId: this.options.projectId,
        optionalMethods: OPTIONAL_METHODS,
        optionalEvents: OPTIONAL_EVENTS,
        chains: [defaultChain],
        optionalChains: optionalChains,

        metadata: {
          name: this.options.dappMetadata.name,
          description: this.options.dappMetadata.description || "",
          url: this.options.dappMetadata.url,
          icons: [this.options.dappMetadata.logoUrl || ""],
        },
        rpcMap: Object.fromEntries(
          this.filteredChains.map((chain) => [chain.chainId, chain.rpc[0]])
        ),

        qrModalOptions: this.options.qrModalOptions,
      });
    }
  }

  /**
   * Checks if the target chains match the chains that were
   * initially requested by the connector for the WalletConnect session.
   * If there is a mismatch, this means that the chains on the connector
   * are considered stale, and need to be revalidated at a later point (via
   * connection).
   *
   * There may be a scenario where a dapp adds a chain to the
   * connector later on, however, this chain will not have been approved or rejected
   * by the wallet. In this case, the chain is considered stale.
   *
   * There are exceptions however:
   * -  If the wallet supports dynamic chain addition via `eth_addEthereumChain`,
   *    then the chain is not considered stale.
   * -  If the `isNewChainsStale` flag is falsy on the connector, then the chain is
   *    not considered stale.
   *
   * For the above cases, chain validation occurs dynamically when the user
   * attempts to switch chain.
   *
   * Also check that dapp supports at least 1 chain from previously approved session.
   */
  async #isChainsStale() {
    // We won't be needing the chain as we only have single chain.

    const namespaceMethods = this.#getNamespaceMethods();
    if (namespaceMethods.includes(ADD_CHAIN_METHOD)) {
      return false;
    }
    if (!this.options.isNewChainsStale) {
      return false;
    }

    const requestedChains = await this.#getRequestedChainsIds();
    const connectorChains = this.filteredChains.map(({ chainId }) => chainId);
    const namespaceChains = this.#getNamespaceChainsIds();

    if (
      namespaceChains.length &&
      !namespaceChains.some((id) => connectorChains.includes(id))
    ) {
      return false;
    }

    return !connectorChains.every((id) => requestedChains.includes(id));
  }

  async setupListeners() {
    if (!this.#provider) {
      return;
    }
    this.#removeListeners();
    this.#provider.on("accountsChanged", this.onAccountsChanged);
    this.#provider.on("chainChanged", this.onChainChanged);
    this.#provider.on("disconnect", this.onDisconnect);
    this.#provider.on("session_delete", this.onDisconnect);
    this.#provider.on("display_uri", this.onDisplayUri);
    this.#provider.on("connect", this.onConnect);
  }

  #removeListeners() {
    if (!this.#provider) {
      return;
    }
    this.#provider.removeListener("accountsChanged", this.onAccountsChanged);
    this.#provider.removeListener("chainChanged", this.onChainChanged);
    this.#provider.removeListener("disconnect", this.onDisconnect);
    this.#provider.removeListener("session_delete", this.onDisconnect);
    this.#provider.removeListener("display_uri", this.onDisplayUri);
    this.#provider.removeListener("connect", this.onConnect);
  }

  async #setRequestedChainsIds(chains: number[]) {
    await this.#storage.setItem(REQUESTED_CHAINS_KEY, JSON.stringify(chains));
  }

  async #getRequestedChainsIds(): Promise<number[]> {
    const data = await this.#storage.getItem(REQUESTED_CHAINS_KEY);
    return data ? JSON.parse(data) : [];
  }

  #getNamespaceChainsIds() {
    if (!this.#provider) {
      return [];
    }

    /**
     * Ton chains
     * Custom TON ChainID = 88705
     */
    return [88705];
  }

  #getNamespaceMethods(): string[] {
    return [];
  }

  protected onAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      this.emit("disconnect");
    } else {
      this.emit("change", { account: utils.getAddress(accounts[0]) });
    }
  };

  protected onChainChanged = async (chainId: number | string) => {
    const id = Number(chainId);
    const unsupported = this.isChainUnsupported(id);
    await this.#storage.setItem(LAST_USED_CHAIN_ID, String(chainId));
    this.emit("change", { chain: { id, unsupported } });
  };

  protected onDisconnect = async () => {
    await this.#setRequestedChainsIds([]);
    await this.#storage.removeItem(LAST_USED_CHAIN_ID);
    this.emit("disconnect");
  };

  protected onDisplayUri = (uri: string) => {
    this.emit("message", { type: "display_uri", data: uri });
  };

  protected onConnect = () => {
    this.emit("connect", { provider: this.#provider });
  };
}
