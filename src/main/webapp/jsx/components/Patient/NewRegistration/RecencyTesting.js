import React, {useCallback, useEffect, useState} from "react";

import {FormGroup, Label , CardBody, Spinner,Input,Form} from "reactstrap";
import * as moment from 'moment';
import {makeStyles} from "@material-ui/core/styles";
import {Card, CardContent} from "@material-ui/core";
// import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
// import {Link, useHistory, useLocation} from "react-router-dom";
// import {TiArrowBack} from 'react-icons/ti'
// import {token, url as baseUrl } from "../../../api";
import 'react-phone-input-2/lib/style.css'
import {Label as LabelRibbon, Button} from 'semantic-ui-react'
// import 'semantic-ui-css/semantic.min.css';
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";



const useStyles = makeStyles((theme) => ({
    card: {
        margin: theme.spacing(20),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
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
        width: 300,
    },
    button: {
        margin: theme.spacing(1),
    },
    root: {
        flexGrow: 1,
        maxWidth: 752,
    },
    demo: {
        backgroundColor: theme.palette.background.default,
    },
    inline: {
        display: "inline",
    },
    error:{
        color: '#f85032',
        fontSize: '12.8px'
    }
}));


const BasicInfo = (props) => {
    const classes = useStyles();
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const handleItemClick =(page, completedMenu)=>{
        props.handleItemClick(page)
        if(props.completed.includes(completedMenu)) {

        }else{
            props.setCompleted([...props.completed, completedMenu])
        }
    }

    return (
        <>
            <Card >
                <CardBody>
               
                <h3>RECENCY FORM</h3>
               
                <br/>
                    <form >
                        <div className="row">
                        <LabelRibbon as='a' color='blue' style={{width:'106%', height:'35px'}} ribbon>
                            <h5 style={{color:'#fff'}}>RENCENCY</h5>
                        </LabelRibbon>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Opt Out of RTRI?*</Label>
                                    <select
                                        className="form-control"
                                        name="optOutRTRI"
                                        id="optOutRTRI"
                                        
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                        
                                    </select>
                                    
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Test Name *</Label>
                                    <select
                                        className="form-control"
                                        name="optOutRTRITestName"
                                        id="optOutRTRITestName"
                                        
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="Asante">Asante</option>
                                        <option value="Others">Others</option>
                                        
                                    </select>
                                    
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Test Date *</Label>
                                    <Input
                                        type="date"
                                        name="optOutRTRITestDate"
                                        id="optOutRTRITestDate"
                                        // value={objValues.dateOfEac1}
                                        // onChange={handleInputChange}
                                        max= {moment(new Date()).format("YYYY-MM-DD") }
                                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    
                                    />
                                    
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Recency ID *</Label>
                                    <select
                                        className="form-control"
                                        name="RencencyId"
                                        id="RencencyId"
                                        
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                        
                                    </select>
                                    
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Control Line *</Label>
                                    <select
                                        className="form-control"
                                        name="controlLine"
                                        id="controlLine"
                                        
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                        
                                    </select>
                                    
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Verification Line *</Label>
                                    <select
                                        className="form-control"
                                        name="verififcationLine"
                                        id="verififcationLine"
                                        
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                        
                                    </select>
                                    
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Long Term Line *</Label>
                                    <select
                                        className="form-control"
                                        name="longTermLine"
                                        id="longTermLine"
                                        
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                        
                                    </select>
                                    
                                </FormGroup>
                            </div>

                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Recency Interpretation *</Label>
                                    <select
                                        className="form-control"
                                        name="rencencyInterpretation"
                                        id="rencencyInterpretation"
                                        
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                        
                                    </select>
                                    
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Has viral load request been made? *</Label>
                                    <select
                                        className="form-control"
                                        name="hasViralLoad"
                                        id="hasViralLoad"
                                        
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                        
                                    </select>
                                    
                                </FormGroup>
                            </div>
                           
                                                      
                            {saving ? <Spinner /> : ""}
                            <br />
                            <div className="row">
                            <div className="form-group mb-3 col-md-6">
                            <Button content='Back' icon='left arrow' labelPosition='left' style={{backgroundColor:"#992E62", color:'#fff'}} onClick={()=>handleItemClick('hiv-test', 'hiv-test')}/>
                            <Button content='Next' icon='right arrow' labelPosition='right' style={{backgroundColor:"#014d88", color:'#fff'}} onClick={()=>handleItemClick('post-test', 'recency-testing')}/>
                            </div>
                            </div>
                        </div>
                    </form>
                </CardBody>
            </Card>                                 
        </>
    );
};

export default BasicInfo