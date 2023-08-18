import type { Chain } from "@thirdweb-dev/chains";

export default {
    name: "The Open Network",
    chain: "TON", // ? https://ton.org/brand-assets
    icon: {
      url: "https://assets.coingecko.com/coins/images/17980/small/ton_symbol.png?1670498136",
      height: 512,
      width: 512,
      format: "png",
    },
    rpc: [
        "https://ton.access.orbs.network/44A1c0ff5Bd3F8B62C092Ab4D238bEE463E644A1/1/mainnet/toncenter-api-v2/jsonRPC"
    ],
    faucets: [],
    nativeCurrency: {
      name: "TonCoin", // ? https://ton.org/brand-assets
      symbol: "TON",
      decimals: 5,
    },
    infoURL: "https://ton.org/",
    shortName: "ton",
    chainId: -239,
    networkId: -239,
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
  } as const as Chain;
  
  