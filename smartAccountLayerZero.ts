
import { createThirdwebClient,getContract,readContract, sendTransaction, resolveMethod, prepareContractCall } from "thirdweb";
import dotenv from "dotenv";
import { privateKeyToAccount, smartWallet } from 'thirdweb/wallets';
import { arbitrumSepolia } from 'thirdweb/chains';
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


const wallet = smartWallet({
  factoryAddress: "0x21D969107D87C76F894D305cFdC98e2F019A3A2c",
  chain: arbitrumSepolia,
  gasless: true,
});

const smartAccount = await wallet.connect({
  client,
  personalAccount: eoaAccount,
});
console.log("connected smart Account: " + smartAccount.address);

const nftContract =  getContract({
  client,
  chain: arbitrumSepolia,
  address: "0x481F5dc1f5727E93c510E0Fa5f02bc4F74d78c82",
});

console.log("got contract: " + nftContract.address);

const adapterParams = ethers.solidityPacked(["uint16", "uint256"], [1, 500000]);
console.log("adapter params: " + adapterParams);

const estimateGas = await readContract({
  contract: nftContract,
  method: resolveMethod("estimateSendFee"),
  params: [10251, smartAccount.address, 1, false, adapterParams],
});

const value = BigInt(estimateGas[0] as string);

console.log("estimate gas: " + value);

const transaction = prepareContractCall({
  contract: nftContract,
  method: resolveMethod("sendFrom"),
  value: value,
  params: [smartAccount.address,10251,smartAccount.address,59, smartAccount.address, smartAccount.address, adapterParams],
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
