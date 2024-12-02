import React, { useEffect, useState } from "react";
import axios from "axios";
import { FormGroup, Label, CardBody, Spinner, Input, Form } from "reactstrap";
import * as moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import { Card } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
// import AddIcon from "@material-ui/icons/Add";
// import CancelIcon from "@material-ui/icons/Cancel";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { useHistory } from "react-router-dom";
// import {TiArrowBack} from 'react-icons/ti'
import { token, url as baseUrl } from "../../../../api";
import "react-phone-input-2/lib/style.css";
import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { getNextForm } from "../../../../utility";
//import PhoneInput from 'react-phone-input-2'
import "react-phone-input-2/lib/style.css";
import { Button } from "semantic-ui-react";
import { Modal } from "react-bootstrap";
import { Label as LabelRibbon, Message } from "semantic-ui-react";

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

const BasicInfo = (props) => {
  const classes = useStyles();
  //const history = useHistory();
  const [enrollSetting, setEnrollSetting] = useState([]);
  const [entryPoint, setEntryPoint] = useState([]);
  const [entryPointCommunity, setEntryPointCommunity] = useState([]);
  let riskCountQuestion = [];
  const [kP, setKP] = useState([]);
  const [errors, setErrors] = useState({});
  const [ageDisabled, setAgeDisabled] = useState(true);
  const [saving, setSaving] = useState(false);
  let temp = { ...errors };
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen(!open);
  const [setting, setSetting] = useState([]);
  const [riskCount, setRiskCount] = useState(0);
  const [isPMTCTModality, setIsPMTCTModality] = useState(false);
  const [showRiskAssessment, setShowRiskAssessment] = useState(false);
  const [permissions, setPermission] = useState(
    localStorage.getItem("stringifiedPermmision")?.split(",")
  );
  const [nextForm, setNextForm] = useState([]);
  const [targetGroupValue, setTargetGroupValue] = useState(null);
  const [objValues, setObjValues] = useState({
    age: "",
    dob: "",
    code: "",
    visitDate: "", //
    dateOfBirth: null,
    dateOfRegistration: null,
    isDateOfBirthEstimated: "",
    targetGroup: "",
    testingSetting: "", //
    modality: "", //
    careProvider: "",
    personId: "",
    id: "",
    riskAssessment: {},
    entryPoint: "",
    communityEntryPoint: "",
  });
  const [riskAssessment, setRiskAssessment] = useState({

    lastHivTestForceToHaveSex: "",
    lastHivTestHadAnal: "",
    lastHivTestInjectedDrugs: "",
    whatWasTheResult: "",
    lastHivTestDone: "",
    diagnosedWithTb: "",
    lastHivTestPainfulUrination: "",
    lastHivTestBloodTransfusion: "",
    lastHivTestVaginalOral: "",
    lastHivTestBasedOnRequest: "",
  });
  useEffect(() => {
    KP();
    TargetGroupSetup();
    EnrollmentSetting();
    EntryPoint();
    HTS_ENTRY_POINT_COMMUNITY();

if (objValues.age !== "") {
      props.setPatientObjAge(objValues.age);
    }
    if (props.patientObj.riskStratificationResponseDto !== null) {
      setObjValues(props.patientObj.riskStratificationResponseDto);
      SettingModality(
        props.patientObj.riskStratificationResponseDto.testingSetting
      );
      setRiskAssessment(
        props.patientObj.riskStratificationResponseDto.riskAssessment
      );
    }
  }, [objValues.age]);
  //Get list of HIV STATUS ENROLLMENT
  const EnrollmentSetting = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/TEST_SETTING`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        //console.log(response.data);
        setEnrollSetting(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  const EntryPoint = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/HTS_ENTRY_POINT`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        //console.log(response.data);
        setEntryPoint(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  const HTS_ENTRY_POINT_COMMUNITY = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/HTS_ENTRY_POINT_COMMUNITY`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        //console.log(response.data);
        setEntryPointCommunity(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  const TargetGroupSetup = () => {
    axios
      .get(`${baseUrl}account`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response.data);
        setTargetGroupValue(response.data);

        props.setOrganizationInfo(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  //Get list of KP
  const KP = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/TARGET_GROUP`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setKP(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };




  
  //Set HTS menu registration
  const getMenuLogic = () => {
    props.setHideOtherMenu(false);
  };

  const checkPMTCTModality = (modality) => {
    console.log("modality", modality);
    if (
      modality === "TEST_SETTING_CT_PMTCT" ||
      modality === "TEST_SETTING_OTHERS_PMTCT_(ANC1_ONLY)" ||
      modality === "TEST_SETTING_OTHERS_POST_ANC1_BREASTFEEDING" ||
      modality === "TEST_SETTING_OTHERS_POST_ANC1_PREGNANT_L&D" ||
      modality === "TEST_SETTING_STANDALONE_HTS_PMTCT_(ANC1_ONLY)" ||
      modality === "TEST_SETTING_STANDALONE_HTS_POST_ANC1_BREASTFEEDING" ||
      modality === "TEST_SETTING_STANDALONE_HTS_POST_ANC1_PREGNANT_L&D" ||
      modality === "PMTCT (Post ANC1: Pregnancy/L&D/BF)" ||
      modality === "Post ANC1 Pregnant/L&D ? 72hrs" ||
      modality ===
        "TEST_SETTING_STANDALONE_HTS_PMTCT_(POST_ANC1:_PREGNANCYL&DBF)" ||
      modality === "TEST_SETTING_OTHERS_PMTCT_(POST_ANC1:_PREGNANCYL&DBF)" ||
      modality ===
        "TEST_SETTING_STANDALONE_HTS_POST_ANC1_PREGNANT_L&D ? 72hrs"   
        ||
        modality ===
          "TEST_SETTING_STANDALONE_HTS_POST_ANC1_PREGNANT_L&D < 72hrs"   
          ||
          modality ===
            "TEST_SETTING_STANDALONE_HTS_POST_ANC1_PREGNANT_L&D > 72hrs"  
 
    ) {
      console.log("it is PMTCT MODALITY ");
      setErrors({...errors,
        lastHivTestDone: "",
        whatWasTheResult: "",
        lastHivTestVaginalOral: "",
        lastHivTestBloodTransfusion: "",
        lastHivTestPainfulUrination: "",
        diagnosedWithTb: "",
        lastHivTestInjectedDrugs: "",
        lastHivTestHadAnal: "",
        lastHivTestForceToHaveSex: "",
       })
      setIsPMTCTModality(true);
      return true;
    } else {
      console.log("it is NOT pmtct modality ");

      setIsPMTCTModality(false);
      return false;
    }
  };

  const handleInputChange = (e) => {
    setErrors({ ...temp, [e.target.name]: "" });
    if (e.target.name === "testingSetting" && e.target.value !== "") {
      SettingModality(e.target.value);
      setObjValues({ ...objValues, [e.target.name]: e.target.value });
    }
    if (e.target.name === "modality" && e.target.value !== "") {
      //SettingModality(e.target.value)
      if (e.target.value === "TEST_SETTING_STANDALONE_HTS_PMTCT_(ANC1_ONLY)") {
        setRiskCount(1);
        setObjValues({ ...objValues, [e.target.name]: e.target.value });
      } else if (e.target.value === "TEST_SETTING_STANDALONE_HTS_EMERGENCY") {
        //setRiskCount(1)
        setObjValues({ ...objValues, [e.target.name]: e.target.value });
      } else if (e.target.value === "TEST_SETTING_STANDALONE_HTS_INDEX") {
        setRiskCount(1);
        setObjValues({ ...objValues, [e.target.name]: e.target.value });
      } else if (
        e.target.value ===
        "TEST_SETTING_STANDALONE_HTS_PMTCT_(POST_ANC1:_PREGNANCYL&DBF)"
      ) {
        setRiskCount(1);
        setObjValues({ ...objValues, [e.target.name]: e.target.value });
      } else if (e.target.value === "TEST_SETTING_STANDALONE_HTS_STI") {
        setRiskCount(1);
        setObjValues({ ...objValues, [e.target.name]: e.target.value });
      } else if (e.target.value === "TEST_SETTING_STANDALONE_HTS_TB") {
        setRiskCount(1);
        setObjValues({ ...objValues, [e.target.name]: e.target.value });
      } else if (e.target.value === "TEST_SETTING_CT_STI") {
        setRiskCount(1);
        setObjValues({ ...objValues, [e.target.name]: e.target.value });
      } else if (e.target.value === "TEST_SETTING_CT_PMTCT") {
        setRiskCount(1);
        setObjValues({ ...objValues, [e.target.name]: e.target.value });
      } else if (e.target.value === "TEST_SETTING_CT_TB") {
        setRiskCount(1);
        setObjValues({ ...objValues, [e.target.name]: e.target.value });
      } else if (e.target.value === "TEST_SETTING_TB_TB") {
        setRiskCount(1);
        setObjValues({ ...objValues, [e.target.name]: e.target.value });
      } else if (e.target.value === "TEST_SETTING_STI_STI") {
        setRiskCount(1);
        setObjValues({ ...objValues, [e.target.name]: e.target.value });
      } else if (e.target.value === "TEST_SETTING_OPD_STI") {
        //setRiskCount(1)
        setObjValues({ ...objValues, [e.target.name]: e.target.value });
      } else if (e.target.value === "TEST_SETTING_OUTREACH_INDEX") {
        setRiskCount(1);
        setObjValues({ ...objValues, [e.target.name]: e.target.value });
      } else {
        setRiskCount(0);
        setObjValues({ ...objValues, [e.target.name]: e.target.value });
      }

      let ans = checkPMTCTModality(e.target.value);

      console.log("answerrrr", ans);
      displayRiskAssessment(
        riskAssessment.lastHivTestBasedOnRequest,
        objValues.age,
        ans
      );
    }

    setObjValues({ ...objValues, [e.target.name]: e.target.value });
  };

  // display risk assement function

  const displayRiskAssessment = (lastVisit, age, isPMTCTModalityValue) => {
    let SecAge = age !== "" ? age : 0;
    let ans;

    // for the section to show
    //  Conditions are : age > 15, riskAssessment.lastHivTestBasedOnRequest === "false" and PMTCT Modality === true
    if (lastVisit === "false") {
      if (SecAge > 15 && isPMTCTModalityValue) {
        setShowRiskAssessment(false);
        ans = false;
      } else if (SecAge > 15) {
        setShowRiskAssessment(true);
        ans = true;
      } else {
        setShowRiskAssessment(false);
        ans = false;
      }
    } else {
      setShowRiskAssessment(false);
      ans = false;
    }
    console.log("This is the answer", ans);
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
      objValues.age = age_now;
      displayRiskAssessment(
        riskAssessment.lastHivTestBasedOnRequest,
        age_now,
        isPMTCTModality
      );
      //setBasicInfo({...basicInfo, age: age_now});
    } else {
      setObjValues({ ...objValues, age: "" });
    }
    setObjValues({ ...objValues, [e.target.name]: e.target.value });
  };
  const handleDateOfBirthChange = (e) => {
    if (e.target.value == "Actual") {
      objValues.isDateOfBirthEstimated = false;
      setAgeDisabled(true);
    } else if (e.target.value == "Estimated") {
      objValues.isDateOfBirthEstimated = true;
      setAgeDisabled(false);
    }
  };
  const handleAgeChange = (e) => {
    displayRiskAssessment(
      riskAssessment.lastHivTestBasedOnRequest,
      e.target.value,
      isPMTCTModality
    );

    if (!ageDisabled && e.target.value) {
      if (e.target.value !== "" && e.target.value >= 85) {
        toggle();
      }
     

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
  //Get list of DSD Model Type
  function SettingModality(settingId) {
    const setting = settingId;
    axios
      .get(`${baseUrl}application-codesets/v2/${setting}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setSetting(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  }
  //End of Date of Birth and Age handling
  /*****  Validation  */
  const validate = () => {
    //HTS FORM VALIDATION

    temp.visitDate = objValues.visitDate ? "" : "This field is required.";
    temp.entryPoint = objValues.entryPoint ? "" : "This field is required.";
    temp.testingSetting = objValues.testingSetting
      ? ""
      : "This field is required.";
    temp.entryPoint = objValues.entryPoint ? "" : "This field is required.";
    temp.modality = objValues.modality ? "" : "This field is required.";
  //  
    temp.dob = objValues.dob ? "" : "This field is required.";
    temp.age = objValues.age ? "" : "This field is required.";
    // 
    temp.lastHivTestBasedOnRequest = riskAssessment.lastHivTestBasedOnRequest
      ? ""
      : "This field is required.";

    objValues.age > 15 &&
      (temp.targetGroup = objValues.targetGroup
        ? ""
        : "This field is required.");
    objValues.entryPoint !== "" &&
      objValues.entryPoint === "HTS_ENTRY_POINT_COMMUNITY" &&
      (temp.communityEntryPoint = objValues.communityEntryPoint
        ? ""
        : "This field is required.");

    //Risk Assement section
    if (
      objValues.age > 15 &&
      riskAssessment.lastHivTestBasedOnRequest === "false" &&
      showRiskAssessment
    ) {
      temp.lastHivTestDone = riskAssessment.lastHivTestDone
        ? ""
        : "This field is required.";
      riskAssessment.lastHivTestDone !== "" &&
        riskAssessment.lastHivTestDone !== "Never" &&
        (temp.whatWasTheResult = riskAssessment.whatWasTheResult
          ? ""
          : "This field is required.");

      temp.lastHivTestVaginalOral = riskAssessment.lastHivTestVaginalOral
        ? ""
        : "This field is required.";

      temp.lastHivTestBloodTransfusion =
        riskAssessment.lastHivTestBloodTransfusion
          ? ""
          : "This field is required.";

      temp.lastHivTestPainfulUrination =
        riskAssessment.lastHivTestPainfulUrination
          ? ""
          : "This field is required.";

      temp.diagnosedWithTb = riskAssessment.diagnosedWithTb
        ? ""
        : "This field is required.";

      temp.lastHivTestInjectedDrugs = riskAssessment.lastHivTestInjectedDrugs
        ? ""
        : "This field is required.";

      temp.lastHivTestHadAnal = riskAssessment.lastHivTestHadAnal
        ? ""
        : "This field is required.";

      temp.lastHivTestForceToHaveSex = riskAssessment.lastHivTestForceToHaveSex
        ? ""
        : "This field is required.";
    }

    setErrors({ ...temp });
    return Object.values(temp).every((x) => x == "");
  };

  const handleItemClick = (page, completedMenu) => {
    props.handleItemClick(page);
    if (props.completed.includes(completedMenu)) {
    } else {
      props.setCompleted([...props.completed, completedMenu]);
    }
  };
  // Getting the number count of riskAssessment True
  const actualRiskCountTrue = Object.values(riskAssessment);
  riskCountQuestion = actualRiskCountTrue.filter((x) => x === "true");

  const handleInputChangeRiskAssessment = (e) => {
    displayRiskAssessment(e.target.value, objValues.age, isPMTCTModality);

    setErrors({ ...temp, [e.target.name]: "" });
    setRiskAssessment({ ...riskAssessment, [e.target.name]: e.target.value });
  };


  const handleInputChangeRiskAssessment2 = (e) => {
    setErrors({ ...temp, [e.target.name]: "" });
    setRiskAssessment({ ...riskAssessment, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // get next form
    let newModality = isPMTCTModality ? "skip" : "fill";

  let latestForm =  getNextForm("Risk_Stratification", objValues.age, newModality, "unknown")
 
    getMenuLogic(objValues);
    props.patientObj.riskStratificationResponseDto = objValues;
    props.patientObj.personResponseDto.dob = objValues.dob;
    props.patientObj.personResponseDto.dateOfBirth = objValues.dob;
    props.patientObj.personResponseDto.isDateOfBirthEstimated =
      objValues.isDateOfBirthEstimated;
    props.patientObj.targetGroup = objValues.targetGroup;
    props.patientObj.testingSetting = objValues.testingSetting;
    props.patientObj.modality = objValues.modality;
    props.patientObj.dateVisit = objValues.visitDate;

    //props.patientObj.riskAssessment =riskAssessment
    objValues.riskAssessment = riskAssessment;

    console.log(props.completed)
    //Check if riskStratificationResponseDto is null or empty then call the update method
    if (
      props.patientObj.riskStratificationResponseDto &&
      props.patientObj.riskStratificationResponseDto !== null &&
      props.patientObj.riskStratificationResponseDto.id !== ""
    ) {
      if (validate()) {
        setSaving(true);

        props.setHideOtherMenu(false);
        axios
          .put(
            `${baseUrl}risk-stratification/${props.patientObj.riskStratificationResponseDto.id}`,
            objValues,
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then((response) => {
            setSaving(false);
            props.patientObj.riskStratificationResponseDto = response.data;
            objValues.code = response.data.code;
            props.setExtra(objValues);
            handleItemClick(latestForm[0], latestForm[1]);

            toast.success("Risk stratification save succesfully!");
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
    } else {
      //if riskStratificationResponseDto is null then make a new call to save the record
      if (
        (riskCount > 0 || riskCountQuestion.length > 0) &&
        objValues.age > 15
      ) {
        if (validate()) {
          setSaving(true);

          props.setHideOtherMenu(false);
          axios
            .post(`${baseUrl}risk-stratification`, objValues, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
              setSaving(false);
              props.patientObj.riskStratificationResponseDto = response.data;
              objValues.code = response.data.code;
              props.setExtra(objValues);
              console.log("nextForm", nextForm);

              handleItemClick(latestForm[0], latestForm[1]);

              toast.success("Risk stratification save succesfully!");
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
        } else {
          toast.error("All fields are required", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      } else if (objValues.age < 15) {
        if (validate()) {
          setSaving(true);
          axios
            .post(`${baseUrl}risk-stratification`, objValues, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
              setSaving(false);
              props.patientObj.riskStratificationResponseDto = response.data;
              objValues.code = response.data.code;
              props.setExtra(objValues);
              handleItemClick(latestForm[0], latestForm[1]);
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
        } else {
          toast.error("All fields are required", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      } else {
        props.setHideOtherMenu(false);
        props.setExtra(objValues);
        if (validate()) {
          setSaving(true);
          axios
            .post(`${baseUrl}risk-stratification`, objValues, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
              setSaving(false);
              props.patientObj.riskStratificationResponseDto = response.data;
              objValues.code = response.data.code;
              props.setExtra(objValues);
              toast.success("Risk stratification save succesfully!");
              handleItemClick(latestForm[0], latestForm[1]);
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
        } else {
          toast.error("All fields are required", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      }
    }
  };

  return (
    <>
      <Card className={classes.root}>
        <CardBody>
          <h2 style={{ color: "#000" }}>RISK STRATIFICATION</h2>
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
                Modality
              </div>
              <div className="row">
                <div className="form-group  col-md-6">
                  <FormGroup>
                    <Label>
                      Entry Point <span style={{ color: "red" }}> *</span>
                    </Label>
                    <select
                      className="form-control"
                      name="entryPoint"
                      id="entryPoint"
                      value={objValues.entryPoint}
                      onChange={handleInputChange}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.2rem",
                      }}
                    >
                      <option value={""}>Select</option>
                      {entryPoint.map((value) => (
                        <option key={value.id} value={value.code}>
                          {value.display}
                        </option>
                      ))}
                    </select>
                    {errors.entryPoint !== "" ? (
                      <span className={classes.error}>{errors.entryPoint}</span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </div>
                {objValues.entryPoint === "HTS_ENTRY_POINT_COMMUNITY" && (
                  <div className="form-group  col-md-6">
                    <FormGroup>
                      <Label>
                        Community Entry Point{" "}
                        <span style={{ color: "red" }}> *</span>
                      </Label>
                      <select
                        className="form-control"
                        name="communityEntryPoint"
                        id="communityEntryPoint"
                        value={objValues.communityEntryPoint}
                        onChange={handleInputChange}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      >
                        <option value={""}>Select</option>
                        {entryPointCommunity.map((value) => (
                          <option key={value.id} value={value.code}>
                            {value.display}
                          </option>
                        ))}
                      </select>
                      {errors.communityEntryPoint !== "" ? (
                        <span className={classes.error}>
                          {errors.communityEntryPoint}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>
                )}
                <div className="form-group mb-3 col-md-6">
                  <FormGroup>
                    <Label for="">
                      Visit Date <span style={{ color: "red" }}> *</span>{" "}
                    </Label>
                    <Input
                      type="date"                       onKeyPress={(e)=>{e.preventDefault()}}

                      name="visitDate"
                      id="visitDate"
                      value={objValues.visitDate}
                      onChange={handleInputChange}
                      min="1929-12-31"
                      max={moment(new Date()).format("YYYY-MM-DD")}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.25rem",
                      }}
                    />
                    {errors.visitDate !== "" ? (
                      <span className={classes.error}>{errors.visitDate}</span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group  col-md-6">
                  <FormGroup>
                    <Label>
                      Setting <span style={{ color: "red" }}> *</span>
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
                    >
                      <option value={""} key={0}>
                        {" "}
                        Select
                      </option>
                      {objValues.communityEntryPoint ===
                        "HTS_ENTRY_POINT_COMMUNITY_CPMTCT" &&
                      objValues.entryPoint === "HTS_ENTRY_POINT_COMMUNITY"
                        ? enrollSetting.map((value) =>
                            value.code === "TEST_SETTING_CPMTCT" ? (
                              <option key={value.id} value={value.code}>
                                {value.display}
                              </option>
                            ) : (
                              <></>
                            )
                          )
                        : enrollSetting.map((value) => (
                            <option key={value.id} value={value.code}>
                              {value.display}
                            </option>
                          ))}
                      {/* <option value="TEST_SETTING_CT">CT</option>
                                        <option value="TEST_SETTING_TB">TB</option>
                                        <option value="TEST_SETTING_STI">STI</option>
                                        <option value="TEST_SETTING_OPD">OPD</option>
                                        <option value="TEST_SETTING_WARD">WARD</option>
                                        <option value="TEST_SETTING_STANDALONE_HTS">STANDALONE HTS</option>
                                        
                                        <option value="TEST_SETTING_FP">FP</option>
                                        <option value="TEST_SETTING_OUTREACH">OUTREACH</option>
                                        <option value="TEST_SETTING_OTHERS">OTHERS</option> */}
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
                <div className="form-group  col-md-6">
                  <FormGroup>
                    <Label>
                      Modality <span style={{ color: "red" }}> *</span>
                    </Label>
                    <select
                      className="form-control"
                      name="modality"
                      id="modality"
                      value={objValues.modality}
                      onChange={handleInputChange}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.2rem",
                      }}
                    >
                      <option value={""}>Select</option>
                      {setting.map((value) => (
                        <option key={value.code} value={value.code}>
                          {value.display}
                        </option>
                      ))}
                    </select>
                    {errors.modality !== "" ? (
                      <span className={classes.error}>{errors.modality}</span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </div>
              </div>
              <br />

              <div className="form-group  col-md-4">
                <FormGroup>
                  <Label>
                    Target Group <span style={{ color: "red" }}> *</span>
                  </Label>
                  <select
                    className="form-control"
                    name="targetGroup"
                    id="targetGroup"
                    onChange={handleInputChange}
                    value={objValues.targetGroup}
                    style={{
                      border: "1px solid #014D88",
                      borderRadius: "0.2rem",
                    }}
                  >
                    <option value={""}></option>
                    {kP.map((value) => (
                      <option key={value.id} value={value.code}>
                        {value.display}
                      </option>
                    ))}
                  </select>
                  {errors.targetGroup !== "" ? (
                    <span className={classes.error}>{errors.targetGroup}</span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </div>
              <div className="form-group mb-2 col-md-2">
                <FormGroup>
                  <Label>
                    Date Of Birth <span style={{ color: "red" }}> *</span>
                  </Label>
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
              <div className="form-group mb-3 col-md-3">
                <FormGroup>
                  <Label>
                    Date <span style={{ color: "red" }}> *</span>
                  </Label>
                  <input
                    className="form-control"
                    type="date"                       onKeyPress={(e)=>{e.preventDefault()}}

                    name="dob"
                    id="dob"
                    min="1929-12-31"
                    max={moment(new Date()).format("YYYY-MM-DD")}
                    value={objValues.dob}
                    onChange={handleDobChange}
                    style={{
                      border: "1px solid #014D88",
                      borderRadius: "0.2rem",
                    }}
                  />
                  {errors.dob !== "" ? (
                    <span className={classes.error}>{errors.dob}</span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </div>
              <div className="form-group mb-3 col-md-3">
                <FormGroup>
                  <Label>
                    Age <span style={{ color: "red" }}> *</span>
                  </Label>
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
                  {errors.age !== "" ? (
                    <span className={classes.error}>{errors.age}</span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </div>
              <div className="form-group  col-md-6">
                <FormGroup>
                  <Label>
                    Is this HIV test based on a Clinician/Doctor/Health Care
                    Provider's request ?{" "}
                    <span style={{ color: "red" }}> *</span>
                  </Label>
                  <select
                    className="form-control"
                    name="lastHivTestBasedOnRequest"
                    id="lastHivTestBasedOnRequest"
                    value={riskAssessment.lastHivTestBasedOnRequest}
                    onChange={handleInputChangeRiskAssessment}
                    style={{
                      border: "1px solid #014D88",
                      borderRadius: "0.2rem",
                    }}
                  >
                    <option value={""}>Select</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                  {errors.lastHivTestBasedOnRequest !== "" ? (
                    <span className={classes.error}>
                      {errors.lastHivTestBasedOnRequest}
                    </span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </div>
              <br />

              {showRiskAssessment && (
                <>
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
                    HIV Risk Assessment (Last 3 months)
                  </div>

                  <div className="form-group  col-md-4">
                    <FormGroup>
                      <Label>
                        When was your last HIV test done?{" "}
                        <span style={{ color: "red" }}> *</span>{" "}
                      </Label>
                      <select
                        className="form-control"
                        name="lastHivTestDone"
                        id="lastHivTestDone"
                        value={riskAssessment.lastHivTestDone}
                        onChange={handleInputChangeRiskAssessment2}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      >
                        <option value={""}></option>
                        <option value="<1"> {"< 1"} month</option>
                        <option value="1-3 Months">1-3 Months</option>
                        <option value="4-6 Months">4-6 Months</option>
                        <option value=">6 Months"> {">6"} Months</option>
                        <option value="Never">Never</option>
                      </select>
                      {errors.lastHivTestDone !== "" ? (
                        <span className={classes.error}>
                          {errors.lastHivTestDone}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>
                  {riskAssessment.lastHivTestDone !== "" &&
                    riskAssessment.lastHivTestDone !== "Never" && (
                      <div className="form-group  col-md-4">
                        <FormGroup>
                          <Label>
                            What was the result?{" "}
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          <select
                            className="form-control"
                            name="whatWasTheResult"
                            id="whatWasTheResult"
                            value={riskAssessment.whatWasTheResult}
                            onChange={handleInputChangeRiskAssessment2}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          >
                            <option value={""}></option>
                            <option value="Positive">Positive</option>
                            <option value="Negative">Negative</option>
                          </select>
                          {errors.whatWasTheResult !== "" ? (
                            <span className={classes.error}>
                              {errors.whatWasTheResult}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                    )}
                  <div className="form-group  col-md-4">
                    <FormGroup>
                      <Label>
                        Since your last HIV test, have you had anal or vaginal
                        or oral sex without a condom with someone who was HIV
                        positive or unaware of their HIV status?{" "}
                        <span style={{ color: "red" }}> *</span>
                      </Label>
                      <select
                        className="form-control"
                        name="lastHivTestVaginalOral"
                        id="lastHivTestVaginalOral"
                        value={riskAssessment.lastHivTestVaginalOral}
                        onChange={handleInputChangeRiskAssessment2}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      >
                        <option value={""}></option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                      {errors.lastHivTestVaginalOral !== "" ? (
                        <span className={classes.error}>
                          {errors.lastHivTestVaginalOral}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group  col-md-4">
                    <FormGroup>
                      <Label>
                        Since your last HIV test, have you had a blood or blood
                        product transfusion?{" "}
                        <span style={{ color: "red" }}> *</span>{" "}
                      </Label>
                      <select
                        className="form-control"
                        name="lastHivTestBloodTransfusion"
                        id="lastHivTestBloodTransfusion"
                        value={riskAssessment.lastHivTestBloodTransfusion}
                        onChange={handleInputChangeRiskAssessment2}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      >
                        <option value={""}></option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                      {errors.lastHivTestBloodTransfusion !== "" ? (
                        <span className={classes.error}>
                          {errors.lastHivTestBloodTransfusion}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group  col-md-4">
                    <FormGroup>
                      <Label>
                        Since your last HIV test, have you experienced painful
                        urination, lower abdominal pain, vaginal or penile
                        discharge, pain during sexual intercourse, thick,
                        cloudy, or foul smelling discharge and/or small bumps or
                        blisters near the mouth, penis, vagina, or anal areas?{" "}
                        <span style={{ color: "red" }}> *</span>
                      </Label>
                      <select
                        className="form-control"
                        name="lastHivTestPainfulUrination"
                        id="lastHivTestPainfulUrination"
                        value={riskAssessment.lastHivTestPainfulUrination}
                        onChange={handleInputChangeRiskAssessment2}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      >
                        <option value={""}></option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                      {errors.lastHivTestPainfulUrination !== "" ? (
                        <span className={classes.error}>
                          {errors.lastHivTestPainfulUrination}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group  col-md-4">
                    <FormGroup>
                      <Label>
                        Have you been diagnosed with TB or currently have any of
                        the following symptoms : cough, fever, weight loss,
                        night sweats? <span style={{ color: "red" }}> *</span>
                      </Label>
                      <select
                        className="form-control"
                        name="diagnosedWithTb"
                        id="diagnosedWithTb"
                        value={riskAssessment.diagnosedWithTb}
                        onChange={handleInputChangeRiskAssessment2}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      >
                        <option value={""}></option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                      {errors.diagnosedWithTb !== "" ? (
                        <span className={classes.error}>
                          {errors.diagnosedWithTb}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group  col-md-4">
                    <FormGroup>
                      <Label>
                        Since your last HIV test, have you ever injected drugs,
                        shared needles or other sharp objects with someone known
                        to be HIV positive or who you didn’t know their HIV
                        status? <span style={{ color: "red" }}> *</span>
                      </Label>
                      <select
                        className="form-control"
                        name="lastHivTestInjectedDrugs"
                        //id="sexUnderInfluence"
                        value={riskAssessment.lastHivTestInjectedDrugs}
                        onChange={handleInputChangeRiskAssessment2}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      >
                        <option value={""}></option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                      {errors.lastHivTestInjectedDrugs !== "" ? (
                        <span className={classes.error}>
                          {errors.lastHivTestInjectedDrugs}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group  col-md-4">
                    <FormGroup>
                      <Label>
                        Since your last HIV test, have you had anal, oral or
                        vaginal sex in exchange for money or other benefits?{" "}
                        <span style={{ color: "red" }}> *</span>
                      </Label>
                      <select
                        className="form-control"
                        name="lastHivTestHadAnal"
                        id="lastHivTestHadAnal"
                        value={riskAssessment.lastHivTestHadAnal}
                        onChange={handleInputChangeRiskAssessment2}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      >
                        <option value={""}></option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                      {errors.lastHivTestHadAnal !== "" ? (
                        <span className={classes.error}>
                          {errors.lastHivTestHadAnal}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group  col-md-4">
                    <FormGroup>
                      <Label>
                        Since your last HIV test, have you been forced to have
                        sex? <span style={{ color: "red" }}> *</span>
                      </Label>
                      <select
                        className="form-control"
                        name="lastHivTestForceToHaveSex"
                        value={riskAssessment.lastHivTestForceToHaveSex}
                        onChange={handleInputChangeRiskAssessment2}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      >
                        <option value={""}></option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                      {errors.lastHivTestForceToHaveSex !== "" ? (
                        <span className={classes.error}>
                          {errors.lastHivTestForceToHaveSex}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>
                  <br />
                </>
              )}
              <br />
              <Message warning>
                <h4> Risk assessment score </h4>
                <b>
                  Score :
                  {riskCount +
                    (objValues.age > 14 ? riskCountQuestion.length : 0)}
                </b>
              </Message>
              <hr />
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
          </form>
        </CardBody>
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

export default BasicInfo;
