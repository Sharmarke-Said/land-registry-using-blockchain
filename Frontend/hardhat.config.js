require("@nomicfoundation/hardhat-toolbox");
// require('dotenv').config(); // optional if using .env

module.exports = {
  solidity: "0.8.1",
  paths: {
    sources: "./SmartContract", // where LandRegistration.sol & MakePayment.sol exist
  },
  networks: {
    bsctestnet: {
      // url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
      accounts: [
        "c5a4849dbd6b753c937807edc9c1a44e9a5661df45dccdc213c3a0c6ce1c0885", // replace with process.env.PRIVATE_KEY if .env is used
      ],
    },
  },
};
