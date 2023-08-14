import type { WalletConfig, WalletOptions } from "@thirdweb-dev/react-core";
import { TonWallet } from "./TonWallet";
import { TonConnectUI } from "./TonConnectUI";

export const TonConnect = (): WalletConfig<TonWallet> => {
  return {
    id: TonWallet.id,
    meta: TonWallet.meta,
    create: (options: WalletOptions) => {
      return new TonWallet({
        ...options,
      });
    },
    connectUI: TonConnectUI,
    isInstalled: () => {
      return false;
    },
  };
};
