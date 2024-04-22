import React, {forwardRef, useEffect, useState} from "react";
import axios from "axios";
import {token, url as baseUrl} from "../../../../../api";
import {toast} from "react-toastify";
import {Button, Dropdown, Icon, Menu} from "semantic-ui-react";
import MaterialTable from "material-table";
import {Modal} from "react-bootstrap";
import AddBox from "@material-ui/icons/AddBox";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Edit from "@material-ui/icons/Edit";
import SaveAlt from "@material-ui/icons/SaveAlt";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import Search from "@material-ui/icons/Search";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Remove from "@material-ui/icons/Remove";
import ViewColumn from "@material-ui/icons/ViewColumn";
import {makeStyles} from "@material-ui/core/styles";

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => (
        <ChevronRight {...props} ref={ref} />
    )),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
        <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const useStyles = makeStyles((theme) => ({
    card: {
        margin: theme.spacing(20),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    cardBottom: {
        marginBottom: 20,
    },
    Select: {
        height: 45,
        width: 350,
    },
    button: {
        margin: theme.spacing(1),
    },

    root: {
        "& > *": {
            margin: theme.spacing(1),
        },
    },
    input: {
        display: "none",
    },
    error: {
        color: "#f85032",
        fontSize: "11px",
    },
    success: {
        color: "#4BB543 ",
        fontSize: "11px",
    },
}));
const ClientRerralList = (props) => {
    const [indexClientList, setIndexClientList] = useState([]);
    const [recordSelected, setRecordSelected] = useState({});

    const [open, setOpen] = React.useState(false);
    const [serviceMapping, setServiceMapping] = useState({});
    const [serviceNeeded, setServiceNeeded] = useState([]);
    const toggle = () => setOpen(!open);

    //const [patientObj, setpatientObj] = useState([])
    const patientId =
        props.patientObj && props.patientObj.id ? props.patientObj.id : null;
    //const [key, setKey] = useState('home');
    //console.log(props)
    useEffect(() => {
        patients();
    },
        []);
    //get services needed
    const SERVICE_NEEDED = () => {
        axios.get(`${baseUrl}application-codesets/v2/SERVICE_PROVIDED`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.data) {
                    setServiceNeeded(response.data);
                    const mapping = {};
                    response.data.forEach(item => {
                        mapping[item.code] = item.display;
                    });
                    setServiceMapping(mapping);
                }
            })
            .catch((e) => {
                console.error("Fetch Services error:", e);
            });
    };


    useEffect(() => {
        SERVICE_NEEDED();
    }, []);


    async function patients() {
        axios
            .get(
                `${baseUrl}hts-client-referral/all/${patientId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            .then((response) => {
                // console.log(response.data);
                setIndexClientList(response.data);
            })
            .catch((error) => {});
    }
    const addNewPns = (e) => {
        e.preventDefault();
        props.handleItemClick("client-referral");
    };
    const LoadViewPage = (row, actionType) => {
        props.handleItemClick("view-referral");
        props.setRow({ row: row, action: actionType });
    };
    const LoadModal = (row) => {
        toggle();
        // console.log(row);
        setRecordSelected(row);
    };
    const LoadDeletePage = (row) => {
        axios
            .delete(
                `${baseUrl}hts-client-referral/${recordSelected.id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            .then((response) => {
                toast.success("Record Deleted Successfully");
                toggle();
                patients();
                // setSaving(false);
            })
            .catch((error) => {
                // setSaving(false);
                if (error.response && error.response.data) {
                    let errorMessage =
                        error.response.data.apierror &&
                        error.response.data.apierror.message !== ""
                            ? error.response.data.apierror.message
                            : "Something went wrong, please try again";
                    toast.error(errorMessage);
                } else {
                    toast.error("Something went wrong. Please try again...");
                }
            });
    };
    return (
        <>
            <div>
                <Button
                    variant="contained"
                    color="primary"
                    className=" float-end  mr-2 mt-2"
                    onClick={(e) => addNewPns(e)}
                    //startIcon={<FaUserPlus size="10"/>}
                >
                    <span style={{ textTransform: "capitalize" }}> Refer Client</span>
                </Button>
                <br />
                <br />
                <br />
                <br />
                <MaterialTable
                    icons={tableIcons}
                    title="List of  client submitted referral forms"
                    columns={[
                        { title: "Date visited", field: "date" },
                        { title: "Service needed", field: "service" },
                        //   { title: "Phone Number", field: "phone" },
                        { title: "Receiving Facility", field: "receiving" },
                        { title: "Actions", field: "actions", filtering: false },
                    ]}
                    isLoading={props.loading}
                    data={indexClientList
                        .filter((b) => b.firstName !== "")
                        .map((row) => ({
                            date: row.dateVisit,
                            service:  serviceMapping[row.serviceNeeded] || row.serviceNeeded,
                            // phone: row.phoneNumber,
                            receiving: row.nameOfReceivingFacility,
                            actions: (
                                <div>
                                    <Menu.Menu position="right">
                                        <Menu.Item>
                                            <Button
                                                style={{ backgroundColor: "rgb(153,46,98)" }}
                                                primary
                                            >
                                                <Dropdown
                                                    item
                                                    text="Action"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                    }}
                                                >
                                                    <Dropdown.Menu style={{ marginTop: "10px" }}>
                                                        <Dropdown.Item
                                                            onClick={(e) => LoadViewPage(row, "view")}
                                                        >
                                                            {" "}
                                                            <Icon name="eye" />
                                                            View
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            onClick={() => LoadViewPage(row, "update")}
                                                        >
                                                            <Icon name="edit" />
                                                            Edit
                                                        </Dropdown.Item>
                                                        <Dropdown.Item onClick={() => LoadModal(row)}>
                                                            <Icon name="delete" />
                                                            Delete
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </Button>
                                        </Menu.Item>
                                    </Menu.Menu>
                                </div>
                            ),
                        }))}
                    options={{
                        headerStyle: {
                            //backgroundColor: "#9F9FA5",
                            color: "#000",
                        },
                        searchFieldStyle: {
                            width: "200%",
                            margingLeft: "250px",
                        },
                        filtering: false,
                        exportButton: false,
                        //   searchFieldAlignment: "left",
                        pageSizeOptions: [10, 20, 100],
                        pageSize: 10,
                        debounceInterval: 400,
                    }}
                />
            </div>
            <Modal
                show={open}
                toggle={toggle}
                className="fade"
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Notification!
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>
                        Are you Sure you want to delete{" "}
                        {/* <b>{row && record.activityName}</b> */}
                    </h4>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => LoadDeletePage(recordSelected)}
                        style={{ backgroundColor: "red", color: "#fff" }}
                        // disabled={saving}
                    >
                        Yes
                        {/* {saving === false ? "Yes" : "Deleting..."} */}
                    </Button>
                    <Button
                        onClick={toggle}
                        style={{ backgroundColor: "#014d88", color: "#fff" }}
                        // disabled={saving}
                    >
                        No
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ClientRerralList;
