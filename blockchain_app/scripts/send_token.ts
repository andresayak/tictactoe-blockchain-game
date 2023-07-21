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
      name: 'tokenAddress',
      message: 'What is token address?'
    },
    {
      type: 'text',
      name: 'amount',
      message: 'What is amount?'
    },
    {
      type: 'text',
      name: 'recipient',
      message: 'Why recipient?'
    }
  ];

  const response = await prompts(questions);

  const contractName = "TestToken";

  const tokenContract = await ethers.getContractAt(contractName, response.tokenAddress);
  console.log('tokenSymbol');
  const tokenSymbol = await tokenContract.symbol();

  console.log('response', response);
  const amount = ethers.utils.parseUnits(response.amount, 18);
  const recipient = response.recipient;


  await new Promise(done => {
    new Confirm(`Transfer ${amount} to ${recipient}?`)
      .ask(async (answer: string) => {
        if (answer) {
          const tx = await tokenContract.transfer(recipient, amount, {
            gasLimit: 300000
          });
          console.log(`Transfer tx ${tx.hash}`);
          await tx.wait();
          console.log("Done!");
        }
        done(answer);
      });
  });


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
