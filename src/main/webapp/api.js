export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8380/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzMzNzYxMjczfQ.qvXoOsiFChe4qqXnK8OvB3SoWzGTKBVNpJJmEdla98gT3_ebgFs1-YKmRobFrC67HIcAl7PWNpFihDVVmllgEw"
    : new URLSearchParams(window.location.search).get("jwt");


