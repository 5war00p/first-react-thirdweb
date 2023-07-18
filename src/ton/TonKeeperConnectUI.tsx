import type { ConnectUIProps } from "@thirdweb-dev/react-core";
import { TonKeeperWallet } from "./TonkeeperWallet";

export const TonKeeperConnectUI = (props: ConnectUIProps<TonKeeperWallet>) => {
  return (
    <div style={{ height: "200px", width: "300px", padding: "4rem" }}>
      Connect to TonKeeper Wallet
    </div>
  );
};
