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
import Select from "react-select";
// import { getAcount } from "../../../../utility";
import Cookies from "js-cookie";
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

const FamilyIndexTestingForm = (props) => {
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
    const [isClientCurrentlyOnHiv, setClientCurrentlyOnHiv] = useState(true)
    const [states, setStates] = useState([]);
    const [genders, setGenders] = useState([]);
    const [hivStatus, setHivStatus] = useState([]);
    const [serviceNeeded, setServiceNeeded] = useState([]);
    const [indexClientConfirmedHivPositive, setIndexClientConfirmedHivPositive] = useState(false)
    const [willingToHaveChildrenTested, setWillingToHaveChildrenTested] = useState(true);


    const [facilityName, setFacilityName] = useState(Cookies.get("facilityName"));
    const [allFacilities, setAllFacilities] = useState([]);
    // console.log(Cookies.get("facilityName"));

    const [payload, setPayload] = useState({
        referralDate: "",
        name: "",
        middleName: "",
        lastName: "",
        hospitalNumber: "",
        countryId: "1",
        stateId: "",
        province: "1",
        testingSetting: "",
        familyIndexClient: "",
        // facilityName:"",
        indexClientId: "",
        maritalStatus: "",
        alternativeContactNumber: "",
        dateIndexClientConfrimedHiv: "",
        reasonForIndexClientDateHivConfirmedNotSelected: "",
        isClientCurrentlyOnHiv: "",
        facilityName: Cookies.get("facilityName"),
        address: "",
        phoneNumber: "",
        sexId: "",
        dob: "",
        age: "",
        dateOfBirth: "",
        virallyUnsuppressed: "",
        treatmentDateInitiation: "",
        positionOfChildEnumerated: "",
        trackerSex: "",
        trackerAge: "",
        scheduleVisitDate: "",
        followUpAppointmentLocation: "",
        dateVisit: "",
        knownHivPositive: "",
        dateTested:"",
        hivTestResult:"",
        dateEnrolledInOVC:"",
        dateEnrolledOnArt:"",



        landmark: "",
        hivStatus: "",
        referreFromFacility: "",
        nameOfPersonRefferringClient: "",
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


    const loadFamilyIndexSetting = () => {
        axios
            .get(`${baseUrl}application-codesets/v2/TEST_SETTING`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setSetting(response.data);
            })
            .catch((error) => {
            });
    };

    const loadGenders = useCallback(async () => {
        getAllGenders()
            .then((response) => {
                setGenders(response);
            })
            .catch(() => {
            });
    }, []);

    useEffect(() => {
        loadGenders();
        loadFamilyIndexSetting();
        getCountry();
        getStateByCountryId();
        getAllFacilities();
    }, []);

    //Get list of State
    const getStateByCountryId = () => {
        getAllStateByCountryId()
            .then((res) => {
                setStates(res);
            })
            .catch(() => {
            });
    };
    const checkPhoneNumberBasic = (e, inputName) => {
        if (e) {
            setErrors({ ...errors, phoneNumber: "" });
        }
        const limit = 10;

        if (inputName === "phoneNumber") {
            setPayload({ ...payload, phoneNumber: e.slice(0, limit) });
        } else if (inputName === "alternativeContactNumber") {
            setPayload({ ...payload, alternativeContactNumber: e.slice(0, limit) })
        }
        else if (inputName === "phoneNoOfReferrringFacility") {
            setPayload({
                ...payload,
                phoneNoOfReferrringFacility: e.slice(0, limit),
            });
        } else if (inputName === "phoneNoOfRecievingFacility") {
            setPayload({ ...payload, phoneNoOfRecievingFacility: e.slice(0, limit) });
        }
    };

    // handle Facility Name to slect drop down
    const handleInputChangeObject = (e) => {
        // console.log(e);
        setPayload({
            ...payload,
            nameOfRecievingFacility: e.name,
            addressOfRecievingFacility: e.parentParentOrganisationUnitName,
            // lgaTransferTo: e.parentOrganisationUnitName,
        });
        setErrors({ ...errors, nameOfRecievingFacility: "" });
        // setSelectedState(e.parentParentOrganisationUnitName);
        // setSelectedLga(e.parentOrganisationUnitName);
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
            .catch((error) => {
            });
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
            .catch((e) => {
            });
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

    const handleFamilyRelationshipChange = (e) => {
        const { name, value } = e.target;
        setPayload(prevPayload => ({
            ...prevPayload,
            [name]: value,
            // Reset childNumber when family relationship changes
            childNumber: value === "Biological Child" ? "" : prevPayload.childNumber,
            // Reset familyIndexHivStatus when family relationship changes
            familyIndexHivStatus: ["Mother", "Father", "Biological Child", "Siblings"].includes(value) ? "" : prevPayload.familyIndexHivStatus,
            // Reset uan when family relationship changes
            uan: (value === "Mother" || value === "Father" || value === "Biological Child" || value === "Siblings") ? "" : prevPayload.uan,
            // Reset motherDead when family relationship changes
            motherDead: (value === "Mother" || value === "Father" || value === "Biological Child") ? "" : prevPayload.motherDead,
            // Reset yearMotherDied when family relationship changes
            yearMotherDied: (value === "Mother" || value === "Father" || value === "Biological Child") ? "" : prevPayload.yearMotherDied,
        }));
    };


    //Get list of HIV STATUS ENROLLMENT

    const handleInputChange = (e) => {
        setErrors({ ...temp, [e.target.name]: "" });

        if (e.target.name === "name" && e.target.value !== "") {
            const name = alphabetOnly(e.target.value);
            setPayload({ ...payload, [e.target.name]: name });
        } else if (e.target.name === "lastName" && e.target.value !== "") {
            const name = alphabetOnly(e.target.value);
            setPayload({ ...payload, [e.target.name]: name });
        } else if (e.target.name === "middleName" && e.target.value !== "") {
            const name = alphabetOnly(e.target.value);
            setPayload({ ...payload, [e.target.name]: name });
        } else if (e.target.name === "indexClientId" && e.target.value !== "") {
            //    setPayload({...payload, [e.target.name]: name })
        } else if (e.target.name === "dateIndexConfirmedHiv") {
            if (e.target.value !== "") {
                const name = e.target.name;
                setPayload({ ...payload, [e.target.name]: name })
                setIndexClientConfirmedHivPositive(false); // Hide extra fields when date is selected
            } else {
                setIndexClientConfirmedHivPositive(true); // Show extra fields if date is not selected
            }
        }
        else if (
            e.target.name === "nameOfContactPerson" &&
            e.target.value !== ""
        ) {
            const name = alphabetOnly(e.target.value);
            setPayload({ ...payload, [e.target.name]: name });
        } else if (
            e.target.name === "nameOfPersonRefferringClient" &&
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

    //End of Date of Birth and Age handling
    /*****  Validation  */
    const validate = () => {
        //HTS FORM VALIDATION

        temp.referralDate = payload.referralDate ? "" : "This field is required.";
        temp.name = payload.name ? "" : "This field is required.";
        // temp.dateIndexClientConfrimedHiv = payload.dateIndexClientConfrimedHiv ? "": "This is field is required" ;
        temp.lastName = payload.lastName ? "" : "This field is required.";
        temp.stateId = payload.stateId ? "" : "This field is required.";
        temp.province = payload.province ? "" : "This field is required.";
        temp.address = payload.address ? "" : "This field is required.";
        temp.phoneNumber = payload.phoneNumber ? "" : "This field is required.";
        temp.sexId = payload.sexId ? "" : "This field is required.";
        temp.dob = payload.dob ? "" : "This field is required.";
        temp.age = payload.age ? "" : "This field is required.";
        temp.hivStatus = payload.hivStatus ? "" : "This field is required.";
        temp.referreFromFacility = payload.referreFromFacility
            ? ""
            : "This field is required.";
        temp.nameOfPersonRefferringClient = payload.nameOfPersonRefferringClient
            ? ""
            : "This field is required.";

        temp.facilityName = payload.facilityName
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
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(payload);
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
                    <h2 style={{ color: "#000" }}> Family Index Testing Form</h2>
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
                                SECTION A
                            </div>
                            <div className="row">
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
                                        // disabled={false}
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
                                            // disabled
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
                                <div className="form-group mb-3 col-md-4">
                                    <FormGroup>
                                        <Label for="firstName">
                                            Facility Name
                                            <span style={{ color: "red" }}> *</span>
                                        </Label>
                                        <Input
                                            className="form-control"
                                            type="text"
                                            name="facilityName"
                                            id="facilityName"
                                            value={payload.facilityName}
                                            onChange={handleInputChange}
                                            style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                            }}
                                        // disabled
                                        />
                                        {errors.facilityName !== "" ? (
                                            <span className={classes.error}>
                                                {errors.facilityName}
                                            </span>
                                        ) : (
                                            ""
                                        )}
                                    </FormGroup>
                                </div>
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
                                        // disabled
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

                                <div className="form-group  col-md-4">
                                    <FormGroup>
                                        <Label>
                                            Setting <span style={{ color: "red" }}> *</span>
                                        </Label>
                                        <select
                                            className="form-control"
                                            name="testingSetting"
                                            id="testingSetting"
                                            value={payload.testingSetting}
                                            onChange={handleInputChange}
                                            style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                            }}
                                        // disabled={props.activePage.actionType === "view"}
                                        >
                                            <option value={""}></option>
                                            {setting.map((value) => (
                                                <option key={value.id} value={value.code}>
                                                    {value.display}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.testingSetting !== "" ? (
                                            <span className={classes.error}>
                                                {errors.testingSetting}
                                            </span>
                                        ) : (
                                            ""
                                        )}
                                    </FormGroup>
                                </div>

                                <div className="form-group  col-md-4">
                                    <FormGroup>
                                        <Label>
                                            Family Index Client <span style={{ color: "red" }}> *</span>
                                        </Label>
                                        <select
                                            className="form-control"
                                            name="familyIndexCleint"
                                            id="familyIndexClient"
                                            value={payload.familyIndexClient}
                                            onChange={handleInputChange}
                                            style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                            }}
                                        // disabled={props.activePage.actionType === "view"}
                                        >
                                            <option value={""}></option>
                                            {setting.map((value) => (
                                                <option key={value.id} value={value.code}>
                                                    {value.display}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.testingSetting !== "" ? (
                                            <span className={classes.error}>
                                                {errors.testingSetting}
                                            </span>
                                        ) : (
                                            ""
                                        )}
                                    </FormGroup>
                                </div>
                                <div className="form-group mb-3 col-md-4">
                                    <FormGroup>
                                        <Label for="firstName">
                                            Name <span style={{ color: "red" }}> *</span>
                                        </Label>
                                        <Input
                                            className="form-control"
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={payload.name}
                                            onChange={handleInputChange}
                                            style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                            }}
                                        // disabled
                                        />
                                        {errors.name !== "" ? (
                                            <span className={classes.error}>{errors.name}</span>
                                        ) : (
                                            ""
                                        )}
                                    </FormGroup>
                                </div>
                                <div className="form-group mb-3 col-md-4">
                                    <FormGroup>
                                        <Label for="firstName">
                                            Index Client ID
                                            <span style={{ color: "red" }}> *</span>
                                        </Label>
                                        <Input
                                            className="form-control"
                                            type="text"
                                            name="indexCleintId"
                                            id="indexCleintId"
                                            value={payload.indexCleintId}
                                            onChange={handleInputChange}
                                            style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                            }}
                                        // disabled
                                        />
                                        {errors.indexCleintId !== "" ? (
                                            <span className={classes.error}>
                                                {errors.indexCleintId}
                                            </span>
                                        ) : (
                                            ""
                                        )}
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
                                        // disabled
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

                                <div className="form-group mb-3 col-md-4">
                                    <FormGroup>
                                        <Label>
                                            Date Of Birth<span style={{ color: "red" }}> *</span>
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
                                        // disabled
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
                                            Marital Status <span style={{ color: "red" }}> *</span>
                                        </Label>
                                        <select
                                            className="form-control"
                                            name="maritalStatus"
                                            id="maritalStatus"
                                            value={payload.maritalStatus}
                                            onChange={handleInputChange}
                                            style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                            }}
                                        // disabled={props.activePage.actionType === "view"}
                                        >
                                            <option value={""}></option>
                                            {setting.map((value) => (
                                                <option key={value.id} value={value.code}>
                                                    {value.display}
                                                </option>
                                            ))}
                                        </select>
                                        {/* {errors.testingSetting !== "" ? (
                                            <span className={classes.error}>
                                                {errors.testingSetting}
                                            </span>
                                        ) : (
                                            ""
                                        )} */}
                                    </FormGroup>
                                </div>
                                <div className="form-group  col-md-4">
                                    <FormGroup>
                                        <Label>
                                            Phone Number <span style={{ color: "red" }}> *</span>
                                        </Label>
                                        <PhoneInput
                                            disabled={true}
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
                                            Alternative Contact Number <span style={{ color: "red" }}> *</span>
                                        </Label>
                                        <PhoneInput
                                            disabled={true}
                                            containerStyle={{
                                                width: "100%",
                                                border: "1px solid #014D88",
                                            }}
                                            inputStyle={{ width: "100%", borderRadius: "0px" }}
                                            country={"ng"}
                                            placeholder="(234)7099999999"
                                            maxLength={5}
                                            name="alternativeContactNumber"
                                            id="alternativeContactNumber"
                                            masks={{ ng: "...-...-....", at: "(....) ...-...." }}
                                            value={payload.alternativeContactNumber}
                                            onChange={(e) => {
                                                checkPhoneNumberBasic(e, "alternativeContactNumber");
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
                                            Descriptiven Residential Address <span style={{ color: "red" }}> *</span>
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

                                <div className="form-group col-md-4">
                                    <FormGroup>
                                        <Label for="">
                                            Date Of Index Client's confrimed HIV-positive test results <span style={{ color: "red" }}> *</span>{" "}
                                        </Label>
                                        <Input
                                            type="date"
                                            name="dateIndexClientConfrimedHiv"
                                            id="dateIndexClientConfrimedHiv"
                                            value={payload.dateIndexClientConfrimedHiv}
                                            onChange={handleInputChange}
                                            min="1929-12-31"
                                            max={moment(new Date()).format("YYYY-MM-DD")}
                                            style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.25rem",
                                            }}
                                        // disabled
                                        />
                                        {errors.dateIndexClientConfrimedHiv !== "" ? (
                                            <span className={classes.error}>
                                                {errors.referralDate}
                                            </span>
                                        ) : (
                                            ""
                                        )}
                                    </FormGroup>
                                </div>
                                {/* {indexClientConfirmedHivPositive && ( */}
                                <div className="form-group col-md-4">
                                    <Label > Why is Date Of Index Client's confrimed HIV-positive test results not selected</Label>
                                    <FormGroup>
                                        <select
                                            className="form-control"
                                            name="reasonForIndexClientDateHivConfirmedNotSelected"
                                            id="reasonForIndexClientDateHivConfirmedNotSelected"
                                            onChange={handleInputChange}
                                            value={payload.reasonForIndexClientDateHivConfirmedNotSelected}
                                            style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                            }}
                                        >
                                            <option value="">Select</option>
                                            <option value="Result not confirmed yet">Result not confirmed yet</option>
                                            <option value="NA">NA</option>
                                        </select>
                                    </FormGroup>
                                </div>
                                {/* )} */}
                                {/* if index client is hiv positive, and date is selected */}
                                <div className="form-group col-md-4 ">
                                    <Label >Is client current on HIV treatment?</Label>
                                    <FormGroup>
                                        <select
                                            className="form-control"
                                            name="hivTreatment"
                                            id="hivTreatment"
                                            onChange={handleInputChange}
                                            value={payload.hivTreatment}
                                            style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                            }}
                                        >
                                            <option value="">Select</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>

                                    </FormGroup>
                                </div>

                                {isClientCurrentlyOnHiv && (
                                    <div className="form-group mb-3 col-md-4">
                                        <FormGroup>
                                            <Label for="">
                                                Date of Treatment Initiation <span style={{ color: "red" }}> *</span>{" "}
                                            </Label>
                                            <Input
                                                type="date"
                                                name="treatDateInititial"
                                                id="treatmentDateInitiation"
                                                value={payload.treatmentDateInitiation}
                                                onChange={handleInputChange}
                                                min="1929-12-31"
                                                max={moment(new Date()).format("YYYY-MM-DD")}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.25rem",
                                                }}
                                            //   disabledg
                                            />
                                            {/* {errors.treatmentDateI !== "" ? (
                                          <span className={classes.error}>
                                            {errors.referralDate}
                                          </span>
                                        ) : (
                                          ""
                                        )} */}
                                        </FormGroup>
                                    </div>
                                )}

                                <div className="form-group col-md-4 ">
                                    <Label >virally unsuppressed</Label>
                                    <FormGroup>
                                        <select
                                            className="form-control"
                                            name="virallyUnsuppressed"
                                            id="virallyUnsuppressed"
                                            onChange={handleInputChange}
                                            value={payload.virallyUnsuppressed}
                                            style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                            }}
                                        >
                                            <option value="">Select</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>

                                    </FormGroup>
                                </div>
                            </div>

                            <br />

                        </div>
                        <div className="row">
                            <div
                                className="form-group col-md-12 text-center pt-2 mb-4"
                                style={{
                                    backgroundColor: "#992E62",
                                    width: "125%",
                                    height: "35px",
                                    color: "#fff",
                                    fontWeight: "bold",
                                }}
                            >
                                SECTION B
                            </div>

                        </div>
                        <div className="row">
                            <div className="form-group col-md-4">
                                <FormGroup>
                                    <Label for="familyRelationship">Family Relationship</Label>
                                    <select
                                        className="form-control"
                                        id="familyRelationship"
                                        name="familyRelationship"
                                        onChange={handleFamilyRelationshipChange}
                                        value={payload.familyRelationship}
                                    >
                                        <option value="">Select</option>
                                        <option value="Mother">Mother</option>
                                        <option value="Father">Father</option>
                                        <option value="Biological Child">Biological Child</option>
                                        <option value="Siblings">Siblings</option>
                                    </select>
                                    {errors.familyRelationship && <span className={classes.error}>{errors.familyRelationship}</span>}
                                </FormGroup>
                            </div>
                            {payload.familyRelationship === "Biological Child" && (
                                <div className="form-group col-md-4">
                                    <FormGroup>
                                        <Label for="childNumber">Child Number</Label>
                                        <select
                                            className="form-control"
                                            id="childNumber"
                                            name="childNumber"
                                            onChange={handleInputChange}
                                            value={payload.childNumber}
                                        >
                                            <option value="">Select</option>
                                            <option value="1st Child">1st Child</option>
                                            <option value="2nd Child">2nd Child</option>
                                            <option value="3rd Child">3rd Child</option>
                                            <option value="4th Child">4th Child</option>
                                            <option value="5th Child">5th Child</option>
                                            <option value="6th Child">6th Child</option>
                                            <option value="7th Child">7th Child</option>
                                        </select>
                                        {errors.childNumber && <span className={classes.error}>{errors.childNumber}</span>}
                                    </FormGroup>
                                </div>
                            )}

                            <div className="form-group col-md-4">
                                <FormGroup>
                                    <Label for="familyIndexHivStatus">Family Index HIV Status</Label>
                                    <select
                                        className="form-control"
                                        id="familyIndexHivStatus"
                                        name="familyIndexHivStatus"
                                        onChange={handleInputChange}
                                        value={payload.familyIndexHivStatus}
                                    >
                                        <option value="">Select</option>
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                    {errors.familyIndexHivStatus && <span className={classes.error}>{errors.familyIndexHivStatus}</span>}
                                </FormGroup>
                            </div>
                            {payload.familyIndexHivStatus && (["Mother", "Father", "Biological Child", "Siblings"].includes(payload.familyRelationship)) && (

                                <div className="form-group col-md-4">
                                    <FormGroup>
                                        <Label for="uan">UAN</Label>
                                        <input
                                            className="form-control"
                                            id="uan"
                                            type="text"
                                            name="uan"
                                            value={payload.uan}
                                            onChange={handleInputChange}
                                            disabled={payload.familyIndexHivStatus !== "Current on ART"}
                                        />
                                        {errors.uan && <span className={classes.error}>{errors.uan}</span>}
                                    </FormGroup>
                                </div>

                            )}
                            <div className="form-group col-md-4">
                                <FormGroup>
                                    <Label for="motherDead">Mother Dead?</Label>
                                    <select
                                        className="form-control"
                                        id="motherDead"
                                        name="motherDead"
                                        onChange={handleInputChange}
                                        value={payload.motherDead}
                                    >
                                        <option value="">Select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                    {errors.motherDead && <span className={classes.error}>{errors.motherDead}</span>}
                                </FormGroup>
                            </div>
                            {payload.motherDead === "Yes" && (
                                <div className="form-group col-md-4">
                                    <FormGroup>
                                        <Label for="yearMotherDied">Year Mother Died</Label>
                                        <input
                                            className="form-control"
                                            id="yearMotherDied"
                                            type="text"
                                            name="yearMotherDied"
                                            value={payload.yearMotherDied}
                                            onChange={handleInputChange}
                                        />
                                        {errors.yearMotherDied && <span className={classes.error}>{errors.yearMotherDied}</span>}
                                    </FormGroup>
                                </div>
                            )}
                            <div className="form-group col-md-4">
                                <FormGroup>
                                    <Label for="willingToHaveChildrenTested">Are you willing to have your children tested elsewhere by a health care worker?</Label>
                                    <select
                                        className="form-control"
                                        id="willingToHaveChildrenTested"
                                        name="willingToHaveChildrenTested"
                                        onChange={(e) => setWillingToHaveChildrenTested(e.target.value === "Yes")}
                                        value={willingToHaveChildrenTested ? "Yes" : "No"}
                                    >
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </FormGroup>
                            </div>
                        </div>
                        {willingToHaveChildrenTested && (
                            <div className="row">
                                <div
                                    className="form-group col-md-12 text-center pt-2 mb-4"
                                    style={{
                                        backgroundColor: "#992E62",
                                        width: "125%",
                                        height: "35px",
                                        color: "#fff",
                                        fontWeight: "bold",
                                    }}
                                >
                                    SECTION C
                                </div>

                                {/* SECTION C INPUT FILEDS  */}
                                <div className="row">
                                    <div className="form-group col-md-4">
                                        <FormGroup>
                                            <Label for="uan">Position of the Child Enumerator</Label>
                                            <input
                                                className="form-control"
                                                id="positionOfChildEnumerated"
                                                type="number"
                                                name="positionOfChildEnumerated"
                                                value={payload.positionOfChildEnumerated}
                                                onChange={handleInputChange}

                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="form-group col-md-4">
                                        <FormGroup>
                                            <Label for="sex">Sex</Label>
                                            <input
                                                className="form-control"
                                                id="trackerSex"
                                                type="text"
                                                name="trackerSex"
                                                value={payload.trackerSex}
                                                onChange={handleInputChange}

                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="form-group col-md-4">
                                        <FormGroup>
                                            <Label for="sex">Age</Label>
                                            <input
                                                className="form-control"
                                                id="trackerAge"
                                                type="text"
                                                name="trackerAge"
                                                value={payload.trackerAge}
                                                onChange={handleInputChange}

                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="form-group  col-md-4">
                                        <FormGroup>
                                            <Label>
                                                Follow Up Appointment location
                                            </Label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="followUpAppointmentLocation"
                                                id="followUpAppointmentLocation"
                                                value={payload.followUpAppointmentLocation}
                                                // disabled
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
                                            <Label for="">
                                                Schedule Visit Date <span style={{ color: "red" }}> *</span>{" "}
                                            </Label>
                                            <Input
                                                type="date"
                                                name="scheduleVisitDate"
                                                id="scheduleVisitDate"
                                                value={payload.scheduleVisitDate}
                                                onChange={handleInputChange}
                                                min="1929-12-31"
                                                max={moment(new Date()).format("YYYY-MM-DD")}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.25rem",
                                                }}
                                            // disabled
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
                                            <Label for="">
                                                Date  visit <span style={{ color: "red" }}> *</span>{" "}
                                            </Label>
                                            <Input
                                                type="date"
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
                                            // disabled
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
                                    <div className="form-group col-md-4 ">
                                        <Label >Known HIV Positive ?</Label>
                                        <FormGroup>
                                            <select
                                                className="form-control"
                                                name="knownHivPositive"
                                                id="knownHivPositive"
                                                onChange={handleInputChange}
                                                value={payload.knownHivPositive}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.2rem",
                                                }}
                                            >
                                                <option value="">Select</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>

                                        </FormGroup>
                                    </div>
                                    <div className="form-group mb-3 col-md-4">
                                        <FormGroup>
                                            <Label for="">
                                                Date Tested
                                            </Label>
                                            <Input
                                                type="date"
                                                name="datetTested"
                                                id="dateTested"
                                                value={payload.dateTested}
                                                onChange={handleInputChange}
                                                min="1929-12-31"
                                                max={moment(new Date()).format("YYYY-MM-DD")}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.25rem",
                                                }}
                                            // disabled
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
                                    <div className="form-group col-md-4 ">
                                        <Label >HIV Test Result </Label>
                                        <FormGroup>
                                            <select
                                                className="form-control"
                                                name="hivTestResult"
                                                id="hivTestResult"
                                                onChange={handleInputChange}
                                                value={payload.hivTestResult}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.2rem",
                                                }}
                                            >
                                                <option value="">Select</option>
                                                <option value="Tested Positive">Tested Positive</option>
                                                <option value="Teste Negaive">Tested Negative</option>
                                            </select>

                                        </FormGroup>
                                    </div>
                                    <div className="form-group mb-3 col-md-4">
                                        <FormGroup>
                                            <Label for="">
                                                Date Enrolled In Ovc
                                            </Label>
                                            <Input
                                                type="date"
                                                name="dateEnrolledInOVC"
                                                id="dateEnrolledInOVC"
                                                value={payload.dateEnrolledInOVC}
                                                onChange={handleInputChange}
                                                min="1929-12-31"
                                                max={moment(new Date()).format("YYYY-MM-DD")}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.25rem",
                                                }}
                                            // disabled
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
                                            <Label for="">
                                                Date Enrolled On ART
                                            </Label>
                                            <Input
                                                type="date"
                                                name="dateEnrolledOnArt"
                                                id="dateEnrolledOnArt"
                                                value={payload.dateEnrolledOnArt}
                                                onChange={handleInputChange}
                                                min="1929-12-31"
                                                max={moment(new Date()).format("YYYY-MM-DD")}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.25rem",
                                                }}
                                            // disabled
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
                                
                                </div>
                            </div>
                        )}

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

export default FamilyIndexTestingForm;
