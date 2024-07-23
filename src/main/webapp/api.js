export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzIxNzQ5MDE2fQ.PGuXMSfwAgCxdjFidkv99og3bv5H1GI6SqS7CFzlAH0K6gEBIgRJB-cJ1bmz4fpCy3jlO4oDzqbt3Floexwlyw"
    : new URLSearchParams(window.location.search).get("jwt");
