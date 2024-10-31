export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzMwMjE1NzE4fQ._5fp5870C656K5wL_SZNHAfpch39x5Bu5bcGi_FzCASxF1tlM1eHvF9xkbp0ilWKGxTKHrPIyASy_tVz-v-NIw"
    : new URLSearchParams(window.location.search).get("jwt");



