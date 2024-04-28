import React, { useCallback, useEffect, useState } from "react";
import { Button } from "semantic-ui-react";
import { Card, CardBody } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { Link, useHistory, useLocation } from "react-router-dom";
// import FamilyIndexTestingForm from "./NewRegistration/FamilyIndexTestingForm";
import "react-phone-input-2/lib/style.css";
import { Icon, Menu, Sticky } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import PreTestInformation from "./PreTestInformation";
// import RiskStratification from "../ContinuesHTSEnrollment/RiskStratification";
// import BasicInfo from "../ContinuesHTSEnrollment/BasicInfo";
// import PreTest from "../ContinuesHTSEnrollment/PreTest";
// import HivTestResult from "../ContinuesHTSEnrollment/HivTestResult";
// import PostTest from "../ContinuesHTSEnrollment/PostTest";
// import IndexingContactTracing from "../ContinuesHTSEnrollment/Elicitation";
// import RecencyTesting from "../ContinuesHTSEnrollment/RecencyTesting";
// import Others from "../ContinuesHTSEnrollment/Others";
// import PNSHistory from "../NewRegistration/PartnerNotificationServices/PNSHistory";
// import PnsForm from "../NewRegistration/PartnerNotificationServices/PnsForm";
// import ViewPNSForm from "../NewRegistration/PartnerNotificationServices/ViewPnsForm";
// import ReferralUnit from "../ContinuesHTSEnrollment/ClientReferral/ReferralUnit";

const ExistenceClientHIVSTRegistration = () => {
    const location = useLocation();
    const locationState = location.state;
    const [activeItem, setactiveItem] = useState("pretest");
    const [completed, setCompleted] = useState([]);
    const [hideOtherMenu, setHideOtherMenu] = useState(true);
    // const [saving, setSaving] = useState(false);
    const [patientObj2, setPatientObj2] = useState({});

    const handleItemClick = (activeItem) => {
        setactiveItem(activeItem);
        //setCompleted({...completed, ...completedMenu})
    };

    return (<>
        <ToastContainer autoClose={3000} hideProgressBar />

        <Card>
            <CardBody>
                <form>
                    <div className="row">
                        <h3>HIV SELT TESTING</h3>
                        <br />
                        <br />
                        <div className="col-md-3 col-sm-3 col-lg-3">
                            <Menu
                                size="large"
                                vertical
                                style={{ backgroundColor: "#014D88" }}
                            >
                                <Menu.Item
                                    name="inbox"
                                    active={activeItem === "prestest"}
                                    onClick={() => handleItemClick("pretest")}
                                    style={{
                                        backgroundColor: activeItem === "pretest" ? "#000" : "",
                                    }}
                                >
                                    <span style={{ color: "#fff" }}>
                                        {" "}
                                        Pre Test Information
                                        {completed.includes("pretest") && (<Icon name="check" color="green" />)}
                                    </span>
                                </Menu.Item>
                                {/*{hideOtherMenu === false && (<>*/}
                                <Menu.Item
                                    name="inbox"
                                    active={activeItem === "basic"}
                                    onClick={() => handleItemClick("basic")}
                                    style={{
                                        backgroundColor: activeItem === "basic" ? "#000" : "",
                                    }}
                                    disabled={activeItem !== "basic" ? true : false}
                                >
                                    <span style={{ color: "#fff" }}>
                                        {" "}
                                        Basic Information
                                        {completed.includes("basic") && (<Icon name="check" color="green" />)}
                                    </span>
                                </Menu.Item>
                                <Menu.Item
                                    name="spam"
                                    active={activeItem === "pre-test-counsel"}
                                    onClick={() => handleItemClick("pre-test-counsel")}
                                    style={{
                                        backgroundColor: activeItem === "pre-test-counsel" ? "#000" : "",
                                    }}
                                    disabled={activeItem !== "pre-test-counsel" ? true : false}
                                >
                                    {/* <Label>2</Label> */}
                                    <span style={{ color: "#fff" }}>
                                        Pre Test Counseling
                                        {completed.includes("pre-test-counsel") && (
                                            <Icon name="check" color="green" />)}
                                    </span>
                                </Menu.Item>
                                <Menu.Item
                                    name="inbox"
                                    active={activeItem === "hiv-test"}
                                    onClick={() => handleItemClick("hiv-test")}
                                    style={{
                                        backgroundColor: activeItem === "hiv-test" ? "#000" : "",
                                    }}
                                //disabled={activeItem !== 'hiv-test' ? true : false}
                                >
                                    <span style={{ color: "#fff" }}>
                                        Request {"&"} Result Form
                                        {completed.includes("hiv-test") && (<Icon name="check" color="green" />)}
                                    </span>

                                    {/* <Label color='teal'>3</Label> */}
                                </Menu.Item>
                                <Menu.Item
                                    name="spam"
                                    active={activeItem === "post-test"}
                                    onClick={() => handleItemClick("post-test")}
                                    style={{
                                        backgroundColor: activeItem === "post-test" ? "#000" : "",
                                    }}
                                    disabled={activeItem !== "post-test" ? true : false}
                                >
                                    {/* <Label>4</Label> */}
                                    <span style={{ color: "#fff" }}>
                                        Post Test Counseling
                                        {completed.includes("post-test") && (<Icon name="check" color="green" />)}
                                    </span>
                                </Menu.Item>

                                <Menu.Item
                                    name="spam"
                                    active={activeItem === "recency-testing"}
                                    onClick={() => handleItemClick("recency-testing")}
                                    style={{
                                        backgroundColor: activeItem === "recency-testing" ? "#000" : "",
                                    }}
                                    disabled={activeItem !== "recency-testing" ? true : false}
                                >
                                    {/* <Label>4</Label> */}
                                    <span style={{ color: "#fff" }}>
                                        HIV Recency Testing
                                        {completed.includes("recency-testing") && (
                                            <Icon name="check" color="green" />)}
                                    </span>
                                </Menu.Item>
                                <Menu.Item
                                    name="spam"
                                    active={activeItem === "fit"}
                                    onClick={() => handleItemClick("fit")}
                                    style={{
                                        backgroundColor: activeItem === "fit" ? "#000" : "",
                                    }}
                                    disabled={activeItem !== "fit" ? true : false}
                                >
                                    <span style={{ color: "#fff" }}>
                                        Family Index Testing form
                                        {completed.includes("fit") && (<Icon name="check" color="green" />)}
                                    </span>
                                </Menu.Item>
                                <Menu.Item
                                    name="inbox"
                                    active={activeItem === "pns-history"}
                                    onClick={() => handleItemClick("pns-history")}
                                    style={{
                                        backgroundColor: activeItem === "pns-history" ? "#000" : "",
                                    }}
                                >
                                    <span style={{ color: "#fff" }}>
                                        {" "}
                                        Partner Notification Services
                                        {completed.includes("pns") && (<Icon name="check" color="green" />)}
                                    </span>
                                </Menu.Item>

                                <Menu.Item
                                    name="spam"
                                    active={activeItem === "continuous-referral"}
                                    onClick={() => handleItemClick("continuous-referral")}
                                    style={{
                                        backgroundColor: activeItem === "continuous-referral" ? "#000" : "",
                                    }}
                                    disabled={activeItem !== "continuous-referral" ? true : false}
                                >
                                    <span style={{ color: "#fff" }}>
                                        Client Referral Service
                                        {completed.includes("continuous-referral") && (<Icon name="check" color="green" />)}
                                    </span>
                                </Menu.Item>
                                {/*</>)}*/}
                            </Menu>
                        </div>
                        <div
                            className="col-md-9 col-sm-9 col-lg-9 "
                            style={{
                                backgroundColor: "#fff", margingLeft: "-50px", paddingLeft: "-20px",
                            }}
                        >
                            {activeItem === "pretest" && ( <PreTestInformation
                                handleItemClick={handleItemClick}
                                setCompleted={setCompleted}
                                completed={completed}
                                setPatientObj={setPatientObj2}
                                patientObj={patientObj2}
                                setHideOtherMenu={setHideOtherMenu}
                                // patientAge={props.patientAge}
                                // setExtra={setExtra}
                                // extra={extra}
                                patientObject={locationState.patientObject}
                            // activePage={props.activePage}
                            // setActivePage={props.setActivePage}
                            />)}
                            {/*{activeItem === "basic" && (<BasicInfo*/}
                            {/*    handleItemClick={handleItemClick}*/}
                            {/*    setCompleted={setCompleted}*/}
                            {/*    completed={completed}*/}
                            {/*    setPatientObj={setPatientObj2}*/}
                            {/*    patientObj={patientObj2}*/}
                            {/*    clientCode={props.clientCode}*/}
                            {/*    patientAge={props.patientAge}*/}
                            {/*    sex={props.patientObj.gender}*/}
                            {/*    setExtra={setExtra}*/}
                            {/*    extra={extra}*/}
                            {/*    patientObject={locationState.patientObject}*/}
                            {/*    setBasicInfo={setBasicInfo}*/}
                            {/*/>)}*/}
                            {/*{activeItem === "pre-test-counsel" && (<PreTest*/}
                            {/*    handleItemClick={handleItemClick}*/}
                            {/*    setCompleted={setCompleted}*/}
                            {/*    completed={completed}*/}
                            {/*    setPatientObj={setPatientObj2}*/}
                            {/*    patientObj={patientObj2}*/}
                            {/*    clientCode={props.clientCode}*/}
                            {/*    patientAge={props.patientAge}*/}
                            {/*/>)}*/}
                            {/*{activeItem === "hiv-test" && (<HivTestResult*/}
                            {/*    handleItemClick={handleItemClick}*/}
                            {/*    setCompleted={setCompleted}*/}
                            {/*    completed={completed}*/}
                            {/*    setPatientObj={setPatientObj2}*/}
                            {/*    patientObj={patientObj2}*/}
                            {/*    clientCode={props.clientCode}*/}
                            {/*    patientAge={props.patientAge}*/}
                            {/*/>)}*/}
                            {/*{activeItem === "post-test" && (<PostTest*/}
                            {/*    handleItemClick={handleItemClick}*/}
                            {/*    setCompleted={setCompleted}*/}
                            {/*    completed={completed}*/}
                            {/*    setPatientObj={setPatientObj2}*/}
                            {/*    patientObj={patientObj2}*/}
                            {/*    clientCode={props.clientCode}*/}
                            {/*    patientAge={props.patientAge}*/}
                            {/*    patientsHistory={props.patients}*/}
                            {/*/>)}*/}
                            {/*{activeItem === "indexing" && (<IndexingContactTracing*/}
                            {/*    handleItemClick={handleItemClick}*/}
                            {/*    setCompleted={setCompleted}*/}
                            {/*    completed={completed}*/}
                            {/*    setPatientObj={setPatientObj2}*/}
                            {/*    patientObj={patientObj2}*/}
                            {/*    clientCode={props.clientCode}*/}
                            {/*    patientAge={props.patientAge}*/}
                            {/*/>)}*/}
                            {/*{activeItem === "recency-testing" && (<RecencyTesting*/}
                            {/*    handleItemClick={handleItemClick}*/}
                            {/*    setCompleted={setCompleted}*/}
                            {/*    completed={completed}*/}
                            {/*    setPatientObj={setPatientObj2}*/}
                            {/*    patientObj={patientObj2}*/}
                            {/*    clientCode={props.clientCode}*/}
                            {/*    patientAge={props.patientAge}*/}
                            {/*/>)}*/}
                            {/*{activeItem === "others" && (<Others*/}
                            {/*    handleItemClick={handleItemClick}*/}
                            {/*    setCompleted={setCompleted}*/}
                            {/*    completed={completed}*/}
                            {/*    setPatientObj={setPatientObj2}*/}
                            {/*    patientObj={patientObj2}*/}
                            {/*    clientCode={props.clientCode}*/}
                            {/*    patientAge={props.patientAge}*/}
                            {/*/>)}*/}
                            {/*{activeItem === "pns-history" && (<PNSHistory*/}
                            {/*    handleItemClick={handleItemClick}*/}
                            {/*    setCompleted={setCompleted}*/}
                            {/*    completed={completed}*/}
                            {/*    setPatientObj={setPatientObj2}*/}
                            {/*    patientObj={patientObj2}*/}
                            {/*    setExtra={setExtra}*/}
                            {/*    extra={extra}*/}
                            {/*    basicInfo={basicInfo}*/}
                            {/*    organizationInfo={organizationInfo}*/}
                            {/*    activePage={props.activePage}*/}
                            {/*    setActivePage={props.setActivePage}*/}
                            {/*    setRow={setRow}*/}
                            {/*/>)}*/}

                            {/*{activeItem === "pns" && (<PnsForm*/}
                            {/*    handleItemClick={handleItemClick}*/}
                            {/*    setCompleted={setCompleted}*/}
                            {/*    completed={completed}*/}
                            {/*    setPatientObj={setPatientObj2}*/}
                            {/*    patientObj={patientObj2}*/}
                            {/*    setExtra={setExtra}*/}
                            {/*    extra={extra}*/}
                            {/*    basicInfo={basicInfo}*/}
                            {/*    organizationInfo={organizationInfo}*/}
                            {/*// addNewForm={false}*/}
                            {/*/>)}*/}

                            {/*{activeItem === "view-pns" && (<ViewPNSForm*/}
                            {/*    handleItemClick={handleItemClick}*/}
                            {/*    setCompleted={setCompleted}*/}
                            {/*    completed={completed}*/}
                            {/*    setPatientObj={setPatientObj2}*/}
                            {/*    patientObj={patientObj2}*/}
                            {/*    setExtra={setExtra}*/}
                            {/*    extra={extra}*/}
                            {/*    basicInfo={basicInfo}*/}
                            {/*    organizationInfo={organizationInfo}*/}
                            {/*    addNewForm={false}*/}
                            {/*    row={row}*/}
                            {/*/>)}*/}
                            {/*{activeItem === "fit" && (<FamilyIndexTestingForm*/}
                            {/*    handleItemClick={handleItemClick}*/}
                            {/*    setCompleted={setCompleted}*/}
                            {/*    completed={completed}*/}
                            {/*    setPatientObj={setPatientObj2}*/}
                            {/*    patientObj={patientObj2}*/}
                            {/*    setExtra={setExtra}*/}
                            {/*    extra={extra}*/}
                            {/*    basicInfo={basicInfo}*/}
                            {/*    organizationInfo={organizationInfo}*/}
                            {/*/>)}*/}
                            {/*{activeItem === "new-referral" && (<ReferralUnit*/}
                            {/*    handleItemClick={handleItemClick}*/}
                            {/*    setCompleted={setCompleted}*/}
                            {/*    completed={completed}*/}
                            {/*    setPatientObj={setPatientObj2}*/}
                            {/*    patientObj={patientObj2}*/}
                            {/*    setExtra={setExtra}*/}
                            {/*    extra={extra}*/}
                            {/*    basicInfo={basicInfo}*/}
                            {/*    organizationInfo={organizationInfo}*/}
                            {/*    addNewForm={false}*/}
                            {/*/>)}*/}
                        </div>
                    </div>
                </form>
            </CardBody>
        </Card>
    </>);

};
export default ExistenceClientHIVSTRegistration;