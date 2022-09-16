import React, {useCallback, useEffect, useState} from "react";
import { Button} from 'semantic-ui-react'
import {Card, CardBody} from "reactstrap";
import {makeStyles} from "@material-ui/core/styles";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import {Link, useHistory, useLocation} from "react-router-dom";
//import {TiArrowBack} from 'react-icons/ti'
//import {token, url as baseUrl } from "../../../api";
import 'react-phone-input-2/lib/style.css'
import { Icon, Menu } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import BasicInfo from './NewRegistration/BasicInfo'
import PreTest from './NewRegistration/PreTest'
import HivTestResult from './NewRegistration/HivTestResult'
import IndexingContactTracing from './NewRegistration/Elicitation/Index'
import Others from './NewRegistration/Others'
import PostTest from './NewRegistration/PostTest'
import RecencyTesting from './NewRegistration/RecencyTesting'



const useStyles = makeStyles((theme) => ({

    error:{
        color: '#f85032',
        fontSize: '12.8px'
    },  
    success: {
        color: "#4BB543 ",
        fontSize: "11px",
    },
}));


const UserRegistration = (props) => {
    //console.log(props)
    //const classes = useStyles();
    const location = useLocation();
    const locationState = location.state;
    const [saving, setSaving] = useState(false);
    const [activeItem, setactiveItem] = useState('basic');
    const [completed, setCompleted] = useState([]);
    const [patientObj, setPatientObj] = useState("");
    const handleItemClick =(activeItem)=>{
        setactiveItem(activeItem)
        //setCompleted({...completed, ...completedMenu})
    }
    useEffect(() => { 
        if(locationState && locationState.patientObj){
            setPatientObj(locationState.patientObj)           
        }
    }, []);


    return (
        <>
            <ToastContainer autoClose={3000} hideProgressBar />
            <div className="row page-titles mx-0" style={{marginTop:"0px", marginBottom:"-10px"}}>
            <ol className="breadcrumb">
                <li className="breadcrumb-item active"><h4>HTS / <span style={{color:"#014D88", fontSize: "1.1rem", fontWeight:"bolder"}}>NEW HTS CLIENT</span></h4></li>
            </ol>
                
            </div>
            <Card >
                <CardBody>
                <form >
                    <div className="row">
                    <h3>HIV COUNSELLING AND TESTING
                    <Link to={"/"} >
                            <Button
                                variant="contained"
                                color="primary"
                                className=" float-end"
                                //startIcon={<FaUserPlus size="10"/>}
                                style={{backgroundColor:'#014d88', }}
                            >
                                <span style={{ textTransform: "capitalize" }}>Back</span>
                            </Button>
                    </Link>
                    </h3>
                        <br/>
                        <br/>
                        <div className="col-md-3 col-sm-3 col-lg-3">
                        <Menu  size='large'  vertical  style={{backgroundColor:"#014D88"}}>
                            <Menu.Item
                                name='inbox'
                                active={activeItem === 'basic'}
                                onClick={()=>handleItemClick('basic')}
                                style={{backgroundColor:activeItem === 'basic' ? '#000': ""}}
                            >               
                                <span style={{color:'#fff'}}> Basic Information
                                {completed.includes('basic') && (
                                    <Icon name='check' color='green' />
                                )}
                                </span>
                                
                            </Menu.Item>
                            <Menu.Item
                                name='spam'
                                active={activeItem === 'pre-test-counsel'}
                                onClick={()=>handleItemClick('pre-test-counsel')}
                                style={{backgroundColor:activeItem === 'pre-test-counsel' ? '#000': ""}}
                                //disabled={activeItem !== 'pre-test-counsel' ? true : false}
                            >
                            {/* <Label>2</Label> */}
                            <span style={{color:'#fff'}}>Pre Test Counseling
                            {completed.includes('pre-test-counsel') && (
                                <Icon name='check' color='green' />
                            )}
                            </span>
                            
                            </Menu.Item>
                            <Menu.Item
                                name='inbox'
                                active={activeItem === 'hiv-test'}
                                onClick={()=>handleItemClick('hiv-test')}
                                style={{backgroundColor:activeItem === 'hiv-test' ? '#000': ""}}
                                disabled={activeItem !== 'hiv-test' ? true : false}
                            >               
                                <span style={{color:'#fff'}}>Request {"&"} Result Form
                                {completed.includes('hiv-test') && (
                                    <Icon name='check' color='green' />
                                )}
                                </span>
                                
                                {/* <Label color='teal'>3</Label> */}
                            </Menu.Item>
                            <Menu.Item
                                name='spam'
                                active={activeItem === 'post-test'}
                                onClick={()=>handleItemClick('post-test')}
                                style={{backgroundColor:activeItem === 'post-test' ? '#000': ""}}
                                disabled={activeItem !== 'post-test' ? true : false}
                            >
                            {/* <Label>4</Label> */}
                            <span style={{color:'#fff'}}>Post Test Counseling 
                            {completed.includes('post-test') && (
                                <Icon name='check' color='green' />
                            )}</span>
                            
                            </Menu.Item>
                            
                            <Menu.Item
                                name='spam'
                                active={activeItem === 'recency-testing'}
                                onClick={()=>handleItemClick('recency-testing')}
                                style={{backgroundColor:activeItem === 'recency-testing' ? '#000': ""}}
                                disabled={activeItem !== 'recency-testing' ? true : false}
                            >
                            {/* <Label>4</Label> */}
                            <span style={{color:'#fff'}}>HIV Recency Testing
                            {completed.includes('recency-testing') && (
                                <Icon name='check' color='green' />
                            )}
                            </span>
                            
                            </Menu.Item>
                           
                            <Menu.Item
                                name='spam'
                                active={activeItem === 'indexing'}
                                onClick={()=>handleItemClick('indexing')}
                                style={{backgroundColor:activeItem === 'indexing' ? '#000': ""}}
                                disabled={activeItem !== 'indexing' ? true : false}
                            >
                            {/* <Label>4</Label> */}
                            <span style={{color:'#fff'}}>Index Notification Services - Elicitation
                            {completed.includes('indexing') && (
                                <Icon name='check' color='green' />
                            )}
                            </span>
                            
                            </Menu.Item>
                           
                        </Menu>
                        </div>
                        <div className="col-md-9 col-sm-9 col-lg-9 " style={{ backgroundColor:"#fff", margingLeft:"-50px", paddingLeft:"-20px"}}>
                            {activeItem==='basic' && (<BasicInfo handleItemClick={handleItemClick} setCompleted={setCompleted} completed={completed} setPatientObj={setPatientObj} patientObj={patientObj}/>)}
                            {activeItem==='pre-test-counsel' && (<PreTest handleItemClick={handleItemClick} setCompleted={setCompleted} completed={completed} setPatientObj={setPatientObj} patientObj={patientObj}/>)}
                            {activeItem==='hiv-test' && (<HivTestResult handleItemClick={handleItemClick} setCompleted={setCompleted} completed={completed} setPatientObj={setPatientObj} patientObj={patientObj}/>)}
                            {activeItem==='post-test' && (<PostTest handleItemClick={handleItemClick} setCompleted={setCompleted} completed={completed} setPatientObj={setPatientObj} patientObj={patientObj}/>)}
                            {activeItem==='indexing' && (<IndexingContactTracing handleItemClick={handleItemClick} setCompleted={setCompleted} completed={completed} setPatientObj={setPatientObj} patientObj={patientObj}/>)}
                            {activeItem==='recency-testing' && (<RecencyTesting  handleItemClick={handleItemClick} setCompleted={setCompleted} completed={completed} setPatientObj={setPatientObj} patientObj={patientObj}/>)}
                            {activeItem==='others' && (<Others handleItemClick={handleItemClick} setCompleted={setCompleted} completed={completed} setPatientObj={setPatientObj} patientObj={patientObj}/>)}
                            
                        </div>                                   
                    </div>

                
                    </form>
                </CardBody>
            </Card>                                 
        </>
    );
};

export default UserRegistration