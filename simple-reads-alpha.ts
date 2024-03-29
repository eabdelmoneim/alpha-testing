
import { createThirdwebClient, getContract } from "thirdweb";
import {baseSepolia} from "thirdweb/chains";
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
  address: "0xC5e6BbEc31F690BCc4E95E36f3f2Cf7f2FdEDF1c",
  chain: baseSepolia,
});

const balance = await balanceOf({
  contract,
  owner: "0x749CaA9A7bbF7D5aEb8Ea6E92335AFa2f74dE4EE",
});
console.log(balance.toString());

};
run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
