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
        nameOfIndividualHIVTestKitReceived: "",
        nameOfTestKit: "",
        lotNo: "",
        expiryDate: "",
        kitUser: null,
        otherKitUserCategory: "",
        userInformation: null,
        isUserInformationAvailable: "",
        otherTestKitUserDetails: [],
        hasConductedHIVST: false,

    });


    const [userInformation, setUserInformation] = useState([{
        userCategory: "",
        otherCategory: "",
        userClientCode: "",
        dateOfBirth: "",
        age: "",
        sex: "",
        maritalStatus: "",
        typeOfHivSelfTest: "",
    }]);

    const [postTestAssessment, setPostTestAssessment] = useState({
        everUsedHivstKit: false,
        everUsedHivstKitForSelfOrOthers: "",
        otherHivstKitUserCategory: "",
        otherHivstKitUserCategoryText: "",
        resultOfHivstTest: "",
        accessConfirmatoryHts: "",
        referPreventionServices: ""
    });

    const setTestKitUserInformation = (userInformation) => {
        setObjValues(prevObjValues => {
            return {
                ...prevObjValues,
                userInformation: userInformation
            };
        });
    };

    // users
    // const userInformation = {
    //     userCategory: "",
    //     otherCategory: "",
    //     userClientCode: "",
    //     dateOfBirth: "",
    //     age: "",
    //     sex: "",
    //     maritalStatus: "",
    //     typeOfHivSelfTest: "",
    // }

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

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setObjValues({
            ...objValues,
            [name]: value,
        });
    }

    // Step 2: Create a function to handle adding a new userInformation object to the array
    const addUserInformation = () => {
        setUserInformation([
            ...userInformation,
            {
                userCategory: "",
                otherCategory: "",
                userClientCode: "",
                dateOfBirth: "",
                age: "",
                sex: "",
                maritalStatus: "",
                typeOfHivSelfTest: "",
            }
        ]);
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

    console.log("selectedUsers", selectedUsers);
    console.log("showUserInfo", showUserInfo);
    useEffect(() => {
        SERVICE_NEEDED();
    }, []);

    const handleKitSelectUserChange = selectedUsers => {
        setSelectedUsers(selectedUsers);
        let newValues = {...objValues, kitUser: selectedUsers};
        if (!selectedUsers || selectedUsers.length === 0) {
            setShowUserInfo(false);
            newValues = {...newValues, isUserInformationAvailable: ""};
        }
        // if 'myself' is the only selected option, then user information should not be available
        else if (selectedUsers.length === 1 && selectedUsers[0] === 'myself') {
            setShowUserInfo(false);
            newValues = {...newValues, isUserInformationAvailable: ""};
        }
        // if any other option is selected apart from 'myself' or 'myself' and any other option is selected, then user information should be available
        else {
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
    };

    console.log("Object Values", objValues);
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

    const handlePostTestAssessmentChange = (e) => {
        const {name, value} = e.target;
        setPostTestAssessment({
            ...postTestAssessment,
            [name]: value,
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("objValues", objValues)
    }

    return (
        <>
            <Card className={classes.root}>
                <CardBody>
                    <h2 style={{color: "#000"}}> HIVST PRE TEST INFORMATION </h2>
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
                                        name="numberOfIndividualHIVTestKitReceived"
                                        id="numberOfIndividualHIVTestKitReceived"
                                        value={objValues.nameOfTestKit}
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
                            {showUserInfo &&
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
                            {objValues?.isUserInformationAvailable === "Yes" &&
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
                                            TestKit User Information
                                        </div>
                                    </div>
                                    <UserInformationCard
                                        // userInformation={userInfo}
                                        objValues={objValues}
                                        setObjValues={setObjValues}
                                        options={options}
                                        kitUserInformation={kitUserInformation}
                                        setKitUserInformation={setKitUserInformation}
                                        isUserInformationAvailable={isUserInformationAvailable}

                                    />
                                </>
                            }

                            {/*Checkbox to select if the User has conducted the HIVST – if checked, display the*/}
                            {/*following questions, else the user should be able to save the form.*/}
                            <div className="row mb-7">
                                <div className="form-group mb-3 col-md-4">
                                    <FormGroup>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={objValues.hasConductedHIVST}
                                                onChange={() => setObjValues(prevState => ({
                                                    ...prevState,
                                                    hasConductedHIVST: !prevState.hasConductedHIVST
                                                }))}
                                                style={{marginRight: "10px"}}
                                            />
                                            Have you conducted the HIVST ?
                                        </label>
                                    </FormGroup>
                                </div>
                            </div>

                            <div className="row mb-7">
                                {objValues.hasConductedHIVST ? (
                                    // Display the following questions if the checkbox is checked
                                    <>
                                        <div className="row center">
                                            <div
                                                className="form-group col-md-12 ml-3 text-center pt-2 mb-4"
                                                style={{
                                                    backgroundColor: "rgba(15, 102, 3, 0.8)",
                                                    width: "125%",
                                                    height: "35px",
                                                    color: "#fff",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                HIVST Post Test Assessment
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
                                                        value={postTestAssessment.everUsedHivstKit}
                                                        onChange={handlePostTestAssessmentChange}
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
                                                        value={postTestAssessment.everUsedHivstKitForSelfOrOthers}
                                                        onChange={handlePostTestAssessmentChange}
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
                                            { postTestAssessment && postTestAssessment.everUsedHivstKitForSelfOrOthers === "Someone else" &&
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
                                                        value={postTestAssessment.otherHivstKitUserCategory}
                                                        onChange={handlePostTestAssessmentChange}
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
                                            {postTestAssessment && postTestAssessment.otherHivstKitUserCategory === "others" ? (
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
                                                            value={postTestAssessment.otherHivstKitUserCategoryText}
                                                            onChange={handlePostTestAssessmentChange}
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
                                                        value={postTestAssessment.resultOfHivstTest}
                                                        onChange={handlePostTestAssessmentChange}
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
                                            {postTestAssessment && postTestAssessment.resultOfHivstTest === "Reactive" &&
                                                <div className="form-group  col-md-4">
                                                <FormGroup>
                                                    <Label style={style}>
                                                        Would you like to access HIV testing to confirm my HIVST result?
                                                        <span style={{color: "red"}}> *</span>
                                                    </Label>
                                                    <select
                                                        className="form-control"
                                                        name="accessConfirmatoryHts"
                                                        id="accessConfirmatoryHts"
                                                        value={postTestAssessment.accessConfirmatoryHts}
                                                        onChange={handlePostTestAssessmentChange}
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
                                            </div>}
                                            {postTestAssessment && postTestAssessment.resultOfHivstTest === "Non-Reactive" &&
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
                                                            value={postTestAssessment.referPreventionServices}
                                                            onChange={handlePostTestAssessmentChange}
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
                                                </div>}

                                        </div>
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