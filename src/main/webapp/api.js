export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzMyODExOTcyfQ.mUBVFOSsRg8mTaZpA4NRs2fY0i-qMQI-G5ePm5lHbmmCUhvAuUaLwX_PQMYKaQCLYZQwVjmoJ90bKLG3mWAoDw"
    : new URLSearchParams(window.location.search).get("jwt");



