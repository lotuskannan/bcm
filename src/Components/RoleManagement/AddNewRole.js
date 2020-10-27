import React, { Component } from 'react';
import { Row, Col, Table, Modal, Form, Button, Spinner, Alert } from 'react-bootstrap';
import * as RoleManagementService from './RoleManagementService';

class AddNewRole extends Component {
   constructor(props) {
      super(props);
      this.state = {
         AddNewRoleModelShow: props.AddNewRoleModelShow,
         roleName: '',
         description: '',
         submitflag: '0',
         appPermissionList: [],
         seletedMenuFlag: false,
         Loader: false,
         sessionExpired:false
      }
   }
   componentDidMount() {
      this.appPermissionList();
   }
   appPermissionList = () => {
      this.setState({ Loader: true });
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
         this.setState({ appPermissionList: reObject, Loader: false });
      }).catch(error => {
         this.sessExpaired(error);
      })
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
   setModalHide = () => {
      this.setState({ roleName: '', description: '', submitflag: '0' });
      this.props.AddNewRoleModelHide();
   }
   addRoleValied = () => {
      this.setState({ submitflag: '1' });
      if (this.validForm()) {
      } else {
         this.addRole();
      }
   }
   addRole = () => {
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
         // "bcmUserGroupId":JSON.parse(sessionStorage.LoginUserObject).bcmUserGroupWrapper.bcmUserGroupId,
         "userGroup": this.state.roleName,
         "description": this.state.description,
         "isActive": 1,
         "createdBy": 1,
         "createdOn": onDate.split('T')[0],
         "updatedBy": 1,
         "updatedOn": onDate.split('T')[0]
      };
      this.setState({ Loader: true });
      RoleManagementService.saveUserGroup(RequestObject).then(response => {
         if (response.status.success == 'SUCCESS') {
            if (response.status.message == 'User Group Name Already Present') {
               localStorage.AddNewRoleFun = this.capitalize(this.state.roleName) + ' role was already present.';
               this.setState({ Loader: false });
               this.setModalHide();
            } else {
               localStorage.AddNewRoleFun = `Role "${this.capitalize(this.state.roleName)}" has been created successfully`;
               this.setState({ Loader: false });
               this.setModalHide();
            }
         }else{
            localStorage.AddNewRoleFun = this.capitalize(this.state.roleName) + ' role was already present.';
            this.setState({ Loader: false });
            this.setModalHide();
         }
      }).catch(error => {
         this.sessExpaired(error);
      })
   }
   capitalize = (s) => {
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1)
   }
   enterRoleName = event => {
      // let value = event.target.value.replace(/[^A-Za-z]/ig, '')
      let value = event.target.value.replace(/[^A-Za-z\s]/ig, '')
      this.setState({ roleName: value });
   }
   descriptionEvent = (event) => {
      this.setState({ description: event.target.value });
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
      return (
         <Modal id="addNewRoleModel" className="addNewRoleModel" show={this.state.AddNewRoleModelShow}
            onHide={this.setModalHide} size="sm"
            aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
               <Modal.Title id="contained-modal-title-vcenter" className="pl-1">Add New Role</Modal.Title>
            </Modal.Header>
            <Modal.Body className="role-container">
               <Alert show={this.state.sessionExpired} variant="danger">
               <div className="alert-container">
                  <p><i className="icons"></i>  Session Expired,Please login again.</p>
               </div>
               </Alert>
               {this.state.Loader &&
                  <div className="loader">
                     <Spinner animation="grow" variant="dark" />
                  </div>}
               <div className="role-details">
                  <Row>
                     <Col md={3} className="align-items-center d-flex">
                        <h6 className="role-name">Role Name <span className="mandatory">*</span></h6>
                     </Col>
                     <Col md={7}>
                        <Form.Group controlId="exampleForm.ControlInput1">
                           <Form.Control type="text" value={this.state.roleName} placeholder="Role Name"
                              onChange={this.enterRoleName.bind(this)} maxLength="50" />
                           {
                              (this.state.submitflag == '1' && this.state.roleName == '') ? (
                                 <Form.Text className="error-msg">
                                    Please enter the role name
                                 </Form.Text>
                              ) : null
                           }
                        </Form.Group>
                     </Col>
                  </Row>
                  <Row>
                     <Col md={3} className="align-items-center d-flex"><h6 className="role-name">Description</h6></Col>
                     <Col md={7}>
                        <Form.Group controlId="exampleForm.ControlInput1">
                           <Form.Control type="text" value={this.state.description} placeholder="Description"
                              onChange={this.descriptionEvent.bind(this)} maxLength="50" />
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
                                    <div className="checkbox-leave">
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
                  <Row>
                     <Col xl="12 text-center mt-4" className="modal-btn order-3 order-sm-4">
                        <button className="btn" onClick={this.setModalHide}>Cancel</button>
                        <button className={this.validForm() == false ? 'verify-btn-green btn' : "btn"} onClick={this.addRoleValied}>Add</button>
                     </Col>
                  </Row>
               </div>


            </Modal.Body>
         </Modal>
      )
   }
}

export default AddNewRole;