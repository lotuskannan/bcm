import React, { Component } from 'react';
import { Row, Col, Card, Tab, Nav, Table, Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import cardBackground from '../../assets/images/cardBg.png';
import { GenericApiService } from '../../Service/GenericApiService';
import { UrlConstants } from '../../Service/UrlConstants';
import AddPlantModal from './AddPlantModal';
import AssignTaskModal from './AssignTaskModal';
import EditAssignTask from './time_piecker_EditAssignTask';
import { Link } from 'react-router-dom';
import PlantAreaModal from './PlantAreaModal';
import { Doughnut, Chart } from 'react-chartjs-2';
import Carousel from "react-multi-carousel";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import axios from 'axios';
import BaseUrl from '../../Service/BaseUrl';
import sharingService from '../../Service/DataSharingService';

const totalTasks = (props) => {
   var total = parseInt(props.overdueCount) + parseInt(props.ipCount) + parseInt(props.doneCount) + parseInt(props.yetToStartCount);
   return total ? '0' : total;
}

class CleanlinessAndSanitization extends Component {
   constructor(props) {
      super(props);
      this.state = {
         Data: [],
         modalShow: false,
         plantCardList: [],
         plantTaskList: [],
         filterList: [],
         tableId: 'plant_0',
         currentId: '',
         plantObject: '',
         areaList: [],
         selectedTabId: 0,
         Loader: false,
         plantName: '',
         startDate: new Date(),
         tableLoader: false,
         plantMasterId: '',
         includedColumns: ['area', 'task', 'assignedTo', 'taskStatus', 'plant'],
         expanTable: '',
         message: '',
         showMessage: false,
         selectedRowTaskData: [],
         editTaskModalShow: false,
         showDeleteModal: false,
         deleteTaskObject: '',
         plantId: 0,
         sessionExpired: false
      }
   }
   componentDidMount() {
      var plantId = sessionStorage.getItem("plantId") ? sessionStorage.getItem("plantId") : 0;
      this.setState({ plantId }, () => {
         if (this.props.history.location.search) {
            const paramplantId = this.props.history.location.search.split('?plant=')[1];
            this.navigationFromDashBoard(paramplantId);
         } else {
            this.getAllPlant();
         }
      });
      this.subscription = sharingService.getMessage().subscribe(message => {
         if (message) {
            if (this.props.history.location.pathname == '/home/cleansanitization' &&
               (message.text != 'new plant added' && message.text != 'plant deleted')) {
               var plantId = +message.text;
               this.setState({ plantId }, () => {
                  if (this.props.history.location.search) {
                     const paramplantId = this.props.history.location.search.split('?plant=')[1];
                     this.navigationFromDashBoard(paramplantId);
                  } else {
                     this.getAllPlant();
                  }
               });
            }
         }
      });
   }
   handleChange = date => {
      this.setState({
         startDate: date
      });
   };
   navigationFromDashBoard(paramplantId) {
      this.setState({ Loader: true });
      const { plantId } = this.state;
      var param = plantId != null && plantId != 0 ? '?clientPlantMasterId=' + plantId : '?clientPlantMasterId=0';
      var url = UrlConstants.getAllPlantUrl + param;
      GenericApiService.getAll(url)
         .then(response => {
            if (response.data) {
               const activePlantIndex = response.data.plantsCardList.findIndex(elem => elem.clientPlantMasterId == paramplantId);
               // const plantCardList    =  response.data.plantsCardList.map(elem => elem.clientPlantMasterId == plantId); 
               this.setState({
                  plantCardList: response.data.plantsCardList,
                  Loader: false,
               });
               this.openSelectedPlantTable(paramplantId, activePlantIndex);
               setTimeout(() => {
                  if (this.carousel && activePlantIndex != 0) {
                     this.carousel.next(activePlantIndex);
                  }
               }, 3000);
            } else {
               this.setState({ Loader: false, })
            }
         }).catch(error => {
            this.sessionExpired(error);
         });
   }

   sessionExpired(error) {
      if (error.message == "Request failed with status code 401" || error.message == "Network Error") {
         this.setState({ sessionExpired: true });
         setTimeout(() => {
            sessionStorage.clear();
            this.props.history.push("login");
            this.setState({ Loader: false });
         }, 3000);
      }
   }

   componentWillUnmount() {
      // this.getAllPlant();

   }
   getAreasAndTaskList(plantId) {
      if (plantId) {
         const url = UrlConstants.getAreasAndTaskUrl + '/' + plantId;
         GenericApiService.getAll(url)
            .then(response => {

               if (response.data) {
                  this.setState({
                     areaList: response.data.areas
                  })
               }
            }).catch(error => {
               this.sessionExpired(error);
            });
      }
   }

   getAllPlant = () => {
      this.setState({ Loader: true });
      const { plantId } = this.state;
      var param = plantId != null && plantId != 0 ? '?clientPlantMasterId=' + plantId : '?clientPlantMasterId=0';
      var url = UrlConstants.getAllPlantUrl + param;
      GenericApiService.getAll(url)
         .then(response => {
            if (response.data) {
               const plantName = response.data.plantsCardList ? response.data.plantsCardList[0].plant : '';
               const plantMasterId = response.data.plantsCardList ? response.data.plantsCardList[0].clientPlantMasterId : '';
               // const plantCardList    =  response.data.plantsCardList ? response.data.plantsCardList.map(elem => elem.clientPlantMasterId == plantId):[]; 

               this.setState({
                  plantCardList: response.data.plantsCardList == null ? [] : response.data.plantsCardList,
                  plantTaskList: response.data.plantTaskList == null ? [] : response.data.plantTaskList,
                  filterList: response.data.plantTaskList == null ? [] : response.data.plantTaskList,
                  Loader: false,
                  plantName: plantName,
                  plantMasterId: plantMasterId,
                  tableId: "plant_0",
                  currentId: plantMasterId,
                  selectedTabId: 0,

               })
               this.getAreasAndTaskList(plantMasterId);
               this.carousel.goToSlide(0);
            } else {
               this.setState({ Loader: false, })
            }
         }).catch(error => {
            this.sessionExpired(error);
         });
   }


   filterPlant = (searchText) => {

      const lowercasedValue = searchText.toLowerCase().trim();
      if (lowercasedValue === "") {
         this.setState({ plantTaskList: this.state.filterList })
      }
      else {

         const filteredItems = this.state.filterList.filter(item => {

            return Object.keys(item).some(key => {

               return this.state.includedColumns.includes(key) == true && item[key] ? item[key].toString().toLowerCase().includes(lowercasedValue) : false;
            });
         });

         this.setState({ plantTaskList: filteredItems })

      }
   }

   refreshCurretPlantList = () => {
      this.openSelectedPlantTable(localStorage.LastClickPlantId, localStorage.LastClickActivePlant);
   }
   openSelectedPlantTable = (plantId, activePlant) => {

      if (this.state.currentId == '' || this.state.currentId != plantId) {
         const plantName = this.state.plantCardList[activePlant].plant;
         const plantMasterId = this.state.plantCardList[activePlant].clientPlantMasterId;

         this.setState({
            tableId: "plant_" + activePlant,
            currentId: plantId,
            selectedTabId: activePlant,
            tableLoader: true,
            plantName: plantName,
            plantMasterId: plantMasterId
         });
         this.getAreasAndTaskList(plantId);
         const url = UrlConstants.getPlantTaskByIdUrl + plantId;
         GenericApiService.getAll(url)
            .then(response => {

               if (response.data) {
                  // this.setState({
                  //    plantTaskList: response.data.plantTaskList,
                  //    filterList: response.data.plantTaskList,
                  //    plantCardList: response.data.plantsCardList,
                  //    tableLoader: false
                  // });
                  this.setState({
                     plantTaskList: response.data.plantTaskList,
                     filterList: response.data.plantTaskList,
                     tableLoader: false
                  });

               } else {
                  this.setState({
                     tableLoader: false
                  })
               }

            }).catch(error => {
               this.sessionExpired(error);
            });
         this.setState({
            tableLoader: false
         })
      } else {
         return false;
      }
   }


   getTaskListByPlantMasterId = (plantId) => {
      if (plantId) {
         this.setState({ tableLoader: true });
         const url = UrlConstants.getPlantTaskByIdUrl + plantId;
         GenericApiService.getAll(url)
            .then(response => {
               if (response.data) {
                  this.setState({
                     plantTaskList: response.data.plantTaskList == null ? [] : response.data.plantTaskList,
                     filterList: response.data.plantTaskList == null ? [] : response.data.plantTaskList,
                     // plantCardList: response.data.plantsCardList == null ? [] : response.data.plantsCardList,
                     tableLoader: false
                  })
               } else {
                  this.setState({
                     tableLoader: false
                  })
               }
            }).catch(error => {
               this.sessionExpired(error);
            });
      } else {

         return false;

      }
   }

   // openPlantAreaModal = (e) => {

   //    this.plantArea.plantAreaObject(e);

   // }

   setModalShowOne = (e) => {
      this.setState({
         modalShow_one: e
      })
   }

   openAddPlantModal = () => {
      this.addplant.addplantModal();
   }


   updatePlant = (plant) => {

      this.addplant.getPlantObjectById(plant.clientPlantMasterId);
   }

   updateTask = (object, task) => {
      var newObject = '';
      if (task.taskStatus == null) {
      } else {
         if (task.bcmPlantTaskId == null) {
         } else {
            const url = BaseUrl.BaseUrl + 'bcm-protocol/cleanlinessprotocol/getTask/' + task.bcmPlantTaskId;
            axios.get(url, {
               headers: {
                  'content-type': 'application/json',
                  token: sessionStorage.loginUserToken
               }
            }).then(res => {
               newObject = res.data.data;
               if (newObject) {
                  var clientPlantAreaDetailId = newObject.bcmPlantTask.clientPlanAreaDetail.clientPlanAreaDetailId;
                  var taskMasterId = newObject.bcmPlantTask.clientPlantTaskMaster.taskMasterId;
                  var RowData = {
                     taskAssignedTo: newObject.bcmPlantTask.taskAssignedTo,
                     clientPlantAreaDetailId: clientPlantAreaDetailId,
                     taskMasterId: taskMasterId,
                     taskDateString: newObject.bcmPlantTask.taskDate,
                     taskStatus: newObject.bcmPlantTask.taskStatus,
                     timeFrom: newObject.bcmPlantTask.timeFrom,
                     timeTo: newObject.bcmPlantTask.timeTo,
                     plantTaskId: newObject.bcmPlantTask.plantTaskId,
                     createdBy: newObject.bcmPlantTask.createdBy,
                     updatedBy: JSON.parse(sessionStorage.LoginUserObject).bcmUserId,
                     rowObject: task,
                     assigneeName: newObject.bcmPlantTask.assigneeName
                  };
                  this.setState({ selectedRowTaskData: RowData });
                  this.setState({ editTaskModalShow: true });
               }
            }).catch(error => {
               this.sessionExpired(error);
            });
         }
      }
   }

   isActive = (id) => {
      return this.state.selectedTabId === id;
   }

   expandTable = () => {
      this.setState({ expanTable: this.state.expanTable ? '' : 'active' });
   }

   getAssignedTaskList = message => {
      this.getTaskListByPlantMasterId(this.state.plantMasterId);
      this.showNotification(message);
   }
   refreshList = message => {
      this.getAllPlant();
      this.showNotification(message)
   }

   showNotification(message) {
      if (message) {
         this.setState({
            message: message,
            showMessage: true
         });
         setTimeout(() => {
            this.setState({
               message: '',
               showMessage: false
            });
         }, 3000);
      }
   }

   deleteTask = (event) => {
      this.deleteModal(true);

      if (event.bcmPlantTaskId) {

         this.setState({ deleteTaskObject: event });
      }
   }

   conformDeleteTask = () => {

      if (this.state.deleteTaskObject) {

         const url = UrlConstants.deleteTaskUrl + this.state.deleteTaskObject.bcmPlantTaskId;
         GenericApiService.deleteById(url)
            .then(response => {

               if (response.status.success == 'SUCCESS') {
                  this.deleteModal(false);
                  const message = `${this.state.deleteTaskObject.task} task deleted successfully`;
                  this.showNotification(message);
                  this.getTaskListByPlantMasterId(this.state.plantMasterId);
               }
            }).catch(error => {
               this.sessionExpired(error);
            });
      }
   }

   onHide = (e) => {
      this.setState({ editTaskModalShow: false });
   }
   deleteModal = (e) => {
      this.setState({
         showDeleteModal: e
      })
   }
   render() {
      const responsive = {
         superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 1
         },
         desktop: {
            breakpoint: { max: 3000, min: 1200 },
            items: 2
         },
         tablet: {
            breakpoint: { max: 991, min: 590 },
            items: 2,

            slidesToSlide: 1
         },
         mobile: {
            breakpoint: { max: 590, min: 0 },
            items: 1,
            slidesToSlide: 1
         },
      };


      const commonColums = [
         {
            dataField: 'area',
            text: 'Areas',
            Cell: (row) => (
               <div>
                  <span title={row.value}>{row.value}</span>
               </div>
            ),
            sort: true,
            formatter: (row, cell) =>
               <div onClick={e => this.plantArea.plantAreaObject(cell)} className={`${cell.taskStatus == 'Overdue' ? 'error' :
                  cell.taskStatus == 'Done' ? 'success' : 'warning'}-status`}>
                  {cell.area ? cell.area : '--'}
               </div>


         },
         {
            dataField: 'task',
            text: 'Task',
            sort: true,
            formatter: (row, cell) => <div onClick={e => this.plantArea.plantAreaObject(cell)}>
               {cell.task ? cell.task : '--'}
            </div>

         },
         {
            dataField: 'assignedTo',
            text: 'Assigned To',
            sort: true,
            formatter: (row, cell) => <div onClick={e => this.plantArea.plantAreaObject(cell)}> {
               cell.assignedTo ? cell.assignedTo : '--'}
            </div>
         },
         {
            dataField: 'lastCleanedDate',
            text: 'Last Cleaned Date',
            sort: true,
            formatter: (row, cell) => <div onClick={e => this.plantArea.plantAreaObject(cell)}> {
               cell.lastCleanedDate ? cell.lastCleanedDate : '--'}
            </div>
         }, {
            dataField: 'taskStatus',
            text: 'Status',
            sort: true,
            formatter: (row, cell) => <div onClick={e => this.plantArea.plantAreaObject(cell)}>
               {cell.taskStatus ? cell.taskStatus : '--'}
            </div>,
            style: function callback(cell) {
               const color = cell == 'Overdue' ? '#F81313' : cell == 'Done' ? '#4ABF21' : cell == 'In Progress' ? '#FF8500' : '';
               return { color: color, cursor: 'pointer' };
            },
         },
         {
            // dataField: 'lastUpdatedStatus',
            text: 'Details',
            formatter: (row, cell) => (
               <div onClick={e => this.plantArea.plantAreaObject(cell)} className="videoFile">
                  <i className="icon icon-upload"></i>
               </div>)
         }
      ];

      const { Loader, tableLoader, expanTable, showDeleteModal, message, showMessage } = this.state;
      const { SearchBar } = Search;

      return (
         <>
            <AddPlantModal key={'addplant'} ref={instance => this.addplant = instance} getTaskList={this.getAssignedTaskList} reloadList={this.refreshList} />
            <AssignTaskModal key={'assignTask'} ref={instance => this.assignModal = instance}
               getList={this.getAssignedTaskList}
               plantName={this.state.plantName} plantMasterId={this.state.plantMasterId} />
            <PlantAreaModal key={'plantArea'} ref={intance => this.plantArea = intance} getList={this.getAssignedTaskList} />

            {
               // this.state.editTaskModalShow ? (
               //    <EditAssignTask onHide={this.onHide} selectedRowTaskData={this.state.selectedRowTaskData}
               //       editTaskModalShow={this.state.editTaskModalShow} getList={this.getAssignedTaskList} />
               // ) : null
            }

            <div className="dashboard-container cleanliness-sanitization">
               <div className="dashboard-section">
                  <div className="welcome-text">
                     <div className="pageTitle">
                        <h2>Cleanliness & Sanitization <span className="addBtn" onClick={this.openAddPlantModal}>
                           <i className="addIcon"></i></span>
                        </h2>
                     </div>
                  </div>
                  {showMessage ? <Alert variant="dark" className="mark">
                     <div className="alert-container">
                        <p><i className="icons"></i> {message}</p>
                     </div>
                  </Alert> : null}
                  {Loader ? <div className="loader">
                     <Spinner animation="grow" variant="dark" />
                  </div> : null}
                  <Alert show={this.state.sessionExpired} variant="danger">
                     <div className="alert-container">
                        <p><i className="icons"></i> Session Expired,Please login again.</p>
                    </div>   
                  </Alert>
                  <Tab.Container id="left-tabs-example" activeKey={this.state.tableId}>
                     <Row className="plant-tabs">
                        <div className="col-12 col-md-12 col-lg-8 h-100 pb-0 addSlider order-2 order-md-1">

                           {
                              this.state.plantCardList.length == 0 ? (
                                 <p></p>
                              ) : (
                                    <Carousel responsive={responsive} keyBoardControl={false} ref={(el) => (this.carousel = el)}>
                                       {this.state.plantCardList.map((pcard, index) =>
                                          <Nav.Item key={index}>
                                             <Nav.Link className={this.isActive(index) ? 'active' : ''} eventKey={`plant_` + index} >
                                                <Card className="emp-health card-alignment" onClick={(e) => this.openSelectedPlantTable(pcard.clientPlantMasterId, index)}>
                                                   <Card.Title className="topCard"
                                                      style={{ backgroundImage: pcard.clientPlantMasterImage ? `url(data:image/png;base64,${pcard.clientPlantMasterImage})` : `url(${cardBackground}` }}>
                                                      <div className="cardItem">
                                                         <h2>
                                                            {pcard.plant}
                                                         </h2>
                                                         <div className="action-icons" onClick={() => this.updatePlant(pcard)}>
                                                            <i className="editon" ></i>
                                                         </div>
                                                      </div>
                                                   </Card.Title>
                                                   <Card.Body className="h-100" >
                                                      <div className="customRow row align-items-center pr-0 mx-0 h-100">
                                                         <div className="totalTasks text-center col-4 col-xl-5">
                                                            {
                                                               // <h4>{pcard.overdueCount + pcard.ipCount + pcard.doneCount + pcard.yetToStartCount}</h4>

                                                               (pcard.overdueCount || pcard.ipCount || pcard.doneCount || pcard.yetToStartCount) ? (
                                                                  <h4>{pcard.overdueCount + pcard.ipCount + pcard.doneCount + pcard.yetToStartCount}</h4>
                                                               ) : (
                                                                     <h4>0</h4>
                                                                  )
                                                            }
                                                            <h4 className="mb">Total Tasks</h4>
                                                         </div>
                                                         <div className="pr-0 h-100 col-8 col-xl-7">
                                                            <div className="emp-tableContainer h-100">
                                                               <Table striped className="taskTable h-100">
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>Yet to start</td>
                                                                        <td>
                                                                           <div className="option error-color">{pcard.yetToStartCount}</div>
                                                                        </td>
                                                                     </tr>
                                                                     <tr>
                                                                        <td>Overdue</td>
                                                                        <td>
                                                                           <div className="option error-color">{pcard.overdueCount}</div>
                                                                        </td>
                                                                     </tr>
                                                                     <tr>
                                                                        <td>In-Progress</td>
                                                                        <td>
                                                                           <div className="option warning-color">{pcard.ipCount}</div>
                                                                        </td>
                                                                     </tr>
                                                                     <tr>
                                                                        <td>Done</td>
                                                                        <td>
                                                                           <div className="option success-color">{pcard.doneCount}</div>
                                                                        </td>
                                                                     </tr>
                                                                  </tbody>
                                                               </Table>
                                                            </div>
                                                         </div>
                                                      </div>
                                                   </Card.Body>
                                                </Card>
                                             </Nav.Link>
                                          </Nav.Item>)}
                                    </Carousel>
                                 )
                           }

                        </div>
                        <div className="col-12 col-md-6 col-lg-4 order-1 order-md-2 add-cards">
                           <Card className="emp-health addNew-card" onClick={this.openAddPlantModal}>

                              <Card.Body>
                                 <Row className="justify-content-center w-100 verification-container">
                                    <Col xl="12 align-self-center text-center verification-content pb-0">
                                       <h6>Branch II</h6>
                                       <p>Awaiting Verification...</p>
                                    </Col>
                                 </Row>
                                 <Row className="justify-content-center w-100 addNew-container">
                                    <Col xl="12 align-self-center text-center addNew-content pb-0">
                                       <span className="addBtn" ><i className="addIcon"></i></span>
                                    </Col>
                                 </Row>
                              </Card.Body>
                           </Card>
                        </div>
                     </Row>
                     <Tab.Content className={`row-1 row ` + expanTable}>
                        <Tab.Pane eventKey={this.state.tableId} className="col-xl-12">
                           <Card className="statusTable">
                              <ToolkitProvider keyField="clientPlantAreaDetailId" data={this.state.plantTaskList}
                                 columns={commonColums} search>
                                 {
                                    props => (
                                       <>
                                          <Card.Title className="bottomCard">
                                             <div className="cardTitle">
                                                <h4>Status</h4>
                                                <div className="tableSearch">
                                                   <div className="filterSearch ml-auto">
                                                      <div className="form1">
                                                         <form className="serach-form">
                                                            <select className="form-control" onChange={(e) => this.filterPlant(e.target.value)} id="exampleFormControlSelect1">
                                                               <option value={''}>All Areas</option>
                                                               {this.state.areaList.map(area =>
                                                                  <option key={area.clientPlanAreaDetailId} value={area.areaName} >
                                                                     {area.areaName}
                                                                  </option>)}
                                                            </select>
                                                         </form>
                                                      </div>
                                                      <div className="form1"><form className="serach-form">
                                                         <SearchBar {...props.searchProps} />
                                                         {/* <input className="form-control" type="text" onChange={(e) => this.filterPlant(e.target.value)} placeholder="Search" aria-label="Search" /> */}
                                                         <span className="search-icon"></span>
                                                      </form></div>
                                                      <div className="posSet"> <i className={`expandIcon icon-expand ` + expanTable} onClick={this.expandTable}>

                                                      </i></div>
                                                      <div className="eIcon">
                                                         <button type="button" className="btn btn-primary  assign-btn btn-sm" onClick={(e) => this.assignModal.addTask(true)}>Assign Task</button>
                                                      </div>

                                                   </div>
                                                </div>
                                             </div>
                                          </Card.Title>
                                          <Card.Body className="px-0 pt-0">

                                             <div className="statusTableContainer">
                                                {tableLoader ? <div className="loader">
                                                   <Spinner animation="grow" variant="dark" />
                                                </div> : null}
                                                <BootstrapTable sort={true} keyField={'clientPlantAreaDetailId'} bordered={false} noDataIndication="No Records Found"
                                                   {...props.baseProps} />
                                             </div>
                                          </Card.Body>
                                       </>
                                    )
                                 }
                              </ToolkitProvider>
                           </Card>
                        </Tab.Pane>
                     </Tab.Content>
                  </Tab.Container>
                  <Modal centered className="delete-confirm" show={showDeleteModal} onHide={e => this.deleteModal(false)}>

                     <Modal.Body>
                        <p className="text-center">Do you want to Delete the <b>{this.state.deleteTaskObject.task}</b> Task ?</p>
                        <div className="text-center">
                           <Button className="confirm-btn" onClick={this.conformDeleteTask}>
                              Confirm
                      </Button>
                           <Button onClick={e => this.deleteModal(false)}>
                              Cancel
                      </Button>
                        </div>
                     </Modal.Body>

                  </Modal>
               </div>
            </div>
         </>
      );
   }
}
export default CleanlinessAndSanitization;