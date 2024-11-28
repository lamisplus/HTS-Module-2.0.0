export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzMyNjQwMjg2fQ.vjwiQLnuLnsarc39vOKPKNZtFTVBtuQm8Eaw0ihbC_eNcXHaMkQlnbjnIo5S979NYae3tTYZ1HQc6Km_Gk8wpA"
    : new URLSearchParams(window.location.search).get("jwt");

