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

  const token = await Token.deploy(
    "Faucet Token",   // token name
    "FAU"             // token symbol
  );
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
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
