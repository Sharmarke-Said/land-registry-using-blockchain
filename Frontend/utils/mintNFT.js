import { Button, message, Space } from "antd";
import { InsertData } from "./insertData";
import { CreateNFT } from "./ContractPlugins";
import Web3 from "web3";
import { abi, contractAddress } from "./abi";
import { MainUpdateData } from "./updateData";

var metadataURL = "";
var Dataset = "";
var transaction_hash = "";
var owneraddress;
var landarray = [
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80",
  "https://images.unsplash.com/photo-1629016943072-0bf0ce4e2608?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
  "  https://media.istockphoto.com/id/1138785274/photo/zabljak-in-montenegro-mountain-view.jpg?s=170667a&w=0&k=20&c=JCA06xZw69I7XgycQgUjjIKxH6X-UPaP-QFl-LLeXtY=",
  "https://media.istockphoto.com/id/810005974/photo/peanut-tractor.jpg?s=170667a&w=0&k=20&c=K7VSqoq5tSqFI5kX-iEsKKHAF0MwHnkwdkv5iZ2CcWE=",
  "https://media.istockphoto.com/id/1179655501/photo/wheat-field.jpg?s=170667a&w=0&k=20&c=IBKD9ZGmVWrFHW0nL1yUdmprOTTxuLediny3gTCbfBo=",
];

var BuyerNames = ["Ahmed", "Abukar", "Sharmake", "Ali", "Yusuf"];

export const getMetadataURL = async (
  City,
  OwnerName,
  area,
  PID,
  survay,
  price
) => {
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

  const accounts = await ethereum.request({
    method: "eth_requestAccounts",
  });
  owneraddress = accounts[0];

  function VerifyData() {
    fetch("http://localhost:8000/landDetails")
      .then((response) => response.json())
      .then((response) => {
        Dataset = response;
        console.log("Land details from DB:", Dataset);

        const existingLand = Dataset.find(
          (land) =>
            land.propertyID === parseInt(PID) &&
            land.physicalSurveyNo === parseInt(survay)
        );

        if (existingLand) {
          if (existingLand.status === true) {
            alert("🚫 This land is already registered.");
            return;
          } else {
            alert("⚠️ This land exists but is not yet registered.");
            return;
          }
        }

        // ✅ If not found in DB, register new land
        alert(
          "✅ New land detected. Proceeding to mint and register..."
        );

        metadataURL = "https://api.nftport.xyz/v0/metadata";

        CreateNFT(
          owneraddress,
          metadataURL,
          OwnerName,
          `${City},,${OwnerName},,${area},,${PID},,${survay},,${price}`,
          landarray[Math.floor(Math.random() * 4)]
        );

        setTimeout(() => {
          console.log("Minting NFT and saving land to DB...");

          MainUpdateData({ status: true, TokenID: tokenid }, PID);
          InsertData({
            tokenID: tokenid,
            propertyID: parseInt(PID),
            physicalSurveyNo: parseInt(survay),
            Area: parseInt(area),
            City: City,
            owner: OwnerName,
            Price: parseInt(price),
            ownerAddress: owneraddress,
            ImageURL: landarray[Math.floor(Math.random() * 4)],
            Buyer_name: BuyerNames[Math.floor(Math.random() * 3)],
          });

          setTimeout(() => {
            window.location.href = "/lands";
          }, 10000);
        }, 2000);
      })
      .catch((err) => {
        console.error(err);
        alert("❌ Failed to fetch land details from server.");
      });
  }

  VerifyData();
};
