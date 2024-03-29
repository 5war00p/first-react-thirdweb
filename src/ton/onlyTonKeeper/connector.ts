import { Chain } from "@thirdweb-dev/chains/src";
import {
  TonConnect,
  isWalletInfoInjected,
  isWalletInfoRemote,
} from "@tonconnect/sdk";
import { getTONChain } from "../getChain";
import { WagmiConnector } from "@thirdweb-dev/wallets";
import { WagmiConnectorData } from "@thirdweb-dev/wallets/dist/declarations/src/lib/wagmi-connectors/WagmiConnector";

const EXAMPLE_MANIFEST_URL =
  "https://gist.githubusercontent.com/siandreev/75f1a2ccf2f3b4e2771f6089aeb06d7f/raw/d4986344010ec7a2d1cc8a2a9baa57de37aaccb8/gistfile1.txt";

export const connector = new TonConnect({
  manifestUrl:
    "https://first-react-thirdweb.vercel.app/tonconnect-manifest.json",
});

export const getWalletList = async () => {
  const walletList = await connector.getWallets();
  const remoteWallets = walletList.filter(isWalletInfoRemote);
  const embededWallet = walletList
    .filter(isWalletInfoInjected)
    .find((wallet) => wallet.embedded);

  console.log(">>> walletList", walletList);

  return { walletList, embededWallet, remoteWallets };
};

/**
 * ! IMPORTANT
 * It is the connector with dummy funcions implemented.
 * I named it as tonKeeper as I wanted to build tonKeeper first.
 *
 * The initialization of the TonConnect is written above, that is the provider which contains, connect/disconnect buttons.
 */
export class TonKeeperWalletConnector extends WagmiConnector {
  readonly id = "tonkeeper";
  readonly name = "Tonkeeper";
  readonly ready = true;

  provider?: TonConnect;

  constructor({ chains }: { chains?: Chain[] }) {
    super({ chains, options: {} });
  }

  async connect(): Promise<Required<WagmiConnectorData<any>>> {
    const provider = await this.getProvider();
    if (!provider) {
      throw new Error("Connector not found");
    }
    this.setupListeners();

    // emit "connecting" event
    this.emit("message", {
      type: "connecting",
    });

    return Promise.resolve({
      account: connector.account?.address as string,
      chain: {
        id: (await getTONChain()).chainId,
        unsupported: false,
      },
      provider: this.provider,
    });
  }

  async getProvider() {
    return this.provider;
  }

  async isConnected() {
    return connector.connected;
  }

  async disconnect() {
    connector.disconnect();
  }

  async getChainId() {
    const chainId = (await getTONChain()).chainId;
    return chainId;
  }

  async switchAccount() {
    // Todo
  }

  isUserRejectedRequestError(error: unknown) {
    return /(user rejected)/i.test((error as Error).message);
  }

  getAccount(): Promise<string> {
    throw new Error("Method not implemented.");
  }
  getSigner(
    config?: { chainId?: number | undefined } | undefined
  ): Promise<any> {
    throw new Error("Method not implemented.");
  }
  isAuthorized(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  protected onAccountsChanged(accounts: string[]): void {
    throw new Error("Method not implemented.");
  }
  protected onChainChanged(chain: string | number): void {
    throw new Error("Method not implemented.");
  }
  protected onDisconnect(error: Error): void {
    throw new Error("Method not implemented.");
  }
  setupListeners(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  // async setupListeners(): Promise<void> {
  //   const provider = await this.getProvider();

  //   if (provider.walletEventsListener) {
  //     provider.walletEventsListener("accountsChanged", this.onAccountsChanged);
  //     provider.walletEventsListener("chainChanged", this.onChainChanged);
  //     provider.walletEventsListener("disconnect", this.onDisconnect);
  //   }
  // }
}
