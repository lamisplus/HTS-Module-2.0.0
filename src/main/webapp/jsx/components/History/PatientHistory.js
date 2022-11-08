import React, {useState, Fragment, useEffect } from "react";
import axios from "axios";
import { url as baseUrl } from "./../../../api";
import { token as token } from "./../../../api";
import { makeStyles } from "@material-ui/core/styles";
import { Row, Col, Card,  Tab, Tabs, } from "react-bootstrap";
import History from './History';
import ContineousRegistrationTesting from './../Patient/ContineousRegistrationTesting'
//import CheckedInPatients from './Patient/CheckedInPatients'


const divStyle = {
  borderRadius: "2px",
  fontSize: 14,
};

const Home = (props) => {
    const [patientList, setPatientList] = useState([])
    const [loading, setLoading] = useState(true)
    const patientId = props.patientObj && props.patientObj.id ? props.patientObj.id: null
    const [key, setKey] = useState('home');
    useEffect(() => {
        patients()
      }, [props.patientObj]);
    ///GET LIST OF Patients
    async function patients() {
      setLoading(true)
        axios
            .get(`${baseUrl}hts/persons/${patientId}`,
            { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                //console.log(response.data)
                setLoading(false)
                setPatientList(response.data.htsClientDtoList);
            })
            .catch((error) => {  
              setLoading(false)  
            });        
    }

  return (
    <Fragment>  
    <br/>
      <Row>       
        <Col xl={12}>
          <Card style={divStyle}>            
            <Card.Body>
              {/* <!-- Nav tabs --> */}
              <div className="custom-tab-1">
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-3"
                >
                <Tab eventKey="home" title="HTS HISTORY">                   
                    <History patientObj={props.patientObj} activePage={props.activePage} setActivePage={props.setActivePage} clientCode={props.clientCode} patientAge={props.patientAge} patients={patients} patientList={patientList} loading={loading}/>
                </Tab>
                {props.patientObj && props.patientObj.hivPositive===true  && (
                  <Tab eventKey="new" title="NEW HTS">                   
                      <ContineousRegistrationTesting patientObj={props.patientObj} activePage={props.activePage} setActivePage={props.setActivePage} clientCode={props.clientCode} patientAge={props.patientAge} patients={patients}/>
                  </Tab>
                 )}                     
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
