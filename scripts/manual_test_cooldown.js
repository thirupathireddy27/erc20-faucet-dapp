const hre = require("hardhat");

async function main() {
    console.log("Starting manual test...");

    const [admin, user] = await hre.ethers.getSigners();

    // Deploy Token
    const Token = await hre.ethers.getContractFactory("FaucetToken");
    const token = await Token.deploy();
    await token.waitForDeployment();
    const tokenAddr = await token.getAddress();

    // Deploy Faucet
    const Faucet = await hre.ethers.getContractFactory("TokenFaucet");
    const faucet = await Faucet.deploy(tokenAddr);
    await faucet.waitForDeployment();
    const faucetAddr = await faucet.getAddress();

    // Set Faucet
    await token.setFaucet(faucetAddr);
    console.log("Setup complete. Token:", tokenAddr, "Faucet:", faucetAddr);

    // 1st Request
    console.log("Requesting tokens 1st time...");
    await faucet.connect(user).requestTokens();
    console.log("1st request successful.");

    // 2nd Request (Expect Revert)
    console.log("Requesting tokens 2nd time...");
    try {
        await faucet.connect(user).requestTokens();
        console.error("ERROR: 2nd request did NOT revert!");
        process.exit(1);
    } catch (error) {
        if (error.message.includes("Cooldown period not elapsed")) {
            console.log("SUCCESS: Reverted with correct message.");
        } else {
            console.error("ERROR: Reverted with WRONG message or error.");
            console.error(error);
            process.exit(1);
        }
    }
}

main().catch((error) => {
    console.error("Fatal Error:");
    console.error(error);
    process.exitCode = 1;
});
