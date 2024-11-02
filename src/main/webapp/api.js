export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzMwNTk1NTg4fQ.YY_4l4hz8X2Q2n-SN0vpp6bT4c--3yD4sguXK-L75RWAHve6wkUZi_T0fMtiUCvoDgDrv1r2t67s15JcTc9OJQ"
    : new URLSearchParams(window.location.search).get("jwt");


     