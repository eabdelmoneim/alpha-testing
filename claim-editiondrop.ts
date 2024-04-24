
import { createThirdwebClient, getContract, sendTransaction } from "thirdweb";
import {claimTo} from "thirdweb/extensions/erc1155";
import {sepolia} from "thirdweb/chains";
import dotenv from "dotenv";
import { privateKeyToAccount, getWalletBalance } from 'thirdweb/wallets';

dotenv.config();


const run = async () => {

// connect to the SDK with the wallet using the relayer URL for the Mumbai testnet
const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY as string,
});

const account = privateKeyToAccount({
  client,
  privateKey: process.env.THIRDWEB_ADMIN_PRIVATE_KEY as string,
});

const contract = getContract({
  client, 
  address: "0x619fF938Dd07603e7CFd6DC5B2e186460ddd01BF",
  chain: sepolia,
});

const transaction = claimTo({
  contract,
  to: "0x749CaA9A7bbF7D5aEb8Ea6E92335AFa2f74dE4EE",
  tokenId: BigInt(0),
  quantity: BigInt(1),
});

const txResult = await sendTransaction({
  transaction,
  account,
});

console.log(txResult);

}
run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
