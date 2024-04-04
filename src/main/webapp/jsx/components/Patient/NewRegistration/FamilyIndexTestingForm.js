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
    const [maritalStatus, setMaritalStatus] = useState([]);
    const [hospitalNumStatus, setHospitalNumStatus] = useState(false);
    const [countries, setCountries] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [isClientCurrentlyOnHiv, setClientCurrentlyOnHiv] = useState(true)
    const [states, setStates] = useState([]);
    const [genders, setGenders] = useState([]);
    const [hivStatus, setHivStatus] = useState([]);
    const [indexClientConfirmedHivPositive, setIndexClientConfirmedHivPositive] = useState(false)
    const [familyRelationship,  setFamilyRelationship] = useState([]);
    const [selectedFamilyIndex, setSelectedFamilyIndex] = useState({})
    const [familyIndexHivStatus, setFamilyIndexHivStatus] = useState([]);
    const [familyIndex, setFamilyIndex] = useState([]);
    const [followUpAppointmentLocation, setFollowUpAppointmentLocation] = useState([]);
    const [indexVisitAttempt, setIndexVisitAttempt] = useState([]);
  const [isWillingToHaveChildrenTested, setIsWillingToHaveChildrenTested] = useState(false)

    const [facilityName, setFacilityName] = useState(Cookies.get("facilityName"));


    const [payload, setPayload] = useState({
        referralDate: "",
        name: "",
        middleName: "",
        lastName: "",
        hospitalNumber: "",
        countryId: "1",
        stateId: "",
        testingSetting: "",
        familyIndexClient: "",
        indexClientId: "",
        maritalStatus: "",
        alternativeContactNumber: "",
        dateIndexClientConfirmedHiv: "",
        reasonForIndexClientDateHivConfirmedNotSelected: "",
        isClientCurrentlyOnHiv: "",
        // facilityName: Cookies.get("facilityName"),
        facilityName:"",
        address: "",
        phoneNumber: "",
        sexId: "",
        dob: "",
        age: "",
        dateOfBirth: "",
        virallyUnsuppressed: "",
        treatmentDateInitiation: "",
        recencyTesting:"",
        attempt:"",
        familyRelationship:"",
        familyIndexHivStatus:"",
        motherDead:"",
        yearMotherDied:"",
        uan:"",
        childNumber:"",
        willingToHaveChildrenTested:"",
        familyIndexTracker:{
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
            attempt:"",
        }
    });

    const [lgas, setLGAs] = useState([])
    const [facilities, setFacilities1] = useState([])
    const [selectedState, setSelectedState] = useState({})
    const [selectedFacility, setSelectedFacility] = useState({});
    const [selectedLga, setSelectedLga] = useState({});

    const loadStates = () => {
        axios.get(`${baseUrl}organisation-units/parent-organisation-units/1`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.data) {
                    setStates(response.data);
                }
            })
            .catch((e) => {
                // console.log("Fetch states error" + e);
            });
    };

    const loadLGA = (id) => {
        axios.get(`${baseUrl}organisation-units/parent-organisation-units/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.data) {
                    setLGAs(response.data);
                    // const selectedLga = response.data.find(lga => lga.id === id);
                    // setPayload(prevPayload => ({ ...prevPayload, lgaTransferTo: selectedLga ? selectedLga.name : "" }));
                }
            })
            .catch((e) => {
                // console.log("Fetch LGA error" + e);
            });
    };

    const loadFacilities = (id) => {
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

    const getMaritalStatus = () => {
        axios
            .get(`${baseUrl}application-codesets/v2/MARITAL_STATUS`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setMaritalStatus(response.data);
            })
            .catch((error) => {
            });
    };


    const getFamilyRelationship = () => {
        axios
            .get(`${baseUrl}application-codesets/v2/FAMILY_RELATIONSHIP`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setFamilyRelationship(response.data);
            })
            .catch((error) => {
            });
    };

// get family index hiv status
    const  FAMILY_INDEX_HIV_STATUS = () => {
        axios
            .get(`${baseUrl}application-codesets/v2/FAMILY_INDEX_HIV_STATUS`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                console.log("fam*ily Index hiv status",response.data);
                setFamilyIndexHivStatus(response.data);
            })
            .catch((error) => {
            });
    };

    // get family index

    const  FAMILY_INDEX = () => {
        axios
            .get(`${baseUrl}application-codesets/v2/FAMILY_INDEX`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                console.log("fam*ily Index hiv status",response.data);
                setFamilyIndex(response.data);
            })
            .catch((error) => {
            });
    };


    const  FOLLOW_UP_APPOINTMENT_LOCATION = () => {
        axios
            .get(`${baseUrl}application-codesets/v2/FOLLOW UP_APPOINTMENT_LOCATION`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setFollowUpAppointmentLocation(response.data);
            })
            .catch((error) => {
            });
    };

    // GET
    const  INDEX_VISIT_ATTEMPTS = () => {
        axios
            .get(`${baseUrl}application-codesets/v2/INDEX_VISIT_ATTEMPTS`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setIndexVisitAttempt(response.data);
            })
            .catch((error) => {
            });
    };

     // generate index client Id using the HTS client code/family index client unique ART number
    const generateIndexClientId = () => {
       const indexClientId = Math.floor(1000 + Math.random() * 9000);
    }

    // show reason for not selecting hiv confirm date, if the hiv confirm date is not selected and hide it when it is selected
 // const showReasonForNotSelectingHivConfirmDate = () => {
 //        if(payload.dateIndexClientConfirmedHiv === ""){
 //            setIndexClientConfirmedHivPositive(true);
 //        }else{
 //            setIndexClientConfirmedHivPositive(false);
 //        }
 // }

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
        loadStates();
        loadFamilyIndexSetting();
        getCountry();
        getStateByCountryId();
        getMaritalStatus();
        getFamilyRelationship();
        FAMILY_INDEX_HIV_STATUS();
        FAMILY_INDEX();
        FOLLOW_UP_APPOINTMENT_LOCATION();
        INDEX_VISIT_ATTEMPTS();
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
            childNumber: value === "FAMILY_RELATIONSHIP_BIOLOGICAL_CHILD" ? "" : prevPayload.childNumber,
            // Reset familyIndexHivStatus when family relationship changes, where mother = '1293', father = '1294', biological child = '1295', siblings = '1296'
            familyIndexHivStatus: ["FAMILY_RELATIONSHIP_BIOLOGICAL_CHILD", "FAMILY_RELATIONSHIP_FATHER", "FAMILY_RELATIONSHIP_MOTHER", "FAMILY_RELATIONSHIP_SIBLINGS"].includes(value) ? "" : prevPayload.familyIndexHivStatus,
            // Reset uan when family relationship changes
            uan: (value ==="FAMILY_RELATIONSHIP_BIOLOGICAL_CHILD" || value === "FAMILY_RELATIONSHIP_FATHER" || value === "FAMILY_RELATIONSHIP_MOTHER" || value === "FAMILY_RELATIONSHIP_SIBLINGS") ? "" : prevPayload.uan,
            // Reset motherDead when family relationship changes
            motherDead: (value === "FAMILY_RELATIONSHIP_MOTHER" || value === "FAMILY_RELATIONSHIP_FATHER" || value === "FAMILY_RELATIONSHIP_BIOLOGICAL_CHILD") ? "" : prevPayload.motherDead,
            // Reset yearMotherDied when family relationship changes
            yearMotherDied: (value === "FAMILY_RELATIONSHIP_MOTHER" || value === "FAMILY_RELATIONSHIP_FATHER" || value === "FAMILY_RELATIONSHIP_BIOLOGICAL_CHILD") ? "" : prevPayload.yearMotherDied,
        }));
    };


    //Get list of HIV STATUS ENROLLMENT
    console.log("payload ", payload);

    const handleOtherInputChange = (e) => {
        const { name, value } = e.target;

        if(name === "knownHivPositive" &&  payload.familyIndexTracker.knownHivPositive !== "YES"){
            setPayload(prevState => ({
                ...prevState,
                familyIndexTracker: {
                    ...prevState.familyIndexTracker,
                    dateTested: "",
                    hivTestResult: ""
                }
            }))
        }

        setPayload(prevPayload => ({
            ...prevPayload,
            familyIndexTracker: {
                ...prevPayload.familyIndexTracker,
                [name]: value
            }
        }));


    }


    const handleInputChange = (e) => {
        setErrors({ ...temp, [e.target.name]: "" });
        const { name, value } = e.target;

        if (e.target.name === "name" || e.target.name === "lastName") {
            const name = alphabetOnly(e.target.value);
            setPayload(prevState => ({
                ...prevState,
                [e.target.name]: name
            }));
        }
        else if (name === "willingToHaveChildrenTested") {
            setPayload(prevState => ({
                ...prevState,
                [name]: value,
                familyIndexTracker: {
                    ...prevState.familyIndexTracker,
                    positionOfChildEnumerated: value === "Yes" ? prevState.familyIndexTracker.positionOfChildEnumerated : "",
                    trackerSex: value === "Yes" ? prevState.familyIndexTracker.trackerSex : "",
                    trackerAge: value === "Yes" ? prevState.familyIndexTracker.trackerAge : "",
                    scheduleVisitDate: value === "Yes" ? prevState.familyIndexTracker.scheduleVisitDate : "",
                    followUpAppointmentLocation: value === "Yes" ? prevState.familyIndexTracker.followUpAppointmentLocation : "",
                    dateVisit: value === "Yes" ? prevState.familyIndexTracker.dateVisit : "",
                    knownHivPositive: value === "Yes" ? prevState.familyIndexTracker.knownHivPositive : "",
                    dateTested: value === "Yes" ? prevState.familyIndexTracker.dateTested : "",
                    hivTestResult: value === "Yes" ? prevState.familyIndexTracker.hivTestResult : "",
                    dateEnrolledInOVC: value === "Yes" ? prevState.familyIndexTracker.dateEnrolledInOVC : "",
                    dateEnrolledOnArt: value === "Yes" ? prevState.familyIndexTracker.dateEnrolledOnArt : "",
                    attempt: value === "Yes" ? prevState.familyIndexTracker.attempt : "",

                }
            }));
        }
        else if (e.target.name === "middleName" && e.target.value !== "") {
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
        temp.referralDate = payload.referralDate ? "" : "This field is required.";
        temp.name = payload.name ? "" : "This field is required.";
        temp.dateIndexClientConfrimedHiv = payload.dateIndexClientConfrimedHiv ? "": "This is field is required" ;
        temp.stateId = payload.stateId ? "" : "This field is required.";
        temp.lgaId = payload.lgaId ? "" : "This field is required.";
        temp.address = payload.address ? "" : "This field is required.";
        temp.phoneNumber = payload.phoneNumber ? "" : "This field is required.";
        temp.sexId = payload.sexId ? "" : "This field is required.";
        temp.dob = payload.dob ? "" : "This field is required.";
        temp.age = payload.age ? "" : "This field is required.";
        temp.familyIndexClient = payload.familyIndexClient ? "" : "This field is required.";
        temp.hivStatus = payload.hivStatus ? "" : "This field is required.";
        temp.facilityName = payload.facilityName
            ? ""
            : "This field is required.";
        if(payload.dateIndexClientConfirmedHiv === ""){
            temp.reasonForIndexClientDateHivConfirmedNotSelected = payload.reasonForIndexClientDateHivConfirmedNotSelected ? "" : "This field is required.";
        }
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

                                <div className="form-group mb-3 col-md-4">
                                    <FormGroup>
                                        <Label for="" style={{color: '#014d88', fontWeight: 'bolder'}}>State <span
                                            style={{color: "red"}}> *</span> </Label>
                                        <Input
                                            type="select"
                                            name="stateId"
                                            style={{
                                                height: "40px",
                                                border: 'solid 1px #014d88',
                                                borderRadius: '5px',
                                                fontWeight: 'bolder',
                                                appearance: 'auto'
                                            }}
                                            required
                                            // onChange={loadLGA1}
                                            onChange={(e) => {
                                                if (e.target.value !== "") {
                                                    const filterState = states.filter(st => {
                                                            return Number(st.id) === Number(e.target.value)
                                                        }
                                                    )
                                                    setSelectedState(filterState)

                                                    setPayload(prevPayload => ({
                                                        ...prevPayload,
                                                        stateId: filterState[0].id
                                                    }));
                                                }
                                                loadLGA(e.target.value);
                                            }}

                                        >
                                            <option>Select State</option>
                                            {states.map((state) => (
                                                <option key={state.id} value={state.id}>
                                                    {state.name}
                                                </option>
                                            ))}
                                        </Input>
                                        {errors.stateTransferTo !== "" ? (
                                            <span className={classes.error}>
                                                {errors.stateTransferTo}
                                            </span>
                                        ) : (
                                            ""
                                        )}
                                    </FormGroup>
                                </div>
                                <div className="form-group mb-3 col-md-4">
                                    <FormGroup>
                                        <Label for="" style={{color: '#014d88', fontWeight: 'bolder'}}>LGA <span
                                            style={{color: "red"}}> *</span></Label>
                                        <Input
                                            type="select"
                                            name="lgaId"
                                            style={{
                                                height: "40px",
                                                border: 'solid 1px #014d88',
                                                borderRadius: '5px',
                                                fontWeight: 'bolder',
                                                appearance: 'auto'
                                            }}
                                            required
                                            // onChange={loadFacilities1}
                                            onChange={(e) => {
                                                if (e.target.value !== "") {
                                                    const filterlga = lgas.filter(lg => {
                                                            return Number(lg.id) === Number(e.target.value)
                                                        }
                                                    )
                                                    setSelectedLga(filterlga)
                                                    setPayload(prevPayload => ({
                                                        ...prevPayload,
                                                        lgaId: filterlga[0].id
                                                    }));
                                                }
                                                loadFacilities(e.target.value);

                                            }}

                                        >
                                            <option>Select LGA</option>
                                            {lgas.map((lga) => (
                                                <option key={lga.id} value={lga.id}>
                                                    {lga.name}
                                                </option>
                                            ))}
                                        </Input>
                                        {errors.lgaId !== "" ? (
                                            <span className={classes.error}>
                                                {errors.lgaId}
                                            </span>
                                        ) : (
                                            ""
                                        )}
                                    </FormGroup>
                                </div>
                                <div className="form-group mb-3 col-md-4">
                                    <FormGroup>
                                        <Label for="" style={{color: '#014d88', fontWeight: 'bolder'}}>Facility Name
                                            <span style={{color: "red"}}> *</span> </Label>
                                        <Input
                                            type="select"
                                            name="facilityName"
                                            style={{
                                                height: "40px",
                                                border: 'solid 1px #014d88',
                                                borderRadius: '5px',
                                                fontWeight: 'bolder',
                                                appearance: 'auto'
                                            }}
                                            required
                                            onChange={(e) => {
                                                // setPayload(prevPayload => ({ ...prevPayload, facilityTransferTo: e.target.value }));
                                                if (e.target.value !== "") {
                                                    const filterFacility = facilities.filter(fa => {
                                                            return Number(fa.id) === Number(e.target.value)
                                                        }
                                                    )
                                                    setSelectedFacility(filterFacility)
                                                    setPayload(prevPayload => ({
                                                        ...prevPayload,
                                                        facilityName: filterFacility[0].name
                                                    }));
                                                }
                                            }}
                                        >
                                            <option>Select Facility</option>
                                            {facilities.map((facility) => (
                                                <option key={facility.id} value={facility.id}>
                                                    {facility.name}
                                                </option>
                                            ))}
                                        </Input>
                                        {errors.facilityTransferTo !== "" ? (
                                            <span className={classes.error}>
                                                {errors.facilityTransferTo}
                                            </span>
                                        ) : (
                                            ""
                                        )}
                                    </FormGroup>
                                </div>

                                <div className="form-group mb-3 col-md-4">
                                    <FormGroup>
                                        <Label for="">
                                            Date <span style={{color: "red"}}> *</span>{" "}
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
                                            Setting <span style={{color: "red"}}> *</span>
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
                                            Family Index client <span style={{color: "red"}}> *</span>
                                        </Label>
                                        <select
                                            className="form-control"
                                            name="familyIndexClient"
                                            id="familIndxClient"
                                            onChange={handleInputChange}
                                            value={payload.familyIndexClient}
                                            style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                            }}
                                            // disabled
                                        >
                                            <option value={""}>Select</option>
                                            {familyIndex &&
                                                familyIndex.map((x, index) => (
                                                    <option key={x.id} value={x.id}>
                                                        {x.display}
                                                    </option>
                                                ))}
                                        </select>
                                        {errors.familyIndexClient !== "" ? (
                                            <span className={classes.error}>{errors.sexId}</span>
                                        ) : (
                                            ""
                                        )}
                                    </FormGroup>
                                </div>
                                <div className="form-group mb-3 col-md-4">
                                    <FormGroup>
                                        <Label for="firstName">
                                            Name <span style={{color: "red"}}> *</span>
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
                                            <span style={{color: "red"}}> *</span>
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
                                            disabled
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
                                            Date Of Birth<span style={{color: "red"}}> *</span>
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
                                            Age <span style={{color: "red"}}> *</span>
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
                                            Marital Status <span style={{color: "red"}}> </span>
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
                                            {maritalStatus.map((value) => (
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
                                            Phone Number <span style={{color: "red"}}> *</span>
                                        </Label>
                                        <PhoneInput
                                            // disabled={true}
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
                                            Alternative Contact Number
                                        </Label>
                                        <PhoneInput
                                            // disabled={true}
                                            containerStyle={{
                                                width: "100%",
                                                border: "1px solid #014D88",
                                            }}
                                            inputStyle={{width: "100%", borderRadius: "0px"}}
                                            country={"ng"}
                                            placeholder="(234)7099999999"
                                            maxLength={5}
                                            name="alternativeContactNumber"
                                            id="alternativeContactNumber"
                                            masks={{ng: "...-...-....", at: "(....) ...-...."}}
                                            value={payload.alternativeContactNumber}
                                            onChange={(e) => {
                                                checkPhoneNumberBasic(e, "alternativeContactNumber");
                                            }}
                                            //onChange={(e)=>{handleInputChangeBasic(e,'phoneNumber')}}
                                        />

                                        {/*{errors.phoneNumber !== "" ? (*/}
                                        {/*    <span className={classes.error}>*/}
                                        {/*        {errors.phoneNumber}*/}
                                        {/*    </span>*/}
                                        {/*) : (*/}
                                        {/*    ""*/}
                                        {/*)}*/}
                                    </FormGroup>
                                </div>


                                <div className="form-group  col-md-4">
                                    <FormGroup>
                                        <Label>
                                            Descriptiven Residential Address <span style={{color: "red"}}> *</span>
                                        </Label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="address"
                                            id="address"
                                            value={payload.address}
                                            // disabled
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
                                            Date Of Index Client's confrimed HIV-positive test results <span
                                            style={{color: "red"}}> *</span>{" "}
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
                                {indexClientConfirmedHivPositive
                                    && <div className="form-group col-md-4">
                                        <Label> Reason for not selecting Index client Hiv confirmed test result Date
                                            ? </Label>
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
                                                <option value="Result not confirmed yet">Result not confirmed yet
                                                </option>
                                                <option value="NA">NA</option>
                                            </select>
                                            {errors.reasonForIndexClientDateHivConfirmedNotSelected !== "" ? (
                                                <span className={classes.error}>
                                                {errors.reasonForIndexClientDateHivConfirmedNotSelected}
                                            </span>
                                            ) : (
                                                ""
                                            )}
                                        </FormGroup>
                                    </div>
                                }
                                {/* )} */}
                                {/* if index client is hiv positive, and date is selected */}
                                <div className="form-group col-md-4 ">
                                    <Label>Is client current on HIV treatment ?</Label>
                                    <FormGroup>
                                        <select
                                            className="form-control"
                                            name="isClientCurrentlyOnHiv"
                                            id="isClientCurrentlyOnHiv"
                                            onChange={handleInputChange}
                                            value={payload.isClientCurrentlyOnHiv}
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

                                {payload.isClientCurrentlyOnHiv && payload.isClientCurrentlyOnHiv === "Yes" && (
                                    <div className="form-group mb-3 col-md-4">
                                        <FormGroup>
                                            <Label for="">
                                                Date of Treatment Initiation <span style={{color: "red"}}> *</span>{" "}
                                            </Label>
                                            <Input
                                                type="date"
                                                name="treatmentDateInitiation"
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
                                            {errors.treatmentDate !== "" ? (
                                                <span className={classes.error}>
                                            {errors.referralDate}
                                          </span>
                                            ) : (
                                                ""
                                            )}
                                        </FormGroup>
                                    </div>
                                )}
                                <div className="form-group col-md-4 ">
                                    <Label> Recency Testing <span> (for newly tested HIV-positive only) </span> </Label>
                                    <FormGroup>
                                        <select
                                            className="form-control"
                                            name="recencyTesting"
                                            id="reccencyTesting"
                                            onChange={handleInputChange}
                                            value={payload.recencyTesting}
                                            style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                            }}
                                        >
                                            <option value="">Select</option>
                                            <option value="Recent Infection">Recent Infection</option>
                                            <option value="Long Term Infection"> Long Term Infection</option>
                                            <option value="Not Done">Not Done</option>
                                        </select>

                                    </FormGroup>
                                </div>
                                <div className="form-group col-md-4 ">
                                    <Label>virally unsuppressed</Label>
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

                            <br/>

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
                                        {familyRelationship.map((value, index) => (
                                                <option key={index} value={value.code}>
                                                    {value.display}
                                                </option>
                                            )
                                        )}
                                    </select>
                                    {errors.familyRelationship &&
                                        <span className={classes.error}>{errors.familyRelationship}</span>}
                                </FormGroup>
                            </div>
                            {payload.familyRelationship === "FAMILY_RELATIONSHIP_BIOLOGICAL_CHILD" && (
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
                                        {errors.childNumber &&
                                            <span className={classes.error}>{errors.childNumber}</span>}
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
                                        {familyIndexHivStatus.map((value, index) => (
                                                <option key={index} value={value.code}>
                                                    {index}
                                                </option>
                                            )
                                        )}
                                    </select>
                                    {errors.familyIndexHivStatus &&
                                        <span className={classes.error}>{errors.familyIndexHivStatus}</span>}
                                </FormGroup>
                            </div>
                            {payload.familyIndexHivStatus && payload.familyIndexHivStatus === "FAMILY_INDEX_HIV_STATUS_CURRENT_ON_ART" &&
                                (["FAMILY_RELATIONSHIP_BIOLOGICAL_CHILD", "FAMILY_RELATIONSHIP_FATHER", "FAMILY_RELATIONSHIP_MOTHER", "FAMILY_RELATIONSHIP_SIBLINGS"].includes(payload.familyRelationship)) && (
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
                                                disabled={payload.familyIndexHivStatus !== "FAMILY_INDEX_HIV_STATUS_CURRENT_ON_ART"}

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
                                            type="date"
                                            min="1929-12-31"
                                            max={moment(new Date()).format("YYYY-MM-DD")}
                                            name="yearMotherDied"
                                            value={payload.yearMotherDied}
                                            onChange={handleInputChange}
                                        />
                                        {errors.yearMotherDied &&
                                            <span className={classes.error}>{errors.yearMotherDied}</span>}
                                    </FormGroup>
                                </div>
                            )}
                            <div className="form-group col-md-4">
                                <FormGroup>
                                    <Label for="willingToHaveChildrenTested">Are you willing to have your children
                                        tested elsewhere by a health care worker?</Label>
                                    <select
                                        className="form-control"
                                        id="willingToHaveChildrenTested"
                                        name="willingToHaveChildrenTested"
                                        onChange={handleInputChange}
                                        value={payload.willingToHaveChildrenTested}
                                        >
                                        <option value="">Select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>

                                </FormGroup>
                            </div>
                        </div>
                        {payload.willingToHaveChildrenTested === "Yes" && (
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
                                                value={payload.familyIndexTracker.positionOfChildEnumerated}
                                                onChange={handleOtherInputChange}

                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="form-group col-md-4">
                                        <FormGroup>
                                            <Label for="sexTrackeer">Sex </Label>
                                            <select
                                                className="form-control"
                                                id="trackerSex"
                                                name="trackerSex"
                                                onChange={handleOtherInputChange}
                                                value={payload.familyIndexTracker.trackerSex}
                                            >
                                                <option value="">Select</option>
                                                {genders.map((value, index) => (
                                                        <option key={index} value={value.code}>
                                                            {value.display}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </FormGroup>
                                    </div>
                                    <div className="form-group col-md-4">
                                        <FormGroup>
                                            <Label for="sex">Age</Label>
                                            <input
                                                className="form-control"
                                                id="trackerAge"
                                                type="number"
                                                name="trackerAge"
                                                value={payload.familyIndexTracker.trackerAge}
                                                onChange={handleOtherInputChange}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.2rem",
                                                }}

                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="form-group col-md-4">
                                        <FormGroup>
                                            <Label for="followUpAppointmentLocation">Follow Up Appointment
                                                Location</Label>
                                            <select
                                                className="form-control"
                                                id="followUpAppointmentLocation"
                                                name="followUpAppointmentLocation"
                                                onChange={handleOtherInputChange}
                                                value={payload.familyIndexTracker.followUpAppointmentLocation}
                                            >
                                                <option value="">Select</option>
                                                {followUpAppointmentLocation.map((value, index) => (
                                                        <option key={index} value={value.code}>
                                                            {value.display}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </FormGroup>
                                    </div>
                                    <div className="form-group mb-3 col-md-4">
                                        <FormGroup>
                                            <Label for="">
                                                Schedule Visit Date <span style={{color: "red"}}> *</span>{" "}
                                            </Label>
                                            <Input
                                                type="date"
                                                name="scheduleVisitDate"
                                                id="scheduleVisitDate"
                                                value={payload.familyIndexTracker.scheduleVisitDate}
                                                onChange={handleOtherInputChange}
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
                                                Date visited <span style={{color: "red"}}> *</span>{" "}
                                            </Label>
                                            <Input
                                                type="date"
                                                name="dateVisit"
                                                id="dateVisit"
                                                value={payload.familyIndexTracker.dateVisit}
                                                onChange={handleOtherInputChange}
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
                                                Attempts <span style={{color: "red"}}> *</span>{" "}
                                            </Label>
                                            <select
                                                className="form-control"
                                                name="attempt"
                                                id="attempt"
                                                onChange={handleOtherInputChange}
                                                value={payload.familyIndexTracker.attempt}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.2rem",
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {indexVisitAttempt.map((value, index) => (
                                                        <option key={index} value={value.code}>
                                                            {value.display}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </FormGroup>
                                    </div>
                                    <div className="form-group col-md-4 ">
                                        <Label>Known HIV Positive ?</Label>
                                        <FormGroup>
                                            <select
                                                className="form-control"
                                                name="knownHivPositive"
                                                id="knownHivPositive"
                                                onChange={handleOtherInputChange}
                                                value={payload.familyIndexTracker.knownHivPositive}
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
                                    {payload.familyIndexTracker.knownHivPositive && payload.familyIndexTracker.knownHivPositive === "Yes" &&
                                        <div className="form-group mb-3 col-md-4">
                                            <FormGroup>
                                                <Label for="">
                                                    Date Tested
                                                </Label>
                                                <Input
                                                    type="date"
                                                    name="dateTested"
                                                    id="dateTested"
                                                    value={payload.familyIndexTracker.dateTested}
                                                    onChange={handleOtherInputChange}
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
                                        </div>}
                                    {payload.familyIndexTracker.knownHivPositive && payload.familyIndexTracker.knownHivPositive === "Yes" &&
                                        <div className="form-group col-md-4 ">
                                            <Label>HIV Test Result </Label>
                                            <FormGroup>
                                                <select
                                                    className="form-control"
                                                    name="hivTestResult"
                                                    id="hivTestResult"
                                                    onChange={handleOtherInputChange}
                                                    value={payload.familyIndexTracker.hivTestResult}
                                                    style={{
                                                        border: "1px solid #014D88",
                                                        borderRadius: "0.2rem",
                                                    }}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Tested Positive">Tested Positive</option>
                                                    <option value="Teste Negative">Tested Negative</option>
                                                </select>

                                            </FormGroup>
                                        </div>}
                                    <div className="form-group mb-3 col-md-4">
                                        <FormGroup>
                                            <Label for="">
                                                Date Enrolled In Ovc
                                            </Label>
                                            <Input
                                                type="date"
                                                name="dateEnrolledInOVC"
                                                id="dateEnrolledInOVC"
                                                value={payload.familyIndexTracker.dateEnrolledInOVC}
                                                onChange={handleOtherInputChange}
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
                                                value={payload.familyIndexTracker.dateEnrolledOnArt}
                                                onChange={handleOtherInputChange}
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

                        <br/>
                        <div className="row">
                            <div className="form-group mb-3 col-md-6">
                                <Button
                                    content="Save"
                                    type="submit"
                                    icon="right arrow"
                                    labelPosition="right"
                                    style={{backgroundColor: "#014d88", color: "#fff"}}
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
                        style={{backgroundColor: "#014d88", color: "#fff"}}
                    >
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default FamilyIndexTestingForm;
