export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzI1MzIxMTgzfQ.TyegVYwRpgh3PhTRgP_vSH0H2xwi3CgjIV_D3U6-TuB50rhJTv4pfbGPAb8805p1IkIEC-prRALi5lI7CwX99g"
    : new URLSearchParams(window.location.search).get("jwt");

