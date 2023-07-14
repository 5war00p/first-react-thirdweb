import type { AbstractClientWallet } from "@thirdweb-dev/wallets";
import type { WalletOptions, ConnectUIProps } from "@thirdweb-dev/react-core";
import { ConfiguredWallet } from "@thirdweb-dev/react/dist/declarations/src/evm";
import TonConnect from "@tonconnect/sdk";

const tonKeeperWallet = (): ConfiguredWallet => {
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
    create: (
      options: WalletOptions
    ): AbstractClientWallet<Record<string, any>, Record<string, any>> => {
      return {} as InstanceType<typeof AbstractClientWallet>;
    },
    connectUI: (props: ConnectUIProps) => null,
    isInstalled: () => false,
  };
};

export default tonKeeperWallet;
