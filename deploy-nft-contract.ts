
import { createThirdwebClient, defineChain, getContract, hexToNumber, sendTransaction } from "thirdweb";
import {claimTo} from "thirdweb/extensions/erc1155";
import {sepolia} from "thirdweb/chains";
import dotenv from "dotenv";
import { privateKeyToAccount, getWalletBalance } from 'thirdweb/wallets';
import { deployContract, deployERC721Contract } from "thirdweb/deploys";

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

const contractAddress = await deployERC721Contract({
  chain: defineChain(78600),
  client,
  account,
  type: "TokenERC721",
  params: {
    name: "MyNFT",
    description: "My NFT contract",
    symbol: "NFT",
 }
});
console.log(contractAddress);

}
run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
