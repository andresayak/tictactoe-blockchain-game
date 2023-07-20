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
      name: 'name',
      message: 'What is token name?'
    },
    {
      type: 'text',
      name: 'symbol',
      message: 'What is token symbol?'
    },
    {
      type: 'text',
      name: 'totalSupply',
      message: 'What is token total total supply?'
    }
  ];

  const {name, symbol, totalSupply} = await prompts(questions);

  const contractName = "TestToken";
  const totalSupplyBN = ethers.utils.parseUnits(totalSupply, 18);
  await new Promise(done => {
    new Confirm(`Deploy ` + contractName + ` with (name=${name}, symbol=${symbol}, totalSupply=${totalSupply} )?`)
      .ask(async (answer: any) => {
        if (answer) {
          const Contract = await ethers.getContractFactory(contractName);
          const contract = await Contract.deploy(name, symbol, totalSupplyBN);
          await contract.deployed();
          console.log(
            `Deployed ${contractName} to ${contract.address}`,
          );
        }
        done(true);
      });
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
