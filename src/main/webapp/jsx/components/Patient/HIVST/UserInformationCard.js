import React, {useEffect, useState} from "react";
import {FormGroup, Label} from "reactstrap";
import axios from "axios";
import {token, url as baseUrl} from "../../../../api";

const UserInformationCard = (props) => {

    let temp = {...errors};
    const [errors, setErrors] = useState({});
    const [maritalStatus, setMaritalStatus] = useState([]);
    const [selectedOption, setSelectedOption] = useState("");
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [sexs, setSexs] = useState([]);
    const [payload, setPayload] = useState({
            kitUserCategory: "",
            otherCategory: "",
            userClientCode: "",
            dateOfBirth: "",
            age: "",
            sex: "",
            maritalStatus: "",
            typeOfHivSelfTest: ""
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

    const MARITALSTATUS= () => {
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
   MARITALSTATUS
    }, []);


    console.log("payload", payload)

    // validate input fields
    const validate = () => {
        temp.kitUserCategory = payload.kitUserCategory
            ? ""
            : "This field is required.";
        if (payload?.kitUserCategory && payload.kitUserCategory === "others") {
            temp.otherCategory = payload.otherCategory
                ? ""
                : "This field is required.";

        }
        temp.userClientCode = payload.userClientCode
            ? ""
            : "This field is required.";

        return Object.values(temp).every((x) => x == "");

    };


    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setPayload(prevPayload => {
            let newPayload = {
                ...prevPayload,
                [name]: value,
            };
            if (name === "kitUserCategory" && value != "others") {
                newPayload = {
                    ...newPayload,
                    otherCategory: "",
                };
            }
            return newPayload;
        });
    }

    return (
        <div className="row">
            <div className="form-group  col-md-4">
                <FormGroup>
                    <Label>
                        user Type Primary
                        <span style={{color: "red"}}> *</span>
                    </Label>
                    <select
                        className="form-control"
                        name="kitUserCategory"
                        id="kitUserCategory"
                        value={payload.kitUserCategory}
                        onChange={handleInputChange}
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
            {payload.kitUserCategory === "others" ? (
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
                            onChange={handleInputChange}
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
                        onChange={handleInputChange}
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
            <div className="form-group col-md-4">
                <FormGroup>
                    <Label>
                        Date of Birth
                        <span style={{color: "red"}}> *</span>
                    </Label>
                    <input
                        type="date"
                        className="form-control"
                        name="dateOfBirth"
                        id="dateOfBirth"
                        value={payload.dateOfBirth}
                        onChange={handleInputChange}
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
            <div className="form-group col-md-4">
                <FormGroup>
                    <Label>
                        Age
                        <span style={{color: "red"}}> *</span>
                    </Label>
                    <input
                        type="text"
                        className="form-control"
                        name="age"
                        id="age"
                        value={payload.age}
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
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
                            onChange={handleInputChange}
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
        </div>
    )
}
export default UserInformationCard;