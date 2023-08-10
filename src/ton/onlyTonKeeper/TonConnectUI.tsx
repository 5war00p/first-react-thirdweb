import { ConnectUIProps } from "@thirdweb-dev/react-core";
import { TonConnectScan } from "./TonConnectScan";
import type { TonKeeperWallet } from "./TonkeeperWallet";
// import type{ TonWalletConnect } from "../TonWalletConnect";

export const TonConnectUI = ({
  walletConfig,
  close,
}: ConnectUIProps<TonKeeperWallet>) => {
  return <TonConnectScan onConnected={close} walletConfig={walletConfig} />;
};
