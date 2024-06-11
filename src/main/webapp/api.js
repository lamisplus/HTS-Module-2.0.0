export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzE4MTM4NTc0fQ.DNAlfHmSBd24LbQIu3x5U5pNZJJUl4aMQrzDSr_dQGg9VxZPCBiamZWre0NkDnl7SRpWNlbjmkoQMiFQlWNmmA"
    : new URLSearchParams(window.location.search).get("jwt");
