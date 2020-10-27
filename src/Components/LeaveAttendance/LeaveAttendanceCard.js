import React, { Component, Fragment } from 'react';
import { Row, Col, Card, Tab, Nav, Table, Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import LeaveManagement from './LeaveAttendance';

class LeaveAttendanceCard extends Component {
   constructor(props) {
        super(props);
        this.state = {                  
        };      
   }
   componentDidMount() {      
   }
   render() {      
      return (
        <Fragment>
          <div className="dashboard-container" id="dataManagement">                
               <div className="dashboard-section">              
                  <div className="welcome-text">
                      <div className="employee-header">
                          <h2>Leave & Attendance</h2>                           
                      </div>
                  </div>
                  <LeaveManagement></LeaveManagement>
            </div>              
          </div>
      </Fragment>
      );
   }
}
export default LeaveAttendanceCard;