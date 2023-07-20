import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

describe("TickTacToe", function() {

  async function deployFixture() {
    const [owner, user1, user2] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("Factory");
    const factoryContract = await Factory.deploy();

    const coins = 10;
    const TestToken = await ethers.getContractFactory("TestToken");
    const tokenContract = await TestToken.deploy("Test Token", "AAA", BigNumber.from(100));
    await tokenContract.transfer(user1.address, coins);
    await tokenContract.transfer(user2.address, coins);
    await tokenContract.connect(user1).approve(factoryContract.address, coins);
    const createGameTx = await factoryContract.connect(user1)
      .createGame(120, tokenContract.address, coins, 100);
    const createGameReceipt = await createGameTx.wait();

    const event = createGameReceipt.events?.find(event => event.event == "GameCreated");
    expect(event).to.not.false;
    const gameContract = await ethers.getContractAt("TicTacToeERC20", event?.args?.game);
    return { tokenContract, gameContract, coins };
  }

  describe("Deployment", function() {
    it("Should set the right unlockTime", async function() {
      const [owner, user1, user2] = await ethers.getSigners();
      const { tokenContract, gameContract, coins } = await loadFixture(deployFixture);

      expect(await tokenContract.balanceOf(gameContract.address)).to.equal(coins);

      await tokenContract.connect(user2).approve(gameContract.address, 10);
      await gameContract.connect(user2).start();
      await expect(gameContract.connect(user2).start()).to.revertedWith("Game has started");

      expect(await tokenContract.balanceOf(gameContract.address)).to.equal(coins * 2);
      expect(await gameContract.status()).to.equal(1);
      expect(await gameContract.player1()).to.equal(user1.address);
      expect(await gameContract.player2()).to.equal(user2.address);
      expect(await gameContract.currentTurn()).to.equal(1);
      expect(await gameContract.turnNumber()).to.equal(0);

      await gameContract.connect(user1).step(0, 0);
      expect(await gameContract.currentTurn()).to.equal(2);
      expect(await gameContract.turnNumber()).to.equal(1);

      await expect(gameContract.connect(user2).step(0, 0)).to.revertedWith("Cell already occupied");
      await gameContract.connect(user2).step(0, 1);
      expect(await gameContract.currentTurn()).to.equal(1);
      expect(await gameContract.turnNumber()).to.equal(2);

      await gameContract.connect(user1).step(1, 1);
      expect(await gameContract.currentTurn()).to.equal(2);
      expect(await gameContract.turnNumber()).to.equal(3);

      await gameContract.connect(user2).step(1, 0);
      expect(await gameContract.currentTurn()).to.equal(1);
      expect(await gameContract.turnNumber()).to.equal(4);

      await gameContract.connect(user1).step(2, 2);
      expect(await gameContract.currentTurn()).to.equal(1);
      expect(await gameContract.status()).to.equal(2);
      expect(await gameContract.winner()).to.equal(1);
      expect(await tokenContract.balanceOf(gameContract.address)).to.equal(0);
      expect(await tokenContract.balanceOf(user1.address)).to.equal(coins * 2);
      expect(await tokenContract.balanceOf(user2.address)).to.equal(0);
    });
  });
});
