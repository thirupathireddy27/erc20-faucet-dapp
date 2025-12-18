import {
  connectWallet,
  requestTokens,
  getTokenBalance,
  canClaim,
  getRemainingAllowance,
  getContractAddresses
} from "./contracts";

window.__EVAL__ = {
  connectWallet: async () => {
    return await connectWallet(); // string address
  },

  requestTokens: async () => {
    const txHash = await requestTokens();
    return txHash; // string
  },

  getBalance: async (address) => {
    return await getTokenBalance(address); // string (base units)
  },

  canClaim: async (address) => {
    return await canClaim(address); // boolean
  },

  getRemainingAllowance: async (address) => {
    return await getRemainingAllowance(address); // string
  },

  getContractAddresses: async () => {
    return getContractAddresses(); // { token, faucet }
  }
};
