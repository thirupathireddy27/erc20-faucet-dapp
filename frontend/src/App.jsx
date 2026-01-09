import { useState } from "react";
import { ethers } from "ethers";
import {
  connectWallet as connect,
  requestTokens,
  getTokenBalance
} from "./utils/contracts";
import { canClaim } from "./utils/contracts";

function App() {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState("0");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function connectWallet() {
    try {
      setError("");
      setMessage("");

      const userAddress = await connect();
      setAddress(userAddress);

      const bal = await getTokenBalance(userAddress);
      setBalance(ethers.formatEther(bal));
    } catch (err) {
      setError(err.message);
    }
  }

  async function claimTokens() {
    try {
      setError("");
      setMessage("");

      const eligible = await canClaim(address);
      if (!eligible) {
        setError("Cooldown period not elapsed ⏳");
        return;
      }

      setMessage("Claiming tokens...");
      await requestTokens();

      const bal = await getTokenBalance(address);
      setBalance(ethers.formatEther(bal));

      setMessage("Tokens claimed successfully ✅");
    } catch (err) {
      setMessage("");
      setError(err.reason || "Transaction failed");
    }
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>ERC-20 Faucet DApp</h1>

      {!address ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p><strong>Connected:</strong> {address}</p>
          <p><strong>Token Balance:</strong> {balance}</p>
          <button onClick={claimTokens}>Claim Tokens</button>
        </>
      )}

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;
