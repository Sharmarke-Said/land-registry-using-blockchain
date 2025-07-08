// inspectorDashboard.js
import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/navbar/Navbar";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Progress, Table } from "antd";
import { Footer } from "../components/Footer";
import { MainUpdateData, UpdateData } from "../utils/updateData";
import { TransferOwnership } from "../utils/ContractPlugins";

const InspectorDashboard = () => {
  const [landData, setLandData] = useState([]); // Renamed Dataset to landData for clarity

  // Function to fetch land data from the backend
  const fetchLandData = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/SellingLand/"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched land data:", data);
      setLandData(data);
    } catch (err) {
      console.error("Error fetching land data:", err);
      // Optionally, show an error message to the user
      alert("Failed to fetch land data. Please try again later.");
    }
  }, []); // useCallback ensures this function is stable across renders

  // Fetch data on component mount
  useEffect(() => {
    fetchLandData();
  }, [fetchLandData]); // Depend on fetchLandData

  // Helper function to get the current ProcessStatus for a given propertyID
  const getProcessStatus = useCallback(
    (propertyID) => {
      const item = landData.find(
        (land) => land.propertyID === propertyID
      );
      return item ? item.ProcessStatus : 0; // Return 0 or a sensible default if not found
    },
    [landData]
  );

  // Function to increment the process status
  const increaseProcess = async (propertyID) => {
    const currentStatus = getProcessStatus(propertyID);
    const MAX_PROCESS_STATUS = 5; // Define maximum status

    if (currentStatus < MAX_PROCESS_STATUS) {
      alert("Incrementing process status...");
      await UpdateData(
        { ProcessStatus: currentStatus + 1 },
        propertyID
      );
      fetchLandData(); // Re-fetch data to update UI
    } else {
      alert("Process is already at the maximum status.");
    }
  };

  // Function to decrement the process status
  const declineProcess = async (propertyID) => {
    const currentStatus = getProcessStatus(propertyID);
    const MIN_PROCESS_STATUS = 1; // Define minimum status

    if (currentStatus > MIN_PROCESS_STATUS) {
      alert("Decrementing process status...");
      await UpdateData(
        { ProcessStatus: currentStatus - 1 },
        propertyID
      );
      fetchLandData(); // Re-fetch data to update UI
    } else {
      alert("Process is already at the minimum status.");
    }
  };

  // Function to handle NFT ownership transfer
  const handleTransferNFT = async (propertyID) => {
    const landToTransfer = landData.find(
      (land) => land.propertyID === propertyID
    );

    if (!landToTransfer) {
      alert("Land data not found for transfer.");
      return;
    }

    // Confirm with the user before initiating transfer
    if (
      !window.confirm(
        `Are you sure you want to transfer ownership for Property ID: ${propertyID}?`
      )
    ) {
      return;
    }

    console.log("Initiating NFT transfer for:", landToTransfer);
    try {
      const success = await TransferOwnership(
        landToTransfer.ownerAddress,
        landToTransfer.Buyer_address,
        landToTransfer.tokenID
      );

      if (success) {
        // Update backend data after successful blockchain transfer
        await MainUpdateData(
          { owner: landToTransfer.Buyer_name },
          propertyID
        ); // Update owner name
        await UpdateData(
          {
            ownerAddress: landToTransfer.Buyer_address, // New owner address
            owner: landToTransfer.Buyer_name, // New owner name
            ProcessStatus: 5, // Set status to completed (5)
            PaymentStatus: false, // Reset payment status
            status: 5, // Assuming this 'status' field also needs to be 5
            request: false, // Reset request status
            Buyer_address: "0", // Clear buyer info
            Buyer_name: "0", // Clear buyer info
            PaymentDuration: "", // Clear payment duration
            StampDutyTokenStatus: false, // Reset stamp duty status
          },
          propertyID
        );
        alert("Ownership transferred successfully! 🎉");
        fetchLandData(); // Re-fetch data to update the table
      } else {
        alert(
          "Failed to transfer ownership. Please check the transaction."
        );
      }
    } catch (error) {
      console.error("Error during NFT transfer:", error);
      alert("An error occurred during ownership transfer.");
    }
  };

  // Function to check if transaction payment is done
  const isTransactionCompleted = useCallback(
    (propertyID) => {
      const item = landData.find(
        (land) => land.propertyID === propertyID
      );
      return item ? item.PaymentStatus : false;
    },
    [landData]
  );

  // Function to view transaction on BSC Scan
  const viewOnBscScan = (propertyID) => {
    const item = landData.find(
      (land) => land.propertyID === propertyID
    );
    if (item && item.TransactionHash) {
      window.open(
        `https://testnet.bscscan.com/tx/${item.TransactionHash}`,
        "_blank",
        "noopener,noreferrer"
      );
    } else {
      alert("Transaction hash not available for this property.");
    }
  };

  // Filter data for the table: show only items with process status 1 to 5
  // And then sort them in descending order based on propertyID
  const filteredAndSortedLandData = landData
    .filter(
      (land) => land.ProcessStatus >= 1 && land.ProcessStatus <= 5
    )
    .sort((a, b) => {
      // Assuming propertyID can be directly compared (e.g., numbers or strings that sort correctly)
      return parseInt(b.propertyID) - parseInt(a.propertyID); // DESC order
    });

  // Table columns definition
  const columns = [
    {
      title: "PID",
      dataIndex: "propertyID",
      key: "propertyID",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Seller Address",
      dataIndex: "ownerAddress",
      key: "ownerAddress",
      render: (text) =>
        text ? <a>{text.slice(0, 12) + "..."}</a> : <a>N/A</a>,
    },
    {
      title: "Buyer Address",
      dataIndex: "Buyer_address",
      key: "Buyer_address",
      render: (text) =>
        text ? <a>{text.slice(0, 12) + "..."}</a> : <a>N/A</a>,
    },
    {
      title: "Price",
      dataIndex: "Price",
      key: "Price",
      render: (text) => `USD ${text}`, // Format price
    },
    {
      title: "Land View",
      key: "landview",
      dataIndex: "propertyID",
      render: (propertyID) => (
        <Button
          type="primary"
          onClick={() => {
            window.location.href = `/processstatus/${propertyID}`;
          }}
          className="bg-blue-500 w-[46%] mr-4 hover:bg-blue-700 text-white font-bold py-2 h-auto px-4 mx-2 rounded my-2 text-[16px]"
        >
          View
        </Button>
      ),
    },
    {
      title: "Transfer Ownership",
      key: "transfer",
      dataIndex: "propertyID",
      render: (propertyID) => (
        <>
          {isTransactionCompleted(propertyID) ? (
            <>
              <Button
                type="primary"
                onClick={() => viewOnBscScan(propertyID)}
                className="bg-blue-500 w-[46%] hover:bg-blue-700 mr-2 text-white font-bold py-2 h-auto px-4 mx-2 rounded my-2 text-[16px]"
              >
                BSC SCAN
              </Button>
              <Button
                type="primary"
                onClick={() => handleTransferNFT(propertyID)}
                className="bg-blue-500 w-[46%] -mr-4 hover:bg-blue-700 text-white font-bold py-2 h-auto px-4 mx-2 rounded my-2 text-[16px]"
              >
                Transfer
              </Button>
            </>
          ) : (
            <Button
              type="primary"
              disabled
              className="bg-blue-500 -mr-4 hover:bg-red-700 text-white font-bold py-2 h-auto px-4 mx-2 rounded my-2 text-[16px] cursor-not-allowed"
            >
              Transaction Pending
            </Button>
          )}
        </>
      ),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "propertyID",
      render: (propertyID) => {
        const currentProgress = getProcessStatus(propertyID);
        return (
          <>
            <Progress
              type="circle"
              percent={currentProgress * 20} // Assuming 5 steps * 20% each
              width={60} // Smaller circle size
              format={(percent) => `${currentProgress}/5`} // Show current step out of 5
              style={{ marginRight: 8 }}
            />
            <Button.Group>
              <Button
                onClick={() => declineProcess(propertyID)}
                icon={<MinusOutlined />}
                disabled={currentProgress <= 1}
              />
              <Button
                onClick={() => increaseProcess(propertyID)}
                icon={<PlusOutlined />}
                disabled={currentProgress >= 5}
              />
            </Button.Group>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <Navbar />
      {/* Increased padding-top to create more space below the Navbar */}
      <div className="pt-24 rounded-2xl">
        {" "}
        {/* Changed from pt-[10px] to pt-24 (96px) */}
        <div className="w-[90%] shadow-2xl m-auto p-10 rounded-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Inspector Dashboard
          </h2>
          <Table
            className="mt-10"
            pagination={{ pageSize: 4 }}
            columns={columns}
            dataSource={filteredAndSortedLandData.map((item) => ({
              ...item,
              key: item.propertyID,
            }))}
            rowKey="propertyID"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InspectorDashboard;
