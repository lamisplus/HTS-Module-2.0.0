export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzM0MDE1MjIwfQ.i06TZn1nQgkdBhCUiStAKXM-kZ86Osyx11XXwq3OjvJmWmC0YiRWywXAS9PDVw9ZXgFZes-Tr5LZRT_mH_ue_w"
    : new URLSearchParams(window.location.search).get("jwt");


