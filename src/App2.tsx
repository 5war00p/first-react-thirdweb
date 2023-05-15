import { ConnectWallet } from "@thirdweb-dev/react";
import "./styles/Home.css";
import { useBatchBalance } from "./hooks/useBatchBalance";
import { TOKEN_ADDRESSES } from "./constants/erc20TokenAddresses";

export default function Home() {

  useBatchBalance(TOKEN_ADDRESSES.slice(0,5))

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

        {/* {
          isLoading ? (
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
                data?.map((each) => {
                  return (
                    <div key={each?.symbol.toLowerCase()} className="card" style={{ width: '480px', height: '160px'}}>
                      <p className="description">{each?.name} ({each?.symbol})</p><br/>
                      <p className="code">{each?.displayValue}</p>
                    </div>
                  )
                })
              }
            </div>
          )
        } */}
      </main>
    </div>
  );
}
