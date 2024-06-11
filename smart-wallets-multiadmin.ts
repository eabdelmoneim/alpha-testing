
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
console.log("connected smart Account without override: " + smartAccount.address);

// get AccountFactory contract
const contract = getContract({
  client,
  chain: arbitrumSepolia,
  address: "0xCE7Ca70f626730B4E2E1BC56B55fc5347a9e8235",
});

// query Account Factory for all the smart accounts that have the wallet as a signer
const addresses = await getAccountsOfSigner({
  contract: contract,
  signer: eoaAccount.address,
});

console.log("signer accounts addresses: " + addresses);

// connect to the first smart account in the list by passing in an override for the account address
// if no override is passed, the smart account that will be connected will be the deterministic default for that signer
const wallet2 = smartWallet({
  factoryAddress: "0xCE7Ca70f626730B4E2E1BC56B55fc5347a9e8235",
  chain: arbitrumSepolia,
  gasless: true,
  overrides: {
    accountAddress: addresses[0] as string
  }
});

const eoaAccount2 = privateKeyToAccount({
  client,
  privateKey: process.env.THIRDWEB_ADMIN_PRIVATE_KEY2 as string,
});

const addresses2 = await getAccountsOfSigner({
  contract: contract,
  signer: eoaAccount2.address,
});
console.log("signer accounts addresses: " + addresses2);

const smartAccount2 = await wallet2.connect({
  client,
  personalAccount: eoaAccount2,
});

console.log("connected to 2nd smart Account with override: " + smartAccount2.address);

}
run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
