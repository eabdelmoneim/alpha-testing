import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { getNFT } from "thirdweb/extensions/erc1155";
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

    // Use the getNFT extension to retrieve the NFT with id=0
    const nft = await getNFT({
      contract,
      tokenId: 0n,
    });

    console.log("NFT with id 0:", nft);

    // You can access specific properties of the NFT if needed
    // console.log("NFT metadata:", nft.metadata);
    // console.log("NFT supply:", nft.supply);

  } catch (error) {
    console.error("Error reading contract:", error);
  }
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});