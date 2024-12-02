import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FormGroup, Label, CardBody, Spinner, Input, Form } from "reactstrap";
import * as moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import { Card } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { token, url as baseUrl } from "../../../../../api";

import "react-phone-input-2/lib/style.css";
import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import "react-phone-input-2/lib/style.css";
import { Button } from "semantic-ui-react";
import { Modal } from "react-bootstrap";
import { Label as LabelRibbon, Message } from "semantic-ui-react";
import PhoneInput from "react-phone-input-2";
import Select from "react-select";
// import { getAcount } from "../../../../utility";
import Cookies from "js-cookie";
import "react-dual-listbox/lib/react-dual-listbox.css";
import {
  getAllStateByCountryId,
  getAllCountry,
  getAllProvinces,
  getAllGenders,
  alphabetOnly,
} from "../../../../../utility";
import { calculate_age } from "../../../utils";
import { useHistory } from "react-router-dom";
import DualListBox from "react-dual-listbox";

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(20),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  cardBottom: {
    marginBottom: 20,
  },
  Select: {
    height: 45,
    width: 300,
  },
  button: {
    margin: theme.spacing(1),
  },
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
    "& .card-title": {
      color: "#fff",
      fontWeight: "bold",
    },
    "& .form-control": {
      borderRadius: "0.25rem",
      height: "41px",
    },
    "& .card-header:first-child": {
      borderRadius: "calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0",
    },
    "& .dropdown-toggle::after": {
      display: " block !important",
    },
    "& select": {
      "-webkit-appearance": "listbox !important",
    },
    "& p": {
      color: "red",
    },
    "& label": {
      fontSize: "14px",
      color: "#014d88",
      fontWeight: "bold",
    },
  },
  demo: {
    backgroundColor: theme.palette.background.default,
  },
  inline: {
    display: "inline",
  },
  error: {
    color: "#f85032",
    fontSize: "12.8px",
  },
  success: {
    color: "green",
    fontSize: "12.8px",
    fontWeight: "bold",
  },
}));

const RefferralUnit = (props) => {
  // console.log("props.patientObj", props.patientObj);
  const patientObj = props.patientObj;
  const classes = useStyles();
  const [errors, setErrors] = useState({});
  const [ageDisabled, setAgeDisabled] = useState(true);
  const [saving, setSaving] = useState(false);
  let temp = { ...errors };
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen(!open);
  const [setting, setSetting] = useState([]);
  const [hospitalNumStatus, setHospitalNumStatus] = useState(false);
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);

  const [states, setStates] = useState([]);
  const [genders, setGenders] = useState([]);
  const [hivStatus, setHivStatus] = useState([]);
  const [serviceNeeded, setServiceNeeded] = useState([]);

  const [facilityName, setFacilityName] = useState(Cookies.get("facilityName"));
  const [allFacilities, setAllFacilities] = useState([]);
  // console.log(Cookies.get("facilityName"));
  const [statesOfTheReceivingFacility, setStateOfTheReceivingFacility] =
    useState([]);
  const [lgasOfTheReceivingFacility, setLgasOfTheReceivingFacility] = useState(
    []
  );
  const [receivingFacilities, setReceivingFacilities] = useState([]);
  const [receivingFacility, setReceivingFacility] = useState([]);
  const [selectedReceivingState, setSelectedReceivingState] = useState({});
  const [selectedReceivingFacility, setSelectedReceivingFacility] = useState(
    {}
  );
  const [selectedReceivingLga, setSelectedReceivingLga] = useState({});
  const history = useHistory();
  const [selectedServiceNeeded, setSelectServiceNeeded] = useState([]);

  const [payload, setPayload] = useState({
    dateVisit: props?.formInfo?.dateVisit,
    firstName: props?.patientObj?.personResponseDto?.firstName,
    middleName: props?.patientObj?.personResponseDto?.otherName,
    lastName: props?.patientObj?.personResponseDto?.surname,
    hospitalNumber:
      props.patientObj?.personResponseDto?.identifier?.identifier[0]?.value,
    countryId: "1",
    stateId: props?.patientObj?.personResponseDto?.address?.address[0]?.stateId,
    province: Number(
      props?.patientObj?.personResponseDto?.address?.address[0]?.district
    ),
    address: props?.patientObj?.personResponseDto?.address?.address[0]?.city,
    landmark: "",
    phoneNumber:
      props?.patientObj?.personResponseDto?.contactPoint?.contactPoint[0]
        ?.value,
    sexId: props?.patientObj?.personResponseDto?.gender?.id,
    dob: props?.patientObj.personResponseDto?.dateOfBirth,
    age: "",
    dateOfBirth: props?.patientObj.personResponseDto?.dateOfBirth,
    hivStatus: props?.patientObj?.hivTestResult2
      ? props?.patientObj?.hivTestResult2
      : props?.patientObj?.hivTestResult
      ? props?.patientObj?.hivTestResult
      : "",
    referredFromFacility: props?.formInfo?.referredFromFacility,
    nameOfPersonReferringClient: props?.formInfo?.nameOfPersonReferringClient,
    nameOfReferringFacility: props?.formInfo?.nameOfReferringFacility,
    addressOfReferringFacility: props?.formInfo?.addressOfReferringFacility,
    phoneNoOfReferringFacility: props?.formInfo?.phoneNoOfReferringFacility,
    referredTo: props?.formInfo?.referredTo,
    nameOfContactPerson: props?.formInfo?.nameOfContactPerson,
    nameOfReceivingFacility: props?.formInfo?.nameOfReceivingFacility,
    addressOfReceivingFacility: props?.formInfo?.addressOfReceivingFacility,
    phoneNoOfReceivingFacility: props?.formInfo?.phoneNoOfReceivingFacility,
    isDateOfBirthEstimated: false,
    serviceNeeded: props?.formInfo?.serviceNeeded,
    comments: props?.formInfo?.comments,
    receivingFacilityStateName: props.formInfo.receivingFacilityStateName,
    receivingFacilityLgaName: props.formInfo.receivingFacilityLgaName,
    htsClientId: props && props.patientObj ? props.patientObj?.id : "",
    htsClientUuid: props && props.patientObj ? props.patientObj?.uuid : "",
  });

  // console.log("PAYLOAD", payload);
  // console.log("props.formInfo", props.formInfo);
  const loadGenders = useCallback(async () => {
    getAllGenders()
      .then((response) => {
        setGenders(response);
      })
      .catch(() => {});
  }, []);
  const getReceivinglga = (id) => {
    getAllProvinces(id)
      .then((res) => {
        setLgasOfTheReceivingFacility(res);
      })
      .catch((e) => {});
  };

  const getProvincesWithId = (id) => {
    getAllProvinces(id)
      .then((res) => {
        setProvinces(res);
      })
      .catch((e) => {});
  };
  useEffect(() => {
    loadGenders();
    getCountry();
    getStateByCountryId();

    if (props?.patientObj?.personResponseDto?.address?.address[0]?.stateId) {
      getProvincesWithId(
        props?.patientObj?.personResponseDto?.address?.address[0]?.stateId
      );
    }
  }, []);

  //Get list of State
  const getStateByCountryId = () => {
    getAllStateByCountryId()
      .then((res) => {
        setStates(res);

        let ans = res.filter((each, index) => {
          return (
            each.name.toLowerCase() ===
            props.formInfo.receivingFacilityStateName.toLowerCase()
          );
        });

        getReceivinglga(ans[0].id);
      })
      .catch(() => {});
  };
  const checkPhoneNumberBasic = (e, inputName) => {
    if (e) {
      setErrors({ ...errors, phoneNumber: "" });
    }
    const limit = 10;

    if (inputName === "phoneNumber") {
      setPayload({ ...payload, phoneNumber: e.slice(0, limit) });
    } else if (inputName === "phoneNoOfReferringFacility") {
      setPayload({
        ...payload,
        phoneNoOfReferringFacility: e.slice(0, limit),
      });
    } else if (inputName === "phoneNoOfReceivingFacility") {
      setPayload({ ...payload, phoneNoOfReceivingFacility: e.slice(0, limit) });
    }
  };

  // handle Facility Name to slect drop down
  const handleInputChangeObject = (e) => {
    // console.log(e);
    setPayload({
      ...payload,
      nameOfReceivingFacility: e.name,
      addressOfReceivingFacility: e.parentParentOrganisationUnitName,
      // lgaTransferTo: e.parentOrganisationUnitName,
    });
    setErrors({ ...errors, nameOfReceivingFacility: "" });
    // setSelectedState(e.parentParentOrganisationUnitName);
    // setSelectedLga(e.parentOrganisationUnitName);
  };

  //fetch province
  const getProvinces = (e) => {
    const stateId = e.target.value;
    if (e.target.value) {
      setErrors({ ...errors, stateId: "" });
    }
    setPayload({ ...payload, stateId: e.target.value });
    getAllProvinces(stateId)
      .then((res) => {
        setProvinces(res);
      })
      .catch((e) => {});
  };
  const getCountry = () => {
    getAllCountry()
      .then((res) => {
        setCountries(res);
      })
      .catch((e) => {
        // console.log(e);
      });

    // console.log(response);
  };

  const checkNumberLimit = (e) => {
    const limit = 11;
    const acceptedNumber = e.slice(0, limit);
    return acceptedNumber;
  };
  const handleInputChangePhoneNumber = (e, inputName) => {
    const limit = 11;
    const NumberValue = checkNumberLimit(e.target.value.replace(/\D/g, ""));
    setPayload({ ...payload, [inputName]: NumberValue });
  };

  // ########################################################################
  const loadStates = () => {
    axios
      .get(`${baseUrl}organisation-units/parent-organisation-units/1`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data) {
          setStateOfTheReceivingFacility(response.data);
        }
      })
      .catch((e) => {
        // console.log("Fetch states error" + e);
      });
  };

  const loadLGA = (id) => {
    axios
      .get(`${baseUrl}organisation-units/parent-organisation-units/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data) {
          setLgasOfTheReceivingFacility(response.data);
        }
      })
      .catch((e) => {
        // console.log("Fetch LGA error" + e);
      });
  };

  const loadFacilities = (id) => {
    axios
      .get(`${baseUrl}organisation-units/parent-organisation-units/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data) {
          setReceivingFacilities(response.data);
        }
      })
      .catch((e) => {
        // console.log("Fetch Facilities error" + e);
      });
  };

  const SERVICE_NEEDED = () => {
    axios
        .get(`${baseUrl}application-codesets/v2/SERVICE_PROVIDED`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data) {
            // create array of objects from the response
            const serviceNeeded = response.data.map((service) => {
              return {
                value: service.display,
                label: service.display
              }
            });
            setServiceNeeded(serviceNeeded);
            // console.log("serviceNeeded", serviceNeeded)
          }
        })
        .catch((e) => {
          // handle error
        });
  };


  useEffect(() => {
    axios.get(`${baseUrl}hts-client-referral/${props.row.row.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
        .then((response) => {
          // Convert the serviceNeeded object into an array of its values
          const serviceNeededArray = Object.values(response.data.serviceNeeded);

          // Set the serviceNeededArray to selectedServiceNeeded state
          setSelectServiceNeeded(serviceNeededArray);
        })
        .catch((error) => {
          // Handle error...
        });
  }, []);

  useEffect(() => {
    loadStates();
    SERVICE_NEEDED();

    loadLGA();
  }, []);

  // ###########################################################################
  //Get list of HIV STATUS ENROLLMENT

  const handleInputChange = (e) => {
    setErrors({ ...temp, [e.target.name]: "" });

    if (e.target.name === "firstName" && e.target.value !== "") {
      const name = alphabetOnly(e.target.value);
      setPayload({ ...payload, [e.target.name]: name });
    } else if (e.target.name === "lastName" && e.target.value !== "") {
      const name = alphabetOnly(e.target.value);
      setPayload({ ...payload, [e.target.name]: name });
    } else if (e.target.name === "middleName" && e.target.value !== "") {
      const name = alphabetOnly(e.target.value);
      setPayload({ ...payload, [e.target.name]: name });
    } else if (
      e.target.name === "nameOfContactPerson" &&
      e.target.value !== ""
    ) {
      const name = alphabetOnly(e.target.value);
      setPayload({ ...payload, [e.target.name]: name });
    } else if (
      e.target.name === "nameOfPersonReferringClient" &&
      e.target.value !== ""
    ) {
      const name = alphabetOnly(e.target.value);
      setPayload({ ...payload, [e.target.name]: name });
    } else if (e.target.name === "hospitalNumber" && e.target.value !== "") {
      async function getHosiptalNumber() {
        const hosiptalNumber = e.target.value;
        const response = await axios.post(
          `${baseUrl}patient/exist/hospital-number`,
          hosiptalNumber,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "text/plain",
            },
          }
        );
        if (response.data !== true) {
          setHospitalNumStatus(false);
          errors.hospitalNumber = "";
        } else {
          errors.hospitalNumber = "";
          toast.error("Error! Hosiptal Number already exist");
          setHospitalNumStatus(true);
        }
      }

      getHosiptalNumber();
    } else {
      setPayload({ ...payload, [e.target.name]: e.target.value });
    }
  };

  //Date of Birth and Age handle
  const handleDobChange = (e) => {
    if (e.target.value) {
      const today = new Date();
      const birthDate = new Date(e.target.value);
      let age_now = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (age_now <= 0 && m < 0 && today.getDate() < birthDate.getDate()) {
        age_now--;
      }
      // if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      //   age_now--;
      // }
      payload.age = age_now;

      //setpayload({...payload, age: age_now});
    } else {
      setPayload({ ...payload, age: "" });
    }
    setPayload({ ...payload, [e.target.name]: e.target.value });

    setPayload({ ...payload, dob: e.target.value });
    if (payload.age !== "" && payload.age <= 15) {
      // props.setHideOtherMenu(true);
    } else if (payload.age !== "" && payload.age > 15) {
      // props.setHideOtherMenu(true);
    } else {
      // props.setHideOtherMenu(true);
    }

    if (payload.age !== "" && payload.age >= 85) {
      toggle();
    }
  };
  const handleDateOfBirthChange = (e) => {
    if (e.target.value == "Actual") {
      payload.isDateOfBirthEstimated = false;
      setAgeDisabled(true);
    } else if (e.target.value == "Estimated") {
      payload.isDateOfBirthEstimated = true;
      setAgeDisabled(false);
    }
  };
  const handleAgeChange = (e) => {
    if (!ageDisabled && e.target.value) {
      if (e.target.value !== "" && e.target.value >= 85) {
        toggle();
      }
      if (e.target.value !== "" && e.target.value <= 15) {
        props.setHideOtherMenu(false);
      } else if (e.target.value !== "" && e.target.value > 15) {
        props.setHideOtherMenu(true);
      } else {
        props.setHideOtherMenu(true);
      }
      const currentDate = new Date();
      currentDate.setDate(15);
      currentDate.setMonth(5);
      const estDob = moment(currentDate.toISOString());
      const dobNew = estDob.add(e.target.value * -1, "years");
      setPayload({ ...payload, dob: moment(dobNew).format("YYYY-MM-DD") });
      payload.dob = moment(dobNew).format("YYYY-MM-DD");
    }
    setPayload({ ...payload, age: e.target.value });
  };

  // const handleItemClick = (page, completedMenu) => {
  //     props.handleItemClick(page);
  //     if (props.completed.includes(completedMenu)) {
  //     } else {
  //         props.setCompleted([...props.completed, completedMenu]);
  //     }
  // };
  const validate = () => {
    //HTS FORM VALIDATION
    temp.dateVisit = payload.dateVisit ? "" : "This field is required.";
    temp.firstName = payload.firstName ? "" : "This field is required.";
    temp.lastName = payload.lastName ? "" : "This field is required.";
    temp.stateId = payload.stateId ? "" : "This field is required.";
    temp.province = payload.province ? "" : "This field is required.";
    temp.address = payload.address ? "" : "This field is required.";
    temp.phoneNumber = payload.phoneNumber ? "" : "This field is required.";
    temp.sexId = payload.sexId ? "" : "This field is required.";
    temp.dob = payload.dob ? "" : "This field is required.";
    // temp.age = payload.age ? "" : "This field is required.";
    // temp.hivStatus = payload.hivStatus ? "" : "This field is required.";
    // temp.stateTransferTo = payload.receivingFacilityStateName? "" : "This field is required.";
    // temp.lgaTransferTo = payload.receivingFacilityLgaName ? "" : "This field is required.";
    // temp.stateTransferTo = payload.receivingFacilityStateName ? "" : "This field is required.";
    temp.facilityTransferTo = payload.nameOfReceivingFacility
      ? ""
      : "This field is required.";
    temp.referredFromFacility = payload.referredFromFacility
      ? ""
      : "This field is required.";
    temp.nameOfPersonReferringClient = payload.nameOfPersonReferringClient
      ? ""
      : "This field is required.";

    temp.nameOfReferringFacility = payload.nameOfReferringFacility
      ? ""
      : "This field is required.";
    temp.addressOfReferringFacility = payload.addressOfReferringFacility
      ? ""
      : "This field is required.";
    temp.phoneNoOfReferringFacility = payload.phoneNoOfReferringFacility
      ? ""
      : "This field is required.";
    temp.nameOfContactPerson = payload.nameOfContactPerson
      ? ""
      : "This field is required.";
    temp.nameOfReceivingFacility = payload.nameOfReceivingFacility
      ? ""
      : "This field is required.";
    temp.addressOfReceivingFacility = payload.addressOfReceivingFacility
      ? ""
      : "This field is required.";
    temp.phoneNoOfReceivingFacility = payload.phoneNoOfReceivingFacility
      ? ""
      : "This field is required.";
    temp.serviceNeeded = payload.serviceNeeded ? "" : "This field is required.";
    // console.log("temp", temp);
    temp.referredTo = payload.referredTo ? "" : "This field is required.";
    setErrors({ ...temp });
    return Object.values(temp).every((x) => x == "");
  };

  const postPayload = (payload) => {
    axios
      .post(`${baseUrl}risk-stratification`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setSaving(false);

        //toast.success("Risk stratification save succesfully!");
      })
      .catch((error) => {
        setSaving(false);
        if (error.response && error.response.data) {
          let errorMessage =
            error.response.data.apierror &&
            error.response.data.apierror.message !== ""
              ? error.response.data.apierror.message
              : "Something went wrong, please try again";
          toast.error(errorMessage, {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else {
          toast.error("Something went wrong. Please try again...", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        setSaving(true);
        await axios.put(
          `${baseUrl}hts-client-referral/update-hts-client-referral/${props.row.row.id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSaving(false);
        toast.success("Record saved successfully", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        props.handleItemClick("refferal-history");
        // history.push("/")
      } catch (error) {
        setSaving(false);
        // console.log("error", error);
        const errorMessage =
          error.response?.data?.apierror?.message ||
          "Something went wrong, please try again";
        toast.error(errorMessage, { position: toast.POSITION.BOTTOM_CENTER });
      }
    }
  };

  return (
    <>
      <Card className={classes.root}>
        <CardBody>
          <h2 style={{ color: "#000" }}>
            Client Referral Form -{" "}
            {props.row.action === "update" ? "Update" : "View"}{" "}
          </h2>
          <br />
          <form>
            <div className="row">
              <div
                className="form-group  col-md-12 text-center pt-2 mb-4"
                style={{
                  backgroundColor: "#992E62",
                  width: "125%",
                  height: "35px",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                Referral Form For Referring Unit
              </div>

              <p style={{ color: "black", marginBottom: "20px" }}>
                <i>
                  Note: This form is to be filed by the organization making the
                  referral (Referring unit or organization)
                </i>
              </p>
              <div className="row">
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">
                      Date <span style={{color: "red"}}> *</span>{" "}
                    </Label>
                    <Input
                        type="date"                       onKeyPress={(e)=>{e.preventDefault()}}

                        name="dateVisit"
                        id="dateVisit"
                        value={payload.dateVisit}
                        onChange={handleInputChange}
                        min="1929-12-31"
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                        disabled={props.row.action === "view" ? true : false}
                    />
                    {errors.dateVisit !== "" ? (
                        <span className={classes.error}>{errors.dateVisit}</span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="firstName">
                      First Name <span style={{color: "red"}}> *</span>
                    </Label>
                    <Input
                        className="form-control"
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={payload.firstName}
                        onChange={handleInputChange}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                        disabled
                    />
                    {errors.firstName !== "" ? (
                        <span className={classes.error}>{errors.firstName}</span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>

                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label>Middle Name</Label>
                    <Input
                        className="form-control"
                        type="text"
                        name="middleName"
                        id="middleName"
                        value={payload.middleName}
                        onChange={handleInputChange}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                        disabled
                    />
                  </FormGroup>
                </div>

                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label>
                      Last Name <span style={{color: "red"}}> *</span>
                    </Label>
                    <input
                        className="form-control"
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={payload.lastName}
                        onChange={handleInputChange}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                        disabled
                    />
                    {errors.lastName !== "" ? (
                        <span className={classes.error}>{errors.lastName}</span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="patientId">
                      Hospital Number <span style={{color: "red"}}> *</span>{" "}
                    </Label>
                    <input
                        className="form-control"
                        type="text"
                        name="hospitalNumber"
                        id="hospitalNumber"
                        value={payload.hospitalNumber}
                        onChange={handleInputChange}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                        disabled
                    />
                    {errors.hospitalNumber !== "" ? (
                        <span className={classes.error}>
                        {errors.hospitalNumber}
                      </span>
                    ) : (
                        ""
                    )}
                    {hospitalNumStatus === true ? (
                        <span className={classes.error}>
                        {"Hospital number already exist"}
                      </span>
                    ) : (
                        ""
                    )}
                    {/* {hospitalNumStatus2===true ? (
                                                        <span className={classes.success}>{"Hospital number is OK."}</span>
                                                    ) :""} */}
                  </FormGroup>
                </div>

                <div className="form-group  col-md-4">
                  <FormGroup>
                    <Label>
                      Country <span style={{color: "red"}}> *</span>
                    </Label>
                    <select
                        className="form-control"
                        type="text"
                        name="countryId"
                        id="countryId"
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                        value={payload.countryId}
                        disabled
                        //onChange={getStates}
                    >
                      <option value={""}>Select</option>
                      {countries.map((value, index) => (
                          <option key={index} value={value.id}>
                            {value.name}
                          </option>
                      ))}
                    </select>
                  </FormGroup>
                </div>
                <div className="form-group  col-md-4">
                  <FormGroup>
                    <Label>
                      State <span style={{color: "red"}}> *</span>
                    </Label>
                    <select
                        className="form-control"
                        type="text"
                        name="stateId"
                        id="stateId"
                        value={payload.stateId}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                        onChange={getProvinces}
                        disabled
                    >
                      <option value="">Select</option>
                      {states.map((value, index) => (
                          <option key={index} value={value.id}>
                            {value.name}
                          </option>
                      ))}
                    </select>
                    {errors.stateId !== "" ? (
                        <span className={classes.error}>{errors.stateId}</span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>

                <div className="form-group  col-md-4">
                  <FormGroup>
                    <Label>
                      Province/District/LGA{" "}
                      <span style={{color: "red"}}> *</span>
                    </Label>
                    <select
                        className="form-control"
                        type="text"
                        name="province"
                        id="province"
                        value={payload.province}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                        disabled
                        onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      {provinces.map((value, index) => (
                          <option key={index} value={value.id}>
                            {value.name}
                          </option>
                      ))}
                    </select>
                    {errors.province !== "" ? (
                        <span className={classes.error}>{errors.province}</span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group  col-md-4">
                  <FormGroup>
                    <Label>
                      Street Address <span style={{color: "red"}}> *</span>
                    </Label>
                    <input
                        className="form-control"
                        type="text"
                        name="address"
                        id="address"
                        value={payload.address}
                        disabled
                        onChange={handleInputChange}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                    />
                    {errors.address !== "" ? (
                        <span className={classes.error}>{errors.address}</span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>

                <div className="form-group  col-md-4">
                  <FormGroup>
                    <Label>Landmark</Label>
                    <input
                        className="form-control"
                        type="text"
                        name="landmark"
                        id="landmark"
                        value={payload.landmark}
                        disabled
                        onChange={handleInputChange}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                    />
                  </FormGroup>
                </div>

                <div className="form-group  col-md-4">
                  <FormGroup>
                    <Label>
                      Phone Number <span style={{color: "red"}}> *</span>
                    </Label>
                    <Input
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        onChange={(e) => {
                          handleInputChangePhoneNumber(e, "phoneNumber");
                        }}
                        value={payload.phoneNumber}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                        disabled
                        // required
                    />
                    {errors.phoneNumber !== "" ? (
                        <span className={classes.error}>
                        {errors.phoneNumber}
                      </span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group  col-md-4">
                  <FormGroup>
                    <Label>
                      Sex <span style={{color: "red"}}> *</span>
                    </Label>
                    <select
                        className="form-control"
                        name="sexId"
                        id="sexId"
                        onChange={handleInputChange}
                        value={payload.sexId}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                        disabled
                    >
                      <option value={""}>Select</option>
                      {genders &&
                          genders.map((gender, index) => (
                              <option key={gender.id} value={gender.id}>
                                {gender.display}
                              </option>
                          ))}
                    </select>
                    {errors.sexId !== "" ? (
                        <span className={classes.error}>{errors.sexId}</span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>
                {/* <div className="form-group mb-2 col-md-4">
                  <FormGroup>
                    <Label>
                      Date Of Birth <span style={{ color: "red" }}> *</span>
                    </Label>
                    <div className="radio">
                      <label>
                        <input
                          type="radio"
                          value="Actual"
                          name="dateOfBirth"
                          defaultChecked
                          onChange={(e) => handleDateOfBirthChange(e)}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        />{" "}
                        Actual
                      </label>
                    </div>
                    <div className="radio">
                      <label>
                        <input
                          type="radio"
                          value="Estimated"
                          name="dateOfBirth"
                          onChange={(e) => handleDateOfBirthChange(e)}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        />{" "}
                        Estimated
                      </label>
                    </div>
                  </FormGroup>
                </div> */}
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label>
                      Date Of Birth<span style={{color: "red"}}> *</span>
                    </Label>
                    <input
                        className="form-control"
                        type="date"                       onKeyPress={(e)=>{e.preventDefault()}}

                        name="dob"
                        id="dob"
                        min="1929-12-31"
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        value={payload.dob}
                        onChange={handleDobChange}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                        disabled
                    />
                    {errors.dob !== "" ? (
                        <span className={classes.error}>{errors.dob}</span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label>
                      Age <span style={{color: "red"}}> *</span>
                    </Label>
                    <input
                        className="form-control"
                        type="number"
                        name="age"
                        id="age"
                        disabled={ageDisabled}
                        onChange={payload.age}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                        value={calculate_age(
                            props?.patientObj.personResponseDto?.dateOfBirth
                                ? props?.patientObj?.personResponseDto?.dateOfBirth
                                : props?.patientObj?.personResponseDto?.dateOfBirth
                        )}
                    />
                  </FormGroup>
                </div>
                <div className="form-group  col-md-4">
                  <FormGroup>
                    <Label>
                      HIV Status<span style={{color: "red"}}> *</span>
                    </Label>
                    <input
                        className="form-control"
                        type="text"
                        name="hivStatus"
                        id="hivStatus"
                        value={payload.hivStatus}
                        disabled={ageDisabled}
                        onChange={handleAgeChange}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                    />
                    {/*<select*/}
                    {/*  className="form-control"*/}
                    {/*  name="hivStatus"*/}
                    {/*  id="hivStatus"*/}
                    {/*  onChange={handleInputChange}*/}
                    {/*  value={payload.hivStatus}*/}
                    {/*  style={{*/}
                    {/*    border: "1px solid #014D88",*/}
                    {/*    borderRadius: "0.2rem",*/}
                    {/*  }}*/}
                    {/*>*/}
                    {/*<option value={""}>Select</option>*/}
                    {/*{hivStatus.map((gender, index) => (*/}
                    {/*  <option key={gender.id} value={gender.id}>*/}
                    {/*    {gender.display}*/}
                    {/*  </option>*/}
                    {/*))}*/}
                    {/*</select>*/}
                    {errors.hivStatus !== "" ? (
                        <span className={classes.error}>{errors.hivStatus}</span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>

                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="firstName">
                      Referred from (Department):
                      <span style={{color: "red"}}> *</span>
                    </Label>
                    <Input
                        className="form-control"
                        name="referredFromFacility"
                        id="referredFromFacility"
                        value={payload.referredFromFacility}
                        onChange={handleInputChange}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                        disabled={props.row.action === "view" ? true : false}
                    />

                    {errors.referredFromFacility !== "" ? (
                        <span className={classes.error}>
                        {errors.referredFromFacility}
                      </span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="firstName">
                      Name of Person Referring Client
                      <span style={{color: "red"}}> *</span>
                    </Label>
                    <Input
                        className="form-control"
                        type="text"
                        name="nameOfPersonReferringClient"
                        id="nameOfPersonReferringClient"
                        value={payload.nameOfPersonReferringClient}
                        onChange={handleInputChange}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                        disabled={props.row.action === "view" ? true : false}
                    />
                    {errors.nameOfPersonReferringClient !== "" ? (
                        <span className={classes.error}>
                        {errors.nameOfPersonReferringClient}
                      </span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="firstName">
                      Name of Referring Facility
                      <span style={{color: "red"}}> *</span>
                    </Label>
                    <Input
                        className="form-control"
                        type="text"
                        name="nameOfReferringFacility"
                        id="nameOfReferringFacility"
                        value={payload.nameOfReferringFacility}
                        onChange={handleInputChange}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                        disabled
                    />
                    {errors.nameOfReferringFacility !== "" ? (
                        <span className={classes.error}>
                        {errors.nameOfReferringFacility}
                      </span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="firstName">
                      Address of Referring Facility
                      <span style={{color: "red"}}> *</span>
                    </Label>
                    <Input
                        className="form-control"
                        type="text"
                        name="addressOfReferringFacility"
                        id="addressOfReferringFacility"
                        value={payload.addressOfReferringFacility}
                        onChange={handleInputChange}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                        disabled={props.row.action === "view" ? true : false}
                    />
                    {errors.addressOfReferringFacility !== "" ? (
                        <span className={classes.error}>
                        {errors.addressOfReferringFacility}
                      </span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>

                <div className="form-group  col-md-4">
                  <FormGroup>
                    <Label>
                      Phone Number of Referring Facility{" "}
                      <span style={{color: "red"}}> *</span>
                    </Label>
                    <Input
                        type="text"
                        name="phoneNoOfReferringFacility"
                        id="phoneNoOfReferringFacility"
                        onChange={(e) => {
                          handleInputChangePhoneNumber(
                              e,
                              "phoneNoOfReferringFacility"
                          );
                        }}
                        value={payload.phoneNoOfReferringFacility}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                        disabled={props.row.action === "view" ? true : false}
                    />
                    {errors.phoneNoOfReferringFacility !== "" ? (
                        <span className={classes.error}>
                        {errors.phoneNoOfReferringFacility}
                      </span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="firstName">
                      Referred to (Department)
                      <span style={{color: "red"}}> *</span>
                    </Label>
                    <Input
                        className="form-control"
                        type="text"
                        name="referredTo"
                        id="referredTo"
                        value={payload.referredTo}
                        onChange={handleInputChange}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                        disabled={props.row.action === "view" ? true : false}
                    />
                    {errors.referredTo !== "" ? (
                        <span className={classes.error}>{errors.referredTo}</span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="firstName">
                      Name of Contact Person:
                      <span style={{color: "red"}}> *</span>
                    </Label>
                    <Input
                        className="form-control"
                        type="text"
                        name="nameOfContactPerson"
                        id="nameOfContactPerson"
                        value={payload.nameOfContactPerson}
                        onChange={handleInputChange}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                        disabled={props.row.action === "view" ? true : false}
                    />
                    {errors.nameOfContactPerson !== "" ? (
                        <span className={classes.error}>
                        {errors.nameOfContactPerson}
                      </span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>
                {/* props.row.action === "update" && */}
                {
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label
                          for=""
                          style={{color: "#014d88", fontWeight: "bolder"}}
                      >
                        Receiving Facility State{" "}
                        <span style={{color: "red"}}> *</span>{" "}
                      </Label>
                      <Input
                          type="select"
                          name="stateId"
                          style={{
                            height: "40px",
                            border: "solid 1px #014d88",
                            borderRadius: "5px",
                            fontWeight: "bolder",
                            appearance: "auto",
                          }}
                          required
                          disabled={props.row.action === "view" ? true : false}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              const filterState =
                                  statesOfTheReceivingFacility.filter((st) => {
                                    return st.name === e.target.value;
                                  });
                              setSelectedReceivingState(filterState);

                              setPayload((prevPayload) => ({
                                ...prevPayload,
                                receivingFacilityStateName: filterState[0].name,
                              }));

                              getReceivinglga(filterState[0].id);
                            }
                          }}
                          value={payload.receivingFacilityStateName}
                      >
                        {/*{console.log(*/}
                        {/*    "receivng",*/}
                        {/*    payload.receivingFacilityStateName*/}
                        {/*)}*/}
                        <option>Select State</option>
                        {states.map((state) => (
                            <option key={state?.id} value={state?.name}>
                              {state.name}
                            </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </div>
                }
                {/* props.row.action === "update" &&  */}
                {
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label
                          for=""
                          style={{color: "#014d88", fontWeight: "bolder"}}
                      >
                        {" "}
                        Receiving Facility LGA{" "}
                        <span style={{color: "red"}}> *</span>
                      </Label>
                      <Input
                          type="select"
                          name=" receivingFacilityLgaName"
                          style={{
                            height: "40px",
                            border: "solid 1px #014d88",
                            borderRadius: "5px",
                            fontWeight: "bolder",
                            appearance: "auto",
                          }}
                          required
                          disabled={props.row.action === "view" ? true : false}
                          value={payload.receivingFacilityLgaName}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              const filterlga = lgasOfTheReceivingFacility.filter(
                                  (lg) => {
                                    return lg.name === e.target.value;
                                  }
                              );
                              setSelectedReceivingLga(filterlga);
                              setPayload((prevPayload) => ({
                                ...prevPayload,
                                receivingFacilityLgaName: filterlga[0].name,
                              }));
                              loadFacilities(filterlga[0].id);
                            }
                          }}
                      >
                        {/*{console.log("receivng", payload.receivingFacilityLgaName)}*/}
                        <option>Select LGA</option>
                        {lgasOfTheReceivingFacility.map((lga) => (
                            <option key={lga.id} value={lga.name}>
                              {lga.name}
                            </option>
                        ))}
                      </Input>
                      {errors.lgaId !== "" ? (
                          <span className={classes.error}>{errors.lgaId}</span>
                      ) : (
                          ""
                      )}
                    </FormGroup>
                  </div>
                }
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label
                        for=""
                        style={{color: "#014d88", fontWeight: "bolder"}}
                    >
                      Name of Receiving Facility
                      <span style={{color: "red"}}> *</span>{" "}
                    </Label>
                    <Input
                        type="select"
                        name="nameOfReceivingFacility"
                        style={{
                          height: "40px",
                          border: "solid 1px #014d88",
                          borderRadius: "5px",
                          fontWeight: "bolder",
                          appearance: "auto",
                        }}
                        disabled={props.row.action === "view" ? true : false}
                        //   disabled
                        // required
                        value={payload.nameOfReceivingFacility}
                        onChange={handleInputChange}
                    >
                      <option>Select State</option>
                      {receivingFacilities.length > 0 &&
                          receivingFacilities.map((fa) => (
                              <option key={fa.id} value={fa.name}>
                                {fa.name}
                              </option>
                          ))}

                      {receivingFacilities.length < 1 && (
                          <option
                              key={3}
                              value={payload?.nameOfReceivingFacility}
                          >
                            {payload?.nameOfReceivingFacility}
                          </option>
                      )}
                    </Input>
                    {errors.nameOfReceivingFacility !== "" ? (
                        <span className={classes.error}>
                        {errors.nameOfReceivingFacility}
                      </span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="firstName">
                      Address of the Receiving Facility
                      <span style={{color: "red"}}> *</span>
                    </Label>
                    <Input
                        className="form-control"
                        type="text"
                        name="addressOfReceivingFacility"
                        id="addressOfReceivingFacility"
                        value={payload.addressOfReceivingFacility}
                        onChange={handleInputChange}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                        disabled={props.row.action === "view" ? true : false}
                    />
                    {errors.addressOfReceivingFacility !== "" ? (
                        <span className={classes.error}>
                        {errors.addressOfReceivingFacility}
                      </span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group  col-md-4">
                  <FormGroup>
                    <Label>
                      Phone No of Receiving Facility
                      <span style={{color: "red"}}> *</span>
                    </Label>
                    <Input
                        type="text"
                        name="phoneNoOfReceivingFacility"
                        id="phoneNoOfReceivingFacility"
                        onChange={(e) => {
                          handleInputChangePhoneNumber(
                              e,
                              "phoneNoOfReceivingFacility"
                          );
                        }}
                        value={payload.phoneNoOfReceivingFacility}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                        disabled={props.row.action === "view" ? true : false}
                    />
                    {errors.phoneNoOfReceivingFacility !== "" ? (
                        <span className={classes.error}>
                        {errors.phoneNoOfReceivingFacility}
                      </span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>
                {/*<div className="form-group mb-3 col-md-4">*/}
                {/*  <FormGroup>*/}
                {/*    <Label for="firstName">*/}
                {/*      Services needed*/}
                {/*      <span style={{ color: "red" }}> *</span>*/}
                {/*    </Label>*/}
                {/*    <select*/}
                {/*      className="form-control"*/}
                {/*      name="serviceNeeded"*/}
                {/*      id="serviceNeeded"*/}
                {/*      onChange={handleInputChange}*/}
                {/*      value={payload.serviceNeeded}*/}
                {/*      style={{*/}
                {/*        border: "1px solid #014D88",*/}
                {/*        borderRadius: "0.2rem",*/}
                {/*      }}*/}
                {/*      disabled={props.row.action === "view" ? true : false}*/}
                {/*    >*/}
                {/*      <option value={""}>Select Service</option>*/}
                {/*      {serviceNeeded.map((value, index) => (*/}
                {/*        <option key={value.id} value={value.code}>*/}
                {/*          {value.display}*/}
                {/*        </option>*/}
                {/*      ))}*/}
                {/*    </select>*/}

                {/*    {errors.serviceNeeded !== "" ? (*/}
                {/*      <span className={classes.error}>*/}
                {/*        {errors.serviceNeeded}*/}
                {/*      </span>*/}
                {/*    ) : (*/}
                {/*      ""*/}
                {/*    )}*/}
                {/*  </FormGroup>*/}
                {/*</div>*/}

                <div className="form-group mb-3 col-md-12">
                  <DualListBox
                      options={serviceNeeded}
                      selected={selectedServiceNeeded}
                      disabled={props.row.action === "view" ? true : false}
                      onChange={(value) => {
                        // Update selectedServiceNeeded state
                        setSelectServiceNeeded(value);
                        // Convert selectedServiceNeeded array into an object
                        const serviceNeededObject = value.reduce(
                            (obj, item, index) => {
                              obj[index] = item;
                              return obj;
                            },
                            {}
                        );

                        // Update serviceNeeded in payload
                        setPayload({
                          ...payload,
                          serviceNeeded: serviceNeededObject,
                        });
                      }}
                  />
                </div>


                <div className="form-group mb-3 col-md-12">
                  <FormGroup>
                    <Label for="firstName">
                      Comments
                      {/* <span style={{ color: "red" }}> *</span> */}
                    </Label>
                    <Input
                        className="form-control"
                        type="textarea"
                        rows="4"
                        cols="7"
                        name="comments"
                        id="comments"
                        value={payload.comments}
                        onChange={handleInputChange}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                          height: "100px",
                        }}
                        disabled={props.row.action === "view" ? true : false}
                    />
                    {/* {errors.firstName !== "" ? (
                      <span className={classes.error}>{errors.firstName}</span>
                    ) : (
                      ""
                    )} */}
                  </FormGroup>
                </div>
              </div>
              <br/>

              <br/>

              {/* <hr /> */}
              {saving ? <Spinner/> : ""}
              <br/>
              {props.row.action === "update" && (
                  <div className="row">
                    <div className="form-group mb-3 col-md-6">
                      <Button
                          content="Update"
                          type="submit"
                          icon="right arrow"
                          labelPosition="right"
                          style={{backgroundColor: "#014d88", color: "#fff"}}
                          onClick={handleSubmit}
                          disabled={saving}
                      />
                    </div>
                  </div>
              )}
            </div>
          </form>
        </CardBody>
      </Card>
      <Modal
          show={open}
          toggle={toggle}
          className="fade"
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Notification!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Are you Sure of the Age entered?</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={toggle}
            style={{ backgroundColor: "#014d88", color: "#fff" }}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RefferralUnit;
