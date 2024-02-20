import React, { useCallback, useEffect, useState } from "react";
import { FormGroup, Label, CardBody, Spinner, Input, Form } from "reactstrap";
import * as moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent } from "@material-ui/core";
import axios from "axios";
import { token, url as baseUrl } from "../../../../../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
// import {Link, useHistory, useLocation} from "react-router-dom";
// import {TiArrowBack} from 'react-icons/ti'
// import {token, url as baseUrl } from "../../../api";
import "react-phone-input-2/lib/style.css";
import { Button } from "semantic-ui-react";
// import 'semantic-ui-css/semantic.min.css';
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Badge from "@mui/material/Badge";
import PersonIcon from "@mui/icons-material/Person";

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
}));

const PnsForm = (props) => {
    const classes = useStyles();
    const [saving, setSaving] = useState(false);
    const [sexs, setSexs] = useState([]);
    const [notificationContact, setNotificationContact] = useState([]);
    const [ageDisabled, setAgeDisabled] = useState(true);
    const [indexTesting, setIndexTesting] = useState([]);
    const [consent, setConsent] = useState([]);
    const [hivTestDate, setHivTestDate] = useState("");
    const [errors, setErrors] = useState({});
    const [states, setStates] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [elicitedCount, setElicitedCount] = useState(0);
    const [setting, setSetting] = useState([]);
    const [isClientCurrentlyOnHiv, setIsClientCurrentlyOnHiv] = useState(true);


    let temp = { ...errors };
    const [objValuesIndex, setObjValuesIndex] = useState({
        htsClientId: null,
        indexNotificationServicesElicitation: {},
        personId: null,
    });

    const [objValues, setObjValues] = useState({
        providerNameCompletingForm: "",
        dob: "",
        phoneNumber: "",
        altPhoneNumber: "",
        sex: "",
        htsClientId: props && props.patientObj ? props.patientObj.id : "",
        physicalHurt: "",
        threatenToHurt: "",
        freedomDenial:"",
        descriptiveResidentialAddress: "",
        relativeToIndexClient: "",
        currentlyLiveWithPartner: "",
        partnerTestedPositive: "",
        sexuallyUncomfortable: "",
        notificationMethod: "",
        datePartnerCameForTesting: "",
        offeredPns: "",
        acceptedPns: "",
        elicited: "",
        stateId: "",
        lga: "",
        facilityName: "",
        testingSetting: "",
        providerRoleCompletingForm: "",
        maritalStatusId: "",
        dateIndexClientConfirmedHiv: "",
        hivTreatment: "",
        treatmentDateInitiation: "",
        recencyTesting:"",
        artEnrollmentNumber: "",
        facilityOfEnrollment: "",
        indexClientId:"",
        partnerId:"",
        partnerName:"",
        numberOfPartnerIdentifiedFromClientIndex:"",
        partnerAge:"",
        partnerSex:"",
        partnerAddress:"",
        partnerPhoneNumber:"",
        contactTracing:"",
        numberOfAttempt:"",
        partnerKnownHivPositiveStatus:"",
        datePartnerEnrolledOnArt:"",
        acceptedHts:"",


        datePartnerTested: "",
        partnerCurrentHivStatus : "",
    });


    useEffect(() => {
        Sex();
        getStates();
        NotificationContact();
        IndexTesting();
        Consent();
        if (props.patientObj) {
            if (props.patientObj.dateVisit && props.patientObj.dateVisit !== "") {
                setHivTestDate(props.patientObj.dateVisit);
            } else {
                setHivTestDate("");
            }
        }
    }, [props.patientObj]);


    useEffect(() => {
        loadFamilyIndexSetting();
    }, []);

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

    function getStateByCountryId(getCountryId) {
        axios
            .get(
                `${baseUrl}organisation-units/parent-organisation-units/${getCountryId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((response) => {
                setStates(response.data);
            })
            .catch((error) => {
                //console.log(error);
            });
    }

    function getProvincesId(getStateId) {
        axios
            .get(
                `${baseUrl}organisation-units/parent-organisation-units/${getStateId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((response) => {
                setProvinces(response.data);
            })
            .catch((error) => {
                //console.log(error);
            });
    }

    const getProvinces = (e) => {
        const stateId = e.target.value;
        setObjValues({ ...objValues, stateId: e.target.value });
        axios
            .get(
                `${baseUrl}organisation-units/parent-organisation-units/${stateId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((response) => {
                setProvinces(
                    response.data.sort((x, y) => {
                        return x.id - y.id;
                    })
                );
            })
            .catch((error) => {
                //console.log(error);
            });
    };

    const getStates = () => {
        getStateByCountryId("1");
        setObjValues({ ...objValues, countryId: 1 });
    };

    //Get list of Genders from
    const Sex = () => {
        axios
            .get(`${baseUrl}application-codesets/v2/SEX`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                //console.log(response.data);
                setSexs(response.data);
            })
            .catch((error) => {
                //console.log(error);
            });
    };
    //Get list of IndexTesting
    const IndexTesting = () => {
        axios
            .get(`${baseUrl}application-codesets/v2/INDEX_TESTING`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setIndexTesting(response.data);
            })
            .catch((error) => {
                //console.log(error);
            });
    };
    ///CONSENT	Yes		en	CONSENT
    const Consent = () => {
        axios
            .get(`${baseUrl}application-codesets/v2/CONSENT`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setConsent(response.data);
            })
            .catch((error) => {
                //console.log(error);
            });
    };
    const NotificationContact = () => {
        axios
            .get(`${baseUrl}application-codesets/v2/NOTIFICATION_CONTACT`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                //console.log(response.data);
                setNotificationContact(response.data);
            })
            .catch((error) => {
                //console.log(error);
            });
    };
    const handleItemClick = (page, completedMenu) => {
        props.handleItemClick(page);
        if (props.completed.includes(completedMenu)) {
        } else {
            props.setCompleted([...props.completed, completedMenu]);
        }
    };
    const handleItemClickPage = (page) => {
        props.handleIClickPage(page);
    };
    const handleInputChange = (e) => {
        //setErrors({...temp, [e.target.name]:""})
        if (e.target.name === "providerNameCompletingForm" && e.target.value !== "") {
            const name = alphabetOnly(e.target.value);
            setObjValues({ ...objValues, [e.target.name]: name });
        }
        if (e.target.name === "lastName" && e.target.value !== "") {
            const name = alphabetOnly(e.target.value);
            setObjValues({ ...objValues, [e.target.name]: name });
        }
        if (e.target.name === "clientName" && e.target.value !== "") {
            const name = alphabetOnly(e.target.value);
            setObjValues({ ...objValues, [e.target.name]: name });
        }
        // if((e.target.name !=='maritalStatusId' && e.target.value!=='5' )){//logic for marital status
        //     setHideNumChild(true)
        // }else{
        //     setHideNumChild(false)
        // }
        setObjValues({ ...objValues, [e.target.name]: e.target.value });
    };
    //Date of Birth and Age handle
    const handleDobChange = (e) => {
        if (e.target.value) {
            const today = new Date();
            const birthDate = new Date(e.target.value);
            let age_now = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age_now--;
            }
            objValues.age = age_now;

            //setBasicInfo({...basicInfo, age: age_now});
        } else {
            setObjValues({ ...objValues, age: "" });
        }
        setObjValues({ ...objValues, [e.target.name]: e.target.value });

        setObjValues({ ...objValues, dob: e.target.value });
    };
    const handleDateOfBirthChange = (e) => {
        if (e.target.value === "Actual") {
            objValues.isDateOfBirthEstimated = false;
            setAgeDisabled(true);
        } else if (e.target.value === "Estimated") {
            objValues.isDateOfBirthEstimated = true;
            setAgeDisabled(false);
        }
    };
    const handleAgeChange = (e) => {
        if (!ageDisabled && e.target.value) {
            const currentDate = new Date();
            currentDate.setDate(15);
            currentDate.setMonth(5);
            const estDob = moment(currentDate.toISOString());
            const dobNew = estDob.add(e.target.value * -1, "years");
            setObjValues({ ...objValues, dob: moment(dobNew).format("YYYY-MM-DD") });
            objValues.dob = moment(dobNew).format("YYYY-MM-DD");
        }
        setObjValues({ ...objValues, age: e.target.value });
    };
    //End of Date of Birth and Age handling
    const checkPhoneNumberBasic = (e, inputName) => {
        const limit = 10;
        setObjValues({ ...objValues, [inputName]: e.slice(0, limit) });
    };
    const alphabetOnly = (value) => {
        const result = value.replace(/[^a-z]/gi, "");
        return result;
    };
    const validate = () => {
        //HTS FORM VALIDATION
        //temp.acceptedPns = objValues.acceptedPns ? "" : "This field is required."
        temp.offeredPns = objValues.offeredPns ? "" : "This field is required.";

        setErrors({ ...temp });
        return Object.values(temp).every((x) => x == "");
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            setSaving(true);
            objValues.isDateOfBirthEstimated =
                objValues.isDateOfBirthEstimated == true ? 1 : 0;
            axios
                .post(`${baseUrl}index-elicitation`, objValues, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    setSaving(false);
                    toast.success("Record save successfully", {
                        position: toast.POSITION.BOTTOM_CENTER,
                    });
                    if (
                        objValues.offeredPns !== "No" &&
                        objValues.acceptedPns !== "No"
                        // objValues.elicited !== "No"
                    ) {
                        setElicitedCount(elicitedCount + 1);
                        setObjValues({
                            providerNameCompletingForm: "",
                            clientName: "",
                            lastName: "",
                            dob: "",
                            phoneNumber: "",
                            altPhoneNumber: "",
                            sex: "",
                            htsClientId: props && props.patientObj ? props.patientObj.id : "",
                            physicalHurt: "",
                            threatenToHurt: "",
                            descriptiveResidentialAddress: "",
                            hangOutSpots: "",
                            relativeToIndexClient: "",
                            currentlyLiveWithPartner: "",
                            partnerTestedPositive: "",
                            sexuallyUncomfortable: "",
                            notificationMethod: "",
                            datePartnerCameForTesting: "",
                            age: "",
                            isDateOfBirthEstimated: false,
                            //offeredPns:"",
                            //acceptedPns:"",
                            //elicited: "",
                            stateId: "",
                            lga: "",
                            datePartnerTested: "",
                            partnerCurrentHivStatus : "",
                        });
                    }
                    //handleItemClickPage('list')
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
        }
    };

    return (
        <>
            <Card className={classes.root}>
                <CardBody>
                    <h2 style={{ color: "#000" }}>
                        Partner Notification Services
                        <Button
                            variant="contained"
                            color="primary"
                            className=" float-end  mr-2 mt-2"
                            onClick={() => handleItemClickPage("list")}
                        //startIcon={<FaUserPlus size="10"/>}
                        >
                            <span style={{ textTransform: "capitalize" }}>
                                {" "}
                                Back To Client List
                            </span>
                        </Button>
                    </h2>

                    <br />
                    <br />
                    <form>
                        <div className="row">
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>
                                        Offered PNS ? <span style={{ color: "red" }}> *</span>
                                    </Label>
                                    <select
                                        className="form-control"
                                        name="offeredPns"
                                        id="offeredPns"
                                        value={objValues.offeredPns}
                                        onChange={handleInputChange}
                                        style={{
                                            border: "1px solid #014D88",
                                            borderRadius: "0.2rem",
                                        }}
                                    >
                                        <option value={""}></option>
                                        {consent.map((value) => (
                                            <option key={value.id} value={value.display}>
                                                {value.display}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.offeredPns !== "" ? (
                                        <span className={classes.error}>{errors.offeredPns}</span>
                                    ) : (
                                        ""
                                    )}
                                </FormGroup>
                            </div>
                            {objValues.offeredPns !== "" && objValues.offeredPns !== "No" && (
                                <div className="form-group  col-md-4">
                                    <FormGroup>
                                        <Label>
                                            Accepted PNS ? <span style={{ color: "red" }}> </span>
                                        </Label>
                                        <select
                                            className="form-control"
                                            name="acceptedPns"
                                            id="acceptedPns"
                                            value={objValues.acceptedPns}
                                            onChange={handleInputChange}
                                            style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                            }}
                                        >
                                            <option value={""}></option>
                                            {consent.map((value) => (
                                                <option key={value.id} value={value.display}>
                                                    {value.display}
                                                </option>
                                            ))}
                                        </select>
                                    </FormGroup>
                                </div>
                            )}
                            {objValues.acceptedPns !== "" &&
                                objValues.acceptedPns !== "No" && (
                                    <div className="form-group  col-md-4">
                                        <FormGroup>
                                            <Label>
                                                Elicited ? <span style={{ color: "red" }}> </span>
                                            </Label>
                                            <select
                                                className="form-control"
                                                name="elicited"
                                                id="elicited"
                                                value={objValues.elicited}
                                                onChange={handleInputChange}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.2rem",
                                                }}
                                            >
                                                <option value={""}></option>
                                                {consent.map((value) => (
                                                    <option key={value.id} value={value.display}>
                                                        {value.display}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormGroup>
                                    </div>
                                )}
                        </div>

                        <div className="row">
                            {objValues.elicited !== "" && objValues.elicited !== "No" && (
                                <>
                                    <div className="form-group  col-md-4">
                                        <FormGroup>
                                            <Label>
                                                State <span style={{color: "red"}}> *</span>
                                            </Label>
                                            <select
                                                className="form-control"
                                                name="state"
                                                id="state"
                                                onChange={getProvinces}
                                                value={objValues.stateId}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.2rem",
                                                }}
                                            >
                                                <option value={""}></option>
                                                {states.map((value) => (
                                                    <option key={value.id} value={value.id}>
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
                                                LGA <span style={{color: "red"}}> *</span>
                                            </Label>
                                            <select
                                                className="form-control"
                                                name="lga"
                                                id="lga"
                                                value={objValues.lga}
                                                onChange={handleInputChange}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.2rem",
                                                }}
                                            >
                                                <option value={""}></option>
                                                {provinces.map((value, index) => (
                                                    <option key={index} value={value.id}>
                                                        {value.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.lga !== "" ? (
                                                <span className={classes.error}>{errors.lga}</span>
                                            ) : (
                                                ""
                                            )}
                                        </FormGroup>
                                    </div>
                                    <div className="form-group mb-3 col-md-4">
                                        <FormGroup>
                                            <Label for="providerNameCompletingForm">
                                                Facility Name
                                                <span style={{color: "red"}}> *</span>
                                            </Label>
                                            <Input
                                                className="form-control"
                                                type="text"
                                                name="facilityName"
                                                id="facilityName"
                                                value={objValues.facilityName}
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
                                            <Label>Date</Label>
                                            <input
                                                className="form-control"
                                                type="date"
                                                name="dob"
                                                id="dob"
                                                max={moment(new Date()).format("YYYY-MM-DD")}
                                                value={objValues.dob}
                                                onChange={handleDobChange}
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
                                                Setting <span style={{color: "red"}}> *</span>
                                            </Label>
                                            <select
                                                className="form-control"
                                                name="testingSetting"
                                                id="testingSetting"
                                                value={objValues.testingSetting}
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
                                            <Label for="">Name of provider completing the form</Label>
                                            <Input
                                                type="text"
                                                name="providerNameCompletingForm"
                                                id="providerNameCompletingForm"
                                                value={objValues.providerNameCompletingForm}
                                                onChange={handleInputChange}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.25rem",
                                                }}
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="form-group  col-md-4">
                                        <FormGroup>
                                            <Label>
                                                Role of the provider completing Form<span
                                                style={{color: "red"}}> *</span>
                                            </Label>
                                            <select
                                                className="form-control"
                                                name="providerRoleCompletingForm"
                                                id="providerRoleCompletingForm"
                                                value={objValues.providerRoleCompletingForm}
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
                                        SECTION 1 : INFORMATION ABOUT THE INDEX CLIENT
                                    </div>

                                    <div className="form-group mb-3 col-md-4">
                                        <FormGroup>
                                            <Label for="">Client's Name</Label>
                                            <Input
                                                type="text"
                                                name="clientName"
                                                id="clientName"
                                                value={objValues.clientName}
                                                onChange={handleInputChange}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.25rem",
                                                }}
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="form-group mb-3 col-md-4">
                                        <FormGroup>
                                            <Label for="">Index Client ID </Label>
                                            <Input
                                                type="text"
                                                name="indexClientId"
                                                id="indexClientId"
                                                value={objValues.indexClientId}
                                                onChange={handleInputChange}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.25rem",
                                                }}
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="form-group  col-md-4">
                                        <FormGroup>
                                            <Label>Sex </Label>
                                            <select
                                                className="form-control"
                                                name="sex"
                                                id="sex"
                                                value={objValues.sex}
                                                onChange={handleInputChange}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.2rem",
                                                }}
                                            >
                                                <option value={""}></option>
                                                {sexs.map((value) => (
                                                    <option key={value.id} value={value.id}>
                                                        {value.display}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormGroup>
                                    </div>
                                    {/*<div className="form-group mb-3 col-md-4">*/}
                                    {/*    <FormGroup>*/}
                                    {/*        <Label for="">Last Name</Label>*/}
                                    {/*        <Input*/}
                                    {/*            type="text"*/}
                                    {/*            name="lastName"*/}
                                    {/*            id="lastName"*/}
                                    {/*            value={objValues.lastName}*/}
                                    {/*            onChange={handleInputChange}*/}
                                    {/*            style={{*/}
                                    {/*                border: "1px solid #014D88",*/}
                                    {/*                borderRadius: "0.25rem",*/}
                                    {/*            }}*/}
                                    {/*        />*/}
                                    {/*    </FormGroup>*/}
                                    {/*</div>*/}
                                    <div className="form-group mb-2 col-md-4">
                                        <FormGroup>
                                            <Label>Date Of Birth</Label>
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
                                            <Label>Age</Label>
                                            <input
                                                className="form-control"
                                                type="number"
                                                name="age"
                                                id="age"
                                                value={objValues.age}
                                                disabled={ageDisabled}
                                                onChange={handleAgeChange}
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
                                                Marital Status <span style={{color: "red"}}> *</span>
                                            </Label>
                                            <select
                                                className="form-control"
                                                name="maritalStatus"
                                                id="maritalStatus"
                                                value={objValues.maritalStatus}
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
                                    <div className="form-group mb-3 col-md-4">
                                        <FormGroup>
                                            <Label for="">Phone Number</Label>

                                            <PhoneInput
                                                containerStyle={{
                                                    width: "100%",
                                                    border: "1px solid #014D88",
                                                }}
                                                inputStyle={{width: "100%", borderRadius: "0px"}}
                                                country={"ng"}
                                                placeholder="(234)7099999999"
                                                minLength={10}
                                                name="phoneNumber"
                                                id="phoneNumber"
                                                masks={{ng: "...-...-....", at: "(....) ...-...."}}
                                                value={objValues.phoneNumber}
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
                                        </FormGroup>
                                    </div>

                                    <div className="form-group mb-3 col-md-4">
                                        <FormGroup>
                                            <Label for="">Alternative Phone Number</Label>
                                            <PhoneInput
                                                containerStyle={{
                                                    width: "100%",
                                                    border: "1px solid #014D88",
                                                }}
                                                inputStyle={{width: "100%", borderRadius: "0px"}}
                                                country={"ng"}
                                                placeholder="(234)7099999999"
                                                minLength={10}
                                                name="altPhoneNumber"
                                                id="altPhoneNumber"
                                                masks={{ng: "...-...-....", at: "(....) ...-...."}}
                                                value={objValues.altPhoneNumber}
                                                onChange={(e) => {
                                                    checkPhoneNumberBasic(e, "altPhoneNumber");
                                                }}
                                                //onChange={(e)=>{handleInputChangeBasic(e,'phoneNumber')}}
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="form-group mb-3 col-md-4">
                                        <FormGroup>
                                            <Label for=""> Descriptive Residential Address </Label>
                                            <Input
                                                type="text"
                                                name="descriptiveResidentialAddress"
                                                id="descriptiveResidentialAddress"
                                                value={objValues.descriptiveResidentialAddress}
                                                onChange={handleInputChange}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.25rem",
                                                }}
                                            />
                                        </FormGroup>
                                    </div>


                                    <div className="form-group col-md-4">
                                        <FormGroup>
                                            <Label for="">
                                                Date Of Index Client's confrimed HIV-positive test results <span
                                                style={{color: "red"}}> *</span>{" "}
                                            </Label>
                                            <Input
                                                type="date"
                                                name="dateIndexClientConfrimedHiv"
                                                id="dateIndexClientConfrimedHiv"
                                                value={objValues.dateIndexClientConfirmedHiv}
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

                                    {/* )} */}
                                    {/* if index client is hiv positive, and date is selected */}
                                    <div className="form-group col-md-4 ">
                                        <Label>Is client current on HIV treatment?</Label>
                                        <FormGroup>
                                            <select
                                                className="form-control"
                                                name="hivTreatment"
                                                id="hivTreatment"
                                                onChange={handleInputChange}
                                                value={objValues.hivTreatment}
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
                                                    Date of Treatment Initiation <span
                                                    style={{color: "red"}}> *</span>{" "}
                                                </Label>
                                                <Input
                                                    type="date"
                                                    name="treatDateInititial"
                                                    id="treatmentDateInitiation"
                                                    value={objValues.treatmentDateInitiation}
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
                                        <Label>Recency Testing</Label>
                                        <FormGroup>
                                            <select
                                                className="form-control"
                                                name="recencyTesting"
                                                id="recencyTesting"
                                                onChange={handleInputChange}
                                                value={objValues.recencyTesting}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.2rem",
                                                }}
                                            >
                                                <option value="">Select</option>
                                                <option value="Recent Infection">Recent Infection</option>
                                                <option value="Long Infection">Recent Infection</option>
                                                <option value="Not Done">Note Done</option>
                                            </select>

                                        </FormGroup>
                                    </div>

                                    <div className="form-group mb-3 col-md-4">
                                        <FormGroup>
                                            <Label for=""> ART Enrollment Number </Label>
                                            <Input
                                                type="text"
                                                name="artEnrollmentNumber"
                                                id="artEnrollmentNumber"
                                                value={objValues.artEnrollmentNumber}
                                                onChange={handleInputChange}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.25rem",
                                                }}
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="form-group mb-3 col-md-4">
                                        <FormGroup>
                                            <Label for=""> Facility Of Enrollment </Label>
                                            <Input
                                                type="text"
                                                name="facilityOfEnrollment"
                                                id="facilityOfEnrollment"
                                                value={objValues.facilityOfEnrollment}
                                                onChange={handleInputChange}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.25rem",
                                                }}
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="form-group  col-md-4">
                                        <FormGroup>
                                            <Label>Notification Method selected*</Label>
                                            <select
                                                className="form-control"
                                                name="notificationMethod"
                                                id="notificationMethod"
                                                value={objValues.notificationMethod}
                                                onChange={handleInputChange}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.2rem",
                                                }}
                                            >
                                                <option value={""}></option>
                                                {notificationContact.map((value) => (
                                                    <option key={value.id} value={value.id}>
                                                        {value.display}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormGroup>
                                    </div>

                                    <div className="form-group  col-md-4">
                                        <FormGroup>
                                            <Label>Notification Method selected*</Label>
                                            <select
                                                className="form-control"
                                                name="notificationMethod"
                                                id="notificationMethod"
                                                value={objValues.notificationMethod}
                                                onChange={handleInputChange}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.2rem",
                                                }}
                                            >
                                                <option value={""}></option>
                                                {notificationContact.map((value) => (
                                                    <option key={value.id} value={value.id}>
                                                        {value.display}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormGroup>
                                    </div>

                                    <div className="form-group mb-3 col-md-4">
                                        <FormGroup>
                                            <Label for=""> Number of Partner <span> {" "} (sexual or social) identified/elicited from index </span>
                                            </Label>
                                            <Input
                                                type="number"
                                                name="numberOfPartnerIdentifiedFromClientIndex"
                                                id="numberOfPartnerIdentifiedFromClientIndex"
                                                value={objValues.numberOfPartnerIdentifiedFromClientIndex}
                                                onChange={handleInputChange}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.25rem",
                                                }}
                                                disabled
                                            />
                                        </FormGroup>
                                    </div>

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
                                        SECTION 2 : LISTING INDEX CLIENT PARTNER
                                    </div>
                                    <p style={{color: "black", marginBottom: "20px"}}>
                                        <i>
                                            Instruction: Ask index client to list all the client that have had sex with
                                            in the last 12 months. who may be risk to HIV and or partners who they share
                                            needle for injection of drugs where index client alluded to injection drugs
                                        </i>
                                    </p>

                                    <div className="form-group mb-3 col-md-4">
                                        <FormGroup>
                                            <Label for="">Partner ID </Label>
                                            <Input
                                                type="text"
                                                name="partnerId"
                                                id="partnerId"
                                                value={objValues.partnerId}
                                                onChange={handleInputChange}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.25rem",
                                                }}
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="form-group mb-3 col-md-4">
                                        <FormGroup>
                                            <Label for=""> Name of Partner <span> {" "} (Enter surname first) </span>
                                            </Label>
                                            <Input
                                                type="text"
                                                name="partnerName"
                                                id="partnerName"
                                                value={objValues.partnerName}
                                                onChange={handleInputChange}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.25rem",
                                                }}
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="form-group  col-md-4">
                                        <FormGroup>
                                            <Label>Sex </Label>
                                            <select
                                                className="form-control"
                                                name="partnerSex"
                                                id="partnerSex"
                                                value={objValues.partnerSex}
                                                onChange={handleInputChange}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.2rem",
                                                }}
                                            >
                                                <option value={""}></option>
                                                {sexs.map((value) => (
                                                    <option key={value.id} value={value.id}>
                                                        {value.display}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormGroup>
                                    </div>
                                    <div className="form-group mb-3 col-md-4">
                                        <FormGroup>
                                            <Label>Age <span>{" "} (In years) </span> </Label>
                                            <input
                                                className="form-control"
                                                type="number"
                                                name="partnerAge"
                                                id="partnerAge"
                                                value={objValues.partnerAge}
                                                // disabled={ageDisabled}
                                                onChange={handleAgeChange}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.2rem",
                                                }}
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="form-group mb-3 col-md-4">
                                        <FormGroup>
                                            <Label for=""> Home/Contact Address <span> {" "} include landmark </span>
                                            </Label>
                                            <Input
                                                type="text"
                                                name="partnerAdress"
                                                id="partnerAddress"
                                                value={objValues.partnerAddress}
                                                onChange={handleInputChange}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.25rem",
                                                }}
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="form-group mb-3 col-md-4">
                                        <FormGroup>
                                            <Label for=""> Contact Phone Number</Label>

                                            <PhoneInput
                                                containerStyle={{
                                                    width: "100%",
                                                    border: "1px solid #014D88",
                                                }}
                                                inputStyle={{width: "100%", borderRadius: "0px"}}
                                                country={"ng"}
                                                placeholder="(234)7099999999"
                                                minLength={10}
                                                name="partnerPhoneNumber"
                                                id="partnerPhoneNumber"
                                                masks={{ng: "...-...-....", at: "(....) ...-...."}}
                                                value={objValues.partnerPhoneNumber}
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
                                        </FormGroup>
                                    </div>
                                    <div className="form-group  col-md-4">
                                        <FormGroup>
                                            <Label>
                                                Relationship to Index Client{" "}
                                                <span style={{color: "red"}}> *</span>
                                            </Label>
                                            <select
                                                className="form-control"
                                                name="relativeToIndexClient"
                                                id="relativeToIndexClient"
                                                value={objValues.relativeToIndexClient}
                                                onChange={handleInputChange}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.2rem",
                                                }}
                                            >
                                                <option value={""}></option>
                                                {indexTesting.map((value) => (
                                                    <option key={value.id} value={value.id}>
                                                        {value.display}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormGroup>
                                    </div>
                                    <div className="form-group  col-md-4">
                                        <FormGroup>
                                            <Label>
                                                Contact tracing
                                            </Label>
                                            <select
                                                className="form-control"
                                                name="contactTarcing"
                                                id="contactTracing"
                                                value={objValues.contactTracing}
                                                onChange={handleInputChange}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.2rem",
                                                }}
                                            >
                                                <option value={""}>select</option>
                                                <option value="Phone calls">
                                                    Phone calls
                                                </option>
                                                <option value="Physical visit">
                                                    Physical visit
                                                </option>
                                            </select>
                                        </FormGroup>
                                    </div>

                                    <div className="form-group mb-3 col-md-4">
                                        <FormGroup>
                                            <Label for=""> Number of Attempt
                                            </Label>
                                            <Input
                                                type="number"
                                                name="numberOfAttempt"
                                                id="numberOfAttempt"
                                                value={objValues.numberOfAttempt}
                                                onChange={handleInputChange}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.25rem",
                                                }}
                                                // disabled
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="form-group  col-md-4">
                                        <FormGroup>
                                            <Label>
                                                Has this partner ever denied you of food, shelter, freedom of
                                                movement,livehood?
                                            </Label>
                                            <select
                                                className="form-control"
                                                name="freedomDenial"
                                                id="freedomDenial"
                                                value={objValues.freedomDenial}
                                                onChange={handleInputChange}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.2rem",
                                                }}
                                            >
                                                <option value={""}></option>
                                                {consent.map((value) => (
                                                    <option key={value.id} value={value.id}>
                                                        {value.display}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormGroup>
                                    </div>

                                    <div className="form-group  col-md-4">
                                        <FormGroup>
                                            <Label>
                                                Has this partner ever threatened to hurt you? *
                                            </Label>
                                            <select
                                                className="form-control"
                                                name="threatenToHurt"
                                                id="threatenToHurt"
                                                value={objValues.threatenToHurt}
                                                onChange={handleInputChange}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.2rem",
                                                }}
                                            >
                                                <option value={""}></option>
                                                {consent.map((value) => (
                                                    <option key={value.id} value={value.id}>
                                                        {value.display}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormGroup>
                                    </div>

                                    <div className="form-group  col-md-4">
                                        <FormGroup>
                                            <Label>
                                                Has this partner ever threatened to rape and force to have sex with you
                                                ? *
                                            </Label>
                                            <select
                                                className="form-control"
                                                name="sexuallyUncomfortable"
                                                id="sexuallyUncomfortable"
                                                value={objValues.sexuallyUncomfortable}
                                                onChange={handleInputChange}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.2rem",
                                                }}
                                            >
                                                <option value={""}></option>
                                                {consent.map((value) => (
                                                    <option key={value.id} value={value.id}>
                                                        {value.display}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormGroup>
                                    </div>
                                    <div className="form-group col-md-4 ">
                                        <Label>Known HIV Positive ?</Label>
                                        <FormGroup>
                                            <select
                                                className="form-control"
                                                name="partnerKnownHivPositive"
                                                id="partnerKnownHivPositive"
                                                onChange={handleInputChange}
                                                value={objValues.partnerKnownHivPositive}
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
                                    <div className="form-group  col-md-4">
                                        <FormGroup>
                                            <Label>
                                              Accepted HTS ? <span style={{color: "red"}}> </span>
                                            </Label>
                                            <select
                                                className="form-control"
                                                name="acceptedHts"
                                                id="acceptedHts"
                                                value={objValues.acceptedHts}
                                                onChange={handleInputChange}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.2rem",
                                                }}
                                            >
                                                <option value={""}></option>
                                                {consent.map((value) => (
                                                    <option key={value.id} value={value.id}>
                                                        {value.display}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormGroup>
                                    </div>

                                    <div className="form-group  col-md-4">
                                        <FormGroup>
                                            <Label>
                                                HIV Test Result{" "}
                                                <span style={{color: "red"}}> *</span>
                                            </Label>
                                            <select
                                                className="form-control"
                                                name="partnerCurrentHivStatus "
                                                id="partnerCurrentHivStatus "
                                                value={objValues.partnerCurrentHivStatus}
                                                onChange={handleInputChange}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.2rem",
                                                }}
                                            >
                                                <option value={""}></option>
                                                <option value="negative">Negative</option>
                                                <option value="positive">Positive</option>
                                            </select>
                                        </FormGroup>
                                    </div>

                                    {objValues.partnerCurrentHivStatus !== "" &&
                                        objValues.partnerCurrentHivStatus === "positive" && (
                                            <div className="form-group mb-3 col-md-4">
                                                <FormGroup>
                                                    <Label for="">
                                                        Date Tested?{" "}
                                                        <span style={{color: "red"}}> *</span>
                                                    </Label>
                                                    <Input
                                                        type="date"
                                                        name="datePartnerTested"
                                                        id="datePartnerTested"
                                                        value={objValues.datePartnerTested}
                                                        onChange={handleInputChange}
                                                        max={moment(new Date()).format("YYYY-MM-DD")}
                                                        style={{
                                                            border: "1px solid #014D88",
                                                            borderRadius: "0.25rem",
                                                        }}
                                                    />
                                                </FormGroup>
                                            </div>
                                        )}
                                    <div className="form-group mb-3 col-md-4">
                                        <FormGroup>
                                            <Label for="">
                                                Date Enrolled On ART
                                            </Label>
                                            <Input
                                                type="date"
                                                name="datePartnerEnrolledOnArt"
                                                id="datePartnerEnrolledOnArt"
                                                value={objValues.datePartnerEnrolledOnArt}
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

                                </>
                            )}

                            {saving ? <Spinner/> : ""}
                            <br/>
                            <div className="row">
                                <div className="form-group mb-3 col-md-6">
                                    <Button
                                        content="Save"
                                        icon="save"
                                        labelPosition="left"
                                        style={{backgroundColor: "#014d88", color: "#fff"}}
                                        onClick={handleSubmit}
                                        disabled={saving}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </>
    );
};

export default PnsForm;
