import {
  WalletConfig,
  useCreateWalletInstance,
  useWalletContext,
} from "@thirdweb-dev/react-core";
import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { Container, Loading, Text } from "@nextui-org/react";
import { TonWallet } from "./TonWallet";
import { Wallet } from "@tonconnect/sdk";
import Ton from "./chain";

export const TonConnectScan: React.FC<{
  onConnected: () => void;
  walletConfig: WalletConfig<TonWallet>;
}> = ({ walletConfig, onConnected }) => {
  const createInstance = useCreateWalletInstance();
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>(undefined);
  const { setConnectedWallet, chainToConnect, setConnectionStatus } =
    useWalletContext();

  const [tonWallet, setTonWallet] = useState<Wallet | null>();

  const scanStarted = useRef(false);

  const walletInstance = createInstance(walletConfig) as InstanceType<
    typeof TonWallet
  >;

  useEffect(() => {
    if (scanStarted.current) {
      return;
    }

    scanStarted.current = true;

    setConnectionStatus("connecting");

    walletInstance
      .getConnector()
      .then(() => {
        return walletInstance.getQrUrl();
      })
      .then((uri) => {
        setQrCodeUri(uri);
        walletInstance.connector?.provider.onStatusChange(
          setTonWallet,
          console.error
        );
      })
      .then(() => {
        return walletInstance.connect()
      })
      .catch((err) => {
        setConnectionStatus("disconnected");
      });
  }, [
    createInstance,
    onConnected,
    walletConfig,
    chainToConnect?.chainId,
    walletInstance,
    setConnectedWallet,
    setConnectionStatus,
  ]);

  useEffect(() => {
    if (tonWallet) {
      setConnectedWallet(walletInstance);
      onConnected();
      setConnectionStatus("connected");
    } else {
      setConnectionStatus("disconnected");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tonWallet]);

  return (
    // ! ScanScreen part
    // ? Refrence: https://github.com/thirdweb-dev/js/blob/dac8fa7d98b6952acf8d13e173099889c1d47da8/packages/react/src/wallet/ConnectWallet/screens/ScanScreen.tsx
    <Container
      display="flex"
      alignContent="center"
      alignItems="center"
      justify="center"
    >
      {!qrCodeUri ? (
        <Loading />
      ) : (
        <Container
          css={{
            backgroundColor: "White",
            maxWidth: "fit-content",
            padding: "2rem",
            borderRadius: "2rem",
          }}
        >
          <QRCode value={qrCodeUri} color="white" />
        </Container>
      )}
      <Text
        weight="semibold"
        css={{ textAlign: "center", padding: "0.5rem" }}
        color="#ffffff"
      >
        Scan QR code with your phone camera or TonConnect compatible wallet to
        connect
      </Text>
    </Container>
  );
};
