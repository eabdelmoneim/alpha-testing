import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { getNFTs } from "thirdweb/extensions/erc1155";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  // Initialize the SDK client
  const client = createThirdwebClient({
    secretKey: process.env.THIRDWEB_SECRET_KEY as string,
  });

  // The contract address you want to interact with
  const contractAddress = "0x38292913581675244b76584954c7ba88E28a4362";

  try {
    // Get the contract instance
    const contract = getContract({
      client,
      address: contractAddress,
      chain: defineChain(660279),
    });

    // Use the getNFTs function to retrieve the first 1000 NFTs
    const nfts = await getNFTs({
      contract,
      start: 0,
      count: 1000,
    });

    console.log(`Retrieved ${nfts.length} NFTs:`);
    nfts.forEach((nft, index) => {
      console.log(`NFT ${index + 1}:`);
      console.log("Name:", nft.metadata.name);
      console.log("Description:", nft.metadata.description);
      console.log("---");
    });

  } catch (error) {
    console.error("Error reading contract:", error);
  }
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});