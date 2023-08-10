import {
  WalletConfig,
  useCreateWalletInstance,
  useWalletContext,
} from "@thirdweb-dev/react-core";
import { useEffect, useRef, useState } from "react";
import { TonKeeperWallet } from "./TonkeeperWallet";
import { TonWalletConnect } from "../TonWalletConnect";
import QRCode from "react-qr-code";
import { Container, Text } from "@nextui-org/react";

export const TonConnectScan: React.FC<{
  onConnected: () => void;
  walletConfig: WalletConfig<TonKeeperWallet>;
}> = ({ walletConfig, onConnected }) => {
  const createInstance = useCreateWalletInstance();
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>(undefined);
  const { setConnectedWallet, chainToConnect, setConnectionStatus } =
    useWalletContext();

  const scanStarted = useRef(false);

  useEffect(() => {
    if (scanStarted.current) {
      return;
    }

    scanStarted.current = true;

    (async () => {
      const wallet = createInstance(walletConfig) as InstanceType<
        typeof TonKeeperWallet
      >;

      const uri = await wallet.getQrUrl();
      setQrCodeUri(uri || undefined);

      setConnectionStatus("connecting");
      try {
        await wallet.connect({
          chainId: chainToConnect?.chainId,
        });

        setConnectedWallet(wallet);
        onConnected();
      } catch {
        setConnectionStatus("disconnected");
      }
    })();
  }, [
    createInstance,
    onConnected,
    walletConfig,
    chainToConnect?.chainId,
    setConnectedWallet,
    setConnectionStatus,
  ]);

  if (!qrCodeUri) return null;

  return (
    // ! ScanScreen part
    // ? Refrence: https://github.com/thirdweb-dev/js/blob/dac8fa7d98b6952acf8d13e173099889c1d47da8/packages/react/src/wallet/ConnectWallet/screens/ScanScreen.tsx

    <Container alignContent="center">
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
