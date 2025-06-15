// app.js (or server.js)
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const landDetailsRouter = require("./routes/landDetails");
const SellingLandRouter = require("./routes/SellingLand");
const userDetailsRouter = require("./routes/userDetails");
const verifyOtpRouter = require("./routes/verifyOtp");
const landInspectorRouter = require("./routes/landInspector");

const app = express();

// Regular middleware
app.use(express.json());
app.use(cors());

// Routers
app.use("/landDetails", landDetailsRouter);
app.use("/SellingLand", SellingLandRouter);
app.use("/userDetails", userDetailsRouter);
app.use("/otp", verifyOtpRouter);
app.use("/landInspector", landInspectorRouter);
// app.use("/landInspector/login", landInspectorRouter);

// Import the UserDetails model
// const UserDetails = require("./models/userDetails");
// const {
//   createDummyUser,
//   createDummyLandDetails,
//   createDummyUsers,
// } = require("./utils/data");

// PORT
const port = process.env.PORT || 8000;

// MONGODB Connect
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true, // Deprecated in newer versions
  })
  .then(async () => {
    console.log("DB connected successfully");
    // Create the dummy user
    // await createDummyUsers();
    // await createDummyLandDetails();
    // Start the server after successful DB connection
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  })
  .catch((error) => {
    console.log("DB connection failed");
    console.log(error);
    process.exit(1);
  });
