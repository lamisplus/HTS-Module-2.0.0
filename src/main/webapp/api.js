export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzIzNTA3NzM5fQ.eQ5Erdkmztw-geYSNGK_rCxr352uchJn2ymK2NOZbqPZoN-11YhEhA7TqH2x_CusMrMaY6UiK8omaxbM3SYUAg"
    : new URLSearchParams(window.location.search).get("jwt");

let payload = {
  // id: 7,
  // uuid: "2136917a-dbf8-4bb8-bc2b-5734a36429c8",
  // familyRelationship: "FAMILY_RELATIONSHIP_FATHER",
  // statusOfContact: "FAMILY_INDEX_HIV_STATUS_CURRENT_ON_ART",
  // childNumber: 0,
  // motherDead: "Yes",
  // yearMotherDead: "2024-08-06",
  // familyIndexTestingUuid: "5d6a5f5b-168e-4dc1-b881-ae17012efbc8",
  // dateOfHts: "2024-08-02",
  // dateOfBirth: "2024-08-01",
  // age: 0,
  // firstName: "Paso",
  // lastName: "Ayuba",
  // middleName: "",
  // childDead: "",
  // yearChildDead: null,
  // liveWithParent: "",
  familyTestingTrackerResponseDTO: [
    {
      id: 7,
      uuid: "cb2ad221-7b0b-42d4-bedf-13950e5ffbef",
      familyIndex: 7,
      positionOfChildEnumerated: 7,
      trackerSex: "SEX_MALE",
      trackerAge: 10,
      scheduleVisitDate: "2024-08-01",
      followUpAppointmentLocation: "FOLLOW_UP_APPOINTMENT_LOCATION_HOME",
      dateVisit: "2024-07-30",
      knownHivPositive: "No",
      hiveTestResult: "Tested Positive",
      dateTested: "2024-08-07",
      dateEnrolledOnArt: null,
      dateEnrolledInOVC: "2024-08-09",
      ovcId: "",
      facilityId: 1761,
      familyIndexUuid: "2136917a-dbf8-4bb8-bc2b-5734a36429c8",
      attempt: "ATTEMPTS_1",
    },
    {
      attempt: "ATTEMPTS_2",
      dateEnrolledInOVC: "2024-07-31",
      dateEnrolledOnArt: "2024-08-02",
      dateTested: "", //need props value
      dateVisit: "2024-07-30",
      facilityId: "", //need props value
      // not there       familyIndex: 0,
      //not thee          familyIndexUuid: "string"
      followUpAppointmentLocation: "FOLLOW_UP_APPOINTMENT_LOCATION_HOME",
      hiveTestResult: "",
      //not there          id: 0,  and no value
      knownHivPositive: "No",
      ovcId: "",
      positionOfChildEnumerated: "2",
      scheduleVisitDate: "2024-07-30",
      trackerAge: "3",
      trackerSex: "SEX_MALE",
      //not thee                uuid: "string",  and no value
    },
  ],
  // isDateOfBirthEstimated: null,
  // uan: "",
};

let expected = {
  age: 0,
  childDead: "string",
  childNumber: 0,
  dateOfBirth: "string",
  dateOfHts: "string",
  familyIndexTestingUuid: "string",
  familyRelationship: "string",
  familyTestingTrackerResponseDTO: [
    {
      id: 7,
      uuid: "cb2ad221-7b0b-42d4-bedf-13950e5ffbef",
      familyIndex: 7,
      positionOfChildEnumerated: 7,
      trackerSex: "SEX_MALE",
      trackerAge: 10,
      scheduleVisitDate: "2024-08-01",
      followUpAppointmentLocation: "FOLLOW_UP_APPOINTMENT_LOCATION_HOME",
      dateVisit: "2024-07-30",
      knownHivPositive: "No",
      hiveTestResult: "Tested Positive",
      dateTested: "2024-08-07",
      dateEnrolledOnArt: null,
      dateEnrolledInOVC: "2024-08-09",
      ovcId: "",
      facilityId: 1761,
      familyIndexUuid: "2136917a-dbf8-4bb8-bc2b-5734a36429c8",
      attempt: "ATTEMPTS_1",
    },
  ],
  firstName: "string",
  id: 0,
  isDateOfBirthEstimated: true,
  lastName: "string",
  liveWithParent: "string",
  middleName: "string",
  motherDead: "string",
  statusOfContact: "string",
  uan: "string",
  uuid: "string",
  yearChildDead: "string",
  yearMotherDead: "string",
};
