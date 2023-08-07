import { TonConnectConnector } from "./connector/index";
import { QRModalOptions } from "./connector/qrModalOptions";
import {
  AbstractClientWallet,
  WalletOptions,
  Connector,
  WagmiAdapter,
} from "@thirdweb-dev/wallets";
import { walletIds } from "./walletIds";
import { WagmiConnectorData } from "@thirdweb-dev/wallets/dist/declarations/src/lib/wagmi-core";
import type TonConnectProvider from "./TonConnectProvider";

export type TON_WC_QRModalOptions = QRModalOptions;

type ConnectWithQrCodeArgs = {
  chainId?: number;
  onQrCodeUri: (uri: string) => void;
  onConnected: (accountAddress: string) => void;
};

export type TonWalletConnectOptions = {
  /**
   * Whether to display the QR Code Modal.
   *
   * Defaults to `true`.
   */
  qrcode?: boolean;
  projectId?: string;
  /**
   * options to customize the QR Code Modal
   *
   * https://docs.walletconnect.com/2.0/web3modal/options
   */
  qrModalOptions?: TON_WC_QRModalOptions;
};

/**
 * ! IMPORTANT
 * This is implenetation of the connector which is defined here: src\ton\ton-wallet-connect\index.ts
 * It is also referred from thirdweb's walletConnect V2
 * ? Reference: https://github.com/thirdweb-dev/js/blob/main/packages/wallets/src/evm/wallets/wallet-connect.ts
 *
 * It acts more like a wrapper which uses connector and calls required methods of the given connector.
 * This needs to be revised once TonConnectConnector updated.
 */

export class TonWalletConnect extends AbstractClientWallet<TonWalletConnectOptions> {
  #tonConnectConnector?: TonConnectConnector;
  #provider?: TonConnectProvider;

  connector?: Connector;

  static id = walletIds.tonConnect;

  static meta = {
    name: "TonConnect",
    iconURL: "https://avatars.githubusercontent.com/u/55018343?s=48&v=4",
  };

  public get walletName() {
    return "TonConnect" as const;
  }

  qrcode: TonWalletConnectOptions["qrcode"];

  constructor(options?: WalletOptions<TonWalletConnectOptions>) {
    super(options?.walletId || TonWalletConnect.id, options);
    this.qrcode = options?.qrcode === false ? false : true;
  }

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
      // import the connector dynamically
      this.#tonConnectConnector = new TonConnectConnector({
        chains: this.chains,
        options: {
          projectId: this.options?.projectId ?? "",
          qrcode: this.qrcode,
          dappMetadata: this.dappMetadata,
          storage: this.walletStorage,
          qrModalOptions: this.options?.qrModalOptions,
        },
      });
      this.connector = new WagmiAdapter(this.#tonConnectConnector);
      this.#provider = await this.#tonConnectConnector.getProvider();
      this.#setupListeners();
    }
    return this.connector;
  }

  #maybeThrowError = (error: any) => {
    if (error) {
      throw error;
    }
  };

  #onConnect = (data: WagmiConnectorData<TonConnectProvider>) => {
    this.#provider = data.provider;
    if (!this.#provider) {
      throw new Error("WalletConnect provider not found after connecting.");
    }
  };

  #onDisconnect = () => {
    this.#removeListeners();
  };

  #onChange = async (payload: any) => {
    if (payload.chain) {
      // chain changed
    } else if (payload.account) {
      //account change
    }
  };

  #onMessage = (payload: any) => {
    switch (payload.type) {
      case "display_uri":
        this.emit("open_wallet", payload.data);
        break;
    }
  };

  #onSessionRequestSent = () => {
    // open wallet after request is sent
    this.emit("open_wallet");
  };

  #setupListeners() {
    if (!this.#tonConnectConnector) {
      return;
    }
    this.#removeListeners();
    this.#tonConnectConnector.on("connect", this.#onConnect);
    this.#tonConnectConnector.on("disconnect", this.#onDisconnect);
    this.#tonConnectConnector.on("change", this.#onChange);
    this.#tonConnectConnector.on("message", this.#onMessage);
    this.#provider?.signer.client.on(
      "session_request_sent",
      this.#onSessionRequestSent
    );
  }

  #removeListeners() {
    if (!this.#tonConnectConnector) {
      return;
    }
    this.#tonConnectConnector.removeListener("connect", this.#onConnect);
    this.#tonConnectConnector.removeListener("disconnect", this.#onDisconnect);
    this.#tonConnectConnector.removeListener("change", this.#onChange);
    this.#tonConnectConnector.removeListener("message", this.#onMessage);
    this.#provider?.signer.client.removeListener(
      "session_request_sent",
      this.#onSessionRequestSent
    );
  }

  async connectWithQrCode(options: ConnectWithQrCodeArgs) {
    await this.getConnector();
    const tcConnector = this.#tonConnectConnector;

    if (!tcConnector) {
      throw new Error("WalletConnect connector not found");
    }

    const tcProvider = await tcConnector.getProvider();

    tcProvider.on("display_uri", (uri) => {
      options.onQrCodeUri(uri);
    });

    // trigger connect flow
    this.connect({ chainId: options.chainId }).then(options.onConnected);
  }
}
