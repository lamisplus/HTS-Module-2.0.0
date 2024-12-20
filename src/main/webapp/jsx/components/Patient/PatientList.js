import React, { useState } from "react";
import axios from "axios";
import { token as token, url as baseUrl } from "./../../../api";
import "semantic-ui-css/semantic.min.css";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { MdDashboard } from "react-icons/md";
import "@reach/menu-button/styles.css";
import { Label } from "semantic-ui-react";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import CustomTable from "../../../reuseables/CustomTable";

//Date Picker package
Moment.locale("en");
momentLocalizer();


const Patients = (props) => {
  const [showPPI, setShowPPI] = useState(true);
 
  const handleCheckBox = (e) => {
    if (e.target.checked) {
      setShowPPI(false);
    } else {
      setShowPPI(true);
    }
  };

  return (
    <div>
      <CustomTable
        title="Find Patient "
        columns={[
          // { title: " ID", field: "Id" },
          {
            title: "Patient Name",
            field: "name",
            hidden: showPPI,

          },
          // { title: "Hospital Number", field: "hospital_number", filtering: false },
          { title: "Patient ID", field: "clientCode", filtering: false },
          { title: "", field: "", filtering: false },

          { title: "Sex", field: "gender", filtering: false },
          { title: "Age", field: "age", filtering: false },

          //{ title: "ART Number", field: "v_status", filtering: false },
          { title: "HTS Count", field: "count", filtering: false },
          { title: "Actions", field: "actions", filtering: false },
        ]}
        data={(query) =>
          new Promise((resolve, reject) =>
            axios
              .get(
                `${baseUrl}hts/persons?pageSize=${query.pageSize}&pageNo=${query.page}&searchValue=${query.search}`,
                { headers: { Authorization: `Bearer ${token}` } }
              )
              .then((response) => response)
              .then((result) => {
                resolve({
                  data: result?.data?.records
                    ?.filter((a) => {
                      return a.personId !== null;
                    })
                    ?.map?.((row) => ({
                      name: row.firstName + " " + row.surname,
                      clientCode: row?.hospitalNumber || "",
                      gender: row?.gender ||row?.sex,
                      age: row.age,
                      count: (
                        <Label color="blue" size="mini">
                          {0}
                        </Label>
                      ),
                      actions: (
                        <div>
                          {row.htsCount >= 0 && (
                            <>
                              <Link
                                to={{
                                  pathname: "/patient-history",
                                  state: {
                                    patientObject: row,
                                    patientObj: row,
                                    clientCode: row.clientCode,
                                  },
                                }}
                              >
                                <ButtonGroup
                                  variant="contained"
                                  aria-label="split button"
                                  style={{
                                    backgroundColor: "rgb(153, 46, 98)",
                                    height: "30px",
                                    width: "215px",
                                  }}
                                  size="large"
                                >
                                  <Button
                                    color="primary"
                                    size="small"
                                    aria-label="select merge strategy"
                                    aria-haspopup="menu"
                                    style={{
                                      backgroundColor: "rgb(153, 46, 98)",
                                    }}
                                  >
                                    <MdDashboard />
                                  </Button>
                                  <Button
                                    style={{
                                      backgroundColor: "rgb(153, 46, 98)",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: "12px",
                                        color: "#fff",
                                        fontWeight: "bolder",
                                      }}
                                    >
                                      Patient Dashboard
                                    </span>
                                  </Button>
                                </ButtonGroup>
                              </Link>
                            </>
                          )}
                        </div>
                      ),
                    })),
                  page: query.page,
                  totalCount: result.data.totalRecords,
                });
              })
          )
        }
        showPPI={showPPI}
        onPPIChange={handleCheckBox}
      />
    </div>
  );
};

export default Patients;
