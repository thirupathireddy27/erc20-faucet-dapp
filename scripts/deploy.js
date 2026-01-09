const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(
    "Account balance:",
    hre.ethers.formatEther(balance),
    "ETH"
  );

  // ─────────────────────────────
  // Deploy ERC20 Token
  // ─────────────────────────────
  const Token = await hre.ethers.getContractFactory("FaucetToken");

  const token = await Token.deploy();
  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  console.log("Token deployed to:", tokenAddress);

  // ─────────────────────────────
  // Deploy Faucet
  // ─────────────────────────────
  const Faucet = await hre.ethers.getContractFactory("TokenFaucet");

  const faucet = await Faucet.deploy(tokenAddress);
  await faucet.waitForDeployment();

  const faucetAddress = await faucet.getAddress();
  console.log("Faucet deployed to:", faucetAddress);

  // ─────────────────────────────
  // Set faucet in token (CRITICAL)
  // ─────────────────────────────
  const tx = await token.setFaucet(faucetAddress);
  await tx.wait();

  console.log("Faucet authorized to mint tokens ✅");

  // ─────────────────────────────
  // Save to Frontend
  // ─────────────────────────────
  const fs = require("fs");
  const path = require("path");

  const envPath = path.join(__dirname, "../frontend/.env");
  const envContent = `VITE_RPC_URL=http://localhost:8545\nVITE_TOKEN_ADDRESS=${tokenAddress}\nVITE_FAUCET_ADDRESS=${faucetAddress}`;
  fs.writeFileSync(envPath, envContent);
  console.log("Saved addresses to frontend/.env");

  // Copy ABIs
  const artifactsDir = path.join(__dirname, "../artifacts/contracts");
  const frontendAbiDir = path.join(__dirname, "../frontend/src/abi");

  if (!fs.existsSync(frontendAbiDir)) {
    fs.mkdirSync(frontendAbiDir, { recursive: true });
  }

  const tokenArtifact = JSON.parse(fs.readFileSync(path.join(artifactsDir, "Token.sol/FaucetToken.json")));
  const faucetArtifact = JSON.parse(fs.readFileSync(path.join(artifactsDir, "TokenFaucet.sol/TokenFaucet.json")));

  fs.writeFileSync(path.join(frontendAbiDir, "FaucetToken.json"), JSON.stringify(tokenArtifact, null, 2));
  fs.writeFileSync(path.join(frontendAbiDir, "TokenFaucet.json"), JSON.stringify(faucetArtifact, null, 2));
  console.log("Copied ABIs to frontend/src/abi");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
