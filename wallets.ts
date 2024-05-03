
import { createThirdwebClient, defineChain } from "thirdweb";
import dotenv from "dotenv";
import { privateKeyToAccount, getWalletBalance } from 'thirdweb/wallets';

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

const balance = await getWalletBalance({
  address: account.address,
  chain: defineChain(37714555429),
  client});

console.log(balance);

}
run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
