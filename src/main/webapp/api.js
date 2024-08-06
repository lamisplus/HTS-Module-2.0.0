export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzIyOTk2MDkyfQ.hQH1oZKFSDL_Rd3VYtYBkDBQL65n6eGd_g43OOllbAha3SqxKMQNSh_ziLaIRQtRunSi7p8h3vopt4oVnT7pZA"
    : new URLSearchParams(window.location.search).get("jwt");
