import React, { useCallback, useEffect, useState } from "react";
import { Button } from "semantic-ui-react";
import { Card, CardBody } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { Link, useHistory, useLocation } from "react-router-dom";
//import {TiArrowBack} from 'react-icons/ti'
//import {token, url as baseUrl } from "../../../api";
import "react-phone-input-2/lib/style.css";
import { Icon, Menu, Sticky } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import BasicInfo from "./NewRegistration/BasicInfo";
import PreTest from "./NewRegistration/PreTest";
import HivTestResult from "./NewRegistration/HivTestResult";
import IndexingContactTracing from "./NewRegistration/Elicitation/Index";
import Others from "./NewRegistration/Others";
import PostTest from "./NewRegistration/PostTest";
import RecencyTesting from "./NewRegistration/RecencyTesting";
import RiskStratification from "./NewRegistration/RiskStratification";
import ClientRefferalForm from "./NewRegistration/RefferalForm";
import { getAcount } from "../../../utility";
import { getCheckModality } from "../../../utility";
import FamilyIndexTestingForm from "./NewRegistration/FamilyIndexTestingForm";
import PnsForm from "./NewRegistration/PartnerNotificationServices/PnsForm";
import RefferralUnit from "./NewRegistration/RefferalUnit";
import ClientReferralHistory from "./NewRegistrationEnrollement/ClientReferral/ClientReferralHistory";
import ViewClientReferral from "./NewRegistrationEnrollement/ClientReferral/Referrall_view_update";

const useStyles = makeStyles((theme) => ({
  error: {
    color: "#f85032",
    fontSize: "12.8px",
  },
  success: {
    color: "#4BB543 ",
    fontSize: "11px",
  },
}));

const UserRegistration = (props) => {
  //const classes = useStyles();
  const location = useLocation();
  const locationState = location.state;
  const [saving, setSaving] = useState(false);
  const [activeItem, setactiveItem] = useState("risk");
  const [completed, setCompleted] = useState([]);
  const [basicInfo, setBasicInfo] = useState({});
  const [organizationInfo, setOrganizationInfo] = useState({});
  const [patientObjAge, setPatientObjAge] = useState(0);
  const [hideOtherMenu, setHideOtherMenu] = useState(true);
  const [row, setRow] = useState({});
  const handleItemClick = (activeItem) => {
    setactiveItem(activeItem);
    //setCompleted({...completed, ...completedMenu})
  };

  const getFacilityAccount = () => {
    getAcount()
      .then((response) => {
        // console.log(response.data);
      })
      .catch(() => {});
  };

  const [extra, setExtra] = useState({
    risk: "",
    index: "",
    pre: "",
    post: "",
    recency: "",
    elicitation: "",
  });
  const [patientObj, setPatientObj] = useState({
    breastFeeding: "",
    capturedBy: "",
    riskStratificationCode: "",
    cd4: {},
    clientCode: "",
    confirmatoryTest: {},
    dateVisit: "",
    extra: {},
    firstTimeVisit: "",
    hepatitisTesting: {},
    hivTestResult: "",
    id: "",
    indexClient: "",
    indexClientCode: "",
    indexElicitation: [
      {
        address: "",
        altPhoneNumber: "",
        archived: 0,
        currentlyLiveWithPartner: true,
        datePartnerCameForTesting: "",
        dob: "",
        extra: {},
        facilityId: 0,
        firstName: "",
        hangOutSpots: "",
        htsClient: {
          archived: 0,
          breastFeeding: 0,
          capturedBy: "",
          cd4: {},
          clientCode: "",
          confirmatoryTest: {},
          dateVisit: "",
          extra: {},
          facilityId: 0,
          firstTimeVisit: true,
          hepatitisTesting: {},
          hivTestResult: "",
          id: 0,
          indexClient: true,
          indexClientCode: "",
          indexNotificationServicesElicitation: {},
          knowledgeAssessment: {},
          numChildren: 0,
          numWives: 0,
          others: {},
          person: {
            active: "",
            address: {},
            archived: 0,
            contact: {},
            contactPoint: {},
            createdDate: "",
            dateOfBirth: "",
            dateOfRegistration: "",
            deceased: true,
            deceasedDateTime: "",
            education: {},
            employmentStatus: {},
            emrId: "",
            facilityId: 0,
            firstName: "string",
            gender: {},
            hospitalNumber: "",
            id: "",
            identifier: {},
            isDateOfBirthEstimated: true,
            lastModifiedDate: "",
            maritalStatus: {},
            new: true,
            ninNumber: "",
            organization: {},
            otherName: "",
            sex: "",
            surname: "",
            uuid: "",
          },
          personUuid: "",
          postTestCounselingKnowledgeAssessment: {},
          pregnant: "",
          previouslyTested: true,
          recency: {},
          referredFrom: "",
          relationWithIndexClient: "",
          riskAssessment: {},
          sexPartnerRiskAssessment: {},
          stiScreening: {},
          syphilisTesting: {},
          targetGroup: 0,
          tbScreening: {},
          test1: {},
          testingSetting: "",
          tieBreakerTest: {},
          typeCounseling: "",
          uuid: "",
        },
        htsClientUuid: "",
        id: "",
        isDateOfBirthEstimated: true,
        lastName: "",
        middleName: "",
        notificationMethod: "",
        partnerTestedPositive: "",
        phoneNumber: "",
        physicalHurt: "",
        relationshipToIndexClient: "",
        sex: "",
        sexuallyUncomfortable: "",
        threatenToHurt: "",
        uuid: "",
      },
    ],
    indexNotificationServicesElicitation: {},
    knowledgeAssessment: {},
    numChildren: "",
    numWives: "",
    others: {},
    personId: "",
    personResponseDto: {
      active: true,

      address: {
        address: [
          {
            city: "",
            line: [""],
            stateId: "",
            district: "",
            countryId: 1,
            postalCode: "",
            organisationUnitId: 0,
          },
        ],
      },
      biometricStatus: true,
      checkInDate: "",
      contact: {},
      contactPoint: {
        contactPoint: [
          {
            type: "phone",
            value: "",
          },
        ],
      },
      dateOfBirth: "",
      dateOfRegistration: "",
      deceased: true,
      deceasedDateTime: "",
      education: {},
      employmentStatus: {},
      emrId: "",
      encounterDate: "",
      facilityId: "",
      firstName: "",
      gender: {},
      id: "",
      identifier: {},
      isDateOfBirthEstimated: true,
      maritalStatus: {},
      ninNumber: "",
      organization: {},
      otherName: "",
      sex: "",
      surname: "",
      visitId: "",
    },
    postTestCounselingKnowledgeAssessment: {},
    pregnant: "",
    previouslyTested: "",
    recency: {},
    referredFrom: "",
    relationWithIndexClient: "",
    riskAssessment: {},
    sexPartnerRiskAssessment: {},
    stiScreening: {},
    syphilisTesting: {},
    targetGroup: "",
    tbScreening: {},
    test1: {},
    testingSetting: "",
    tieBreakerTest: {},
    typeCounseling: "",
    riskStratificationResponseDto: null,
  });
  const [modalityCheck, setModalityCheck] = useState("");

  console.log(patientObj);
  useEffect(() => {
    getFacilityAccount();
    if (locationState && locationState.patientObj) {
      setPatientObj(locationState.patientObj);
    }
  }, []);

  useEffect(() => {
    console.log(
      "component on mountttttttttttttt",
      patientObj?.riskStratificationResponseDto?.modality,
      getCheckModality(patientObj?.riskStratificationResponseDto?.modality),
      "but modaqlity is ",
      modalityCheck
    );
    setModalityCheck(
      getCheckModality(patientObj?.riskStratificationResponseDto?.modality)
    );
  }, [patientObj]);
  return (
    <>
      <ToastContainer autoClose={3000} hideProgressBar />
      <div
        className="row page-titles mx-0"
        style={{ marginTop: "0px", marginBottom: "-10px" }}
      >
        <ol className="breadcrumb">
          <li className="breadcrumb-item active">
            <h4>
              HTS /{" "}
              <span
                style={{
                  color: "#014D88",
                  fontSize: "1.1rem",
                  fontWeight: "bolder",
                }}
              >
                NEW HTS CLIENT
              </span>
            </h4>
          </li>
        </ol>
      </div>
      <Card>
        <CardBody>
          <form>
            <div className="row">
              <h3>
                HIV COUNSELLING AND TESTING
                <Link to={"/"}>
                  <Button
                    variant="contained"
                    color="primary"
                    className=" float-end"
                    //startIcon={<FaUserPlus size="10"/>}
                    style={{ backgroundColor: "#014d88" }}
                  >
                    <span style={{ textTransform: "capitalize" }}>Back</span>
                  </Button>
                </Link>
              </h3>
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
                    active={activeItem === "risk"}
                    onClick={() => handleItemClick("risk")}
                    style={{
                      backgroundColor: activeItem === "risk" ? "#000" : "",
                    }}
                  >
                    <span style={{ color: "#fff" }}>
                      {" "}
                      Risk Stratification
                      {completed.includes("risk") && (
                        <Icon name="check" color="green" />
                      )}
                    </span>
                  </Menu.Item>

                  {hideOtherMenu == false && (
                    <>
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
                          {completed.includes("basic") && (
                            <Icon name="check" color="green" />
                          )}
                        </span>
                      </Menu.Item>
                      {console.log(
                        "testing modality ",
                        patientObj?.riskStratificationResponseDto?.modality,
                        modalityCheck,
                        getCheckModality(
                          patientObj?.riskStratificationResponseDto?.modality
                        )
                      )}

                      {modalityCheck == "fill" && (
                        <Menu.Item
                          name="spam"
                          active={activeItem === "pre-test-counsel"}
                          onClick={() => handleItemClick("pre-test-counsel")}
                          style={{
                            backgroundColor:
                              activeItem === "pre-test-counsel" ? "#000" : "",
                          }}
                          disabled={
                            activeItem !== "pre-test-counsel" ? true : false
                          }
                        >
                          {/* <Label>2</Label> */}
                          <span style={{ color: "#fff" }}>
                            Pre Test Counseling
                            {completed.includes("pre-test-counsel") && (
                              <Icon name="check" color="green" />
                            )}
                          </span>
                        </Menu.Item>
                      )}

                      <Menu.Item
                        name="inbox"
                        active={activeItem === "hiv-test"}
                        onClick={() => handleItemClick("hiv-test")}
                        style={{
                          backgroundColor:
                            activeItem === "hiv-test" ? "#000" : "",
                        }}
                        disabled={activeItem !== "hiv-test" ? true : false}
                      >
                        <span style={{ color: "#fff" }}>
                          Request {"&"} Result Form
                          {completed.includes("hiv-test") && (
                            <Icon name="check" color="green" />
                          )}
                        </span>

                        {/* <Label color='teal'>3</Label> */}
                      </Menu.Item>
                      <Menu.Item
                        name="spam"
                        active={activeItem === "post-test"}
                        onClick={() => handleItemClick("post-test")}
                        style={{
                          backgroundColor:
                            activeItem === "post-test" ? "#000" : "",
                        }}
                        disabled={activeItem !== "post-test" ? true : false}
                      >
                        {/* <Label>4</Label> */}
                        <span style={{ color: "#fff" }}>
                          Post Test Counseling
                          {completed.includes("post-test") && (
                            <Icon name="check" color="green" />
                          )}
                        </span>
                      </Menu.Item>
                      {patientObj.hivTestResult &&
                        patientObj.hivTestResult.toLowerCase() === "positive" &&
                        patientObj?.riskStratificationResponseDto?.age >=
                          15 && (
                          <Menu.Item
                            name="spam"
                            active={activeItem === "recency-testing"}
                            onClick={() => handleItemClick("recency-testing")}
                            style={{
                              backgroundColor:
                                activeItem === "recency-testing" ? "#000" : "",
                            }}
                            disabled={
                              activeItem !== "recency-testing" ? true : false
                            }
                          >
                            {/* <Label>4</Label> */}
                            <span style={{ color: "#fff" }}>
                              HIV Recency Testing
                              {completed.includes("recency-testing") && (
                                <Icon name="check" color="green" />
                              )}
                            </span>
                          </Menu.Item>
                        )}

                      {/* {patientObj.hivTestResult &&
                        patientObj.hivTestResult.toLowerCase() ===
                          "positive" && (
                          <Menu.Item
                            name="inbox"
                            active={activeItem === "fit"}
                            onClick={() => handleItemClick("fit")}
                            style={{
                              backgroundColor:
                                activeItem === "fit" ? "#000" : "",
                            }}
                            disabled={completed.includes("fit") ? true : false}
                          >
                            <span style={{ color: "#fff" }}>
                              Family Index Testing form
                              {completed.includes("fit") && (
                                <Icon name="check" color="green" />
                              )}
                            </span>
                          </Menu.Item>
                        )} */}

                      {/* uncomment this after  */}

                      {patientObj.hivTestResult &&
                        patientObj.hivTestResult.toLowerCase() ===
                          "positive" && (
                          <Menu.Item
                            name="inbox"
                            active={activeItem === "pns"}
                            onClick={() => handleItemClick("pns")}
                            style={{
                              backgroundColor:
                                activeItem === "pns" ? "#000" : "",
                            }}
                          >
                            <span style={{ color: "#fff" }}>
                              {" "}
                              Partner Notification Services
                              {completed.includes("pns") && (
                                <Icon name="check" color="green" />
                              )}
                            </span>
                          </Menu.Item>
                        )}
                      {/*<Menu.Item
                      {/*    name="inbox"*/}
                      {/*    active={activeItem === "refferal"}*/}
                      {/*    onClick={() => handleItemClick("refferal")}*/}
                      {/*    style={{*/}
                      {/*      backgroundColor:*/}
                      {/*          activeItem === "refferal" ? "#000" : "",*/}
                      {/*    }}*/}
                      {/*>*/}
                      {/*  <span style={{ color: "#fff" }}>*/}
                      {/*    {" "}*/}
                      {/*    Client Refferral Form*/}
                      {/*    {completed.includes("referral") && (*/}
                      {/*        <Icon name="check" color="green" />*/}
                      {/*    )}*/}
                      {/*  </span>*/}
                      {/*</Menu.Item>*/}
                      {/*<Menu.Item*/}
                      {/*  name="inbox"*/}
                      {/*  active={activeItem === "new-referral"}*/}
                      {/*  onClick={() => handleItemClick("new-referral")}*/}
                      {/*  style={{*/}
                      {/*    backgroundColor:*/}
                      {/*      activeItem === "new-referral" ? "#000" : "",*/}
                      {/*  }}*/}
                      {/*>*/}
                      {/*  <span style={{ color: "#fff" }}>*/}
                      {/*    {" "}*/}
                      {/*    Client Referral Service*/}
                      {/*    {completed.includes("new-referral") && (*/}
                      {/*      <Icon name="check" color="green" />*/}
                      {/*    )}*/}
                      {/*  </span>*/}
                      {/*</Menu.Item>*/}
                      <Menu.Item
                        name="inbox"
                        active={activeItem === "refferal-history"}
                        onClick={() => handleItemClick("refferal-history")}
                        style={{
                          backgroundColor:
                            activeItem === "refferal-history" ? "#000" : "",
                        }}
                      >
                        <span style={{ color: "#fff" }}>
                          {" "}
                          Client Referral Service
                          {completed.includes("refferal") && (
                            <Icon name="check" color="green" />
                          )}
                        </span>
                      </Menu.Item>
                    </>
                  )}
                </Menu>
              </div>

              <div
                className="col-md-9 col-sm-9 col-lg-9 "
                style={{
                  backgroundColor: "#fff",
                  margingLeft: "-50px",
                  paddingLeft: "-20px",
                }}
              >
                {activeItem === "risk" && (
                  <RiskStratification
                    handleItemClick={handleItemClick}
                    setCompleted={setCompleted}
                    completed={completed}
                    setPatientObj={setPatientObj}
                    patientObj={patientObj}
                    setPatientObjAge={setPatientObjAge}
                    setHideOtherMenu={setHideOtherMenu}
                    setExtra={setExtra}
                    extra={extra}
                    setOrganizationInfo={setOrganizationInfo}
                  />
                )}
                {activeItem === "basic" && (
                  <BasicInfo
                    handleItemClick={handleItemClick}
                    setCompleted={setCompleted}
                    completed={completed}
                    setPatientObj={setPatientObj}
                    patientObj={patientObj}
                    setPatientObjAge={setPatientObjAge}
                    setExtra={setExtra}
                    extra={extra}
                    setBasicInfo={setBasicInfo}
                  />
                )}
                {activeItem === "pre-test-counsel" && (
                  <PreTest
                    handleItemClick={handleItemClick}
                    setCompleted={setCompleted}
                    completed={completed}
                    setPatientObj={setPatientObj}
                    patientObj={patientObj}
                    setExtra={setExtra}
                    extra={extra}
                  />
                )}
                {activeItem === "hiv-test" && (
                  <HivTestResult
                    handleItemClick={handleItemClick}
                    setCompleted={setCompleted}
                    completed={completed}
                    setPatientObj={setPatientObj}
                    patientObj={patientObj}
                    setExtra={setExtra}
                    extra={extra}
                  />
                )}
                {activeItem === "post-test" && (
                  <PostTest
                    handleItemClick={handleItemClick}
                    setCompleted={setCompleted}
                    completed={completed}
                    setPatientObj={setPatientObj}
                    patientObj={patientObj}
                    setExtra={setExtra}
                    extra={extra}
                  />
                )}
                {activeItem === "indexing" && (
                  <IndexingContactTracing
                    handleItemClick={handleItemClick}
                    setCompleted={setCompleted}
                    completed={completed}
                    setPatientObj={setPatientObj}
                    patientObj={patientObj}
                    setExtra={setExtra}
                    extra={extra}
                  />
                )}
                {activeItem === "recency-testing" && (
                  <RecencyTesting
                    handleItemClick={handleItemClick}
                    setCompleted={setCompleted}
                    completed={completed}
                    setPatientObj={setPatientObj}
                    patientObj={patientObj}
                    setExtra={setExtra}
                    extra={extra}
                  />
                )}
                {activeItem === "others" && (
                  <Others
                    handleItemClick={handleItemClick}
                    setCompleted={setCompleted}
                    completed={completed}
                    setPatientObj={setPatientObj}
                    patientObj={patientObj}
                    setExtra={setExtra}
                    extra={extra}
                  />
                )}
                {activeItem === "fit" && (
                  <FamilyIndexTestingForm
                    handleItemClick={handleItemClick}
                    setCompleted={setCompleted}
                    completed={completed}
                    setPatientObj={setPatientObj}
                    patientObj={patientObj}
                    setExtra={setExtra}
                    extra={extra}
                    basicInfo={basicInfo}
                    organizationInfo={organizationInfo}
                    history={false}
                  />
                )}
                {activeItem === "pns" && (
                  <PnsForm
                    handleItemClick={handleItemClick}
                    setCompleted={setCompleted}
                    completed={completed}
                    setPatientObj={setPatientObj}
                    patientObj={patientObj}
                    setExtra={setExtra}
                    extra={extra}
                    basicInfo={basicInfo}
                    organizationInfo={organizationInfo}
                  />
                )}

                {activeItem === "client-referral" && (
                  <RefferralUnit
                    handleItemClick={handleItemClick}
                    setCompleted={setCompleted}
                    completed={completed}
                    setPatientObj={setPatientObj}
                    patientObj={patientObj}
                    setExtra={setExtra}
                    extra={extra}
                    basicInfo={basicInfo}
                    organizationInfo={organizationInfo}
                    addNewForm={false}
                  />
                )}
                {activeItem === "refferal-history" && (
                  <ClientReferralHistory
                    handleItemClick={handleItemClick}
                    setCompleted={setCompleted}
                    completed={completed}
                    setPatientObj={setPatientObj}
                    patientObj={patientObj}
                    setExtra={setExtra}
                    extra={extra}
                    basicInfo={basicInfo}
                    organizationInfo={organizationInfo}
                    activePage={props.activePage}
                    setActivePage={props.setActivePage}
                    setRow={setRow}
                  />
                )}
                {activeItem === "view-referral" && (
                  <ViewClientReferral
                    handleItemClick={handleItemClick}
                    setCompleted={setCompleted}
                    completed={completed}
                    setPatientObj={setPatientObj}
                    patientObj={patientObj}
                    setExtra={setExtra}
                    extra={extra}
                    basicInfo={basicInfo}
                    organizationInfo={organizationInfo}
                    addNewForm={false}
                    row={row}
                  />
                )}
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
};

export default UserRegistration;
