import {
  AbstractClientWallet,
  ConnectParams,
  Connector,
  WalletOptions,
} from "@thirdweb-dev/wallets";
import type { Chain } from "@thirdweb-dev/chains";
import { TonConnectConnector } from "./TonConnectConnector";
import { getUniversalLink } from "./connector";

// ? Reference: https://github.com/thirdweb-dev/js/tree/dac8fa7d98b6952acf8d13e173099889c1d47da8/packages/wallets/src/evm/wallets

export interface TonConnectionArgs {
  tonAddress: string;
  chain: Pick<Chain, "chainId" | "rpc">;
}

export type TonWalletOptions = WalletOptions<{}>;

export class TonWallet extends AbstractClientWallet<{}, TonConnectionArgs> {
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
    connectOptions: ConnectParams<TonConnectionArgs>
  ): Promise<string> {
    // ! TODO: Need more investigation about implementation of this function and returning empty string
    return this.connect(connectOptions);
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
