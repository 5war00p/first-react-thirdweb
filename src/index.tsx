import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  ThirdwebProvider,
  metamaskWallet,
  safeWallet,
  walletConnect,
  coinbaseWallet,
} from "@thirdweb-dev/react";
import "./styles/globals.css";
import { Ethereum, Polygon } from "@thirdweb-dev/chains";
import { NextUIProvider } from "@nextui-org/react";
import { TonConnect } from "./tonConnect/tonConnect";
import Ton from "./tonConnect/chain";
// import tonKeeperWallet from "./ton/onlyTonKeeper/getWallet";
// import { coinbaseWallet2 } from "./ton/coinbaseCopy/coinbaseWallet2";
// import { TonApp } from "./TonApp";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
// const activeChain = "ethereum";

const container = document.getElementById("root");
const root = createRoot(container!);
const WALLET_CONNECT_CLOUD_PROJECT_ID = "cdfcb005f3195fab742c44c40e7ea6bc";

root.render(
  <React.StrictMode>
    <ThirdwebProvider
      supportedWallets={[
        metamaskWallet(),
        safeWallet(),
        coinbaseWallet(),
        // coinbaseWallet2(),
        TonConnect(),
        // tonKeeperWallet(),
        walletConnect({ projectId: WALLET_CONNECT_CLOUD_PROJECT_ID }),
      ]}
      supportedChains={[Ton, Ethereum, Polygon]}
    >
      <NextUIProvider>
        <App />
        {/* <TonApp /> */}
      </NextUIProvider>
    </ThirdwebProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
