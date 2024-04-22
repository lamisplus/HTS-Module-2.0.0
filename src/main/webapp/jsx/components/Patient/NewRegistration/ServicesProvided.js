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

import PhoneInput from "react-phone-input-2";
import { getAllGenders, alphabetOnly } from "../../../../utility";
import {useHistory} from "react-router-dom";


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
  const [serviceNeeded, setServiceNeeded] = useState("");

    const [payload, setPayload] = useState({
        nameOfFacilityProvider: props?.formInfo?.nameOfReceivingFacility,
        addressOfFacilityProvider: props?.formInfo?.addressOfReceivingFacility || "",
        visitDate: props?.formInfo?.receivingOrganization?.visitDate || "",
        comments: props?.formInfo?.comments || "",
        clientFirstName: props?.formInfo?.receivingOrganization?.clientFirstName,
        clientLastName: props?.formInfo?.receivingOrganization?.clientLastName,
        clientMiddleName: props?.formInfo?.receivingOrganization?.clientMiddleName,
        nameOfServiceProvider: props?.formInfo?.receivingOrganization?.nameOfServiceProvider || "",
        signature: props?.formInfo?.receivingOrganization?.signature || "",
        phoneNumber: props?.formInfo?.receivingOrganization?.phoneNumber || "",
        categoryOfService: props?.formInfo?.receivingOrganization?.categoryOfService
            || "",
        receivingFacilityLgaName: props?.formInfo?.receivingFacilityLgaName,
        receivingFacilityStateName: props?.formInfo?.receivingFacilityStateName
    });

 const history = useHistory();
  const [states1, setStates1] = useState([])
  const [lgas1, setLGAs1] = useState([])
  const [facilities1, setFacilities1] = useState([])
  const [selectedState, setSelectedState] = useState({})
  const [selectedFacility, setSelectedFacility] = useState({});
  const [selectedLga, setSelectedLga] = useState({});

    const handleItemClick = (page, completedMenu) => {
        props.handleItemClick(page);
        if (props.completed.includes(completedMenu)) {
        } else {
            props.setCompleted([...props.completed, completedMenu]);
        }
    };

  // ##############################################

  const SERVICE_NEEDED = () => {
    axios.get(`${baseUrl}application-codesets/v2/SERVICE_PROVIDED`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
        .then((response) => {
          if (response.data) {
            // console.log("SERVICE_NEEDED", response.data);
            // Find the object with the matching code
            const service = response.data.find(item => item.code === props.formInfo.serviceNeeded);
            if (service) {
              // setServiceNeeded(service.display);
              setPayload(prevPayload => ({ ...prevPayload, categoryOfService: service.display }));
            } else {
              console.error("Service not found");
            }
          }
        })
        .catch((e) => {
          console.error("Fetch Facilities error" + e);
        });
  };

  const loadStates1 = () => {
    axios.get(`${baseUrl}organisation-units/parent-organisation-units/1`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
        .then((response) => {
          if (response.data) {
            setStates1(response.data);
          }
        })
        .catch((e) => {
          // console.log("Fetch states error" + e);
        });
  };



  const loadLGA1 = (id) => {
    axios.get(`${baseUrl}organisation-units/parent-organisation-units/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
        .then((response) => {
          if (response.data) {
            setLGAs1(response.data);
            // const selectedLga = response.data.find(lga => lga.id === id);
            // setPayload(prevPayload => ({ ...prevPayload, lgaTransferTo: selectedLga ? selectedLga.name : "" }));
          }

        })
        .catch((e) => {
          // console.log("Fetch LGA error" + e);
        });
  };

  const loadFacilities1 = (id) => {
    axios.get(`${baseUrl}organisation-units/parent-organisation-units/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
        .then((response) => {
          if (response.data) {
            setFacilities1(response.data);

          }
        })
        .catch((e) => {
          // console.log("Fetch Facilities error" + e);
        });
  };

  const handleInputChangeLocation = (e) => {
    setErrors({ ...temp, [e.target.name]: "" });
    if(e.target.name === 'stateTransferTo'){
      let filteredState = states1.filter((each)=>{
        return each.name.toLowerCase()  === e.target.value.toLowerCase()
      })
      setPayload({ ...payload, receivingFacilityStateName : e.target.value });

      loadLGA1(filteredState[0].id);
    }
    if(e.target.name === 'lgaTransferTo'){
      let filteredState = lgas1.filter((each)=>{
        return each.name.toLowerCase()  === e.target.value.toLowerCase()
      })
      setPayload({ ...payload, [e.target.name]: e.target.value });
      loadFacilities1(filteredState[0].id);

    }

  };
  // ################################################
  const getGenders = () => {
    getAllGenders()
      .then((res) => {
        setGenders(res);
      })
      .catch((e) => {
        // console.log("error", e);
      });
    // ;
  };


  useEffect(() => {
    getGenders();
    loadStates1()
    SERVICE_NEEDED()
  }, []);

  const checkPhoneNumberBasic = (e, inputName) => {
    if (e) {
      setErrors({ ...errors, phoneNumber: "" });
    }
    const limit = 10;
    setPayload({ ...payload, phoneNumber: e.slice(0, limit) });
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

  /*****  Validation  */
  const validate = () => {
    //HTS FORM VALIDATION

    temp.nameOfFacilityProvider = payload.nameOfFacilityProvider
      ? ""
      : "This field is required.";
    temp.addressOfFacilityProvider = payload.addressOfFacilityProvider
      ? ""
      : "This field is required.";
    temp.visitDate = payload.visitDate ? "" : "This field is required.";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      htsClientReferralId: props.row.row.id,
      receivingOrganizationDTO: payload
    };
    // if (validate()) {
      try {
        setSaving(true);
        await axios.put(`${baseUrl}hts-client-referral/${props.row.row.id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSaving(false);
        toast.success("Record saved successfully", { position: toast.POSITION.BOTTOM_CENTER });
        // history.push("/");
          handleItemClick("refferal-history");
      } catch (error) {
        setSaving(false);
        const errorMessage = error.response?.data?.apierror?.message || "Something went wrong, please try again";
        toast.error(errorMessage, { position: toast.POSITION.BOTTOM_CENTER });
      }
    // }
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

            {/*###############################*/}
            <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label for="firstName">
                  Facility providing service State
                </Label>
                <Input
                    className="form-control"
                    type="text"
                    name="receivingFacilityStateName"
                    id="receivingFacilityStateName"
                    value={payload.receivingFacilityStateName}
                    onChange={handleInputChange}
                    style={{
                      border: "1px solid #014D88",
                      borderRadius: "0.2rem",
                    }}
                    disabled
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
                  Facility providing service LGA
                </Label>
                <Input
                    className="form-control"
                    type="text"
                    name="receivingFacilityLgaName"
                    id="receivingFacilityLgaName"
                    value={payload.receivingFacilityLgaName}
                    onChange={handleInputChange}
                    style={{
                      border: "1px solid #014D88",
                      borderRadius: "0.2rem",
                    }}
                    disabled
                />
              </FormGroup>
            </div>

            <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label for="firstName">
                  Facility providing Service
                </Label>
                <Input
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
                    disabled
                />
              </FormGroup>
            </div>


            {/*###############################*/}

            <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label for="firstName">
                  Address of Facility providing the service{" "}
                  <span style={{color: "red"}}> *</span>
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
                    disabled={props.row.action === "view" ? true : false}
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
                  Date <span style={{color: "red"}}> *</span>{" "}
                </Label>
                <Input
                    type="date"
                    name="visitDate"
                    id="visitDate"
                    value={payload.visitDate}
                    onChange={handleInputChange}
                    min={props.formInfo.dateVisit}
                    max={moment(new Date()).format("YYYY-MM-DD")}
                    style={{
                      border: "1px solid #014D88",
                      borderRadius: "0.25rem",
                    }}
                    disabled={props.row.action === "view" ? true : false}
                />
                {errors.visitDate !== "" ? (
                    <span className={classes.error}>{errors.visitDate}</span>
                ) : (
                    ""
                )}
              </FormGroup>
            </div>
            <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label for="firstName">
                  Client First Name <span style={{color: "red"}}> *</span>
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
                    disabled={props.row.action === "view" ? true : false}
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
                    disabled={props.row.action === "view" ? true : false}
                />
              </FormGroup>
            </div>

            <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label for="clientLastName">
                  Client Last Name <span style={{color: "red"}}> *</span>
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
                    disabled={props.row.action === "view" ? true : false}
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
                    disabled={props.row.action === "view" ? true : false}
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
                  <span style={{color: "red"}}> *</span>
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
                    disabled={props.row.action === "view" ? true : false}
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
                  <span style={{color: "red"}}> *</span>
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
                    disabled={props.row.action === "view" ? true : false}
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
                  Phone Number <span style={{color: "red"}}> *</span>
                </Label>
                <PhoneInput
                    containerStyle={{
                      width: "100%",
                      border: "1px solid #014D88",
                    }}
                    inputStyle={{width: "100%", borderRadius: "0px"}}
                    country={"ng"}
                    placeholder="(234)7099999999"
                    maxLength={5}
                    name="phoneNumber"
                    id="phoneNumber"
                    masks={{ng: "...-...-....", at: "(....) ...-...."}}
                    value={payload.phoneNumber}
                    onChange={(e) => {
                      checkPhoneNumberBasic(e, "phoneNumber");
                    }}

                    disabled={props.row.action === "view" ? true : false}
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

            {/*<div className="form-group  col-md-6">*/}
            {/*  <FormGroup>*/}
            {/*    <Label>*/}
            {/*      Categories of Services{" "}*/}
            {/*      <span style={{color: "red"}}> *</span>*/}
            {/*    </Label>*/}
            {/*    <select*/}
            {/*        className="form-control"*/}
            {/*        name="categoryOfService"*/}
            {/*        id="categoryOfService"*/}
            {/*        onChange={handleInputChange}*/}
            {/*        value={payload.categoryOfService}*/}
            {/*        style={{*/}
            {/*          border: "1px solid #014D88",*/}
            {/*          borderRadius: "0.2rem",*/}
            {/*        }}*/}
            {/*    >*/}
            {/*      <option value={""}>Select</option>*/}
            {/*      {genders.map((gender, index) => (*/}
            {/*          <option key={gender?.id} value={gender?.id}>*/}
            {/*            {gender?.display}*/}
            {/*          </option>*/}
            {/*      ))}*/}
            {/*    </select>*/}
            {/*    {errors.categoryOfService !== "" ? (*/}
            {/*        <span className={classes.error}>*/}
            {/*        {errors.categoryOfService}*/}
            {/*      </span>*/}
            {/*    ) : (*/}
            {/*        ""*/}
            {/*    )}*/}
            {/*  </FormGroup>*/}
            {/*</div>*/}

            <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label for="firstName">
                  Categories of Services{" "}
                </Label>
                <Input
                    className="form-control"
                    type="text"
                    name="serviceCategory"
                    id="serviceCategory"
                    value={payload.categoryOfService}
                    onChange={handleInputChange}
                    style={{
                      border: "1px solid #014D88",
                      borderRadius: "0.2rem",
                    }}
                    disabled
                />
              </FormGroup>
            </div>
          </div>
          <br/>

          <br/>

          <br/>
            {props.row.action === 'update' && (<div className="row">
                    <div className="form-group mb-3 col-md-6">
                        <Button
                            content="Done"
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
      </div>
    </>
  );
};

export default ServicesProvided;
