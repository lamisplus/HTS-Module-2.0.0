import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
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
import { Table } from "react-bootstrap";
import { Icon, List, Label as LabelSui } from "semantic-ui-react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

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

import { calculate_age } from "../../utils";

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
  let history = useHistory();
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
  const [isClientCurrentlyOnHiv, setClientCurrentlyOnHiv] = useState(true);
  const [states, setStates] = useState([]);
  const [genders, setGenders] = useState([]);
  const [hivStatus, setHivStatus] = useState([]);
  const [indexClientConfirmedHivPositive, setIndexClientConfirmedHivPositive] =
    useState(false);
  const [familyRelationship, setFamilyRelationship] = useState([]);
  const [selectedFamilyIndex, setSelectedFamilyIndex] = useState({});
  const [familyIndexHivStatus, setFamilyIndexHivStatus] = useState([]);
  const [familyIndex, setFamilyIndex] = useState([]);
  const [followUpAppointmentLocation, setFollowUpAppointmentLocation] =
    useState([]);
  const [indexVisitAttempt, setIndexVisitAttempt] = useState([]);
  const [isWillingToHaveChildrenTested, setIsWillingToHaveChildrenTested] =
    useState(false);
  const [stateInfo, setStateInfo] = useState(
    props?.basicInfo?.personResponseDto?.address?.address[0]?.stateId
      ? props?.basicInfo?.personResponseDto?.address?.address[0]?.stateId
      : props?.patientObj?.personResponseDto?.address?.address[0]?.stateId
  );

  const [lgaInfo, setLgaInfo] = useState(
    props?.basicInfo?.personResponseDto?.address?.address[0].district
      ? props?.basicInfo?.personResponseDto?.address?.address[0].district
      : props?.patientObj?.personResponseDto?.address?.address[0].district
  );
  const [facilityName, setFacilityName] = useState(Cookies.get("facilityName"));
  const [facilityInfo, setFacilityInfo] = useState(props?.organizationInfo);

  const [familyIndexRequestDto, setFamilyIndexRequestDto] = useState({
    childNumber: "",
    familyIndexHivStatus: "",
    familyIndexTestingUuid: "",
    familyRelationship: "",
    motherDead: "",
    yearMotherDead: "",
    uan: "",
  });

  const [arrayFamilyIndexRequestDto, setArrayFamilyIndexRequestDto] = useState(
    []
  );
  const [errorFamilyIndexDTO, setErrorFamilyIndexDTO] = useState({});
  const [errorFamilyIndexTracker, setErrorFamilyIndexDTOTracker] = useState({});

  const [addIndexTracker, setaAddIndexTracker] = useState(false);
  const [addIndexTracker2, setaAddIndexTracker2] = useState(false);

  const [familyTestingTrackerRequestDTO, setFamilyTestingTrackerRequestDTO] =
    useState({
      attempt: "",
      dateEnrolledInOVC: "",
      dateEnrolledOnArt: "",
      dateTested: "",
      dateVisit: "",
      facilityId: "",
      familyIndexTestingId: "",
      familyIndexTestingUuid: "",
      followUpAppointmentLocation: "",
      hiveTestResult: "",
      knownHivPositive: "",
      ovcId: "",
      positionOfChildEnumerated: "",
      scheduleVisitDate: "",
      trackerAge: "",
      trackerSex: "",
    });
  const [
    arrayFamilyTestingTrackerRequestDTO,
    setArrayFamilyTestingTrackerRequestDTO,
  ] = useState([]);
  const [payload, setPayload] = useState({
    age: calculate_age(
      props?.basicInfo?.personResponseDto?.dateOfBirth
        ? props?.basicInfo?.personResponseDto?.dateOfBirth
        : props?.patientObj?.personResponseDto?.dateOfBirth
    ),
    alternatePhoneNumber: "",
    dateClientEnrolledOnTreatment: "",
    dateIndexClientConfirmedHivPositiveTestResult: "",
    dateOfBirth: props?.patientObj?.personResponseDto?.dateOfBirth,
    extra: {},
    facilityName: "",
    familyIndexClient: "",

    familyIndexRequestDto: [
      {
        childNumber: 0,
        familyIndexHivStatus: "",
        familyIndexTestingUuid: "",
        familyRelationship: "",
        motherDead: "",
        yearMotherDead: "",
      },
    ],
    familyTestingTrackerRequestDTO: [
      {
        attempt: "",
        dateEnrolledInOVC: "",
        dateEnrolledOnArt: "",
        dateTested: "",
        dateVisit: "",
        facilityId: 0,
        familyIndexTestingId: 0,
        familyIndexTestingUuid: "",
        followUpAppointmentLocation: "",
        hiveTestResult: "",
        knownHivPositive: "",
        ovcId: "",
        positionOfChildEnumerated: 0,
        scheduleVisitDate: "",
        trackerAge: 0,
        trackerSex: "",
      },
    ],

    htsClientId: props && props.patientObj ? props.patientObj?.id : "",
    htsClientUuid: "",
    indexClientId: props?.patientObj?.clientCode,
    isClientCurrentlyOnHivTreatment: "",
    lga: "",
    maritalStatus: props?.patientObj?.personResponseDto?.maritalStatus?.id,
    name: props?.patientObj?.personResponseDto?.firstName,
    phoneNumber:
      props?.patientObj?.personResponseDto?.contactPoint?.contactPoint[0]
        ?.value,
    middleName: props?.patientObj?.personResponseDto?.otherName,
    lastName: props?.patientObj?.personResponseDto?.surname,
    visitDate: "",
    recencyTesting: "",
    setting: "",
    sex: props?.patientObj?.personResponseDto?.gender?.id,
    state: "",
    virallyUnSuppressed: "",
    willingToHaveChildrenTestedElseWhere: "",

    //
    //
    // referralDate: "",
    // hospitalNumber: "",
    // countryId: "1",
    // stateId: "",

    reasonForIndexClientDateHivConfirmedNotSelected: "",
    address: props?.patientObj?.personResponseDto?.address?.address[0].city,
    recencyTesting: "",
  });

  const [lgas, setLGAs] = useState([]);
  const [facilities, setFacilities1] = useState([]);
  const [selectedState, setSelectedState] = useState({});
  const [selectedFacility, setSelectedFacility] = useState({});
  const [selectedLga, setSelectedLga] = useState({});

  const loadStates = () => {
    axios
      .get(`${baseUrl}organisation-units/parent-organisation-units/1`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  const loadOtherForm = (row) => {
    // setSaving(true);
    //props.setActiveContent({...props.activeContent, route:'mental-health-view', id:row.id})
    toggle();
  };
  const loadLGA = (id) => {
    axios
      .get(`${baseUrl}organisation-units/parent-organisation-units/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
  console.log(props);
  const handleItemClick = (next, present) => {
    props.handleItemClick(next);
    if (props.completed.includes(present)) {
    } else {
      props.setCompleted([...props.completed, present]);
    }
  };
  const validateAddFamilyINdexDTO = () => {
    let temp = {};

    // if all are empty

    if (
      familyIndexRequestDto.familyRelationship === "" &&
      familyIndexRequestDto.familyIndexHivStatus === "" &&
      familyIndexRequestDto.motherDead === ""
    ) {
      setaAddIndexTracker(true);
    } else {
      setaAddIndexTracker(false);

      temp.familyRelationship =
        familyIndexRequestDto.familyRelationship === ""
          ? "field is required"
          : "";
      temp.childNumber =
        familyIndexRequestDto.familyRelationship ===
          "FAMILY_RELATIONSHIP_BIOLOGICAL_CHILD" &&
        familyIndexRequestDto.childNumber === ""
          ? "field is required"
          : "";

      temp.familyIndexHivStatus =
        familyIndexRequestDto.familyIndexHivStatus === ""
          ? "field is required"
          : "";
      temp.motherDead =
        familyIndexRequestDto.motherDead === "" ? "field is required" : "";
      temp.yearMotherDead =
        familyIndexRequestDto.motherDead.toLowerCase() === "yes" &&
        familyIndexRequestDto.yearMotherDead === ""
          ? "field is required"
          : "";

      setErrorFamilyIndexDTO({ ...temp });
      return Object.values(temp).every((x) => x == "");
    }
  };

  const loadFacilities = (id) => {
    axios
      .get(`${baseUrl}organisation-units/parent-organisation-units/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  const TargetGroupSetup = () => {
    axios
      .get(`${baseUrl}account`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setFacilityInfo(response.data);
      })
      .catch((error) => {
        //console.log(error);
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
      .catch((error) => {});
  };

  const getMaritalStatus = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/MARITAL_STATUS`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setMaritalStatus(response.data);
      })
      .catch((error) => {});
  };

  const getFamilyRelationship = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/FAMILY_RELATIONSHIP`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setFamilyRelationship(response.data);
      })
      .catch((error) => {});
  };

  // get family index hiv status
  const FAMILY_INDEX_HIV_STATUS = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/FAMILY_INDEX_HIV_STATUS`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setFamilyIndexHivStatus(response.data);
      })
      .catch((error) => {});
  };

  // get family index

  const FAMILY_INDEX = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/FAMILY_INDEX`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setFamilyIndex(response.data);
      })
      .catch((error) => {});
  };

  const FOLLOW_UP_APPOINTMENT_LOCATION = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/FOLLOW UP_APPOINTMENT_LOCATION`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setFollowUpAppointmentLocation(response.data);
      })
      .catch((error) => {});
  };

  // GET
  const INDEX_VISIT_ATTEMPTS = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/INDEX_VISIT_ATTEMPTS`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setIndexVisitAttempt(response.data);
      })
      .catch((error) => {});
  };

  // generate index client Id using the HTS client code/family index client unique ART number
  const generateIndexClientId = () => {
    const indexClientId = Math.floor(1000 + Math.random() * 9000);
  };

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
      .catch(() => {});
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

    if (
      props?.basicInfo?.personResponseDto?.address?.address[0]?.stateId ||
      props?.patientObj?.personResponseDto?.address?.address[0]?.stateId
    ) {
      loadLGA(
        props?.basicInfo?.personResponseDto?.address?.address[0]?.stateId
          ? props?.basicInfo?.personResponseDto?.address?.address[0]?.stateId
          : props?.patientObj?.personResponseDto?.address?.address[0]?.stateId
      );
    }

    if (props.organizationInfo) {
      TargetGroupSetup();
    }
  }, []);

  //Get list of State
  const getStateByCountryId = () => {
    getAllStateByCountryId()
      .then((res) => {
        setStates(res);
      })
      .catch(() => {});
  };
  const checkPhoneNumberBasic = (e, inputName) => {
    if (e) {
      setErrors({ ...errors, phoneNumber: "" });
    }
    const limit = 10;

    if (inputName === "phoneNumber") {
      setPayload({ ...payload, phoneNumber: e.slice(0, limit) });
    } else if (inputName === "alternatePhoneNumber") {
      setPayload({ ...payload, alternatePhoneNumber: e.slice(0, limit) });
    } else if (inputName === "phoneNoOfReferrringFacility") {
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

  // handlefamilyIndexRequestDto
  const handlefamilyIndexRequestDto = (e) => {
    setErrorFamilyIndexDTO({ ...errorFamilyIndexDTO, [e.target.name]: "" });
    setaAddIndexTracker(false);
    // console.log(e);
    setFamilyIndexRequestDto({
      ...familyIndexRequestDto,
      [e.target.name]: e.target.value,
    });

    // clearf the error with e.target.name
    setErrors({ ...errors, [e.target.name]: "" });
  };
  const handleSubmitfamilyIndexRequestDto = (e) => {
    if (validateAddFamilyINdexDTO()) {
      let existingArray = arrayFamilyIndexRequestDto;

      existingArray.push(familyIndexRequestDto);
      setFamilyIndexRequestDto({
        childNumber: "",
        familyIndexHivStatus: "",
        familyIndexTestingUuid: "",
        familyRelationship: "",
        motherDead: "",
        yearMotherDead: "",
        uan: "",
      });

      setArrayFamilyIndexRequestDto(existingArray);
    }
  };

  // handlefamilyIndexRequestDto
  const handlefamilyTestingTrackerRequestDTO = (e) => {
    setErrorFamilyIndexDTOTracker({
      ...errorFamilyIndexTracker,
      [e.target.name]: "",
    });
    setaAddIndexTracker2(false);
    setFamilyTestingTrackerRequestDTO({
      ...familyTestingTrackerRequestDTO,
      [e.target.name]: e.target.value,
    });

    // clearf the error with e.target.name
    setErrors({ ...errors, [e.target.name]: "" });
  };
  const handleDone = () => {
    toggle();
    handleItemClick("refferral", "");
  };
  const loadNextForm = (row) => {
    // setSaving(true);
    handleItemClick("pns", "fit");
    toggle();
  };
  const handleSubmitfamilyTestingTrackerRequestDTO = (e) => {
    if (familyTestingTrackerRequestDTO?.dateVisit !== "") {
      let existingArray = arrayFamilyTestingTrackerRequestDTO;

      let newDTO = familyTestingTrackerRequestDTO;
      familyTestingTrackerRequestDTO.facilityId =
        facilityInfo.currentOrganisationUnitId;

      existingArray.push(newDTO);
      setFamilyTestingTrackerRequestDTO({
        attempt: "",
        dateEnrolledInOVC: "",
        dateEnrolledOnArt: "",
        dateTested: "",
        dateVisit: "",
        facilityId: "",
        familyIndexTestingId: "",
        familyIndexTestingUuid: "",
        followUpAppointmentLocation: "",
        hiveTestResult: "",
        knownHivPositive: "",
        ovcId: "",
        positionOfChildEnumerated: "",
        scheduleVisitDate: "",
        trackerAge: "",
        trackerSex: "",
      });

      setArrayFamilyTestingTrackerRequestDTO(existingArray);
    } else {
      let ans = Object.values(familyTestingTrackerRequestDTO).every(
        (each) => each === ""
      );

      if (ans) {
        setaAddIndexTracker2(true);
      } else {
        let temp = {};
        temp.dateVisit =
          familyTestingTrackerRequestDTO?.dateVisit === ""
            ? "field is required"
            : "";

        setErrorFamilyIndexDTOTracker({ ...temp });
        return Object.values(temp).every((x) => x == "");
      }
    }
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
      .catch((e) => {});
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
    setPayload((prevPayload) => ({
      ...prevPayload,
      [name]: value,
      // Reset childNumber when family relationship changes
      childNumber:
        value === "FAMILY_RELATIONSHIP_BIOLOGICAL_CHILD"
          ? ""
          : prevPayload.childNumber,
      // Reset familyIndexHivStatus when family relationship changes, where mother = '1293', father = '1294', biological child = '1295', siblings = '1296'
      familyIndexHivStatus: [
        "FAMILY_RELATIONSHIP_BIOLOGICAL_CHILD",
        "FAMILY_RELATIONSHIP_FATHER",
        "FAMILY_RELATIONSHIP_MOTHER",
        "FAMILY_RELATIONSHIP_SIBLINGS",
      ].includes(value)
        ? ""
        : prevPayload.familyIndexHivStatus,
      // Reset uan when family relationship changes
      uan:
        value === "FAMILY_RELATIONSHIP_BIOLOGICAL_CHILD" ||
        value === "FAMILY_RELATIONSHIP_FATHER" ||
        value === "FAMILY_RELATIONSHIP_MOTHER" ||
        value === "FAMILY_RELATIONSHIP_SIBLINGS"
          ? ""
          : prevPayload.uan,
      // Reset motherDead when family relationship changes
      motherDead:
        value === "FAMILY_RELATIONSHIP_MOTHER" ||
        value === "FAMILY_RELATIONSHIP_FATHER" ||
        value === "FAMILY_RELATIONSHIP_BIOLOGICAL_CHILD"
          ? ""
          : prevPayload.motherDead,
      // Reset yearMotherDied when family relationship changes
      yearMotherDied:
        value === "FAMILY_RELATIONSHIP_MOTHER" ||
        value === "FAMILY_RELATIONSHIP_FATHER" ||
        value === "FAMILY_RELATIONSHIP_BIOLOGICAL_CHILD"
          ? ""
          : prevPayload.yearMotherDied,
    }));
  };

  //Get list of HIV STATUS ENROLLMENT

  const convertCodeToDisplay = (type, value) => {
    let data = "";
    if (type === "familyRelationship") {
      data = familyRelationship.filter((each) => {
        if (each.code === value) {
          return each;
        }
      });

      return data[0].display;
    }
    if (type === "familyIndexHivStatus") {
      data = familyIndexHivStatus.filter((each) => {
        if (each.code === value) {
          return each;
        }
      });

      return data[0].display;
    }
    if (type === "familyIndexHivStatus") {
      data = familyIndexHivStatus.filter((each) => {
        if (each.code === value) {
          return each;
        }
      });

      return data[0].display;
    }
  };

  const removeFamilyIndexRow = (index) => {
    arrayFamilyIndexRequestDto.splice(index, 1);
    setArrayFamilyIndexRequestDto([...arrayFamilyIndexRequestDto]);
  };

  const removeFamilyTrackerRow = (index) => {
    arrayFamilyTestingTrackerRequestDTO.splice(index, 1);
    setArrayFamilyTestingTrackerRequestDTO([
      ...arrayFamilyTestingTrackerRequestDTO,
    ]);
  };
  const handleInputChange = (e) => {
    setErrors({ ...temp, [e.target.name]: "" });
    const { name, value } = e.target;

    if (e.target.name === "name" || e.target.name === "lastName") {
      const name = alphabetOnly(e.target.value);
      setPayload((prevState) => ({
        ...prevState,
        [e.target.name]: name,
      }));
    } else if (name === "willingToHaveChildrenTested") {
      setPayload((prevState) => ({
        ...prevState,
        [name]: value,
        familyIndexTracker: {
          ...prevState.familyIndexTracker,
          positionOfChildEnumerated:
            value === "Yes"
              ? prevState.familyIndexTracker.positionOfChildEnumerated
              : "",
          trackerSex:
            value === "Yes" ? prevState.familyIndexTracker.trackerSex : "",
          trackerAge:
            value === "Yes" ? prevState.familyIndexTracker.trackerAge : "",
          scheduleVisitDate:
            value === "Yes"
              ? prevState.familyIndexTracker.scheduleVisitDate
              : "",
          followUpAppointmentLocation:
            value === "Yes"
              ? prevState.familyIndexTracker.followUpAppointmentLocation
              : "",
          dateVisit:
            value === "Yes" ? prevState.familyIndexTracker.dateVisit : "",
          knownHivPositive:
            value === "Yes"
              ? prevState.familyIndexTracker.knownHivPositive
              : "",
          dateTested:
            value === "Yes" ? prevState.familyIndexTracker.dateTested : "",
          hivTestResult:
            value === "Yes" ? prevState.familyIndexTracker.hivTestResult : "",
          dateEnrolledInOVC:
            value === "Yes"
              ? prevState.familyIndexTracker.dateEnrolledInOVC
              : "",
          dateEnrolledOnArt:
            value === "Yes"
              ? prevState.familyIndexTracker.dateEnrolledOnArt
              : "",
          attempt: value === "Yes" ? prevState.familyIndexTracker.attempt : "",
        },
      }));
    } else if (e.target.name === "middleName" && e.target.value !== "") {
      const name = alphabetOnly(e.target.value);
      setPayload({ ...payload, [e.target.name]: name });
    } else if (e.target.name === "indexClientId" && e.target.value !== "") {
      //    setPayload({...payload, [e.target.name]: name })
    } else if (e.target.name === "dateIndexConfirmedHiv") {
      if (e.target.value !== "") {
        const name = e.target.name;
        setPayload({ ...payload, [e.target.name]: name });
        setIndexClientConfirmedHivPositive(false); // Hide extra fields when date is selected
      } else {
        setIndexClientConfirmedHivPositive(true); // Show extra fields if date is not selected
      }
    } else if (
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
      console.log(e.target.name, e.target.value);
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

    setPayload({ ...payload, dateOfBirth: e.target.value });
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
      setPayload({
        ...payload,
        dateOfBirth: moment(dobNew).format("YYYY-MM-DD"),
      });
      payload.dateOfBirth = moment(dobNew).format("YYYY-MM-DD");
    }
    setPayload({ ...payload, age: e.target.value });
  };

  //End of Date of Birth and Age handling
  /*****  Validation  */
  const validate = () => {
    temp.referralDate = payload.referralDate ? "" : "This field is required.";
    temp.name = payload.name ? "" : "This field is required.";
    temp.dateIndexClientConfirmedHivPositiveTestResult =
      payload.dateIndexClientConfirmedHivPositiveTestResult
        ? ""
        : "This is field is required";
    temp.stateId = payload.stateId ? "" : "This field is required.";
    temp.lgaId = payload.lgaId ? "" : "This field is required.";
    temp.address = payload.address ? "" : "This field is required.";
    temp.phoneNumber = payload.phoneNumber ? "" : "This field is required.";
    temp.sex = payload.sex ? "" : "This field is required.";
    temp.dateOfBirth = payload.dateOfBirth ? "" : "This field is required.";
    temp.age = payload.age ? "" : "This field is required.";
    temp.familyIndexClient = payload.familyIndexClient
      ? ""
      : "This field is required.";
    temp.hivStatus = payload.hivStatus ? "" : "This field is required.";
    temp.facilityName = payload.facilityName ? "" : "This field is required.";
    if (payload.dateIndexClientConfirmedHiv === "") {
      temp.reasonForIndexClientDateHivConfirmedNotSelected =
        payload.reasonForIndexClientDateHivConfirmedNotSelected
          ? ""
          : "This field is required.";
    }
    temp.age = payload.age ? "" : "This field is required.";
    temp.referredTo = payload.referredTo ? "" : "This field is required.";
    setErrors({ ...temp });
    return Object.values(temp).every((x) => x == "");
  };

  const postPayload = (payload) => {
    axios
      .post(`${baseUrl}hts-family-index-testing`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setSaving(false);

        toast.success("Family Indexform save succesfully!");
        loadOtherForm();

        // history.push({pathName: "/patient-history",
        //   state: {
        //     patientObject: props.basicInfo,
        //     patientObj: props.basicInfo,
        //     clientCode: props.basicInfo.clientCode,
        //   },}
        // );
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

    payload.familyIndexRequestDto = arrayFamilyIndexRequestDto;
    payload.familyTestingTrackerRequestDTO =
      arrayFamilyTestingTrackerRequestDTO;
    payload.state = stateInfo;
    payload.lga = lgaInfo;
    payload.facilityName = facilityInfo.currentOrganisationUnitName;

    // if (validate()) {
    //   setSaving(true);

    postPayload(payload);
    //    handleItemClick("basic", "risk");
    // }
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
                    <Label
                      for=""
                      style={{ color: "#014d88", fontWeight: "bolder" }}
                    >
                      State <span style={{ color: "red" }}> *</span>{" "}
                    </Label>
                    <Input
                      type="select"
                      name="stateId"
                      style={{
                        height: "40px",
                        border: "solid 1px #014d88",
                        borderRadius: "5px",
                        fontWeight: "bolder",
                        appearance: "auto",
                      }}
                      value={stateInfo}
                      required
                      // onChange={loadLGA1}
                      onChange={(e) => {
                        if (e.target.value !== "") {
                          const filterState = states.filter((st) => {
                            return Number(st.id) === Number(e.target.value);
                          });
                          setSelectedState(filterState);

                          setPayload((prevPayload) => ({
                            ...prevPayload,
                            stateId: filterState[0].id,
                          }));
                        }
                        loadLGA(e.target.value);
                      }}
                      disabled
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
                    <Label
                      for=""
                      style={{ color: "#014d88", fontWeight: "bolder" }}
                    >
                      LGA <span style={{ color: "red" }}> *</span>
                    </Label>
                    <Input
                      type="select"
                      name="lgaId"
                      style={{
                        height: "40px",
                        border: "solid 1px #014d88",
                        borderRadius: "5px",
                        fontWeight: "bolder",
                        appearance: "auto",
                      }}
                      required
                      value={lgaInfo}
                      // onChange={loadFacilities1}
                      onChange={(e) => {
                        if (e.target.value !== "") {
                          const filterlga = lgas.filter((lg) => {
                            return Number(lg.id) === Number(e.target.value);
                          });
                          setSelectedLga(filterlga);
                          setPayload((prevPayload) => ({
                            ...prevPayload,
                            lgaId: filterlga[0].id,
                          }));
                        }
                        loadFacilities(e.target.value);
                      }}
                      disabled
                    >
                      <option>Select LGA</option>
                      {lgas.map((lga) => (
                        <option key={lga.id} value={lga.id}>
                          {lga.name}
                        </option>
                      ))}
                    </Input>
                    {errors.lgaId !== "" ? (
                      <span className={classes.error}>{errors.lgaId}</span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label
                      for=""
                      style={{ color: "#014d88", fontWeight: "bolder" }}
                    >
                      Facility Name
                      <span style={{ color: "red" }}> *</span>{" "}
                    </Label>
                    <Input
                      type="text"
                      name="facilityName"
                      style={{
                        height: "40px",
                        border: "solid 1px #014d88",
                        borderRadius: "5px",
                        fontWeight: "bolder",
                        appearance: "auto",
                      }}
                      value={facilityInfo.currentOrganisationUnitName}
                      required
                      onChange={(e) => {
                        // setPayload(prevPayload => ({ ...prevPayload, facilityTransferTo: e.target.value }));
                        if (e.target.value !== "") {
                          const filterFacility = facilities.filter((fa) => {
                            return Number(fa.id) === Number(e.target.value);
                          });
                          setSelectedFacility(filterFacility);
                          setPayload((prevPayload) => ({
                            ...prevPayload,
                            facilityName: filterFacility[0].name,
                          }));
                        }
                      }}
                      disabled
                    >
                      {/* <option>Select Facility</option>
                                            {facilities.map((facility) => (
                                                <option key={facility.id} value={facility.id}>
                                                    {facility.name}
                                                </option>
                                            ))} */}
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
                      Date <span style={{ color: "red" }}> *</span>{" "}
                    </Label>
                    <Input
                      type="date"
                      name="visitDate"
                      id="visitDate"
                      value={payload.visitDate}
                      onChange={handleInputChange}
                      min="1929-12-31"
                      max={moment(new Date()).format("YYYY-MM-DD")}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.25rem",
                      }}
                      // disabled
                    />
                    {errors.visitDate !== "" ? (
                      <span className={classes.error}>{errors.visitDate}</span>
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
                      name="setting"
                      id="setting"
                      value={payload.setting}
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
                    {errors.setting !== "" ? (
                      <span className={classes.error}>{errors.setting}</span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </div>

                <div className="form-group  col-md-4">
                  <FormGroup>
                    <Label>
                      Family Index client{" "}
                      <span style={{ color: "red" }}> *</span>
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
                      <span className={classes.error}>{errors.sex}</span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="firstName">
                      First Name <span style={{ color: "red" }}> *</span>
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
                      disabled
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
                    <Label for="lastName">
                      Middle Name <span style={{ color: "red" }}> *</span>
                    </Label>
                    <Input
                      className="form-control"
                      type="text"
                      name="name"
                      id="name"
                      value={payload.middleName}
                      onChange={handleInputChange}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.2rem",
                      }}
                      disabled
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
                    <Label for="lastName">
                      Last Name <span style={{ color: "red" }}> *</span>
                    </Label>
                    <Input
                      className="form-control"
                      type="text"
                      name="name"
                      id="name"
                      value={payload.lastName}
                      onChange={handleInputChange}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.2rem",
                      }}
                      disabled
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
                      name="indexClientId"
                      id="indexClientId"
                      value={payload.indexClientId}
                      onChange={handleInputChange}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.2rem",
                      }}
                      disabled
                    />
                    {errors.indexClientId !== "" ? (
                      <span className={classes.error}>
                        {errors.indexClientId}
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
                      name="sex"
                      id="sex"
                      onChange={handleInputChange}
                      value={payload.sex}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.2rem",
                      }}
                      disabled
                    >
                      <option value={""}>Select</option>
                      {genders &&
                        genders.map((gender, index) => (
                          <option key={gender.id} value={gender.id}>
                            {gender.display}
                          </option>
                        ))}
                    </select>
                    {errors.sex !== "" ? (
                      <span className={classes.error}>{errors.sex}</span>
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
                      name="dateOfBirth"
                      id="dateOfBirth"
                      min="1929-12-31"
                      max={moment(new Date()).format("YYYY-MM-DD")}
                      value={payload.dateOfBirth}
                      onChange={handleDobChange}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.2rem",
                      }}
                      disabled
                    />
                    {errors.dateOfBirth !== "" ? (
                      <span className={classes.error}>
                        {errors.dateOfBirth}
                      </span>
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
                      Marital Status <span style={{ color: "red" }}> </span>
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
                      disabled
                      // disabled={props.activePage.actionType === "view"}
                    >
                      <option value={""}></option>
                      {maritalStatus.map((value) => (
                        <option key={value.id} value={value.id}>
                          {value.display}
                        </option>
                      ))}
                    </select>
                    {/* {errors.setting !== "" ? (
                                            <span className={classes.error}>
                                                {errors.setting}
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
                      // disabled={true}
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
                      disabled
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
                    <Label>Alternative Contact Number</Label>
                    <PhoneInput
                      // disabled={true}
                      containerStyle={{
                        width: "100%",
                        border: "1px solid #014D88",
                      }}
                      inputStyle={{ width: "100%", borderRadius: "0px" }}
                      country={"ng"}
                      placeholder="(234)7099999999"
                      maxLength={5}
                      name="alternatePhoneNumber"
                      id="alternatePhoneNumber"
                      masks={{ ng: "...-...-....", at: "(....) ...-...." }}
                      value={payload.alternatePhoneNumber}
                      onChange={(e) => {
                        checkPhoneNumberBasic(e, "alternatePhoneNumber");
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
                      Descriptiven Residential Address{" "}
                      <span style={{ color: "red" }}> *</span>
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
                      Date Of Index Client's confrimed HIV-positive test results{" "}
                      <span style={{ color: "red" }}> *</span>{" "}
                    </Label>
                    <Input
                      type="date"
                      name="dateIndexClientConfirmedHivPositiveTestResult"
                      id="dateIndexClientConfirmedHivPositiveTestResult"
                      value={
                        payload.dateIndexClientConfirmedHivPositiveTestResult
                      }
                      onChange={handleInputChange}
                      min="1929-12-31"
                      max={moment(new Date()).format("YYYY-MM-DD")}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.25rem",
                      }}
                      // disabled
                    />
                    {errors.dateIndexClientConfirmedHivPositiveTestResult !==
                    "" ? (
                      <span className={classes.error}>
                        {errors.referralDate}
                      </span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </div>
                {indexClientConfirmedHivPositive && (
                  <div className="form-group col-md-4">
                    <Label>
                      {" "}
                      Reason for not selecting Index client Hiv confirmed test
                      result Date ?{" "}
                    </Label>
                    <FormGroup>
                      <select
                        className="form-control"
                        name="reasonForIndexClientDateHivConfirmedNotSelected"
                        id="reasonForIndexClientDateHivConfirmedNotSelected"
                        onChange={handleInputChange}
                        value={
                          payload.reasonForIndexClientDateHivConfirmedNotSelected
                        }
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      >
                        <option value="">Select</option>
                        <option value="Result not confirmed yet">
                          Result not confirmed yet
                        </option>
                        <option value="NA">NA</option>
                      </select>
                      {errors.reasonForIndexClientDateHivConfirmedNotSelected !==
                      "" ? (
                        <span className={classes.error}>
                          {
                            errors.reasonForIndexClientDateHivConfirmedNotSelected
                          }
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>
                )}
                {/* )} */}
                {/* if index client is hiv positive, and date is selected */}
                <div className="form-group col-md-4 ">
                  <Label>Is client current on HIV treatment ?</Label>
                  <FormGroup>
                    <select
                      className="form-control"
                      name="isClientCurrentlyOnHivTreatment"
                      id="isClientCurrentlyOnHivTreatment"
                      onChange={handleInputChange}
                      value={payload.isClientCurrentlyOnHivTreatment}
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

                {payload.isClientCurrentlyOnHivTreatment &&
                  payload.isClientCurrentlyOnHivTreatment === "Yes" && (
                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="">
                          Date of Treatment Initiation{" "}
                          <span style={{ color: "red" }}> *</span>{" "}
                        </Label>
                        <Input
                          type="date"
                          name="dateClientEnrolledOnTreatment"
                          id="dateClientEnrolledOnTreatment"
                          value={payload.dateClientEnrolledOnTreatment}
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
                  <Label>
                    {" "}
                    Recency Testing{" "}
                    <span> (for newly tested HIV-positive only) </span>{" "}
                  </Label>
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
                      <option value="Long Term Infection">
                        {" "}
                        Long Term Infection
                      </option>
                      <option value="Not Done">Not Done</option>
                    </select>
                  </FormGroup>
                </div>
                <div className="form-group col-md-4 ">
                  <Label>virally unsuppressed</Label>
                  <FormGroup>
                    <select
                      className="form-control"
                      name="virallyUnSuppressed"
                      id="virallyUnSuppressed"
                      onChange={handleInputChange}
                      value={payload.virallyUnSuppressed}
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
                <div className="form-group col-md-4">
                  <FormGroup>
                    <Label for="willingToHaveChildrenTestedElseWhere">
                      Are you willing to have your children tested elsewhere by
                      a health care worker?
                    </Label>
                    <select
                      className="form-control"
                      id="willingToHaveChildrenTestedElseWhere"
                      name="willingToHaveChildrenTestedElseWhere"
                      onChange={handleInputChange}
                      value={payload.willingToHaveChildrenTestedElseWhere}
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
                SECTION B: FAMILY INDEX
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
                    onChange={handlefamilyIndexRequestDto}
                    value={familyIndexRequestDto.familyRelationship}
                  >
                    <option value="">Select</option>
                    {familyRelationship.map((value, index) => (
                      <option key={index} value={value.code}>
                        {value.display}
                      </option>
                    ))}
                  </select>
                  {errorFamilyIndexDTO.familyRelationship && (
                    <span className={classes.error}>
                      {errorFamilyIndexDTO.familyRelationship}
                    </span>
                  )}
                </FormGroup>
              </div>
              {familyIndexRequestDto.familyRelationship ===
                "FAMILY_RELATIONSHIP_BIOLOGICAL_CHILD" && (
                <div className="form-group col-md-4">
                  <FormGroup>
                    <Label for="childNumber">Child Number</Label>
                    <select
                      className="form-control"
                      id="childNumber"
                      name="childNumber"
                      onChange={handlefamilyIndexRequestDto}
                      value={familyIndexRequestDto.childNumber}
                    >
                      <option value="">Select</option>
                      <option value="1">1st Child</option>
                      <option value="2">2nd Child</option>
                      <option value="3">3rd Child</option>
                      <option value="4">4th Child</option>
                      <option value="5">5th Child</option>
                      <option value="6">6th Child</option>
                      <option value="7">7th Child</option>
                    </select>
                    {errorFamilyIndexDTO.childNumber && (
                      <span className={classes.error}>
                        {errorFamilyIndexDTO.childNumber}
                      </span>
                    )}
                  </FormGroup>
                </div>
              )}
              <div className="form-group col-md-4">
                <FormGroup>
                  <Label for="familyIndexHivStatus">
                    Family Index HIV Status
                  </Label>
                  <select
                    className="form-control"
                    id="familyIndexHivStatus"
                    name="familyIndexHivStatus"
                    onChange={handlefamilyIndexRequestDto}
                    value={familyIndexRequestDto.familyIndexHivStatus}
                  >
                    <option value="">Select</option>
                    {familyIndexHivStatus.map((value, index) => (
                      <option key={index} value={value.code}>
                        {index}
                      </option>
                    ))}
                  </select>
                  {errorFamilyIndexDTO.familyIndexHivStatus && (
                    <span className={classes.error}>
                      {errorFamilyIndexDTO.familyIndexHivStatus}
                    </span>
                  )}
                </FormGroup>
              </div>
              {familyIndexRequestDto.familyIndexHivStatus &&
                familyIndexRequestDto.familyIndexHivStatus ===
                  "FAMILY_INDEX_HIV_STATUS_CURRENT_ON_ART" &&
                [
                  "FAMILY_RELATIONSHIP_BIOLOGICAL_CHILD",
                  "FAMILY_RELATIONSHIP_FATHER",
                  "FAMILY_RELATIONSHIP_MOTHER",
                  "FAMILY_RELATIONSHIP_SIBLINGS",
                ].includes(familyIndexRequestDto.familyRelationship) && (
                  <div className="form-group col-md-4">
                    <FormGroup>
                      <Label for="uan">UAN</Label>
                      <input
                        className="form-control"
                        id="uan"
                        type="text"
                        name="uan"
                        value={familyIndexRequestDto.uan}
                        onChange={handlefamilyIndexRequestDto}
                        disabled={
                          familyIndexRequestDto.familyIndexHivStatus !==
                          "FAMILY_INDEX_HIV_STATUS_CURRENT_ON_ART"
                        }
                      />
                      {errors.uan && (
                        <span className={classes.error}>{errors.uan}</span>
                      )}
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
                    onChange={handlefamilyIndexRequestDto}
                    value={familyIndexRequestDto.motherDead}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  {errorFamilyIndexDTO.motherDead && (
                    <span className={classes.error}>
                      {errorFamilyIndexDTO.motherDead}
                    </span>
                  )}
                </FormGroup>
              </div>
              {familyIndexRequestDto.motherDead === "Yes" && (
                <div className="form-group col-md-4">
                  <FormGroup>
                    <Label for="yearMotherDied">Year Mother Died</Label>
                    <input
                      className="form-control"
                      id="yearMotherDied"
                      type="date"
                      min="1929-12-31"
                      max={moment(new Date()).format("YYYY-MM-DD")}
                      name="yearMotherDead"
                      value={familyIndexRequestDto.yearMotherDead}
                      onChange={handlefamilyIndexRequestDto}
                    />
                    {errorFamilyIndexDTO.yearMotherDead && (
                      <span className={classes.error}>
                        {errorFamilyIndexDTO.yearMotherDead}
                      </span>
                    )}
                  </FormGroup>
                </div>
              )}
              {addIndexTracker && (
                <div className="form-group mb-3 col-md-12">
                  <p style={{ color: "red" }}>Fill input in section B</p>
                </div>
              )}
              <div className="form-group mb-3 col-md-6">
                <LabelSui
                  as="a"
                  color="black"
                  onClick={handleSubmitfamilyIndexRequestDto}
                  size="small"
                  style={{ marginTop: 35 }}
                >
                  <Icon name="plus" /> Add
                </LabelSui>
              </div>
              {/* <div className="form-group mb-3 col-md-6">
                <Button
                  content="Add"
                  type="submit"
                  icon="right plus"
                  labelPosition="left"
                  style={{ backgroundColor: "#000", color: "white" }}
                  onClick={handleSubmitfamilyIndexRequestDto}
                  //   disabled={saving}
                />
              </div> */}
              {console.log(
                "arrayFamilyIndexRequestDto",
                arrayFamilyIndexRequestDto
              )}

              {arrayFamilyIndexRequestDto &&
                arrayFamilyIndexRequestDto.length > 0 && (
                  <List className="mb-5">
                    <Table striped responsive>
                      <thead>
                        <tr>
                          <th>Family Relationship</th>
                          <th>Family Index HIV Status</th>
                          <th>Mother Dead</th>

                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {arrayFamilyIndexRequestDto.length > 0 &&
                          arrayFamilyIndexRequestDto.map((each, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  {convertCodeToDisplay(
                                    "familyRelationship",
                                    each.familyRelationship
                                  )}
                                </td>
                                <td>
                                  {convertCodeToDisplay(
                                    "familyIndexHivStatus",
                                    each.familyIndexHivStatus
                                  )}
                                </td>
                                <td>{each.motherDead}</td>
                                <td>
                                  {" "}
                                  <IconButton
                                    aria-label="delete"
                                    size="small"
                                    color="error"
                                    onClick={() => removeFamilyIndexRow(index)}
                                  >
                                    <DeleteIcon fontSize="inherit" />
                                  </IconButton>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </Table>
                  </List>
                )}
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
                SECTION C: FAMILY INDEX TRACKER
              </div>

              {/* SECTION C INPUT FILEDS  */}
              <div className="row">
                <div className="form-group col-md-4">
                  <FormGroup>
                    <Label for="positionOfChildEnumerated">
                      Position of the Child Enumerator
                    </Label>
                    <input
                      className="form-control"
                      id="positionOfChildEnumerated"
                      type="number"
                      name="positionOfChildEnumerated"
                      value={
                        familyTestingTrackerRequestDTO?.positionOfChildEnumerated
                      }
                      onChange={handlefamilyTestingTrackerRequestDTO}
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
                      onChange={handlefamilyTestingTrackerRequestDTO}
                      value={familyTestingTrackerRequestDTO?.trackerSex}
                    >
                      <option value="">Select</option>
                      {genders.map((value, index) => (
                        <option key={index} value={value.code}>
                          {value.display}
                        </option>
                      ))}
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
                      value={familyTestingTrackerRequestDTO?.trackerAge}
                      onChange={handlefamilyTestingTrackerRequestDTO}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.2rem",
                      }}
                    />
                  </FormGroup>
                </div>
                <div className="form-group col-md-4">
                  <FormGroup>
                    <Label for="followUpAppointmentLocation">
                      Follow Up Appointment Location
                    </Label>
                    <select
                      className="form-control"
                      id="followUpAppointmentLocation"
                      name="followUpAppointmentLocation"
                      onChange={handlefamilyTestingTrackerRequestDTO}
                      value={
                        familyTestingTrackerRequestDTO?.followUpAppointmentLocation
                      }
                    >
                      <option value="">Select</option>
                      {followUpAppointmentLocation.map((value, index) => (
                        <option key={index} value={value.code}>
                          {value.display}
                        </option>
                      ))}
                    </select>
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">
                      Schedule Visit Date{" "}
                      <span style={{ color: "red" }}> *</span>{" "}
                    </Label>
                    <Input
                      type="date"
                      name="scheduleVisitDate"
                      id="scheduleVisitDate"
                      value={familyTestingTrackerRequestDTO?.scheduleVisitDate}
                      onChange={handlefamilyTestingTrackerRequestDTO}
                      min="1929-12-31"
                      max={moment(new Date()).format("YYYY-MM-DD")}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.25rem",
                      }}
                      // disabled
                    />
                    {/* {errors.referralDate !== "" ? (
                        <span className={classes.error}>
                          {errors.referralDate}
                        </span>
                      ) : (
                        ""
                      )} */}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">
                      Date visited <span style={{ color: "red" }}> *</span>{" "}
                    </Label>
                    <Input
                      type="date"
                      name="dateVisit"
                      id="dateVisit"
                      value={familyTestingTrackerRequestDTO?.dateVisit}
                      onChange={handlefamilyTestingTrackerRequestDTO}
                      min="1929-12-31"
                      max={moment(new Date()).format("YYYY-MM-DD")}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.25rem",
                      }}
                      // disabled
                    />
                    {errorFamilyIndexTracker.dateVisit !== "" ? (
                      <span className={classes.error}>
                        {errorFamilyIndexTracker.dateVisit}
                      </span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">
                      Attempts <span style={{ color: "red" }}> *</span>{" "}
                    </Label>
                    <select
                      className="form-control"
                      name="attempt"
                      id="attempt"
                      onChange={handlefamilyTestingTrackerRequestDTO}
                      value={familyTestingTrackerRequestDTO?.attempt}
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
                      ))}
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
                      onChange={handlefamilyTestingTrackerRequestDTO}
                      value={familyTestingTrackerRequestDTO?.knownHivPositive}
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
                {familyTestingTrackerRequestDTO.knownHivPositive &&
                  familyTestingTrackerRequestDTO.knownHivPositive === "Yes" && (
                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="">Date Tested</Label>
                        <Input
                          type="date"
                          name="dateTested"
                          id="dateTested"
                          value={familyTestingTrackerRequestDTO?.dateTested}
                          onChange={handlefamilyTestingTrackerRequestDTO}
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
                  )}
                {familyTestingTrackerRequestDTO?.knownHivPositive &&
                  familyTestingTrackerRequestDTO?.knownHivPositive ===
                    "Yes" && (
                    <div className="form-group col-md-4 ">
                      <Label>HIV Test Result </Label>
                      <FormGroup>
                        <select
                          className="form-control"
                          name="hiveTestResult"
                          id="hiveTestResult"
                          onChange={handlefamilyTestingTrackerRequestDTO}
                          value={familyTestingTrackerRequestDTO.hiveTestResult}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        >
                          <option value="">Select</option>
                          <option value="Tested Positive">
                            Tested Positive
                          </option>
                          <option value="Teste Negative">
                            Tested Negative
                          </option>
                        </select>
                      </FormGroup>
                    </div>
                  )}
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">Date Enrolled In Ovc</Label>
                    <Input
                      type="date"
                      name="dateEnrolledInOVC"
                      id="dateEnrolledInOVC"
                      value={familyTestingTrackerRequestDTO?.dateEnrolledInOVC}
                      onChange={handlefamilyTestingTrackerRequestDTO}
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
                    <Label for="">Date Enrolled On ART</Label>
                    <Input
                      type="date"
                      name="dateEnrolledOnArt"
                      id="dateEnrolledOnArt"
                      value={familyTestingTrackerRequestDTO?.dateEnrolledOnArt}
                      onChange={handlefamilyTestingTrackerRequestDTO}
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
                {addIndexTracker2 && (
                  <div className="form-group mb-3 col-md-12">
                    <p style={{ color: "red" }}>
                      Fill section C; Index Tracker
                    </p>
                  </div>
                )}{" "}
                <div className="form-group mb-3 col-md-6">
                  <LabelSui
                    as="a"
                    color="black"
                    onClick={handleSubmitfamilyTestingTrackerRequestDTO}
                    size="small"
                    style={{ marginTop: 35 }}
                  >
                    <Icon name="plus" /> Add
                  </LabelSui>
                </div>
              </div>
            </div>

            {arrayFamilyTestingTrackerRequestDTO.length > 0 && (
              <List>
                <Table striped responsive>
                  <thead>
                    <tr>
                      <th>Position of the child</th>
                      <th>Sex</th>
                      <th>Age</th>

                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {arrayFamilyTestingTrackerRequestDTO.map((each, index) => {
                      return (
                        <tr key={index}>
                          <td>{each.positionOfChildEnumerated}</td>
                          <td>{each.trackerSex}</td>
                          <td>{each.trackerAge}</td>
                          <td>
                            {" "}
                            <IconButton
                              aria-label="delete"
                              size="small"
                              color="error"
                              onClick={() => removeFamilyTrackerRow(index)}
                            >
                              <DeleteIcon fontSize="inherit" />
                            </IconButton>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </List>
            )}

            <br />
            <div className="row">
              <div className="form-group mb-3 col-md-6">
                <Button
                  content="Done"
                  type="Done"
                  icon="right arrowe"
                  labelPosition="right"
                  style={{ backgroundColor: "#014d88", color: "#fff" }}
                  onClick={() => {
                    history.push("/");
                  }}
                  disabled={saving}
                />
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
          <h4>Would you like to fill Partner Service Form?</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => loadNextForm()}
            style={{ backgroundColor: "#014d88", color: "#fff" }}
          >
            Yes
          </Button>

          <Button
            onClick={() => handleDone()}
            style={{ backgroundColor: "#014d88", color: "#fff" }}
          >
            Skip
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FamilyIndexTestingForm;
