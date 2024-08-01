
import { createThirdwebClient } from "thirdweb";
import dotenv from "dotenv";
import { upload } from "thirdweb/storage";
import fs from 'fs';
import path from 'path';

dotenv.config();

const run = async () => {

    // Function to create a File object from a file in the same directory
function createFileFromLocalPath(fileName: string): File {
    // Get the full path to the file
    const filePath = path.join(__dirname, fileName);
    
    // Read the file synchronously
    const fileBuffer = fs.readFileSync(filePath);
    
    // Determine MIME type (for PNG in this case)
    const mimeType = 'image/png';
    
    // Create a File object
    const file = new File([fileBuffer], fileName, { type: mimeType });
    
    return file;
  }
  
  

// connect to the SDK with the wallet using the relayer URL for the Mumbai testnet
const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY as string,
});

// Usage
const fileName = 'paddling.png';
try {
  const imageFile = createFileFromLocalPath(fileName);
  console.log('Image File object created:', imageFile);
  const imageUri = await upload({
    client,
    files: [imageFile],
  });
  console.log('Image uploaded to IPFS:', imageUri);
} catch (error) {
  console.error('Error creating File object:', error);
}

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
