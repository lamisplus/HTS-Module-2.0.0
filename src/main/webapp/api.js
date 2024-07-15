export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8789/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzIwNjI2MTI3fQ.Vw3n7B858ZO4vbY97vuDTS8d_pUH424ZNRkbkgeW-1X67bC4aK0jkFOE-tlK7achYUybveoLQrx2enygLs6c1g"
    : new URLSearchParams(window.location.search).get("jwt");
