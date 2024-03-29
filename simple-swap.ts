
import { createThirdwebClient, getSwapRoute, sendSwap } from "thirdweb";
import { privateKeyAccount, localWallet } from "thirdweb/wallets";
import {polygon, optimism} from "thirdweb/chains"
import dotenv from "dotenv";

dotenv.config();


const run = async () => {

const client = createThirdwebClient({
  secretKey: process.env.PAY_THIRDWEB_SECRET_KEY as string,
});

const wallet = privateKeyAccount({client, privateKey: process.env.PAY_WALLET_PRIVATE_KEY as string});

const quote = await getSwapRoute({
  client,
  fromAddress: wallet.address.toString(),
  toAddress: wallet.address.toString(),
  fromChainId: polygon.id,
  toChainId: optimism.id,
  fromAmountWei: "5000000000000000",
  fromTokenAddress: "0x0000000000000000000000000000000000000000",
  toTokenAddress: "0x0000000000000000000000000000000000000000"
});

const myWallet = localWallet({client});
await myWallet.import({privateKey: process.env.PAY_WALLET_PRIVATE_KEY as string, encryption: false});
//await myWallet.connect;

console.log("got quote: " + quote.swapDetails);

const swap = await sendSwap(myWallet, quote);
console.log(swap);

};
run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
