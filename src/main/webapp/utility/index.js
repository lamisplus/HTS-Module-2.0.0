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

//check modality
export const getCheckModality = (patientObj) => {


  console.log("MODALITY CHECK UP ", patientObj);
  if (
    patientObj === "TEST_SETTING_STI_STI" ||
    patientObj === "TEST_SETTING_TB_TB" ||
    patientObj === "TEST_SETTING_CT_TB" ||
    patientObj === "TEST_SETTING_CT_STI" ||
    patientObj === "TEST_SETTING_CT_PMTCT" ||
    patientObj === "TEST_SETTING_OPD_STI" ||
    patientObj === "TEST_SETTING_OTHERS_PMTCT_(ANC1_ONLY)" ||
    patientObj === "TEST_SETTING_OTHERS_POST_ANC1_BREASTFEEDING" ||
    patientObj === "TEST_SETTING_OTHERS_POST_ANC1_PREGNANT_L&D" ||
    patientObj === "TEST_SETTING_STANDALONE_HTS_PMTCT_(ANC1_ONLY)" ||
    patientObj === "TEST_SETTING_STANDALONE_HTS_POST_ANC1_BREASTFEEDING" ||
    patientObj === "TEST_SETTING_STANDALONE_HTS_POST_ANC1_PREGNANT_L&D" ||
    patientObj === "TEST_SETTING_STANDALONE_HTS_STI" ||
    patientObj === "TEST_SETTING_STANDALONE_HTS_TB" ||
    patientObj === "PMTCT (Post ANC1: Pregnancy/L&D/BF)" ||
    patientObj === "Post ANC1 Pregnant/L&D ? 72hrs" ||
    patientObj === "TEST_SETTING_STANDALONE_HTS_PMTCT_(POST_ANC1:_PREGNANCYL&DBF)"
  ) {
    console.log("IT IS SKIP");
    return "skip";
  } else {
    return "fill";
  }
};

//check modality for new HTS
export const getCheckModalityForHTS = (patientObj) => {
  console.log(patientObj);
  if (
    patientObj === "TEST_SETTING_CT_PMTCT" ||
    patientObj === "TEST_SETTING_OTHERS_PMTCT_(ANC1_ONLY)" ||
    patientObj === "TEST_SETTING_OTHERS_POST_ANC1_BREASTFEEDING" ||
    patientObj === "TEST_SETTING_OTHERS_POST_ANC1_PREGNANT_L&D" ||
    patientObj === "TEST_SETTING_STANDALONE_HTS_PMTCT_(ANC1_ONLY)" ||
    patientObj === "TEST_SETTING_STANDALONE_HTS_POST_ANC1_BREASTFEEDING" ||
    patientObj === "TEST_SETTING_STANDALONE_HTS_POST_ANC1_PREGNANT_L&D" ||
    patientObj === "PMTCT (Post ANC1: Pregnancy/L&D/BF)" ||
    patientObj === "Post ANC1 Pregnant/L&D ? 72hrs" ||
    patientObj ===
      "TEST_SETTING_STANDALONE_HTS_PMTCT_(POST_ANC1:_PREGNANCYL&DBF)"
  ) {
    return "show";
  } else {
    return "hidden";
  }
};
