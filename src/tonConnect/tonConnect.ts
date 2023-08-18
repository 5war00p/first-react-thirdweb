import type { WalletConfig, WalletOptions } from "@thirdweb-dev/react-core";
import { TonWallet } from "./TonWallet";
import { TonConnectUI } from "./TonConnectUI";

// ? Reference: https://github.com/thirdweb-dev/js/tree/dac8fa7d98b6952acf8d13e 173099889c1d47da8/packages/react/src/wallet/wallets
export const TonConnect = (): WalletConfig<TonWallet> => {
  return {
    id: TonWallet.id,
    meta: TonWallet.meta,
    create: (options: WalletOptions) => new TonWallet({...options}),
    connectUI: TonConnectUI,
    isInstalled: () => false,
  };
};
