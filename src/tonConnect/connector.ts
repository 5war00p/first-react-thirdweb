import TonConnect, {
  WalletInfoRemote,
  isWalletInfoInjected,
  isWalletInfoRemote,
} from "@tonconnect/sdk";

export const connector = new TonConnect({
  manifestUrl:
    "https://first-react-thirdweb.vercel.app/tonconnect-manifest.json",
});

export const getWalletList = async () => {
  const walletList = await connector.getWallets();
  const remoteWallets = walletList.filter(isWalletInfoRemote);
  const embededWallet = walletList
    .filter(isWalletInfoInjected)
    .find((wallet) => wallet.embedded);

  return { walletList, embededWallet, remoteWallets };
};

export const getUniversalLink = async () => {
  if (connector) {
    const { walletList } = await getWalletList();

    const tonkeeperConnectionSource = {
      universalLink: (walletList[0] as WalletInfoRemote)
        ?.universalLink as string,
      bridgeUrl: (walletList[0] as WalletInfoRemote)?.bridgeUrl as string,
    };

    const universalLink = connector.connect(tonkeeperConnectionSource);

    return universalLink;
  }

  return "";
};
