import React, { Component } from 'react';
import { Row, Col, Card, ProgressBar, Tab, Nav, Modal, Spinner, Alert } from 'react-bootstrap';
import searchIcon from '../../assets/images/search.svg';
import compImg from '../../assets/images/companys-logo.png';
import govetImg from '../../assets/images/govet.png';
import deleteImg from '../../assets/images/delete.svg';
import starImg from '../../assets/images/star.svg';
import printImg from '../../assets/images/print.svg';
import Button from 'react-bootstrap/Button'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import NewsForward from './NewsForward';
import { GenericApiService } from '../../Service/GenericApiService';
import { UrlConstants } from '../../Service/UrlConstants';
import AddNews from './AddNews';

class NewsAndUpdates extends Component {
   constructor(props) {
      super(props);
      this.state = {
         newsList: [],
         forwardingNews: [],
         isForward: false,
         openSelectedMessage: '',
         includedColumns: ["description", "title", "createdOn", "updatedOn"],
         filterList: [],
         updateObject: '',
         previewNews: '',
         modalShow: false,
         Loader: false,
         message: '',
         showMessage: false,
         isPublish: false,
         modalLoader: false,
         cardLoader: false,
         sessionExpired: false
      }
   }
   componentDidMount() {
      this.getNewsList();
   }

   getCurrentDateTime = () => {
      var timestamp = new Date();
      const obj = timestamp.toDateString().split(' ')[2] + ' ' + timestamp.toDateString().split(' ')[1] + ' ' + this.formatAM_PM(timestamp);
      return obj;
   }


   formDate = (str) => {
      if (str) {
         var timestamp = new Date(str);
         const obj = timestamp.toDateString().split(' ')[2] + ' ' + timestamp.toDateString().split(' ')[1] + ' ' + this.formatAM_PM(timestamp);
         return obj;
      }
   }

   // to get notification list api 
   getNewsList = () => {
      var url;
      const userId = JSON.parse(sessionStorage.LoginUserObject).bcmUserId;
      url = UrlConstants.getNewsListByUserIdUrl + userId;
      this.setState({ Loader: true });
      GenericApiService.getAll(url).then(response => {
         if (response.data) {
            this.setState({
               newsList: response.data,
               filterList: response.data,
               forwardingNews: JSON.stringify(response.data[0]),
               updateObject: response.data[0],
               previewNews: response.data[0].description,
               openSelectedMessage: 'pvt_news0',
            })

            if (this.props.location.search) {
               console.log(this.props.location.search.split('id=')[1]);
               const id = this.props.location.search.split('id=')[1];
               const index = this.state.newsList.findIndex(news => news.bcmNotificationId == id);
               const value = this.state.newsList.filter(news => news.bcmNotificationId == id)[0];

               if (value.isRead == false) {
                  const payLoad = {
                     bcmGroupId: JSON.parse(sessionStorage.LoginUserObject).bcmUserGroupWrapper.bcmUserGroupId,
                     bcmNotificationId: value.bcmNotificationId,
                     bcmNotificationUserTrxId: null,
                     bcmuserId: userId,
                     isRead: true
                  }
                  GenericApiService.post(UrlConstants.saveReadedNewsUrl, payLoad)
                     .then(response => {

                     }).catch(error => {
                        this.sessExpaired(error);
                     })
               }
               this.state.newsList.filter(news => news.bcmNotificationId == id)[0].isRead = true;
               if (index != -1) {
                  setTimeout(() => {
                     this.setState({
                        forwardingNews: JSON.stringify(response.data[index]),
                        updateObject: response.data[index],
                        previewNews: response.data[index].description,
                        openSelectedMessage: "pvt_news" + index
                     });
                     var elem = document.getElementsByClassName('active');
                     if (elem[3]) {
                        elem[3].scrollIntoView();
                     }
                  }, 0);
               }

            }
            else if (response.data[0].isRead == false) {
               const userId = JSON.parse(sessionStorage.LoginUserObject).bcmUserId;

               const payLoad = {
                  bcmGroupId: JSON.parse(sessionStorage.LoginUserObject).bcmUserGroupWrapper.bcmUserGroupId,
                  bcmNotificationId: response.data[0].bcmNotificationId,
                  bcmNotificationUserTrxId: null,
                  bcmuserId: userId,
                  isRead: true
               }
               GenericApiService.post(UrlConstants.saveReadedNewsUrl, payLoad)
                  .then(response => {

                  }).catch(error => {
                     this.sessExpaired(error);
                  })
               this.state.newsList[0].isRead = true;


            }

         }
         this.setState({ Loader: false });
      }).catch(error => {
         this.sessExpaired(error);
      })
   }


   getNewsListByUser = () => {
      const userId = JSON.parse(sessionStorage.LoginUserObject).bcmUserId;
      if (userId) {
         const url = UrlConstants.getNewsListByUserIdUrl + userId;
         this.setState({ Loader: true });
         GenericApiService.getAll(url).then(response => {
            if (response.data) {
               this.setState({
                  newsList: response.data,
               })
            }
            this.setState({ Loader: false });

         }).catch(error => {
            this.sessExpaired(error);
         })
      }
   }

   getNewsListOnLoad = () => {
      var url;
      const userId = JSON.parse(sessionStorage.LoginUserObject).bcmUserId;
      url = UrlConstants.getNewsListByUserIdUrl + userId;

      this.setState({ Loader: true });
      GenericApiService.getAll(url).then(response => {
         if (response.data) {
            this.setState({
               newsList: response.data,
               filterList: response.data,
               forwardingNews: JSON.stringify(response.data[0]),
               updateObject: response.data[0],
               previewNews: response.data[0].description,
               openSelectedMessage: 'pvt_news0',
            })
         }
         this.setState({ Loader: false });
      }).catch(error => {
         this.sessExpaired(error);
      })
   }

   forwardEmail = () => {

      this.setState({
         isForward: true
      });
   }

   selectedNews = (news, ind) => {
      this.setState({
         forwardingNews: JSON.stringify(news),
         isForward: false,
         openSelectedMessage: ind,
         updateObject: news,
         previewNews: news.description

      })

      this.saveUserTransaction(news);

   }


   goBack = (notificationMessage) => {
      this.getNewsListOnLoad();
      this.showNotification(notificationMessage);
      this.setState({
         modalShow: false,
         modalLoader: false
      })
   }

   closeModal = (e) => {
      this.getNewsListOnLoad();
      this.setState({
         modalShow: e
      })

   }

   handleChange = value => {
      this.filterData(value);
   };

   // filter records by search text
   filterData = (value) => {

      const lowercasedValue = value.toLowerCase().trim();
      if (lowercasedValue === "") {
         this.setState({ newsList: this.state.filterList })
      }
      else {
         const filteredData = this.state.filterList.filter(item => {

            return Object.keys(item).some(key => {
               return this.state.includedColumns.includes(key) ? item[key].toString().toLowerCase().includes(lowercasedValue) : false;

            });
         });


         this.setState({ newsList: filteredData })

      }
   }

   deleteNews = () => {

      var user = JSON.parse(sessionStorage.getItem('LoginUserObject'));
      var date = new Date();
      var obj = {

         title: this.state.updateObject.title,
         description: this.state.updateObject.description,
         smsNotification: this.state.updateObject.smsNotification,
         emailNotification: this.state.updateObject.emailNotification,
         mobileAppNotification: this.state.updateObject.mobileAppNotification,
         voiceNotification: this.state.updateObject.voiceNotification,
         notifyAll: this.state.updateObject.notifyAll,
         isActive: false,
         createdBy: this.state.updateObject.createdBy,
         createdOn: new Date(this.state.updateObject.createdOn).getTime(),
         updatedOn: date.getTime(),
         updatedBy: user.bcmUserId,
         bcmNotificationId: this.state.updateObject.bcmNotificationId,
         informationFrom: this.state.updateObject.informationFrom,
         bcmUserGroup: { bcmUserGroupId: this.state.updateObject.bcmUserGroup }

      }

      var formData = new FormData();
      formData.append('bcmNotification', JSON.stringify(obj));
      const payload = formData;
      this.setState({ modalLoader: true });

      const url = UrlConstants.deleteNotificationByIdUrl + this.state.updateObject.bcmNotificationId;
      GenericApiService.deleteById(url).then(response => {

         if (response.status.success === 'SUCCESS') {
            const message = `${this.state.updateObject.title} news was successfully deleted `
            this.goBack(message);
         }
      }).catch(error => {
         this.sessExpaired(error);
      })

   }

   onSelect = (event) => {
      console.log(event);

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

   saveUserTransaction(news) {
      if (news.isRead == false) {
         const userId = JSON.parse(sessionStorage.LoginUserObject).bcmUserId;
         const payLoad = {
            bcmGroupId: JSON.parse(sessionStorage.LoginUserObject).bcmUserGroupWrapper.bcmUserGroupId,
            bcmNotificationId: news.bcmNotificationId,
            bcmNotificationUserTrxId: null,
            bcmuserId: userId,
            isRead: true
         };
         GenericApiService.post(UrlConstants.saveReadedNewsUrl, payLoad)
            .then(response => {
               console.log(response);

            }).catch(error => {
               this.sessExpaired(error);
            })

         const updatedList = this.state.newsList.filter(elem => {
            if (elem.bcmNotificationId == news.bcmNotificationId) {
               elem.isRead = true;
            }
            return elem;
         })
         console.log(updatedList);

         this.setState({
            newsList: updatedList
         });

         console.log(this.state.newsList);

      }
   }

   showNotification(value) {
      this.setState({
         isForward: false,
         openSelectedMessage: '',
         message: value,
         showMessage: true
      });
      setTimeout(() => {
         this.setState({
            message: '',
            showMessage: false
         });
      }, 3000);
   }

   convertTime(dateObj) {
      if (dateObj) {
         var timestamp = new Date(dateObj);
         var monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
         ];
         var date = new Date(timestamp.getTime() * 1000);

         var tempday = (date.getDate()).toString();

         const day = tempday.length !== 1 ? tempday : '0' + tempday;

         const obj = timestamp.toDateString().split(' ')[2] + ' ' + timestamp.toDateString().split(' ')[1] + ' ' + this.formatAM_PM(timestamp);
         //  timestamp.getDate() + ' ' + monthNames[date.getMonth()+1] + ' ' + this.formatAM_PM(date);
         return obj;
      }
   }

   formatAM_PM = (date) => {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
   }


   setModalShow = (e) => {
      this.setState({
         modalShow: e,
         isPublish: false
      })
   }
   showEditModal = (e) => {
      this.setState({
         modalShow: e,
         isPublish: true
      })
   }

   onHide = () => {
      this.setState({
         modalShow: false
      })
   }

   openCompanyNewsAndUpdate = (type) => {
      if (type == 'pvt') {
         this.setState({
            forwardingNews: JSON.stringify(this.state.newsList[0]),
            isForward: false,
            openSelectedMessage: 'pvt_news0',
            updateObject: this.state.newsList[0],
            previewNews: this.state.newsList[0].description

         })
      }

   }
   hideModal = notificationMessage => {
      this.closeModal(false);
      this.showNotification(notificationMessage)
   }

   openPdf(url) {
      let pdfWindow = window.open("")
      setTimeout(() => {
         pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64, " +
            encodeURI(url) + "'></iframe>");
      }, 0);
   }
   downloadURI(name, uri) {
      var link = document.createElement("a");
      link.download = name;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      // document.body.removeChild(link);
      // delete link;
   }

   render() {

      const { Loader, message, cardLoader, showMessage, isPublish, modalLoader } = this.state;
      return (
         <div className="dashboard-container news-and-updates">
            <div className="dashboard-section">
               <Alert show={this.state.sessionExpired} variant="danger">
                     <div className="alert-container">
                        <p><i className="icons"></i>  Session Expired,Please login again.</p>
                     </div>      
               </Alert>
               {showMessage ? <Alert variant="dark" className="mark">
                  <div className="alert-container">
                     <p><i className="icons"></i> {message}</p>
                  </div>
               </Alert> : null}
               <div className="welcome-text">
                  <div className=" pageTitle">
                     <h2>News & Updates</h2>

                  </div>
               </div>
               <Row className="row-1 row-full-height">

                  <Col xl="12">
                     <Card className="emp">
                        <Tab.Container id="left-tabs-example" defaultActiveKey="pvt_news">
                           <Nav variant="pills" className="tab-1 newsTitle">
                              <Nav.Item className="item-1">

                                 <Nav.Link eventKey="pvt_news" onClick={() => this.openCompanyNewsAndUpdate('pvt')}>Company</Nav.Link>
                                 <div className="news-option" onClick={() => this.setModalShow(true)}>
                                 </div>
                              </Nav.Item>
                              {/* <Nav.Item className="item-2">
                                 <Nav.Link eventKey="govt_news" onClick={() => this.openCompanyNewsAndUpdate('govt')}>Government</Nav.Link>
                              </Nav.Item> */}
                           </Nav>

                           <Tab.Content>
                              {Loader ? <div className="loader">
                                 <Spinner animation="grow" variant="dark" />
                              </div> : null}
                              <Tab.Pane eventKey="pvt_news">
                                 <Tab.Container id="left-tabs" activeKey={this.state.openSelectedMessage} defaultActiveKey="pvt_news0">
                                    <Row className="mx-0 tab-row">

                                       <div className="tab-item-list">
                                          <form className="tab-search">
                                             <input className="form-control" type="text" onChange={(e) => this.handleChange(e.target.value)} placeholder=" Search Company News " aria-label="Search" />
                                             <span className="search-icon"><img src={searchIcon} /></span>
                                          </form>
                                          <Nav variant="pills" className="flex-column" onSelect={(selectedKey) => this.onSelect(selectedKey)}>
                                             {this.state.newsList.map((news, index) =>
                                                <Nav.Item key={'pvt_news' + index} className="tab-details" onClick={() => this.selectedNews(news, 'pvt_news' + index)}>
                                                   <Nav.Link eventKey={'pvt_news' + index} className="tab-details-a  ">

                                                      <Row className="row-1">
                                                         <Col sm="3" className="tab-images">
                                                            <img src={compImg} />
                                                         </Col>
                                                         <Col sm="9" className="tab-contents ">
                                                            <h6 className={news.isRead ? `header-blue read-msg ` : 'header-blue'} title={news.title}>{news.title}</h6>
                                                            <div className="content-limit" dangerouslySetInnerHTML={{ __html: news.description }}></div>
                                                            <span className="news-timing">{this.convertTime(news.updatedOn)}</span>
                                                         </Col>
                                                      </Row>

                                                   </Nav.Link>
                                                </Nav.Item>
                                             )}


                                          </Nav>
                                       </div>

                                       <div className="tabs__container">
                                          <Tab.Content className="pl-3">
                                             <Tab.Pane eventKey={this.state.openSelectedMessage}>
                                                <Card className="emp-health news-tab-right">
                                                   <Card.Title>
                                                      <div>{this.state.updateObject.title}</div>
                                                      <div className="action-icons">
                                                         <span>
                                                            <img src={starImg} />
                                                         </span>
                                                         <span>
                                                            <img src={printImg} />
                                                         </span>
                                                         <span onClick={this.deleteNews}>
                                                            <img src={deleteImg} />
                                                         </span>
                                                      </div>
                                                   </Card.Title>
                                                   <Card.Body>
                                                      <Row className="m-0 w-100 tab-details-main">
                                                         <Col className="img-column mt-4">
                                                            <img src={compImg} />
                                                         </Col>
                                                         <Col className="content-column mt-4">
                                                            <div className="mail-id">
                                                               <p className="blue">{this.state.updateObject.informationFrom}</p>
                                                               <span>{this.convertTime(this.state.updateObject.updatedOn)}</span>
                                                            </div>
                                                            {
                                                               !this.state.isForward ?
                                                                  <div itemID="tab-p" className="texter-view">
                                                                  {
                                                                     <ReactQuill value={this.state.previewNews} style={{marginLeft: -15}} readOnly={true} theme={"bubble"}/>                                                                     
                                                                  }
                                                                     {this.state.updateObject.fileAttachment
                                                                        && <div>
                                                                           <a style={{ color: "#2C8ADD", cursor: "pointer" }} onClick={() => this.openPdf(this.state.updateObject.fileAttachment)}>Click To View PDF</a>
                                                                           <br></br>
                                                                           <a style={{ color: "#2C8ADD", cursor: "pointer" }} onClick={() => this.downloadURI(this.state.updateObject.title, "data:application/pdf;base64," + this.state.updateObject.fileAttachment)}>Click To Download PDF</a>
                                                                        </div>}
                                                                     {
                                                                        JSON.parse(sessionStorage.getItem('LoginUserObject')).bcmUserGroupWrapper.userGroup == 'Admin' ?
                                                                           <div className="forward-btn text-right">
                                                                              <Button variant="secondary" className="mr-3" onClick={() => this.showEditModal(true)}>Edit</Button>
                                                                              {/* <Button variant="secondary" onClick={this.forwardEmail}>Forward</Button> */}
                                                                           </div>
                                                                           : null
                                                                     }
                                                                  </div>
                                                                  : <div>
                                                                     <NewsForward goBack={this.goBack} feeds={this.state.forwardingNews} />
                                                                  </div>
                                                            }
                                                         </Col>

                                                      </Row>
                                                   </Card.Body>
                                                </Card>
                                             </Tab.Pane>

                                          </Tab.Content>
                                       </div>
                                    </Row>
                                 </Tab.Container>
                              </Tab.Pane>
                           </Tab.Content>

                        </Tab.Container>
                     </Card>


                  </Col>
               </Row>

               <Modal id="addNews"
                  show={this.state.modalShow}
                  onHide={() => { this.setModalShow(false) }}
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
               >
                  <Modal.Header closeButton>
                     <Modal.Title id="contained-modal-title-vcenter">
                        {isPublish ? JSON.parse(this.state.forwardingNews).title : 'Add News'}
                        {isPublish ? <span className="delete-btn cursor-pointer" onClick={this.deleteNews} >
                           <i className="delete-btn-i"></i></span> : null}
                     </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                     {modalLoader ? <div className="loader">
                        <Spinner animation="grow" variant="dark" />
                     </div> : null}
                     <div className="addNews-body">
                        <p className="date">{isPublish ? this.formDate(JSON.parse(this.state.forwardingNews).updatedOn) : this.getCurrentDateTime()}</p>
                        {isPublish ?
                           <AddNews goBack={this.goBack} feeds={this.state.forwardingNews} closeModal={this.hideModal} />
                           : <AddNews newRecord={true} closeModal={this.hideModal} />}
                     </div>
                  </Modal.Body>
               </Modal>

            </div>
         </div>
      );
   }

}

export default NewsAndUpdates;