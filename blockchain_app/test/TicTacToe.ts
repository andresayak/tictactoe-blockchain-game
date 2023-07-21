import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

const fee = 2;
describe("TickTacToe", function() {
  async function deployFixture(size: number) {
    const [owner, user1, user2, treasury] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("Factory");
    const factoryContract = await Factory.deploy(treasury.address, fee);

    const coins = BigNumber.from(100);
    const timeout = 120;
    const TestToken = await ethers.getContractFactory("TestToken");
    const tokenContract = await TestToken.deploy("Test Token", "AAA", BigNumber.from(10000));
    await tokenContract.transfer(user1.address, coins);
    await tokenContract.transfer(user2.address, coins);
    await tokenContract.connect(user1).approve(factoryContract.address, coins);
    const createGameTx = await factoryContract.connect(user1)
      .createGame(timeout, tokenContract.address, coins, size);
    const createGameReceipt = await createGameTx.wait();

    const event = createGameReceipt.events?.find(event => event.event == "GameCreated");
    expect(event).to.not.false;
    const gameContract = await ethers.getContractAt("TicTacToeERC20", event?.args?.game);
    return { tokenContract, gameContract, coins, timeout };
  }

  describe("Success cases", function() {
    it("should be correct balances after completion", async function() {
      const [owner, user1, user2, treasury] = await ethers.getSigners();
      const { tokenContract, gameContract, coins } = await deployFixture(100);

      expect(await tokenContract.balanceOf(gameContract.address)).to.equal(coins);

      await tokenContract.connect(user2).approve(gameContract.address, coins);
      await gameContract.connect(user2).start();
      expect(await gameContract.treasury()).to.equal(treasury.address);
      await expect(gameContract.connect(user2).start()).to.revertedWith("Game has started");

      expect(await tokenContract.balanceOf(gameContract.address)).to.equal(coins.mul(2));
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

      const feeBN = coins.mul(2).mul(fee).div(100);
      const amountAfterFee = coins.mul(2).sub(feeBN);
      expect(await tokenContract.balanceOf(user1.address)).to.equal(amountAfterFee);
      expect(await tokenContract.balanceOf(user2.address)).to.equal(0);
      expect(await tokenContract.balanceOf(treasury.address)).to.equal(feeBN);

    });

    it("game should be finished after timeout with correct balance", async function() {
      const [owner, user1, user2, treasury] = await ethers.getSigners();
      const { tokenContract, gameContract, coins, timeout } = await deployFixture(100);

      expect(await tokenContract.balanceOf(gameContract.address)).to.equal(coins);

      await tokenContract.connect(user2).approve(gameContract.address, coins);
      await gameContract.connect(user2).start();
      expect(await gameContract.treasury()).to.equal(treasury.address);

      await time.increase(timeout + 1);

      await gameContract.connect(user2).timeout();

      const feeBN = coins.mul(2).mul(fee).div(100);
      const amountAfterFee = coins.mul(2).sub(feeBN);

      expect(await tokenContract.balanceOf(user1.address)).to.equal(0);
      expect(await tokenContract.balanceOf(user2.address)).to.equal(amountAfterFee);
      expect(await tokenContract.balanceOf(treasury.address)).to.equal(feeBN);
    });

    it("nobody wins with correct balance", async function() {
      const [owner, user1, user2, treasury] = await ethers.getSigners();
      const { tokenContract, gameContract, coins, timeout } = await deployFixture(3);

      expect(await tokenContract.balanceOf(gameContract.address)).to.equal(coins);

      await tokenContract.connect(user2).approve(gameContract.address, coins);
      await gameContract.connect(user2).start();
      expect(await gameContract.treasury()).to.equal(treasury.address);

      await time.increase(timeout + 1);

      await gameContract.connect(user2).timeout();

      const feeBN = coins.mul(2).mul(fee).div(100);
      const amountAfterFee = coins.mul(2).sub(feeBN);

      expect(await tokenContract.balanceOf(user1.address)).to.equal(0);
      expect(await tokenContract.balanceOf(user2.address)).to.equal(amountAfterFee);
      expect(await tokenContract.balanceOf(treasury.address)).to.equal(feeBN);
    });

    it("the game should be finished after cancellation with correct balance", async function() {
      const [owner, user1, user2, treasury] = await ethers.getSigners();
      const { tokenContract, gameContract, coins, timeout } = await deployFixture(100);

      await gameContract.connect(user1).cancel();
      expect(await gameContract.status()).to.equal(3);

      expect(await tokenContract.balanceOf(user1.address)).to.equal(coins);
      expect(await tokenContract.balanceOf(user2.address)).to.equal(coins);
      expect(await tokenContract.balanceOf(treasury.address)).to.equal(0);

    });
  });

  describe("Fail cases", function() {
    it("only creator can cancel the game before starting", async function() {
      const [owner, user1, user2, treasury] = await ethers.getSigners();
      const { tokenContract, gameContract, coins, timeout } = await deployFixture(100);

      await expect(gameContract.connect(user2).cancel()).to.revertedWith('Only creator can cancel game');

    });

    it("creator can't cancel the game after starting", async function() {
      const [owner, user1, user2, treasury] = await ethers.getSigners();
      const { tokenContract, gameContract, coins, timeout } = await deployFixture(100);

      await tokenContract.connect(user2).approve(gameContract.address, coins);
      await gameContract.connect(user2).start();
      await expect(gameContract.connect(user1).cancel()).to.revertedWith('Game has started');

    });

    it("the game can only be started once", async function() {
      const [owner, user1, user2, treasury] = await ethers.getSigners();
      const { tokenContract, gameContract, coins, timeout } = await deployFixture(100);

      await tokenContract.connect(user2).approve(gameContract.address, coins);
      await gameContract.connect(user2).start();
      await expect(gameContract.connect(user2).start()).to.revertedWith("Game has started");
    });
  });
});
