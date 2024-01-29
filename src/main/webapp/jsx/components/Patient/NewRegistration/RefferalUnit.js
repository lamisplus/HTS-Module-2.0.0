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
import { token, url as baseUrl } from "../../../../api";
import "react-phone-input-2/lib/style.css";
import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import "react-phone-input-2/lib/style.css";
import { Button } from "semantic-ui-react";
import { Modal } from "react-bootstrap";
import { Label as LabelRibbon, Message } from "semantic-ui-react";
import PhoneInput from "react-phone-input-2";
import ServicesProvided from "./ServicesProvided";
import {
  getAllStateByCountryId,
  getAllCountry,
  getAllProvinces,
  getAllGenders,
  alphabetOnly,
} from "../../../../utility";
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

  const [payload, setPayload] = useState({
    referralDate: "",
    firstName: "",
    middleName: "",
    lastName: "",
    hospitalNumber: "",
    countryId: "1",
    stateId: "",
    province: "1",
    address: "",
    landmark: "",
    phoneNumber: "",
    sexId: "",
    dob: "",
    age: "",
    dateOfBirth: "",
    hivStatus: "",
    referredFromFacility: "",
    nameOfPersonRefferringClient: "",
    nameOfReferringFacility: "",
    addressOfReferrringFacility: "",
    phoneNoOfReferrringFacility: "",
    referredTo: "",
    nameOfContactPerson: "",
    nameOfRecievingFacility: "",
    addressOfRecievingFacility: "",
    phoneNoOfRecievingFacility: "",
    isDateOfBirthEstimated: false,
    serviceNeeded: "",
    comments: "",
  });
  const loadGenders = useCallback(async () => {
    getAllGenders()
      .then((response) => {
        setGenders(response);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadGenders();
    getCountry();
    getStateByCountryId();
  }, []);

  //Get list of State
  const getStateByCountryId = () => {
    getAllStateByCountryId()
      .then((res) => {
        setStates(res);
      })
      .catch(() => {});
  };
  const checkPhoneNumberBasic = (e, inputName) => {
    console.log(e, inputName);
    if (e) {
      setErrors({ ...errors, phoneNumber: "" });
    }
    const limit = 10;
    setPayload({ ...payload, phoneNumber: e.slice(0, limit) });
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
        console.log(e);
      });

    // console.log(response);
  };

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

  //End of Date of Birth and Age handling
  /*****  Validation  */
  const validate = () => {
    //HTS FORM VALIDATION

    temp.referralDate = payload.referralDate ? "" : "This field is required.";
    temp.firstName = payload.firstName ? "" : "This field is required.";
    temp.lastName = payload.lastName ? "" : "This field is required.";
    temp.stateId = payload.stateId ? "" : "This field is required.";
    temp.province = payload.province ? "" : "This field is required.";
    temp.address = payload.address ? "" : "This field is required.";
    temp.phoneNumber = payload.phoneNumber ? "" : "This field is required.";
    temp.sexId = payload.sexId ? "" : "This field is required.";
    temp.dob = payload.dob ? "" : "This field is required.";
    temp.age = payload.age ? "" : "This field is required.";
    temp.hivStatus = payload.hivStatus ? "" : "This field is required.";
    temp.referredFromFacility = payload.referredFromFacility
      ? ""
      : "This field is required.";
    temp.nameOfPersonRefferringClient = payload.nameOfPersonRefferringClient
      ? ""
      : "This field is required.";
    temp.addressOfReferrringFacility = payload.addressOfReferrringFacility
      ? ""
      : "This field is required.";
    temp.phoneNoOfReferrringFacility = payload.phoneNoOfReferrringFacility
      ? ""
      : "This field is required.";
    temp.nameOfContactPerson = payload.nameOfContactPerson
      ? ""
      : "This field is required.";
    temp.nameOfRecievingFacility = payload.nameOfRecievingFacility
      ? ""
      : "This field is required.";
    temp.addressOfRecievingFacility = payload.addressOfRecievingFacility
      ? ""
      : "This field is required.";
    temp.phoneNoOfRecievingFacility = payload.phoneNoOfRecievingFacility
      ? ""
      : "This field is required.";
    temp.serviceNeeded = payload.serviceNeeded ? "" : "This field is required.";
    temp.age = payload.age ? "" : "This field is required.";

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
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      setSaving(true);

      // postPayload(payload)
      //  handleItemClick("basic", "risk");
    }
  };

  return (
    <>
      <Card className={classes.root}>
        <CardBody>
          <h2 style={{ color: "#000" }}>Client Referral Form </h2>
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
                  referal (Referring unit or organization)
                </i>
              </p>
              <div className="row">
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">
                      Date <span style={{ color: "red" }}> *</span>{" "}
                    </Label>
                    <Input
                      type="date"
                      name="referralDate"
                      id="referralDate"
                      value={payload.referralDate}
                      onChange={handleInputChange}
                      min="1929-12-31"
                      max={moment(new Date()).format("YYYY-MM-DD")}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.25rem",
                      }}
                    />
                    {errors.referralDate !== "" ? (
                      <span className={classes.error}>
                        {errors.referralDate}
                      </span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="firstName">
                      First Name <span style={{ color: "red" }}> *</span>
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
                    />
                  </FormGroup>
                </div>

                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label>
                      Last Name <span style={{ color: "red" }}> *</span>
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
                      Hospital Number <span style={{ color: "red" }}> *</span>{" "}
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
                      Country <span style={{ color: "red" }}> *</span>
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
                      State <span style={{ color: "red" }}> *</span>
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
                      <span style={{ color: "red" }}> *</span>
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
                      Street Address <span style={{ color: "red" }}> *</span>
                    </Label>
                    <input
                      className="form-control"
                      type="text"
                      name="address"
                      id="address"
                      value={payload.address}
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
                      Phone Number <span style={{ color: "red" }}> *</span>
                    </Label>
                    <PhoneInput
                      containerStyle={{
                        width: "100%",
                        border: "1px solid #014D88",
                      }}
                      inputStyle={{ width: "100%", borderRadius: "0px" }}
                      country={"ng"}
                      placeholder="(234)7099999999"
                      maxLength={5}
                      name="phoneNumber"
                      id="phoneNumber"
                      masks={{ ng: "...-...-....", at: "(....) ...-...." }}
                      value={payload.phoneNumber}
                      onChange={(e) => {
                        checkPhoneNumberBasic(e, "phoneNumber");
                      }}
                      //onChange={(e)=>{handleInputChangeBasic(e,'phoneNumber')}}
                    />

                    {errors.phoneNumber !== "" ? (
                      <span className={classes.error}>
                        {errors.phoneNumber}
                      </span>
                    ) : (
                      ""
                    )}
                    {/* {basicInfo.phoneNumber.length >13 ||  basicInfo.phoneNumber.length <13? (
                                                <span className={classes.error}>{"The maximum and minimum required number is 13 digit"}</span>
                                                ) : "" } */}
                  </FormGroup>
                </div>
                <div className="form-group  col-md-4">
                  <FormGroup>
                    <Label>
                      Sex <span style={{ color: "red" }}> *</span>
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
                    >
                      <option value={""}>Select</option>
                      {genders.map((gender, index) => (
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
                <div className="form-group mb-2 col-md-4">
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
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label>
                      Date <span style={{ color: "red" }}> *</span>
                    </Label>
                    <input
                      className="form-control"
                      type="date"
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
                      Age <span style={{ color: "red" }}> *</span>
                    </Label>
                    <input
                      className="form-control"
                      type="number"
                      name="age"
                      id="age"
                      value={payload.age}
                      disabled={ageDisabled}
                      onChange={handleAgeChange}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.2rem",
                      }}
                    />
                    {errors.age !== "" ? (
                      <span className={classes.error}>{errors.age}</span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group  col-md-4">
                  <FormGroup>
                    <Label>
                      HIV Status<span style={{ color: "red" }}> *</span>
                    </Label>
                    <select
                      className="form-control"
                      name="hivStatus"
                      id="hivStatus"
                      onChange={handleInputChange}
                      value={payload.hivStatus}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.2rem",
                      }}
                    >
                      <option value={""}>Select</option>
                      {genders.map((gender, index) => (
                        <option key={gender.id} value={gender.id}>
                          {gender.display}
                        </option>
                      ))}
                    </select>
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
                      Referred from (Facility):
                      <span style={{ color: "red" }}> *</span>
                    </Label>
                    <Input
                      className="form-control"
                      type="text"
                      name="referredFromFacility"
                      id="referredFromFacility"
                      value={payload.referredFromFacility}
                      onChange={handleInputChange}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.2rem",
                      }}
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
                      <span style={{ color: "red" }}> *</span>
                    </Label>
                    <Input
                      className="form-control"
                      type="text"
                      name="nameOfPersonRefferringClient"
                      id="nameOfPersonRefferringClient"
                      value={payload.nameOfPersonRefferringClient}
                      onChange={handleInputChange}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.2rem",
                      }}
                    />
                    {errors.nameOfPersonRefferringClient !== "" ? (
                      <span className={classes.error}>
                        {errors.nameOfPersonRefferringClient}
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
                      <span style={{ color: "red" }}> *</span>
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
                      <span style={{ color: "red" }}> *</span>
                    </Label>
                    <Input
                      className="form-control"
                      type="text"
                      name="addressOfReferrringFacility"
                      id="addressOfReferrringFacility"
                      value={payload.addressOfReferrringFacility}
                      onChange={handleInputChange}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.2rem",
                      }}
                    />
                    {errors.addressOfReferrringFacility !== "" ? (
                      <span className={classes.error}>
                        {errors.addressOfReferrringFacility}
                      </span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="firstName">
                      Phone Number of Refering Facility
                      <span style={{ color: "red" }}> *</span>
                    </Label>
                    <Input
                      className="form-control"
                      type="text"
                      name="phoneNoOfReferrringFacility"
                      id="phoneNoOfReferrringFacility"
                      value={payload.phoneNoOfReferrringFacility}
                      onChange={handleInputChange}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.2rem",
                      }}
                    />
                    {errors.phoneNoOfReferrringFacility !== "" ? (
                      <span className={classes.error}>
                        {errors.phoneNoOfReferrringFacility}
                      </span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="firstName">
                      Referred to (Facility)
                      <span style={{ color: "red" }}> *</span>
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
                      <span style={{ color: "red" }}> *</span>
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
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="firstName">
                      Name of the Receiving Facility
                      <span style={{ color: "red" }}> *</span>
                    </Label>
                    <Input
                      className="form-control"
                      type="text"
                      name="nameOfRecievingFacility"
                      id="nameOfRecievingFacility"
                      value={payload.nameOfRecievingFacility}
                      onChange={handleInputChange}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.2rem",
                      }}
                    />
                    {errors.nameOfRecievingFacility !== "" ? (
                      <span className={classes.error}>
                        {errors.nameOfRecievingFacility}
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
                      <span style={{ color: "red" }}> *</span>
                    </Label>
                    <Input
                      className="form-control"
                      type="text"
                      name="addressOfRecievingFacility"
                      id="addressOfRecievingFacility"
                      value={payload.addressOfRecievingFacility}
                      onChange={handleInputChange}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.2rem",
                      }}
                    />
                    {errors.addressOfRecievingFacility !== "" ? (
                      <span className={classes.error}>
                        {errors.addressOfRecievingFacility}
                      </span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="firstName">
                      Phone No of Receiving Facility
                      <span style={{ color: "red" }}> *</span>
                    </Label>
                    <Input
                      className="form-control"
                      type="text"
                      name="phoneNoOfRecievingFacility"
                      id="phoneNoOfRecievingFacility"
                      value={payload.phoneNoOfRecievingFacility}
                      onChange={handleInputChange}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.2rem",
                      }}
                    />
                    {errors.phoneNoOfRecievingFacility !== "" ? (
                      <span className={classes.error}>
                        {errors.phoneNoOfRecievingFacility}
                      </span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="firstName">
                      Services needed
                      <span style={{ color: "red" }}> *</span>
                    </Label>
                    <Input
                      className="form-control"
                      type="text-area"
                      name="serviceNeeded"
                      id="serviceNeeded"
                      value={payload.serviceNeeded}
                      onChange={handleInputChange}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.2rem",
                      }}
                    />
                    {errors.serviceNeeded !== "" ? (
                      <span className={classes.error}>
                        {errors.serviceNeeded}
                      </span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-12">
                  <FormGroup>
                    <Label for="firstName">
                      Comments
                      <span style={{ color: "red" }}> *</span>
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
                    />
                    {/* {errors.firstName !== "" ? (
                      <span className={classes.error}>{errors.firstName}</span>
                    ) : (
                      ""
                    )} */}
                  </FormGroup>
                </div>
              </div>
              <br />

              <br />

              {/* <hr /> */}
              <br />
              <div className="row">
                <div className="form-group mb-3 col-md-6">
                  <Button
                    content="Save"
                    type="submit"
                    icon="right arrow"
                    labelPosition="right"
                    style={{ backgroundColor: "#014d88", color: "#fff" }}
                    onClick={handleSubmit}
                    disabled={saving}
                  />
                </div>
              </div>
            </div>
          </form>
        </CardBody>
        {/* <CardBody>
          <ServicesProvided />
        </CardBody> */}

        {/* recieving facility  */}
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
