import React from "react";
import { retrieveNFT } from "../utils/retrieveNFT";
import { contract } from "../utils/contract";
import { getMetadataURL } from "../utils/mintNFT";
import { MintNFT } from "../utils/mintNFT";
import Data from "../utils/Data";
import { VerifyData } from "../utils/verifyData";
import { InsertData } from "../utils/insertData";
import Metamask from "../components/metamask";
import { UpdateData } from "../utils/updateData";
import {
  GetTokenId,
  TransferOwnership,
} from "../utils/ContractPlugins";
import {
  CheckBalance,
  MakePayment,
  TokenApprove,
} from "../utils/makePayment";

const x = () => {
  return (
    <div>
      <button onClick={() => retrieveNFT()}>RETRIVE</button>
      <br />
      <button onClick={() => contract()}>CONTRACT</button>
      <br />
      <button onClick={() => getMetadataURL()}>getmetadataURL</button>
      <br />
      <button onClick={() => MintNFT()}>MINT</button> <br />
      <button onClick={() => VerifyData("Ayush", 1233, 1234, 20)}>
        VerifyData
      </button>{" "}
      <br />
      <button
        onClick={() =>
          InsertData({ propertyID: 23345645, owner: "werty" })
        }
      >
        Data insert
      </button>{" "}
      <br />
      <button onClick={() => GetTokenId()}>GetTokenID</button>
      <br />
      <button
        onClick={() =>
          TransferOwnership(
            "0xc1e8DD09e596f1C4360a8515658F9A4BDa7cE26D",
            "0x9b693806297617E2CDDd5F87ad400896480b7655",
            1
          )
        }
      >
        TransferNFT
      </button>
      {/* <Data/> */} <br />
      <button
        onClick={() =>
          MakePayment(
            1111,
            "0x9b693806297617E2CDDd5F87ad400896480b7655",
            "0xc1e8DD09e596f1C4360a8515658F9A4BDa7cE26D",
            5
          )
        }
      >
        SendToken
      </button>
      <br />
      <button onClick={() => CheckBalance()}>CheckBalance</button>
      <br />
      <button
        onClick={() =>
          TokenApprove(
            "0x9b693806297617E2CDDd5F87ad400896480b7655",
            10000000000
          )
        }
      >
        Approve
      </button>
      <br />
      <button
        onClick={() =>
          CreateNFT(
            "0x7ED790A1Ac108b9A50e24f5c5E061df59e3673a7",
            "tokenURI",
            "Name",
            "description",
            "ImageURI"
          )
        }
      >
        Create NFT
      </button>
    </div>
  );
};

export default x;
