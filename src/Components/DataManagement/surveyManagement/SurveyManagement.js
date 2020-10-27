import React, { Component, Fragment } from 'react';
import { Row, Col, Card, Tab, Nav, Table, Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import 'react-accessible-accordion/dist/fancy-example.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import filter from '../../../assets/images/Filter-Icon.svg';
import downloadIcon from '../../../assets/images/download-lite.svg';
import thinPlus from '../../../assets/images/thin-plus.svg';
import uploadIcon from '../../../assets/images/upload.svg';
import uploadedImg from '../../../assets/images/uploaded-img.png';
import fever from '../../../assets/images/fever.png';
import feverTwo from '../../../assets/images/dry-cough.png';
import * as DataManagementService from '../DataManagementService';
import AddSymptom from './AddSymptom';
import AddSurveyQuestion from './AddSurveyQuestion';

class SurveyManagement extends Component {
constructor(props) {
        super(props);
        this.state = {
            tempData:[],
            AddSymptomModelShow:false,
            AddSurveyQuestionModelShow:false
        };      
    }
    componentDidMount() {
        let tempData = [];               
        // for(var i=0;i<10;i++){
        //     tempData.push({
        //         EmployeeCode:'Emp01'+i,
        //         EmployeeName:'Emp'+i,
        //         Department:'Dep'+i,
        //         Designation:'Desi'+i,
        //         ContactNumber:'54353453453453',
        //         Status:'Work from Home'                
        //     })
        // }
        this.setState({tempData:tempData})        
    }
    AddSymptomModelShow=()=>{
        this.setState({AddSymptomModelShow:true});
    }
    AddSymptomModelHide=()=>{
        this.setState({AddSymptomModelShow:false});
    }
    AddSurveyQuestionModelShow=()=>{
        this.setState({AddSurveyQuestionModelShow:true});
    }
    AddSurveyQuestionModelHide=()=>{
        this.setState({AddSurveyQuestionModelShow:false});
    }
    render() {
        const { SearchBar } = Search;
        const survayColums = [
            {
               text: 'Parent Question',
               sort: false,
               formatter: (row, cell) => (
               <div className="custom-sort">
                  <i className="up"></i>
                  <i className="down"></i>
               </div>
               )
            },
            {
               dataField: 'employeeName',
               text: 'Response',
               sort: false,
                  formatter: (row, cell) => (
                  <p className="question-text ignoreBlue">
                     What symptoms are you going through? [multiple selections]
                  </p>
               )
            },
            {
               dataField: 'department',
               text: 'Question',
               sort: true
            },
            {
               dataField: 'designation',
               text: 'Type',
               sort: false,
                  formatter: (row, cell) => (
                  <p className="options">
                     Fever
                  </p>
                  )
            },
            {
                dataField: 'designation',
                text: 'Options',
                sort: false,
                   formatter: (row, cell) => (
                   <p className="options">
                      Fever
                   </p>
                   )
             },
            {
               text: 'Action',
               sort: false,
               formatter: (row, cell) => (
               <div className="action-btn">
                  <i className="icon-edit"></i>
                  <i className="icon-delete"></i>
               </div>
               )
            }
         ];
    
    return (
        <Fragment>
        <div className="tableList">
        <div className="symptomsTop">
        <div className="accordion__item">
        <div className="accordion__button">
            <div className="accordionHeader">
            <h5>Symptoms</h5>
            </div>
            <div className="tableSearch">
            <div className="filterSearch ml-auto filterSearch-2">
                <div className="download-icon add">
                    <img src={thinPlus} alt="download Icon" onClick={this.AddSymptomModelShow} />
                </div>
            </div>
            </div>
        </div>
    </div>
    <div className="symptoms-container">
        <div className="symptoms-data">
            <div className="symptoms edit">
            <img src={fever} alt="symptoms" />
            <p>Fever</p>
            </div>
            <div className="symptoms edit">
            <img src={feverTwo} alt="symptoms" />
            <p>Shortness <br /> of Breath</p>
            </div>
            <div className="symptoms edit">
            <img src={fever} alt="symptoms" />
            <p>Sneezing</p>
            </div>
            <div className="symptoms edit">
            <img src={feverTwo} alt="symptoms" />
            <p>Cough</p>
            </div>
        </div>
        <div className="add-symptoms">
            <div className="symptoms">
            <span className="add-icon">
            <img src={thinPlus} alt="Add Button"/>
            </span>
            </div>
        </div>
    </div>
</div>
        <div className="symptomsBottom">
        <div className="accordion__item">
            <div className="accordion__button">
                <div className="accordionHeader">
                    <h5>Survey Questions</h5>
                </div>
            </div>
        </div>
<ToolkitProvider keyField="id" data={this.state.tempData} columns={survayColums} search>
    { props => (
    <div id="accordionTable">
        <div className="filterSearch dataManagementSearch">
            <div className="filter">
            <div  className="mb-0 filterSearchForm-control">
                <form className="serach-form">
                    <SearchBar {...props.searchProps} />
                    <span className="search-icon"></span>
                </form>
            </div>
            </div>
        </div>
        <div className="tableSearch">
            <div className="filterSearch ml-auto filterSearch-2">
            <div className="download-icon add">
                <img src={thinPlus} alt="download Icon" onClick={this.AddSurveyQuestionModelShow}/>
            </div>
            </div>
        </div>
        <BootstrapTable bordered={false} noDataIndication="No Records Found" {...props.baseProps}/>
    </div>
    ) }
</ToolkitProvider>
</div>
</div>

        {
            this.state.AddSymptomModelShow == true ?(
                <AddSymptom AddSymptomModelShow={this.state.AddSymptomModelShow}
                AddSymptomModelHide={this.AddSymptomModelHide}></AddSymptom>
            ):null
        }
        {
            this.state.AddSurveyQuestionModelShow == true ?(
                <AddSurveyQuestion AddSurveyQuestionModelShow={this.state.AddSurveyQuestionModelShow}
                AddSurveyQuestionModelHide={this.AddSurveyQuestionModelHide}></AddSurveyQuestion>
            ):null
        }
    </Fragment>
    );
}
}
export default SurveyManagement;