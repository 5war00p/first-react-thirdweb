import { Chain } from "@thirdweb-dev/chains/src";
import { WagmiConnector } from "@thirdweb-dev/wallets";
import {
  TonConnect,
  isWalletInfoInjected,
  isWalletInfoRemote,
} from "@tonconnect/sdk";
import { getTONChain } from "./getChain";
import { WagmiConnectorData } from "@thirdweb-dev/wallets/dist/declarations/src/lib/wagmi-core";

const EXAMPLE_MANIFEST_URL =
  "https://gist.githubusercontent.com/siandreev/75f1a2ccf2f3b4e2771f6089aeb06d7f/raw/d4986344010ec7a2d1cc8a2a9baa57de37aaccb8/gistfile1.txt";

export const connector = new TonConnect({ manifestUrl: EXAMPLE_MANIFEST_URL });

export const getWalletList = async () => {
  const walletList = await connector.getWallets();
  const remoteWallets = walletList.filter(isWalletInfoRemote);
  const embededWallet = walletList
    .filter(isWalletInfoInjected)
    .find((wallet) => wallet.embedded);

  return { walletList, embededWallet, remoteWallets };
};

export class TonKeeperWalletConnector extends WagmiConnector {
  readonly id = "tonkeeper";
  readonly name = "Tonkeeper";
  readonly ready = true;

  provider?: "http" | "injected";

  constructor({ chains }: { chains?: Chain[] }) {
    super({ chains, options: {} });
  }

  async connect(): Promise<Required<WagmiConnectorData<any>>> {
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
}
