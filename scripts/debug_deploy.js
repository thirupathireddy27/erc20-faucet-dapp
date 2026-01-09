const hre = require("hardhat");

async function main() {
    console.log("Starting debug deployment...");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deployer:", deployer.address);

    // Deploy Token
    console.log("Deploying Token...");
    const Token = await hre.ethers.getContractFactory("FaucetToken");
    const token = await Token.deploy();
    await token.waitForDeployment();
    const tokenAddr = await token.getAddress();
    console.log("Token deployed at:", tokenAddr);

    if (!tokenAddr) throw new Error("Token address is null!");

    // Deploy Faucet
    console.log("Deploying Faucet...");
    const Faucet = await hre.ethers.getContractFactory("TokenFaucet");
    const faucet = await Faucet.deploy(tokenAddr);
    await faucet.waitForDeployment();
    const faucetAddr = await faucet.getAddress();
    console.log("Faucet deployed at:", faucetAddr);

    if (!faucetAddr) throw new Error("Faucet address is null!");

    // Set Faucet
    console.log("Setting faucet in Token...");
    const tx = await token.setFaucet(faucetAddr);
    await tx.wait();
    console.log("Faucet set successfully.");

    console.log("Debug deployment complete!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
