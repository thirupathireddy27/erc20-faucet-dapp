import { ethers } from "ethers";
import TokenABI from "../abi/FaucetToken.json";
import FaucetABI from "../abi/TokenFaucet.json";

const TOKEN_ADDRESS = import.meta.env.VITE_TOKEN_ADDRESS;
const FAUCET_ADDRESS = import.meta.env.VITE_FAUCET_ADDRESS;

export async function getProvider() {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }
  return new ethers.BrowserProvider(window.ethereum);
}

export async function getSigner() {
  const provider = await getProvider();
  return provider.getSigner();
}

export async function getTokenContract() {
  const signer = await getSigner();
  return new ethers.Contract(
    TOKEN_ADDRESS,
    TokenABI.abi,
    signer
  );
}

export async function getFaucetContract() {
  const signer = await getSigner();
  return new ethers.Contract(
    FAUCET_ADDRESS,
    FaucetABI.abi,
    signer
  );
}
