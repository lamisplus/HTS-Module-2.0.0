import React, { useState, Fragment, useEffect } from "react";
import axios from "axios";
import { url as baseUrl } from "./../../api";
import { token as token } from "./../../api";
import { makeStyles } from "@material-ui/core/styles";
import { Row, Col, Card, Tab, Tabs } from "react-bootstrap";
import Dashboard from "./Patient/PatientList";
import HTSList from "./Patient/HTSList";
import VisualisationHome from "./Visualisation/Index";
import { FaUserPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import HIVSTPatient from "./Patient/HIVST/HIVSTPatient";
import CheckedInPatients from "./Patient/CheckedInPatients";
import { getListOfPermission } from "../../utility";


const divStyle = {
  borderRadius: "2px",
  fontSize: 14,
};

const Home = () => {
  const [key, setKey] = useState("home");

  const getPermissions = async () => {
    await axios
      .get(`${baseUrl}account`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        localStorage.setItem("permissions", response.data.permissions);
        let generatedPermission = getListOfPermission(response.data.permissions);
        localStorage.setItem("generatedPermission", JSON.stringify(generatedPermission));
        let stringifiedPermmision = generatedPermission.map((each, index) => {
          return each.name;
        });

        localStorage.setItem(
          "stringifiedPermmision",
          JSON.stringify(stringifiedPermmision)
        );

        
        console.log(
          "permissison and permission",stringifiedPermmision,
          getListOfPermission(response.data.permissions)
        );
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getPermissions();
    const permissions = localStorage.getItem("permissions")?.split(",");
    console.log("perms", permissions);
     

  }, []);

  return (
    <Fragment>
      <div
        className="row page-titles mx-0"
        style={{ marginTop: "0px", marginBottom: "-10px" }}
      >
        <ol className="breadcrumb">
          <li className="breadcrumb-item active">
            <h4>HTS</h4>
          </li>
        </ol>
      </div>
      <Link to={"register-patient"}>
        <Button
          variant="contained"
          color="primary"
          className="mt-2 mr-3 mb-0 float-end"
          startIcon={<FaUserPlus size="10" />}
          style={{ backgroundColor: "#014d88" }}
        >
          <span style={{ textTransform: "capitalize" }}>New Patient</span>
        </Button>
      </Link>
      {/*  <Link to={key === "hivst" ? "register-hivst-patient" : "register-patient"}>*/}
      {/*      <Button*/}
      {/*          variant="contained"*/}
      {/*          color="primary"*/}
      {/*          className="mt-2 mr-3 mb-0 float-end"*/}
      {/*          startIcon={<FaUserPlus size="10" />}*/}
      {/*          style={{ backgroundColor: "#014d88" }}*/}
      {/*      >*/}
      {/*    <span style={{ textTransform: "capitalize" }}>*/}
      {/*      {key === "hivst" ? "New HIVST Patient" : "New Patient"}*/}
      {/*    </span>*/}
      {/*      </Button>*/}
      {/*  </Link>*/}
      <br />
      <br /> <br />
      <Row>
        <Col xl={12}>
          <Card style={divStyle}>
            <Card.Body>
              <div className="custom-tab-1">
                <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                  className="mb-3"
                >
                  <Tab eventKey="home" title="Patients">
                    <Dashboard />
                  </Tab>
                  <Tab eventKey="checkedin" title="CheckedIn Patients">
                    <CheckedInPatients />
                  </Tab>
                  <Tab eventKey="hts" title="HTS Patients">
                    <HTSList />
                  </Tab>

                  <Tab eventKey="hivst" title="HIVST Patients">
                    <HIVSTPatient />
                  </Tab>
                </Tabs>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default Home;
