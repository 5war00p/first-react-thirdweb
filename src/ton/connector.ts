import {
  TonConnect,
  isWalletInfoInjected,
  isWalletInfoRemote,
} from "@tonconnect/sdk";

const EXAMPLE_MANIFEST_URL =
  "https://gist.githubusercontent.com/siandreev/75f1a2ccf2f3b4e2771f6089aeb06d7f/raw/d4986344010ec7a2d1cc8a2a9baa57de37aaccb8/gistfile1.txt";

export const connector = new TonConnect({ manifestUrl: EXAMPLE_MANIFEST_URL });

export const getWalletList = async () => {
  console.log(connector);
  const walletList = await connector.getWallets();
  const remoteWallets = walletList.filter(isWalletInfoRemote);
  const embededWallet = walletList
    .filter(isWalletInfoInjected)
    .find((wallet) => wallet.embedded);

  return { walletList, embededWallet, remoteWallets };
};
