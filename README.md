# Land Registry Using Blockchain Technology

This project implements a decentralized land registry system using smart contracts deployed on the Binance Smart Chain (BSC) testnet. Below is an overview of the platform, important features, and setup instructions, along with a detailed user flow.

## Project Overview
- **Objective**: Provide a transparent, immutable record of land ownership, allowing users to register new lands and transfer ownership via smart contracts.  
- **Scope**: Designed for demonstration on the BSC testnet but could be adapted to other EVM-compatible networks.  

---

## Features
1. **Immutable Records**: Land ownership updates are logged permanently on-chain.  
2. **Automated Ownership Transfer**: Once confirmed in Metamask, the smart contract updates ownership details.  
3. **Verifiable Transactions**: Each transaction is indexed on the BSC testnet explorer, ensuring transparency.  

---

## Tech Stack

### 1. Blockchain Network
- **Binance Smart Chain (BSC) Testnet**  
  - Chosen for its compatibility with Ethereum tooling (EVM) and lower gas costs compared to Ethereum mainnet.  
  - Allows developers to experiment with real smart contract deployment without incurring high fees.

### 2. Smart Contracts
- **Solidity**  
  - Primary language used for writing contracts.  
  - Contains functions for registering land, transferring ownership, and retrieving records.  
- **Already Deployed**  
  - The contracts have been deployed on the BSC testnet.  
  - You can view the main contract here:  
  


### 3. Frontend
- **React or Next.js** (depending on your setup)  
  - Delivers the user-facing interface for land registration and ownership transfers.  
  - Communicates with the smart contract using libraries like `web3.js` or `ethers.js`.  

### 4. Tools & Libraries
- **Node.js & npm (or Yarn)**  
  - Manage dependencies and run local development servers.  
- **Metamask**  
  - Browser extension that handles wallet connections and user transactions.  
- **BSC Testnet Explorer** (e.g., [testnet.bscscan.com](https://testnet.bscscan.com/))  
  - Verification tool for viewing transaction details and confirming contract interactions.  



## Prerequisites
1. **Node.js (v14+)**  
2. **npm or Yarn**  
3. **Metamask** installed and configured for the BSC testnet.  
4. **BNB test tokens** in your wallet for gas fees (available via a faucet).  

---

## Connecting to BNB Testnet
1. **Add BSC Testnet to Metamask**  
   - Open Metamask → Add Network → Enter BSC testnet details (RPC URL, chain ID, etc.).  
2. **Check Balance**  
   - Use a faucet (search “BNB testnet faucet”) to get test BNB.  



## User Flow

1. **Connect Wallet**
   - **Open the App**: Launch the web interface in your browser.  
   - **Select BNB Testnet Network** in Metamask.  
   - **Click “Connect Wallet”**: Approve the connection request in Metamask.

 2. **Register Land**
   - **Go to “Register Land”**: Provide details such as land title, location, and your wallet address.  
   - **Submit & Confirm**: Clicking “Register” triggers a smart contract transaction. Approve via Metamask.  
   - **Result**: Land record is created on-chain; you receive a transaction hash.
 3. **View Registered Lands**
   - **My Lands**: See a list of lands owned by your connected wallet.  
   - **Details**: Click on any entry to view land info, transaction history, and owner data on the BSC explorer.

4. **Transfer Ownership**
   - **Select Land**: Choose a land you already own.  
   - **Enter New Owner**: Specify the wallet address of the recipient.  
   - **Initiate Transaction**: Approve in Metamask.  
   - **Ownership Update**: The new owner can then see this land when connected with their wallet.

5. **Explore Transactions**
   - **Transaction Hash**: Provided after each successful operation.  
   - **Check on BSC Testnet Explorer**: Confirm that the transaction is successful and the block number is updated.

6. **Additional Operations (If Available)**
   - **Update Land Info**: If the contract allows, you may edit certain metadata with another blockchain transaction.  
   - **Archive/Remove Land**: In some designs, land can be marked inactive; however, permanent removal is not typical on-chain.


