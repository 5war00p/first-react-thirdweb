import { useState, FC, useMemo } from "react";
import {
  isWalletInfoCurrentlyInjected,
  isWalletInfoRemote,
  WalletInfo,
  WalletInfoCurrentlyInjected,
} from "@tonconnect/sdk";
import { addReturnStrategy, openLink } from "../../../utils";
import {
  Button,
  Text,
  Link,
  Container,
  PressEvent,
  Image,
} from "@nextui-org/react";
import QRCode from "react-qr-code";
import { connector } from "../connector";

interface UniversalQrModalProps {
  walletsList: WalletInfo[];
}

/**
 *
 * ! IMPORTANT
 * This is the content that will be displayed inside the modal popup.
 * Except QR code everything else is commented.
 * Problem is scanning this QR, it not recognizing in the tonkeeper wallet mobile app.
 * ? References:
 * ? https://github.com/ton-connect/sdk/blob/adf2f8fa23542c4ec09cfbcc29d9c252bd3c0dd8/packages/ui/src/app/views/modals/wallets-modal/wallets-modal.tsx
 * ? https://github.com/ton-connect/sdk/blob/adf2f8fa23542c4ec09cfbcc29d9c252bd3c0dd8/packages/ui/src/app/views/modals/wallets-modal/universal-qr-modal/index.tsx
 */

export const UniversalQrModal: FC<UniversalQrModalProps> = (props) => {
  const [popupOpened, setPopupOpened] = useState(false);

  const walletsBridges = props.walletsList
    .filter(isWalletInfoRemote)
    .map((item) => ({
      bridgeUrl: item.bridgeUrl,
      universalLink: item.universalLink,
    }));
  const availableInjectableWallets = props.walletsList.filter(
    isWalletInfoCurrentlyInjected
  );

  const request = useMemo(() => connector.connect(walletsBridges), []);

  const onOpenWalletClick = (): void => {
    let blurred = false;
    function blurHandler(): void {
      blurred = true;
      window.removeEventListener("blur", blurHandler);
    }

    window.addEventListener("blur", blurHandler);

    openLink(addReturnStrategy(request, "none"));
    setTimeout(() => {
      window.removeEventListener("blur", blurHandler);
    }, 200);
  };

  const onOpenExtensionClick = (e: PressEvent): void => {
    if (availableInjectableWallets.length === 1) {
      const walletInfo = availableInjectableWallets[0]!;

      connector.connect({
        jsBridgeKey: walletInfo.jsBridgeKey,
      });
      return;
    }

    setPopupOpened((opened) => !opened);
  };

  const onExtensionClick = (walletInfo: WalletInfoCurrentlyInjected): void => {
    connector.connect({
      jsBridgeKey: walletInfo.jsBridgeKey,
    });
  };

  return (
    <Container
      alignContent="center"
      onClick={() => setPopupOpened(false)}
      data-tc-universal-qr-desktop="true"
    >
      <Container
        css={{
          backgroundColor: "White",
          maxWidth: "fit-content",
          padding: "2rem",
          borderRadius: "2rem",
        }}
      >
        <QRCode value={request} color="white" />
      </Container>
      <Text
        weight="semibold"
        css={{ textAlign: "center", padding: "0.5rem" }}
        color="#ffffff"
      >
        Scan QR code with a TON Connect compatible wallet
      </Text>
      {/* <Container>
        <Button onClick={onOpenWalletClick}>
          {availableInjectableWallets.length ? (
            <Text>Open Wallet</Text>
          ) : (
            <Text>Open Installed Wallet</Text>
          )}
        </Button>
        {availableInjectableWallets.length ? (
          <Button onPress={onOpenExtensionClick}>
            <div>
              {popupOpened ? (
                <Container>
                  {availableInjectableWallets.map((wallet) => (
                    <Container onClick={() => onExtensionClick(wallet)}>
                      <Image src={wallet.imageUrl} alt="" />
                      <Text weight="semibold">{wallet.name}</Text>
                    </Container>
                  ))}
                </Container>
              ) : null}
            </div>
            <Text>Open Extension</Text>
          </Button>
        ) : (
          <Link href="https://ton.org/wallets">
            <Button flat css={{ "font-size": "15px" }}>
              <Text>Learn more</Text>
            </Button>
          </Link>
        )}
      </Container> */}
    </Container>
  );
};
