import { ethers } from "ethers";
import TokenABI from "../abi/FaucetToken.json";
import FaucetABI from "../abi/TokenFaucet.json";

const TOKEN_ADDRESS = import.meta.env.VITE_TOKEN_ADDRESS;
const FAUCET_ADDRESS = import.meta.env.VITE_FAUCET_ADDRESS;
const RPC_URL = import.meta.env.VITE_RPC_URL;

/* =========================
   PROVIDERS
========================= */

// READ-ONLY provider (works in Docker)
function getRpcProvider() {
  if (!RPC_URL) {
    throw new Error("VITE_RPC_URL not set");
  }
  return new ethers.JsonRpcProvider(RPC_URL);
}

// WALLET provider (MetaMask)
function getBrowserProvider() {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }
  return new ethers.BrowserProvider(window.ethereum);
}

async function getSigner() {
  const provider = getBrowserProvider();
  return await provider.getSigner();
}

/* =========================
   CONTRACTS
========================= */

// READ token (balanceOf etc.)
export function getTokenReadContract() {
  return new ethers.Contract(
    TOKEN_ADDRESS,
    TokenABI.abi,
    getRpcProvider()
  );
}

// WRITE faucet (requestTokens)
export async function getFaucetWriteContract() {
  const signer = await getSigner();
  return new ethers.Contract(
    FAUCET_ADDRESS,
    FaucetABI.abi,
    signer
  );
}

/* =========================
   READ FUNCTIONS
========================= */

export async function getTokenBalance(address) {
  const token = getTokenReadContract();
  return (await token.balanceOf(address)).toString();
}

export async function canClaim(address) {
  const faucet = new ethers.Contract(
    FAUCET_ADDRESS,
    FaucetABI.abi,
    getRpcProvider()
  );
  return await faucet.canClaim(address);
}

export async function getRemainingAllowance(address) {
  const faucet = new ethers.Contract(
    FAUCET_ADDRESS,
    FaucetABI.abi,
    getRpcProvider()
  );
  return (await faucet.remainingAllowance(address)).toString();
}

/* =========================
   WRITE FUNCTION
========================= */

export async function requestTokens() {
  try {
    const faucet = await getFaucetWriteContract();
    console.log("Requesting tokens from:", FAUCET_ADDRESS);
    const tx = await faucet.requestTokens({ gasLimit: 500000 });
    console.log("Transaction sent:", tx.hash);
    await tx.wait();
    console.log("Transaction mined");
    return tx.hash;
  } catch (error) {
    console.error("requestTokens error:", error);
    throw error;
  }
}

/* =========================
   WALLET
========================= */

export async function connectWallet() {
  const provider = getBrowserProvider();
  const accounts = await provider.send("eth_requestAccounts", []);
  return accounts[0];
}

/* =========================
   ADDRESSES
========================= */

export function getContractAddresses() {
  return {
    token: TOKEN_ADDRESS,
    faucet: FAUCET_ADDRESS,
  };
}
