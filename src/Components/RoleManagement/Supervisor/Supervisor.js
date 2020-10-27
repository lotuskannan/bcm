import React, { Component, Fragment } from 'react';
import { Row, Col, Card, ProgressBar, Button, Modal, Table, Form, Spinner } from 'react-bootstrap';
import 'react-accessible-accordion/dist/fancy-example.css';
import 'react-circular-progressbar/dist/styles.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

class Supervisor extends Component {
   constructor(props) {
      super(props);
      this.state = {

      }           
   }
   render() {       
      return (
         <Fragment>
            <div>
                Supervisor Container
            </div>
         </Fragment>
      );
   }
}
export default Supervisor;