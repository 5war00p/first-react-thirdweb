import type { WalletConfig, WalletOptions } from "@thirdweb-dev/react-core";
import { TonWalletConnect, TonWalletConnectOptions } from "./TonWalletConnect";
import { ConnectUIProps } from "@thirdweb-dev/react";
import { TonConnectUI } from "./onlyTonKeeper/TonConnectUI";

/**
 * ! IMPORTANT
 * ? Reference: https://github.com/thirdweb-dev/js/blob/dac8fa7d98b6952acf8d13e173099889c1d47da8/packages/react/src/wallet/wallets/walletConnect.tsx
 *
 * High level function which instantiates the TonWalletConnect class,
 * this is the function which will be passed as a supportedWallets list item of the thirdwebprovider
 */

export const TonConnect = (
  config?: TonWalletConnectOptions
): WalletConfig<TonWalletConnect> => {
  return {
    id: TonWalletConnect.id,
    meta: TonWalletConnect.meta,
    create: (options: WalletOptions) => {
      console.log(">>> create 2");
      return new TonWalletConnect({
        ...options,
        qrcode: false,
        qrModalOptions: config?.qrModalOptions,
      });
    },
    isInstalled: () => {
      return false;
    },
  };
};
