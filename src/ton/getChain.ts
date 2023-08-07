import { Chain } from "@thirdweb-dev/chains/src";
import { getHttpEndpoint } from "@orbs-network/ton-access";

// ? Reference: https://answers.ton.org/question/1531858803501305856/how-do-i-get-an-rpc-endpoint-for-ton?sortby=newest
const getRPC = async (): Promise<string> => {
  return await getHttpEndpoint();
};

const TONChain = {
  name: "The Open Network",
  chain: "TON", // https://ton.org/brand-assets
  icon: {
    url: "https://assets.coingecko.com/coins/images/17980/small/ton_symbol.png?1670498136",
    height: 512,
    width: 512,
    format: "png",
  },
  rpc: [
    // ! this will be added dynamically
    // ! we should be able to use this url to initalize a ton sdk/provider afterwards
    "",
  ],
  faucets: [],
  nativeCurrency: {
    name: "TonCoin", // https://ton.org/brand-assets
    symbol: "TON",
    decimals: 5,
  },
  infoURL: "https://ton.org/",
  shortName: "ton",
  chainId: 88705, // custom
  networkId: 88705, // custom
  explorers: [
    {
      name: "tonscan",
      url: "https://tonscan.org/",
      /**
       * ? References:
       * 1. https://docs.ton.org/develop/howto/subresolvers
       * 2. https://github.com/ton-blockchain/TEPs/blob/master/text/0081-dns-standard.md
       * 3. https://eips.ethereum.org/EIPS/eip-137
       */
      standard: "TEP0081",
    },
  ],
  testnet: false,
  slug: "ton", // https://ton.org/brand-assets
};

export const getTONChain = () => {
  return getRPC()
    .then((rpcEndpoint) => {
      const TonChainWithRPC = { ...TONChain, rpc: [rpcEndpoint] };
      return TonChainWithRPC as Chain;
    })
    .catch((err) => {
      return TONChain as Chain;
    });
};
