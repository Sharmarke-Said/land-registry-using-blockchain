import Web3 from "web3";
import { Alchemy, Network } from "alchemy-sdk";
import {
  abi,
  contractAddress,
  Paymentabi,
  PaymentcontractAddress,
} from "./abi";
const config = {
  apiKey: "Ako92qUmH4xOvqLp7sYBK1WPdvKceXeL",
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

export const CreateNFT = async (
  Owneraddress,
  tokenURI,
  Name,
  description,
  ImageURI
) => {
  if (typeof window.ethereum === "undefined") {
    alert("Please install MetaMask first.");
  }

  window.addEventListener("load", async () => {
    try {
      await ethereum.enable();
    } catch (error) {}
  });

  const accounts = await ethereum.request({
    method: "eth_requestAccounts",
  });
  const address = accounts[0];

  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(abi, contractAddress);

  const createnft = await contract.methods
    .createNFT(Owneraddress, tokenURI, Name, description, ImageURI)
    .send({ from: address });

  console.log(createnft);
};

export const GetNFT = async () => {
  // Flag to omit metadata
  const omitMetadata = false;

  // Get all NFTs
  const response = await alchemy.nft.getNftsForContract(
    contractAddress,
    {
      omitMetadata: omitMetadata,
    }
  );
  console.log(JSON.stringify(response, null, 2));
};

export const GetTokenId = async () => {
  if (typeof window.ethereum === "undefined") {
    alert("Please install MetaMask first.");
  }

  window.addEventListener("load", async () => {
    try {
      await ethereum.enable();
    } catch (error) {}
  });
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(abi, contractAddress);

  const tokenid = await contract.methods._tokenIds().call();
  console.log(tokenid);
  return parseInt(tokenid) + 1;
};

export const TransferOwnership = async (from, to, tokenId) => {
  if (typeof window.ethereum === "undefined") {
    alert("Please install MetaMask first.");
  }

  window.addEventListener("load", async () => {
    try {
      await ethereum.enable();
    } catch (error) {}
  });
  try {
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    const address = accounts[0];

    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(abi, contractAddress);

    const transferNFT = await contract.methods
      .transferNFT(from, to, tokenId)
      .send({ from: address });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// export const ApproveNFT = async (to, tokenId) => {
//   if (typeof window.ethereum === "undefined") {
//     alert("Please install MetaMask first.");
//     return false;
//   }

//   try {
//     const accounts = await ethereum.request({
//       method: "eth_requestAccounts",
//     });
//     const address = accounts[0]; // Seller wallet must be connected

//     const web3 = new Web3(window.ethereum);
//     const contract = new web3.eth.Contract(abi, contractAddress);

//     const approveTx = await contract.methods
//       .approve(to, tokenId)
//       .send({
//         from: address,
//       });

//     console.log("Approved NFT:", approveTx);
//     return true;
//   } catch (error) {
//     console.log("ApproveNFT error:", error);
//     return false;
//   }
// };

export const ApproveNFT = async (to, tokenId) => {
  if (!window.ethereum) {
    alert("Please install MetaMask first.");
    return false;
  }

  try {
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    const address = accounts[0];

    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(abi, contractAddress);

    console.log(
      `Approving tokenId ${tokenId} for address ${to} from ${address}`
    );

    const approveTx = await contract.methods
      .approve(to, tokenId)
      .send({ from: address });

    console.log("Approved NFT transaction:", approveTx);
    return true;
  } catch (error) {
    console.error("ApproveNFT error:", error);
    if (error.data && error.data.message) {
      console.error("Revert reason:", error.data.message);
    }
    return false;
  }
};

export const AllowanceToken = async (from, to) => {
  // Check if MetaMask is installed
  if (typeof window.ethereum === "undefined") {
    alert("Please install MetaMask first.");
    return; // Exit the function early
  }

  try {
    // Request account access if needed
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const address = accounts[0];
    console.log("address:", address);
    // Initialize Web3
    const web3 = new Web3(window.ethereum);

    // Initialize the contract
    const contract = new web3.eth.Contract(
      Paymentabi,
      PaymentcontractAddress
    );
    console.log("contract:", contract);
    // Call the allowance method (read-only)
    const allowance = await contract.methods
      .allowance(from, to)
      .send({ from: address });

    console.log("Allowance:", allowance);
    return allowance; // Optionally return the allowance value
  } catch (error) {
    console.error(
      "An error occurred while fetching allowance:",
      error
    );
    // Optionally, handle specific error types here
  }
};

export const ApporveToken = async (spender, value) => {
  if (typeof window.ethereum === "undefined") {
    alert("Please install MetaMask first.");
  }

  window.addEventListener("load", async () => {
    try {
      await ethereum.enable();
    } catch (error) {}
  });

  const accounts = await ethereum.request({
    method: "eth_requestAccounts",
  });
  const address = accounts[0];

  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(
    Paymentabi,
    PaymentcontractAddress
  );

  const approve = await contract.methods
    .approve(spender, value * 10 ** 18)
    .send({ from: address });
  console.log(approve);
};
