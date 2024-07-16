
import { createThirdwebClient,getContract,sendTransaction, waitForReceipt } from "thirdweb";
import dotenv from "dotenv";
import { privateKeyToAccount, smartWallet } from 'thirdweb/wallets';
import { addSessionKey } from "thirdweb/extensions/erc4337";
import { arbitrumSepolia, base } from 'thirdweb/chains';
import { claimTo } from "thirdweb/extensions/erc721";

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

const nftContract = getContract({
  client,
  chain: arbitrumSepolia,
  address: "0x9b04bECDD98e5f2FA0fBa2E902CC7f7c28776509",
});

  const tx = claimTo({
  contract: nftContract,
  from: smartAccount.address,
  to: eoaAccount.address,
  quantity: BigInt(1),
});

try {
  const results = await sendTransaction({
    transaction: tx,
    account: smartAccount,
  });

  console.log("Claimed NFT: " + results.transactionHash);
} catch (err) {
  console.error(err);
}
}
run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
