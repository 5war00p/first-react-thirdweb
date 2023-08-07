import type { ConnectUIProps } from "@thirdweb-dev/react-core";
import { TonKeeperWallet } from "../TonkeeperWallet";
// import { Navbar } from "@ne  xtui-org/react";
import { UniversalQrModal } from "./UniversalQRModel";
import { getWalletList } from "../connector";
import { useEffect, useState } from "react";
import { WalletInfo } from "@tonconnect/sdk";

export const TonKeeperConnectUI = (props: ConnectUIProps<TonKeeperWallet>) => {
  const [walletList, setWalletList] = useState<WalletInfo[]>([]);
  useEffect(() => {
    getWalletList()
      .then((data) => {
        const { walletList } = data;
        setWalletList(walletList);
      })
      .catch(console.log);
  }, []);

  return (
    <div data-tc-wallets-modal-desktop="true">
      {/* <Navbar isCompact={true}>
        <Navbar.Content>QR Code</Navbar.Content>
        <Navbar.Content>Wallets</Navbar.Content>
      </Navbar> */}

      <UniversalQrModal walletsList={walletList} />
    </div>
  );
};
