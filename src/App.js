import React from "react";
import {
  MemoryRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./main/webapp/vendor/bootstrap-select/dist/css/bootstrap-select.min.css";
import "./../src/main/webapp/css/style.css";
import 'bootstrap/dist/css/bootstrap.css';
import Home from './main/webapp/jsx/components/Home'
import RegisterPatient from './main/webapp/jsx/components/Patient/RegisterPatient'




export default function App() {
  return (

      <div>
      <ToastContainer />
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
         
          
          <Route path="/register-patient">
            <RegisterPatient />
          </Route>
          {/* 
          <Route path="/edit-patient">
            <EditPatient />
          </Route> */}
          <Route path="/">
            <Home />
          </Route>
        
          
        </Switch>
      </div>
 
  );
}




