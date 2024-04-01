
import { createThirdwebClient, sendTransaction, waitForReceipt } from "thirdweb";
import {getBuyWithCryptoQuote } from "thirdweb/pay"
import { privateKeyAccount } from "thirdweb/wallets";
import { polygon, optimism } from "thirdweb/chains";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {

// connect to the SDK with the wallet using the relayer URL for the Mumbai testnet
const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY as string,
});

const account = privateKeyAccount({
  client,
  privateKey: process.env.THIRDWEB_ADMIN_PRIVATE_KEY as string,
});

const quote = await getBuyWithCryptoQuote({
  client,
  fromAddress: account.address.toString(),
  fromChainId: polygon.id,
  toChainId: optimism.id,
  toAmount: "0.05",
  fromTokenAddress: "0x0000000000000000000000000000000000000000",
  toTokenAddress: "0x0000000000000000000000000000000000000000"
});

console.log("got quote: " + quote.swapDetails);

// if approval is required
if (quote.approval) {
  // send approval transaction
  const approveTx = await sendTransaction({
    transaction: quote.approval,
    account,
  });

  // wait for approval transaction to be confirmed
  await waitForReceipt(approveTx);
}

// send buy transaction
const buyTx = await sendTransaction({
  transaction: quote.transactionRequest,
  account,
});

// wait for buy transaction to be confirmed
await waitForReceipt(buyTx);



};
run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
