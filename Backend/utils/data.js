const landDetails = require("../models/landDetails");
const userDetails = require("../models/userDetails");

// Define the dummy users you want to create
const dummyUsers = [
  {
    aadharNo: "123456789012",
    phoneNo: "1234567890",
    name: "Dummy User",
    email: "dummyuser@example.com",
    otp: 123456,
    otpValidityMinutes: 1500, // 1500 minutes
  },
  {
    aadharNo: "123456789013",
    phoneNo: "1234567891",
    name: "Dummy User 2",
    email: "dummyuser2@example.com",
    otp: 123456,
    otpValidityMinutes: 1500, // 1500 minutes
  },
];

// Function to create dummy users
const createDummyUsers = async () => {
  try {
    // Iterate over each user in the users array
    for (const user of dummyUsers) {
      const { aadharNo, phoneNo, name, email, otp, otpValidityMinutes } = user;

      // Check if the user already exists based on aadharNo
      const existingUser = await userDetails.findOne({ aadharNo });

      if (existingUser) {
        console.log(
          `User with Aadhar No ${aadharNo} already exists:`,
          existingUser
        );
      } else {
        // Create a new user instance
        const newUser = new userDetails({
          aadharNo,
          phoneNo: phoneNo.toString(), // Ensure phoneNo is a string
          name,
          email,
          otp,
          otpValidTill: Date.now() + otpValidityMinutes * 60 * 1000, // Convert minutes to milliseconds
        });

        // Save the new user to the database
        await newUser.save();
        console.log(`Dummy user created successfully:`, newUser);
      }
    }
  } catch (error) {
    console.error("Error creating dummy users:", error);
  }
};

// Function to create five dummy land details
const createDummyLandDetails = async () => {
  try {
    const dummyLands = [
      {
        owner: "Dummy User 1",
        location: {
          area: "Green Acres",
          city: "Dummy City 1",
          state: "Dummy State 1",
        },
        areaOfLand: 5000,
        pricePerSqFeet: 100,
        propertyID: 1001,
        physicalSurveyNo: 2001,
        status: false,
        OwnerAdhar: "123456789012",
        OwnerContact: "1234567890",
        TokenID: 3001,
      },
      {
        owner: "Dummy User 2",
        location: {
          area: "Sunset Villas",
          city: "Dummy City 2",
          state: "Dummy State 2",
        },
        areaOfLand: 7500,
        pricePerSqFeet: 150,
        propertyID: 1002,
        physicalSurveyNo: 2002,
        status: false,
        OwnerAdhar: "123456789012",
        OwnerContact: "1234567890",
        TokenID: 3002,
      },
      {
        owner: "Dummy User 3",
        location: {
          area: "Riverfront Estate",
          city: "Dummy City 3",
          state: "Dummy State 3",
        },
        areaOfLand: 6000,
        pricePerSqFeet: 120,
        propertyID: 1003,
        physicalSurveyNo: 2003,
        status: false,
        OwnerAdhar: "123456789012",
        OwnerContact: "1234567890",
        TokenID: 3003,
      },
      {
        owner: "Dummy User 4",
        location: {
          area: "Mountain View",
          city: "Dummy City 4",
          state: "Dummy State 4",
        },
        areaOfLand: 8000,
        pricePerSqFeet: 200,
        propertyID: 1004,
        physicalSurveyNo: 2004,
        status: false,
        OwnerAdhar: "123456789012",
        OwnerContact: "1234567890",
        TokenID: 3004,
      },
      {
        owner: "Dummy User 5",
        location: {
          area: "Lakeside Paradise",
          city: "Dummy City 5",
          state: "Dummy State 5",
        },
        areaOfLand: 6500,
        pricePerSqFeet: 180,
        propertyID: 1005,
        physicalSurveyNo: 2005,
        status: false,
        OwnerAdhar: "123456789012",
        OwnerContact: "1234567890",
        TokenID: 3005,
      },
    ];

    for (const land of dummyLands) {
      const existingLand = await landDetails.findOne({
        propertyID: land.propertyID,
      });

      if (existingLand) {
        // console.log(
        //   `Dummy land with propertyID ${land.propertyID} already exists:`,
        //   existingLand
        // );
      } else {
        const dummyLand = new landDetails(land);
        await dummyLand.save();
        console.log(
          `Dummy land with propertyID ${land.propertyID} created successfully:`,
          dummyLand
        );
      }
    }
  } catch (error) {
    console.error("Error creating dummy land details:", error);
  }
};

module.exports = { createDummyUsers, createDummyLandDetails };
