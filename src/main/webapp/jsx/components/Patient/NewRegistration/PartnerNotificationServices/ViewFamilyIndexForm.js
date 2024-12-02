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
import { token, url as baseUrl } from "../../../../../api.js";
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
import ModeEditIcon from "@mui/icons-material/ModeEditOutline";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CreateIcon from "@material-ui/icons/Create";

import Select from "react-select";
// import { getAcount } from "../../../../utility";
import Cookies from "js-cookie";
import {
  getAllStateByCountryId,
  getAllCountry,
  getAllProvinces,
  getAllGenders,
  alphabetOnly,
} from "../../../../../utility";

import { calculate_age } from "../../../utils/index.js";
import { LiveHelp } from "@material-ui/icons";

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

const ViewFamilyIndexTestingForm = (props) => {
  const classes = useStyles();
  let history = useHistory();
  const [errors, setErrors] = useState({});
  const [ageDisabled2, setAgeDisabled2] = useState(true);
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
  const [showSelectedFamilyIndex, setShowSelectedFamilyIndex] = useState(false);
  const [statusOfContact, setFamilyIndexHivStatus] = useState([]);
  const [familyIndex, setFamilyIndex] = useState([]);
  const [followUpAppointmentLocation, setFollowUpAppointmentLocation] =
    useState([]);
  const [indexVisitAttempt, setIndexVisitAttempt] = useState([]);
  const [isWillingToHaveChildrenTested, setIsWillingToHaveChildrenTested] =
    useState(false);
  const [ageDisabled, setAgeDisabled] = useState(true);
  const [addNewAttempt, setAddNewAttempt] = useState(false);

  const [selectedFamilyTrackerForm, setSelectedFamilyTrackerForm] = useState(
    {}
  );
  const [viewFamilyTrackerForm, setViewFamilyTrackerForm] = useState(false);

  const [stateInfo, setStateInfo] = useState(
    props?.basicInfo?.personResponseDto?.address?.address[0]?.stateId
      ? props?.basicInfo?.personResponseDto?.address?.address[0]?.stateId
      : props?.patientObj?.personResponseDto?.address?.address[0]?.stateId
  );
  const [permissions, setPermission] = useState(
    localStorage.getItem("permissions")?.split(",")
  );
  const [lgaInfo, setLgaInfo] = useState(
    props?.basicInfo?.personResponseDto?.address?.address[0].district
      ? props?.basicInfo?.personResponseDto?.address?.address[0].district
      : props?.patientObj?.personResponseDto?.address?.address[0].district
  );
  const [facilityName, setFacilityName] = useState(Cookies.get("facilityName"));
  const [facilityInfo, setFacilityInfo] = useState(props?.organizationInfo);
  // const [selectedFamilyIndex, setSelectedFamilyIndex] = useState([]);

  const [familyIndexRequestDto, setFamilyIndexRequestDto] = useState({
    childNumber: "",
    age: "",
    childDead: "",
    dateOfBirth: "",
    dateOfHts: "",
    familyRelationship: "",
    statusOfContact: "",
    motherDead: "",
    yearMotherDead: "",
    yearChildDead: "",
    uan: "",
    liveWithParent: "",
    isDateOfBirthEstimated: "",
    firstName: props?.patientObj?.personResponseDto?.firstName,
    middleName: props?.patientObj?.personResponseDto?.otherName,
    lastName: props?.patientObj?.personResponseDto?.surname,
  });
  const [childNumber, setChildNumber] = useState([]);
  const [showOther, setShowOther] = useState(false);

  const [arrayFamilyIndexRequestDto, setArrayFamilyIndexRequestDto] = useState(
    []
  );
  const [
    arrayFamilyTestingTrackerRequestDTO,
    setArrayFamilyTestingTrackerRequestDTO,
  ] = useState([]);
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
      followUpAppointmentLocation: "",
      hiveTestResult: "",
      knownHivPositive: "",
      ovcId: "",
      positionOfChildEnumerated: "",
      scheduleVisitDate: "",
      trackerAge: "",
      trackerSex: "",
    });
    const [showHTSDate, setShowHTSDate] = useState(false);

  const [payload, setPayload] = useState({
    age:
      props &&
      calculate_age(
        props?.basicInfo?.personResponseDto?.dateOfBirth
          ? props?.basicInfo?.personResponseDto?.dateOfBirth
          : props?.patientObj?.personResponseDto?.dateOfBirth
      ),
    alternatePhoneNumber: "",
    dateClientEnrolledOnTreatment: "",
    dateIndexClientConfirmedHivPositiveTestResult:
      props?.patientObj?.confirmatoryTest2?.date2,
    dateOfBirth: props?.patientObj?.personResponseDto?.dateOfBirth,
    extra: {},
    facilityName: "",
    familyIndexClient: "",
    familyIndexRequestDto: {
      childNumber: 0,
      familyRelationship: "",
      motherDead: "",
      yearMotherDead: "",

      familyTestingTrackerRequestDTO: {
        attempt: "",
        dateEnrolledInOVC: "",
        dateEnrolledOnArt: "",
        dateTested: "",
        dateVisit: "",
        facilityId: 0,
        followUpAppointmentLocation: "",
        hiveTestResult: "",
        knownHivPositive: "",
        ovcId: "",
        positionOfChildEnumerated: 0,
        scheduleVisitDate: "",
        trackerAge: 0,
        trackerSex: "",

        // not there
        familyIndexTestingId: 0,
        familyIndexTestingUuid: "",
      },

      // not there
      statusOfContact: "",
      familyIndexTestingUuid: "",
    },

    htsClientId: props && props.patientObj ? props.patientObj?.id : "",
    htsClientUuid:
      props && props.patientObj ? props.patientObj.htsClientUUid : "",
    indexClientId: props?.patientObj?.clientCode,
    isClientCurrentlyOnHivTreatment: "",
    lga: "",
    maritalStatus: props?.patientObj?.personResponseDto?.maritalStatus?.id,
    name: props?.patientObj?.personResponseDto?.firstName,
    phoneNumber:
      props?.patientObj?.personResponseDto?.contactPoint?.contactPoint[0]
        ?.value,
    recencyTesting: props?.patientObj?.recency?.finalRecencyResult
      ? props?.patientObj?.recency?.finalRecencyResult
      : "Not Done",
    setting: props.patientObj.testingSetting,
    // chnage position
    visitDate: "",

    sex: props?.patientObj?.personResponseDto?.gender?.id,
    state: "",
    virallyUnSuppressed: "",
    willingToHaveChildrenTestedElseWhere: "",

    reasonForIndexClientDateHivConfirmedNotSelected: "",
    address: props?.patientObj?.personResponseDto?.address?.address[0].city,
    // recencyTesting: "",
  });

  const [lgas, setLGAs] = useState([]);
  const [facilities, setFacilities1] = useState([]);
  const [selectedState, setSelectedState] = useState({});
  const [selectedFacility, setSelectedFacility] = useState({});
  const [selectedLga, setSelectedLga] = useState({});
  const [retrieveFromIdToCode, setRetrieveFromIdToCode] = useState(true);
  
  
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
      .catch((e) => {});
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
  const handleItemClick = (next, present) => {
    props.handleItemClick(next);
    if (props.completed.includes(present)) {
    } else {
      props.setCompleted([...props.completed, present]);
    }
  };
  const validateAddFamilyINdexDTO = () => {
    let temp = {};

    temp.familyRelationship =
    familyIndexRequestDto.familyRelationship === ""
      ? "field is required"
      : "";
      temp.age =
      familyIndexRequestDto.age === ""
        ? "field is required"
        : "";
     
    setErrorFamilyIndexDTO({ ...temp });
    return Object.values(temp).every((x) => x == "");
  };

  const getFamilyIndexRequestList = () => {
    axios
      .get(
        `${baseUrl}hts-family-index-testing/family-index?familyIndexTestingUuid=${props.selectedRow.familyIndexTestingUuid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.data) {
          console.log("info", response.data);

          setArrayFamilyIndexRequestDto(response?.data);
        }
      })
      .catch((e) => {
        console.log("Fetch Facilities error" + e);
      });
  };

  const getListoFFamilyIndexInfo = () => {
    console.log("reading", props);

    axios
      .get(
        `${baseUrl}hts-family-index-testing/${props.patientObj.id}/hts-client`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.data) {
          // setFormId(response.data.htsClientId);

          console.log("this info", response.data);
          setPayload({
            ...response.data,
          });

          // setArrayFamilyIndexRequestDto(response.data.familyIndexList);
        }
      })
      .catch((e) => {
        console.log("Fetch Facilities error" + e);
      });
  };

  const getTrackerForFamilyIndex = (id) => {
    axios
      .get(`${baseUrl}hts-family-index-testing/family-index-tracker/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data) {
          // setFormId(response.data.htsClientId);

          console.log("this info", response.data);
          setFamilyTestingTrackerRequestDTO(response.data);

          // setArrayFamilyIndexRequestDto(response.data.familyIndexList);
        }
      })
      .catch((e) => {
        console.log("Fetch Facilities error" + e);
      });
  };

  //

  const AddNewByUpdateTracker = (tracker) => {
    let userRequest= tracker;

    console.log("userRequest", userRequest);
    axios
      .post(
        `${baseUrl}hts-family-index-testing/family-index-tracker`,
        userRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.data) {
          // setFormId(response.data.htsClientId);
          toast.success("Added New Family Index info save succesfully!");
            getListOfFamilyTracker()
                setFamilyTestingTrackerRequestDTO({
                  attempt: "",
                  dateEnrolledInOVC: "",
                  dateEnrolledOnArt: "",
                  dateTested: "",
                  dateVisit: "",
                  facilityId: "",
                  familyIndexId: props.selectedRow.id,
                  followUpAppointmentLocation: "",
                  hiveTestResult: "",
                  knownHivPositive: "",
                  ovcId: "",
                  positionOfChildEnumerated: "",
                  scheduleVisitDate: "",
                  trackerAge: familyIndexRequestDto.age,
                  trackerSex: "",
                });
        }
      })
      .catch((e) => {
        console.log("Fetch Facilities error" + e);
      });
  };

  const updateFamilyIndexTracker = (tracker) => {
    let userRequest = familyIndexRequestDto;
    userRequest.familyTestingTrackerResponseDTO = tracker;

    console.log("userRequest", userRequest);
    axios
      .put(
        `${baseUrl}hts-family-index-testing/family-indexr/${props.selectedRow.id}`,
        userRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.data) {
          // setFormId(response.data.htsClientId);
          toast.success("Family Index info updated succesfully!");

          console.log("updateFamilyIndexTracker status", response.data);
        }
      })
      .catch((e) => {
        console.log("Fetch Facilities error" + e);
      });
  };

  // get list of family tracker
  const getListOfFamilyTracker = () => {
    axios
      .get(
        `${baseUrl}hts-family-index-testing/family-index-tracker/by-family-index-uuid?familyIndexUuid=${props.selectedRow.uuid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.data) {
          // setFormId(response.data.htsClientId);

          console.log("this info for family req and tracker", response.data);

          setArrayFamilyTestingTrackerRequestDTO(response.data);
        }
      })
      .catch((e) => {
        console.log("Fetch Facilities error" + e);
      });
  };






const updateFamilyIndexDTO = (payload) => {
  axios
    .put(
      `${baseUrl}hts-family-index-testing/family-indexr/${props.selectedRow.id}`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => {
      setSaving(false);

      toast.success("Family Index form save succesfully!");
      handleItemClick("fit-history", "fit");
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


  // delete  tracker 



    const deleteTracker = (row) => {
    // setSaving(true);
    //props.setActiveContent({...props.activeContent, route:'mental-health-view', id:row.id})
    axios
      .delete(
        `${baseUrl}hts-family-index-testing/family-index-tracker/${row.id}
`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        toast.success("Family Tracker Deleted Successfully");
      setViewFamilyTrackerForm(false);

      })
      .catch((error) => {
        if (error.response && error.response.data) {
          let errorMessage =
            error.response.data.apierror &&
            error.response.data.apierror.message !== ""
              ? error.response.data.apierror.message
              : "Something went wrong, please try again";
          toast.error(errorMessage);
        } else {
          toast.error("Something went wrong. Please try again...");
        }
      });
  };

  const removeFamilyTrackerRow = (index, each) => {
    arrayFamilyTestingTrackerRequestDTO.splice(index, 1);
    setArrayFamilyTestingTrackerRequestDTO([
      ...arrayFamilyTestingTrackerRequestDTO,
    ]);

      deleteTracker(each)

  };
  const viewFamilyTrackerRow = (data, index) => {
    console.log("This is the data ", data);
    setAddNewAttempt(false);

    //get the family tracker
    getTrackerForFamilyIndex(data.id);
    setViewFamilyTrackerForm(true);
    //  setFamilyIndexRequestDto(data)
    setSelectedFamilyTrackerForm({ data: data, index: index });
    // setFamilyTestingTrackerRequestDTO({ ...data });
  };
  //Date of Birth and Age handle
  const handleDobChange2 = (e) => {
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
      familyIndexRequestDto.age = age_now;
familyTestingTrackerRequestDTO.trackerAge=age_now;
      //setBasicInfo({...basicInfo, age: age_now});
    } else {
      setFamilyIndexRequestDto({ ...familyIndexRequestDto, age: "" });
    }
    setFamilyIndexRequestDto({
      ...familyIndexRequestDto,
      dateOfBirth: e.target.value,
    });

    // if (familyIndexRequestDto.age !== "" && familyIndexRequestDto.age >= 85) {
    //   toggle();
    // }
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
  const GET_CHILD_NUMBER = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/CHILD_NUMBER`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setChildNumber(response.data);

        let ans = response.data.filter((each) => {
          return each.code === "CHILD_NUMBER_OTHERS";
        });

        setRetrieveFromIdToCode(ans[0]?.id);
      })
      .catch((error) => {});
  };
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
    console.log(props.patientObj);
    GET_CHILD_NUMBER()
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
    getListoFFamilyIndexInfo();
    getFamilyIndexRequestList();
    getListOfFamilyTracker();
    setFamilyIndexRequestDto(props.selectedRow);
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

  const showFamilyTrackerRow = () => {
    setViewFamilyTrackerForm(true);
    setAddNewAttempt(true);
    setFamilyTestingTrackerRequestDTO({
      attempt: "",
      dateEnrolledInOVC: "",
      dateEnrolledOnArt: "",
      dateTested: "",
      dateVisit: "",
      facilityId: "",
    familyIndexId: props.selectedRow.id,
      followUpAppointmentLocation: "",
      hiveTestResult: "",
      knownHivPositive: "",
      ovcId: "",
      positionOfChildEnumerated: "",
      scheduleVisitDate: "",
      trackerAge: familyIndexRequestDto.age,
      trackerSex: "",
    })
  };

  const addFamilyTrackerRow = () => {
    setViewFamilyTrackerForm(true);
    setAddNewAttempt(true);

    // let newArray = [...arrayFamilyTestingTrackerRequestDTO];
        familyTestingTrackerRequestDTO.facilityId = localStorage.getItem("FacId");

    // newArray.push(familyTestingTrackerRequestDTO);

    // setArrayFamilyTestingTrackerRequestDTO(newArray);

    //  update the family index
    AddNewByUpdateTracker(familyTestingTrackerRequestDTO);
  };
  const convertIdToCode = (id) => {
    if (id) {
      let ans = childNumber.filter((each) => {
        return each.code === "CHILD_NUMBER_OTHERS";
      });

      if (ans[0].id === parseInt(id)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const getIntPosition = (ex) => {
    let code =[]

    console.log()
 let main =  childNumber.map((each,index )=>{
if(each.code !==  "CHILD_NUMBER_OTHERS"){
  code.push({ id: each.id,
    value : index+ 1,})
}

    })

  if(ex){
      let ans =  code.filter((each)=>{
        return  each.id === parseInt(ex)
        })

  let  result = ans.length > 0 ? ans[0].value: ""
   return  result
  }else{
    return ""
  }
  };
  const updateFamilyTrackerRow = () => {
    setViewFamilyTrackerForm(false);
    let newArray = [...arrayFamilyTestingTrackerRequestDTO];
    newArray[selectedFamilyTrackerForm.index] = familyTestingTrackerRequestDTO;
    setArrayFamilyTestingTrackerRequestDTO(newArray);

    // update the family index
    updateFamilyIndexTracker(newArray);
  };

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
    // setErrors({ ...errors, [e.target.name]: "" });
    setaAddIndexTracker(false);
    // console.log(e);
    if (e.target.name === "childNumber") {
      let res = convertIdToCode(e.target.value);

      setFamilyIndexRequestDto({
        ...familyIndexRequestDto,
        [e.target.name]: e.target.value,
        otherChildNumber: "",

      });
      console.log(e.target.value);

      if (res) {
        setShowOther(true);
      } else {
      let deductedValue =   getIntPosition(e.target.value)
             //set position to child number
             console.log("deductedValue", deductedValue)
      setFamilyTestingTrackerRequestDTO({
        ...familyTestingTrackerRequestDTO,
        positionOfChildEnumerated: deductedValue,
      });
        setShowOther(false);
      }

    }else if (e.target.name === "otherChildNumber") {
      setFamilyIndexRequestDto({
        ...familyIndexRequestDto,
        [e.target.name]: e.target.value,
      });
      setFamilyTestingTrackerRequestDTO({
        ...familyTestingTrackerRequestDTO,
        positionOfChildEnumerated: e.target.value,
      });
    }else if(e.target.name === "statusOfContact"){
      setFamilyIndexRequestDto({
        ...familyIndexRequestDto,
        [e.target.name]: e.target.value,
      });
      if(e.target.value ===  "FAMILY_INDEX_HIV_STATUS_CURRENT_ON_ART" || e.target.value ===  "FAMILY_INDEX_HIV_STATUS_HIV_POSITIVE" || e.target.value ===  "FAMILY_INDEX_HIV_STATUS_HIV_POSITIVE" || e.target.value ===  "FAMILY_INDEX_HIV_STATUS_HIV_POSITIVE" || e.target.value ===  "FAMILY_INDEX_HIV_STATUS_REFERRED_ESCORTED_FOR_ART_INITIATION"){
setShowHTSDate(true)
      
      }

    }else {
      setFamilyIndexRequestDto({
        ...familyIndexRequestDto,
        [e.target.name]: e.target.value,
      });
    }

    // clearf the error with e.target.name
    setErrors({ ...errors, [e.target.name]: "" });
  };
  // const handleSubmitfamilyIndexRequestDto = (e) => {
  //   if (validateAddFamilyINdexDTO()) {
  //     let existingArray = arrayFamilyIndexRequestDto;

  //     existingArray.push(familyIndexRequestDto);
  //     setFamilyIndexRequestDto({
  //       childNumber: "",
  //       statusOfContact: "",
  //       familyIndexTestingUuid: "",
  //       familyRelationship: "",
  //       motherDead: "",
  //       yearMotherDead: "",
  //       uan: "",
  //     });

  //     setArrayFamilyIndexRequestDto(existingArray);
  //   }
  // };

  // handlefamilyIndexRequestDto
  const handlefamilyTestingTrackerRequestDTO = (e) => {
    setErrorFamilyIndexDTOTracker({
      ...errorFamilyIndexTracker,
      [e.target.name]: "",
    });
    setaAddIndexTracker2(false);

    if (e.target.name === "positionOfChildEnumerated") {
      if (e.target.value > -1) {
        setFamilyTestingTrackerRequestDTO({
          ...familyTestingTrackerRequestDTO,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name === "trackerAge") {
      if (e.target.value > -1) {
        setFamilyTestingTrackerRequestDTO({
          ...familyTestingTrackerRequestDTO,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setFamilyTestingTrackerRequestDTO({
        ...familyTestingTrackerRequestDTO,
        [e.target.name]: e.target.value,
      });
    }

    // clearf the error with e.target.name
    setErrors({ ...errors, [e.target.name]: "" });
  };
  const handleDone = () => {
    toggle();
    handleItemClick("new-referral", "");
  };
  const loadNextForm = (row) => {
    handleItemClick("pns", "fit");
  };

  const getSelectedDFamilyIndex = (relationship) => {
    // use the code to get object in the codeset
    let result = familyIndex.filter((each, index) => {
      return each.code === relationship;
    });
    console.log(result);
    // filter family relationship
    let result2 = familyRelationship.filter((each, index) => {
      if (
        each.display === "Biological Child" &&
        result[0].display === "Child"
      ) {
        return each;
      } else {
        return each.display === result[0].display;
      }
    });

    if (result2.length > 0) {
      setFamilyIndexRequestDto({
        ...familyIndexRequestDto,
        familyRelationship: result2[0].code,
      });
    }
    // setSaving(true);
    if (permissions.includes("Nigeria_PNS_Form")) {
      handleItemClick("pns", "fit");
      toggle();
    } else if (permissions.includes("Referral_Form")) {
      handleItemClick("pns", "client-referral");
      toggle();
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
      // Reset statusOfContact when family relationship changes, where mother = '1293', father = '1294', biological child = '1295', siblings = '1296'
      statusOfContact: [
        "FAMILY_RELATIONSHIP_BIOLOGICAL_CHILD",
        "FAMILY_RELATIONSHIP_FATHER",
        "FAMILY_RELATIONSHIP_MOTHER",
        "FAMILY_RELATIONSHIP_SIBLINGS",
      ].includes(value)
        ? ""
        : prevPayload.statusOfContact,
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
    if (type === "statusOfContact") {
      data = statusOfContact.filter((each) => {
        if (each.code === value) {
          return each;
        }
      });

      return data[0].display;
    }
    if (type === "statusOfContact") {
      data = statusOfContact.filter((each) => {
        if (each.code === value) {
          return each;
        }
      });

      return data[0].display;
    }
  };

  // const removeFamilyIndexRow = (index) => {
  //   arrayFamilyIndexRequestDto.splice(index, 1);
  //   setArrayFamilyIndexRequestDto([...arrayFamilyIndexRequestDto]);
  // };
  const hideFamilyIndex = () => {
    setShowSelectedFamilyIndex(false);
  };

  const selectAMember = (each, index, id) => {
    setShowSelectedFamilyIndex(!showSelectedFamilyIndex);

    setSelectedFamilyIndex(each);
    //  setFamilyTestingTrackerRequestDTO(response.data.familyIndexList)
    setFamilyIndexRequestDto(each);
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
    } else if (e.target.name === "familyIndexClient" && e.target.value !== "") {
      getSelectedDFamilyIndex(e.target.value);

      setPayload({
        ...payload,
        [e.target.name]: e.target.value,
        trackerSex:
          e.target.value === "FAMILY_INDEX_MOTHER"
            ? "SEX_FEMALE"
            : e.target.value === "FAMILY_INDEX_FATHER"
            ? "SEX_MALE"
            : "",
      });
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

    // if (payload.age !== "" && payload.age >= 85) {
    //   toggle();
    // }
  };
  const handleDateOfBirthChange = (e) => {
    if (e.target.value == "Actual") {
      familyIndexRequestDto.isDateOfBirthEstimated = false;
      setAgeDisabled2(true);
    } else if (e.target.value == "Estimated") {
      familyIndexRequestDto.isDateOfBirthEstimated = true;
      setAgeDisabled2(false);
    }
  };
  const handleAgeChange = (e) => {
    e.preventDefault();
    if (!ageDisabled) {
      // if (e.target.value !== "" && e.target.value >= 85) {
      //   toggle();
      // }
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
  
      setPayload({ ...payload, age: e.target.value });
    }
  };

  const handleAgeChange2 = (e) => {
        e.preventDefault();
        setErrorFamilyIndexDTO({ ...errorFamilyIndexDTO, [e.target.name]: "" });

    if (!ageDisabled2) {
      // if (e.target.value !== "" && e.target.value >= 85) {
      //   toggle();
      // }
        const currentDate = new Date();
        currentDate.setDate(15);
        currentDate.setMonth(5);
        const estDob = moment(currentDate.toISOString());
        const dobNew = estDob.add(e.target.value * -1, "years");
        setFamilyIndexRequestDto({
          ...familyIndexRequestDto,
          dateOfBirth: moment(dobNew).format("YYYY-MM-DD"),
        });
        familyIndexRequestDto.dateOfBirth = moment(dobNew).format("YYYY-MM-DD");
     
  
      setFamilyIndexRequestDto({
        ...familyIndexRequestDto,
        age: e.target.value,
      });
           setFamilyTestingTrackerRequestDTO({
          ...familyTestingTrackerRequestDTO, trackerAge: e.target.value
        })
    }
  };

  //End of Date of Birth and Age handling
  /*****  Validation  */
  const validate = () => {
    temp.familyIndexClient = payload.familyIndexClient
    ? ""
    : "This field is required.";


    temp.familyRelationship = familyIndexRequestDto.familyRelationship
    ? ""
    : "This field is required.";

    temp.dateOfBirth = familyIndexRequestDto.dateOfBirth
    ? ""
    : "This field is required.";   


    temp.statusOfContact = familyIndexRequestDto.statusOfContact
    ? ""
    : "This field is required.";
    
    setErrors({ ...temp });
    return Object.values(temp).every((x) => x == "");
  };

  const postPayload = (payload) => {
    axios
      .put(`${baseUrl}hts-family-index-testing/update-index-testing-and-index/${payload.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setSaving(false);

        toast.success("Family Index form save succesfully!");
        handleItemClick("fit-history", "risk");

        // if (props.history) {
        //   handleItemClick("pns-history", "fit");
        // } else {
        //   loadOtherForm();
        // }

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

    familyTestingTrackerRequestDTO.facilityId =
      facilityInfo.currentOrganisationUnitId;
    payload.familyIndexRequestDto = familyIndexRequestDto;
    payload.familyIndexRequestDto.familyTestingTrackerRequestDTO =
      familyTestingTrackerRequestDTO;
    payload.state = stateInfo;
    payload.lga = lgaInfo;
    if(validate()){
      postPayload(payload);
    }
    // updateFamilyIndexDTO( payload.familyIndexRequestDto)
  };

  const checkNumberLimit = (e) => {
    const limit = 11;
    const acceptedNumber = e.slice(0, limit);
    return acceptedNumber;
  };


  const getAttemptDisplay =(attempt)=>{
    console.log("This is an attempt",attempt)
if(attempt){  let ans =  indexVisitAttempt.filter((each, index)=>{
  return each.code === attempt  
})
if(ans[0].display){
  return ans[0].display
}else{
  return attempt
}}else{
  return "";
}
  }
    const FollowUpDisplay =(followUp)=>{
if(followUp){
  let ans =  followUpAppointmentLocation.filter((each, index)=>{
    return each.code === followUp  
  })
  if(ans[0].display){
    return ans[0].display
  }else{
    return followUp
  }
}else{
  return ""
}
  }
  const handleInputChangePhoneNumber = (e, inputName) => {
    const limit = 11;
    const NumberValue = checkNumberLimit(e.target.value.replace(/\D/g, ""));
    setPayload({ ...payload, [inputName]: NumberValue });
    if (inputName === "phoneNumber") {
      setPayload({ ...payload, [inputName]: NumberValue });
    }
    if (inputName === "alternatePhoneNumber") {
      setPayload({ ...payload, [inputName]: NumberValue });
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
                      type="date"                       onKeyPress={(e)=>{e.preventDefault()}}

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
                      disabled={props.action === "view" ? true : false}
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
                      disabled={true}
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
                      disabled={props.action === "view" ? true : false}
                    >
                      <option value={""}>Select</option>
                      {familyIndex &&
                        familyIndex.map((x, index) => (
                          <option key={x.id} value={x.code}>
                            {x.display}
                          </option>
                        ))}
                    </select>
                    {errors.familyIndexClient !== "" ? (
                      <span className={classes.error}>{errors.familyIndexClient}</span>
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
                      name="firstName"
                      id="firstName"
                      value={familyIndexRequestDto.firstName}
                      onChange={handlefamilyIndexRequestDto}
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
                      value={familyIndexRequestDto.middleName}
                      onChange={handlefamilyIndexRequestDto}
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
                      value={familyIndexRequestDto.lastName}
                      onChange={handlefamilyIndexRequestDto}
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
                      type="date"                       onKeyPress={(e)=>{e.preventDefault()}}

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
                    {/* {errors.dateOfBirth !== "" ? (
                      <span className={classes.error}>
                        {errors.dateOfBirth}
                      </span>
                    ) : (
                      ""
                    )} */}
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
                  </FormGroup>
                </div>

                <div className="form-group  col-md-4">
                  <FormGroup>
                    <Label>
                      Phone Number
                      <span style={{ color: "red" }}> *</span>
                    </Label>
                    <Input
                      type="text"
                      name="phoneNumber"
                      id="phoneNumber"
                      onChange={(e) => {
                        handleInputChangePhoneNumber(e, "phoneNumber");
                      }}
                      value={payload.phoneNumber}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.2rem",
                      }}
                      disabled
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
                      Alternative Contact Number
                      {/* <span style={{ color: "red" }}> *</span> */}
                    </Label>
                    <Input
                      type="text"
                      name="alternatePhoneNumber"
                      id="alternatePhoneNumber"
                      onChange={(e) => {
                        handleInputChangePhoneNumber(e, "alternatePhoneNumber");
                      }}
                      value={payload.alternatePhoneNumber}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.2rem",
                      }}
                      disabled={props.action === "view" ? true : false}
                    />
                  </FormGroup>
                </div>

                <div className="form-group  col-md-4">
                  <FormGroup>
                    <Label>
                             Descriptive Residential Address{" "}
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
                      type="date"                       onKeyPress={(e)=>{e.preventDefault()}}

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
                      disabled
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

                <div className="form-group col-md-4 ">
                  <Label>
                    {" "}
                    Recency Testing{" "}
                    <span> (for newly tested HIV-positive only) </span>{" "}
                  </Label>

                  {/* {
                    <FormGroup>
                      <Input
                        className="form-control"
                        name="finalRecencyResult"
                        id="finalRecencyResult"
                        type="text"
                        disabled
                        // value={recency.finalRecencyResult}
                        // onChange={handleInputChangeRecency}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                        disabled
                      />
                    </FormGroup>
                  } */}
                  <FormGroup>
                    <Input
                      type="text"
                      className="form-control"
                      name="recencyTesting"
                      id="reccencyTesting"
                      onChange={handleInputChange}
                      value={payload.recencyTesting}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.25rem",
                      }}
                      disabled
                    />
                    {/* <select
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
                      <option value="">Select</option> */}
                    {/* <option value="Recent Infection">Recent Infection</option>
                      <option value="Long Term Infection">
                        {" "}
                        Long Term Infection
                      </option>
                      <option value="Not Done">Not Done</option> */}
                    {/* </select> */}
                  </FormGroup>
                </div>

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
                                        disabled={props.action === "view" ? true : false}

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
                          type="date"                       onKeyPress={(e)=>{e.preventDefault()}}

                          name="dateClientEnrolledOnTreatment"
                          id="dateClientEnrolledOnTreatment"
                          value={payload.dateClientEnrolledOnTreatment}
                          onChange={handleInputChange}
                          min={
                            payload.dateIndexClientConfirmedHivPositiveTestResult
                          }
                          max={moment(new Date()).format("YYYY-MM-DD")}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                          }}
                  disabled={props.action === "view" ? true : false}
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
                {payload.isClientCurrentlyOnHivTreatment &&
                  payload.isClientCurrentlyOnHivTreatment === "Yes" && (
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
                                            disabled={props.action === "view" ? true : false}

                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </FormGroup>
                    </div>
                  )}
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
                                        disabled={props.action === "view" ? true : false}

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
                  <Label for="familyRelationship">Family Relationship      <span style={{ color: "red" }}> *</span>{" "}
                  </Label>
                  <select
                    className="form-control"
                    id="familyRelationship"
                    name="familyRelationship"
                    onChange={handlefamilyIndexRequestDto}
                    value={familyIndexRequestDto.familyRelationship}
              disabled={props.action === "view" ? true : false}

                  >
                    <option value="">Select</option>
                    {familyRelationship.map((value, index) => (
                      <option key={index} value={value.code}>
                        {value.display}
                      </option>
                    ))}
                  </select>
                  {errors.familyRelationship && (
                    <span className={classes.error}>
                      {errors.familyRelationship}
                    </span>
                  )}
                </FormGroup>
              </div>
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
                     disabled={props.action === "view" ? true : false}

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
                       disabled={props.action === "view" ? true : false}

                      />{" "}
                      Estimated
                    </label>
                  </div>
                </FormGroup>
              </div>
              <div className="form-group mb-3 col-md-4">
                <FormGroup>
                  <Label>Date                    <span style={{ color: "red" }}> *</span>{" "}
                  </Label>
                  <input
                    className="form-control"
                    type="date"                       onKeyPress={(e)=>{e.preventDefault()}}

                    name="dateOfBirth"
                    id="dateOfBirth"
                    // min={familyIndexRequestDto.dateVisit}
                    max={moment(new Date()).format("YYYY-MM-DD")}
                    value={familyIndexRequestDto.dateOfBirth}
                    onChange={handleDobChange2}
                    style={{
                      border: "1px solid #014D88",
                      borderRadius: "0.2rem",
                    }}
                    disabled={props.action === "view" ? true : false}
                  />
                   {errors.dateOfBirth && (
                    <span className={classes.error}>
                      {errors.dateOfBirth}
                    </span>
                  )}
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
                    value={familyIndexRequestDto.age}
                    disabled={ageDisabled2}
                    onChange={handleAgeChange2}
                    style={{
                      border: "1px solid #014D88",
                      borderRadius: "0.2rem",
                    }}

                  />
                  {errorFamilyIndexDTO.age && (
                      <span className={classes.error}>
                        {errorFamilyIndexDTO.age}
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
                     disabled={props.action === "view" ? true : false}

                    >
                      <option value="">Select</option>
                      {childNumber.map((each) => (
                        <option key={each.id} value={each.id}>
                          {each.display}
                        </option>
                      ))}

                      {/* <option value="others">Others</option> */}
                    </select>
                    {errorFamilyIndexDTO.childNumber && (
                      <span className={classes.error}>
                        {errorFamilyIndexDTO.childNumber}
                      </span>
                    )}
                  </FormGroup>
                </div>
              )}

{showOther && (
                <div className="form-group  col-md-4">
                  <FormGroup>
                    <Label>
                      Others
                      <span style={{ color: "red" }}> *</span>
                    </Label>
                    <Input
                      type="number"
                      name="otherChildNumber"
                      id="otherChildNumber"
                      onChange={handlefamilyIndexRequestDto}
                      value={familyIndexRequestDto.otherChildNumber}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.2rem",
                      }}
                    />
                    {errors.otherChildNumber !== "" ? (
                      <span className={classes.error}>
                        {errors.otherChildNumber}
                      </span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </div>
              )}
              {familyIndexRequestDto.familyRelationship ===
                "FAMILY_RELATIONSHIP_BIOLOGICAL_CHILD" && (
                <div className="form-group col-md-4">
                  <FormGroup>
                    <Label for="childNumber">Child Dead</Label>
                    <select
                      className="form-control"
                      id="childDead"
                      name="childDead"
                      onChange={handlefamilyIndexRequestDto}
                      value={familyIndexRequestDto.childDead}
                    disabled={props.action === "view" ? true : false}

                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                    {/* {errorFamilyIndexDTO.childNumber && (
                      <span className={classes.error}>
                        {errorFamilyIndexDTO.childNumber}
                      </span>
                    )} */}
                  </FormGroup>
                </div>
              )}
              {/* <div className="form-group col-md-4">
                <FormGroup>
                  <Label for="DateofHTS">Other Child Number </Label>
                  <Input
                    type="date"                       onKeyPress={(e)=>{e.preventDefault()}}

                    name="otherChildNumber"
                    id="otherChildNumber"
                    value={familyIndexRequestDto.otherChildNumber}
                    onChange={handlefamilyIndexRequestDto}
                    min="1929-12-31"
                    max={moment(new Date()).format("YYYY-MM-DD")}
                    style={{
                      border: "1px solid #014D88",
                      borderRadius: "0.25rem",
                    }}
                    // disabled
                  />
                  {errorFamilyIndexDTO.familyRelationship && (
                    <span className={classes.error}>
                      {errorFamilyIndexDTO.familyRelationship}
                    </span>
                  )}
                </FormGroup>
              </div> */}
              {familyIndexRequestDto.familyRelationship ===
                "FAMILY_RELATIONSHIP_BIOLOGICAL_CHILD" && (
                <div className="form-group col-md-4">
                  <FormGroup>
                    <Label for="liveWithParent">Live with Parent</Label>
                    <select
                      className="form-control"
                      id="liveWithParent"
                      name="liveWithParent"
                      onChange={handlefamilyIndexRequestDto}
                      value={familyIndexRequestDto.liveWithParent}
                  disabled={props.action === "view" ? true : false}
  
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </FormGroup>
                </div>
              )}
         { showHTSDate &&   <div className="form-group col-md-4">
                <FormGroup>
                  <Label for="DateofHTS">Date of HTS</Label>
                  <Input
                    type="date"                       onKeyPress={(e)=>{e.preventDefault()}}

                    name="dateOfHts"
                    id="dateOfHts"
                    value={familyIndexRequestDto.dateOfHts}
                    onChange={handlefamilyIndexRequestDto}
                    min="1929-12-31"
                    max={moment(new Date()).format("YYYY-MM-DD")}
                    style={{
                      border: "1px solid #014D88",
                      borderRadius: "0.25rem",
                    }}
                  disabled={props.action === "view" ? true : false}
                  />
                  {errorFamilyIndexDTO.familyRelationship && (
                    <span className={classes.error}>
                      {errorFamilyIndexDTO.familyRelationship}
                    </span>
                  )}
                </FormGroup>
              </div>
     }
              <div className="form-group col-md-4">
                <FormGroup>
                  <Label for="statusOfContact">Contact HIV Status                    <span style={{ color: "red" }}> *</span>{" "}
                  </Label>
                  <select
                    className="form-control"
                    id="statusOfContact"
                    name="statusOfContact"
                    onChange={handlefamilyIndexRequestDto}
                    value={familyIndexRequestDto.statusOfContact}
                   disabled={props.action === "view" ? true : false}

                  >
                    <option value="">Select</option>
                    {statusOfContact.map((value, index) => (
                      <option key={index} value={value.code}>
                        {value.display}
                      </option>
                    ))}
                  </select>
                  {errors.statusOfContact && (
                    <span className={classes.error}>
                      {errors.statusOfContact}
                    </span>
                  )}
                </FormGroup>
              </div>

              {familyIndexRequestDto.statusOfContact &&
                familyIndexRequestDto.statusOfContact ===
                  "FAMILY_INDEX_HIV_STATUS_CURRENT_ON_ART" && (
                  <div className="form-group col-md-4">
                    <FormGroup>
                      <Label for="uan">Unique Art No (UAN)</Label>
                      <input
                        className="form-control"
                        id="uan"
                        type="text"
                        name="uan"
                        value={familyIndexRequestDto.uan}
                        onChange={handlefamilyIndexRequestDto}
                        disabled={
                          familyIndexRequestDto.statusOfContact !==
                          "FAMILY_INDEX_HIV_STATUS_CURRENT_ON_ART"
                        }

                      />
                      {errors.uan && (
                        <span className={classes.error}>{errors.uan}</span>
                      )}
                    </FormGroup>
                  </div>
                )}

              {familyIndexRequestDto.familyRelationship &&
                familyIndexRequestDto.familyRelationship !==
                  "FAMILY_RELATIONSHIP_MOTHER" && (
                  <div className="form-group col-md-4">
                    <FormGroup>
                      <Label for="motherDead">Mother Dead?</Label>
                      <select
                        className="form-control"
                        id="motherDead"
                        name="motherDead"
                        onChange={handlefamilyIndexRequestDto}
                        value={familyIndexRequestDto.motherDead}
                        disabled={props.action === "view" ? true : false}

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
                )}

              {familyIndexRequestDto.motherDead === "Yes" && (
                <div className="form-group col-md-4">
                  <FormGroup>
                    <Label for="yearMotherDied">Year Mother Died</Label>
                    <input
                      className="form-control"
                      id="yearMotherDied"
                      type="date"                       onKeyPress={(e)=>{e.preventDefault()}}

                      min="1929-12-31"
                      max={moment(new Date()).format("YYYY-MM-DD")}
                      name="yearMotherDead"
                      value={familyIndexRequestDto.yearMotherDead}
                      onChange={handlefamilyIndexRequestDto}
                  disabled={props.action === "view" ? true : false}

                    />
                    {errorFamilyIndexDTO.yearMotherDead && (
                      <span className={classes.error}>
                        {errorFamilyIndexDTO.yearMotherDead}
                      </span>
                    )}
                  </FormGroup>
                </div>
              )}

              {familyIndexRequestDto.childDead === "yes" && (
                <div className="form-group col-md-4">
                  <FormGroup>
                    <Label for="yearMotherDied">Year Child Died</Label>
                    <input
                      className="form-control"
                      id="yearMotherDied"
                      type="date"                       onKeyPress={(e)=>{e.preventDefault()}}

                      min="1929-12-31"
                      max={moment(new Date()).format("YYYY-MM-DD")}
                      name="yearChildDead"
                      value={familyIndexRequestDto.yearChildDead}
                      onChange={handlefamilyIndexRequestDto}
                     disabled={props.action === "view" ? true : false}

                    />
                    {errorFamilyIndexDTO.yearChildDead && (
                      <span className={classes.error}>
                        {errorFamilyIndexDTO.yearChildDead}
                      </span>
                    )}
                  </FormGroup>
                </div>
              )}
              {/* {addIndexTracker && (
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
              </div> */}
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

              {/* {arrayFamilyIndexRequestDto &&
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
                                    "statusOfContact",
                                    each.statusOfContact
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
                )} */}
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
              <div className="row ">
                {!viewFamilyTrackerForm && props.action === "update" && (
                  <div className="form-group mb-3  col-md-12 ">
                    <div class="d-flex justify-content-end">
                      <LabelSui
                        as="a"
                        color="black"
                        onClick={showFamilyTrackerRow}
                        size="small"
                        style={{ marginTop: 20 }}
                      >
                        <Icon name="plus" /> Add New Attempt
                      </LabelSui>
                    </div>
                  </div>
                )}
                {viewFamilyTrackerForm && (
                  <>
                    <div className="form-group col-md-4">
                      <FormGroup>
                        <Label for="positionOfChildEnumerated">
                          Position of the Child Enumerated
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
            disabled={props.action === "view" ? true : false}

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
                      disabled={props.action === "view" ? true : false}

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
                          disabled={true}
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
                        disabled={props.action === "view" ? true : false}

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
                          Schedule Visit Date
                          {/* <span style={{ color: "red" }}> *</span>{" "} */}
                        </Label>
                        <Input
                          type="date"                       onKeyPress={(e)=>{e.preventDefault()}}

                          name="scheduleVisitDate"
                          id="scheduleVisitDate"
                          value={
                            familyTestingTrackerRequestDTO?.scheduleVisitDate
                          }
                          onChange={handlefamilyTestingTrackerRequestDTO}
                          min="1929-12-31"
                          max={moment(new Date()).format("YYYY-MM-DD")}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                          }}
                  disabled={props.action === "view" ? true : false}
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
                        <Label for="">Date visited</Label>
                        <Input
                          type="date"                       onKeyPress={(e)=>{e.preventDefault()}}

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
                  disabled={props.action === "view" ? true : false}

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
                          Attempts
                          {/* <span style={{ color: "red" }}> *</span>{" "} */}
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
      disabled={props.action === "view" ? true : false}
         
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
                      <Label>Known HIV Status ?</Label>
                      <FormGroup>
                        <select
                          className="form-control"
                          name="knownHivPositive"
                          id="knownHivPositive"
                          onChange={handlefamilyTestingTrackerRequestDTO}
                          value={
                            familyTestingTrackerRequestDTO?.knownHivPositive
                          }
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                    disabled={props.action === "view" ? true : false}
 
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </FormGroup>
                    </div>
                    {familyTestingTrackerRequestDTO.knownHivPositive &&
                      familyTestingTrackerRequestDTO.knownHivPositive ===
                        "Yes" && (
                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="">Date Tested</Label>
                            <Input
                              type="date"                       onKeyPress={(e)=>{e.preventDefault()}}

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
                           disabled={props.action === "view" ? true : false}

                            />
                            {errors.dateTested !== "" ? (
                              <span className={classes.error}>
                                {errors.dateTested}
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
                              value={
                                familyTestingTrackerRequestDTO.hiveTestResult
                              }
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                              disabled={props.action === "view" ? true : false}

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
                            {familyTestingTrackerRequestDTO?.knownHivPositive ===
                      "Yes" && (
                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="">Date Enrolled On ART</Label>
                          <Input
                            type="date"                       onKeyPress={(e)=>{e.preventDefault()}}

                            name="dateEnrolledOnArt"
                            id="dateEnrolledOnArt"
                            value={
                              familyTestingTrackerRequestDTO?.dateEnrolledOnArt
                            }
                            onChange={handlefamilyTestingTrackerRequestDTO}
                            min="1929-12-31"
                            max={moment(new Date()).format("YYYY-MM-DD")}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.25rem",
                            }}
                        disabled={props.action === "view" ? true : false}

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
                    {familyTestingTrackerRequestDTO?.trackerAge < 21 && (
                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="">Date Enrolled In Ovc</Label>
                          <Input
                            type="date"                       onKeyPress={(e)=>{e.preventDefault()}}

                            name="dateEnrolledInOVC"
                            id="dateEnrolledInOVC"
                            value={
                              familyTestingTrackerRequestDTO?.dateEnrolledInOVC
                            }
                            onChange={handlefamilyTestingTrackerRequestDTO}
                            min="1929-12-31"
                            max={moment(new Date()).format("YYYY-MM-DD")}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.25rem",
                            }}
                  disabled={props.action === "view" ? true : false}

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
              

                  {props.action === "update" &&  <div className="form-group mb-3 col-md-12">
                      {addNewAttempt ? (
                        <LabelSui
                          as="a"
                          color="black"
                          onClick={addFamilyTrackerRow}
                          size="small"
                          style={{ marginTop: 35 }}
                        >
                          <Icon name="plus" /> Add New Tracker
                        </LabelSui>
                      ) : (
                        <LabelSui
                          as="a"
                          color="black"
                          onClick={updateFamilyTrackerRow}
                          size="small"
                          style={{ marginTop: 35 }}
                        >
                          <Icon name="plus" /> Update Family index
                        </LabelSui>
                      )}
                    </div>}
                  </>
                )}
              </div>
            </div>

            {/* arrayFamilyTestingTrackerRequestDTO.length > 0 && */}
            {
              <List>
                <Table striped responsive>
                  <thead>
                    <tr >
                      <th style={{ fontSize: "15px"}}>Attempt</th>

                     <th style={{ fontSize: "15px"}}>Schedule Visit Date</th>
                     <th style={{ fontSize: "15px"}}>Follow Up Appointment Location</th>
                     <th style={{ fontSize: "15px"}}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    { arrayFamilyTestingTrackerRequestDTO.map((each, index) => {
                      return (
                        <tr key={index}>
                          <td>{ each?.attempt && getAttemptDisplay(each?.attempt)}</td>
                          <td>{each?.scheduleVisitDate}</td>

                          <td>
                            {each?.followUpAppointmentLocation && FollowUpDisplay(each.followUpAppointmentLocation)}
                          </td>
                          <td>
                            {/* props.action === "update" */}
                            {props.action === "update" ? (
                              <>
                                <IconButton
                                  aria-label="update"
                                  size="small"
                                  color="success"
                                  onClick={() =>
                                    viewFamilyTrackerRow(each, index)
                                  }
                                >
                                  <CreateIcon fontSize="inherit" />
                                </IconButton>

                                <IconButton
                                  aria-label="delete"
                                  size="small"
                                  color="error"
                                  onClick={() =>
                                    removeFamilyTrackerRow(index, each)
                                  }
                                >
                                  <DeleteIcon fontSize="inherit" />
                                </IconButton>
                              </>
                            ) : (
                              <IconButton
                                aria-label="delete"
                                size="small"
                                color="success"
                                onClick={() =>
                                  viewFamilyTrackerRow(each, index)
                                }
                              >
                                <RemoveRedEyeIcon fontSize="inherit" />
                              </IconButton>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </List>
            }

            <br />
            <div className="row">
            { props.action === "update"  &&
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
                  content="Update"
                  type="submit"
                  icon="right arrow"
                  labelPosition="right"
                  style={{ backgroundColor: "#014d88", color: "#fff" }}
                  onClick={handleSubmit}
                  disabled={saving}
                />
              </div>}
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
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Notification!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Would you like to fill the Partner Service Form?</h4>
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

export default ViewFamilyIndexTestingForm;
