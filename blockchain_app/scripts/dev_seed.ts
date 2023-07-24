import { ethers } from "hardhat";
// @ts-ignore
import Confirm from "prompt-confirm";
import prompts, { PromptObject } from "prompts";

async function main() {

  const [owner] = await ethers.getSigners();
  console.log('Account: '+owner.address);
  console.log('ETH Balance: '+ethers.utils.formatEther(await owner.getBalance()));

  const questions: PromptObject[] = [
    {
      type: 'text',
      name: 'recipient',
      message: 'Why recipient?'
    }
  ];

  const response = await prompts(questions);

  const FactoryContract = await ethers.getContractFactory('Factory');
  const factoryContract = await FactoryContract.deploy(owner.address, 2);
  await factoryContract.deployed();
  console.log(
    `Deployed Factory to ${factoryContract.address}`,
  );

  const TestTokenContract = await ethers.getContractFactory('TestToken');
  const tokenContract = await TestTokenContract
    .deploy('Test Token AAA', 'AAA', ethers.utils.parseUnits('1000000', 18));
  await tokenContract.deployed();
  console.log(
    `Deployed TestToken to ${tokenContract.address}`,
  );

  const recipient = response.recipient;

  const txEth = await owner.sendTransaction({
    to: recipient,
    value: ethers.utils.parseEther('10')
  });
  console.log(`Transfer ETH tx ${txEth.hash}`);

  const txTokens = await tokenContract.transfer(recipient, ethers.utils.parseUnits('1000', 18), {
    gasLimit: 300000
  });
  console.log(`Transfer Tokens tx ${txTokens.hash}`);
  await txTokens.wait();
  console.log("Done!");

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
