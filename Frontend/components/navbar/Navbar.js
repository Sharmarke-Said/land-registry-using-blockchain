// components/navbar/Navbar.js
import React from "react";
import Metamask from "../metamask";
import Link from "next/link";
import { useRouter } from "next/router";
import { Chat } from "../../PushModule/@pushprotocol/uiweb";

const Navbar = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  // Define the paths where "My lands" should NOT be visible
  const excludedPaths = ["/dashboard", "/inspectordashboard"];
  const showMyLands = !excludedPaths.includes(currentPath);

  return (
    <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 shadow-lg fixed w-full z-50 bg-opacity-80">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <Link href="/dashboard" className="flex items-center">
          {" "}
          {/* Changed <a> to <Link> */}
          <div className="flex flex-row items-center gap-1">
            {/* <Image src="/images/logo.png" alt="Vivid logo" height="40" width="40" /> */}
            <div className="text-3xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-blue">
                LAND CHAIN
              </span>
            </div>
          </div>
        </Link>
        <div className="flex md:order-2">
          {!(<Metamask />) ? (
            <>
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 "
              >
                Wallet Connect
              </button>
            </>
          ) : (
            <>
              <Link
                type="button"
                href="/request"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-4"
              >
                Requests
              </Link>
              {/* Conditionally render "My lands" tab */}
              {showMyLands && (
                <Link
                  type="button"
                  href="/mylands"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-4"
                >
                  My lands
                </Link>
              )}
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 "
              >
                {<Metamask />}
              </button>
            </>
          )}

          <button
            data-collapse-toggle="navbar-cta"
            type="button"
            className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
            aria-controls="navbar-cta"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <Chat
        account="0x1D853e5a1eE20b61dc3187558Eda7F3b8eD14AB7" //user address
        supportAddress="0x7ED790A1Ac108b9A50e24f5c5E061df59e3673a7" //support address
        apiKey="jVPMCRom1B.iDRMswdehJG7NpHDiECIHwYMMv6k2KzkPJscFIDyW8TtSnk4blYnGa8DIkfuacU0"
        env="staging"
      />
    </nav>
  );
};

export default Navbar;
