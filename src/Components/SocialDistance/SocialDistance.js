import React, { Component, Fragment } from 'react';
import { Row, Col, Card, ProgressBar, Button, Modal, Table, Form, Spinner } from 'react-bootstrap';
import 'react-accessible-accordion/dist/fancy-example.css';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import 'react-circular-progressbar/dist/styles.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import * as SocialDistanceService from './SocialDistanceService';
import ModelSocialDistance from './ModelSocialDistance';

class SocialDistance extends Component {
   constructor(props) {
      super(props);
        this.state = {
            Data: [],
            pageLoader:true,
            modalShow: false,
            ImageUrl:''     
        };      
    }
    componentDidMount() {
        SocialDistanceService.getSocialDistanceList().then(response => {
            if (response.data) {
               this.setState({
                    Data: response.data,
                    pageLoader:false                   
                });               
            }                      
        },        
        );
    }
    viewImg=(Param,Object)=>{
        this.setState({ImageUrl:Param.framePath});
        this.setModalShow();
     }
     setModalShow = (e) => {
        this.setState({ modalShow: true });
     }
     onHide = (e) => {
        this.setState({ modalShow: false });
     }
    render() {
        const { SearchBar } = Search;      
        const commonColums = [
        {
            dataField: 'inputVideoFile',
            text: 'InputVideoFile',            
            sort: true
        },
        {
            dataField: 'totalCount',
            text: 'Total Count',
            sort: true
        },
        {
            dataField: 'createdDate',
            text: 'Created Date',
            sort: true
        }         
    ];
    const expandRow = {
        onlyOneExpanding: true,
        renderer: row => (
          <div>
            <Table striped  responsive className="caseDetailsTable">
                <thead>
                    <tr>                    
                        <th>Frame Count</th>
                        <th>Frame Path</th>                   
                    </tr>
                </thead>
                <tbody className="caseDetailsTableBody">
                    {
                        row.frameList.map((Object, index) => {                        
                            return (
                                <>
                                    <tr key={index}>
                                        <td> 
                                            {Object.frameCount}                                       
                                        </td> 
                                        <td> 
                                            <img width="100" height="100" border="0" align="center" style={{cursor: 'pointer'}}
                                            onClick={this.viewImg.bind(this,Object)} src={Object.framePath}/>                                       
                                        </td>                                    
                                    </tr>
                                </>
                            )
                        })
                    }
                </tbody>
            </Table>
          </div>
        )
    };
    return (
        <Fragment>
            <div className="dashboard-container">
                <div className="dashboard-section" style={{backgroundColor: '#ffffff',paddingTop: 30}}>
                {
                    this.state.pageLoader ? (
                    <div className="loader">
                        <Spinner animation="grow" variant="dark">
                        </Spinner>
                    </div>
                    ) : null
                }
                {
                    this.state.modalShow ? (
                       <ModelSocialDistance onHide={this.onHide} ImageUrl={this.state.ImageUrl} modalShow={this.state.modalShow} />
                    ) : null
                }
                    <BootstrapTable keyField='inputVideoFile' noDataIndication="Data Not Found" data={ this.state.Data } columns={ commonColums } expandRow={ expandRow }/>                    
                </div>
            </div>
        </Fragment>
      );
   }
}
export default SocialDistance;