import type { WalletConfig } from "@thirdweb-dev/react-core";
import { TonKeeperWallet } from "./TonkeeperWallet";
import { TonConnectUI } from "./TonConnectUI";
import { TonWalletConnect } from "../TonWalletConnect";

/**
 * ! INFO
 * Wallet function implementation
 */
const tonKeeperWallet = (): WalletConfig<TonKeeperWallet> => {
  return {
    id: TonKeeperWallet.id,
    meta: TonKeeperWallet.meta,
    create: (walletOptions) => {
      console.log(">>> create 1");
      return new TonKeeperWallet({
        ...walletOptions,
        qrcode: true,
        projectId: "cdfcb005f3195fab742c44c40e7ea6bc",
      });
    },
    connectUI: TonConnectUI,
    isInstalled: () => {
      /**
       * ! INFO
       * Hardcoding it as a false
       * Coz, the first versiono of TON is just a QR code Scan
       */
      return false;
    },
  };
};

export default tonKeeperWallet;
