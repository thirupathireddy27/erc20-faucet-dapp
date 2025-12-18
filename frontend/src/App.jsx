import { useState } from "react";
import { ethers } from "ethers";
import { getTokenContract, getFaucetContract } from "./utils/contracts";

function App() {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState("0");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function connectWallet() {
    try {
      setError("");
      setMessage("");

      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const userAddress = accounts[0];

      setAddress(userAddress);

      const token = await getTokenContract();
      const bal = await token.balanceOf(userAddress);
      setBalance(ethers.formatEther(bal));
    } catch (err) {
      setError(err.message);
    }
  }

  async function claimTokens() {
    try {
      setError("");
      setMessage("Claiming tokens...");

      const faucet = await getFaucetContract();
      const tx = await faucet.requestTokens();
      await tx.wait();

      const token = await getTokenContract();
      const bal = await token.balanceOf(address);
      setBalance(ethers.formatEther(bal));

      setMessage("Tokens claimed successfully ✅");
    } catch (err) {
      setMessage("");
      setError(err.reason || err.message);
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
