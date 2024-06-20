
import { createThirdwebClient, getContract, defineChain, readContract, prepareContractCall, sendTransaction } from "thirdweb";
import {polygonAmoy} from "thirdweb/chains";
import { getNFTs } from "thirdweb/extensions/erc1155";
import {balanceOf, getActiveClaimCondition, getOwnedNFTs, tokensOfOwner} from "thirdweb/extensions/erc721"
import dotenv from "dotenv";
import { privateKeyToAccount } from "thirdweb/wallets";

dotenv.config();


const run = async () => {

  const CONTRACT_ABI = [
    {
      "type": "event",
      "name": "DiamondCut",
      "inputs": [
        {
          "type": "tuple[]",
          "name": "_diamondCut",
          "components": [
            {
              "type": "address",
              "name": "facetAddress",
              "internalType": "address"
            },
            {
              "type": "uint8",
              "name": "action",
              "internalType": "enum IDiamondCut.FacetCutAction"
            },
            {
              "type": "bytes4[]",
              "name": "functionSelectors",
              "internalType": "bytes4[]"
            }
          ],
          "indexed": false,
          "internalType": "struct IDiamondCut.FacetCut[]"
        },
        {
          "type": "address",
          "name": "_init",
          "indexed": false,
          "internalType": "address"
        },
        {
          "type": "bytes",
          "name": "_calldata",
          "indexed": false,
          "internalType": "bytes"
        }
      ],
      "outputs": [],
      "anonymous": false
    },
    {
      "type": "function",
      "name": "diamondCut",
      "inputs": [
        {
          "type": "tuple[]",
          "name": "_diamondCut",
          "components": [
            {
              "type": "address",
              "name": "facetAddress",
              "internalType": "address"
            },
            {
              "type": "uint8",
              "name": "action",
              "internalType": "enum IDiamondCut.FacetCutAction"
            },
            {
              "type": "bytes4[]",
              "name": "functionSelectors",
              "internalType": "bytes4[]"
            }
          ],
          "internalType": "struct IDiamondCut.FacetCut[]"
        },
        {
          "type": "address",
          "name": "_init",
          "internalType": "address"
        },
        {
          "type": "bytes",
          "name": "_calldata",
          "internalType": "bytes"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "facetAddress",
      "inputs": [
        {
          "type": "bytes4",
          "name": "_functionSelector",
          "internalType": "bytes4"
        }
      ],
      "outputs": [
        {
          "type": "address",
          "name": "facetAddress_",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "facetAddresses",
      "inputs": [],
      "outputs": [
        {
          "type": "address[]",
          "name": "facetAddresses_",
          "internalType": "address[]"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "facetFunctionSelectors",
      "inputs": [
        {
          "type": "address",
          "name": "_facet",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "type": "bytes4[]",
          "name": "facetFunctionSelectors_",
          "internalType": "bytes4[]"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "facets",
      "inputs": [],
      "outputs": [
        {
          "type": "tuple[]",
          "name": "facets_",
          "components": [
            {
              "type": "address",
              "name": "facetAddress",
              "internalType": "address"
            },
            {
              "type": "bytes4[]",
              "name": "functionSelectors",
              "internalType": "bytes4[]"
            }
          ],
          "internalType": "struct IDiamondLoupe.Facet[]"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "supportsInterface",
      "inputs": [
        {
          "type": "bytes4",
          "name": "_interfaceId",
          "internalType": "bytes4"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": "",
          "internalType": "bool"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "event",
      "name": "OwnershipTransferred",
      "inputs": [
        {
          "type": "address",
          "name": "previousOwner",
          "indexed": true,
          "internalType": "address"
        },
        {
          "type": "address",
          "name": "newOwner",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "outputs": [],
      "anonymous": false
    },
    {
      "type": "function",
      "name": "owner",
      "inputs": [],
      "outputs": [
        {
          "type": "address",
          "name": "owner_",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "transferOwnership",
      "inputs": [
        {
          "type": "address",
          "name": "_newOwner",
          "internalType": "address"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "Approval",
      "inputs": [
        {
          "type": "address",
          "name": "owner",
          "indexed": true,
          "internalType": "address"
        },
        {
          "type": "address",
          "name": "spender",
          "indexed": true,
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "value",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "Transfer",
      "inputs": [
        {
          "type": "address",
          "name": "from",
          "indexed": true,
          "internalType": "address"
        },
        {
          "type": "address",
          "name": "to",
          "indexed": true,
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "value",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "anonymous": false
    },
    {
      "type": "function",
      "name": "allowance",
      "inputs": [
        {
          "type": "address",
          "name": "owner",
          "internalType": "address"
        },
        {
          "type": "address",
          "name": "spender",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": "",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "approve",
      "inputs": [
        {
          "type": "address",
          "name": "spender",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "amount",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": "",
          "internalType": "bool"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "balanceOf",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": "",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "batchMint",
      "inputs": [
        {
          "type": "address[]",
          "name": "accounts",
          "internalType": "address[]"
        },
        {
          "type": "uint256[]",
          "name": "amounts",
          "internalType": "uint256[]"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "batchMintConstant",
      "inputs": [
        {
          "type": "address[]",
          "name": "accounts",
          "internalType": "address[]"
        },
        {
          "type": "uint256",
          "name": "amount",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "burn",
      "inputs": [
        {
          "type": "uint256",
          "name": "amount",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "burnFrom",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "amount",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "contractController",
      "inputs": [],
      "outputs": [
        {
          "type": "address",
          "name": "",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "decimals",
      "inputs": [],
      "outputs": [
        {
          "type": "uint8",
          "name": "",
          "internalType": "uint8"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "decreaseAllowance",
      "inputs": [
        {
          "type": "address",
          "name": "spender",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "subtractedValue",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": "",
          "internalType": "bool"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "increaseAllowance",
      "inputs": [
        {
          "type": "address",
          "name": "spender",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "addedValue",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": "",
          "internalType": "bool"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "mint",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "amount",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "name",
      "inputs": [],
      "outputs": [
        {
          "type": "string",
          "name": "",
          "internalType": "string"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "symbol",
      "inputs": [],
      "outputs": [
        {
          "type": "string",
          "name": "",
          "internalType": "string"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "totalSupply",
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": "",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "transfer",
      "inputs": [
        {
          "type": "address",
          "name": "recipient",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "amount",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": "",
          "internalType": "bool"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "transferFrom",
      "inputs": [
        {
          "type": "address",
          "name": "sender",
          "internalType": "address"
        },
        {
          "type": "address",
          "name": "recipient",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "amount",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": "",
          "internalType": "bool"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "ControlTransferred",
      "inputs": [
        {
          "type": "address",
          "name": "previousController",
          "indexed": true,
          "internalType": "address"
        },
        {
          "type": "address",
          "name": "newController",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "outputs": [],
      "anonymous": false
    },
    {
      "type": "function",
      "name": "getERC20Controller",
      "inputs": [],
      "outputs": [
        {
          "type": "address",
          "name": "",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "setERC20Controller",
      "inputs": [
        {
          "type": "address",
          "name": "controller",
          "internalType": "address"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "constructor",
      "name": "",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    }
  ];

// connect to the SDK with the wallet using the relayer URL for the Mumbai testnet
const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY as string,
});

const account = privateKeyToAccount({
  client,
  privateKey: process.env.THIRDWEB_ADMIN_PRIVATE_KEY as string,
});

const contract = getContract({
  client, 
  address: "0x28DA0Cad162dfd305280b956d93E0cd9F10C7d73",
  chain: polygonAmoy,
  abi: [
    {
      "type": "event",
      "name": "DiamondCut",
      "inputs": [
        {
          "type": "tuple[]",
          "name": "_diamondCut",
          "components": [
            {
              "type": "address",
              "name": "facetAddress",
              "internalType": "address"
            },
            {
              "type": "uint8",
              "name": "action",
              "internalType": "enum IDiamondCut.FacetCutAction"
            },
            {
              "type": "bytes4[]",
              "name": "functionSelectors",
              "internalType": "bytes4[]"
            }
          ],
          "indexed": false,
          "internalType": "struct IDiamondCut.FacetCut[]"
        },
        {
          "type": "address",
          "name": "_init",
          "indexed": false,
          "internalType": "address"
        },
        {
          "type": "bytes",
          "name": "_calldata",
          "indexed": false,
          "internalType": "bytes"
        }
      ],
      "outputs": [],
      "anonymous": false
    },
    {
      "type": "function",
      "name": "diamondCut",
      "inputs": [
        {
          "type": "tuple[]",
          "name": "_diamondCut",
          "components": [
            {
              "type": "address",
              "name": "facetAddress",
              "internalType": "address"
            },
            {
              "type": "uint8",
              "name": "action",
              "internalType": "enum IDiamondCut.FacetCutAction"
            },
            {
              "type": "bytes4[]",
              "name": "functionSelectors",
              "internalType": "bytes4[]"
            }
          ],
          "internalType": "struct IDiamondCut.FacetCut[]"
        },
        {
          "type": "address",
          "name": "_init",
          "internalType": "address"
        },
        {
          "type": "bytes",
          "name": "_calldata",
          "internalType": "bytes"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "facetAddress",
      "inputs": [
        {
          "type": "bytes4",
          "name": "_functionSelector",
          "internalType": "bytes4"
        }
      ],
      "outputs": [
        {
          "type": "address",
          "name": "facetAddress_",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "facetAddresses",
      "inputs": [],
      "outputs": [
        {
          "type": "address[]",
          "name": "facetAddresses_",
          "internalType": "address[]"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "facetFunctionSelectors",
      "inputs": [
        {
          "type": "address",
          "name": "_facet",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "type": "bytes4[]",
          "name": "facetFunctionSelectors_",
          "internalType": "bytes4[]"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "facets",
      "inputs": [],
      "outputs": [
        {
          "type": "tuple[]",
          "name": "facets_",
          "components": [
            {
              "type": "address",
              "name": "facetAddress",
              "internalType": "address"
            },
            {
              "type": "bytes4[]",
              "name": "functionSelectors",
              "internalType": "bytes4[]"
            }
          ],
          "internalType": "struct IDiamondLoupe.Facet[]"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "supportsInterface",
      "inputs": [
        {
          "type": "bytes4",
          "name": "_interfaceId",
          "internalType": "bytes4"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": "",
          "internalType": "bool"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "event",
      "name": "OwnershipTransferred",
      "inputs": [
        {
          "type": "address",
          "name": "previousOwner",
          "indexed": true,
          "internalType": "address"
        },
        {
          "type": "address",
          "name": "newOwner",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "outputs": [],
      "anonymous": false
    },
    {
      "type": "function",
      "name": "owner",
      "inputs": [],
      "outputs": [
        {
          "type": "address",
          "name": "owner_",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "transferOwnership",
      "inputs": [
        {
          "type": "address",
          "name": "_newOwner",
          "internalType": "address"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "Approval",
      "inputs": [
        {
          "type": "address",
          "name": "owner",
          "indexed": true,
          "internalType": "address"
        },
        {
          "type": "address",
          "name": "spender",
          "indexed": true,
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "value",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "Transfer",
      "inputs": [
        {
          "type": "address",
          "name": "from",
          "indexed": true,
          "internalType": "address"
        },
        {
          "type": "address",
          "name": "to",
          "indexed": true,
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "value",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "anonymous": false
    },
    {
      "type": "function",
      "name": "allowance",
      "inputs": [
        {
          "type": "address",
          "name": "owner",
          "internalType": "address"
        },
        {
          "type": "address",
          "name": "spender",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": "",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "approve",
      "inputs": [
        {
          "type": "address",
          "name": "spender",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "amount",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": "",
          "internalType": "bool"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "balanceOf",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": "",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "batchMint",
      "inputs": [
        {
          "type": "address[]",
          "name": "accounts",
          "internalType": "address[]"
        },
        {
          "type": "uint256[]",
          "name": "amounts",
          "internalType": "uint256[]"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "batchMintConstant",
      "inputs": [
        {
          "type": "address[]",
          "name": "accounts",
          "internalType": "address[]"
        },
        {
          "type": "uint256",
          "name": "amount",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "burn",
      "inputs": [
        {
          "type": "uint256",
          "name": "amount",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "burnFrom",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "amount",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "contractController",
      "inputs": [],
      "outputs": [
        {
          "type": "address",
          "name": "",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "decimals",
      "inputs": [],
      "outputs": [
        {
          "type": "uint8",
          "name": "",
          "internalType": "uint8"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "decreaseAllowance",
      "inputs": [
        {
          "type": "address",
          "name": "spender",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "subtractedValue",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": "",
          "internalType": "bool"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "increaseAllowance",
      "inputs": [
        {
          "type": "address",
          "name": "spender",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "addedValue",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": "",
          "internalType": "bool"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "mint",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "amount",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "name",
      "inputs": [],
      "outputs": [
        {
          "type": "string",
          "name": "",
          "internalType": "string"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "symbol",
      "inputs": [],
      "outputs": [
        {
          "type": "string",
          "name": "",
          "internalType": "string"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "totalSupply",
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": "",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "transfer",
      "inputs": [
        {
          "type": "address",
          "name": "recipient",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "amount",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": "",
          "internalType": "bool"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "transferFrom",
      "inputs": [
        {
          "type": "address",
          "name": "sender",
          "internalType": "address"
        },
        {
          "type": "address",
          "name": "recipient",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "amount",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": "",
          "internalType": "bool"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "ControlTransferred",
      "inputs": [
        {
          "type": "address",
          "name": "previousController",
          "indexed": true,
          "internalType": "address"
        },
        {
          "type": "address",
          "name": "newController",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "outputs": [],
      "anonymous": false
    },
    {
      "type": "function",
      "name": "getERC20Controller",
      "inputs": [],
      "outputs": [
        {
          "type": "address",
          "name": "",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "setERC20Controller",
      "inputs": [
        {
          "type": "address",
          "name": "controller",
          "internalType": "address"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "constructor",
      "name": "",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    }
  ]
});

const data = await readContract({
  contract,
  method: "allowance",
  params: ["0xc3F2b2a12Eba0f5989cD75B2964E31D56603a2cE","0xc3F2b2a12Eba0f5989cD75B2964E31D56603a2cE"],
});

console.log(data);

const transaction = await prepareContractCall({ 
  contract, 
  method: "approve", 
  params: ["0xc3F2b2a12Eba0f5989cD75B2964E31D56603a2cE", BigInt(100000000)] 
});

const { transactionHash } = await sendTransaction({ 
  transaction, 
  account 
});

console.log(transactionHash);

// const nfts = await getOwnedNFTs({
//   contract,
//   owner: "0xc3F2b2a12Eba0f5989cD75B2964E31D56603a2cE"
// });

// console.log(nfts)

// const nfts = await getNFTs({
//   contract,
//   start: 0,
//   count: 1000,
// });

// console.log(nfts.length);
};
run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
