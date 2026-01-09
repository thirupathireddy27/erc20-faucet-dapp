const hre = require("hardhat");

async function main() {
    console.log("Starting Full Verification...");

    const [admin, user] = await hre.ethers.getSigners();
    console.log("Admin:", admin.address);
    console.log("User:", user.address);

    // 1. Deploy
    console.log("\n[1] Deploying Contracts...");
    const Token = await hre.ethers.getContractFactory("FaucetToken");
    const token = await Token.deploy();
    await token.waitForDeployment();
    const tokenAddr = await token.getAddress();
    console.log("Token:", tokenAddr);

    const Faucet = await hre.ethers.getContractFactory("TokenFaucet");
    const faucet = await Faucet.deploy(tokenAddr);
    await faucet.waitForDeployment();
    const faucetAddr = await faucet.getAddress();
    console.log("Faucet:", faucetAddr);

    await token.setFaucet(faucetAddr);
    console.log("Faucet authorized.");

    // 2. Test Claim
    console.log("\n[2] Testing Claim...");
    const FAUCET_AMOUNT = hre.ethers.parseEther("100");
    await faucet.connect(user).requestTokens();
    const bal = await token.balanceOf(user.address);
    if (bal.toString() === FAUCET_AMOUNT.toString()) {
        console.log("SUCCESS: User received 100 tokens.");
    } else {
        throw new Error(`FAILURE: Balance mismatch. Expected 100, got ${hre.ethers.formatEther(bal)}`);
    }

    // 3. Test Cooldown
    console.log("\n[3] Testing Cooldown...");
    try {
        await faucet.connect(user).requestTokens();
        throw new Error("FAILURE: Cooldown did not revert!");
    } catch (e) {
        if (e.message.includes("Cooldown period not elapsed")) {
            console.log("SUCCESS: Reverted with cooldown error.");
        } else {
            throw new Error(`FAILURE: Wrong error message: ${e.message}`);
        }
    }

    // 4. Test Pause
    console.log("\n[4] Testing Pause...");
    await faucet.connect(admin).setPaused(true);
    try {
        // Switch to a new user to avoid cooldown error blocks
        const [_, __, user2] = await hre.ethers.getSigners();
        await faucet.connect(user2).requestTokens();
        throw new Error("FAILURE: Pause did not revert!");
    } catch (e) {
        if (e.message.includes("Faucet is paused")) {
            console.log("SUCCESS: Reverted with pause error.");
        } else {
            throw new Error(`FAILURE: Wrong error message: ${e.message}`);
        }
    }

    console.log("\n✅ ALL VERIFICATION STEPS PASSED!");
}

main().catch((error) => {
    console.error("\n❌ VERIFICATION FAILED");
    console.error(error);
    process.exitCode = 1;
});
