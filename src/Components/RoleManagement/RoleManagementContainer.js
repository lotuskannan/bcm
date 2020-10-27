import React, { Component, Fragment } from 'react';
import { Row, Col, Card, Tab, Nav, Table, Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import 'react-accessible-accordion/dist/fancy-example.css';
import 'react-circular-progressbar/dist/styles.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import AddNewRole from './AddNewRole';
import thinPlus from '../../assets/images/thin-plus.svg';
import * as RoleManagementService from './RoleManagementService';

class RoleManagementContainer extends Component {
   constructor(props) {
      super(props);
      this.state = {
         selectedPage: '',
         AddNewRoleModelShow: false,
         roleName: '',
         description: '',
         submitflag: '1',
         appPermissionList: [],
         showMessage: false,
         message: '',
         getAllUserGroupListByIdAndName: [],
         groupContainerLoder: false,
         roleContainerLoder: false,
         seletedMenuFlag: true,
         bcmUserGroupId: '',
         showDeleteModal: false,
         allowEdit: true,
         modalLoader: false,
         sessionExpired: false,
         selectGroupID: ''

      };
   }
   componentDidMount() {
      this.setState({ groupContainerLoder: true, roleContainerLoder: true });
      this.getAllUserGroupListByIdAndName();
   }
   appPermissionList = () => {
      RoleManagementService.appPermissionList().then(response => {
         let reObject = [];
         for (var i = 0; i < response.data.length; i++) {
            reObject.push({
               bcmAppPermissionId: response.data[i].bcmAppPermissionId,
               navigationMenu: response.data[i].navigationMenu,
               isActive: response.data[i].isActive,
               createdBy: response.data[i].createdBy,
               createdOn: response.data[i].createdOn,
               updatedOn: response.data[i].updatedOn,
               updatedBy: response.data[i].updatedBy,
               checked: false
            });
         }
         this.setState({ appPermissionList: reObject });
         this.init();
      }).catch(error => {
         this.sessExpaired(error);
      })
   }
   getAllUserGroupListByIdAndName = () => {
      RoleManagementService.getAllUserGroupListByIdAndName().then(response => {
         let getAllUserGroupListByIdAndName = [];
         for (var i = 0; i < response.data.length; i++) {
            getAllUserGroupListByIdAndName.push({
               bcmUserGroupId: response.data[i].bcmUserGroupId,
               userGroup: response.data[i].userGroup,
               active: false
            });
         }
         this.setState({ getAllUserGroupListByIdAndName: getAllUserGroupListByIdAndName });
         this.appPermissionList();
      }).catch(error => {
         this.sessExpaired(error);
      })
   }
   init = () => {
      if (this.state.getAllUserGroupListByIdAndName.length == 0) {
      }
      else {
         if (localStorage.AddNewRoleFun == '') {
            let initGroup = this.state.getAllUserGroupListByIdAndName[0];
            for (var i = 0; i < document.getElementsByName('roleli').length; i++) {
               document.getElementsByName('roleli')[i].className = '';
            }
            document.getElementsByName('roleli')[0].className = 'active';
            this.getPermitssionMapping(initGroup.bcmUserGroupId);
         } else {
            let initGroup = this.state.getAllUserGroupListByIdAndName[this.state.getAllUserGroupListByIdAndName.length - 1];
            for (var i = 0; i < document.getElementsByName('roleli').length; i++) {
               document.getElementsByName('roleli')[i].className = '';
            }
            document.getElementsByName('roleli')[document.getElementsByName('roleli').length - 1].className = 'active';
            this.getPermitssionMapping(initGroup.bcmUserGroupId);
            localStorage.AddNewRoleFun = '';
         }
      }
   }
   getPermitssionMapping = (GroupId) => {
      var GroupId = GroupId;
      RoleManagementService.getUserPermissionBesedOnGroupId(GroupId).then(response => {
         if (response.data) {
            this.setState({ roleName: response.data.userGroup });
            this.setState({ description: response.data.description });
            this.setState({ bcmUserGroupId: response.data.bcmUserGroupId });
            let selectedGroupPermitssion = [];
            let selectedGroupPermitssionId = [];
            selectedGroupPermitssion = response.data.bcmAppPermission;
            for (var j = 0; j < selectedGroupPermitssion.length; j++) {
               selectedGroupPermitssionId.push(selectedGroupPermitssion[j].bcmAppPermissionId);
            }
            let reObject = [];
            for (var K = 0; K < this.state.appPermissionList.length; K++) {
               reObject.push({
                  bcmAppPermissionId: this.state.appPermissionList[K].bcmAppPermissionId,
                  navigationMenu: this.state.appPermissionList[K].navigationMenu,
                  isActive: this.state.appPermissionList[K].isActive,
                  createdBy: this.state.appPermissionList[K].createdBy,
                  createdOn: this.state.appPermissionList[K].createdOn,
                  updatedOn: this.state.appPermissionList[K].updatedOn,
                  updatedBy: this.state.appPermissionList[K].updatedBy,
                  checked: selectedGroupPermitssionId.indexOf(this.state.appPermissionList[K].bcmAppPermissionId) == -1 ? false : true
               });
            }
            this.setState({ appPermissionList: reObject });
            this.setState({ groupContainerLoder: false, roleContainerLoder: false });
         } else {
            this.setState({ groupContainerLoder: false, roleContainerLoder: false });
         }
      }).catch(error => {
         this.sessExpaired(error);
      })
   }
   selectGroup = (object, index, group) => {
      this.setState({ roleContainerLoder: true, allowEdit: true });
      for (var i = 0; i < document.getElementsByName('roleli').length; i++) {
         document.getElementsByName('roleli')[i].className = '';
      }
      document.getElementsByName('roleli')[index].className = 'active';
      this.setState({ selectGroupID: object.bcmUserGroupId });
      this.getPermitssionMapping(object.bcmUserGroupId);
   }
   AddNewRoleModelShow = () => {
      localStorage.AddNewRoleFun = '';
      this.setState({ AddNewRoleModelShow: true });
   }
   AddNewRoleModelHide = () => {
      if (localStorage.AddNewRoleFun == '' || localStorage.AddNewRoleFun == undefined) {
         this.setState({ AddNewRoleModelShow: false });
      } else {
         this.showNotification(localStorage.AddNewRoleFun);
         this.setState({ AddNewRoleModelShow: false });
         this.setState({ groupContainerLoder: true, roleContainerLoder: true });
         this.getAllUserGroupListByIdAndName();
      }
   }
   showNotification(message) {
      if (message) {
         this.setState({
            message: message, showMessage: true
         });
         setTimeout(() => {
            this.setState({ message: '', showMessage: false });
         }, 4000);
      }
   }
   afterInsertInit = () => {
      let last_element = this.state.getAllUserGroupListByIdAndName[this.state.getAllUserGroupListByIdAndName.length - 1];
      for (var i = 0; i < document.getElementsByName('roleli').length; i++) {
         document.getElementsByName('roleli')[i].className = '';
      }
      let inx = document.getElementsByName('roleli').length;
      document.getElementsByName('roleli')[inx].className = 'active';
      this.getPermitssionMapping(last_element.bcmUserGroupId);
   }
   enterRoleName = event => {
      let value = event.target.value.replace(/[^A-Za-z\s]/ig, '');
      this.setState({ roleName: value });
   }
   descriptionEvent = (event) => {
      this.setState({ description: event.target.value });
   }
   menuSelect = (i) => (event) => {
      this.setState((state, props) => {
         state.appPermissionList[i].checked = !state.appPermissionList[i].checked;
         return {
            appPermissionList: state.appPermissionList
         }
      });
      let count = 0;
      for (var M = 0; M < document.getElementsByName('menucheckbox').length; M++) {
         if (document.getElementsByName('menucheckbox')[M].checked == true) {
            count++;
         }
      }
      if (count == 0) {
         this.setState({ seletedMenuFlag: false });
      } else {
         this.setState({ seletedMenuFlag: true });
      }
   }
   addRoleValid = () => {
      this.setState({ submitflag: '1' });
      if (this.validForm()) {
      } else {
         this.addRole();
      }
   }
   addRole = () => {
      this.setState({ roleContainerLoder: true });
      var onDate = new Date().toISOString();
      let PermissionId = [];
      for (var i = 0; i < this.state.appPermissionList.length; i++) {
         if (this.state.appPermissionList[i].checked == true) {
            PermissionId.push({
               'bcmAppPermissionId': this.state.appPermissionList[i].bcmAppPermissionId
            });
         }
      }
      let RequestObject = {
         "bcmAppPermission": PermissionId,
         "bcmUserGroupId": this.state.bcmUserGroupId,
         "userGroup": this.state.roleName,
         "description": this.state.description,
         "isActive": 1,
         "createdBy": 1,
         "createdOn": onDate.split('T')[0],
         "updatedBy": 1,
         "updatedOn": onDate.split('T')[0]
      };
      RoleManagementService.saveUserGroup(RequestObject).then(response => {
         if (response.status.success == 'SUCCESS') {
            if (response.status.message == 'User Group Name Already Present') {
               let msg = this.capitalize(this.state.roleName) + ' role was already present.';
               this.showNotification(msg);
               this.setState({ roleContainerLoder: false, allowEdit: true });
               this.getPermitssionMapping(this.state.selectGroupID);
            } else {
               let msg = `Role "${this.capitalize(this.state.roleName)}" has been updated successfully`;
               this.showNotification(msg);
               this.setState({ roleContainerLoder: false, allowEdit: true });
            }
         } else {
            let msg = this.capitalize(this.state.roleName) + ' role was already present.';
            this.showNotification(msg);
            this.setState({ roleContainerLoder: false, allowEdit: true });
            this.getPermitssionMapping(this.state.selectGroupID);
         }
      }).catch(error => {
         this.sessExpaired(error);
      })
   }
   deleteGroup = () => {
      this.setState({ showDeleteModal: true });
   }
   setDeleteModal = () => {
      this.setState({ showDeleteModal: false });
   }
   conformDeleteRole = () => {
      this.setState({ roleContainerLoder: true, modalLoader: true });
      let bcmUserGroupId = this.state.bcmUserGroupId;
      RoleManagementService.deleteUserGroup(bcmUserGroupId).then(response => {
         if (response.status.success == 'SUCCESS') {
            if (response.status.message == 'Users Have Been Mapped For The Group') {
               let msg = `Role "${this.capitalize(this.state.roleName)}" cannot be deleted, unmap employees and delete`;
               this.showNotification(msg);
               this.setDeleteModal();
               this.setState({ groupContainerLoder: false, roleContainerLoder: false, modalLoader: false });
               this.getAllUserGroupListByIdAndName();
            } else {
               let msg = `Role "${this.capitalize(this.state.roleName)}" has been deleted successfully`;
               this.showNotification(msg);
               this.setDeleteModal();
               this.setState({ groupContainerLoder: true, roleContainerLoder: true, modalLoader: false });
               this.getAllUserGroupListByIdAndName();
            }
         } else {
            let msg = `Role "${this.capitalize(this.state.roleName)}" cannot be deleted, unmap employees and delete`;
            this.showNotification(msg);
            this.setDeleteModal();
            this.setState({ groupContainerLoder: false, roleContainerLoder: false, modalLoader: false });
         }
      }).catch(error => {
         this.sessExpaired(error);
      })
   }
   capitalize = (s) => {
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1)
   }
   validForm() {
      return this.state.roleName == '' || this.state.seletedMenuFlag == false;
   }

   sessExpaired(error) {
      if (error.message == "Request failed with status code 401" || error.message == "Network Error") {
         this.setState({ sessionExpired: true });
         setTimeout(() => {

            sessionStorage.clear();
            this.props.history.push("login");
            this.setState({ Loader: false });
         }, 3000);
      }
   }

   render() {
      const { allowEdit, modalLoader } = this.state;
      return (
         <Fragment>
            <Alert show={this.state.sessionExpired} variant="danger">
            <div className="alert-container">
               <p><i className="icons"></i>  Session Expired,Please login again.</p>
            </div>
            </Alert>
            <div className="dashboard-container" id="roleManagementContainer">
               <div className="dashboard-section">
                  <div className="welcome-text">
                     <div className="employee-header">
                        <h2>Role Management</h2>
                     </div>
                  </div>
                  {this.state.groupContainerLoder &&
                     <div className="loader">
                        <Spinner animation="grow" variant="dark" />
                     </div>}
                  <div className="tableList">
                     {this.state.showMessage ? <Alert variant="dark" className="mark">
                        <div className="alert-container">
                           <p><i className="icons"></i> {this.state.message}</p>
                        </div>
                     </Alert> : null}
                     <div className="accordion__item">
                        <div className="accordion__button">
                           <div className="accordionHeader">
                              <h5>Roles</h5>
                           </div>
                           <div className="tableSearch">
                              <div className=" ml-auto d-flex">
                                 <div className="download-icon add">
                                    <img onClick={this.AddNewRoleModelShow} src={thinPlus} alt="download Icon" />
                                 </div>
                              </div>
                           </div>
                        </div>

                     </div>
                     <div className="roles-container">
                        <div className="roles-title">
                           <ul className="roles-title-list">
                              {
                                 this.state.getAllUserGroupListByIdAndName.length == 0 ? (
                                    <></>
                                 ) : (
                                       this.state.getAllUserGroupListByIdAndName.map((role, index) => (
                                          <li name="roleli" className="" key={index}
                                             onClick={this.selectGroup.bind(this, role, index)}>{role.userGroup}</li>
                                       ))
                                    )
                              }
                           </ul>
                        </div>
                        <div className="role-container">
                           {
                              this.state.roleContainerLoder === true ? (
                                 <div className="loader">
                                    <Spinner animation="grow" variant="dark" />
                                 </div>
                              ) : null
                           }
                           <div className="role-details">
                              <Row>
                                 <Col md={3} className="align-items-center d-flex">
                                    <h6 className="role-name">Role Name <span className="mandatory">*</span></h6>
                                 </Col>
                                 <Col md={6}>
                                    <Form.Group controlId="exampleForm.ControlInput1">
                                       <Form.Control type="text" value={this.state.roleName}
                                          onChange={this.enterRoleName.bind(this)} placeholder="Role Name" disabled={allowEdit} />
                                       {
                                          (this.state.submitflag == '1' && this.state.roleName == '') ? (
                                             <Form.Text className="error-msg">
                                                Please enter the role name
                                             </Form.Text>
                                          ) : null
                                       }
                                    </Form.Group>
                                 </Col>
                                 <Col md={3} className="align-items-top d-flex justify-content-end action-btn-container">
                                    <div className="action-btn">
                                       <i className="icon-edit" onClick={() => this.setState({ allowEdit: !allowEdit })}></i>
                                       <i className="icon-delete" onClick={this.deleteGroup}></i>
                                    </div>
                                 </Col>
                              </Row>
                              <Row>
                                 <Col md={3} className="align-items-center d-flex"><h6 className="role-name">Description</h6></Col>
                                 <Col md={6}>
                                    <Form.Group controlId="exampleForm.ControlInput1">
                                       <Form.Control type="text" value={this.state.description} placeholder="Description"
                                          onChange={this.descriptionEvent.bind(this)} disabled={allowEdit} />
                                    </Form.Group>
                                 </Col>
                              </Row>
                              <Row className="mt-4">
                                 <Col md={12} className="mb-4"><h6 className="role-name">Menu items</h6></Col>
                                 {
                                    this.state.appPermissionList.length == 0 ? (
                                       <></>
                                    ) : (
                                          this.state.appPermissionList.map((menu, i) => (
                                             <Col md={6} xl={4}>
                                                <div className={`checkbox-leave ${allowEdit ? 'disabled' : ''}`}>
                                                   <label class="container">
                                                      <input type="checkbox" id="menucheckbox" name="menucheckbox" checked={menu.checked}
                                                         onChange={this.menuSelect(i)} />
                                                      <span class="checkmark"></span>
                                                      <span className="checkbox-text">{menu.navigationMenu}</span>
                                                   </label>
                                                </div>
                                             </Col>
                                          ))
                                       )
                                 }
                              </Row>
                              {
                                 (this.state.submitflag == '1' && this.state.seletedMenuFlag == false) ? (
                                    <Row>
                                       <Form.Text className="error-msg">
                                          Please select any one menu item
                                          </Form.Text>
                                    </Row>
                                 ) : null
                              }
                              <div className="bottom-button modal-btn">
                                 <Button className="mr-2" variant="secondary" size="sm" >Cancel</Button>
                                 <Button className={this.validForm() == false ? "verify-btn-green" : ''} variant="secondary" disabled={allowEdit} type="submit" size="sm" onClick={this.addRoleValid}>Update</Button>
                              </div>
                           </div>

                        </div>
                     </div>
                     <div>
                     </div>
                  </div>
                  {
                     this.state.AddNewRoleModelShow == true ? (
                        <AddNewRole AddNewRoleModelShow={this.state.AddNewRoleModelShow}
                           AddNewRoleModelHide={this.AddNewRoleModelHide} {...this.props}></AddNewRole>
                     ) : null
                  }
                  {
                     this.state.showDeleteModal ? (
                        <Modal centered className="delete-confirm" show={this.state.showDeleteModal} onHide={this.setDeleteModal}>
                           <Modal.Body>
                              {modalLoader &&
                                 <div className="loader">
                                    <Spinner animation="grow" variant="dark" />
                                 </div>}
                              <p className="text-center">Do you want to delete the <b>{this.state.roleName}</b> role ?</p>
                              <div className="text-center">
                                 <Button className="confirm-btn" onClick={this.conformDeleteRole}>
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

               </div>
            </div>
         </Fragment>
      );
   }
}
export default RoleManagementContainer;