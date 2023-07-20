import { ethers } from "hardhat";
// @ts-ignore
import Confirm from "prompt-confirm";

async function main() {

  const [owner] = await ethers.getSigners();
  console.log('Account: '+owner.address);
  console.log('ETH Balance: '+ethers.utils.formatEther(await owner.getBalance()));

  const contractName = "Factory";
  await new Promise(done => {
    new Confirm("Deploy " + contractName + "?")
      .ask(async (answer: any) => {
        if (answer) {
          const Contract = await ethers.getContractFactory(contractName);
          const contract = await Contract.deploy();
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
