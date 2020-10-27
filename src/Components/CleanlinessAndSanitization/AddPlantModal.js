import React, { Component } from 'react'
import { Modal, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { GenericApiService } from '../../Service/GenericApiService';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { UrlConstants } from '../../Service/UrlConstants';
import sharingService from '../../Service/DataSharingService';

class AddPlantModal extends Component {

   constructor(props) {
      super(props)

      this.state = {
         showModal: false,
         bcmUserId: '',
         bcmUserName: '',
         location: '',
         plantName: '',
         plantAreas: [
            {
               areaName: '',
               clientPlanAreaDetailId: 0
            }
         ],
         isError: {
            bcmUserName: '',
            location: '',
            plantName: '',
            plantAreaName: '',
            employeeCode: ''
         },
         employeeCodeList: [],
         plantMasterId: 0,
         isLoading: false,
         Loader: false,
         Manipulation: 'Add Branch',
         imageUploadError: '',
         selectedFile: null,
         showDeleteModal: false,


      }
   }

   componentDidMount() {

   }

   showAddPlantModal = (e) => {
      this.setState({
         showModal: e
      })
      if (e == false) {
         this.resetForm();
      }
   }

   addplantModal() {
      this.setState({ Manipulation: 'Add Branch' });
      this.showAddPlantModal(true);
   }

   resetForm() {
      this.setState({
         bcmUserId: '',
         bcmUserName: '',
         location: '',
         plantName: '',
         plantAreas: [
            {
               areaName: '',
               clientPlanAreaDetailId: 0
            }
         ],
         isError: {
            bcmUserName: '',
            location: '',
            plantName: '',
            plantAreaName: '',
            employeeCode: ''
         },
         employeeCodeList: [],
         plantMasterId: 0,
         Loader: false,
         imageUploadError: '',
         selectedFile: null,
         binaryImage: '',
         imageUploadError: '',
         selectedFile: null
      })
   }


   plantValidator = (Param) => {
      var returnMsg = '';
      if (Param.length == 0) {
         returnMsg = 'Branch name is required';
      } else {
         returnMsg = '';
      }
      return returnMsg;
   }

   locationValidator = (Param) => {
      var returnMsg = '';
      if (Param.length == 0) {
         returnMsg = 'Location name is required';
      } else {
         returnMsg = '';
      }
      return returnMsg;
   }

   bcmUserValidator = (Param) => {
      var returnMsg = '';
      if (Param.length == 0) {
         returnMsg = 'Branch manager is required';
      } else {
         returnMsg = '';
      }
      return returnMsg;
   }

   areaValidator = (Param) => {
      var returnMsg = '';
      Param.filter(elm => {
         if (elm.areaName != '') {
            returnMsg = '';
         } else {
            returnMsg = 'Area name is required';
         }
      })

      return returnMsg;
   }


   formValChange = e => {
      // e.preventDefault();
      const { name, value } = e.target;
      let isError = { ...this.state.isError };
      switch (name) {
         case "location":
            isError.location = this.locationValidator(value)
            break;
         case "plantName":
            isError.plantName = this.plantValidator(value)
            break;
         case "bcmUserName":
            isError.bcmUserName = this.bcmUserValidator(value)
            break;
         default:
            break;
      }

      this.setState({
         isError,
         [name]: value
      });
   };


   getPlantObjectById = (plantId) => {
      if (plantId) {
         this.setState({ Loader: true, Manipulation: 'Edit Branch' });
         this.showAddPlantModal(true);
         GenericApiService.getAll(UrlConstants.getPlantByIdUrl + plantId)
            .then(response => {
               var updateObj = response.data;
               if (updateObj.bcmUserId && updateObj.clientPlantMasterId) {
                  this.getUserDetails(updateObj.bcmUserId);
                  this.setState({
                     location: updateObj.location,
                     plantName: updateObj.plant,
                     plantAreas: updateObj.plantAreas,
                     plantMasterId: updateObj.clientPlantMasterId,
                     binaryImage: updateObj.plantImage
                  });
               }
               this.setState({ Loader: false });
            }).catch(error => {
               this.setState({ Loader: false });

            });
      } else {
         return false
      }
   }

   createAreasInput() {
      return this.state.plantAreas.map((el, i) =>

         <Row className="" key={i}>

            <Col xs={3} sm="2" xl="3" className="addPlantForm align-items-start pt-1">
               <Form.Label>Areas</Form.Label>
            </Col>
            <Col xs={9} sm="10" xl="9 pl-0 pl-2" className="addPlantForm">
               <div className="action">
                  <i className="icon addIcon" onClick={this.addClick.bind(this)}></i>
                  <i className="icon deleteIcon mr-1" onClick={this.removeClick.bind(this, i)}></i>
               </div>
               <Form.Group className="d-flex align-items-center add-field">
                  <p className="mb-0">{1 + i}.</p>
                  <Form.Control className="ml-2" type="text" value={el.areaName || ''} name={el.areaName} onChange={this.handleChange.bind(this, i)} placeholder="Area" />
               </Form.Group>

            </Col>
         </Row>

      )
   }


   handleChange(i, event) {

      let plantAreas = [...this.state.plantAreas];
      plantAreas[i].areaName = event.target.value;

      this.setState({ plantAreas });
   }

   addClick() {
      this.setState(prevState => ({ plantAreas: [...prevState.plantAreas, { areaName: '', clientPlanAreaDetailId: 0 }] }))
   }

   removeClick(i) {
      let plantAreas = [...this.state.plantAreas];
      if (plantAreas.length > 1) {
         plantAreas.splice(i, 1);
         this.setState({ plantAreas });
      }
   }
   validateFileType = event => {

      var fileName = document.getElementById("fileName").value;
      var idxDot = fileName.lastIndexOf(".") + 1;
      var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
      if (extFile == "jpg" || extFile == "jpeg" || extFile == "png") {
         this.setState({ selectedFile: event.target.files[0] });
         var reader = new FileReader();
         reader.onload = function (event) {
            document.getElementById("frame").src = event.target.result;
         };
         reader.readAsDataURL(event.target.files[0]);
      } else {
         this.setState({ imageUploadError: 'image only allowed' })
      }
   }
   fileTrigger = () => {
      document.getElementById("fileName").click();
   }
   handleSubmit = (event) => {
      event.preventDefault();
      if (this.validForm()) {
         const object = {
            bcmUserId: this.state.bcmUserId,
            location: this.state.location,
            plant: this.state.plantName,
            plantAreas: this.state.plantAreas,
            clientPlantMasterId: this.state.plantMasterId
         }
         // console.log(object);
         this.setState({ Loader: true });

         var formData = new FormData();
         formData.append("files", this.state.selectedFile);
         formData.append("submitPlantDetail", JSON.stringify(object));

         GenericApiService.post(UrlConstants.savePlantUrl, formData).then(response => {

            if (response.status.success == 'SUCCESS') {
               var message = '';
               if (this.state.plantMasterId == 0) {
                  message = `${this.state.plantName} - branch added successfully`;
                  this.props.reloadList(message);
                  sharingService.sendMessage('new plant added');
               } else {
                  message = `${this.state.plantName} - branch update was successfull `;
                  this.props.getTaskList(message);
               }
               this.showAddPlantModal(false);

            }
         }).catch(error => {

         })


      }
      else {
         let isError = { ...this.state.isError };
         isError.location = this.locationValidator(this.state.location);
         isError.bcmUserName = this.bcmUserValidator(this.state.bcmUserName);
         isError.plantName = this.plantValidator(this.state.plantName);
         isError.plantAreaName = this.areaValidator(this.state.plantAreas);


         this.setState({ isError: isError });

      }
   }

   getEmployeeCodeList = (empCode) => {
      const { Manipulation, plantMasterId } = this.state;
      var plantId = sessionStorage.getItem("plantId") ? sessionStorage.getItem("plantId") : plantMasterId ? plantMasterId : 0;
      // if (plantId != 0) {
      var param = plantId != null && plantId != 0 ? '?clientPlantMasterId=' + plantId : '?clientPlantMasterId=0';
      const url = '/user/' + empCode + param;
      const { isError } = this.state;
      isError.employeeCode = ''
      this.setState({ isError });
      this.setState({ isLoading: true });
      GenericApiService.getAll(url).then(Response => {
         this.setState({
            employeeCodeList: Response.data,
            isLoading: false
         });
      }).catch(error => {
         this.setState({ isError, isLoading: false });
      });
      // } else {
      //    const { isError } = this.state;
      //    isError.employeeCode = 'Kindly select the branch name in header'
      //    this.setState({ isError });
      // }
   }

   employeeCode = (e) => {

      if (e.length === 0) {
         return false;
      } else {
         const selectUserId = e[0].bcmUserId;
         this.getUserDetails(selectUserId);
      }
   }
   getUserDetails = (userId) => {
      const url = '/user/getbyId/' + userId;
      GenericApiService.getAll(url).then(Response => {
         this.setState({
            bcmUserId: Response.data.bcmUserId,
            // bcmUserName: Response.data.firstName
         });
         this.formValChange({ target: { name: 'bcmUserName', value: Response.data.firstName } });
      }).catch(error => {

      })
   }


   validForm() {
      if (this.plantValidator(this.state.plantName) == '' &&
         this.bcmUserValidator(this.state.bcmUserName) == '' &&
         this.locationValidator(this.state.location) == '' &&
         this.areaValidator(this.state.plantAreas) == '') {
         return true;
      } else {
         return false;
      }
   }

   // delete Plant

   confirmDeletePlant = () => {
      if (this.state.plantMasterId) {
         const url = UrlConstants.deletePlantUrl + this.state.plantMasterId
         this.setState({ Loader: true });
         this.deleteModal(false);
         GenericApiService.deleteById(url)
            .then(response => {
               if (response.status.success == 'SUCCESS') {
                  const message = `${this.state.plantName} branch deleted successfully`;
                  this.props.reloadList(message);
                  this.showAddPlantModal(false);
                  sharingService.sendMessage('plant deleted');

               }
            })
            .catch(error => {

            })
      }
   }
   deleteModal = (e) => {
      this.setState({
         showDeleteModal: e
      })
   }

   render() {
      const { isError, isLoading, Loader, Manipulation, showModal, showDeleteModal, plantName } = this.state;
      return (
         <>
            <Modal id="addPlant"
               show={showModal}
               onHide={() => { this.showAddPlantModal(false) }}
               size="md"
               aria-labelledby="contained-modal-title-vcenter"
               centered
            >
               <Modal.Header closeButton>
                  <Modal.Title id="contained-modal-title-vcenter">
                     {Manipulation}
                  </Modal.Title>
                  {Manipulation == 'Edit Branch' ?
                     <span className="delete-btn cursor-pointer" onClick={this.deleteModal}>
                        <i className="icon-delete"></i>
                     </span> : ''}
               </Modal.Header>
               <Modal.Body>
                  {Loader ? <div className="loader">
                     <Spinner animation="grow" variant="dark" />
                  </div> : null}
                  <Form noValidate>
                     <Row>
                        <Col xs={12} sm="8" xl="8" className="order-1 order-sm-1">
                           {isError.employeeCode.length > 0 && (
                              <Form.Text className="error-msg"> {isError.employeeCode} </Form.Text>
                           )}
                           <Row className="align-items-center">
                              <Col xs={3} sm="4" xl="5" className="addPlantForm">
                                 <Form.Label>Branch Name</Form.Label>
                              </Col>
                              <Col xs={9} sm="8" xl="7 pl-0" className="addPlantForm">
                                 <Form.Group>
                                    <Form.Control type="text" name="plantName" value={plantName || ''}
                                       onChange={this.formValChange.bind(this)} placeholder="Branch Name" disabled={Manipulation == 'Edit Branch' && plantName ? true : false} />
                                    {isError.plantName.length > 0 && (
                                       <Form.Text className="error-msg"> {isError.plantName} </Form.Text>
                                    )}
                                 </Form.Group>
                              </Col>
                              <Col xs={3} sm="4" xl="5" className="addPlantForm">
                                 <Form.Label>Address</Form.Label>
                              </Col>
                              <Col xs={9} sm="8" xl="7  pl-0" className="addPlantForm">
                                 <Form.Group>
                                    <Form.Control type="text" name="location" value={this.state.location || ''} onChange={this.formValChange.bind(this)} placeholder="Address" />
                                    <i className="mapIcon"></i>
                                    {isError.location.length > 0 && (
                                       <Form.Text className="error-msg"> {isError.location} </Form.Text>
                                    )}
                                 </Form.Group>
                              </Col>

                              <Col xs={3} sm="4" xl="5" className="addPlantForm">
                                 <Form.Label>Search Employee </Form.Label>
                              </Col>
                              <Col xs={9} sm="8" xl="7  pl-0" className="addPlantForm">
                                 <Form.Group controlId="empId">
                                    <AsyncTypeahead
                                       id="basic-typeahead-example" labelKey="userCode"
                                       isLoading={isLoading}
                                       onChange={this.employeeCode}
                                       options={this.state.employeeCodeList}
                                       onSearch={this.getEmployeeCodeList} placeholder="Choose employee code"
                                    />
                                    {/* {isError.employeeCode.length > 0 && (
                                       <Form.Text className="error-msg"> {isError.employeeCode} </Form.Text>
                                    )} */}
                                 </Form.Group>
                              </Col>


                              <Col xs={3} sm="4" xl="5" className="addPlantForm">
                                 <Form.Label>Branch  Manager</Form.Label>
                              </Col>
                              <Col xs={9} sm="8" xl="7  pl-0" className="addPlantForm">
                                 <Form.Group>
                                    <Form.Control type="text" readOnly value={this.state.bcmUserName} name="bcmUserName" placeholder="Branch Manager" />
                                    {isError.bcmUserName.length > 0 && (
                                       <Form.Text className="error-msg"> {isError.bcmUserName} </Form.Text>
                                    )}
                                 </Form.Group>
                              </Col>
                           </Row>
                        </Col>
                        <Col xs={12} sm="4" xl="4" className="order-3 order-sm-2">

                           <div className="mediaUpload text-center" onClick={this.fileTrigger}>
                              {
                                 this.state.selectedFile == null ? (
                                    this.state.binaryImage ? (
                                       <img id="newframe" src={'data:image/jpg;base64,' + this.state.binaryImage} width="100px" />
                                    ) : (
                                          <i className="icon icon-upload"></i>
                                       )
                                 ) : (
                                       <img id="frame" src="" width="100px" />
                                    )
                              }
                           </div>
                           <input type="file" style={{ display: 'none' }}
                              id="fileName" name="fileName" accept="image/*"
                              onChange={this.validateFileType.bind(this)} />
                           {
                              this.state.imageUploadError == '' ? '' : (
                                 <small class="error-msg form-text">{this.state.imageUploadError}</small>
                              )
                           }
                        </Col>
                        <Col xl="12 mt-2" className="order-2 order-sm-3">
                           {this.createAreasInput()}
                           {isError.plantAreaName.length > 0 && (
                              <Form.Text className="error-msg mt-0 text-center"> {isError.plantAreaName} </Form.Text>
                           )}
                        </Col>
                        {/* <Col xs={9} sm="9" className="offset-md-3">
                        </Col> */}
                        <Col xl="12 text-center mt-4" className="modal-btn order-4">
                           <Button className="redBg" variant="secondary" size="sm" onClick={() => this.showAddPlantModal(false)} >Cancel</Button>
                           <Button className={this.validForm() == true ? "greenBg" : ''} variant="secondary" type="submit" onClick={this.handleSubmit} size="sm">Verify</Button>
                        </Col>
                     </Row>
                  </Form>
               </Modal.Body>
            </Modal>
            <Modal centered className="delete-confirm" show={showDeleteModal} onHide={e => this.deleteModal(false)}>
               <Modal.Body>
                  <p className="text-center">Do you want to Delete the <b>
                     {this.state.plantName}
                  </b> Branch ?</p>
                  <div className="text-center">
                     <Button className="confirm-btn" onClick={this.confirmDeletePlant}>
                        Confirm
           </Button>
                     <Button onClick={e => this.deleteModal(false)}>
                        Cancel
           </Button>
                  </div>
               </Modal.Body>

            </Modal>
         </>
      )
   }
}

export default AddPlantModal;
