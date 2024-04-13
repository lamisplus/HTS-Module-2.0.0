import React, { useState, Fragment } from "react";

import { Row, Col, Card } from "react-bootstrap";
import AddIndexContact from "../../ContinuesHTSEnrollment/Elicitation/AddIndexContact";

import { FaUserPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
//import Button from '@material-ui/core/Button';
import { Label as LabelRibbon, Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import PNSList from "./PNSlist";

const PNSHistory = (props) => {
  const [activePage, setActivePage] = useState("list");
  const handleIClickPage = (activeItem) => {
    setActivePage(activeItem);
  };
  const handleItemClick = (page, completedMenu) => {
    props.handleItemClick(page);
    if (props.completed.includes(completedMenu)) {
    } else {
      props.setCompleted([...props.completed, completedMenu]);
    }
  };
  const handleDone = (row, actionType) => {
    props.setActivePage({
      ...props.activePage,
      activePage: "home",
      activeObject: row,
      actionType: actionType,
    });
  };

  return (
    <Fragment>
      <Row>
        <Col md={12}>
          {activePage === "list" && (
            <PNSList
              activePage={activePage}
              setActivePage={setActivePage}
              handleIClickPage={handleIClickPage}
              patientObj={props.patientObj}
              handleItemClick={handleItemClick}
              setRow={props.setRow}
            />
          )}
          {activePage === "add" && (
            <AddIndexContact
              activePage={activePage}
              setActivePage={setActivePage}
              handleIClickPage={handleIClickPage}
              patientObj={props.patientObj}
            />
          )}
          <br />
          <div className="row">
            <div className="form-group mb-3 col-md-12">
              <Button
                content="Back"
                icon="left arrow"
                labelPosition="left"
                style={{ backgroundColor: "#992E62", color: "#fff" }}
                onClick={() =>
                  handleItemClick("recency-testing", "recency-testing")
                }
              />
              <Button
                content="Done"
                icon="list"
                labelPosition="left"
                style={{ backgroundColor: "#014d88", color: "#fff" }}
                onClick={() => handleDone()}
              />
            </div>
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

export default PNSHistory;
