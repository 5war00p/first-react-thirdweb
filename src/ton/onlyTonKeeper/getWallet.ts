import type { WalletConfig, WalletOptions } from "@thirdweb-dev/react-core";
import { TonKeeperWallet } from "./TonkeeperWallet";
import { ConnectUIProps } from "@thirdweb-dev/react";
import { TonConnectUI } from "./TonConnectUI";

/**
 * !IMPORTANT
 * Wallet function implementation
 */
const tonKeeperWallet = (
  config?: WalletOptions
): WalletConfig<TonKeeperWallet> => {
  return {
    id: "tonkeeper",
    meta: {
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
    },
    create: (options: WalletOptions) => {
      console.log(">>> create 1");
      return new TonKeeperWallet({ ...options, qrcode: true });
    },
    connectUI: (props: ConnectUIProps<TonKeeperWallet>) => {
      return TonConnectUI(props);
    },
    isInstalled: () => {
      return false;
    },
  };
};

export default tonKeeperWallet;
