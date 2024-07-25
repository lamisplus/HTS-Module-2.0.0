export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzIxOTMwMTY5fQ.itYeT2w3G_r7BqwfscfXyJnjIfPTmTeVFANlKKP1KvpWKN4XxGjl4bbQJilnoEjPe5-2HwDT0frENw6fmUf7mg"
    : new URLSearchParams(window.location.search).get("jwt");
