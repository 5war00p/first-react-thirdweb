import {
  AbstractClientWallet,
  Connector,
  WalletOptions,
} from "@thirdweb-dev/wallets";
import { WalletInfoRemote } from "@tonconnect/sdk";
import { TonConnectConnector } from "./TonConnectConnector";

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

  async getConnector(): Promise<Connector> {
    console.log(">>> came to connector");
    if (!this.connector) {
      this.connector = new TonConnectConnector();
    }
    console.log(">>> connector", this.connector);
    return this.connector;
  }

  async getQrUrl() {
    console.log(">>> came out of getQrUrl");
    if (this.connector) {
      const walletList = (await this.connector?.provider.getWallets()) ?? [];

      console.log(">>> walletList", walletList);
      const tonkeeperConnectionSource = {
        universalLink: (walletList?.[0] as WalletInfoRemote)
          ?.universalLink as string,
        bridgeUrl: (walletList?.[0] as WalletInfoRemote)?.bridgeUrl as string,
      };

      console.log(">>> tonkeeperConnectionSource", tonkeeperConnectionSource);

      const universalLink = this.connector?.provider.connect(
        tonkeeperConnectionSource
      );

      console.log(">>> came to QrUrl", universalLink);
      return universalLink;
    }
  }
}
