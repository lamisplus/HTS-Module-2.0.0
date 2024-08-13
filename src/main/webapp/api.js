export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzIzNTYzNjIzfQ.CJTl62KvAxRiiFO5PTBzbyHpXH_vANxM1X4UZ4KQY2rUzfZZLevRRHeIXNrxcrW0fw6rQKFk2AHZWd5bAD97zQ"
    : new URLSearchParams(window.location.search).get("jwt");

let payload = {
  attempt: "string",
  dateEnrolledInOVC: "string",
  dateEnrolledOnArt: "string",
  dateTested: "string",
  dateVisit: "string",
  facilityId: 0,
  familyIndexId: 0,
  followUpAppointmentLocation: "string",
  hiveTestResult: "string",
  knownHivPositive: "string",
  ovcId: "string",
  positionOfChildEnumerated: 0,
  scheduleVisitDate: "string",
  trackerAge: 0,
  trackerSex: "string",
};


let newd = {
  attempt: "ATTEMPTS_5",
  dateEnrolledInOVC: "2024-08-08",
  dateEnrolledOnArt: "",
  dateTested: "2024-08-01",
  dateVisit: "2024-08-01",
  facilityId: "1761",
  //no familyIndexId
  followUpAppointmentLocation: "FOLLOW_UP_APPOINTMENT_LOCATION_OTHERS",
  hiveTestResult: "",
  knownHivPositive: "Yes",
  ovcId: "",
  positionOfChildEnumerated: "3",
  scheduleVisitDate: "2024-08-01",
  trackerAge: 19,
  trackerSex: "SEX_FEMALE",
};