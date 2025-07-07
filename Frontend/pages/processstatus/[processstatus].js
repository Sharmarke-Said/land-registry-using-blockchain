import { useState, useEffect } from "react";
import Navbar from "../../components/navbar/Navbar";
import {
  LoadingOutlined,
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Steps,
  Col,
  Row,
  Modal,
  Space,
  Table,
  Tag,
  Button,
  Form,
  Input,
} from "antd";
import { Footer } from "../../components/Footer";
import { useRouter } from "next/router";
import { UpdateData } from "../../utils/updateData";
import { ApproveNFT } from "../../utils/ContractPlugins";
import {
  CheckBalance,
  MakePayment,
  MaketokenPayment,
  PaymentBuyertoSeller,
} from "../../utils/makePayment";
import { Chat } from "../../PushModule/@pushprotocol/uiweb";

// Initialize variables outside the component.
// It's generally better to use React state for variables that cause re-renders,
// but for values derived from props/state and not directly triggering UI updates
// by themselves, this can be acceptable if handled carefully.
let id = "";
let Owner = "";
let Tokenid = "";
let PropertyID = "";
let SurveyNo = "";
let Area = "";
let Buyer_name = "";
let ownerAddress = "";
let Buyer_address = "";
let InspectorName = "";
let Document_Access = "";
let tokensend = "process";
let ProcessStatus;
let Document_Verify = "wait";
let Transaction = "wait";
let Ownership_Transfer = "wait";
let Price = "";
let request = false;
let ImageURL = "";
let DocumentURL = "";
let ICON = <LoadingOutlined />;
let PaymentStatus = false;
let address;
let support_address;
let BuyerTokenstatus = false;
let StampDutyTokenStatus = false;
let OwnerAdhar = "";
let OwnerContact = "";
let PaymentDuration = "";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "SELLER") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
];

const ProcessStatusComponent = () => {
  const [open3d, setOpen3d] = useState(false);
  const [openprice, setOpenprice] = useState(false);
  const [opennotify, setOpennotify] = useState(false);
  const [opendocument, setOpendocument] = useState(false);
  const [openchat, setOpenChat] = useState(false);
  const [Dataset, setDataset] = useState([]);
  const [accountAddress, setAccountAddress] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(""); // New state for dynamic message
  const [hasShownNotification, setHasShownNotification] =
    useState(false); // New state to prevent re-opening

  const router = useRouter();
  const { processstatus: queryPropertyID } = router.query;

  const getAddress = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccountAddress(accounts[0]);
      } catch (error) {
        console.error("Error connecting to Metamask:", error);
      }
    }
  };

  useEffect(() => {
    getAddress();
    FetchData();
  }, [queryPropertyID, accountAddress]);

  useEffect(() => {
    if (Dataset.length > 0 && queryPropertyID) {
      const currentLand = Dataset.find(
        (data) => data.propertyID == queryPropertyID
      );
      if (currentLand) {
        id = currentLand._id;
        Owner = currentLand.owner;
        Tokenid = currentLand.tokenID;
        PropertyID = currentLand.propertyID;
        SurveyNo = currentLand.physicalSurveyNo;
        Area = currentLand.Area;
        Buyer_name = currentLand.Buyer_name;
        ownerAddress = currentLand.ownerAddress;
        Buyer_address = currentLand.Buyer_address;
        Document_Access = currentLand.Document_Access;
        tokensend = currentLand.tokensend;
        ProcessStatus = currentLand.ProcessStatus;
        Document_Verify = currentLand.Document_Verify;
        Transaction = currentLand.Transaction;
        Ownership_Transfer = currentLand.Ownership_Transfer;
        Price = currentLand.Price;
        ImageURL = currentLand.ImageURL;
        request = currentLand.request;
        InspectorName = currentLand.InspectorName;
        DocumentURL = currentLand.DocumentURL;
        PaymentStatus = currentLand.PaymentStatus;
        BuyerTokenstatus = currentLand.BuyerTokenstatus;
        StampDutyTokenStatus = currentLand.StampDutyTokenStatus;
        OwnerAdhar = currentLand.OwnerAdhar;
        OwnerContact = currentLand.OwnerContact;
        PaymentDuration = currentLand.PaymentDuration;

        if (
          accountAddress &&
          accountAddress.toLowerCase() === ownerAddress.toLowerCase()
        ) {
          support_address = Buyer_address;
        } else if (accountAddress) {
          support_address = ownerAddress;
        }

        // Handle notification if process is finished
        if (ProcessStatus === 5 && !hasShownNotification) {
          const message =
            accountAddress.toLowerCase() ===
            ownerAddress.toLowerCase()
              ? "Thanks for Selling Land! ❤️"
              : "Thanks for Buying Land! ❤️";
          setNotificationMessage(message);
          setOpennotify(true);
          setHasShownNotification(true); // Mark that the notification has been shown
        } else if (ProcessStatus !== 5 && hasShownNotification) {
          // Reset hasShownNotification if ProcessStatus changes away from 5
          setHasShownNotification(false);
        }
      }
    }
  }, [
    Dataset,
    queryPropertyID,
    accountAddress,
    hasShownNotification,
  ]); // Add hasShownNotification to dependencies

  const onFinish = (values) => {
    console.log("Success:", values);
    UpdateData(
      { Price: parseInt(values.Price), ProcessStatus: 3 },
      PropertyID
    );
    alert(
      "Price Updated Successfully. Please wait for the transaction to be completed."
    );
    setOpenprice(false);
    FetchData();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  function SetIcon(stateno, currentProcessStatus) {
    if (stateno === currentProcessStatus) {
      return <LoadingOutlined />;
    } else if (stateno < currentProcessStatus) {
      return <SolutionOutlined />;
    } else {
      return <UserOutlined />;
    }
  }

  function SetStatus(stateno, currentProcessStatus) {
    if (stateno === currentProcessStatus) {
      return "process";
    } else if (stateno < currentProcessStatus) {
      return "finish";
    } else {
      return "wait";
    }
  }

  function FetchData() {
    fetch("http://localhost:8000/SellingLand/")
      .then((response) => response.json())
      .then((response) => {
        setDataset(response);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const data = [
    {
      key: "1",
      name: Owner,
      address: ownerAddress,
      tags: ["SELLER"],
    },
    {
      key: "2",
      name: Buyer_name,
      address: Buyer_address,
      tags: ["BUYER"],
    },
    {
      key: "3",
      name: InspectorName,
      address: "0x196ce4F6e2E731585B9ddc969fEd85F6cE4ED60F", // Hardcoded inspector address
      tags: ["LAND INSPECTOR"],
    },
  ];

  const isSeller =
    accountAddress.toLowerCase() === ownerAddress.toLowerCase();
  const isBuyer =
    accountAddress.toLowerCase() === Buyer_address.toLowerCase();

  return (
    <div>
      <Modal
        title="Notification"
        centered
        open={opennotify}
        width={600}
        closable={true}
        onCancel={() => setOpennotify(false)} // Added onCancel to handle closing by 'x'
        footer={null}
      >
        {notificationMessage} {/* Use the dynamic message */}
        <div className="text-center mt-4">
          <Button type="primary" onClick={() => setOpennotify(false)}>
            Close
          </Button>
        </div>
      </Modal>
      <Modal
        title="Update Price"
        centered
        open={openprice}
        onOk={() => setOpenprice(false)}
        onCancel={() => setOpenprice(false)}
        width={600}
        okButtonProps={{
          disabled: true,
          style: {
            display: "none",
          },
        }}
        cancelButtonProps={{
          disabled: true,
          style: {
            display: "none",
          },
        }}
      >
        <Form
          className="m-auto"
          name="Update Price"
          style={{
            maxWidth: 400,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Price"
            name="Price"
            rules={[
              {
                required: true,
                message: "Please input the new price!",
              },
            ]}
          >
            <Input type="number" min="0" />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white text-center font-bold mx-auto px-4 rounded"
            >
              Update Price
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Land"
        centered
        open={open3d}
        onOk={() => setOpen3d(false)}
        onCancel={() => setOpen3d(false)}
        width={1000}
        okButtonProps={{
          disabled: true,
          style: {
            display: "none",
          },
        }}
        cancelButtonProps={{
          disabled: true,
          style: {
            display: "none",
          },
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
      <Modal
        title="XMTP Chat"
        centered
        open={openchat}
        onOk={() => setOpenChat(false)}
        onCancel={() => setOpenChat(false)}
        width={1000}
        okButtonProps={{
          disabled: true,
          style: {
            display: "none",
          },
        }}
        cancelButtonProps={{
          disabled: true,
          style: {
            display: "none",
          },
        }}
      >
        <iframe
          width="100%"
          height="640"
          src="https://xmtp.chat/inbox"
          frameBorder="0"
        ></iframe>
      </Modal>
      <Modal
        title="Land Document"
        centered
        open={opendocument}
        onOk={() => setOpendocument(false)}
        onCancel={() => setOpendocument(false)}
        width={1000}
        okButtonProps={{
          disabled: true,
          style: {
            display: "none",
          },
        }}
        cancelButtonProps={{
          disabled: true,
          style: {
            display: "none",
          },
        }}
      >
        <object
          data={DocumentURL}
          type="application/pdf"
          width="100%"
          height="500px"
        >
          <p>
            Unable to display PDF file.{" "}
            <a href={DocumentURL}>Download</a> instead.
          </p>
        </object>
      </Modal>

      <Navbar />
      <div className="pt-[110px] rounded-2xl">
        <div className="w-[90%] shadow-2xl m-auto p-10 rounded-2xl">
          <Row className="mb-10">
            <Col span={12}>
              <div className="p-2 px-4">
                <h1 className="mt-0 font-bold">Area: {Area} sq.m.</h1>
                <h3 className="">Location: Mogadishu, Somalia</h3>
                <h3 className="">Price:USD {Price}</h3>
                <h3>PID: {PropertyID}</h3>
                <h3>Survey no: {SurveyNo}</h3>
                <h3>Owner: {Owner}</h3>
              </div>
              <div className="m-auto text-center">
                <button
                  onClick={() => setOpen3d(true)}
                  className="bg-blue-500 w-[30%] hover:bg-blue-700 text-white font-bold py-2 mx-2 px-4 my-2 rounded"
                >
                  3D Land View
                </button>
                <button
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-[30%] hover:bg-blue-700 mx-2 my-2"
                  onClick={() => setOpendocument(true)}
                >
                  View Document
                </button>
                <button
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-[30%] hover:bg-blue-700 mx-2 my-2"
                  onClick={() => setOpenChat(true)}
                >
                  XMTP Chat
                </button>

                {/* Conditional rendering for seller-only buttons */}
                {isSeller && (
                  <>
                    <button
                      className="bg-purple-600 text-white font-bold py-2 px-4 rounded w-[30%] hover:bg-purple-800 mx-2 my-2"
                      onClick={async () => {
                        const inspectorAddress =
                          "0x196ce4F6e2E731585B9ddc969fEd85F6cE4ED60F"; // Replace with actual inspector address if dynamic
                        console.log(
                          "Approving NFT for Inspector:",
                          inspectorAddress,
                          "Token ID:",
                          Tokenid
                        );
                        const success = await ApproveNFT(
                          inspectorAddress,
                          Tokenid
                        );
                        if (success) {
                          alert("NFT approved for land inspector ✅");
                        } else {
                          alert("Failed to approve NFT ❌");
                        }
                      }}
                    >
                      Approve Inspector
                    </button>

                    {ProcessStatus < 3 ? (
                      <button
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-[30%] hover:bg-blue-700 mx-2 my-2"
                        onClick={() => setOpenprice(true)}
                      >
                        Update Price
                      </button>
                    ) : (
                      <button
                        className="disabled:opacity-25 bg-blue-500 text-white font-bold py-2 px-4 rounded w-[30%] cursor-not-allowed mx-2 my-2"
                        disabled
                      >
                        Update Price
                      </button>
                    )}
                  </>
                )}

                {/* Conditional rendering for buyer-only buttons */}
                {isBuyer && (
                  <>
                    <button
                      className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-[30%] hover:bg-blue-700 mx-2 my-2"
                      onClick={() => CheckBalance()}
                    >
                      Check Balance
                    </button>
                    {PaymentStatus === true ? (
                      <button
                        disabled
                        className="bg-green-500 text-white font-bold py-2 px-4 rounded w-[30%] hover:bg-green-700 cursor-not-allowed mx-2 my-2"
                      >
                        Payment Done
                      </button>
                    ) : ProcessStatus === 3 ? ( // This button is for sending initial token to seller
                      <button
                        onClick={() =>
                          PaymentBuyertoSeller(
                            PropertyID,
                            Buyer_address,
                            ownerAddress,
                            Price
                          )
                        }
                        className="disabled:opacity-25 bg-green-500 text-white font-bold py-2 px-4 rounded w-[30%] hover:bg-green-700 mx-2 my-2"
                      >
                        Send Token ({parseInt(Price) * 0.05}LR)
                      </button>
                    ) : ProcessStatus < 4 ? (
                      <button
                        disabled
                        className="disabled:opacity-25 bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-not-allowed w-[30%] hover:bg-blue-700 mx-2 my-2"
                      >
                        Pending Processes
                      </button>
                    ) : StampDutyTokenStatus === false ? (
                      <button
                        onClick={() =>
                          MaketokenPayment(
                            PropertyID,
                            Buyer_address,
                            "0x7ED790A1Ac108b9A50e24f5c5E061df59e3673a7", // Inspector address for stamp duty
                            parseInt(Price) * 0.06
                          )
                        }
                        className="disabled:opacity-25 bg-green-500 text-white font-bold py-2 px-4 rounded w-[30%] hover:bg-green-700 mx-2 my-2"
                      >
                        Pay for Stamp Duty (
                        {parseInt(parseInt(Price) * 0.06)}LR)
                      </button>
                    ) : StampDutyTokenStatus === true ? (
                      <>
                        <button
                          onClick={() =>
                            MakePayment(
                              PropertyID,
                              Buyer_address,
                              ownerAddress,
                              Price
                            )
                          }
                          className="disabled:opacity-25 bg-green-500 text-white font-bold py-2 px-4 rounded w-[30%] hover:bg-green-700 mx-2 my-2"
                        >
                          Make Payment
                        </button>
                      </>
                    ) : (
                      <button
                        disabled
                        className="disabled:opacity-25 bg-green-500 text-white font-bold py-2 px-4 rounded cursor-not-allowed w-[30%] hover:bg-green-700 mx-2 my-2"
                      >
                        You are not allowed to Pay
                      </button>
                    )}
                  </>
                )}
              </div>
            </Col>
            <Col span={12}>
              <img
                onClick={() => setOpen3d(true)}
                className="m-auto w-[500px] h-48 rounded-2xl cursor-pointer hover:blur-sm"
                src={ImageURL}
                alt={ImageURL}
              />
              <br />
              <div className="text-center ">
                {ProcessStatus > 3 ? (
                  <p className="text-xl m-auto font-bold text-red-400">
                    Transaction Duration Till <br /> {PaymentDuration}
                  </p>
                ) : (
                  <></>
                )}
                {/* Cancel deal button visible to both, but perhaps with different implications */}
                <button
                  onClick={() => setOpen3d(true)} // This currently opens 3D view, needs to be updated for "Cancel deal" logic
                  className="bg-red-500 w-[30%] hover:bg-red-700 text-white font-bold py-2 mx-2 px-4 my-2 rounded"
                >
                  Cancel deal
                </button>
              </div>
            </Col>
          </Row>

          <Steps
            items={[
              {
                title: "1. Login / Verify",
                status: "finish",
                icon: <UserOutlined />,
              },
              {
                title: "2. Document Verification / Negotiation",
                status: SetStatus(2, ProcessStatus),
                icon: SetIcon(2, ProcessStatus),
              },
              {
                title: "3. Token Send",
                status: SetStatus(3, ProcessStatus),
                icon: SetIcon(3, ProcessStatus),
              },
              {
                title: "4. Transaction",
                status: SetStatus(4, ProcessStatus),
                icon: SetIcon(4, ProcessStatus),
              },
              {
                title: "5. Ownership Transfered",
                status: SetStatus(5, ProcessStatus),
                icon: <SmileOutlined />,
              },
            ]}
          />
          <Table
            className="mt-10"
            pagination={false}
            columns={columns}
            dataSource={data}
          />
        </div>
      </div>

      <Footer />
      {accountAddress && support_address && (
        <Chat
          account={accountAddress}
          supportAddress={support_address}
          apiKey="jVPMCRom1B.iDRMswdehJG7NpHDiECIHwYMMv6k2KzkPJscFIDyW8TtSnk4blYnGa8DIkfuacU0"
          env="staging"
        />
      )}
    </div>
  );
};

export default ProcessStatusComponent;
