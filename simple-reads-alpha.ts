
import { createThirdwebClient, getContract, defineChain } from "thirdweb";
import {baseSepolia} from "thirdweb/chains";
import { getNFTs } from "thirdweb/extensions/erc1155";
import {balanceOf, getActiveClaimCondition, getOwnedNFTs, tokensOfOwner} from "thirdweb/extensions/erc721"
import dotenv from "dotenv";

dotenv.config();


const run = async () => {

// connect to the SDK with the wallet using the relayer URL for the Mumbai testnet
const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY as string,
});

const contract = getContract({
  client, 
  address: "0x19CCCE4fD172c1228869Fc182E6645a47B52fe41",
  chain: defineChain(37714555429),
});

// const nfts = await getOwnedNFTs({
//   contract,
//   owner: "0xc3F2b2a12Eba0f5989cD75B2964E31D56603a2cE"
// });

// console.log(nfts)

const result = await tokensOfOwner({
  contract,
  owner: "0xF9C3fEf56f0e5FC753eEB381773bF6Bb4032477d",
 });

 console.log(result)

 if(result.length > 0){
 console.log(result[0]);
 }
// const nfts = await getNFTs({
//   contract,
//   start: 0,
//   count: 1000,
// });

// console.log(nfts.length);
};
run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
