import { token, url as baseUrl } from "../api";
import axios from "axios";
import Cookies from "js-cookie";
//To make a text field accept alphabet value only
export const alphabetOnly = (value) => {
  const result = value.replace(/[^a-z]/gi, "");
  return result;
};

//*********************** REUSABLE API *****************8*/

// Get all genders
export const getAllGenders = async () => {
  try {
    const response = await axios.get(`${baseUrl}application-codesets/v2/SEX`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (e) {}
};

//Get all country
export const getAllCountry = async () => {
  try {
    const response = await axios.get(
      `${baseUrl}organisation-units/parent-organisation-units/0`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (e) {}
};

//
//

//Get all state by state by country Id
export const getAllStateByCountryId = async () => {
  try {
    const response = await axios.get(
      `${baseUrl}organisation-units/parent-organisation-units/1`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (e) {}
};

//Get all state by province by state Id (it needs stateId as parameter)
export const getAllProvinces = async (stateId) => {
  try {
    const response = await axios.get(
      `${baseUrl}organisation-units/parent-organisation-units/${stateId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (e) {}
};

//Get all state by province by state Id (it needs stateId as parameter)
export const getAcount = async () => {
  try {
    const response = await axios.get(`${baseUrl}account`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    Cookies.set("facilityName", response.data.currentOrganisationUnitName);

    return response.data;
  } catch (e) {}
};
//get if patient is pregnant



export const checkPregnantPatient =  async(id) => {
   try {
     const response = await axios.get(
       `${baseUrl}application-codesets/v2/PREGNANCY_STATUS`,
       {
         headers: { Authorization: `Bearer ${token}` },
       }
     );
     //Get the pregnant object
     let result = response.data.filter((each, index) => {
       return each.code === "PREGANACY_STATUS_PREGNANT";
     });
     //compare the object id with  parameter

    //  console.log(result[0].id, id, Number(result[0].id) === Number(id));

    //  return result[0].id;
     if (Number(result[0].id) === Number(id)) {
       // return true;
       return true;
     } else {
       return false;
     }
   } catch (e) {}


  

};






// TEST_SETTING_OTHERS_PMTCT_(POST_ANC1:_PREGNANCYL&DBF)

//check modality
export const getCheckModality = (patientObj) => {
  if (
    patientObj ===  "FACILITY_HTS_TEST_SETTING_ANC" ||
    patientObj === "FACILITY_HTS_TEST_SETTING_L&D" ||
    patientObj === "FACILITY_HTS_TEST_SETTING_POST_NATAL_WARD_BREASTFEEDING" 
  ) {


    return "skip";
  } else {
    localStorage.setItem("modality", "fill");
    return "fill";
  }
};

//check modality for new HTS
export const getCheckModalityForHTS = (patientObj) => {
  if (
    patientObj ===  "FACILITY_HTS_TEST_SETTING_ANC" ||
    patientObj === "FACILITY_HTS_TEST_SETTING_L&D" ||
    patientObj === "FACILITY_HTS_TEST_SETTING_POST_NATAL_WARD_BREASTFEEDING" 
  ) {
    return "show";
  } else {
    return "hidden";
  }
};

// Permission implementation

const generateFormCode = (formName) => {
  switch (formName) {
    case "Risk_Stratification":
      return {
        name: "Risk_Stratification",
        code: "risk",
        general: true,
        condition: [],
      };
      break;
    case "Client_intake_form":
      return {
        name: "Client_intake_form",
        code: "basic",
        general: true,
        condition: [],
      };
      break;
    case "Pre_Test_Counseling":
      return {
        name: "Pre_Test_Counseling",
        code: "pre-test-counsel",
        general: true,
        condition: ["age < 15", "pmtct modality"],
      };
      break;
    case "Request_and_Result_Form":
      return {
        name: "Request_and_Result_Form",
        code: "hiv-test",
        general: true,
        condition: [],
      };
      break;
    case "Post_Test_Counseling":
      return {
        name: "Post_Test_Counseling",
        code: "post-test",
        general: true,
        condition: [],
      };
      break;
    case "HIV_Recency_Testing":
      return {
        name: "HIV_Recency_Testing",
        code: "recency-testing",
        general: true,
        condition: ["age < 15", "-HIV status"],
      };
      break;
    case "Nigeria_PNS_Form":
      return {
        name: "Nigeria_PNS_Form",
        code: "pns",
        general: false,
        condition: ["-HIV status"],
      };
      break;
    case "Referral_Form":
      return {
        name: "Referral_Form",
        code: "refferal-history",
        general: false,
        condition: [],
      };
  }
};

// note people with that condition will not see the form
let ArrayOfAllForms = [
  {
    name: "Risk_Stratification",
    code: "risk",
    general: true,
    condition: [],
  },
  { name: "Client_intake_form", code: "basic", general: true, condition: [] },
  {
    name: "Pre_Test_Counseling",
    code: "pre-test-counsel",
    general: true,
    condition: ["age < 15", "pmtct modality"],
  },
  {
    name: "Request_and_Result_Form",
    code: "hiv-test",
    general: true,
    condition: [],
  },
  {
    name: "Post_Test_Counseling",
    code: "post-test",
    general: true,
    condition: [],
  },
  {
    name: "HIV_Recency_Testing",
    code: "recency-testing",
    general: true,
    condition: ["age < 15", "-HIV status"],
  },
  {
    name: "Family_Index_Testing_Form",
    code: "fit",
    general: false,
    condition: ["-HIV status"],
  },
  {
    name: "Nigeria_PNS_Form",
    code: "pns",
    general: false,
    condition: ["-HIV status"],
  },
  {
    name: "Referral_Form",
    code: "refferal-history",
    general: false,
    condition: [],
  },
];




export const getListOfPermission = (permittedForms) => {

  let newListOfForms = [];

  //if it is admin then return all form
  if (permittedForms.includes("all_permission")) {
    return ArrayOfAllForms;
  } else {
    // map through all form array using nuser as the argument

    ArrayOfAllForms.map((each, index) => {
      if (each.general) {
        newListOfForms.push(each);
      } else {
        if (permittedForms.includes(each.name)) {
          // generate object body
          let objGenerated = generateFormCode(each.name);
          newListOfForms.push(objGenerated);
        }
      }
    });

    return newListOfForms;
  }
};


export const getNextForm = (formName, age, pmtctModality, hivStatus) => {
  let ageCondition = undefined;
  let pmctctModalityCondition = undefined;
  let HivStatuscondition = undefined;
   pmtctModality = pmtctModality
     ? pmtctModality
     : localStorage.getItem("modality");

  let authorizedForm = JSON.parse(localStorage.getItem("generatedPermission"));

  let lengthOfAuthForm = authorizedForm.length;

  // get the index of the form
  let IndexOfForm = authorizedForm.findIndex((each) => {
    return each.name === formName;
  });

  // use the index of the form to send the code of the next page
  let nextPage;

  if (lengthOfAuthForm > IndexOfForm + 1) {
    nextPage = IndexOfForm + 1;

    let nextForm = authorizedForm[nextPage];

    // console.log([nextForm.code, authorizedForm[IndexOfForm].code]);

    //  confirm if there are no condition on the  NEXT form
    if (nextForm.condition.length === 0) {
      return [nextForm.code, authorizedForm[IndexOfForm].code];
    } else {
      let answer = loopThroughForms(
        nextForm,
        authorizedForm[IndexOfForm],
        IndexOfForm,
        age,
        pmtctModality,
        hivStatus
      );
      return answer;
    }

    //
  } else {
      return [
        authorizedForm[IndexOfForm].code,
        authorizedForm[IndexOfForm].code,
      ];
  }
};

//function to double skip a form due to other condition

export const getDoubleSkipForm = (code) => {
  let authorizedForm = JSON.parse(localStorage.getItem("generatedPermission"));

  let lengthOfAuthForm = authorizedForm.length;

  // get the index of the form
  let IndexOfForm = authorizedForm.findIndex((each) => {
    return each.code === code;
  });

  // use the index of the form to send the code of the next page
  let nextPage;

  if (lengthOfAuthForm > IndexOfForm + 1) {
    nextPage = IndexOfForm + 1;

    let nextForm = authorizedForm[nextPage];

    // console.log([nextForm.code, authorizedForm[IndexOfForm].code]);

    return [nextForm.code, authorizedForm[IndexOfForm].code];
  } else {
    return "non";
  }
};

export const checkNextPageCondition = (
  nextForm,
  currentForm,
  IndexOfForm,
  age,
  pmtctModality,
  hivStatus
) => {
  let ageCondition = undefined;
  let pmctctModalityCondition = undefined;
  let HivStatuscondition = undefined;
let authorizedForm = JSON.parse(localStorage.getItem("generatedPermission"));


 

 if (nextForm.condition.length === 0) {

    return [nextForm.code, authorizedForm[IndexOfForm].code];

 } else {
   // check if patient obj conform with the codition
   nextForm.condition.map((each, index) => {
     if (each === "age < 15") {
       ageCondition = age < 15 ? true : false;
     } else if (each === "pmtct modality") {
       pmctctModalityCondition = pmtctModality === "skip" ? true : false;
     } else if (each === "-HIV status" && hivStatus) {
       HivStatuscondition =
         hivStatus.toLowerCase() === "negative" ? true : false;
     } else if (each === "-HIV status" && !hivStatus) {
       HivStatuscondition = true
       
     }
   });
   //type of form
   let checkformType = [
     ageCondition,
     pmctctModalityCondition,
     HivStatuscondition,
   ];

   let confirmedFormType = checkformType.filter((each, index) => {
     return each !== undefined;
   });

  //  console.log("total condition seen", confirmedFormType);
   // check if any condition is true
   let answer = confirmedFormType.some((each) => {
     return each === true;
   });

   // skip to the next page ie +1+1
   if (answer) {
     // indexPage +1 +1 check the next page condtion ;

     return "recall " + IndexOfForm;
   } else {
     return [nextForm.code, authorizedForm[IndexOfForm].code];
   }
 }
};

export const loopThroughForms = (
  nextForm,
  currentForm,
  IndexOfForm,
  age,
  pmtctModality,
  hivStatus
) => {
let authorizedForm = JSON.parse(localStorage.getItem("generatedPermission"));
let latestNextForm = nextForm;
let nextFormIndex =
  authorizedForm.length > IndexOfForm + 1 ? IndexOfForm + 1 : IndexOfForm;

  //get the index of the next form

  for (let i = nextFormIndex; i < authorizedForm.length; i++) {
   
    let theNextPage = checkNextPageCondition(
      authorizedForm[i],
      authorizedForm[IndexOfForm],
      IndexOfForm,
      age,
      pmtctModality,
      hivStatus
    );

    if (theNextPage.includes("recall")) {
      // console.log(authorizedForm[i]);
    } else {
      return theNextPage;
    }
  }
};


export const loopThroughFormBackward = (
  nextForm,
  currentForm,
  IndexOfForm,
  age,
  pmtctModality,
  hivStatus
) => {
  let authorizedForm = JSON.parse(localStorage.getItem("generatedPermission"));
  // console.log("length of the authorized form ", authorizedForm.length);
  let nextFormIndex =
  IndexOfForm - 1 >= 0 ? IndexOfForm - 1 : IndexOfForm;

  //get the index of the next form

  for (let i = nextFormIndex; i > 0; i--) {
    let theNextPage = checkNextPageCondition(
      authorizedForm[i],
      authorizedForm[IndexOfForm],
      IndexOfForm,
      age,
      pmtctModality,
      hivStatus
    );

    if (theNextPage.includes("recall")) {
      // console.log(authorizedForm[i]);
    } else {
      return theNextPage;
    }
  }
};
export const getPreviousForm = (formName, age, pmtctModality, hivStatus) => {

  let ageCondition = undefined;
  let pmctctModalityCondition = undefined;
  let HivStatuscondition = undefined;
  pmtctModality = pmtctModality !== ""
    ? pmtctModality
    : localStorage.getItem("modality");

  let authorizedForm = JSON.parse(localStorage.getItem("generatedPermission"));

  let lengthOfAuthForm = authorizedForm.length;

  // get the index of the form
  let IndexOfForm = authorizedForm.findIndex((each) => {
    return each.name === formName;
  });

  // use the index of the form to send the code of the next page
  let prevPage;

  
  if (IndexOfForm - 1 >= 0) {
    prevPage = IndexOfForm - 1;

    let nextForm = authorizedForm[prevPage];

   

    //  confirm if there are no condition on the  NEXT form
    if (nextForm.condition.length === 0) {
      return [nextForm.code, authorizedForm[IndexOfForm].code];
    } else {
      let answer = loopThroughFormBackward(
        nextForm,
        authorizedForm[IndexOfForm],
        IndexOfForm,
        age,
        pmtctModality,
        hivStatus
      );
       return answer;
    }

    //
  } else {
    return ["", ""];
  }
};