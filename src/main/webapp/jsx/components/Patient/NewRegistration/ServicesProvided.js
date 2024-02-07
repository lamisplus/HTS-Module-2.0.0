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
import { getAllGenders, alphabetOnly } from "../../../../utility";
import Select from "react-select";

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

const ServicesProvided = (props) => {
  const classes = useStyles();

  const [errors, setErrors] = useState({});
  const [ageDisabled, setAgeDisabled] = useState(true);
  const [saving, setSaving] = useState(false);
  let temp = { ...errors };
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen(!open);
  const [genders, setGenders] = useState([]);
  const [allFacilities, setAllFacilities] = useState([]);

  const [payload, setPayload] = useState({
    nameOfFacilityProvider: "",
    addressOfFacilityProvider: "",
    referralDate: "",
    comments: "",
    clientFirstName: "",
    clientLastName: "",
    clientMiddleName: "",
    nameOfServiceProvider: "",
    signature: "",
    phoneNumber: "",
    categoryOfService: "",
  });

  const getGenders = () => {
    getAllGenders()
      .then((res) => {
        setGenders(res);
      })
      .catch((e) => {
        console.log("error", e);
      });
    // ;
  };
  // handle Facility Name to slect drop down
  const handleInputChangeObject = (e) => {
    // console.log(e);
    setPayload({
      ...payload,
      nameOfFacilityProvider: e.name,
      addressOfFacilityProvider: e.parentParentOrganisationUnitName,
      // lgaTransferTo: e.parentOrganisationUnitName,
    });
    setErrors({ ...errors, nameOfRecievingFacility: "" });
    // setSelectedState(e.parentParentOrganisationUnitName);
    // setSelectedLga(e.parentOrganisationUnitName);
  };
  useEffect(() => {
    getGenders();
    getAllFacilities();
  }, []);

  const checkPhoneNumberBasic = (e, inputName) => {
    if (e) {
      setErrors({ ...errors, phoneNumber: "" });
    }
    const limit = 10;
    setPayload({ ...payload, phoneNumber: e.slice(0, limit) });
  };

  // get all facilities
  const getAllFacilities = () => {
    axios
      .get(
        `${baseUrl}organisation-units/parent-organisation-units/1/organisation-units-level/4/hierarchy`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        // console.log(response.data);

        let updatedFaclilties = response.data.map((each, id) => {
          return {
            ...each,
            value: each.id,
            label: each.name,
          };
        });

        setAllFacilities(updatedFaclilties);
      })
      .catch((error) => {});
  };

  const handleInputChange = (e) => {
    setErrors({ ...temp, [e.target.name]: "" });

    if (e.target.name === "nameOfFacilityProvider" && e.target.value !== "") {
      const name = alphabetOnly(e.target.value);
      setPayload({ ...payload, [e.target.name]: name });
    } else if (
      e.target.name === "addressOfFacilityProvider" &&
      e.target.value !== ""
    ) {
      const name = alphabetOnly(e.target.value);
      setPayload({ ...payload, [e.target.name]: name });
    } else if (e.target.name === "clientFirstName" && e.target.value !== "") {
      const name = alphabetOnly(e.target.value);
      setPayload({ ...payload, [e.target.name]: name });
    } else if (e.target.name === "clientMiddleName" && e.target.value !== "") {
      const name = alphabetOnly(e.target.value);
      setPayload({ ...payload, [e.target.name]: name });
    } else if (e.target.name === "clientLastName" && e.target.value !== "") {
      const name = alphabetOnly(e.target.value);
      setPayload({ ...payload, [e.target.name]: name });
    } else if (
      e.target.name === "nameOfServiceProvider" &&
      e.target.value !== ""
    ) {
      const name = alphabetOnly(e.target.value);
      setPayload({ ...payload, [e.target.name]: name });
    } else {
      setPayload({ ...payload, [e.target.name]: e.target.value });
    }
  };

  const postPayload = (payload) => {
    setSaving(true);
    // props.setHideOtherMenu(false);
    axios
      .post(`${baseUrl}risk-stratification`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setSaving(false);
        console.log(response.data);
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

  /*****  Validation  */
  const validate = () => {
    //HTS FORM VALIDATION

    temp.nameOfFacilityProvider = payload.nameOfFacilityProvider
      ? ""
      : "This field is required.";
    temp.addressOfFacilityProvider = payload.addressOfFacilityProvider
      ? ""
      : "This field is required.";
    temp.referralDate = payload.referralDate ? "" : "This field is required.";
    temp.clientFirstName = payload.clientFirstName
      ? ""
      : "This field is required.";
    temp.clientLastName = payload.clientLastName
      ? ""
      : "This field is required.";
    temp.nameOfServiceProvider = payload.nameOfServiceProvider
      ? ""
      : "This field is required.";

    temp.signature = payload.signature ? "" : "This field is required.";
    temp.phoneNumber = payload.phoneNumber ? "" : "This field is required.";

    temp.categoryOfService = payload.categoryOfService
      ? ""
      : "This field is required.";

    setErrors({ ...temp });
    return Object.values(temp).every((x) => x == "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(payload);
    if (validate()) {
      console.log(payload);
      //   postPayload(payload);
    }
  };

  return (
    <>
      {" "}
      <div>
        <h2 style={{ color: "#000" }}>Client Referral Form </h2>
        <br />
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
            Referral Form For Services Provided
          </div>

          <p style={{ color: "black", marginBottom: "20px" }}>
            <i>
              Note: This form should be filled out by the organization providing
              the service
            </i>
          </p>
          <div className="row">
            <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label for="firstName">
                  Name of Facility providing the service
                  <span style={{ color: "red" }}> *</span>
                </Label>
                <Select
                  //value={selectedOption}
                  onChange={handleInputChangeObject}
                  name="nameOfFacilityProvider"
                  options={allFacilities}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: "0.25rem",
                    border: "1px solid #014D88",
                    colors: {
                      ...theme.colors,
                      primary25: "#014D88",
                      primary: "#014D88",
                    },
                  })}
                />
                {/* <Input
                  className="form-control"
                  type="text"
                  name="nameOfFacilityProvider"
                  id="nameOfFacilityProvider"
                  value={payload.nameOfFacilityProvider}
                  onChange={handleInputChange}
                  style={{
                    border: "1px solid #014D88",
                    borderRadius: "0.2rem",
                  }}
                /> */}
                {errors.nameOfFacilityProvider !== "" ? (
                  <span className={classes.error}>
                    {errors.nameOfFacilityProvider}
                  </span>
                ) : (
                  ""
                )}
              </FormGroup>
            </div>
            <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label for="firstName">
                  Address of Facility providing the service{" "}
                  <span style={{ color: "red" }}> *</span>
                </Label>
                <Input
                  className="form-control"
                  type="text"
                  name="addressOfFacilityProvider"
                  id="addressOfFacilityProvider"
                  value={payload.addressOfFacilityProvider}
                  onChange={handleInputChange}
                  style={{
                    border: "1px solid #014D88",
                    borderRadius: "0.2rem",
                  }}
                />
                {errors.addressOfFacilityProvider !== "" ? (
                  <span className={classes.error}>
                    {errors.addressOfFacilityProvider}
                  </span>
                ) : (
                  ""
                )}
              </FormGroup>
            </div>

            <div className="form-group mb-3 col-md-6">
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
                  <span className={classes.error}>{errors.referralDate}</span>
                ) : (
                  ""
                )}
              </FormGroup>
            </div>
            <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label for="firstName">
                  Client First Name <span style={{ color: "red" }}> *</span>
                </Label>
                <Input
                  className="form-control"
                  type="text"
                  name="clientFirstName"
                  id="clientFirstName"
                  value={payload.clientFirstName}
                  onChange={handleInputChange}
                  style={{
                    border: "1px solid #014D88",
                    borderRadius: "0.2rem",
                  }}
                />
                {errors.clientFirstName !== "" ? (
                  <span className={classes.error}>
                    {errors.clientFirstName}
                  </span>
                ) : (
                  ""
                )}
              </FormGroup>
            </div>
            <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label for="clientMiddleName">
                  Client Middle Name
                  {/* <span style={{ color: "red" }}> *</span> */}
                </Label>
                <Input
                  className="form-control"
                  type="text"
                  name="clientMiddleName"
                  id="clientMiddleName"
                  value={payload.clientMiddleName}
                  onChange={handleInputChange}
                  style={{
                    border: "1px solid #014D88",
                    borderRadius: "0.2rem",
                  }}
                />
              </FormGroup>
            </div>

            <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label for="clientLastName">
                  Client Last Name <span style={{ color: "red" }}> *</span>
                </Label>
                <Input
                  className="form-control"
                  type="text"
                  name="clientLastName"
                  id="clientLastName"
                  value={payload.clientLastName}
                  onChange={handleInputChange}
                  style={{
                    border: "1px solid #014D88",
                    borderRadius: "0.2rem",
                  }}
                />
                {errors.clientLastName !== "" ? (
                  <span className={classes.error}>{errors.clientLastName}</span>
                ) : (
                  ""
                )}
              </FormGroup>
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
                />
                {/* {errors.firstName !== "" ? (
                  <span className={classes.error}>{errors.firstName}</span>
                ) : (
                  ""
                )} */}
              </FormGroup>
            </div>
            <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label for="firstName">
                  Name of service provider
                  <span style={{ color: "red" }}> *</span>
                </Label>
                <Input
                  className="form-control"
                  type="text"
                  name="nameOfServiceProvider"
                  id="nameOfServiceProvider"
                  value={payload.nameOfServiceProvider}
                  onChange={handleInputChange}
                  style={{
                    border: "1px solid #014D88",
                    borderRadius: "0.2rem",
                  }}
                />
                {errors.nameOfServiceProvider !== "" ? (
                  <span className={classes.error}>
                    {errors.nameOfServiceProvider}
                  </span>
                ) : (
                  ""
                )}
              </FormGroup>
            </div>
            <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label for="firstName">
                  Signature
                  <span style={{ color: "red" }}> *</span>
                </Label>
                <Input
                  className="form-control"
                  type="text"
                  name="signature"
                  id="signature"
                  value={payload.signature}
                  onChange={handleInputChange}
                  style={{
                    border: "1px solid #014D88",
                    borderRadius: "0.2rem",
                  }}
                />
                {errors.signature !== "" ? (
                  <span className={classes.error}>{errors.signature}</span>
                ) : (
                  ""
                )}
              </FormGroup>
            </div>

            <div className="form-group  col-md-6">
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
                  <span className={classes.error}>{errors.phoneNumber}</span>
                ) : (
                  ""
                )}
                {/* {basicInfo.phoneNumber.length >13 ||  basicInfo.phoneNumber.length <13? (
                                                <span className={classes.error}>{"The maximum and minimum required number is 13 digit"}</span>
                                                ) : "" } */}
              </FormGroup>
            </div>

            <div className="form-group  col-md-6">
              <FormGroup>
                <Label>
                  Categories of Services{" "}
                  <span style={{ color: "red" }}> *</span>
                </Label>
                <select
                  className="form-control"
                  name="categoryOfService"
                  id="categoryOfService"
                  onChange={handleInputChange}
                  value={payload.categoryOfService}
                  style={{
                    border: "1px solid #014D88",
                    borderRadius: "0.2rem",
                  }}
                >
                  <option value={""}>Select</option>
                  {genders.map((gender, index) => (
                    <option key={gender?.id} value={gender?.id}>
                      {gender?.display}
                    </option>
                  ))}
                </select>
                {errors.categoryOfService !== "" ? (
                  <span className={classes.error}>
                    {errors.categoryOfService}
                  </span>
                ) : (
                  ""
                )}
              </FormGroup>
            </div>
          </div>
          <br />

          <br />

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
      </div>
    </>
  );
};

export default ServicesProvided;
