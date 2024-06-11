
import { createThirdwebClient, getContract, prepareContractCall, encode, sendAndConfirmTransaction } from "thirdweb";
import { base, ethereum } from 'thirdweb/chains';
import dotenv from "dotenv";
import { privateKeyToAccount } from 'thirdweb/wallets';
import { aggregate } from "thirdweb/extensions/multicall3";


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
    method: "function ownerOf(uint256 tokenId) view returns (address)",
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

const preparedMultiCall = aggregate({
  contract: multiCallContract,
  calls: encodedTxArray,
});

const transactionResult = await sendAndConfirmTransaction({ transaction: preparedMultiCall, account });

}
run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
