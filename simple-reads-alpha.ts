
import { createThirdwebClient, getContract, defineChain } from "thirdweb";
import {baseSepolia} from "thirdweb/chains";
import { getNFTs } from "thirdweb/extensions/erc1155";
import {balanceOf} from "thirdweb/extensions/erc721"
import dotenv from "dotenv";

dotenv.config();


const run = async () => {

// connect to the SDK with the wallet using the relayer URL for the Mumbai testnet
const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY as string,
});

const contract = getContract({
  client, 
  address: "0xdbc9eEd6528ef87401a7F78E4D468562fC12450E",
  chain: defineChain(37714555429),
});

const nfts = await getNFTs({
  contract,
  start: 0,
  count: 1000,
});

console.log(nfts.length);
};
run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
