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
import { getTONChain } from "./ton/getChain";
import { Ethereum, Polygon } from "@thirdweb-dev/chains";
import tonKeeperWallet from "./ton/getWallet";
import { NextUIProvider } from "@nextui-org/react";
// import { TonApp } from "./TonApp";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = "ethereum";

const container = document.getElementById("root");
const root = createRoot(container!);
const WALLET_CONNECT_CLOUD_PROJECT_ID = "cdfcb005f3195fab742c44c40e7ea6bc";
getTONChain().then((TONChain) => {
  root.render(
    <React.StrictMode>
      <ThirdwebProvider
        activeChain={activeChain}
        supportedWallets={[
          metamaskWallet(),
          safeWallet(),
          coinbaseWallet(),
          tonKeeperWallet(),
          walletConnect({ projectId: WALLET_CONNECT_CLOUD_PROJECT_ID }),
        ]}
        supportedChains={[Ethereum, Polygon, TONChain]}
      >
        <NextUIProvider>
          <App />
          {/* <TonApp /> */}
        </NextUIProvider>
      </ThirdwebProvider>
    </React.StrictMode>
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
