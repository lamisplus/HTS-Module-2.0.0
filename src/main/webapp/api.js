export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzI1OTA5Mjk0fQ.FNM1JQAFQ-h_50m8j0kHUYXxg_oAuHfIFvnWEK7R16RZQEKxXgJtRoDgR1BNNHt1CbP2CLwi3KRQzrmY_tw_KQ"
    : new URLSearchParams(window.location.search).get("jwt");
