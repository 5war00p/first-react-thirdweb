import type { WalletConfig, WalletOptions } from "@thirdweb-dev/react-core";
import { TonWalletConnect, TonWalletConnectOptions } from "./TonWalletConnect";

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
    create(options: WalletOptions) {
      return new TonWalletConnect({
        ...options,
        qrcode: true,
        qrModalOptions: config?.qrModalOptions,
      });
    },
  };
};
