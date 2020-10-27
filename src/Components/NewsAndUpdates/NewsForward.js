import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'
import { Col, Row, Button, Spinner } from 'react-bootstrap';
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import 'react-multi-email/style.css';
import ReactQuill from 'react-quill';
import { Multiselect } from 'multiselect-react-dropdown';
import 'react-quill/dist/quill.snow.css';
import { GenericApiService } from '../../Service/GenericApiService';
import { UrlConstants } from '../../Service/UrlConstants';

class NewsForward extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         newsObject: this.props.feeds ? JSON.parse(this.props.feeds) : '',
         message: this.props.feeds ? JSON.parse(this.props.feeds).description : '',
         bcmUserGroupId: this.props.feeds ? JSON.parse(this.props.feeds).bcmUserGroup : '',
         titleName: this.props.feeds ? JSON.parse(this.props.feeds).title : '',
         isError: {
            titleName: "",
            bcmUserGroupId: "",
            message: '',
            Loader: false
         },
         groupList:[],
         objectArray: [],
         selectedValues: [],
      }
   }

   componentDidMount() {
      
      this.getGroupList();
      if (this.state.newsObject) {
          this.getNewsById();
      }
  }

  getNewsById = () => {
      const url = UrlConstants.getNewsByIdUrl + this.state.newsObject.bcmNotificationId;
      GenericApiService.getAll(url).then(response => {
          if (response.data) {
              this.setState({
                  newsObject: response.data
              })
          }
      })
  }

  getGroupList = () => {
   this.setState({ Loader: true });
   GenericApiService.getAll(UrlConstants.getGroupList).then(response => {
       if (response.data) {
           this.setState({
               groupList: response.data,
           });
            var tmpObjArry = [];
            var tempSelectedVal = [];
            for(var i=0;i<response.data.length;i++){
               tmpObjArry.push({
                  'userGroup':response.data[i].userGroup,
                  'bcmUserGroupId':response.data[i].bcmUserGroupId
               });                                        
         }
         if(this.state.uploadOrNewFlag){
               for(var M=0;M<this.state.uploadOrNewFlag.bcmNotificationGroup.length;M++){
                  tempSelectedVal.push({
                     'userGroup':this.state.uploadOrNewFlag.bcmNotificationGroup[M].userGroup,
                     'bcmUserGroupId':this.state.uploadOrNewFlag.bcmNotificationGroup[M].bcmUserGroupId
                  });
               }                  
         }else{
               for(var j=0;j<response.data.length;j++){
                  if(response.data[j].userGroup == "Admin"){
                     tempSelectedVal.push({
                           'userGroup':response.data[j].userGroup,
                           'bcmUserGroupId':response.data[j].bcmUserGroupId
                     });                        
                  }                                        
               }
         }
         this.setState({objectArray:tmpObjArry});
         this.setState({selectedValues:tempSelectedVal});  
         this.setState({ Loader: false });          
       }
      this.setState({ Loader: false });
   }).catch(error => {

   })
}



   titleNameValidator = (Param) => {
      
      var returnMsg = '';
      if (Param.length == 0 || Param == '') {
         returnMsg = 'Title name is required';
      } else {
         returnMsg = '';
      }
      return returnMsg;
   }

   emailsValidator = (Param) => {
      
      var returnMsg = '';
      if (Param.length == 0) {
         returnMsg = 'Please specify at least one recipient.';
      } else {
         returnMsg = '';
      }
      return returnMsg;
   }

   MessageValidator = (Param) => {
      
      var returnMsg = '';
      if (Param.length == 0 || Param == '<p><br></p>') {
         returnMsg = 'Message is required.';
      } else {
         returnMsg = '';
      }
      return returnMsg;
   }

   formValChange = e => {
      // e.preventDefault();
      const { name, value } = e.target;
      let isError = { ...this.state.isError };
      switch (name) {
         case "titleName":
            isError.titleName = this.titleNameValidator(value)
            break;
         // case "bcmUserGroupId":
         //    isError.bcmUserGroupId = this.emailsValidator(value)
         //    break;
         case "message":
            isError.message = this.MessageValidator(value)
            break;
         default:
            break;
      }

      this.setState({
         isError,
         [name]: value
      });
   };

   onchangeSubject = (e) => {
      this.setState({ titleName: e.target.value });

   };

   saveNotification = (e) => {
      
      // e.preventDefault();
      if (this.validForm() && this.state.selectedValues.length !== 0) {
         var obj = this.getPayload();
         var formData = new FormData();
         formData.append('bcmNotification', JSON.stringify(obj));
         const payload = formData;
         this.setState({ Loader: true });
         GenericApiService.saveFormData(UrlConstants.saveNewsUrl, payload).then(response => {
            
            if (response.status.success === 'SUCCESS') {
               this.setState({ Loader: false });
               if (this.props.newRecord) {
                  const message = `Forward mail send successfully`;
                  this.props.closeModal(message);
               } else {
                  // const message = `News update was successfull for ${this.state.titleName}`;
                  const message = `Forward mail send successfully`;
                  this.props.goBack(message);
               }
            }
         }).catch(error => {
         })
      } else {
         let isError = { ...this.state.isError };
         console.log(isError);
         isError.titleName = this.titleNameValidator(this.state.titleName);
         // isError.bcmUserGroupId = this.emailsValidator(this.state.bcmUserGroupId);
         isError.message = this.MessageValidator(this.state.message);
         
         this.setState({ isError: isError });
      }
   }

   validForm() {
      
      // this.emailsValidator(this.state.bcmUserGroupId) == ''
      if (this.titleNameValidator(this.state.titleName) == '' && this.MessageValidator(this.state.message) == '') {
         return true;
      } else {
         return false;
      }
   }

   getPayload() {
      
      var user = JSON.parse(sessionStorage.getItem('LoginUserObject'));
      var updateOn =  new Date().toISOString();
      // const groubObject = this.state.groupList.filter(elem => elem.bcmUserGroupId == this.state.bcmUserGroupId)[0];
      var obj;
      var groubObject = [];
      var tempIndex = [];
      for(var j=0;j<this.state.objectArray.length;j++){
         for(var i=0;i<this.state.selectedValues.length;i++){            
            if(this.state.objectArray[j].bcmUserGroupId == this.state.selectedValues[i].bcmUserGroupId){
               groubObject.push({
                  "bcmUserGroupId": this.state.groupList[j].bcmUserGroupId,
                  "userGroup": this.state.groupList[j].userGroup,
                  "description": this.state.groupList[j].description,
                  "bcmAppPermission": this.state.groupList[j].bcmAppPermission,
                  "isActive": this.state.groupList[j].isActive,
                  "createdBy": this.state.groupList[j].createdBy,
                  "createdOn": this.state.groupList[j].createdOn,
                  "updatedOn": this.state.groupList[j].updatedOn,
                  "updatedBy": this.state.groupList[j].updatedBy                       
               });
            }
         }            
      }

      if (this.props.newRecord) {
         obj = {
             title: this.state.titleName,
             description: this.state.message,
             smsNotification: 0,
             emailNotification: 0,
             mobileAppNotification: 0,
             voiceNotification: 0,
             notifyAll: 0,
             isActive: true,
             createdBy: user.bcmUserId,
             createdOn: updateOn,
             updatedOn: updateOn,
             updatedBy: user.bcmUserId,
             informationFrom: this.state.fromAddress,
             bcmNotificationGroup: groubObject

         };
     }
     else {
         obj = {
             title: this.state.titleName,
             description: this.state.message,
             smsNotification: this.state.newsObject.smsNotification,
             emailNotification: this.state.newsObject.emailNotification,
             mobileAppNotification: this.state.newsObject.mobileAppNotification,
             voiceNotification: this.state.newsObject.voiceNotification,
             notifyAll: this.state.newsObject.notifyAll,
             isActive: true,
             createdBy: this.state.newsObject.createdBy,
             createdOn: this.state.newsObject.createdOn,
             updatedOn: updateOn,
             updatedBy: user.bcmUserId,
             bcmNotificationId: this.state.newsObject.bcmNotificationId,
             informationFrom: this.state.fromAddress,
             bcmNotificationGroup: groubObject
         };
      }
      return obj;
   }
   onSelect=(selectedList, selectedItem)=> {
      this.setState({selectedValues:selectedList});
  }
  onRemove=(selectedList, removedItem)=>{
      this.setState({selectedValues:selectedList});
  }
   render() {
      const { bcmUserGroupId, isError, Loader, groupList } = this.state
      return (
         <Form className="send-mail-form" noValidate>
            {Loader ? <div className="loader">
               <Spinner animation="grow" variant="dark" />
            </div> : null}            
                  <Form.Row>
                     <Form.Group controlId="formGridEmail" className="email active col-12">
                        <Multiselect className="multiSelectMail"
                        options={this.state.objectArray} // Options to display in the dropdown
                        onSelect={this.onSelect} // Function will trigger on select event
                        onRemove={this.onRemove}                     
                        displayValue="userGroup"
                        name="bcmUserGroupId"
                        id="bcmUserGroupId"
                        selectedValues={this.state.selectedValues}
                        />
                        <div> {this.state.selectedValues.length == 0 ? (
                        <p className="error-msg error-grid">
                           Please select group name
                        </p>
                     ):null}</div>
                     </Form.Group>
                     
                  </Form.Row>
            
            <Form.Row>
               <Form.Group as={Col} controlId="formGridPassword">
                  <Form.Control type="text" name="titleName"
                     placeholder="Title :" onChange={this.formValChange.bind(this)}
                     defaultValue={this.state.titleName} className="mail-subject" />
                  {isError.titleName.length > 0 && (
                     <Form.Text className="error-msg">{isError.titleName}</Form.Text>
                  )}
               </Form.Group>
            </Form.Row>

            <Row className="mx-0 editor-row">
               <ReactQuill defaultValue={this.state.message} onChange={(e) => this.formValChange({ target: { name: "message", value: e } })} />
               {isError.message.length > 0 && (
                  <Form.Text className="error-msg editor-error">{isError.message}</Form.Text>
               )}
               <div className="forward-btn">
                  <Button variant="secondary" className={this.validForm() == true && this.state.selectedValues.length != 0 ? "greenBg" : ''} 
                  onClick={this.saveNotification}>{this.props.newRecord ? 'Publish' : 'Send'}</Button>
               </div>
            </Row>

         </Form>
      );
   }
}
export default NewsForward;
