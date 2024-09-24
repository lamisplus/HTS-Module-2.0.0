export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzI3MjMwOTM3fQ.zez7F9yIoX_yi9CdpoU3AF3v-blJTnumqxFv1Gf488bkLvmhcEQx8CvBRaZKuahxJMN92orbn2qGmVLXic69KQ"
    : new URLSearchParams(window.location.search).get("jwt");
