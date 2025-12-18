const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC20 Faucet DApp", function () {
  const FAUCET_AMOUNT = ethers.parseEther("100");
  
  async function deployFixture() {
    const [admin, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("FaucetToken");
    const token = await Token.deploy("FaucetToken", "FCT");

    const Faucet = await ethers.getContractFactory("TokenFaucet");
    const faucet = await Faucet.deploy(await token.getAddress());

    await token.setFaucet(await faucet.getAddress());

    return { token, faucet, admin, user };
  }

  it("allows user to claim tokens", async () => {
    const { token, faucet, user } = await deployFixture();

    await faucet.connect(user).requestTokens();
    expect(await token.balanceOf(user.address)).to.equal(FAUCET_AMOUNT);
  });

  it("reverts during cooldown", async () => {
    const { faucet, user } = await deployFixture();

    await faucet.connect(user).requestTokens();
    await expect(
      faucet.connect(user).requestTokens()
    ).to.be.revertedWith("Cooldown period not elapsed");
  });

  it("admin can pause faucet", async () => {
    const { faucet, admin, user } = await deployFixture();

    await faucet.connect(admin).setPaused(true);
    await expect(
      faucet.connect(user).requestTokens()
    ).to.be.revertedWith("Faucet is paused");
  });
});
