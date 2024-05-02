import {makeStyles} from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FormGroup, Label, CardBody, Spinner, Input, Form } from "reactstrap";
import * as moment from "moment";
import { Card } from "@material-ui/core";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import "react-phone-input-2/lib/style.css";
import { Label as LabelRibbon, Button } from "semantic-ui-react";

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
        width: 300,
    },
    button: {
        margin: theme.spacing(1),
    },
    root: {
        "& > *": {
            margin: theme.spacing(1),
        },
        "& .card-title": {
            color: "#fff",
            fontWeight: "bold",
        },
        "& .form-control": {
            borderRadius: "0.25rem",
            height: "41px",
        },
        "& .card-header:first-child": {
            borderRadius: "calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0",
        },
        "& .dropdown-toggle::after": {
            display: " block !important",
        },
        "& select": {
            "-webkit-appearance": "listbox !important",
        },
        "& p": {
            color: "red",
        },
        "& label": {
            fontSize: "14px",
            color: "#014d88",
            fontWeight: "bold",
        },
    },
    demo: {
        backgroundColor: theme.palette.background.default,
    },
    inline: {
        display: "inline",
    },
    error: {
        color: "#f85032",
        fontSize: "12.8px",
    },
}));
const HIVTPostTestAssessment = (props) => {
    const classes = useStyles();



    return (
        <>
            <Card className={classes.root}>
                <CardBody>
                    <h2>HIVST POST TEST ASSESSMENT</h2>
                    <form>
                        <div className="row">
                            <LabelRibbon
                                as="a"
                                color="blue"
                                style={{ width: "106%", height: "35px" }}
                                ribbon
                            >
                                <h5 style={{ color: "#fff" }}>RECENCY</h5>
                            </LabelRibbon>
                            <br />
                            <br />
                            <br />
                            <div className="form-group  col-md-4">
                                <FormGroup>
                                    <Label>
                                        ? <span style={{ color: "red" }}> *</span>
                                    </Label>
                                    <select
                                        className="form-control"
                                        name="optOutRTRI"
                                        id="optOutRTRI"
                                        // value={recency.optOutRTRI}
                                        // onChange={handleInputChangeRecency}
                                        style={{
                                            border: "1px solid #014D88",
                                            borderRadius: "0.2rem",
                                        }}
                                    >
                                        <option value={""}></option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </select>
                                </FormGroup>
                            </div>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </>
    );

}

export default HIVTPostTestAssessment;