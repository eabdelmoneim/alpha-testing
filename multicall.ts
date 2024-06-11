
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
  abi: [
    {
      "type": "function",
      "name": "aggregate",
      "inputs": [
        {
          "type": "tuple[]",
          "name": "calls",
          "components": [
            {
              "type": "address",
              "name": "target",
              "internalType": "address"
            },
            {
              "type": "bytes",
              "name": "callData",
              "internalType": "bytes"
            }
          ],
          "internalType": "struct Multicall3.Call[]"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": "blockNumber",
          "internalType": "uint256"
        },
        {
          "type": "bytes[]",
          "name": "returnData",
          "internalType": "bytes[]"
        }
      ],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "aggregate3",
      "inputs": [
        {
          "type": "tuple[]",
          "name": "calls",
          "components": [
            {
              "type": "address",
              "name": "target",
              "internalType": "address"
            },
            {
              "type": "bool",
              "name": "allowFailure",
              "internalType": "bool"
            },
            {
              "type": "bytes",
              "name": "callData",
              "internalType": "bytes"
            }
          ],
          "internalType": "struct Multicall3.Call3[]"
        }
      ],
      "outputs": [
        {
          "type": "tuple[]",
          "name": "returnData",
          "components": [
            {
              "type": "bool",
              "name": "success",
              "internalType": "bool"
            },
            {
              "type": "bytes",
              "name": "returnData",
              "internalType": "bytes"
            }
          ],
          "internalType": "struct Multicall3.Result[]"
        }
      ],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "aggregate3Value",
      "inputs": [
        {
          "type": "tuple[]",
          "name": "calls",
          "components": [
            {
              "type": "address",
              "name": "target",
              "internalType": "address"
            },
            {
              "type": "bool",
              "name": "allowFailure",
              "internalType": "bool"
            },
            {
              "type": "uint256",
              "name": "value",
              "internalType": "uint256"
            },
            {
              "type": "bytes",
              "name": "callData",
              "internalType": "bytes"
            }
          ],
          "internalType": "struct Multicall3.Call3Value[]"
        }
      ],
      "outputs": [
        {
          "type": "tuple[]",
          "name": "returnData",
          "components": [
            {
              "type": "bool",
              "name": "success",
              "internalType": "bool"
            },
            {
              "type": "bytes",
              "name": "returnData",
              "internalType": "bytes"
            }
          ],
          "internalType": "struct Multicall3.Result[]"
        }
      ],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "blockAndAggregate",
      "inputs": [
        {
          "type": "tuple[]",
          "name": "calls",
          "components": [
            {
              "type": "address",
              "name": "target",
              "internalType": "address"
            },
            {
              "type": "bytes",
              "name": "callData",
              "internalType": "bytes"
            }
          ],
          "internalType": "struct Multicall3.Call[]"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": "blockNumber",
          "internalType": "uint256"
        },
        {
          "type": "bytes32",
          "name": "blockHash",
          "internalType": "bytes32"
        },
        {
          "type": "tuple[]",
          "name": "returnData",
          "components": [
            {
              "type": "bool",
              "name": "success",
              "internalType": "bool"
            },
            {
              "type": "bytes",
              "name": "returnData",
              "internalType": "bytes"
            }
          ],
          "internalType": "struct Multicall3.Result[]"
        }
      ],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "getBasefee",
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": "basefee",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getBlockHash",
      "inputs": [
        {
          "type": "uint256",
          "name": "blockNumber",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "type": "bytes32",
          "name": "blockHash",
          "internalType": "bytes32"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getBlockNumber",
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": "blockNumber",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getChainId",
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": "chainid",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getCurrentBlockCoinbase",
      "inputs": [],
      "outputs": [
        {
          "type": "address",
          "name": "coinbase",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getCurrentBlockDifficulty",
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": "difficulty",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getCurrentBlockGasLimit",
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": "gaslimit",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getCurrentBlockTimestamp",
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": "timestamp",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getEthBalance",
      "inputs": [
        {
          "type": "address",
          "name": "addr",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": "balance",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getLastBlockHash",
      "inputs": [],
      "outputs": [
        {
          "type": "bytes32",
          "name": "blockHash",
          "internalType": "bytes32"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "tryAggregate",
      "inputs": [
        {
          "type": "bool",
          "name": "requireSuccess",
          "internalType": "bool"
        },
        {
          "type": "tuple[]",
          "name": "calls",
          "components": [
            {
              "type": "address",
              "name": "target",
              "internalType": "address"
            },
            {
              "type": "bytes",
              "name": "callData",
              "internalType": "bytes"
            }
          ],
          "internalType": "struct Multicall3.Call[]"
        }
      ],
      "outputs": [
        {
          "type": "tuple[]",
          "name": "returnData",
          "components": [
            {
              "type": "bool",
              "name": "success",
              "internalType": "bool"
            },
            {
              "type": "bytes",
              "name": "returnData",
              "internalType": "bytes"
            }
          ],
          "internalType": "struct Multicall3.Result[]"
        }
      ],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "tryBlockAndAggregate",
      "inputs": [
        {
          "type": "bool",
          "name": "requireSuccess",
          "internalType": "bool"
        },
        {
          "type": "tuple[]",
          "name": "calls",
          "components": [
            {
              "type": "address",
              "name": "target",
              "internalType": "address"
            },
            {
              "type": "bytes",
              "name": "callData",
              "internalType": "bytes"
            }
          ],
          "internalType": "struct Multicall3.Call[]"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": "blockNumber",
          "internalType": "uint256"
        },
        {
          "type": "bytes32",
          "name": "blockHash",
          "internalType": "bytes32"
        },
        {
          "type": "tuple[]",
          "name": "returnData",
          "components": [
            {
              "type": "bool",
              "name": "success",
              "internalType": "bool"
            },
            {
              "type": "bytes",
              "name": "returnData",
              "internalType": "bytes"
            }
          ],
          "internalType": "struct Multicall3.Result[]"
        }
      ],
      "stateMutability": "payable"
    }
  ]
});

const preparedMultiCall = prepareContractCall({
  contract: multiCallContract,
  method: "aggregate",
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
