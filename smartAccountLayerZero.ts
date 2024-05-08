
import { createThirdwebClient,getContract,readContract, sendTransaction, resolveMethod, prepareContractCall } from "thirdweb";
import dotenv from "dotenv";
import { privateKeyToAccount, smartWallet } from 'thirdweb/wallets';
import { arbitrumSepolia, defineChain } from 'thirdweb/chains';
import { ethers } from "ethers";

dotenv.config();


const run = async () => {

// connect to the SDK with the wallet using the relayer URL for the Mumbai testnet
const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY as string,
});

const eoaAccount = privateKeyToAccount({
  client,
  privateKey: process.env.THIRDWEB_ADMIN_PRIVATE_KEY as string,
});

// check environment variable to get chain
const chainSwitch = process.env.LAYER_ZERO_CHAIN as string;
let chain = arbitrumSepolia;
let lzEndPointId=10251;
if(chainSwitch === "xai") {
  chain = defineChain(37714555429);
  lzEndPointId=10231;
}

const wallet = smartWallet({
  factoryAddress: "0x21D969107D87C76F894D305cFdC98e2F019A3A2c",
  chain: chain,
  gasless: true,
});

const smartAccount = await wallet.connect({
  client,
  personalAccount: eoaAccount,
});
console.log("connected smart Account: " + smartAccount.address);

const nftContract =  getContract({
  client,
  chain: chain,
  address: process.env.LAYER_ZERO_NFT_CONTRACT_ADDRESS as string,
});

console.log("got contract: " + nftContract.address);

const adapterParams = ethers.solidityPacked(["uint16", "uint256"], [1, 500000]);
console.log("generated adapter params: " + adapterParams);

const estimateGas = await readContract({
  contract: nftContract,
  method: resolveMethod("estimateSendFee"),
  params: [lzEndPointId, smartAccount.address, 1, false, adapterParams],
});

const value = BigInt(estimateGas[0] as string);

console.log("estimated gas for sending: " + value);

const transaction = prepareContractCall({
  contract: nftContract,
  method: resolveMethod("sendFrom"),
  value: value,
  params: [smartAccount.address,lzEndPointId,smartAccount.address,59, smartAccount.address, smartAccount.address, adapterParams],
});

const tx = await sendTransaction({ transaction, account: smartAccount });
console.log("sent transaction: " + tx.transactionHash);
}
run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
