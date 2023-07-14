import { FC } from "react";
import "./styles/Home.css";
import { ConnectWallet } from "@thirdweb-dev/react";
const Home: FC = () => {
  return (
    <div className="container">
      <main className="main">
        <h1 className="title">
          Welcome to{" "}
          <a href="https://portal.thirdweb.com/react">test-react-thirdweb</a>!
        </h1>

        <p className="description">This a test app to add TON chain</p>

        <div className="connect">
          <ConnectWallet
            dropdownPosition={{ side: "bottom", align: "center" }}
          />
        </div>
      </main>
    </div>
  );
};

export default Home;
