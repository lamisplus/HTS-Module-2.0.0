export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzE5NDE4ODkyfQ.fvQnC4fU4UbzpAb_iJ3Zra6uQR7JQ3GGtrVZhqy86ELqtw-9jS6E-uOrHS_DVRxE4AZElVidokwJS3XIhjG6sQ"
    : new URLSearchParams(window.location.search).get("jwt");
