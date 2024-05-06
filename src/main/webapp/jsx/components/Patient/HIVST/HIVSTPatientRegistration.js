import React, {useEffect, useState} from "react";
import {CardBody, FormGroup, Input, Label} from "reactstrap";
import * as moment from "moment/moment";
import {Card, CardContent} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Select from 'react-select';


import SaveIcon from "@material-ui/icons/Save";
// import AddIcon from "@material-ui/icons/Add";
// import CancelIcon from "@material-ui/icons/Cancel";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import {Link, useHistory, useLocation} from "react-router-dom";
// import {TiArrowBack} from 'react-icons/ti'
import {token, url as baseUrl} from "../../../../api";
import "react-phone-input-2/lib/style.css";
import {Button, Icon, Label as LabelSui, List} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {Modal, Table} from "react-bootstrap";
import axios from "axios";
import UserInformationCard from "./UserInformationCard";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import DualListBox from "react-dual-listbox";
import {calculate_age} from "../../utils";

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

const HIVSTPatientRegistration = (props) => {
    console.log(props.patientObj)
    const [saving, setSaving] = useState(false)
    const classes = useStyles();
    const history = useHistory();
    const [errors, setErrors] = useState({});
    const [serialNumber, setSerialNumber] = useState(null);
    const [createdCode, setCreatedCode] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [otherText, setOtherText] = useState('');
    const [isUserInformationAvailable, setIsUserInformationAvailable] = useState(false);
    const [kitUserInformation, setKitUserInformation] = useState([]);
    const [selectedServiceNeeded, setSelectServiceNeeded] = useState([]);
    const [serviceNeeded, setServiceNeeded] = useState([]);
    const [showFreeTextField, setShowFreeTextField] = useState(false);
    const [hasConductedHIVST, setHasConductedHIVST] = useState(false);
    const [maritalStatus, setMaritalStatus] = useState([]);
    const [sexs, setSexs] = useState([]);
    const [userInformationList, setUserInformationList] = useState([]);
    const [objValues, setObjValues] = useState({
        dateVisit: "",
        dateOfRegistration: "",
        serviceDeliveryPoint: "",
        userType: "",
        serialNumber: "",
        clientCode: "",
        previouslyTestedForHivInLast12Month: "",
        hivTestResult: "",
        consentToFollowUpViaCall: "",
        typeOfHIVSelfReceived: "",
        numberOfHivstKitsReceived: "",
        nameOfTestKit: "",
        lotNo: "",
        expiryDate: "",
        kitUser: null,
        otherKitUserCategory: "",
        userInformation: [],
        isUserInformationAvailable: "",
        hasConductedHIVST: "",
        otherTestKitUserDetails: []
    });

    const [userInformation, setUserInformation] = useState(
        {
            userDetails: {
                id: "",
                otherCategory: "",
                userClientCode: "",
                dateOfBirth: "",
                age: "",
                sex: "",
                maritalStatusId: "",
                typeOfHivst: "",
                userCategory: ""
            },
            postTestAssessment: {
                everUsedHivstKit: "",
                everUsedHivstKitForSelfOrOthers: "",
                otherHivstKitUserCategory: "",
                otherHivstKitUserCategoryText: "",
                resultOfHivstTest: "",
                accessConfirmatoryHts: "",
                referPreventionServices: "",
                referralInformation: {
                    referredForConfirmatoryHts: "",
                    dateReferredForConfirmatoryHts: "",
                    referredForPreventionServices: "",
                    dateReferredForPreventionServices: ""
                }
            }
        }
    );



    console.log("Selected Options", selectedUsers);
    const options = [
        {value: 'myself', label: 'For myself'},
        {value: 'spouse', label: 'Spouse'},
        {value: 'children', label: 'Children'},
        {value: 'sexualPartner', label: 'Sexual Partner'},
        {value: 'socialNetwork', label: 'Social network'},
        {value: 'others', label: 'Others (Please specify)'},
    ];

    const matches = useMediaQuery('(max-width:600px)');
    const style = {fontSize: matches ? '12px' : '16px',};


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

    console.log("selectedUsers", selectedUsers);
    console.log("showUserInfo", showUserInfo);
    useEffect(() => {
        SERVICE_NEEDED();
    }, []);


    const handlePostTestAssessmentChange = (e) => {
        const {name, value} = e.target;
        let newPostAssessment = {...objValues.postTestAssessment, [name]: value};
        let newObjectValues = {...objValues, [name]: value};
        // any change in everUsedHivstKit clear other fields in this object
        if (name === "everUsedHivstKit" && value === "No") {
            newPostAssessment = {
                ...newPostAssessment,
                everUsedHivstKitForSelfOrOthers: "",
                otherHivstKitUserCategory: "",
                otherHivstKitUserCategoryText: "",
                resultOfHivstTest: "",
                accessConfirmatoryHts: "",
                referPreventionServices: ""
            };
        }
        // any change in accessConfirmatoryHts clear referPreventionServices,  referralInformation

        setObjValues({
            ...objValues,
            postTestAssessment: newPostAssessment
        });
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        let newObjectValues = {...objValues};
        if (name in objValues) {
            newObjectValues[name] = value;
        } else if (name in objValues.postTestAssessment) {
            newObjectValues.postTestAssessment[name] = value;
        } else if (name in objValues.postTestAssessment.referralInformation) {
            newObjectValues.postTestAssessment.referralInformation[name] = value;
        }
        // Check if the name is "previouslyTestedForHivInLast12Month"
        if (name === "previouslyTestedForHivInLast12Month") {
            newObjectValues.hivTestResult = "";
        }
        // any chnage in the userTyp and the type is not primary user clear hasConductedHIVST set to No, clear postTestAssessment
        if (name === "userType" && value !== "Primary User" && value !== "") {
            newObjectValues.isUserInformationAvailable = "";
            newObjectValues.hasConductedHIVST = "";
            newObjectValues.postTestAssessment = {
                everUsedHivstKit: "",
                everUsedHivstKitForSelfOrOthers: "",
                otherHivstKitUserCategory: "",
                otherHivstKitUserCategoryText: "",
                resultOfHivstTest: "",
                accessConfirmatoryHts: "",
                referPreventionServices: "",
                referralInformation: {
                    referredForConfirmatoryHts: "",
                    dateReferredForConfirmatoryHts: "",
                    referredForPreventionServices: "",
                    dateReferredForPreventionServices: ""
                }
            };
           setSelectedUsers(["myself"]);
           newObjectValues.kitUser = selectedUsers
        }
        // Check if the name is "typeOfHIVSelfReceived"
        if (name === "typeOfHIVSelfReceived") {
            newObjectValues.nameOfIndividualHIVTestKitReceived = "";
            newObjectValues.nameOfTestKit = "";
            newObjectValues.lotNo = "";
            newObjectValues.expiryDate = "";
        }
        // Check if the name is "hasConductedHIVST" and objValues.hasConductedHIVST is "No"
        if (name === "hasConductedHIVST" && objValues.hasConductedHIVST === "No") {
            newObjectValues.postTestAssessment = {
                ...newObjectValues.postTestAssessment,
                everUsedHivstKitForSelfOrOthers: "",
                otherHivstKitUserCategory: "",
                otherHivstKitUserCategoryText: "",
                resultOfHivstTest: "",
                accessConfirmatoryHts: "",
                referPreventionServices: "",
                referralInformation: {
                    referredForConfirmatoryHts: "",
                    dateReferredForConfirmatoryHts: "",
                    referredForPreventionServices: "",
                    dateReferredForPreventionServices: ""
                }
            };
        }
        // any change in everUsedHivstKitForSelfOrOthers clear referralPrveventionServices,and  referralInformation
        if (name === "accessConfirmatoryHts") {
            newObjectValues.postTestAssessment = {
                ...newObjectValues.postTestAssessment,
                referPreventionServices: "",
                referralInformation: {
                    referredForConfirmatoryHts: "",
                    dateReferredForConfirmatoryHts: "",
                    referredForPreventionServices: "",
                    dateReferredForPreventionServices: ""
                }
            };
        }

        // any change in referredForConfirmatoryHts clear other field in this object
        if (name === "referPreventionServices") {
            newObjectValues.postTestAssessment.referralInformation = {
                ...newObjectValues.postTestAssessment.referralInformation,
                dateReferredForConfirmatoryHts: "",
                referredForPreventionServices: "",
                dateReferredForPreventionServices: "",
                referredForConfirmatoryHts: ""
            };
        }

        // any change in referredForPreventionServices clear dateReferredForPreventionServices
        if (name === "referredForPreventionServices") {
            newObjectValues.postTestAssessment.referralInformation = {
                ...newObjectValues.postTestAssessment.referralInformation,
                dateReferredForPreventionServices: ""
            };
        }


        setObjValues(newObjectValues);
    }

    const handleUserInformationInputChange = (e, section) => {
        let newUserInformation = {...userInformation};
        newUserInformation[section][e.target.name] = e.target.value;
        setUserInformation(newUserInformation);
    };

    // const handleUserInformationInputChange = (e, section) => {
    //     const { name, value } = e.target;
    //     setUserInformation(prevState => ({
    //         ...prevState,
    //         [section]: {
    //             ...prevState[section],
    //             referralInformation: {
    //                 ...prevState[section].referralInformation,
    //                 [name]: value
    //             }
    //         }
    //     }));
    // };
    const addUserInformation = () => {
        const newUserInformation = {
            userDetails: {
                id: "",
                otherCategory: userInformation.length > 0 && userInformation[0].userDetails ? userInformation[0].userDetails.otherCategory : "",
                userClientCode: userInformation.length > 0 && userInformation[0].userDetails ? userInformation[0].userDetails.userClientCode : "",
                dateOfBirth: userInformation.length > 0 && userInformation[0].userDetails ? userInformation[0].userDetails.dateOfBirth : "",
                age: userInformation.length > 0 && userInformation[0].userDetails ? userInformation[0].userDetails.age : "",
                sex: userInformation.length > 0 && userInformation[0].userDetails ? userInformation[0].userDetails.sex : "",
                maritalStatusId: userInformation.length > 0 && userInformation[0].userDetails ? userInformation[0].userDetails.maritalStatusId : "",
                typeOfHivst: userInformation.length > 0 && userInformation[0].userDetails ? userInformation[0].userDetails.typeOfHivst : "",
                userCategory: userInformation.length > 0 && userInformation[0].userDetails ? userInformation[0].userDetails.userCategory : ""
            },
            postTestAssessment: {
                everUsedHivstKit: userInformation.length > 0 ? userInformation[0].postTestAssessment.everUsedHivstKit : "",
                everUsedHivstKitForSelfOrOthers: userInformation.length > 0 ? userInformation[0].postTestAssessment.everUsedHivstKitForSelfOrOthers : "",
                otherHivstKitUserCategory: userInformation.length > 0 ? userInformation[0].postTestAssessment.otherHivstKitUserCategory : "",
                otherHivstKitUserCategoryText: userInformation.length > 0 ? userInformation[0].postTestAssessment.otherHivstKitUserCategoryText : "",
                resultOfHivstTest: userInformation.length > 0 ? userInformation[0].postTestAssessment.resultOfHivstTest : "",
                accessConfirmatoryHts: userInformation.length > 0 ? userInformation[0].postTestAssessment.accessConfirmatoryHts : "",
                referPreventionServices: userInformation.length > 0 ? userInformation[0].postTestAssessment.referPreventionServices : "",
                referralInformation: {
                    referredForConfirmatoryHts: userInformation.length > 0 ? userInformation[0].postTestAssessment.referralInformation.referredForConfirmatoryHts : "",
                    dateReferredForConfirmatoryHts: userInformation.length > 0 ? userInformation[0].postTestAssessment.referralInformation.dateReferredForConfirmatoryHts : "",
                    referredForPreventionServices: userInformation.length > 0 ? userInformation[0].postTestAssessment.referralInformation.referredForPreventionServices : "",
                    dateReferredForPreventionServices: userInformation.length > 0 ? userInformation[0].postTestAssessment.referralInformation.dateReferredForPreventionServices : null
                }
            }
        };
        // Add the new object to the userInformationList
        setUserInformationList([...userInformationList, newUserInformation]);

        // Set the userInformation field in objValues to the updated list
        setObjValues({...objValues, userInformation: [...userInformationList, newUserInformation]});

        // Reset the userInformation state to its initial state
        setUserInformation([{
            userDetails: {
                id: "",
                otherCategory: "",
                userClientCode: "",
                dateOfBirth: "",
                age: "",
                sex: "",
                maritalStatusId: "",
                typeOfHivst: "",
                userCategory: ""
            },
            postTestAssessment: {
                everUsedHivstKit: "",
                everUsedHivstKitForSelfOrOthers: "",
                otherHivstKitUserCategory: "",
                otherHivstKitUserCategoryText: "",
                resultOfHivstTest: "",
                accessConfirmatoryHts: "",
                referPreventionServices: "",
                referralInformation: {
                    referredForConfirmatoryHts: "",
                    dateReferredForConfirmatoryHts: "",
                    referredForPreventionServices: "",
                    dateReferredForPreventionServices: null
                }
            }
        }]);
    };
    // Function to remove a userInformation object from the list based on index
    const removeUserInformation = (index) => {
        // Remove the object at the specified index
        const updatedUserInformationList = userInformationList.filter((_, i) => i !== index);

        // Update the userInformationList state
        setUserInformationList(updatedUserInformationList);

        // Set the userInformation field in objValues to the updated list
        setObjValues({...objValues, userInformation: updatedUserInformationList});
    };

// Function to update a userInformation object in the list based on index
    const updateUserInformation = (index, updatedUserInformation) => {
        // Update the object at the specified index
        const updatedUserInformationList = userInformationList.map((userInformation, i) =>
            i === index ? updatedUserInformation : userInformation
        );
        // Update the userInformationList state
        setUserInformationList(updatedUserInformationList);
        // Set the userInformation field in objValues to the updated list
        setObjValues({...objValues, userInformation: updatedUserInformationList});
    };

    console.log("Obj", objValues)

    const handleKitSelectUserChange = selectedUsers => {
        if (objValues.userType === "Secondary User") {
            setSelectedUsers(["myself"]);
            let newValues = {...objValues, kitUser: selectedUsers};
            setObjValues(newValues);
        } else {
            setSelectedUsers(selectedUsers);
            let newValues = {...objValues, kitUser: selectedUsers};
            if (!selectedUsers || selectedUsers.length === 0) {
                setShowUserInfo(false);
                newValues = {...newValues, isUserInformationAvailable: ""};
            } else if (selectedUsers.length === 1 && selectedUsers[0] === 'myself') {
                setShowUserInfo(false);
                newValues = {...newValues, isUserInformationAvailable: ""};
            } else {
                setShowUserInfo(true);
            }
            if (!showUserInfo) {
                userInformation.userCategory = "";
                userInformation.otherCategory = "";
                userInformation.userClientCode = "";
                userInformation.dateOfBirth = "";
                userInformation.age = "";
                userInformation.sex = "";
                userInformation.maritalStatus = "";
                userInformation.userClientCode = "";
                userInformation.typeOfHivSelfTest = "";
            }
            setObjValues(newValues);
        }
    };
    const checkClientCode = (e) => {
        let code = "";
        if (e.target.name === "serialNumber") {
            code = createdCode + e.target.value;
            setCreatedCode(code);
            console.log("Code created is &&&& ", createdCode);
            setObjValues({...objValues, clientCode: code});
        }

        async function getIndexClientCode() {
            const indexClientCode = objValues.clientCode;
            console.log(indexClientCode);
            const response = await axios.get(
                `${baseUrl}hts/client/${indexClientCode}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "text/plain",
                    },
                }
            );
        }

        getIndexClientCode();
    };


    // const validateUserTestKitInformation = () => {
    //     let temp = {};
    //     temp.userCategory = userInformation.userDetails.userCategory ? "" : "This field is required.";
    //     temp.userClientCode = userInformation.userDetails.userClientCode ? "" : "This field is required.";
    //     temp.dateOfBirth = userDetails.dateOfBirth ? "" : "This field is required.";
    //     temp.age = userInformation.userDetails.age ? "" : "This field is required";
    //
    //     setErrors({...temp});
    //     return Object.values(temp).every((x) => x === "");
    //
    // }

    const Sex = () => {
        axios
            .get(`${baseUrl}application-codesets/v2/SEX`, {
                headers: {Authorization: `Bearer ${token}`},
            })
            .then((response) => {
                //console.log(response.data);
                setSexs(response.data);
            })
            .catch((error) => {
                //console.log(error);
            });
    };

    const MARITALSTATUS = () => {
        axios
            .get(`${baseUrl}application-codesets/v2/MARITAL_STATUS`, {
                headers: {Authorization: `Bearer ${token}`},
            })
            .then((response) => {
                //console.log(response.data);
                setMaritalStatus(response.data);
            })
            .catch((error) => {
                //console.log(error);
            });
    };

    useEffect(() => {
        Sex();
        MARITALSTATUS();
    }, []);


    // const handleDobChange1 = (e) => {
    //     let newUserInformation = [...userInformation];
    //     let newPayload = {...newUserInformation[newUserInformation.length - 1].userDetails, [e.target.name]: e.target.value};
    //     if (e.target.value && new Date(e.target.value) <= new Date()) {
    //         const age_now = calculate_age(e.target.value);
    //         newPayload = {...newPayload, age: age_now};
    //     } else {
    //         newPayload = {...newPayload, age: ""};
    //     }
    //     newUserInformation[newUserInformation.length - 1].userDetails = newPayload;
    //     setUserInformation(newUserInformation);
    // };

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("objValues", objValues)
    }
    console.log("userInformation", userInformation)

    return (
        <>
            <Card className={classes.root}>
                <CardBody>
                    <h2 style={{color: "#000"}}> HIV SELF - TEST AND RESPONSE CARD </h2>
                    <br/>
                    <form>
                        <div className="row mb-7">
                            <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                    <Label for="">
                                        Visit Date <span style={{color: "red"}}> *</span>
                                    </Label>
                                    <Input
                                        type="date"
                                        name="dateVisit"
                                        id="dateVisit"
                                        value={objValues.dateVisit}
                                        onChange={handleInputChange}
                                        min={objValues.dateOfRegistration}
                                        max={moment(new Date()).format("YYYY-MM-DD")}
                                        style={{
                                            border: "1px solid #014D88",
                                            borderRadius: "0.25rem",
                                        }}
                                    />
                                    {/*{errors.dateVisit !== "" ? (*/}
                                    {/*    <span className={classes.error}>{errors.dateVisit}</span>*/}
                                    {/*) : (*/}
                                    {/*    ""*/}
                                    {/*)}*/}
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label style={style}>
                                        Service Delivery Point
                                        <span style={{color: "red"}}> *</span>
                                    </Label>
                                    <select
                                        className="form-control"
                                        name="serviceDeliveryPoint"
                                        id="serviceDeliveryPoint"
                                        value={objValues.serviceDeliveryPoint}
                                        onChange={handleInputChange}
                                        style={{
                                            border: "1px solid #014D88",
                                            borderRadius: "0.2rem",
                                        }}
                                    >
                                        <option value={""}></option>
                                        <option value="Health Facility">Health Facility</option>
                                        <option value="Comunity Pharmacy">Community Pharmacy</option>
                                        <option value="PPMV">PPMV</option>
                                        <option value="Mobile Distribution">Mobile Distribution</option>
                                        <option value="Workplace">WorkPlace</option>
                                        <option value="Others">Others</option>
                                        <option value="Home based">Home based</option>
                                        <option value="Door to Door">Door to Door</option>
                                    </select>
                                    {/*{errors.indexClient !== "" ? (*/}
                                    {/*    <span className={classes.error}>{errors.indexClient}</span>*/}
                                    {/*) : (*/}
                                    {/*    ""*/}
                                    {/*)}*/}
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>
                                        user Type Primary
                                        <span style={{color: "red"}}> *</span>
                                    </Label>
                                    <select
                                        className="form-control"
                                        name="userType"
                                        id="userType"
                                        value={objValues.userType}
                                        onChange={handleInputChange}
                                        style={{
                                            border: "1px solid #014D88",
                                            borderRadius: "0.2rem",
                                        }}
                                    >
                                        <option value={""}></option>
                                        <option value="Primary User">Primary User (collector)</option>
                                        <option value="Secondary User">secondary user
                                        </option>
                                    </select>
                                    {errors.indexClient !== "" ? (
                                        <span className={classes.error}>{errors.indexClient}</span>
                                    ) : (
                                        ""
                                    )}
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                    <Label for="">
                                        Serial Number <span style={{color: "red"}}> *</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        name="serialNumber"
                                        id="serialNumber"
                                        value={serialNumber}
                                        //value={Math.floor(Math.random() * 1093328)}
                                        onBlur={checkClientCode}
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
                                    <Label for="">
                                        Client Code <span style={{color: "red"}}> *</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        name="clientCode"
                                        id="clientCode"
                                        value={objValues.clientCode}
                                        onChange={handleInputChange}
                                        style={{
                                            border: "1px solid #014D88",
                                            borderRadius: "0.25rem",
                                        }}
                                        //readOnly={props.activePage.actionType === "view"}
                                    />
                                    {/*{errors.clientCode !== "" ? (*/}
                                    {/*    <span className={classes.error}>{errors.clientCode}</span>*/}
                                    {/*) : (*/}
                                    {/*    ""*/}
                                    {/*)}*/}
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label style={style}>
                                        Have you previously tested for HIV in the last 12 months?
                                        <span style={{color: "red"}}> *</span>
                                    </Label>
                                    <select
                                        className="form-control"
                                        name="previouslyTestedForHivInLast12Month"
                                        id="previouslyTestedForHivInLast12Month"
                                        value={objValues.previouslyTestedForHivInLast12Month}
                                        onChange={handleInputChange}
                                        style={{
                                            border: "1px solid #014D88",
                                            borderRadius: "0.2rem",
                                        }}
                                    >
                                        <option value={""}></option>
                                        <option value="Yes">YES</option>
                                        <option value="No">NO</option>
                                    </select>
                                    {/*                {errors.firstTimeVisit !== "" ? (*/}
                                    {/*                    <span className={classes.error}>*/}
                                    {/*  {errors.firstTimeVisit}*/}
                                    {/*</span>*/}
                                    {/*                ) : (*/}
                                    {/*                    ""*/}
                                    {/*                )}*/}
                                </FormGroup>
                            </div>
                            {objValues?.previouslyTestedForHivInLast12Month === "Yes" ? (
                                <div className="form-group  col-md-4">
                                    <FormGroup>
                                        <Label style={style}>
                                            What was the test result?
                                            <span style={{color: "red"}}> *</span>
                                        </Label>
                                        <select
                                            className="form-control"
                                            name="hivTestResult"
                                            id="hivTestResult"
                                            value={objValues.hivTestResult}
                                            onChange={handleInputChange}
                                            style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                            }}
                                        >
                                            <option value={""}></option>
                                            <option value="Positive">Positive</option>
                                            <option value="Negative">Negative</option>
                                            <option value="Unknown">Unknown</option>
                                        </select>
                                    </FormGroup>
                                </div>
                            ) : ""}
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label style={style}>
                                        Do you consent to be followed-up via phone calls?
                                        <span style={{color: "red"}}> *</span>
                                    </Label>
                                    <select
                                        className="form-control"
                                        name="consentToFollowUpViaCall"
                                        id="consentToFollowUpViaCall"
                                        value={objValues.consentToFollowUpViaCall}
                                        onChange={handleInputChange}
                                        style={{
                                            border: "1px solid #014D88",
                                            borderRadius: "0.2rem",
                                        }}
                                    >
                                        <option value={""}></option>
                                        <option value="Yes">YES</option>
                                        <option value="No">NO</option>
                                    </select>
                                    {/*                {errors.firstTimeVisit !== "" ? (*/}
                                    {/*                    <span className={classes.error}>*/}
                                    {/*  {errors.firstTimeVisit}*/}
                                    {/*</span>*/}
                                    {/*                ) : (*/}
                                    {/*                    ""*/}
                                    {/*                )}*/}
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label style={style}>
                                        What type of HIVST kit did you receive/purchase today?
                                        <span style={{color: "red"}}> *</span>
                                    </Label>
                                    <select
                                        className="form-control"
                                        name="typeOfHIVSelfReceived"
                                        id="typeOfHIVSelfReceived"
                                        value={objValues.typeOfHIVSelfReceived}
                                        onChange={handleInputChange}
                                        style={{
                                            border: "1px solid #014D88",
                                            borderRadius: "0.2rem",
                                        }}
                                    >
                                        <option value={""}></option>
                                        <option value="Oral fluid">Oral fluid</option>
                                        <option value="Blood">Blood</option>
                                    </select>
                                    {/*                {errors.firstTimeVisit !== "" ? (*/}
                                    {/*                    <span className={classes.error}>*/}
                                    {/*  {errors.firstTimeVisit}*/}
                                    {/*</span>*/}
                                    {/*                ) : (*/}
                                    {/*                    ""*/}
                                    {/*                )}*/}
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                    <Label for="">
                                        Number of individual HIV self-test kits received? {" "}
                                        <span style={{color: "red"}}> *</span>
                                    </Label>
                                    <Input
                                        type="number"
                                        name="numberOfHivstKitsReceived"
                                        id="numberOfHivstKitsReceived"
                                        value={objValues.numberOfHivstKitsReceived}
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
                                    <Label for="providerNameCompletingForm">
                                        Name of Test Kit ?
                                        <span style={{color: "red"}}> *</span>
                                    </Label>
                                    <Input
                                        className="form-control"
                                        type="text"
                                        name="nameOfTestKit"
                                        id="nameOfTestKit"
                                        value={objValues.nameOfTestKit}
                                        onChange={handleInputChange}
                                        style={{
                                            border: "1px solid #014D88",
                                            borderRadius: "0.2rem",
                                        }}
                                    />
                                    {/*{errors.facilityId !== "" ? (*/}
                                    {/*    <span className={classes.error}>*/}
                                    {/*        {errors.facilityId}*/}
                                    {/*    </span>*/}
                                    {/*) : (*/}
                                    {/*    ""*/}
                                    {/*)}*/}
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                    <Label for="providerNameCompletingForm">
                                        Lot No
                                        <span style={{color: "red"}}> *</span>
                                    </Label>
                                    <Input
                                        className="form-control"
                                        type="text"
                                        name="lotNo"
                                        id="" lotNo
                                        value={objValues.lotNo}
                                        onChange={handleInputChange}
                                        style={{
                                            border: "1px solid #014D88",
                                            borderRadius: "0.2rem",
                                        }}
                                    />
                                    {/*{errors.facilityId !== "" ? (*/}
                                    {/*    <span className={classes.error}>*/}
                                    {/*        {errors.facilityId}*/}
                                    {/*    </span>*/}
                                    {/*) : (*/}
                                    {/*    ""*/}
                                    {/*)}*/}
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                    <Label for="">
                                        Expiry Date <span style={{color: "red"}}> *</span>
                                    </Label>
                                    <Input
                                        type="date"
                                        name="expiryDate"
                                        id="expirtyDate"
                                        value={objValues.expiryDate}
                                        onChange={handleInputChange}
                                        min={moment(new Date()).format("YYYY-MM-DD")}
                                        max={moment(new Date()).add(5, 'years').format("YYYY-MM-DD")}
                                        style={{
                                            border: "1px solid #014D88",
                                            borderRadius: "0.25rem",
                                        }}
                                    />
                                    {/*{errors.dateVisit !== "" ? (*/}
                                    {/*    <span className={classes.error}>{errors.dateVisit}</span>*/}
                                    {/*) : (*/}
                                    {/*    ""*/}
                                    {/*)}*/}
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-12">
                                <FormGroup>
                                    <Label for="dualListBox">
                                        Who do you want to use the kit for?
                                    </Label>
                                    <DualListBox
                                        options={options}
                                        selected={selectedUsers}
                                        onChange={handleKitSelectUserChange}
                                        disabled={objValues.userType === "Secondary User" ? true : false}
                                    />
                                </FormGroup>
                            </div>

                            {/*<div className="form-group mb-7 col-md-4">*/}
                            {/*    <FormGroup>*/}
                            {/*        <Label for="kitUser">*/}
                            {/*            Who do you want to use the kit for?*/}
                            {/*        </Label>*/}
                            {/*        <Select*/}
                            {/*            isMulti*/}
                            {/*            name="whoDoYouWantToUseTheKitFor"*/}
                            {/*            options={options}*/}
                            {/*            className="basic-multi-select"*/}
                            {/*            classNamePrefix="select"*/}
                            {/*            onChange={handleKitSelectUserChange}*/}
                            {/*            styles={{*/}
                            {/*                control: (provided) => ({*/}
                            {/*                    ...provided,*/}
                            {/*                    border: "1px solid #014D88",*/}
                            {/*                    borderRadius: "0.25rem",*/}
                            {/*                }),*/}
                            {/*            }}*/}
                            {/*        />*/}
                            {/*    </FormGroup>*/}
                            {/*</div>*/}

                            {selectedUsers && selectedUsers.length === 1 && selectedUsers[0] === 'others' &&
                                <div className="form-group mb-3 col-md-4">
                                    <FormGroup>
                                        <Label for="kitUser">
                                            Please Specify
                                        </Label>
                                        <Input
                                            type="text"
                                            name="otherText"
                                            id="otherText"
                                            value={otherText}
                                            onChange={e => setOtherText(e.target.value)}
                                            placeholder="Please specify"
                                            style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.25rem",
                                            }}
                                        />
                                    </FormGroup>
                                </div>
                            }
                            {showUserInfo && objValues.userType === "Primary User" &&
                                <div className="form-group  col-md-4">
                                    <FormGroup>
                                        <Label style={style}>
                                            Is user information available?
                                            <span style={{color: "red"}}> *</span>
                                        </Label>
                                        <select
                                            className="form-control"
                                            name="isUserInformationAvailable"
                                            id="isUserInformationAvailable"
                                            value={objValues.isUserInformationAvailable}
                                            onChange={handleInputChange}
                                            style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                            }}
                                            disabled={objValues.userType === "Secondary User" ? true : false}
                                        >
                                            <option value={""}></option>
                                            <option value="Yes">YES</option>
                                            <option value="No">NO</option>
                                        </select>
                                        {/*                {errors.firstTimeVisit !== "" ? (*/}
                                        {/*                    <span className={classes.error}>*/}
                                        {/*  {errors.firstTimeVisit}*/}
                                        {/*</span>*/}
                                        {/*                ) : (*/}
                                        {/*                    ""*/}
                                        {/*                )}*/}
                                    </FormGroup>
                                </div>
                            }
                            { objValues?.isUserInformationAvailable === "Yes" &&
                                <>
                                    <div className="row center">
                                        <div
                                            className="form-group col-md-12 ml-3 text-center pt-2 mb-4"
                                            style={{
                                                backgroundColor: "#992E62",
                                                width: "125%",
                                                height: "35px",
                                                color: "#fff",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Intended Kit User Information
                                        </div>
                                    </div>
                                    {/*<UserInformationCard*/}
                                    {/*    // userInformation={userInfo}*/}
                                    {/*    objValues={objValues}*/}
                                    {/*    setObjValues={setObjValues}*/}
                                    {/*    options={options}*/}
                                    {/*    kitUserInformation={kitUserInformation}*/}
                                    {/*    setKitUserInformation={setKitUserInformation}*/}
                                    {/*    isUserInformationAvailable={isUserInformationAvailable}*/}

                                    {/*/>*/}


                                    <div className="row">
                                        <div className="form-group  col-md-4">
                                            <FormGroup>
                                                <Label>
                                                    user Category
                                                    <span style={{color: "red"}}> *</span>
                                                </Label>
                                                <select
                                                    className="form-control"
                                                    name="userCategory"
                                                    id="userCategory"
                                                    value={userInformation.userDetails.userCategory}
                                                    onChange={(e) => handleUserInformationInputChange(e, "userDetails")}
                                                    style={{
                                                        border: "1px solid #014D88",
                                                        borderRadius: "0.2rem",
                                                    }}
                                                >
                                                    <option value={""}></option>
                                                    {options.map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                {/*{errors.indexClient !== "" ? (*/}
                                                {/*    <span className={classes.error}>{errors.indexClient}</span>*/}
                                                {/*) : (*/}
                                                {/*    ""*/}
                                                {/*)}*/}
                                            </FormGroup>
                                        </div>
                                        {userInformation.userDetails.userCategory === "others" ? (
                                            <div className="form-group col-md-4">
                                                <FormGroup>
                                                    <Label>
                                                        Specify Other Category
                                                        <span style={{color: "red"}}> *</span>
                                                    </Label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="otherCategory"
                                                        id="otherCategory"
                                                        value={userInformation.userDetails.otherCategory}
                                                        // onChange={handleInputChange1}
                                                        onChange={(e) => handleUserInformationInputChange(e, "userDetails")}
                                                        style={{
                                                            border: "1px solid #014D88",
                                                            borderRadius: "0.2rem",
                                                        }}
                                                    />
                                                    {/*{errors.indexClient !== "" ? (*/}
                                                    {/*    <span className={classes.error}>{errors.indexClient}</span>*/}
                                                    {/*) : (*/}
                                                    {/*    ""*/}
                                                    {/*)}*/}
                                                </FormGroup>
                                            </div>
                                        ) : ""}
                                        <div className="form-group col-md-4">
                                            <FormGroup>
                                                <Label>
                                                    Client Code
                                                    <span style={{color: "red"}}> *</span>
                                                </Label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="userClientCode"
                                                    id="userClientCode"
                                                    value={userInformation.userDetails.userClientCode}
                                                    // onChange={handleInputChange1}
                                                    onChange={(e) => handleUserInformationInputChange(e, "userDetails")}
                                                    style={{
                                                        border: "1px solid #014D88",
                                                        borderRadius: "0.2rem",
                                                    }}
                                                />
                                                {/*{errors.indexClient !== "" ? (*/}
                                                {/*    <span className={classes.error}>{errors.indexClient}</span>*/}
                                                {/*) : (*/}
                                                {/*    ""*/}
                                                {/*)}*/}
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
                                                    name="dateOfBirth"
                                                    id="dateOfBirth"
                                                    min="1929-12-31"
                                                    max={moment(new Date()).format("YYYY-MM-DD")}
                                                    // value={userDetails.dateOfBirth}
                                                    // onChange={handleDobChange1}
                                                    value={userInformation.userDetails.dateOfBirth}
                                                    onChange={(e) => handleUserInformationInputChange(e, "userDetails")}
                                                    style={{
                                                        border: "1px solid #014D88",
                                                        borderRadius: "0.2rem",
                                                    }}
                                                    // disabled
                                                />
                                                {/*{errors.dob !== "" ? (*/}
                                                {/*    <span className={classes.error}>{errors.dob}</span>*/}
                                                {/*) : (*/}
                                                {/*    ""*/}
                                                {/*)}*/}
                                            </FormGroup>
                                        </div>
                                        <div className="form-group mb-3 col-md-4">
                                            <FormGroup>
                                                <Label>
                                                    Age {" "}
                                                </Label>
                                                <input
                                                    className="form-control"
                                                    type="number"
                                                    name="age"
                                                    id="age"
                                                    disabled
                                                    style={{
                                                        border: "1px solid #014D88",
                                                        borderRadius: "0.2rem",
                                                    }}
                                                    value={calculate_age(userInformation.userDetails?.dateOfBirth)}
                                                    onChange={(e) => handleUserInformationInputChange(e, "userDetails")}
                                                />
                                            </FormGroup>
                                        </div>
                                        <div className="form-group  col-md-4">
                                            <FormGroup>
                                                <Label>
                                                    Sex <span style={{color: "red"}}> *</span>
                                                </Label>
                                                <select
                                                    className="form-control"
                                                    name="sex"
                                                    id="sex"
                                                    value={userInformation.userDetails.sex}
                                                    onChange={(e) => handleUserInformationInputChange(e, "userDetails")}
                                                    style={{
                                                        border: "1px solid #014D88",
                                                        borderRadius: "0.2rem",
                                                    }}
                                                >
                                                    <option value={""}></option>
                                                    {sexs.map((value) => (
                                                        <option key={value.id} value={value.display}>
                                                            {value.display}
                                                        </option>
                                                    ))}
                                                </select>
                                                {/*{errors.sex !== "" ? (*/}
                                                {/*    <span className={classes.error}>{errors.sex}</span>*/}
                                                {/*) : (*/}
                                                {/*    ""*/}
                                                {/*)}*/}
                                            </FormGroup>
                                        </div>
                                        {userInformation.userDetails.age > 9 && (
                                            <div className="form-group  col-md-4">
                                                <FormGroup>
                                                    <Label>Marital Status</Label>
                                                    <select
                                                        className="form-control"
                                                        name="maritalStatusId"
                                                        id="maritalStatusId"
                                                        value={userInformation.userDetails.maritalStatusId}
                                                        // onChange={handleInputChange1}
                                                        onChange={(e) => handleUserInformationInputChange(e, "userDetails")}
                                                        style={{
                                                            border: "1px solid #014D88",
                                                            borderRadius: "0.2rem",
                                                        }}
                                                    >
                                                        <option value={""}></option>
                                                        {maritalStatus.map((value) => (
                                                            <option key={value.id} value={value.id}>
                                                                {value.display}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </FormGroup>
                                            </div>
                                        )}
                                        <div className="form-group  col-md-4">
                                            <FormGroup>
                                                <Label> Type of HIV Self-Test </Label>
                                                <select
                                                    className="form-control"
                                                    name="typeOfHivst"
                                                    id="typeOfHivst"
                                                    value={userInformation.userDetails.typeOfHivst}
                                                    onChange={(e) => handleUserInformationInputChange(e, "userDetails")}
                                                    style={{
                                                        border: "1px solid #014D88",
                                                        borderRadius: "0.2rem",
                                                    }}
                                                >
                                                    <option value={""}></option>
                                                    <option value="Assisted">
                                                        Assisted
                                                    </option>
                                                    <option value="Unassisted">
                                                        Unassisted
                                                    </option>
                                                </select>
                                            </FormGroup>
                                        </div>
                                        {/*<div className="form-group mb-3 col-md-6">*/}
                                        {/*    <LabelSui*/}
                                        {/*        as="a"*/}
                                        {/*        color="black"*/}
                                        {/*        // onClick={handleSubmitfamilyIndexRequestDto}*/}
                                        {/*        size="small"*/}
                                        {/*        style={{marginTop: 35}}*/}
                                        {/*    >*/}
                                        {/*        <Icon name="plus"/> Add*/}
                                        {/*    </LabelSui>*/}
                                        {/*</div>*/}
                                        {kitUserInformation && kitUserInformation.length > 0 ? (
                                            <List className="mb-5">
                                                <Table striped responsive>
                                                    <thead style={{
                                                        backgroundColor: "#014D88",
                                                        color: "white",
                                                        fontSize: "10px"
                                                    }}>
                                                    <tr>
                                                        <th>Client Code</th>
                                                        <th>HIV Self Test Type</th>
                                                        <th>User Category</th>
                                                        <th>Action</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {kitUserInformation.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{item.userClientCode}</td>
                                                            <td>{item.typeOfHivst}</td>
                                                            <td>{item.userCategory}</td>
                                                            <td>
                                                                <IconButton
                                                                    aria-label="delete"
                                                                    size="small"
                                                                    color="error"
                                                                    // onClick={() => removeKitUserInformation(index)}
                                                                >
                                                                    <DeleteIcon fontSize="inherit"/>
                                                                </IconButton>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </Table>
                                            </List>
                                        ) : ""
                                        }
                                    </div>


                                </>
                            }

                            {/*Checkbox to select if the User has conducted the HIVST – if checked, display the*/}
                            {/*following questions, else the user should be able to save the form.*/}
                            {/*<div className="row mb-7">*/}
                            {/*    <div className="form-group mb-3 col-md-4">*/}
                            {/*        <FormGroup>*/}
                            {/*            <label>*/}
                            {/*                <input*/}
                            {/*                    type="checkbox"*/}
                            {/*                    checked={objValues.hasConductedHIVST}*/}
                            {/*                    onChange={() => {*/}
                            {/*                        setObjValues(prevState => ({*/}
                            {/*                            ...prevState,*/}
                            {/*                            hasConductedHIVST: !prevState.hasConductedHIVST*/}
                            {/*                        }));*/}
                            {/*                        console.log("Has Conducted HIVST", !objValues.hasConductedHIVST);*/}
                            {/*                    }}*/}
                            {/*                    style={{marginRight: "10px"}}*/}
                            {/*                />*/}
                            {/*                Have you conducted the HIVST ?*/}
                            {/*            </label>*/}
                            {/*        </FormGroup>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <hr style={{width: '100%'}}/>
                            </div>
                            <div className="row mb-7">
                                <div className="form-group  col-md-4">
                                    <FormGroup>
                                        <Label style={style}>
                                            Have you conducted the HIVST ?
                                            <span style={{color: "red"}}> *</span>
                                        </Label>
                                        <select
                                            className="form-control"
                                            name="hasConductedHIVST"
                                            id="hasConductedHIVST"
                                            value={objValues.hasConductedHIVST}
                                            onChange={handleInputChange}
                                            style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                            }}
                                        >
                                            <option value={""}></option>
                                            <option value="Yes">YES</option>
                                            <option value="No">NO</option>
                                        </select>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="row mb-7">
                                {objValues.hasConductedHIVST === "Yes" ? (
                                    // Display the following questions if the checkbox is checked
                                    <>
                                        <div className="row center">
                                            <div
                                                className="form-group col-md-12 ml-3 text-center pt-2 mb-4"
                                                style={{
                                                    backgroundColor: "rgba(15, 102, 3, 0.8)",
                                                    width: "125%",
                                                    height: "35px",
                                                    color: "rgba(15, 102, 3, 0.8)",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Section B : HIVST Post Test Assessment
                                            </div>
                                            <div className="form-group  col-md-4">
                                                <FormGroup>
                                                    <Label style={style}>
                                                        Have you ever used HIVST kit Yes?
                                                        <span style={{color: "red"}}> *</span>
                                                    </Label>
                                                    <select
                                                        className="form-control"
                                                        name="everUsedHivstKit"
                                                        id="everUsedHivstKitl"
                                                        value={objValues.hasConductedHIVST ? "Yes" : "No"}
                                                        // onChange={handleInputChange}
                                                        style={{
                                                            border: "1px solid #014D88",
                                                            borderRadius: "0.2rem",
                                                        }}
                                                        disabled
                                                    >
                                                        <option value={""}></option>
                                                        <option value="Yes">YES</option>
                                                        <option value="No">NO</option>
                                                    </select>
                                                </FormGroup>
                                            </div>
                                            <div className="form-group  col-md-4">
                                                <FormGroup>
                                                    <Label style={style}>
                                                        Did you use the HIVST kit for yourself or someone else?
                                                        <span style={{color: "red"}}> *</span>
                                                    </Label>
                                                    <select
                                                        className="form-control"
                                                        name="everUsedHivstKitForSelfOrOthers"
                                                        id="everUsedHivstKitForSelfOrOthers"
                                                        value={userInformation.postTestAssessment.everUsedHivstKitForSelfOrOthers}
                                                        onChange={(e) => handleUserInformationInputChange(e, "postTestAssessment")}
                                                        style={{
                                                            border: "1px solid #014D88",
                                                            borderRadius: "0.2rem",
                                                        }}
                                                    >
                                                        <option value={""}></option>
                                                        <option value="Self">Self</option>
                                                        <option value="Someone else">Someone else</option>
                                                    </select>
                                                </FormGroup>
                                            </div>
                                            {userInformation.postTestAssessment.everUsedHivstKitForSelfOrOthers === "Someone else" &&
                                                <div className="form-group  col-md-4">
                                                    <FormGroup>
                                                        <Label style={style}>
                                                            Who did you give it to?
                                                            <span style={{color: "red"}}> *</span>
                                                        </Label>
                                                        <select
                                                            className="form-control"
                                                            name="otherHivstKitUserCategory"
                                                            id="otherHivstKitUserCategory"
                                                            value={userInformation.postTestAssessment.otherHivstKitUserCategory}
                                                            onChange={(e) => handleUserInformationInputChange(e, "postTestAssessment")}
                                                            style={{
                                                                border: "1px solid #014D88",
                                                                borderRadius: "0.2rem",
                                                            }}
                                                        >
                                                            <option value={""}></option>
                                                            {options.map(option => (
                                                                <option key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </FormGroup>
                                                </div>
                                            }
                                            {userInformation.postTestAssessment?.otherHivstKitUserCategory === "others" ? (
                                                <div className="form-group col-md-4">
                                                    <FormGroup>
                                                        <Label>
                                                            Please Specify Other Category
                                                            <span style={{color: "red"}}> *</span>
                                                        </Label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name=" otherHivstKitUserCategoryText"
                                                            id=" otherHivstKitUserCategoryText"
                                                            value={userInformation.postTestAssessment.otherHivstKitUserCategoryText}
                                                            onChange={(e) => handleUserInformationInputChange(e, "postTestAssessment")}
                                                            style={{
                                                                border: "1px solid #014D88",
                                                                borderRadius: "0.2rem",
                                                            }}
                                                        />
                                                    </FormGroup>
                                                </div>
                                            ) : ""}

                                            <div className="form-group  col-md-4">
                                                <FormGroup>
                                                    <Label style={style}>
                                                        What was the result of the HIVST?
                                                        <span style={{color: "red"}}> *</span>
                                                    </Label>
                                                    <select
                                                        className="form-control"
                                                        name="resultOfHivstTest"
                                                        id="resultOfHivstTest"
                                                        value={userInformation.postTestAssessment.resultOfHivstTest}
                                                        onChange={(e) => handleUserInformationInputChange(e, "postTestAssessment")}
                                                        style={{
                                                            border: "1px solid #014D88",
                                                            borderRadius: "0.2rem",
                                                        }}
                                                    >
                                                        <option value={""}></option>
                                                        <option value="Reactive">Reactive</option>
                                                        <option value="Non-Reactive">Non Reactive</option>
                                                        <option value="Indeterminate">Indeterminate</option>
                                                    </select>
                                                </FormGroup>
                                            </div>
                                            { userInformation?.postTestAssessment?.resultOfHivstTest === "Reactive" &&
                                                <div className="form-group  col-md-4">
                                                    <FormGroup>
                                                        <Label style={style}>
                                                            Would you like to access HIV testing to confirm my HIVST
                                                            result?
                                                            <span style={{color: "red"}}> *</span>
                                                        </Label>
                                                        <select
                                                            className="form-control"
                                                            name="accessConfirmatoryHts"
                                                            id="accessConfirmatoryHts"
                                                            value={userInformation.postTestAssessment.accessConfirmatoryHts}
                                                            onChange={(e) => handleUserInformationInputChange(e, "postTestAssessment")}
                                                            style={{
                                                                border: "1px solid #014D88",
                                                                borderRadius: "0.2rem",
                                                            }}
                                                        >
                                                            <option value={""}></option>
                                                            <option value="Yes">YES</option>
                                                            <option value="No">NO</option>
                                                        </select>
                                                    </FormGroup>
                                                </div>
                                            }
                                            {userInformation?.postTestAssessment?.resultOfHivstTest === "Non-Reactive" &&
                                                <div className="form-group  col-md-4">
                                                    <FormGroup>
                                                        <Label style={style}>
                                                            Would you like to be referred for prevention services
                                                            <span style={{color: "red"}}> *</span>
                                                        </Label>
                                                        <select
                                                            className="form-control"
                                                            name="referPreventionServices"
                                                            id="referPreventionServices"
                                                            value={userInformation.postTestAssessment.referPreventionServices}
                                                            onChange={(e) => handleUserInformationInputChange(e, "postTestAssessment")}
                                                            style={{
                                                                border: "1px solid #014D88",
                                                                borderRadius: "0.2rem",
                                                            }}
                                                        >
                                                            <option value={""}></option>
                                                            <option value="Yes">YES</option>
                                                            <option value="No">NO</option>
                                                        </select>
                                                    </FormGroup>
                                                </div>
                                            }

                                        </div>
                                        {
                                            userInformation.postTestAssessment
                                            && userInformation.postTestAssessment.accessConfirmatoryHts === "Yes"
                                            || userInformation.postTestAssessment.referPreventionServices === "Yes" ?
                                                (
                                                    <div className="row center">
                                                        <div
                                                            className="form-group col-md-12 ml-3 text-center pt-2 mb-4"
                                                            style={{
                                                                backgroundColor: "#992E62",
                                                                width: "125%",
                                                                height: "35px",
                                                                color: "#fff",
                                                                fontWeight: "bold",
                                                            }}
                                                        >
                                                            Section C : Referral Information
                                                        </div>
                                                        <div className="form-group  col-md-4">
                                                            <FormGroup>
                                                                <Label style={style}>
                                                                    Referred for Confirmatory HTS Testing
                                                                    <span style={{color: "red"}}> *</span>
                                                                </Label>
                                                                <select
                                                                    className="form-control"
                                                                    name="referredForConfirmatoryHts"
                                                                    id="referredForConfirmatoryHts"
                                                                    value={userInformation.postTestAssessment.referralInformation.dateReferredForConfirmatoryHts}
                                                                    onChange={(e) => handleUserInformationInputChange(e, "postTestAssessment")}
                                                                    style={{
                                                                        border: "1px solid #014D88",
                                                                        borderRadius: "0.2rem",
                                                                    }}
                                                                >
                                                                    <option value={""}></option>
                                                                    <option value="Yes">YES</option>
                                                                    <option value="No">NO</option>
                                                                </select>
                                                            </FormGroup>
                                                        </div>
                                                        {userInformation.postTestAssessment.referralInformation && userInformation.postTestAssessment.referralInformation.referredForConfirmatoryHts === "Yes" &&
                                                            <div className="form-group mb-3 col-md-4">
                                                                <FormGroup>
                                                                    <Label for="">
                                                                        Date referred for confirmatory HTS testing
                                                                        field <span style={{color: "red"}}> *</span>
                                                                    </Label>
                                                                    <Input
                                                                        type="date"
                                                                        name="dateReferredForConfirmatoryHts"
                                                                        id="dateReferredForConfirmatoryHts"
                                                                        value={userInformation.postTestAssessment.referralInformation.dateReferredForConfirmatoryHts}
                                                                        onChange={(e) => handleUserInformationInputChange(e, "postTestAssessment")}

                                                                        min={objValues.dateVisit}
                                                                        max={moment(new Date()).format("YYYY-MM-DD")}
                                                                        style={{
                                                                            border: "1px solid #014D88",
                                                                            borderRadius: "0.25rem",
                                                                        }}
                                                                    />
                                                                </FormGroup>
                                                            </div>}
                                                        {userInformation.postTestAssessment.referralInformation && userInformation?.postTestAssessment?.referralInformation?.referredForConfirmatoryHts === "No" &&
                                                            <div className="form-group  col-md-4">
                                                                <FormGroup>
                                                                    <Label style={style}>
                                                                        Referred for Prevention Services
                                                                        <span style={{color: "red"}}> *</span>
                                                                    </Label>
                                                                    <select
                                                                        className="form-control"
                                                                        name="referredForPreventionServices"
                                                                        id="referredForPreventionServices"
                                                                        value={userInformation.postTestAssessment.referralInformation.referredForPreventionServices}
                                                                        onChange={(e) => handleUserInformationInputChange(e, "postTestAssessment")}

                                                                        style={{
                                                                            border: "1px solid #014D88",
                                                                            borderRadius: "0.2rem",
                                                                        }}
                                                                    >
                                                                        <option value={""}></option>
                                                                        <option value="Yes">YES</option>
                                                                        <option value="No">NO</option>
                                                                    </select>
                                                                </FormGroup>
                                                            </div>
                                                         }
                                                        {userInformation.postTestAssessment.referralInformation && userInformation.postTestAssessment.referralInformation.referredForPreventionServices === "Yes" &&
                                                            <div className="form-group mb-3 col-md-4">
                                                                <FormGroup>
                                                                    <Label for="">
                                                                        Date referred for confirmatory HTS testing
                                                                        field <span style={{color: "red"}}> *</span>
                                                                    </Label>
                                                                    <Input
                                                                        type="date"
                                                                        name="dateReferredForPreventionServices"
                                                                        id="dateReferredForPreventionServices"
                                                                        value={userInformation.postTestAssessment.referralInformation.dateReferredForPreventionServices}
                                                                        onChange={(e) => handleUserInformationInputChange(e, "postTestAssessment")}
                                                                        min={objValues.dateVisit}
                                                                        max={moment(new Date()).format("YYYY-MM-DD")}
                                                                        style={{
                                                                            border: "1px solid #014D88",
                                                                            borderRadius: "0.25rem",
                                                                        }}
                                                                    />
                                                                    {/*{errors.dateVisit !== "" ? (*/}
                                                                    {/*    <span className={classes.error}>{errors.dateVisit}</span>*/}
                                                                    {/*) : (*/}
                                                                    {/*    ""*/}
                                                                    {/*)}*/}
                                                                </FormGroup>
                                                            </div>
                                                    }

                                                    </div>) : ""}
                                    </>
                                ) : (
                                    // Display the save form button if the checkbox is not checked
                                    <div className="row">
                                        {// if selected user  is myself only show save button and save secondary user information
                                            selectedUsers && selectedUsers.length === 1 && selectedUsers[0] === "myself" &&
                                            <div className="form-group mb-3 col-md-6">
                                                <Button
                                                    content="save secondary user infor"
                                                    icon="save"
                                                    labelPosition="right"
                                                    style={{backgroundColor: "#014d88", color: "#fff"}}
                                                    onClick={handleSubmit}
                                                    disabled={saving}
                                                />
                                            </div>
                                        }
                                        {objValues?.isUserInformationAvailable === "Yes" &&
                                            <div className="form-group mb-3 col-md-6">
                                                <Button
                                                    content="save"
                                                    icon="save"
                                                    labelPosition="right"
                                                    style={{backgroundColor: "#014d88", color: "#fff"}}
                                                    onClick={handleSubmit}
                                                    disabled={saving}
                                                />
                                            </div>
                                        }
                                    </div>
                                )}
                            </div>


                        </div>

                    </form>
                </CardBody>
            </Card>
        </>
    )
}
export default HIVSTPatientRegistration;