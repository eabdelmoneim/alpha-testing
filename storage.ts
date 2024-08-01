
import { createThirdwebClient } from "thirdweb";
import dotenv from "dotenv";
import { upload } from "thirdweb/storage";

dotenv.config();

const run = async () => {

// connect to the SDK with the wallet using the relayer URL for the Mumbai testnet
const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY as string,
});

const uri = await upload({
    client,
    files: [{
        name: 'Doge Oasis',
        description: 'Doge amongst the palms',
        image: 'ipfs://QmPJFw6jFAtHfc7FJT8dJdyyB5u6qPUmL567jVsmnxw9C6',
        external_url: 'https://titles.xyz',
        attributes: [ { trait_type: 'Made with', value: 'TITLES' } ]
      }]
});

console.log(uri);
};
run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
