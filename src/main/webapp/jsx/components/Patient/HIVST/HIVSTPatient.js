import React, { useEffect, useState } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import axios from "axios";
import { token, url as baseUrl } from "../../../../api";
import { forwardRef } from "react";
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
import CustomTable from "../../../../reuseables/CustomTable";




//Date Picker package
Moment.locale("en");
const HIVSTPatient = () => {
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
                title="Find HIVST Patient "
                columns={[
                    {
                        title: "Patient Name",
                        field: "name",
                        hidden: showPPI,
                    },
                    // { title: "Hospital Number", field: "hospital_number", filtering: false },
                    { title: "Client Code", field: "clientCode", filtering: false },
                    // { title: "Sex", field: "gender", filtering: false },
                    { title: "Age", field: "age", filtering: false },

                    //{ title: "ART Number", field: "v_status", filtering: false },
                    { title: "HIVST Count", field: "count", filtering: false },
                    { title: "Actions", field: "actions", filtering: false },
                ]}
                data={(query) =>
                    new Promise((resolve, reject) =>
                        axios
                            .get(
                                `${baseUrl}hivst/persons?pageSize=${query.pageSize}&pageNo=${query.page}&searchValue=${query.search}`,
                                { headers: { Authorization: `Bearer ${token}` } }
                            )
                            .then((response) => response)
                            .then((result) => {
                                //setLoading(false)
                                resolve({
                                    data:
                                        result?.data?.records &&
                                        result?.data?.records
                                            .filter((client) => {
                                                return client.clientCode !== null;
                                            })
                                            .map((row) => ({
                                                //name:   row.hivPositive && row.hivPositive===true ? ( <><sup><b style={{color:"red"}}><Icon name='circle' size="small"/></b></sup> { " " + row.personResponseDto.firstName + " " + row.personResponseDto.surname} </>) :row.personResponseDto.firstName + " " + row.personResponseDto.surname,
                                                name: row.firstName + " " + row.surname,
                                                // hospital_number: row.hospitalNumber,
                                                clientCode: row.clientCode,
                                                gender: row.gender,
                                                age: row.age,
                                                count: (
                                                    <Label color="blue" size="mini">
                                                        {row.hivstCount}
                                                    </Label>
                                                ),
                                                actions: (
                                                    <div>
                                                        {row.hivstCount >= 0 && (
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
                                //setLoading(false)
                            })
                    )
                }
                showPPI={showPPI}
                onPPIChange={handleCheckBox}
            />
        </div>
    );
};
export default HIVSTPatient