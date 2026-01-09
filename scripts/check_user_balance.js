const hre = require("hardhat");

async function main() {
    const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const userAddress = "0xa35d07a2c5912d65a67213577e6ba58f22eb99f1";

    try {
        const token = await hre.ethers.getContractAt("FaucetToken", tokenAddress);
        const balance = await token.balanceOf(userAddress);
        console.log(`User Balance: ${hre.ethers.formatEther(balance)}`);
    } catch (error) {
        console.error("Error checking balance:", error);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
