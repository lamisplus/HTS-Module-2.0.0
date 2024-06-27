export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzE5NTAyODAyfQ.77LKJLDZiLE2nZzr3XkVUNsn2lSc8Lft6cScd1FaciBalk6aiX5lFeXBCI_b_n3doKxxkAvYlBl77vHqg-fGDg"
    : new URLSearchParams(window.location.search).get("jwt");
