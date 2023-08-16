import { TonConnect } from "@tonconnect/sdk";
import { Connector } from "@thirdweb-dev/wallets";
import { connector } from "./connector";
import Ton from "./chain";

export class TonConnectConnector extends Connector {
  readonly id = "tonConnect";
  readonly name = "TonConnect";
  readonly ready = true;

  provider: TonConnect;

  constructor() {
    super();
    this.provider = connector;
  }

  async connect(options?: { chainId: number }) {
    const provider = await this.getProvider();
    if (!provider) {
      throw new Error("Connector not found");
    }
    this.setupListeners();

    // emit "connecting" event
    this.emit("message", {
      type: "connecting",
    });

    if (options?.chainId) {
      this.switchChain(options.chainId);
    }

    return provider.account?.address as string;
  }

  async isConnected() {
    try {
      const isConnected = this.provider.connected;
      return isConnected;
    } catch (e) {
      return false;
    }
  }

  async disconnect() {
    if (this.provider) {
      this.provider.disconnect();
    }
  }

  async getChainId() {
    const chainId = Ton.chainId;
    return chainId;
  }

  getProvider(
    config?: { chainId?: number | undefined } | undefined
  ): Promise<any> {
    return Promise.resolve(this.provider);
  }

  isAuthorized(): Promise<boolean> {
    return Promise.resolve(!!this.provider.wallet);
  }

  getAddress(): Promise<string> {
    return Promise.resolve(this.provider.account?.address ?? "");
  }

  getAccount(): Promise<string> {
    return Promise.resolve(this.provider.account?.publicKey ?? "");
  }

  getSigner(
    config?: { chainId?: number | undefined } | undefined
  ): Promise<any> {
    return Promise.resolve(this.provider.wallet?.connectItems?.tonProof);
  }

  protected onAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      this.emit("disconnect");
    }
  }

  protected onChainChanged(chain: string | number): void {
    throw new Error("onChainChanged Method not implemented.");
  }

  protected onDisconnect(error: Error): void {
    this.emit("disconnect");
  }

  async switchChain(chainId: number): Promise<void> {
    this.emit("change", { chain: { id: chainId, unsupported: false } });
  }

  updateChains(): void {}

  async setupListeners() {}
}
