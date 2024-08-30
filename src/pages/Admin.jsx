import React from "react";
import AdminSideBar from "../components/AdminSideBar";
import MyFooter from "../components/MyFooter";
import { FaBed, FaHospitalAlt, FaStethoscope } from "react-icons/fa";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect, useState } from "react";
import { CChart } from "@coreui/react-chartjs";
import { Icon } from "@iconify/react";
import { Link, useLocation } from "react-router-dom";

// import * as echarts from 'echarts';

export default function Admin() {
  const options = {
    indexAxis: "y",
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const acount = searchParams.get("account");
  const [Contract, setContract] = useState(null);

  const [wEb3, setwEb3] = useState({
    provider: null,
    web3: null,
  });

  const providerChanged = (provider) => {
    provider.on("chainChanged", (_) => window.location.reload());
  };
  const accountsChanged = (provider) => {
    provider.on("accountsChanged", (_) => window.location.replace("/"));
  };

  //get WEB3
  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        providerChanged(provider);
        accountsChanged(provider);
        setwEb3({
          provider,
          web3: new Web3(provider),
        });
      }
    };
    loadProvider();
  }, []);

  //get Contract
  useEffect(() => {
    const loadcontract = async () => {
      const contractfile = await fetch("/contracts/MedRecChain.json");
      const convert = await contractfile.json();
      const networkid = await wEb3.web3.eth.net.getId();
      const networkDate = convert.networks[networkid];
      if (networkDate) {
        const abi = convert.abi;
        const address = convert.networks[networkid].address;
        const contract = await new wEb3.web3.eth.Contract(abi, address);

        setContract(contract);
      } else {
        window.alert("only ganache");
        window.location.reload();
        console.log(networkid);
      }
    };

    loadcontract();
  }, [wEb3]);

  ///get Number of all Hospitals at system. (By Lenght)
  const [Hospitaldate, setHospitaldate] = useState([]);
  const [Hospitalname, setHospitalname] = useState([]);
  const Hospitalnames = [];

  const getallhospitals = async () => {
    const date = await Contract.methods
      .get_all_hospitals()
      .call({ from: acount });
    for (var i = 0; i < date.length; i++) {
      Hospitalnames[i] = date[i].name;
    }
    setHospitalname(Hospitalnames);
    setHospitaldate(date);
  };
  getallhospitals();

  ///get Number of all Doctors at system.(By Lenght)

  const [Doctordate, setDoctordate] = useState([]);
  const [DocNUM_For_Hos, setDocNUM_For_Hos] = useState([]);
  const DoctorNUM_For_Hos = [];
  const getallDoctors = async () => {
    const doc = await Contract.methods.get_all_Doctors().call({
      from: acount,
    });
    setDoctordate(doc);
    // for every hospital.
    for (var a = 0; a < Hospitaldate.length; a++) {
      var num = 0;
      for (var i = 0; i < doc.length; i++) {
        if (doc[i].hospital_addr == Hospitaldate[a].addr) {
          num++;
        }
      }
      DoctorNUM_For_Hos[a] = num;
      setDocNUM_For_Hos(DoctorNUM_For_Hos);
    }
  };

  getallDoctors();

  ///get Number of all patients at system.

  const [Recorddate, setRecorddate] = useState();
  const getallrecord = async () => {
    const date = await Contract.methods
      .get_record_number()
      .call({ from: acount });
    setRecorddate(date);
  };

  getallrecord();

  // get all patients numder
  const [Patientdate, setPatientdate] = useState([]);
  const [PatientNUM_For_Hos, setPatientNUM_For_Hos] = useState([]);
  const Patient_NUM_For_Hos = [];
  ///Date At TABLE for Patients.
  const getallPatients = async () => {
    const pat = await Contract.methods
      .get_all_Patients()
      .call({ from: acount });
    setPatientdate(pat);
    // for every hospital.
    for (var a = 0; a < Hospitaldate.length; a++) {
      var num = 0;
      for (var i = 0; i < pat.length; i++) {
        if (pat[i].hospital_addr == Hospitaldate[a].addr) {
          num++;
        }
      }
      Patient_NUM_For_Hos[a] = num;
      setPatientNUM_For_Hos(Patient_NUM_For_Hos);
    }
  };

  getallPatients();

  ///////////////////

  return (
    <>
      <main id="main" className="main">
        <AdminSideBar
          tap1=" Hospitals"
          tap2="Doctors"
          tap3="Home"
          tap4="Log Out"
        />

        <section id="counts" className="counts">
          <div className=" mb-5 mx-auto text-center">
            <h2 className="mb-5 pb-5 ">Admin Dashboard</h2>
          </div>
          <div className="container">
            <div className="row justify-content-center">
              <Link
                to={`/registeredHospitals?account=${acount}`}
                className="col-lg-3 col-md-6 mt-5 mt-md-0"
              >
                <div className="count-box">
                  <div className="icons">
                    <Icon
                      icon="fa-regular:hospital"
                      color="white"
                      width="24"
                      height="24"
                    />
                  </div>
                  <span>{Hospitaldate.length}</span>
                  <p>Registerd Hospitals</p>
                </div>
              </Link>

              <Link
                to={`/registeredDoctors?account=${acount}`}
                className="col-lg-3 col-md-6 mt-5 mt-lg-0"
              >
                <div className="count-box">
                  <div className="icons">
                    <Icon
                      icon="healthicons:doctor-male"
                      color="white"
                      width="24"
                      height="24"
                    />
                  </div>
                  <span>{Doctordate.length}</span>
                  <p>Registered Doctors</p>
                </div>
              </Link>

              <Link
                to={`/registeredPatients?account=${acount}`}
                className="col-lg-3 col-md-6 mt-5 mt-lg-0"
              >
                <div className="count-box">
                  <div className="icons">
                    <Icon
                      icon="mdi:patient"
                      color="white"
                      width="24"
                      height="24"
                    />
                  </div>
                  <span>{Patientdate.length}</span>
                  <p>Registered Patients</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section className=" py-2 px-5 bg-info-light position-relative overflow-hidden mx-5  ">
          <div className="row">
            <div className="forms col-xl-7">
              <div className="card py-5">
                <div className="container px-5 pt-5 pb-5">
                  <br />
                  <CChart
                    className="mb-4"
                    type="bar"
                    data={{
                      labels: ["Patients", "Patient Records"],
                      datasets: [
                        {
                          label:
                            "The number of medical records compared to the number of patients",
                          backgroundColor: "#24a6a5",
                          data: [Patientdate.length, Recorddate],
                          barPercentage: 5,
                          barThickness: 50,
                          maxBarThickness: 50,
                          minBarLength: 2,
                        },
                      ],
                    }}
                    labels="months"
                  />
                </div>
              </div>
            </div>

            <div className="forms col-xl-5 ">
              <div className="card">
                <div className="container p-5">
                  <CChart
                    type="doughnut"
                    data={{
                      labels: ["Hospitals", "Doctors", "Patients"],
                      datasets: [
                        {
                          backgroundColor: ["#e7c778", "#0dcaf0", "#e9abe7"],

                          data: [
                            Hospitaldate.length,
                            Doctordate.length,
                            Patientdate.length,
                          ],
                        },
                      ],
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="forms col-xl-12">
              <div className="card">
                <div className="container p-5">
                  <CChart
                    type="bar"
                    options={options}
                    data={{
                      labels: Hospitalname,
                      datasets: [
                        {
                          label: "Doctors",
                          backgroundColor: "#7fe4ed",
                          borderColor: "rgba(220, 220, 220, 1)",
                          pointBackgroundColor: "rgba(220, 220, 220, 1)",
                          pointBorderColor: "#fff",
                          data: DocNUM_For_Hos,
                          barPercentage: 5,
                          barThickness: 50,
                          maxBarThickness: 50,
                          minBarLength: 2,
                        },
                        {
                          label: "Patients",
                          backgroundColor: "#c17bf6",
                          borderColor: "rgba(151, 187, 205, 1)",
                          pointBackgroundColor: "rgba(151, 187, 205, 1)",
                          pointBorderColor: "#fff",
                          data: PatientNUM_For_Hos,
                          barPercentage: 5,
                          barThickness: 50,
                          maxBarThickness: 50,
                          minBarLength: 2,
                        },
                      ],
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <div className="side-footer">
        <MyFooter />
      </div>
      <script src="../assets/js/main.js"></script>
    </>
  );
}
