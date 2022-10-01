
import React, { useEffect, useState} from "react";
import axios from "axios";
import {FormGroup, Label , CardBody, Spinner,Input,Form} from "reactstrap";
import * as moment from 'moment';
import {makeStyles} from "@material-ui/core/styles";
import {Card, CardContent} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
// import AddIcon from "@material-ui/icons/Add";
// import CancelIcon from "@material-ui/icons/Cancel";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { useHistory, } from "react-router-dom";
// import {TiArrowBack} from 'react-icons/ti'
import {token, url as baseUrl } from "../../../../api";
import 'react-phone-input-2/lib/style.css'
import 'semantic-ui-css/semantic.min.css';
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { Button} from 'semantic-ui-react'
import {  Modal } from "react-bootstrap";
import { fontWeight } from "@mui/system";


const useStyles = makeStyles((theme) => ({
    card: {
        margin: theme.spacing(20),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
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
        '& > *': {
            margin: theme.spacing(1)
        },
        "& .card-title":{
            color:'#fff',
            fontWeight:'bold'
        },
        "& .form-control":{
            borderRadius:'0.25rem',
            height:'41px'
        },
        "& .card-header:first-child": {
            borderRadius: "calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0"
        },
        "& .dropdown-toggle::after": {
            display: " block !important"
        },
        "& select":{
            "-webkit-appearance": "listbox !important"
        },
        "& p":{
            color:'red'
        },
        "& label":{
            fontSize:'14px',
            color:'#014d88',
            fontWeight:'bold'
        }
    },
    demo: {
        backgroundColor: theme.palette.background.default,
    },
    inline: {
        display: "inline",
    },
    error:{
        color: '#f85032',
        fontSize: '12.8px'
    },
    success:{
        color: 'green',
        fontSize: '12.8px',
        fontWeight:'bold'
    }
}));


const BasicInfo = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [hideNumChild, setHideNumChild] = useState(false);
    const [kP, setKP] = useState([]);
    const [enrollSetting, setEnrollSetting] = useState([]);
    const [sourceReferral, setSourceReferral] = useState([]);
    const [gender, setGender] = useState([])
    const [sexs, setSexs] = useState([])
    const [states, setStates] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [maritalStatus, setMaritalStatus]= useState([]);
    const [ageDisabled, setAgeDisabled] = useState(true);
    const [counselingType, setCounselingType] = useState([]);
    const [pregnancyStatus, setPregnancyStatus] = useState([]);
    let temp = { ...errors }
    const [open, setOpen] = React.useState(false)
    const toggle = () => setOpen(!open);
    const [indexTesting, setIndexTesting]= useState([]);
    const [clientCodeetail, setclientCodeetail]= useState("");
    const [clientCodeetail2, setclientCodeetail2]= useState("");
    const [clientCodeCheck, setClientCodeCheck]= useState("");
    const [objValues, setObjValues]= useState(
        {
            active: true,
            clientCode: "",
            age:"",
            dob:"",
            breastFeeding:"",
            dateVisit: "",
            firstTimeVisit: null,
            indexClient: null,
            numChildren: "",
            numWives: "",
            pregnant:"",            
            dateOfBirth: null,
            dateOfRegistration:null,
            deceased: true,
            deceasedDateTime: null,
            educationId: "",
            employmentStatusId: "",
            facilityId: "",
            firstName: "",
            genderId: "",
            address: "",
            phoneNumber:"",           
            isDateOfBirthEstimated: "",
            maritalStatusId: "",
            organizationId:"",
            otherName: "",
            sexId: "",
            state:null,
            lga:"",
            surname: "",
            previouslyTested: "",
            referredFrom: "",
            targetGroup: "",
            testingSetting:"",
            typeCounseling: "",
            relationshipWithIndexClient:"",
            indexClientCode:""
        }
    )

    useEffect(() => { 
        KP(); 
        EnrollmentSetting(); 
        SourceReferral();
        Genders();
        getStates();
        MaterialStatus();
        Sex();
        CounselingType();
        PregnancyStatus();
        IndexTesting();
        objValues.dateVisit=moment(new Date()).format("YYYY-MM-DD")
        //setObjValues(props.patientObj)
        console.log(objValues.age)
        if(objValues.age!==''){
            props.setPatientObjAge(objValues.age)
        }
    }, [objValues.age]);

    //Get list of KP
    const KP =()=>{
        axios
        .get(`${baseUrl}application-codesets/v2/TARGET_GROUP`,
            { headers: {"Authorization" : `Bearer ${token}`} }
        )
        .then((response) => {
            setKP(response.data);
        })
        .catch((error) => {
        //console.log(error);
        });    
    }
    //Get list of IndexTesting
    const IndexTesting =()=>{
        axios
        .get(`${baseUrl}application-codesets/v2/INDEX_TESTING`,
            { headers: {"Authorization" : `Bearer ${token}`} }
        )
        .then((response) => {
            setIndexTesting(response.data);
        })
        .catch((error) => {
        //console.log(error);
        });    
    }
    //Get list of KP
    const PregnancyStatus =()=>{
        axios
        .get(`${baseUrl}application-codesets/v2/PREGANACY_STATUS`,
            { headers: {"Authorization" : `Bearer ${token}`} }
        )
        .then((response) => {
            setPregnancyStatus(response.data);
        })
        .catch((error) => {
        //console.log(error);
        });    
    }
    
    //Get list of KP
    const CounselingType =()=>{
        axios
        .get(`${baseUrl}application-codesets/v2/COUNSELING_TYPE`,
            { headers: {"Authorization" : `Bearer ${token}`} }
        )
        .then((response) => {
            setCounselingType(response.data);
        })
        .catch((error) => {
        //console.log(error);
        });    
    }
    //Get list of HIV STATUS ENROLLMENT
    const EnrollmentSetting =()=>{
        axios
        .get(`${baseUrl}application-codesets/v2/TEST_SETTING`,
            { headers: {"Authorization" : `Bearer ${token}`} }
        )
        .then((response) => {
            //console.log(response.data);
            setEnrollSetting(response.data);
        })
        .catch((error) => {
        //console.log(error);
        });    
    }
    //Get list of HIV STATUS ENROLLMENT
    const MaterialStatus =()=>{
        axios
        .get(`${baseUrl}application-codesets/v2/MARITAL_STATUS`,
            { headers: {"Authorization" : `Bearer ${token}`} }
        )
        .then((response) => {
            //console.log(response.data);
            setMaritalStatus(response.data);
        })
        .catch((error) => {
        //console.log(error);
        });    
    }
    //Get list of Source of Referral
    const SourceReferral =()=>{
            axios
            .get(`${baseUrl}application-codesets/v2/SOURCE_REFERRAL`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                //console.log(response.data);
                setSourceReferral(response.data);
            })
            .catch((error) => {
            //console.log(error);
            });        
    }
    //Get list of Genders from 
    const Genders =()=>{
        axios
        .get(`${baseUrl}application-codesets/v2/GENDER`,
            { headers: {"Authorization" : `Bearer ${token}`} }
        )
        .then((response) => {
            //console.log(response.data);
            setGender(response.data);
        })
        .catch((error) => {
        //console.log(error);
        });        
    }
    //Get list of Genders from 
    const Sex =()=>{
        axios
        .get(`${baseUrl}application-codesets/v2/SEX`,
            { headers: {"Authorization" : `Bearer ${token}`} }
        )
        .then((response) => {
            //console.log(response.data);
            setSexs(response.data);
           

        })
        .catch((error) => {
        //console.log(error);
        });        
    }

    //Get States from selected country
    const getStates = () => {
        setStateByCountryId('1'); 
        setObjValues({ ...objValues, countryId: 1 });
    };
    //Get list of State
    function setStateByCountryId(getCountryId) {
        axios
        .get(`${baseUrl}organisation-units/parent-organisation-units/${getCountryId}`,
            { headers: {"Authorization" : `Bearer ${token}`} }
        )
        .then((response) => {
            setStates(response.data);
        })
        .catch((error) => {
        //console.log(error);
        });  
    }   
    //fetch province
    const getProvinces = e => {
            const stateId = e.target.value;
            setObjValues({ ...objValues, stateId: e.target.value });
            axios
            .get(`${baseUrl}organisation-units/parent-organisation-units/${stateId}`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                setProvinces(response.data);
            })
            .catch((error) => {
            //console.log(error);
            });  
    };

    const handleInputChange = e => { 
        setErrors({...temp, [e.target.name]:""})
        if(e.target.name==='firstName' && e.target.value!==''){
            const name = alphabetOnly(e.target.value)
            setObjValues ({...objValues,  [e.target.name]: name});
        }
        if(e.target.name==='lastName' && e.target.value!==''){
            const name = alphabetOnly(e.target.value)
            setObjValues ({...objValues,  [e.target.name]: name});
        }
        if(e.target.name==='middleName' && e.target.value!==''){
            const name = alphabetOnly(e.target.value)
            setObjValues ({...objValues,  [e.target.name]: name});
        } 
        // if((e.target.name !=='maritalStatusId' && e.target.value!=='5' )){//logic for marital status
        //     setHideNumChild(true)
        // }else{
        //     setHideNumChild(false)
        // } 
        if(e.target.name==='indexClientCode' && e.target.value!==''){
            async function getIndexClientCode() {
                const indexClientCode=e.target.value
                const response = await axios.get(`${baseUrl}hts/client/${indexClientCode}`,
                        { headers: {"Authorization" : `Bearer ${token}`, 'Content-Type': 'text/plain'} }
                    );
                if(response.data!=='Record Not Found'){
                    setclientCodeetail2("")
                    setclientCodeetail(response.data)
                    
                }else{
                    setclientCodeetail("")
                    setclientCodeetail2(response.data)
                }
            }
            getIndexClientCode();
        }         
        setObjValues ({...objValues,  [e.target.name]: e.target.value});            
    }
    //checkClientCode
    const checkClientCode = e => { 

            async function getIndexClientCode() {
                const indexClientCode=objValues.clientCode
                const response = await axios.get(`${baseUrl}hts/client/${indexClientCode}`,
                        { headers: {"Authorization" : `Bearer ${token}`, 'Content-Type': 'text/plain'} }
                    );
                if(response.data!=='Record Not Found'){
                    setClientCodeCheck("Client code already exist")
                }else{
                    setClientCodeCheck("")
                }
            }
            getIndexClientCode();
                              
    }
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
            objValues.age=age_now
            
            //setBasicInfo({...basicInfo, age: age_now});        
        } else {
            setObjValues({...objValues, age:  ""});
        }
        setObjValues ({...objValues,  [e.target.name]: e.target.value});
   
        setObjValues({...objValues, dob: e.target.value});
        if(objValues.age!=='' && objValues.age>=85){
            toggle()
        }
        
    }
    const handleDateOfBirthChange = (e) => {
        if (e.target.value == "Actual") {
            objValues.isDateOfBirthEstimated=false
            setAgeDisabled(true);
        } else if (e.target.value == "Estimated") {
            objValues.isDateOfBirthEstimated=true
            setAgeDisabled(false);
        }
    }
    const handleAgeChange = (e) => {
        if (!ageDisabled && e.target.value) {
            if(e.target.value!=='' && e.target.value>=85){
                toggle()
            }
            const currentDate = new Date();
            currentDate.setDate(15);
            currentDate.setMonth(5);
            const estDob = moment(currentDate.toISOString());
            const dobNew = estDob.add((e.target.value * -1), 'years');
            setObjValues({...objValues, dob: moment(dobNew).format("YYYY-MM-DD")});
            objValues.dob =moment(dobNew).format("YYYY-MM-DD")

        }
        setObjValues({...objValues, age: e.target.value});
    }
    //End of Date of Birth and Age handling 
    const checkPhoneNumberBasic=(e, inputName)=>{
        const limit = 10;
        setObjValues({...objValues,  [inputName]: e.slice(0, limit)});     
    }
    const alphabetOnly=(value)=>{
        const result = value.replace(/[^a-z]/gi, '');
        return result
    }
    /*****  Validation  */
    const validate = () => {
        //HTS FORM VALIDATION
            temp.typeCounseling = objValues.typeCounseling ? "" : "This field is required."
            temp.testingSetting = objValues.testingSetting ? "" : "This field is required."
            temp.targetGroup = objValues.targetGroup ? "" : "This field is required."
            temp.referredFrom = objValues.referredFrom ? "" : "This field is required."
            temp.previouslyTested = objValues.previouslyTested ? "" : "This field is required."
            temp.surname = objValues.surname ? "" : "This field is required."
            temp.sexId = objValues.sexId ? "" : "This field is required."
            //temp.maritalStatusId = objValues.maritalStatusId ? "" : "This field is required."
            temp.phoneNumber = objValues.phoneNumber ? "" : "This field is required."
           // temp.isDateOfBirthEstimated = objValues.isDateOfBirthEstimated ? "" : "This field is required."    
            temp.firstName = objValues.firstName ? "" : "This field is required."  
            //temp.dateOfRegistration = objValues.dateOfRegistration ? "" : "This field is required."   
            //temp.numChildren = objValues.numChildren ? "" : "This field is required."
            temp.address = objValues.address ? "" : "This field is required."
            temp.indexClient = objValues.indexClient ? "" : "This field is required."  
            temp.firstTimeVisit = objValues.firstTimeVisit ? "" : "This field is required." 
            temp.dateVisit = objValues.dateVisit ? "" : "This field is required."  
            temp.dob = objValues.dob ? "" : "This field is required."
            temp.age = objValues.age ? "" : "This field is required."              
                setErrors({ ...temp })
        return Object.values(temp).every(x => x == "")
    }
    const handleItemClick =(page, completedMenu)=>{
        props.handleItemClick(page)
        if(props.completed.includes(completedMenu)) {

        }else{
            props.setCompleted([...props.completed, completedMenu])
        }
    }

    const handleSubmit =(e)=>{
        e.preventDefault();
        const patientForm ={
            clientCode: objValues.clientCode,
            dateVisit: objValues.dateVisit,
            extra: {},
            firstTimeVisit: objValues.firstTimeVisit,
            indexClient: objValues.indexClient,
            numChildren: objValues.numChildren,
            numWives: objValues.numWives,
            personDto: {
                active: true,
                address: [
                {
                    city: "",
                    countryId: 1,
                    district: objValues.lga,
                    line: [
                    objValues.address
                    ],
                    organisationUnitId: "",
                    postalCode: "",
                    stateId: objValues.state
                }
                ],
                contact: [],
                contactPoint: [
                {
                    type: "",
                    value: ""
                }
                ],
                dateOfBirth: objValues.dob,
                dateOfRegistration:objValues.dateVisit,
                deceased: true,
                deceasedDateTime: null,
                educationId: "",
                employmentStatusId: "",
                facilityId: "",
                firstName:objValues.firstName,
                genderId:'', //objValues.genderId,
                id: "",
                identifier: [
                    {
                        "assignerId": 1,
                        "type": "HospitalNumber",
                        "value": objValues.clientCode
                    }
                ],
                isDateOfBirthEstimated: objValues.isDateOfBirthEstimated,
                maritalStatusId: objValues.maritalStatusId,
                organizationId:"",
                otherName: objValues.otherName,
                sexId: objValues.sexId,
                surname: objValues.surname
            },
            personId: "",
            hospitalNumber:objValues.clientCode,
            previouslyTested: objValues.previouslyTested,
            referredFrom: objValues.referredFrom,
            targetGroup: objValues.targetGroup,
            testingSetting: objValues.testingSetting,
            typeCounseling:objValues.typeCounseling,
            breastFeeding:objValues.breastFeeding,
            pregnant:objValues.pregnant,
            relationshipWithIndexClient:objValues.relationshipWithIndexClient
            }

            if(validate()){
            axios.post(`${baseUrl}hts`,patientForm,
            { headers: {"Authorization" : `Bearer ${token}`}},
            
            )
            .then(response => {
                setSaving(false);
                props.setPatientObj(response.data)
                toast.success("HTS Test successful");
                if(objValues.age>14){
                    handleItemClick('pre-test-counsel', 'basic' )
                }else{
                    handleItemClick('hiv-test', 'basic' )
                }
                

            })
            .catch(error => {
                setSaving(false);
                if(error.response && error.response.data){
                    let errorMessage = error.response.data.apierror && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
                    toast.error(errorMessage);
                }
                else{
                    toast.error("Something went wrong. Please try again...");
                }
            });
            }
    }


    return (
        <>  
        
            <Card className={classes.root}>
                <CardBody>   
                <h2 style={{color:'#000'}}>BASIC INFORMATION - CLIENT INTAKE FORM</h2>
                <br/>
                    <form >
                        <div className="row">
                             <div className="row">
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Target Group *</Label>
                                    <select
                                        className="form-control"
                                        name="targetGroup"
                                        id="targetGroup"
                                        onChange={handleInputChange}
                                        value={objValues.targetGroup}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        {kP.map((value) => (
                                            <option key={value.id} value={value.id}>
                                                {value.display}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.targetGroup !=="" ? (
                                        <span className={classes.error}>{errors.targetGroup}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                <Label for="">Client Code</Label>
                                <Input
                                    type="text"
                                    name="clientCode"
                                    id="clientCode"
                                    //value={Math.floor(Math.random() * 1093328)}
                                    value={objValues.clientCode}
                                    onBlur ={checkClientCode}
                                    onChange={handleInputChange}
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                   
                                />
                                {errors.clientCode !=="" ? (
                                    <span className={classes.error}>{errors.clientCode}</span>
                                ) : "" }
                                                                
                                </FormGroup>
                                {clientCodeCheck!=="" ? (
                                <span className={classes.error}>{clientCodeCheck}</span>
                            ) : "" }
                            </div>
                            {/* <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                <Label for=""> Date Of Registration </Label>
                                <Input
                                    type="date"
                                    name="dateOfRegistration"
                                    id="dateOfRegistration"
                                    value={objValues.dateOfRegistration}
                                    onChange={handleInputChange}
                                    max= {moment(new Date()).format("YYYY-MM-DD") }
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    
                                />
                                {errors.dateOfRegistration !=="" ? (
                                    <span className={classes.error}>{errors.dateOfRegistration}</span>
                                ) : "" }
                                </FormGroup>
                            </div> */}
                           </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Referred From *</Label>
                                    <select
                                        className="form-control"
                                        name="referredFrom"
                                        id="referredFrom"
                                        onChange={handleInputChange}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        {sourceReferral.map((value) => (
                                            <option key={value.id} value={value.id}>
                                                {value.display}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.referredFrom !=="" ? (
                                        <span className={classes.error}>{errors.referredFrom}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Setting*</Label>
                                    <select
                                        className="form-control"
                                        name="testingSetting"
                                        id="testingSetting"
                                        value={objValues.testingSetting}
                                        onChange={handleInputChange}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        {enrollSetting.map((value) => (
                                            <option key={value.id} value={value.id}>
                                                {value.display}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.testingSetting !=="" ? (
                                        <span className={classes.error}>{errors.testingSetting}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                <Label for="">Visit Date  </Label>
                                <Input
                                    type="date"
                                    name="dateVisit"
                                    id="dateVisit"
                                    value={objValues.dateVisit}
                                    onChange={handleInputChange}
                                    min="1983-12-31"
                                    max= {moment(new Date()).format("YYYY-MM-DD") }
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    
                                />
                                {errors.dateVisit !=="" ? (
                                    <span className={classes.error}>{errors.dateVisit}</span>
                                ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                <Label for="">First Name *</Label>
                                <Input
                                    type="text"
                                    name="firstName"
                                    id="firstName"
                                    value={objValues.firstName}
                                    onChange={handleInputChange}
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                   
                                />
                                 {errors.firstName !=="" ? (
                                    <span className={classes.error}>{errors.firstName}</span>
                                ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                <Label for="">Middle Name</Label>
                                <Input
                                    type="text"
                                    name="otherName"
                                    id="otherName"
                                    value={objValues.otherName}
                                    onChange={handleInputChange}
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    
                                />
                                 {errors.otherName !=="" ? (
                                        <span className={classes.error}>{errors.otherName}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                <Label for="">Last Name *</Label>
                                <Input
                                    type="text"
                                    name="surname"
                                    id="surname"
                                    value={objValues.surname}
                                    onChange={handleInputChange}
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                   
                                />
                                 {errors.surname !=="" ? (
                                        <span className={classes.error}>{errors.surname}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group mb-2 col-md-2">
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
                                                style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                            /> Actual
                                        </label>
                                    </div>
                                    <div className="radio">
                                        <label>
                                            <input
                                                type="radio"
                                                value="Estimated"
                                                name="dateOfBirth"
                                                
                                                onChange={(e) => handleDateOfBirthChange(e)}
                                                style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                            /> Estimated
                                        </label>
                                    </div>
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-3">
                                <FormGroup>
                                    <Label>Date</Label>
                                    <input
                                        className="form-control"
                                        type="date"
                                        name="dob"
                                        id="dob"
                                        min={objValues.dateVisit}
                                        max= {moment(new Date()).format("YYYY-MM-DD") }
                                        value={objValues.dob}
                                        onChange={handleDobChange}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    />
                                    
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-3">
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
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    />
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                <Label for="">Phone Number *</Label>
                                
                                    <PhoneInput
                                        containerStyle={{width:'100%',border: "1px solid #014D88"}}
                                        inputStyle={{width:'100%',borderRadius:'0px'}}
                                        country={'ng'}
                                        placeholder="(234)7099999999"
                                        minLength={10}
                                        name="phoneNumber"
                                        id="phoneNumber"
                                        masks={{ng: '...-...-....', at: '(....) ...-....'}}
                                        value={objValues.phoneNumber}
                                        onChange={(e)=>{checkPhoneNumberBasic(e,'phoneNumber')}}
                                        //onChange={(e)=>{handleInputChangeBasic(e,'phoneNumber')}}
                                    />
                                    {errors.phoneNumber !=="" ? (
                                        <span className={classes.error}>{errors.phoneNumber}</span>
                                        ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>State *</Label>
                                    <select
                                        className="form-control"
                                        name="state"
                                        id="state"
                                        onChange={getProvinces}
                                        value={objValues.state}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        {states.map((value) => (
                                            <option key={value.id} value={value.id}>
                                                {value.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.state !=="" ? (
                                        <span className={classes.error}>{errors.state}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>LGA *</Label>
                                    <select
                                        className="form-control"
                                        name="lga"
                                        id="lga"
                                        value={objValues.lga}
                                        onChange={handleInputChange}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        {provinces.map((value, index) => (
                                            <option key={index} value={value.id}>
                                                {value.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.lga !=="" ? (
                                        <span className={classes.error}>{errors.lga}</span>
                                    ) : "" }   
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Address *</Label>
                                    <Input
                                        type="textarea"
                                        name="address"
                                        id="address"
                                        value={objValues.address}
                                        onChange={handleInputChange}
                                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                   
                                    />
                                  {errors.address !=="" ? (
                                        <span className={classes.error}>{errors.address}</span>
                                    ) : "" }   
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Sex*</Label>
                                    <select
                                        className="form-control"
                                        name="sexId"
                                        id="sexId"
                                        value={objValues.sexId}
                                        onChange={handleInputChange}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        {sexs.map((value) => (
                                            <option key={value.id} value={value.id}>
                                                {value.display}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.sex !=="" ? (
                                        <span className={classes.error}>{errors.sex}</span>
                                    ) : "" }  
                                </FormGroup>
                            </div>
                            {/* {(objValues.targetGroup!=='457' && objValues.targetGroup!=="") && (
                            <div className="form-group  col-md-4">
                            <FormGroup>
                                <Label>Gender</Label>
                                <select
                                    className="form-control"
                                    name="genderId"
                                    id="genderId"
                                    value={objValues.genderId}
                                    onChange={handleInputChange}
                                    style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                >
                                    <option value={""}></option>
                                    {gender.map((value) => (
                                        <option key={value.id} value={value.id}>
                                            {value.display}
                                        </option>
                                    ))}
                                </select>
                               
                            </FormGroup>
                        </div>
                             )} */}
                         {objValues.age>9 && (
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Marital Status</Label>
                                    <select
                                        className="form-control"
                                        name="maritalStatusId"
                                        id="maritalStatusId"
                                        value={objValues.maritalStatusId}
                                        onChange={handleInputChange}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
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
                             {( objValues.age > 9 && objValues.sexId=='376') && (
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Number of wives/co-wives</Label>
                                    <Input
                                        type="number"
                                        name="numWives"
                                        min={0}
                                        id="numWives"
                                        value={objValues.numWives}
                                        onChange={handleInputChange}
                                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                   
                                    />
                                    
                                </FormGroup>
                            </div>
                            )}
                             {/* && objValues.maritalStatusId==='6' */}
                            {(objValues.age>9) && (
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Number of Children {'<5'} years</Label>
                                    <Input
                                        type="number"
                                        name="numChildren"
                                        id="numChildren"
                                        min={0}
                                        value={objValues.numChildren}
                                        onChange={handleInputChange}
                                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                   
                                    /> 
                                     
                                </FormGroup>
                            </div>
                            )}
                            {/* objValues.maritalStatusId==='6' && */}
                           
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Index Testing</Label>
                                    <select
                                        className="form-control"
                                        name="indexClient"
                                        id="indexClient"
                                        value={objValues.indexClient}
                                        onChange={handleInputChange}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="true">YES</option>
                                        <option value="false">NO</option>
                                    </select>
                                    {errors.indexClient !=="" ? (
                                        <span className={classes.error}>{errors.indexClient}</span>
                                    ) : "" }   
                                </FormGroup>
                            </div>
                            {objValues.indexClient==='true' && (
                            <>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Relationship of the index client</Label>
                                    <select
                                        className="form-control"
                                        name="relationshipWithIndexClient"
                                        id="relationshipWithIndexClient"
                                        value={objValues.relationshipWithIndexClient}
                                        onChange={handleInputChange}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
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
                                <Label>Index Client Code/ID</Label>
                                <Input
                                    type="text"
                                    name="indexClientCode"
                                    id="indexClientCode"
                                    value={objValues.indexClientCode}
                                    onChange={handleInputChange}
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}                               
                                />
                                  
                            </FormGroup>
                            {clientCodeetail2!=="" ? (
                                <span className={classes.error}>{clientCodeetail2}</span>
                            ) : "" }
                            {clientCodeetail!=="" ? (
                                <span className={classes.success}>{clientCodeetail}</span>
                            ) :""}
                            </div>
                            </>
                            )}
                            {objValues.sex==='377' && (
                            <>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Pregnant</Label>
                                    <select
                                        className="form-control"
                                        name="pregnant"
                                        id="pregnant"
                                        value={objValues.pregnant}
                                        onChange={handleInputChange}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        {pregnancyStatus.map((value) => (
                                            <option key={value.id} value={value.id}>
                                                {value.display}
                                            </option>
                                        ))}
                                        
                                    </select>
                                    
                                </FormGroup>
                            </div>

                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Breast Feeding</Label>
                                    <select
                                        className="form-control"
                                        name="breastFeeding"
                                        id="breastFeeding"
                                        value={objValues.breastFeeding}
                                        onChange={handleInputChange}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="true">YES</option>
                                        <option value="false">NO</option>
                                    </select>
                                    
                                </FormGroup>
                            </div>
                            </>
                            )}
                            
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>First time visit</Label>
                                    <select
                                        className="form-control"
                                        name="firstTimeVisit"
                                        id="firstTimeVisit"
                                        value={objValues.firstTimeVisit}
                                        onChange={handleInputChange}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="true">YES</option>
                                        <option value="false">NO</option>
                                        
                                    </select>
                                    {errors.firstTimeVisit !=="" ? (
                                        <span className={classes.error}>{errors.firstTimeVisit}</span>
                                    ) : "" }    
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Previously tested within the last 3 months</Label>
                                    <select
                                        className="form-control"
                                        name="previouslyTested"
                                        id="previouslyTested"
                                        value={objValues.previouslyTested}
                                        onChange={handleInputChange}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="true">YES</option>
                                        <option value="false">NO</option>
                                    </select>
                                    {errors.previouslyTested !=="" ? (
                                        <span className={classes.error}>{errors.previouslyTested}</span>
                                    ) : "" }    
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Type of Counseling</Label>
                                    <select
                                        className="form-control"
                                        name="typeCounseling"
                                        id="typeCounseling"
                                        value={objValues.typeCounseling}
                                        onChange={handleInputChange}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        {counselingType.map((value) => (
                                            <option key={value.id} value={value.id}>
                                                {value.display}
                                            </option>
                                        ))}
                                        
                                    </select>
                                    {errors.typeCounseling !=="" ? (
                                        <span className={classes.error}>{errors.typeCounseling}</span>
                                    ) : "" }   
                                </FormGroup>
                            </div>
                            
                            <br />
                            <div className="row">
                            <div className="form-group mb-3 col-md-6">
                            {/* <MatButton
                            type="button"
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            startIcon={<SaveIcon />}
                            //onClick={()=>handleItemClick('basic','others')}
                            style={{backgroundColor:"#014d88"}}
                            >
                            {!saving ? (
                            <span style={{ textTransform: "capitalize" }}>Save</span>
                            ) : (
                            <span style={{ textTransform: "capitalize" }}>Saving...</span>
                            )}
                            </MatButton> */}
                            <Button content='Next' type="submit" icon='right arrow' labelPosition='right' style={{backgroundColor:"#014d88", color:'#fff'}} onClick={handleSubmit}/>
                            </div>
                            </div>
                        </div>
                    </form>
                    
                </CardBody>
            </Card> 
            <Modal show={open} toggle={toggle} className="fade" size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
             <Modal.Header >
            <Modal.Title id="contained-modal-title-vcenter">
                Notification!
            </Modal.Title>
            </Modal.Header>
                <Modal.Body>
                    <h4>Are you Sure of the Age entered?</h4>
                    
                </Modal.Body>
            <Modal.Footer>
                <Button onClick={toggle} style={{backgroundColor:"#014d88", color:"#fff"}}>Yes</Button>
            </Modal.Footer>
            </Modal>                             
        </>
    );
};

export default BasicInfo