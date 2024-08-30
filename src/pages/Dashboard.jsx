
import React from "react";
import MyNav from "../components/MyNav";
import MyFooter from "../components/MyFooter.jsx";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

import Web3 from "web3";
import MetaMaskOnboarding from "@metamask/onboarding";
import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [web3Api, setweb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });

  const [isDisabled, setDisabled] = React.useState(false);
  const [accounts, setAccounts] = React.useState([]);
  const onboarding = React.useRef();

  //IF the chain of blockchain change, it reload the page.
  const providerChanged = (provider) => {
    provider.on("chainChanged", (_) => window.location.reload());
  };

  //get WEB3

  useEffect(() => {
    const loadProvider = async () => {
      //get the provider from browser.
      const provider = await detectEthereumProvider();
      if (provider) {
        providerChanged(provider);

        // From the Provider, We get web3 object from it.
        setweb3Api({
          provider,
          web3: new Web3(provider),
        });
      } else {
        console.error("No Ethereum provider found. Please install MetaMask.");
      }
    };
    loadProvider();
  }, []);

  //get contract.
  const [Contract, setContract] = useState(null);

  useEffect(() => {
    const loadContract = async () => {
      if (web3Api.web3) {
        try {
          //Get the deployment contract
          const contractfile = await fetch("/contracts/MedRecChain.json");
          //Format json file
          const convert = await contractfile.json();
          //get from web3, get the chain network id that is currently running.
          const networkid = await web3Api.web3.eth.net.getId();
          const contractAddress = convert.networks[networkid]?.address;

          if (contractAddress) {
            const deployedContract = new web3Api.web3.eth.Contract(
              convert.abi,
              contractAddress
            );
            setContract(deployedContract);
          } else {
            console.error("Contract not found on the current network.");
          }
        } catch (error) {
          console.error("Failed to load contract:", error);
        }
      }
    };
    loadContract();
  }, [web3Api.web3]);

  const loadCont = async () => {
    if (Contract && Contract.methods) {
      try {
        // Your logic here to interact with the contract methods
      } catch (error) {
        console.error("Error interacting with the contract:", error);
      }
    } else {
      console.error("Contract or methods are not available.");
    }
  };

  return (
    <>
      <MyNav />
      <main>
        <div className="container">
          <div className="section-title">
            <h2>Welcome to MedRecChain</h2>
            <p>Manage your medical records on the blockchain securely.</p>
          </div>
          <div className="row">
            <Link
              rel="stylesheet"
              disabled={isDisabled}
              onClick={() => loadCont(1)}
              className="col-xl-5 icon-box card requests p-4 py-5 bg-opacity-50"
            >
              <div className="icon">
                <Icon icon="healthicons:hospital-outline" className="i" />
              </div>
              <h4 className="">Hospitals</h4>
              <p className="">
                Each hospital has its own doctors that can be added to the
                network.{" "}
              </p>
            </Link>

            <Link
              rel="stylesheet"
              disabled={isDisabled}
              onClick={() => loadCont(3)}
              className="col-xl-5 icon-box card requests p-4 py-5 bg-opacity-50"
            >
              <div className="icon">
                <Icon icon="healthicons:doctor-male" className="i" />
              </div>
              <h4 className="">Doctors</h4>
              <p className="">
                Doctors can request to add records to patient medical record,
                view their records and modify them.{" "}
              </p>
            </Link>

            <Link
              rel="stylesheet"
              disabled={isDisabled}
              onClick={() => loadCont(4)}
              className="col-xl-5 icon-box card requests p-4 py-5 bg-opacity-50"
            >
              <div className="icon">
                <Icon icon="mdi:patient" className="i" />
              </div>
              <h4 className="">Patients</h4>
              <p className="">
                Patient has all control on his medical record, can accept or
                reject doctor requests, or give permissions to access his
                record.{" "}
              </p>
            </Link>
          </div>
        </div>
      </main>

      <MyFooter />

      <script src="../assets/js/main.js"></script>
    </>
  );
};
export default Dashboard;
