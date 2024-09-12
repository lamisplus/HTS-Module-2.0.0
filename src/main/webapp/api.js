export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzI2MTU5NjQ5fQ.DZhY-w_DiHdo7Y0BJvVgdvgmCTx9tf73qV6HjwoOtVniMlFfj4b2_cwi2NEAhRwmTXYLBXhQ72qo2XXFsfXHHA"
    : new URLSearchParams(window.location.search).get("jwt");
