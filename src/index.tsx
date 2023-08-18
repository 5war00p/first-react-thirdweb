import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  ThirdwebProvider,
  metamaskWallet,
  // trustWallet,
  // safeWallet,
  // walletConnect,
  // coinbaseWallet,
} from "@thirdweb-dev/react";
import "./styles/globals.css";
import { Ethereum, Polygon } from "@thirdweb-dev/chains";
import { NextUIProvider } from "@nextui-org/react";
import { TonConnect } from "./tonConnect/tonConnect";
import Ton from "./tonConnect/chain";

const container = document.getElementById("root");
const root = createRoot(container!);
// const WALLET_CONNECT_CLOUD_PROJECT_ID = "cdfcb005f3195fab742c44c40e7ea6bc";

root.render(
  <React.StrictMode>
    <ThirdwebProvider
      activeChain={Ton}
      autoConnect={true}
      supportedWallets={[
        metamaskWallet(),
        // safeWallet(),
        // coinbaseWallet(),
        TonConnect(),
        // trustWallet()
        // walletConnect({ projectId: WALLET_CONNECT_CLOUD_PROJECT_ID }),
      ]}
      supportedChains={[Polygon]}
    >
      <NextUIProvider>
        <App />
      </NextUIProvider>
    </ThirdwebProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
