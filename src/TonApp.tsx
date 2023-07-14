import QRCode from "react-qr-code";
import React, { useCallback, useEffect, useState } from "react";
import { connector, getWalletList } from "./ton/connector";
import { addReturnStrategy, isDesktop, isMobile, openLink } from "./utils";
import {
  WalletInfo,
  WalletInfoInjected,
  WalletInfoRemote,
} from "@tonconnect/sdk";
import { useTonWalletConnectionError } from "./ton/useTonWalletConnectionError";

/* import { TonConnectUIProvider, TonConnectButton } from "@tonconnect/ui-react";
export const TonApp = () => {
  return (
    <TonConnectUIProvider manifestUrl={EXAMPLE_MANIFEST_URL}>
      <TonConnectButton />
    </TonConnectUIProvider>
  );
};
 */

export const TonApp = () => {
  const [walletsList, setWalletsList] = useState<{
    walletList: WalletInfo[];
    embededWallet: WalletInfoInjected | undefined;
    remoteWallets: WalletInfoRemote[];
  }>();
  const [modalUniversalLink, setModalUniversalLink] = useState("");

  const onConnectErrorCallback = useCallback(() => {
    setModalUniversalLink("");
    console.error({
      message: "Connection was rejected",
      description: "Please approve connection to the dApp in your wallet.",
    });
  }, []);
  useTonWalletConnectionError(onConnectErrorCallback);

  useEffect(() => {
    getWalletList()
      .then((walletsList) => {
        if (!walletsList) return;
        setWalletsList(walletsList);
      })
      .catch(console.log);
  }, []);

  const handleButtonClick = useCallback(async () => {
    if (!isDesktop() && walletsList?.embededWallet) {
      connector.connect({
        jsBridgeKey: walletsList.embededWallet.jsBridgeKey,
      });
      return;
    }

    const tonkeeperConnectionSource = {
      universalLink: (walletsList?.walletList[0] as WalletInfoRemote)
        .universalLink as string,
      bridgeUrl: (walletsList?.walletList[0] as WalletInfoRemote)
        .bridgeUrl as string,
    };

    const universalLink = connector.connect(tonkeeperConnectionSource);

    if (isMobile()) {
      openLink(addReturnStrategy(universalLink, "none"), "_blank");
    } else {
      setModalUniversalLink(universalLink);
    }
  }, [walletsList]);

  return (
    <div style={{ backgroundColor: "white" }}>
      <button style={{ padding: "2rem" }} onClick={handleButtonClick}>
        Custom TonConnectButton
      </button>
      {modalUniversalLink ? (
        <QRCode
          size={128}
          style={{ height: "260px", maxWidth: "100%", width: "100%" }}
          value={modalUniversalLink}
          viewBox={`0 0 128 128`}
        />
      ) : null}
      <div style={{ width: "300px", height: "300px" }}></div>
    </div>
  );
};
