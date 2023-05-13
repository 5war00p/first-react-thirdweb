import { ConnectWallet, ThirdwebNftMedia, Web3Button, useContract, useMintNFT, useNFTs, useConnectionStatus, useAddress } from "@thirdweb-dev/react";
import { faker } from '@faker-js/faker';
import "./styles/Home.css";

const contractAddress = '0x3a40312a1c376aecf855ef784371d1fb1aa2d25d'

export default function Home() {

  const { contract } = useContract(contractAddress)
  const { data: nfts, isFetching, isLoading, isError } = useNFTs(contract)
  const { mutateAsync: mintNFT } = useMintNFT(contract)
  const walletConnectStatus = useConnectionStatus()
  const walletAddress = useAddress()

  return (
    <div className="container">
      <main className="main">
        <h1 className="title">
          Welcome to <a href="https://portal.thirdweb.com/react">first-react-thirdweb</a>!
        </h1>

        <p className="description">
          This a test app which mints an NFT collection called Introducing World App{" "}
          from <a href='https://mint.fun/'>mint.fun</a>
        </p>

        <div className="connect">
          <ConnectWallet dropdownPosition={{ side: 'bottom', align: 'center' }} />
        </div>


        {
          walletAddress && walletConnectStatus === 'connected' ? (
            <Web3Button
              contractAddress={contractAddress}
              action={() => {
                mintNFT({
                  metadata: {
                    name: faker.random.word(),
                    description: faker.random.words(),
                    image: faker.image.avatar()
                  },
                  to: walletAddress
                })
              }}
            >
              Claim Mint
            </Web3Button>
          ) : null
        }

        {
          isLoading && isFetching ? (
            <div className="card">
              <p className="description">
                Loading...
              </p>
            </div>
          ) : isError ? (
            <div className="card">
              <p className="code">
                Error occurred
              </p>
            </div>
          ) : (
            <div className="grid">
              {
                nfts?.map(nft => {
                  return (
                    <div>
                      <p>{nft.metadata.name}</p>
                      <ThirdwebNftMedia 
                        key={nft.metadata.id}
                        metadata={nft.metadata}
                        height="200px"
                      />
                    </div>
                  )
                })
              }
            </div>
          )
        }
      </main>
    </div>
  );
}
