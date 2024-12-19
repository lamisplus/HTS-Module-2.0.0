export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzM0NjI1MDM1fQ.o4yacZxmZMtS94uI_JOuQ0l5GmaNr3x7x1_BH1i8XJ3sAbpVYwDJb-VQHZ5OmGI7FBE5ySfsKvkLftmhlG0FRQ"
    : new URLSearchParams(window.location.search).get("jwt");


