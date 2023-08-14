import { ConnectUIProps } from "@thirdweb-dev/react-core";
import { TonConnectScan } from "./TonConnectScan";
import { TonWallet } from "./TonWallet";

export const TonConnectUI = ({
  walletConfig,
  close,
}: ConnectUIProps<TonWallet>) => {
  return <TonConnectScan onConnected={close} walletConfig={walletConfig} />;
};
