import {
  AbstractClientWallet,
  Connector,
  WalletOptions,
} from "@thirdweb-dev/wallets";
import { TonConnectConnector } from "./TonConnectConnector";
import { getUniversalLink } from "./connector";

export type TonWalletOptions = WalletOptions<{}>;

export class TonWallet extends AbstractClientWallet {
  connector?: TonConnectConnector;

  static meta = {
    name: "TonConnect",
    iconURL: "https://avatars.githubusercontent.com/u/55018343?s=48&v=4",
  };

  static id = "tonConnect";
  public get walletName() {
    return "TonConnect" as const;
  }

  constructor(options?: TonWalletOptions) {
    super(TonWallet.id, {
      ...options,
    });
  }

  async autoConnect(
    connectOptions?: { chainId?: number | undefined } | undefined
  ): Promise<string> {
    // ! TODO: Need more investigation about implementation of this function and returning empty string
    this.connect(connectOptions);
    return "";
  }

  async getConnector(): Promise<Connector> {
    if (!this.connector) {
      this.connector = new TonConnectConnector();
    }
    return this.connector;
  }

  async getQrUrl() {
    const qrUrl = await getUniversalLink();
    if (!qrUrl) throw new Error("QR url is undefined");
    return qrUrl;
  }
}
