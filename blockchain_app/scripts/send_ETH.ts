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

  const value = ethers.utils.parseEther(response.amount);
  const recipient:string = response.recipient;

  await new Promise(done => {
    new Confirm(`Transfer ${value} ETH to ${recipient}?`)
      .ask(async (answer: string) => {
        if (answer) {
          const tx = await owner.sendTransaction({
            to: recipient,
            value
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
