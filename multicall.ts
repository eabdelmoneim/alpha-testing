
import { createThirdwebClient, defineChain, getContract, prepareContractCall, encode, sendTransaction } from "thirdweb";
import { base, ethereum } from 'thirdweb/chains';
import dotenv from "dotenv";
import { privateKeyToAccount } from 'thirdweb/wallets';


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

let contract = getContract({
  client,
  address: "0xa7778fB887F06Df9ddB0f7f6BF433A11bcB5a76A",
  chain: ethereum,
});

const encodedTxArray: { target: string; callData: `0x${string}`; }[] = [];

for (let index = 1; index < 222; index++) {

  const preparedTx =  prepareContractCall({
    contract,
    method: "function ownerOf(uint256)",
    params: [BigInt(index)],
  });

  let encodedTx = await encode(preparedTx);
  let payload = {
    target: contract.address,
    callData: encodedTx,
  }
  encodedTxArray.push(payload);
}

const multiCallContract = getContract({
  client,
  address: "0xcA11bde05977b3631167028862bE2a173976CA11",
  chain: base,
});

const preparedMultiCall = prepareContractCall({
  contract: multiCallContract,
  method: {
    type: "function",
    name: "aggregate",
    inputs: [
      {
        type: "tuple[]",
        name: "calls",
        components: [
          {
            type: "address",
            name: "target",
            internalType: "address",
          },
          {
            type: "bytes",
            name: "callData",
            internalType: "bytes",
          },
        ],
        internalType: "struct Multicall3.Call[]",
      },
    ],
    outputs: [
      {
        type: "uint256",
        name: "blockNumber",
        internalType: "uint256",
      },
      {
        type: "bytes[]",
        name: "returnData",
        internalType: "bytes[]",
      },
    ],
    stateMutability: "payable",
  },
  params: [
  encodedTxArray
],
});

const transactionResult = await sendTransaction({ transaction: preparedMultiCall, account });

}
run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
