
import { createThirdwebClient,getContract,sendTransaction } from "thirdweb";
import dotenv from "dotenv";
import { privateKeyToAccount, smartWallet } from 'thirdweb/wallets';
import { getAccountsOfSigner } from "thirdweb/extensions/erc4337";
import { arbitrumSepolia } from 'thirdweb/chains';

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
  factoryAddress: "0xCE7Ca70f626730B4E2E1BC56B55fc5347a9e8235",
  chain: arbitrumSepolia,
  gasless: true,
});

const smartAccount = await wallet.connect({
  client,
  personalAccount: eoaAccount,
});
console.log("connected smart Account: " + smartAccount.address);

const contract = getContract({
  client,
  chain: arbitrumSepolia,
  address: "0xCE7Ca70f626730B4E2E1BC56B55fc5347a9e8235",
});

const addresses = await getAccountsOfSigner({
  contract: contract,
  signer: eoaAccount.address,
});

console.log("addresses: " + addresses);

console.log("will connect smart account: " + addresses[0]);
const wallet2 = smartWallet({
  factoryAddress: "0xCE7Ca70f626730B4E2E1BC56B55fc5347a9e8235",
  chain: arbitrumSepolia,
  gasless: true,
  overrides: {
    accountAddress: addresses[0] as string
  }
});

const smartAccount2 = await wallet2.connect({
  client,
  personalAccount: eoaAccount,
});

console.log("connected to 2nd smart Account: " + smartAccount2.address);

}
run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
