# ERC-20 Faucet DApp 🚰

A complete **ERC-20 Faucet Decentralized Application** built using  
**Solidity + Hardhat + React (Vite) + Ethers.js**, deployed on **Ethereum Sepolia Testnet**.

## ✨ Features
- Connect MetaMask wallet
- Claim ERC-20 tokens from a faucet
- View token balance
- Enforced cooldown & lifetime limits

---

## 🔗 Live Network
- **Ethereum Sepolia Testnet**

---

## 📦 Tech Stack

### Smart Contracts
- Solidity ^0.8.20
- OpenZeppelin ERC20
- Hardhat
- Ethers.js

### Frontend
- React (Vite)
- Ethers.js
- MetaMask

---

## 📁 Project Structure

```text
ERC20-FAUCET-DAPP/
│
├── contracts/
│   ├── Token.sol
│   └── TokenFaucet.sol
│
├── scripts/
│   └── deploy.js
│
├── test/
│   └── TokenFaucet.test.js
│
├── frontend/
│   ├── src/
│   │   ├── abi/
│   │   │   ├── FaucetToken.json
│   │   │   └── TokenFaucet.json
│   │   ├── utils/
│   │   │   └── contracts.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   └── package.json
│
├── hardhat.config.js
├── package.json
└── README.md
---

## 🚀 Deployed Contracts (Sepolia)

| Contract | Address |
|--------|---------|
| FaucetToken | `0x10a619Ca52C84Af1F1F48733594311a71F9c8497` |
| TokenFaucet | `0xf5da04643556eb8642e81DD2034afe54449D10C5` |

---

## 🛠️ Setup Instructions

### 1️⃣ Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/erc20-faucet-dapp.git
cd erc20-faucet-dapp

🛠️ Backend Setup
2️⃣ Install Backend Dependencies
npm install

3️⃣ Create .env File (DO NOT COMMIT)
SEPOLIA_RPC_URL=YOUR_INFURA_OR_ALCHEMY_URL
PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY

🧪 Compile & Test Smart Contracts
npx hardhat compile
npx hardhat test

🚀 Deploy Contracts to Sepolia
npx hardhat run scripts/deploy.js --network sepolia

🎨 Frontend Setup
cd frontend
npm install
npm run dev


Open in browser:

http://localhost:5173

🦊 MetaMask Requirements

Network: Ethereum Sepolia

Wallet funded with Sepolia ETH

Token & Faucet ABIs placed in frontend/src/abi