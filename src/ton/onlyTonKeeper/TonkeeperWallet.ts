import { WalletInfoRemote } from "@tonconnect/sdk";
import { connector, getWalletList } from "./connector";
import {
  AbstractClientWallet,
  Connector,
  WagmiAdapter,
  WalletOptions,
} from "@thirdweb-dev/wallets";
import { getTONChain } from "../getChain";
import { TonConnectConnector } from "../connector";
import { QRModalOptions } from "../connector/qrModalOptions";

type ConnectWithQrCodeArgs = {
  chainId?: number;
  onQrCodeUri: (uri: string) => void;
  onConnected: (accountAddress: string) => void;
};

export type TonConnectWalletCOptions = {
  /**
   * Whether to open the default Wallet Connect QR code Modal for connecting to Zerion Wallet on mobile if Zerion is not injected when calling connect().
   */
  qrcode?: boolean;
  /**
   * When connecting MetaMask using the QR Code - Wallet Connect connector is used which requires a project id.
   * This project id is Your project’s unique identifier for wallet connect that can be obtained at cloud.walletconnect.com.
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#projectid-required
   */
  projectId?: string;
  /**
   * options to customize the Wallet Connect QR Code Modal ( only relevant when qrcode is true )
   *
   * https://docs.walletconnect.com/2.0/web3modal/options
   */
  qrModalOptions?: QRModalOptions;
};

/**
 * ! IMPORTANT
 * This is where wallet config is added.
 * If you see, I've used TonConnect provider for the required functions
 * ? Reference: https://github.com/thirdweb-dev/js/blob/dac8fa7d98b6952acf8d13e173099889c1d47da8/packages/wallets/src/evm/wallets/coinbase-wallet.ts
 */
export class TonKeeperWallet extends AbstractClientWallet<TonConnectWalletCOptions> {
  connector?: Connector;
  tonConnectConnector?: TonConnectConnector;

  static id = "tonConnect";

  public get walletName() {
    return "TonConnect" as const;
  }

  isInjected = false;

  constructor(options?: WalletOptions<TonConnectWalletCOptions>) {
    super(TonKeeperWallet.id, options);
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

  async getConnector(): Promise<Connector> {
    if (!this.connector) {
      const tonChain = await getTONChain();
      const tonConnectConnector = new TonConnectConnector({
        chains: [tonChain],
        options: {
          projectId: this.options?.projectId ?? "",
          dappMetadata: this.dappMetadata,
          storage: this.walletStorage,
          qrcode: this.options?.qrcode,
          qrModalOptions: this.options?.qrModalOptions,
        },
      });

      // need to save this for getting the QR code URI
      this.tonConnectConnector = tonConnectConnector;
      this.connector = new WagmiAdapter(tonConnectConnector);
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

  async connectWithQrCode(options: ConnectWithQrCodeArgs) {
    await this.getConnector();
    const tcConnector = this.tonConnectConnector;
    if (!tcConnector) {
      throw new Error("WalletConnect connector not found");
    }
    const tcProvider = await tcConnector.getProvider();

    // set a listener for display_uri event
    tcProvider.on("display_uri", (uri) => {
      options.onQrCodeUri(uri);
    });

    // trigger connect flow
    this.connect({
      chainId: options.chainId,
    }).then(options.onConnected);
  }

  async switchAccount() {
    throw new Error("Cannot switch account");
  }
}
