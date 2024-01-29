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
import ServicesProvided from "./ServicesProvided";
import RefferralUnit from "./RefferalUnit";
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

const ClientRefferalForm = (props) => {
  const classes = useStyles();

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
  const [hospitalNumStatus, setHospitalNumStatus] = useState(false);
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [riskCount, setRiskCount] = useState(0);
  const [states, setStates] = useState([]);
  const [genders, setGenders] = useState([]);
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
    // everHadSexualIntercourse:"",
    // bloodtransInlastThreeMonths:"",
    // uprotectedSexWithCasualLastThreeMonths:"",
    // uprotectedSexWithRegularPartnerLastThreeMonths:"",
    // unprotectedVaginalSex:"",
    // uprotectedAnalSex:"",
    // stiLastThreeMonths:"",
    // sexUnderInfluence :"",
    // moreThanOneSexPartnerLastThreeMonths:"",
    // experiencePain:"",
    // haveSexWithoutCondom:"",
    // abuseDrug:"",
    // bloodTransfusion:"",
    // consistentWeightFeverNightCough:"",
    // soldPaidVaginalSex:"",
    //New Question
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

  const [payload, setPayload] = useState({
    referralDate: "",
    firstName: "",
    countryId: "1",
    hivStatus: "",
  });
  const loadGenders = useCallback(async () => {
    try {
      const response = await axios.get(
        `${baseUrl}application-codesets/v2/SEX`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGenders(response.data);
    } catch (e) {}
  }, []);
  useEffect(() => {
    loadGenders();
    GetCountry();
    setStateByCountryId();
    KP();
    TargetGroupSetup();
    EnrollmentSetting();
    EntryPoint();
    HTS_ENTRY_POINT_COMMUNITY();
    //objValues.dateVisit=moment(new Date()).format("YYYY-MM-DD")
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

  const alphabetOnly = (value) => {
    const result = value.replace(/[^a-z]/gi, "");
    return result;
  };

  //Get list of State
  const setStateByCountryId = () => {
    axios
      .get(`${baseUrl}organisation-units/parent-organisation-units/1`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // console.log(response.data);
        setStates(response.data);
      })
      .catch((error) => {});
  };
  const checkPhoneNumberBasic = (e, inputName) => {
    console.log(e, inputName);
    if (e) {
      setErrors({ ...errors, phoneNumber: "" });
    }
    const limit = 10;
    setPayload({ ...payload, phoneNumber: e.slice(0, limit) });
  };

  //fetch province
  const getProvinces = (e) => {
    const stateId = e.target.value;
    if (e.target.value) {
      setErrors({ ...errors, stateId: "" });
    }
    setPayload({ ...payload, stateId: e.target.value });
    axios
      .get(
        `${baseUrl}organisation-units/parent-organisation-units/${stateId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setProvinces(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  const GetCountry = () => {
    axios
      .get(`${baseUrl}organisation-units/parent-organisation-units/0`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {});
  };

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
  const handleInputChange = (e) => {
    setErrors({ ...temp, [e.target.name]: "" });

    if (e.target.name === "firstName" && e.target.value !== "") {
      const name = alphabetOnly(e.target.value);
      setPayload({ ...payload, [e.target.name]: name });
    }
    if (e.target.name === "lastName" && e.target.value !== "") {
      const name = alphabetOnly(e.target.value);
      setPayload({ ...payload, [e.target.name]: name });
    }
    if (e.target.name === "middleName" && e.target.value !== "") {
      const name = alphabetOnly(e.target.value);
      setPayload({ ...payload, [e.target.name]: name });
    }

    if (e.target.name === "hospitalNumber" && e.target.value !== "") {
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
    }
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
    }

    setObjValues({ ...objValues, [e.target.name]: e.target.value });
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

      //setpayload({...payload, age: age_now});
    } else {
      setObjValues({ ...objValues, age: "" });
    }
    setObjValues({ ...objValues, [e.target.name]: e.target.value });

    setObjValues({ ...objValues, dob: e.target.value });
    if (objValues.age !== "" && objValues.age <= 15) {
      props.setHideOtherMenu(true);
    } else if (objValues.age !== "" && objValues.age > 15) {
      props.setHideOtherMenu(true);
    } else {
      props.setHideOtherMenu(true);
    }

    if (objValues.age !== "" && objValues.age >= 85) {
      toggle();
    }
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
    temp.dob = objValues.dob ? "" : "This field is required.";
    temp.age = objValues.age ? "" : "This field is required.";
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
    objValues.age > 15 &&
      riskAssessment.lastHivTestBasedOnRequest === "false" &&
      (temp.lastHivTestDone = riskAssessment.lastHivTestDone
        ? ""
        : "This field is required.");
    riskAssessment.lastHivTestDone !== "" &&
      riskAssessment.lastHivTestDone !== "Never" &&
      (temp.whatWasTheResult = riskAssessment.whatWasTheResult
        ? ""
        : "This field is required.");
    objValues.age > 15 &&
      riskAssessment.lastHivTestBasedOnRequest === "false" &&
      (temp.lastHivTestVaginalOral = riskAssessment.lastHivTestVaginalOral
        ? ""
        : "This field is required.");
    objValues.age > 15 &&
      riskAssessment.lastHivTestBasedOnRequest === "false" &&
      (temp.lastHivTestBloodTransfusion =
        riskAssessment.lastHivTestBloodTransfusion
          ? ""
          : "This field is required.");
    objValues.age > 15 &&
      riskAssessment.lastHivTestBasedOnRequest === "false" &&
      (temp.lastHivTestPainfulUrination =
        riskAssessment.lastHivTestPainfulUrination
          ? ""
          : "This field is required.");
    objValues.age > 15 &&
      riskAssessment.lastHivTestBasedOnRequest === "false" &&
      (temp.diagnosedWithTb = riskAssessment.diagnosedWithTb
        ? ""
        : "This field is required.");
    objValues.age > 15 &&
      riskAssessment.lastHivTestBasedOnRequest === "false" &&
      (temp.lastHivTestInjectedDrugs = riskAssessment.lastHivTestInjectedDrugs
        ? ""
        : "This field is required.");
    objValues.age > 15 &&
      riskAssessment.lastHivTestBasedOnRequest === "false" &&
      (temp.lastHivTestHadAnal = riskAssessment.lastHivTestHadAnal
        ? ""
        : "This field is required.");
    objValues.age > 15 &&
      riskAssessment.lastHivTestBasedOnRequest === "false" &&
      (temp.lastHivTestForceToHaveSex = riskAssessment.lastHivTestForceToHaveSex
        ? ""
        : "This field is required.");
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
    setErrors({ ...temp, [e.target.name]: "" });
    setRiskAssessment({ ...riskAssessment, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
    //Check if riskStratificationResponseDto is null or empty then call the update method
    if (
      props.patientObj.riskStratificationResponseDto &&
      props.patientObj.riskStratificationResponseDto !== null &&
      props.patientObj.riskStratificationResponseDto.code !== ""
    ) {
      if (validate()) {
        setSaving(true);
        handleItemClick("basic", "risk");

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
      }
    } else {
      //if riskStratificationResponseDto is null then make a new call to save the record
      if (
        (riskCount > 0 || riskCountQuestion.length > 0) &&
        objValues.age > 15
      ) {
        if (validate()) {
          setSaving(true);
          handleItemClick("basic", "risk");

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
              handleItemClick("basic", "risk");
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
      }
    }
  };

  return (
    <>
      <Card className={classes.root}>
        <RefferralUnit />
        <CardBody>
          <ServicesProvided />
        </CardBody>
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

export default ClientRefferalForm;
