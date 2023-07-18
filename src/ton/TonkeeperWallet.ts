import {
  AbstractClientWallet,
  Connector,
  WagmiAdapter,
} from "@thirdweb-dev/wallets";
import { WalletInfoRemote } from "@tonconnect/sdk";
import {
  TonKeeperWalletConnector,
  connector,
  getWalletList,
} from "./connector";

// ? Reference: https://github.com/thirdweb-dev/js/blob/dac8fa7d98b6952acf8d13e173099889c1d47da8/packages/wallets/src/evm/wallets/coinbase-wallet.ts

export class TonKeeperWallet extends AbstractClientWallet<{}> {
  #private: any;
  connector?: Connector;
  tonConnector?: TonKeeperWalletConnector;

  static id = "tonkeeper";

  public get walletName() {
    return "Tonkeeper" as const;
  }

  constructor() {
    super(TonKeeperWallet.id);
  }

  static meta = {
    name: "TonKeeper",
    iconURL: "https://tonkeeper.com/assets/logo.svg",
    urls: {
      chrome:
        "https://chrome.google.com/webstore/detail/tonkeeper/omaabbefbmiijedngplfjmnooppbclkk/?utm_source=tonkeeper_indexhttps://chrome.google.com/webstore/detail/tonkeeper/omaabbefbmiijedngplfjmnooppbclkk/?utm_source=tonkeeper_index",
      android:
        "https://play.google.com/store/apps/details?id=com.ton_keeper&pli=1",
      ios: "https://apps.apple.com/us/app/tonkeeper/id1587742107",
      firefox:
        "https://addons.mozilla.org/en-US/firefox/addon/tonkeeper/?utm_source=tonkeeper_index",
    },
  };

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
      const tonConnector = new TonKeeperWalletConnector({ chains: [] });
      this.tonConnector = tonConnector;
      this.connector = new WagmiAdapter(tonConnector);
    }

    return this.connector;
  }

  async getQrUrl() {
    const walletsList = await getWalletList();

    const tonkeeperConnectionSource = {
      universalLink: (walletsList?.walletList[0] as WalletInfoRemote)
        .universalLink as string,
      bridgeUrl: (walletsList?.walletList[0] as WalletInfoRemote)
        .bridgeUrl as string,
    };

    const universalLink = connector.connect(tonkeeperConnectionSource);

    return universalLink;
  }

  getCachedSigner(): void {
    // Implement the getCachedSigner method
  }
}
