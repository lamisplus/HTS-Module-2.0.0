import React, {useEffect, useState} from "react";
import {FormGroup, Label} from "reactstrap";
import axios from "axios";
import {token, url as baseUrl} from "../../../../api";
import * as moment from "moment/moment";
import {calculate_age} from "../../utils";
import {Icon, Label as LabelSui, List} from "semantic-ui-react";
import {Table} from "react-bootstrap";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

const UserInformationCard = (props) => {
    const [errors, setErrors] = useState({});
    let temp = {...errors};
    const [ageDisabled, setAgeDisabled] = useState(true);
    const [maritalStatus, setMaritalStatus] = useState([]);
    const [selectedOption, setSelectedOption] = useState("");
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [sexs, setSexs] = useState([]);
    const [payload, setPayload] = useState({
            id: "",
            otherCategory: "",
            userClientCode: "",
            dateOfBirth: "",
            age: "",
            sex: "",
            maritalStatusId: "",
            typeOfHivst: "",
            userCategory: ""
        }
    );


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


    console.log("payload", payload)
    console.log("props.objValues  in userInformationcARD", props.objValues)

    const handleDobChange1 = (e) => {
        let newPayload = {...payload, [e.target.name]: e.target.value};
        if (e.target.value && new Date(e.target.value) <= new Date()) {
            const age_now = calculate_age(e.target.value);
            newPayload = {...newPayload, age: age_now};
        } else {
            newPayload = {...newPayload, age: ""};
        }
        setPayload(newPayload);
    };

    // validate input fields
    const validate1 = () => {
        temp.userCategory = payload.userCategory
            ? ""
            : "This field is required.";
        if (payload?.userCategory && payload.userCategory === "others") {
            temp.otherCategory = payload.otherCategory
                ? ""
                : "This field is required.";

        }
        temp.userClientCode = payload.userClientCode
            ? ""
            : "This field is required.";

        return Object.values(temp).every((x) => x == "");

    };

    const handleInputChange1 = (e) => {
        const {name, value} = e.target;
        setPayload(prevPayload => {
            let newPayload = {
                ...prevPayload,
                [name]: value,
            };
            if (name === "userCategory" && value != "others") {
                newPayload = {
                    ...newPayload,
                    otherCategory: "",
                };
            }
            return newPayload;
        });
    }

    const validateUserTestKitInformation = () => {
        let temp = {};
        temp.userCategory = payload.userCategory ? "" : "This field is required.";
        temp.userClientCode = payload.userClientCode ? "" : "This field is required.";
        temp.dateOfBirth = payload.dateOfBirth ? "" : "This field is required.";
        temp.age = payload.age ? "" : "This field is required";

        setErrors({...temp});
        return Object.values(temp).every((x) => x === "");
    }

    const addTestKitUserInformation = () => {
        if (validateUserTestKitInformation()) {
            let data = {
                userCategory: payload.userCategory,
                otherCategory: payload.otherCategory,
                userClientCode: payload.userClientCode,
                dateOfBirth: payload.dateOfBirth,
                age: payload.age,
                typeOfHivst: payload.typeOfHivst,
                maritalStatus: payload.maritalStatus
            }

            // Add the new data to the kitUserInformation array
            props.setKitUserInformation([...props.kitUserInformation, data]);

            // Set the userInformation in the objValues of PreTestInformation.js
            // props.setTestKitUserInformation(props.kitUserInformation);

            setPayload({
                id: "",
                otherCategory: "",
                userClientCode: "",
                dateOfBirth: "",
                age: "",
                sex: "",
                maritalStatusId: "",
                typeOfHivst: "",
                userCategory: ""
            });
            // handleDobChange({target: {name: "dateOfBirth", value: ""}})
        }
    }

    const removeKitUserInformation = (index) => {
        // Create a new array that excludes the item at the given index
        const newKitUserInformation = props.kitUserInformation.filter((_, i) => i !== index);

        // Update the kitUserInformation array
        props.setKitUserInformation(newKitUserInformation);
    }


    console.log("kitUserInformation", props.kitUserInformation)
    return (
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
                        value={payload.userCategory}
                        onChange={handleInputChange1}
                        style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                        }}
                    >
                        <option value={""}></option>
                        {props.options.map(option => (
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
            {payload.userCategory === "others" ? (
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
                            value={payload.otherCategory}
                            onChange={handleInputChange1}
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
                        value={payload.userClientCode}
                        onChange={handleInputChange1}
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
                        value={payload.dateOfBirth}
                        onChange={handleDobChange1}
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
                        value={calculate_age(payload?.dateOfBirth)}
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
                        value={payload.sex}
                        onChange={handleInputChange1}
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
            {payload.age > 9 && (
                <div className="form-group  col-md-4">
                    <FormGroup>
                        <Label>Marital Status</Label>
                        <select
                            className="form-control"
                            name="maritalStatusId"
                            id="maritalStatusId"
                            value={payload.maritalStatusId}
                            onChange={handleInputChange1}
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
                        value={payload.typeOfHivst}
                        onChange={handleInputChange1}
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


            <div className="form-group mb-3 col-md-6">
                <LabelSui
                    as="a"
                    color="black"
                    onClick={addTestKitUserInformation}
                    size="small"
                    style={{marginTop: 35}}
                >
                    <Icon name="plus"/> Add
                </LabelSui>
            </div>
            {props.kitUserInformation && props.kitUserInformation.length > 0 ? (
                <List className="mb-5">
                    <Table striped responsive>
                        <thead style={{backgroundColor: "#014D88", color: "white", fontSize: "10px"}}>
                        <tr>
                            <th>Client Code</th>
                            <th>HIV Self Test Type</th>
                            <th>User Category</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        { props.kitUserInformation.map((item, index) => (
                        <tr key={index}>
                            <td>{item.userClientCode}</td>
                            <td>{item.typeOfHivst}</td>
                            <td>{item.userCategory}</td>
                            <td>
                                <IconButton
                                    aria-label="delete"
                                    size="small"
                                    color="error"
                                    onClick={() => removeKitUserInformation(index)}
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
    )
}
export default UserInformationCard;