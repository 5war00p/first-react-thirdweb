import { FC } from "react";
import type { ConnectUIProps } from "@thirdweb-dev/react-core";

export const TonKeeperConnectUI: FC<ConnectUIProps> = (
  props: ConnectUIProps
) => {
  return (
    <div style={{ height: "200px", width: "300px", padding: "4rem" }}>
      Connect to TonKeeper Wallet
    </div>
  );
};
