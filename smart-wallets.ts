
import { createThirdwebClient,getContract,sendTransaction } from "thirdweb";
import dotenv from "dotenv";
import { privateKeyToAccount, smartWallet } from 'thirdweb/wallets';
import { addSessionKey } from "thirdweb/extensions/erc4337";
import { base } from 'thirdweb/chains';

dotenv.config();


const run = async () => {

// connect to the SDK with the wallet using the relayer URL for the Mumbai testnet
const client = createThirdwebClient({
  secretKey: process.env.MAINNET_THIRDWEB_SECRET_KEY as string,
});

const eoaAccount = privateKeyToAccount({
  client,
  privateKey: process.env.MAINNET_THIRDWEB_ADMIN_PRIVATE_KEY as string,
});


const wallet = smartWallet({
  factoryAddress: "0x2767F0168EcAe8e46e6C0D963Bc3774844d7EA89",
  chain: base,
  gasless: true,
});

const smartAccount = await wallet.connect({
  client,
  personalAccount: eoaAccount,
});
console.log("connected smart Account: " + smartAccount.address);

const contract = await getContract({
  client,
  chain: base,
  address: smartAccount.address,
});

console.log("got contract: " + contract.address);

const transaction = addSessionKey({
  contract,
  account: smartAccount,
  sessionKeyAddress: "0x66Cac9d8d0343e87c8b1c2eab4eE5876937d73C6",
  permissions: {
    approvedTargets: [],
    permissionStartTimestamp: new Date(),
    permissionEndTimestamp: new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 365,
    ), // 1 year from now
  },
});

const tx = await sendTransaction({ transaction, account: smartAccount }); // if gasless=false then the account tx is being sent from must have funds to pay for the gas so use eoaAccount, if gasless=true then the smartAccount can be used
console.log("added session key: " + tx.transactionHash);
}
run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
