export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzE4MzI2NTQ2fQ.MJjjJMO8Ejw7PE5MydhG8Gj4kiLC3oOj2NwXZW_ORJmtqUGWUVRDRJzMV3KxvHT4jSDu7gUBGtlsbFL9HiLOrg"
    : new URLSearchParams(window.location.search).get("jwt");
