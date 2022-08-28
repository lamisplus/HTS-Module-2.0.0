import React, {useCallback, useEffect, useState} from "react";

import {FormGroup, Label , CardBody, Spinner,Input,Form} from "reactstrap";
import * as moment from 'moment';
import {makeStyles} from "@material-ui/core/styles";
import {Card, CardContent} from "@material-ui/core";
// import AddIcon from "@material-ui/icons/Add";
// import CancelIcon from "@material-ui/icons/Cancel";
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
               
                <h2 >POST TEST COUNSELING</h2>
               
                <br/>
                    <form >
                        <div className="row">
                        <LabelRibbon as='a' color='blue' style={{width:'106%', height:'35px'}} ribbon>
                            <h5 style={{color:'#fff'}}>Knowledge Assessment</h5>
                        </LabelRibbon>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>HIV test result *</Label>
                                    <select
                                        className="form-control"
                                        name="hivTestResult"
                                        id="hivTestResult"
                                        
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="Yes">Positive</option>
                                        <option value="No">Negative</option>
                                        
                                    </select>
                                    
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Have you been tested for HIV before within this year? *</Label>
                                    <select
                                        className="form-control"
                                        name="hivTestBefore"
                                        id="hivTestBefore"
                                        
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="Yes">Not previously tested</option>
                                        <option value="No">previously tested negative</option>
                                        <option value="Yes">Previously tested positive in HIV care</option>
                                        <option value="No">previously tested positive not in HIV care</option>
                                        
                                    </select>
                                    
                                </FormGroup>
                            </div>
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>HIV Request and Result form signed by tester *</Label>
                                    <select
                                        className="form-control"
                                        name="hivRequestResult"
                                        id="hivRequestResult"
                                        
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
                                    <Label>HIV Request and Result form filled with CT Intake Form *</Label>
                                    <select
                                        className="form-control"
                                        name="hivRequestResultCt"
                                        id="hivRequestResultCt"
                                        
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
                                    <Label>Client received HIV test result *</Label>
                                    <select
                                        className="form-control"
                                        name="clientReceivedHivTestResult"
                                        id="clientReceivedHivTestResult"
                                        
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
                                    <Label>Post test counseling done *</Label>
                                    <select
                                        className="form-control"
                                        name="postTestCounseling"
                                        id="postTestCounseling"
                                        
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
                                    <Label>Risk reduction plan developed *</Label>
                                    <select
                                        className="form-control"
                                        name="riskReduction"
                                        id="riskReduction"
                                        
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
                                    <Label>Post test disclosure plan developed *</Label>
                                    <select
                                        className="form-control"
                                        name="postTestDisclosure"
                                        id="postTestDisclosure"
                                        
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
                                    <Label>Will bring partner(s) for HIV testing *</Label>
                                    <select
                                        className="form-control"
                                        name="bringPartnerHivtesting"
                                        id="bringPartnerHivtesting"
                                        
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
                                    <Label>Will bring own children {'<5'} years for HIV testing *</Label>
                                    <select
                                        className="form-control"
                                        name="childrenHivtesting"
                                        id="childrenHivtesting"
                                        
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
                                    <Label>Provided with information on FP and dual contraception *</Label>
                                    <select
                                        className="form-control"
                                        name="informationFp"
                                        id="informationFp"
                                        
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
                                    <Label>Client/Partner use FP methods (other than condom)*</Label>
                                    <select
                                        className="form-control"
                                        name="partnerFpThanCondom"
                                        id="partnerFpThanCondom"
                                        
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
                                    <Label>Client/Partner use condoms as (one) FP method </Label>
                                    <select
                                        className="form-control"
                                        name="partnerFpUseCondom"
                                        id="partnerFpUseCondom"
                                        
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
                                    <Label>Correct condom use demonstrated *</Label>
                                    <select
                                        className="form-control"
                                        name="correctCondomUse"
                                        id="correctCondomUse"
                                        
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
                                    <Label>Condoms provided to client *</Label>
                                    <select
                                        className="form-control"
                                        name="condomProvidedToClient"
                                        id="condomProvidedToClient"
                                        
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
                                    <Label>Unprotected sex with regular partner in the last 3months</Label>
                                    <select
                                        className="form-control"
                                        name="unprotectedSexRegularPartnerLastThreeMonth"
                                        id="unprotectedSexRegularPartnerLastThreeMonth"
                                        
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                        
                                    </select>
                                    
                                </FormGroup>
                            </div>
                            {/* <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Unprotected sex with regular particular in the last 3 months</Label>
                                    <select
                                        className="form-control"
                                        name="sex"
                                        id="sex"
                                        
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                        
                                    </select>
                                    
                                </FormGroup>
                            </div> */}
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>Client referred to other services *</Label>
                                    <select
                                        className="form-control"
                                        name="referredToServices"
                                        id="referredToServices"
                                        
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
                            <Button content='Back' icon='left arrow' labelPosition='left' style={{backgroundColor:"#992E62", color:'#fff'}} onClick={()=>handleItemClick('recency-testing', 'recency-testing')}/>
                            <Button content='Next' icon='right arrow' labelPosition='right' style={{backgroundColor:"#014d88", color:'#fff'}} onClick={()=>handleItemClick('indexing', 'post-test')}/>
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