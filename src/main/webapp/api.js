export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzIyMjY5NzY4fQ.NGUN_wW-Ndysswo_q_xfpQCMmw2sC_IZGW3aRsZ3pd0rZL1W-PdmSnJq0cK7T_-h6gtRVuZ3RvAeGRv4PtOBpQ"
    : new URLSearchParams(window.location.search).get("jwt");
