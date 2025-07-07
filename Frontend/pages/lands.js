import { useState, useEffect } from "react";
import { Button, Modal, Input, Pagination } from "antd";
import Navbar from "../components/navbar/Navbar";
import { Footer } from "../components/Footer";
import Router from "next/router";
import { UpdateData } from "../utils/updateData";

const { Search } = Input;

const Lands = () => {
  const [open, setOpen] = useState(false);
  const [allLands, setAllLands] = useState([]);
  const [filteredLands, setFilteredLands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // Changed loadings to loadingPID to track the specific PID that is loading
  const [loadingPID, setLoadingPID] = useState(null);
  const pageSize = 4; // Page size is correctly set to 4 for pagination.

  useEffect(() => {
    fetch("http://localhost:8000/SellingLand")
      .then((response) => response.json())
      .then((response) => {
        setAllLands(response); // Store the full list of lands

        // Filter to display only lands where request is false (available for buying).
        const availableLands = response.filter(
          (land) =>
            land?.request === false || land?.request === "false"
        );
        setFilteredLands(availableLands);
      })
      .catch((err) => console.error("Error fetching lands:", err));
  }, []);

  // Modified to accept a propertyID and set it as the loadingPID
  const enterLoading = (propertyID) => {
    setLoadingPID(propertyID);
  };

  async function RequestLand(PID) {
    enterLoading(PID); // Start loading for this specific PID
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    const address = accounts[0];

    await UpdateData(
      {
        Buyer_address: address,
        Document_Access: address,
        request: true,
        ProcessStatus: 2,
      },
      PID
    );

    // After the update, reset loading state and redirect
    setTimeout(() => {
      setLoadingPID(null); // Stop loading for this specific PID
      Router.push(`/request`);
    }, 3000);
  }

  const handleSearch = (value) => {
    setSearchTerm(value);
    const lowercasedValue = value.toLowerCase().trim();

    let result = allLands;

    if (lowercasedValue) {
      result = result.filter((land) => {
        const pid = land.propertyID?.toString().toLowerCase() || "";
        const owner = land.ownerAddress?.toLowerCase() || "";
        const location = land.Location?.toLowerCase() || "";
        // FIX: Include physicalSurveyNo in search criteria
        const surveyNo =
          land.physicalSurveyNo?.toString().toLowerCase() || "";

        return (
          pid === lowercasedValue || // Exact match for PID
          surveyNo === lowercasedValue || // Exact match for Survey No
          owner.includes(lowercasedValue) || // Inclusive search for owner
          location.includes(lowercasedValue) // Inclusive search for location
        );
      });
    }

    // After searching, apply the main page filter to show only available lands.
    const finalResult = result.filter(
      (land) => land?.request === false || land?.request === "false"
    );

    setFilteredLands(finalResult);
    setCurrentPage(1); // Reset to the first page after a new search.
  };

  // Slicing logic for pagination is correct.
  const paginatedLands = filteredLands.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="bg-slate-100 min-h-screen">
      <Navbar />

      {/* Modal 3D Viewer */}
      <Modal
        title="Land"
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={1000}
        okButtonProps={{ disabled: true, style: { display: "none" } }}
        cancelButtonProps={{
          disabled: true,
          style: { display: "none" },
        }}
      >
        <iframe
          width="100%"
          height="640"
          frameBorder="0"
          allow="xr-spatial-tracking; gyroscope; accelerometer"
          allowFullScreen
          scrolling="no"
          src="https://kuula.co/share/5hDfC?logo=1&info=1&fs=1&vr=0&sd=1&thumbs=1"
        ></iframe>
      </Modal>

      <div className="pt-[130px] w-[90%] mx-auto">
        {/* Search bar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">
            Available Lands Gallery
          </h1>
          <Search
            // FIX: Updated placeholder to include Survey No
            placeholder="Search by exact PID, Survey No, owner, or location"
            onSearch={handleSearch}
            enterButton
            allowClear
            style={{ width: 400 }}
          />
        </div>

        {/* Land cards */}
        <div className="flex flex-wrap justify-start gap-6">
          {paginatedLands.length === 0 ? (
            <p className="text-xl text-gray-600">No lands found.</p>
          ) : (
            paginatedLands.map(
              (
                data // Removed idx as key, using data.propertyID for a stable key
              ) => (
                <div
                  key={data.propertyID}
                  className="w-[48%] min-w-[300px]"
                >
                  <div className="h-[410px] rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition">
                    <img
                      onClick={() => setOpen(true)}
                      className="w-full h-48 object-cover cursor-pointer"
                      src={data.ImageURL}
                      alt="Land"
                    />
                    <div className="p-4 text-black">
                      <h2 className="font-bold">
                        Area: {data.Area} sq.m.
                      </h2>
                      <h3>Price: USD {data.Price}</h3>
                      <h3>PID: {data.propertyID}</h3>
                      <h3>Survey No: {data.physicalSurveyNo}</h3>
                      <h3>Owner: {data.ownerAddress}</h3>
                      <div className="flex justify-between mt-4">
                        <button
                          onClick={() => setOpen(true)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          3D View
                        </button>
                        <Button
                          type="primary"
                          // Check if the current land's propertyID matches the loadingPID
                          loading={loadingPID === data.propertyID}
                          onClick={() => RequestLand(data.propertyID)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Request Document
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )
          )}
        </div>

        {/* Pagination component renders correctly when there are more lands than the page size. */}
        {filteredLands.length > pageSize && (
          <div className="flex justify-center mt-10">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredLands.length}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Lands;
