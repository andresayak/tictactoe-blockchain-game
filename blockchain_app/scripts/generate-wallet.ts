import * as Wallet from 'ethereumjs-wallet';

async function main() {
    const EthWallet = Wallet.default.generate();
    const privateKey = EthWallet.getPrivateKeyString();
    console.log("address: " + EthWallet.getAddressString());
    console.log("privateKey: " + privateKey);
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

