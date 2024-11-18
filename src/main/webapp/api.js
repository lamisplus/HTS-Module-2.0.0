export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzMxOTU0NjcxfQ.z7UWr9LpbIVFdrCRCRWQ_TyBT4Hvy542G_xlz3GfGw7LXOp5ELtNFKSXkaDoz4AezIKNYXed1ETyCUTQ-sPXKw"
    : new URLSearchParams(window.location.search).get("jwt");

