export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzIyODc3NTIxfQ.PEmL7eNxdRz5DZ2jgLv7nBfrVRHpUFlVaNQtVgGpX8KHvY1Vgy404VClfAWxU-p-E8dnrh11R5gIBgdmXpJe9g"
    : new URLSearchParams(window.location.search).get("jwt");
