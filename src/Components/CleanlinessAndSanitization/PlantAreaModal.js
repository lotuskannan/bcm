import React, { Component } from 'react'
import { Modal, Table, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import Carousel from "react-multi-carousel";
import { GenericApiService } from '../../Service/GenericApiService';
import { UrlConstants } from '../../Service/UrlConstants';
import videoFile from '../../assets/images/upload.svg';
import doneImg from '../../assets/images/deatils-done@2x.png';
import mediaImg from '../../assets/images/powder-coat-plant.jpg';
import viewimg from '../../assets/images/view.png';
import BootstrapTable from 'react-bootstrap-table-next';
import axios from 'axios';
import BaseUrl from '../../Service/BaseUrl';
import EditAssignTask from './EditAssignTask';
import ViewAssignTask from './ViewAssignTask';
import { Fragment } from 'react';

class PlantAreaModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            plantId: '',
            areaTaskList: [],
            filterList: [],
            Loader: false,
            plantName: '',
            areaName: '',
            EditAssignMsg: '',
            EditAssignMsgFlag: '',
            editTaskModalShow: false,
            selectedRowTaskData: [],
            deleteTaskObject: [],
            showDeleteModal: false,
            imageList: [],
            imageLoader: false,
            viewTaskModalShow: false
        }
    }

    setModalShow = (e) => {
        this.setState({ modalShow: e });
        if (localStorage.EditAssignMsg) {
            this.setState({ EditAssignMsg: localStorage.EditAssignMsg, EditAssignMsgFlag: localStorage.EditAssignMsgFlag });
            this.hideMsg();
        }
        if (e == false) {
            this.props.getList(false);
            this.setState({
                plantId: '',
                areaTaskList: [],
            })
        }
    }
    getAreaImageList = (plantId) => {

        const url = UrlConstants.getAreaImageListUrl + plantId;
        this.setState({ imageLoader: true });
        GenericApiService.getAll(url)
            .then(response => {
                if (response.status.success === 'SUCCESS') {
                    var imageArr = response.data.filter(elem => {
                        if (elem.image) {
                            return elem;
                        }
                    });
                    var tempArr;
                    if (imageArr.length == 1) {
                        tempArr = imageArr.concat([{ 'image': '' }]);
                    } else if (imageArr.length >= 2) {
                        tempArr = imageArr
                    } else {
                        tempArr = [{ 'image': '' }, { 'image': '' }];
                    }

                    this.setState({
                        imageList: tempArr,
                        imageLoader: false
                    });
                } else {

                    var tempArr = [{ 'image': '' }, { 'image': '' }];


                    this.setState({
                        imageList: tempArr,
                        imageLoader: false
                    });
                }

            }).catch(error => {
                var tempArr = [{ 'image': '' }, { 'image': '' }]
                this.setState({
                    imageList: tempArr,
                    imageLoader: false
                })
            })
    }


    plantAreaObject = (object) => {
        localStorage.LastPlantAreaObject = JSON.stringify(object);
        const plantMasterId = object.clientPlantAreaDetailId;
        this.getAreaImageList(object.bcmPlantTaskId);
        this.setModalShow(true);
        this.setState({
            areaTaskList: [],
            Loader: true,
            plantName: object.plant,
            areaName: object.area
        });
        GenericApiService.getAll(UrlConstants.getplantAreaListByIdUrl + plantMasterId)
            .then(response => {
                this.setState({
                    areaTaskList: response.data,
                    filterList: response.data,
                    Loader: false
                })
                this.highlight_row();
            })
            .catch(error => {
            })
    }

    onSort(sortKey, dir) {
        const sortingItems = this.state.filterList;
        this.setState({ sortDirection: !dir });
        sortingItems.sort((a, b) => {
            if (a[sortKey]) {
                if (this.state.sortDirection) {
                    return a[sortKey] > b[sortKey] ? 1 : -1
                }
                else if (!this.state.sortDirection) {
                    return a[sortKey] < b[sortKey] ? 1 : -1;
                }
                return 0;
            }
        });
        this.setState({ areaTaskList: sortingItems });
    }
    updateTask = (object, task) => {
        localStorage.Msg = '';
        this.setState({ EditAssignMsg: '', EditAssignMsgFlag: '' });
        localStorage.EditAssignMsg = '';
        localStorage.EditAssignMsgFlag = '';
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
                            assigneeName: newObject.bcmPlantTask.assigneeName,
                            image: newObject.bcmPlantTaskImageList.length == 0 ? '0' : newObject.bcmPlantTaskImageList[0].image
                        };
                        this.setState({ selectedRowTaskData: RowData });
                        this.setState({ editTaskModalShow: true });
                        this.setState({ modalShow: false });
                    }
                });
            }
        }
    }
    ViewTask = (object, task) => {
        localStorage.Msg = '';
        this.setState({ EditAssignMsg: '', EditAssignMsgFlag: '' });
        localStorage.EditAssignMsg = '';
        localStorage.EditAssignMsgFlag = '';
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
                            assigneeName: newObject.bcmPlantTask.assigneeName,
                            image: newObject.bcmPlantTaskImageList.length == 0 ? '0' : newObject.bcmPlantTaskImageList[0].image
                        };
                        this.setState({ selectedRowTaskData: RowData });
                        this.setState({ viewTaskModalShow: true });
                        this.setState({ modalShow: false });
                    }
                });
            }
        }
    }

    onHide = (e) => {
        this.setState({ editTaskModalShow: false });
        this.setState({ viewTaskModalShow: false });
        this.plantAreaObject(JSON.parse(localStorage.LastPlantAreaObject));
    }
    hideMsg = () => {
        setTimeout(() => {
            localStorage.EditAssignMsg = '';
            localStorage.EditAssignMsgFlag = '';
            this.setState({ EditAssignMsg: '', EditAssignMsgFlag: '' });
        }, 2000);
    }
    deleteTask = (event) => {
        if (event.bcmPlantTaskId) {
            this.setState({ deleteTaskObject: event });
            this.setState({ showDeleteModal: true });
        }
    }
    conformDeleteTask = () => {
        if (this.state.deleteTaskObject) {
            const url = UrlConstants.deleteTaskUrl + this.state.deleteTaskObject.bcmPlantTaskId;
            GenericApiService.deleteById(url)
                .then(response => {
                    if (response.status.success == 'SUCCESS') {
                        this.setDeleteModal(false);
                        this.setState({ Deletemessage: this.state.deleteTaskObject.task + " task deleted successfully" });
                        setTimeout(() => {
                            this.setState({ Deletemessage: '' });
                        }, 2000);
                        this.plantAreaObject(JSON.parse(localStorage.LastPlantAreaObject));
                    }
                })
                .catch(error => {
                })
        }
    }
    setDeleteModal = () => {
        this.setState({ showDeleteModal: false });
    }
    highlight_row = () => {
        var table = document.getElementById('areaTaskList');
        var cells = table.getElementsByTagName('td');
        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            cell.onclick = function () {
                var rowId = this.parentNode.rowIndex;
                var rowsNotSelected = table.getElementsByTagName('tr');
                for (var row = 0; row < rowsNotSelected.length; row++) {
                    rowsNotSelected[row].style.backgroundColor = "";
                    rowsNotSelected[row].classList.remove('selected');
                }
                var rowSelected = table.getElementsByTagName('tr')[rowId];
                rowSelected.style.backgroundColor = "#f4f4f4";
                rowSelected.className += " selected";
            }
        }
    }

    render() {
        const commonColums = [
            {
                dataField: 'task',
                text: 'Task',
                sort: true,
                formatter: (row, cell) =>
                    <div style={{ cursor: 'pointer' }} onClick={e => this.getAreaImageList(cell.bcmPlantTaskId)}>
                        {cell.task ? cell.task : '--'}
                    </div>
            },
            {
                dataField: 'assignedTo',
                text: 'Assigned To',
                sort: true,
                formatter: (row, cell) =>
                    <div style={{ cursor: 'pointer' }} onClick={e => this.getAreaImageList(cell.bcmPlantTaskId)}>
                        {cell.assignedTo ? cell.assignedTo : '--'}
                    </div>
            },
            {
                dataField: 'lastCleanedDate',
                text: 'Cleaned Date',
                sort: true,
                formatter: (row, cell) =>
                    <div style={{ cursor: 'pointer' }} onClick={e => this.getAreaImageList(cell.bcmPlantTaskId)}>
                        {cell.lastCleanedDate ? cell.lastCleanedDate : '--'}
                    </div>
            }, {
                dataField: 'taskRemarks',
                text: 'Remarks',
                sort: true,
                formatter: (row, cell) =>
                    <div style={{ cursor: 'pointer' }} onClick={e => this.getAreaImageList(cell.bcmPlantTaskId)}>
                        {cell.taskRemarks ? cell.taskRemarks : '--'}
                    </div>
            }, {
                dataField: 'taskStatus',
                text: 'Status',
                sort: true,
                formatter: (row, cell) =>
                    <div style={{ cursor: 'pointer' }} onClick={e => this.getAreaImageList(cell.bcmPlantTaskId)}>
                        {cell.taskStatus ? cell.taskStatus : '--'}
                    </div>,
                style: function callback(cell) {
                    const color = cell == 'Overdue' ? '#F81313' : cell == 'Done' ? '#4ABF21' : cell == 'In Progress' ? '#FF8500' : '';
                    return { color: color, cursor: 'pointer' };
                }
            },
            {
                text: 'Details',
                formatter: (row, cell) => (
                    <div className="videoFile">
                        <i onClick={() => this.ViewTask(this, cell)} className="eye-view"></i>
                     
                        {
                            cell.taskStatus == 'Done' ?(
                                <i className="edit-btn" style={{
                                    position: 'relative',
                                    backgroundImage: 'url(/static/media/edit-icon.eea18703.svg)',
                                    width: 14, height: 14, display: 'inline-block',
                                    marginRight: 8, opacity: 0.1, marginLeft: 5, cursor: 'not-allowed'
                                }}></i>
                            ):(
                                <i className="icon-edit" onClick={() => this.updateTask(this, cell)}></i>
                            )
                        }
                        <i className="icon-delete" onClick={e => this.deleteTask(cell)}></i>
                    </div>)
            }
        ];


        const responsive = {
            desktop: {
                breakpoint: { max: 3000, min: 1024 },
                items: 2,
                slidesToSlide: 1 // optional, default to 1.
            },
            tablet: {
                breakpoint: { max: 1024, min: 464 },
                items: 2,
                slidesToSlide: 2 // optional, default to 1.
            },
            mobile: {
                breakpoint: { max: 464, min: 0 },
                items: 1,
                slidesToSlide: 1 // optional, default to 1.
            }
        };


        const { imageLoader, Loader, imageList } = this.state;
        return (
            <Fragment>
                {
                    this.state.EditAssignMsg ? <Alert variant="dark" className="mark">
                        <div className="alert-container">
                            <p> <i className="icons"></i> {this.state.EditAssignMsg}</p>
                        </div>
                    </Alert> : null
                }
                <Modal id="powderCoating" show={this.state.modalShow}
                    onHide={() => { this.setModalShow(false) }} size="lg"
                    aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {this.state.areaName} - {this.state.plantName}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="mediaImage loader-imges-height" id="image_row">
                            <div className="col-12">
                                {imageLoader ? <div className="loader">
                                    <Spinner animation="grow" variant="dark" />
                                </div> : null}
                                <Carousel responsive={responsive} >
                                    {imageList.map((elem, index) =>
                                        elem.image ? <div key={index}>
                                            <figure className="carousel-img" style={{ backgroundImage: `url(${`data:image/png;base64,${elem.image}`})` }}>
                                            </figure>
                                        </div> : null
                                    )}
                                </Carousel>
                                <div className="mediaUpload text-center">
                                    <i className="icon icon-upload"></i>
                                </div>
                            </div>
                        </Row>
                        <div className="statusTableContainer p-4">
                            {Loader ? <div className="loader">
                                <Spinner animation="grow" variant="dark" />
                            </div> : null}

                            <BootstrapTable id="areaTaskList" name="areaTaskList" sort={true} keyField="bcmPlantTaskId"
                                data={this.state.areaTaskList} columns={commonColums} bordered={false} noDataIndication="No Record Found" />
                        </div>
                    </Modal.Body>
                </Modal>
                {
                    this.state.editTaskModalShow ? (
                        <EditAssignTask onHide={this.onHide} selectedRowTaskData={this.state.selectedRowTaskData}
                            editTaskModalShow={this.state.editTaskModalShow} />
                    ) : null
                }
                {
                    this.state.viewTaskModalShow ? (
                        <ViewAssignTask onHide={this.onHide}
                            selectedRowTaskData={this.state.selectedRowTaskData}
                            viewTaskModalShow={this.state.viewTaskModalShow} />
                    ) : null
                }
                {
                    this.state.showDeleteModal ? (
                        <Modal centered className="delete-confirm" show={this.state.showDeleteModal} onHide={this.setDeleteModal}>
                            <Modal.Body>
                                <p className="text-center">Do you want to Delete the <b>{this.state.deleteTaskObject.task}</b> Task ?</p>
                                <div className="text-center">
                                    <Button className="confirm-btn" onClick={this.conformDeleteTask}>
                                        Confirm
                            </Button>
                                    <Button onClick={this.setDeleteModal}>
                                        Cancel
                            </Button>
                                </div>
                            </Modal.Body>
                        </Modal>
                    ) : null
                }
                {
                    this.state.Deletemessage ? (
                        <Alert variant="dark" className="mark">
                            <div className="alert-container">
                                <p> <i className="icons"></i> {this.state.Deletemessage}</p>
                            </div>
                        </Alert>
                    ) : null
                }
            </Fragment>
        )
    }
}

export default PlantAreaModal;
