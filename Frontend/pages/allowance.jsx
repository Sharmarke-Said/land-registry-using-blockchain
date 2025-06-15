import React, { useState } from "react";
import { AllowanceToken, ApporveToken } from "../utils/ContractPlugins";
import { TokenApprove } from "../utils/makePayment";

const Allowance = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amountValue, setAmountValue] = useState("");
  const [allowance, setAllowance] = useState(null);
  const [error, setError] = useState("");
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingAllowance, setLoadingAllowance] = useState(false);
  const [approved, setApproved] = useState(false);

  // Function to handle approval
  const handleApprove = async () => {
    // Reset previous states
    setError("");
    setAllowance(null);

    // Basic validation
    if (!from || !to || !amountValue) {
      setError("All fields are required.");
      return;
    }

    // Check if MetaMask is installed
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask first.");
      return;
    }

    setLoadingApprove(true);
    try {
      //   await ApporveToken(to, amountValue);
      await TokenApprove(to, amountValue);
      setApproved(true);
    } catch (err) {
      console.error(err);
      setError("Approval failed. Please try again.");
    } finally {
      setLoadingApprove(false);
    }
  };

  // Function to check allowance
  const handleCheckAllowance = async () => {
    // Reset previous states
    setAllowance(null);
    setError("");

    // Basic validation
    if (!from || !to) {
      setError("From and To addresses are required.");
      return;
    }

    // Check if MetaMask is installed
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask first.");
      return;
    }

    setLoadingAllowance(true);
    try {
      const allowanceValue = await AllowanceToken(from, to);
      setAllowance(allowanceValue);
    } catch (err) {
      console.error(err);
      setError("Failed to retrieve allowance.");
    } finally {
      setLoadingAllowance(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Token Management</h2>

      {/* From Address */}
      <div className="mb-4">
        <label
          className="block text-gray-700 font-semibold mb-2"
          htmlFor="from"
        >
          From Address
        </label>
        <input
          id="from"
          type="text"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="0x..."
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* To Address */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2" htmlFor="to">
          To Address
        </label>
        <input
          id="to"
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="0x..."
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Allowance Value */}
      <div className="mb-6">
        <label
          className="block text-gray-700 font-semibold mb-2"
          htmlFor="amountValue"
        >
          Allowance Value
        </label>
        <input
          id="amountValue"
          type="number"
          value={amountValue}
          onChange={(e) => setAmountValue(e.target.value)}
          placeholder="e.g., 1"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Approve Button */}
      <button
        onClick={handleApprove}
        disabled={loadingApprove}
        className={`w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 ${
          loadingApprove ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loadingApprove ? "Approving..." : "Approve Token"}
      </button>

      {/* Check Allowance Button */}

      <button
        onClick={handleCheckAllowance}
        disabled={loadingAllowance}
        className={`w-full mt-4 py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          loadingAllowance ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loadingAllowance ? "Checking..." : "Get Allowance"}
      </button>

      {/* Display Allowance */}
      {allowance !== null && (
        <div className="mt-6 p-4 bg-green-100 border border-green-200 rounded-md">
          <h3 className="text-lg font-semibold text-green-700">Allowance:</h3>
          <p className="text-green-600 break-all">{allowance}</p>
        </div>
      )}

      {/* Display Error */}
      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};

export default Allowance;
