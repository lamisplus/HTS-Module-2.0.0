export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzM0MDQyNDgzfQ.CrVcW2al09QapgsBtmsiR6koHEwNP0mDbPaqwSTmJQyWWRDcrCwq59KYe4WIGcKpNOKP9HQ3YD-NWsPf6ucfsA"
    : new URLSearchParams(window.location.search).get("jwt");


