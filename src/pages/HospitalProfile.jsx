import React, { useState } from "react";
import hospitalProfile from "../assets/img/slider/hospital.png";
import MyFooter from "../components/MyFooter";
import HospitalSideBar from "../components/HospitalSideBar";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect } from "react";
import { CChart } from "@coreui/react-chartjs";
import { BsSearch } from "react-icons/bs";
import { Icon } from "@iconify/react";
import { Link, useLocation } from "react-router-dom";

export default function HospitalProfile() {
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
        
      console.log(networkid);
      }
    };

    loadcontract();
  }, [wEb3]);

  //get acount
  const [account, setAccount] = useState();
  useEffect(() => {
    const getAccount = async () => {
      const accounts = await wEb3.web3.eth.getAccounts();
      setAccount(accounts);
    };
    getAccount();
  });

  const [Hospitaldate, setHospitaldate] = useState([]);
  const [Patientdate, setPatientdate] = useState(0);
  const [DoctorMedical_specialty, setDoctorMedical_specialty] = useState([]);
  const [Counts, setspecialtyCounts] = useState([]);
  const [Doctordat, setDoctordat] = useState(0);
  const uniqueMedicalSpecialties = new Set();
  const specialtyCounts = [];
  const [searchValue, setSearchValue] = useState("");
  const [Doctordate, setDoctordate] = useState([]);
  ///Date At TABLE for Doctors.
  const getalldoctors = async () => {
    const date = await Contract.methods
      .get_all_Doctors()
      .call({ from: acount });
    setDoctordate(date);
  };

  useEffect(() => {
    getalldoctors();
  }, [Contract]);

  const filteredDoctors = Doctordate.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      doctor.docAddress.includes(searchValue)
  );

  /////////////////////////////

  // Get doctor number at this hospital
  const getallDoctors = async () => {
    var total = 0;
    try {
      const date = await Contract.methods
        .get_all_Doctors()
        .call({ from: acount });
      for (var i = 0; i < date.length; i++) {
        if (date[i] && date[i].hospital_addr == account[0]) {
          total = total + 1;
          if (date[i].Medical_specialty) {
            uniqueMedicalSpecialties.add(date[i].Medical_specialty);
            const specialty = date[i].Medical_specialty;
            if (!specialtyCounts[specialty]) {
              specialtyCounts[specialty] = 0;
            }
            specialtyCounts[specialty]++;
          }
        }
      }
      const doctorMedicalSpecialties = [...uniqueMedicalSpecialties];
      setDoctorMedical_specialty(doctorMedicalSpecialties);
      setspecialtyCounts(specialtyCounts);
      setDoctordat(total);
    } catch (e) {
      console.log(e);
    }
  };
  getallDoctors();

  // Get patient number at this hospital

  const getallPatients = async () => {
    var Tot = 0;
    try {
      const date = await Contract.methods
        .get_all_Patients()
        .call({ from: acount });
      for (var a = 0; a < date.length; a++) {
        if (date[a] && date[a].hospital_addr === account[0]) {
          Tot = Tot + 1;
        }
        setPatientdate(Tot);
      }
    } catch (e) {
      console.log(e);
    }
  };

  getallPatients();

  ///get hospital profile.
  const getallhospitals = async () => {
    const date = await Contract.methods
      .get_hospita_by_address(acount)
      .call({ from: acount });

    setHospitaldate(date);
  };

  getallhospitals();

  ///get number of all  hospital profile.
  const [Hospitaldata, setHospitaldata] = useState([]);
  const getallHospitaldata = async () => {
    const date = await Contract.methods
      .get_all_hospitals()
      .call({ from: acount });

    setHospitaldata(date);
  };

  getallHospitaldata();
  /////////////////////////////////

  return (
    <>
      <main id="main" className="main">
        <HospitalSideBar
          tap1="Hospital Profile"
          tap2="Add Patient"
          tap3="Log Out"
        />

        <section id="counts" className="counts">
          <div className=" mb-5 mx-auto text-center">
            <span className="mx-auto text-center">
              <h2 className="mb-5 p-2 border-2 border-info border-bottom ">
                Hospital Dashboard
              </h2>
            </span>
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
                  <span>{Hospitaldata.length}</span>
                  <p>Registerd Hospitals</p>
                </div>
              </Link>

              <Link
                to={`/showAllDocrorsForHospital?account=${acount}`}
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
                  <span>{Doctordat}</span>
                  <p>Registered Doctors</p>
                </div>
              </Link>

              <Link
                to={`/showAllPatientForHospital?account=${acount}`}
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
                  <span>{Patientdate}</span>
                  <p>Registered Patients</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section className="section forms container px-5">
          <div className="card w-100 mx-auto align-center h-100">
            <div className="container  p-4">
              <div className=" p-1">
                <img
                  src={hospitalProfile}
                  alt="Profile"
                  height={100}
                  width={100}
                  className="rounded-circle border border-3 mx-auto d-block p-2"
                />
              </div>
              <div className="mx-auto p-2 align-center">
                <h3 className="card-title text-center mb-4">
                {Hospitaldate.name}
                </h3>

                <div className="card-body  text-muted opacity-75 ">
                  <div className="form-outline row mb-2">
                    <div className="col-xl-3">
                      <label
                        className="text-dark fs-5"
                        htmlFor="form3Example1cg"
                      >
                        Hospital Address:
                      </label>
                    </div>
                    <div className="col-xl-9">{Hospitaldate.place}</div>
                    <hr />
                  </div>

                  <div className="form-outline row mb-2">
                    <div className="col-xl-3">
                      <label
                        className="text-dark fs-5"
                        htmlFor="form3Example1cg"
                      >
                        Hospital Phone:
                      </label>
                    </div>
                    <div className="col-xl-9">{Hospitaldate.phone}</div>
                    <hr />
                  </div>

                  <div className="form-outline row mb-2">
                    <div className="col-xl-3">
                      <label
                        className="text-dark fs-5"
                        htmlFor="form3Example1cg"
                      >
                        Hospital Public Key:
                      </label>
                    </div>
                    <div className="col-xl-9">{Hospitaldate.addr}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-8">
              <div className="card mx-auto align-center p-4">
                <CChart
                  type="bar"
                  data={{
                    labels: ["Patients", "Doctors"],
                    datasets: [
                      {
                        label: "Number of Participants",
                        backgroundColor: ["#5096ad", "#075369"],
                        data: [Patientdate, Doctordat],
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

            <div className="col-xl-4">
              <div className="card mx-auto align-center">
                <div className="container p-5">
                  <CChart
                    className="mb-4"
                    type="radar"
                    data={{
                      labels: DoctorMedical_specialty,
                      datasets: [
                        {
                          label: "Doctor Medical Specialty",
                          backgroundColor: "#dff2f5",
                          borderColor: "#91b1b5",
                          pointBackgroundColor: "rgba(220, 220, 220, 1)",
                          pointBorderColor: "#91b1b5",
                          pointHighlightFill: "#91b1b5",
                          pointHighlightStroke: "rgba(220, 220, 220, 1)",
                          data: Object.values(Counts),
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
    </>
  );
}
