import React, { Component } from 'react';
import { Row, Col, Card, ProgressBar, Form, Table, Tab, Nav, Spinner } from 'react-bootstrap';
import { Doughnut, Chart } from 'react-chartjs-2';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import socialDistancing from '../../../assets/images/social-distancing.png';
import returnArrow from '../../../assets/images/return-arrow.svg';
import Axios from 'axios';
import { withRouter } from 'react-router-dom';
import { PieChart } from 'react-minimal-pie-chart';
import BaseUrl from '../../../Service/BaseUrl';
const defaultLabelStyle = {
   fontSize: '5px',
   fontFamily: 'sans-serif',
};
// import BaseUrl from '../../../Service/BaseUrl';

class CourseDetails extends Component {
   constructor(props) {
      super(props);
      this.state = {
         courseList: [],
         analyticsStatusList: [],
         imagePrefixUrl: 'https://storage.googleapis.com/elms-prod-meritgroup/Organisation',
         userList: [],
         categoryId: '',
         tableLoader: false,
         Loader: false,
         chartLoader: false,
         selectedStatus: 'Yet To Start',
         selectedPercentage: '0',
         statusObject: {
            ys_percentage: '0',
            ip_percentage: '0',
            co_percentage: '0',
         },
         selected: 0,
         chartData: [
            { name: "YS", value: 0, color: '#FB0033' },
            { name: "CO", value: 0, color: '#00D225' },
            { name: "IP", value: 0, color: '#F47700' },
         ]



      };
   }
   componentDidMount() {

      if (this.props.history.location.search) {
         const courseId = this.props.history.location.search.split('?id=')[1];
         this.setState({ categoryId: courseId });
         this.getCourseChartData(courseId);

      }else{
         this.props.history.push('/home/traningawareness');
      }
      this.getCourseList();

   }

   getCourseChartData(courseId) {
      const orgId = sessionStorage.orgId;
      const token = sessionStorage.token;
      const categoryId = courseId;
      this.setState({ chartLoader: true });
      const url = `${BaseUrl.demoElmsHornbillfxUrl}hbfx-cnt-elms/category/bcmCourseAdminGraphAnalytics?categoryId=${categoryId}&organisationId=${orgId}`;
      Axios(url, {
         method: 'POST',
         headers: {
            'content-type': 'application/json',
            'token': token
         }
      })
         .then(response => {
            if (response.data.userAnalytics) {
               const chartObject = response.data.userAnalytics.analyticsStatus;
              

               for (let value of chartObject) {

                  for (let obj of this.state.chartData) {
                     if (value.statusCode == obj.name) {
                        obj.value = value.percentage;
                     }
                  }

               }

               const statusPercentage = {
                  ys_percentage: chartObject.filter(e => e.statusCode == 'YS')[0].percentage,
                  ip_percentage: chartObject.filter(e => e.statusCode == 'IP')[0].percentage,
                  co_percentage: chartObject.filter(e => e.statusCode == 'CO')[0].percentage,
               }

               const percentage = chartObject.filter(e => e.percentage != 0).length != 0
                  ? chartObject.filter(e => e.percentage != 0)[0].percentage : 0;

               const statusName = chartObject.filter(e => e.percentage != 0).length != 0
                  ? chartObject.filter(e => e.percentage != 0)[0].status : 'Yet To Start';

               const statusIndex = this.state.chartData.filter(e => e.value != 0).length != 0
                  ? this.state.chartData.findIndex(e => e.value != 0) : 0;


               this.setState({
                  statusObject: statusPercentage,
                  selectedStatus: statusName,
                  selectedPercentage: percentage,
                  analyticsStatusList: chartObject,
                  chartLoader: false,
                  selected:statusIndex
               });
               const object = chartObject;
               const userIds = object[0].idList.length != 0 ? object[0].idList :
                  object[1].idList.length != 0 ? object[1].idList :
                     object[2].idList.length != 0 ? object[2].idList : 0;
               this.getListOfUserByStatus(userIds);

            }

         }).catch(error => {

         })

   }

   getCourseList() {
      const orgId = sessionStorage.orgId;
      const token = sessionStorage.token;
      this.setState({ Loader: true });
      const url = `${BaseUrl.demoElmsHornbillfxUrl}hbfx-cnt-elms/category/bcmAllCoursesAdminGraphAnalytics?organisationId=${orgId}`;
      Axios(url, {
         method: 'POST',
         headers: {
            'content-type': 'application/json',
            'token': token
         }
      })
         .then(response => {
            this.setState({
               courseList: response.data.categoryAnalytics.category,
               Loader: false
            });
            const courseIndex = response.data.categoryAnalytics.category.findIndex(elem => elem.categoryId == this.state.categoryId);
            setTimeout(() => {
               if (this.carousel && courseIndex != 0) {
                  this.carousel.next(courseIndex);
               }
            }, 2000);

         }).catch(error => {

         });
   }
   onClickChartLable = (index) => {   
      const { selected, chartData } = this.state;
      const code = chartData[index].name;
      const value = this.state.analyticsStatusList.filter(elem => {
         if (elem.statusCode == code) {
            return elem;
         }
      });
      this.setState({
         selectedPercentage: value[0].percentage,
         selectedStatus: value[0].status,
         selected: index === selected ? undefined : index
      })
      const userIds = value[0].idList.length != 0 ? value[0].idList : 0;
      this.getListOfUserByStatus(userIds);
   }

   onchangeCourse = (value) => {
      const courseIndex = this.state.courseList.findIndex(elem => elem.categoryId == value);
      this.setState({ categoryId: value });
      if (this.carousel && courseIndex != 0) {
         this.carousel.goToSlide(courseIndex);
      } else {
         this.carousel.goToSlide(courseIndex);
      }
      this.getCourseChartData(value);
   }

   getListOfUserByStatus(userId) {

      const userIds = userId;
      const orgId = sessionStorage.orgId;
      const url = `${BaseUrl.demoElmsHornbillfxUrl}hbfx-cnt-elms/adminDashboard/bcmUserAnalyticsView?userIds[]=${userIds}&organisationId=${orgId}&categoryId=${this.state.categoryId}`;
      const token = sessionStorage.token;
      this.setState({ tableLoader: true });
      Axios(url, {
         method: 'GET',
         headers: {
            'content-type': 'application/json',
            'token': token
         }
      })
         .then(response => {

            response.data.data.filter(elem => {
               elem.totalTimeSpent = elem.totalTimeSpent ? elem.totalTimeSpent : '00:00:00';
               elem.statusPercentage = elem.statusPercentage ? elem.statusPercentage : 0;
               elem.statusColor = elem.statusPercentage == '100' ? 'success' :
                  (elem.statusPercentage <= '99' && elem.statusPercentage != 0) ? 'warning' : 'error';
            })

            this.setState({
               userList: response.data.data,
               tableLoader: false
            });

         }).catch(error => {

         })
   }


   render() {
      const { courseList, imagePrefixUrl, userList,
         chartLoader, Loader, tableLoader, selectedStatus,
         selectedPercentage,
         statusObject, selected } = this.state;
      const responsive = {
         superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 1
         },
         desktop: {
            breakpoint: { max: 3000, min: 1200 },
            items: 1
         },
         tablet: {
            breakpoint: { max: 1199, min: 681 },
            items: 2,
            partialVisibilityGutter: 60,
            slidesToSlide: 2
         },
         mobile: {
            breakpoint: { max: 680, min: 0 },
            items: 1,
            slidesToSlide: 1
         },
      };
      const lineWidth = 60;
      return (
         <div className="dashboard-container course-details">
            <div className="dashboard-section">
               {Loader ? <div className="loader">
                  <Spinner animation="grow" variant="dark" />
               </div> : null}
               <div className="welcome-text">
                  <div className="pageTitle training-header">
                     <h2>Courses Details
                        <span className="return-arrow" onClick={e => this.props.history.push('/home/traningawareness')}>
                           <img src={returnArrow} alt="returnArrow" />
                        </span>
                     </h2>
                  </div>
               </div>
               <Row className="h-100">
                  <Col md={12} xl="6 pb-0">
                     <Row className="row-1 h-50 mx-0">
                        <Col xl="12 px-0">
                           <Card className="emp-health">
                              <Card.Title>
                                 <div>Course Statistics  </div>
                              </Card.Title>
                              <Card.Body>
                                 <div className="doughnut-chart">
                                    <Row className="align-items-center">
                                       <Col md={6} xl="6 pb-0 circleChart">
                                          {chartLoader ? <div className="loader">
                                             <Spinner animation="grow" variant="dark" />
                                          </div> : null}

                                          <div className="PieChart">
                                             <PieChart

                                                data={this.state.chartData}
                                                radius={45}
                                                lineWidth={50}
                                                segmentsStyle={(index) => {
                                                   return index === selected
                                                      ? { transition: 'stroke .3s', cursor: 'pointer', strokeWidth: 25 }
                                                      : { transition: 'stroke .3s', cursor: 'pointer' };
                                                }}
                                                segmentsTabIndex={1}
                                                segmentsShift={(index) => (index === selected ? 1.5 : 0)}
                                                animate
                                                onClick={(_, index) => { this.onClickChartLable(index) }}

                                             />
                                             <div className="complete-text">
                                                <h4>{selectedPercentage}%</h4>
                                                {selectedStatus}
                                             </div>
                                          </div>
                                       </Col>
                                       <Col md={6} xl="6  showResultContainer pb-0">
                                          <div className="showResult">
                                             <h4 className="resutl error" onClick={e => this.onClickChartLable(0)}>
                                                <i className="cricle"></i> Yet To Start
                                                <span className="percentage">{statusObject.ys_percentage}%</span>
                                             </h4>
                                          </div>
                                          <div className="showResult">
                                             <h4 className="resutl warning border-0" onClick={e => this.onClickChartLable(2)}>
                                                <i className="cricle"></i> In Progress
                                                <span className="percentage">{statusObject.ip_percentage}%</span>
                                             </h4>
                                          </div>
                                          <div className="showResult">
                                             <h4 className="resutl success" onClick={e => this.onClickChartLable(1)}>
                                                <i className="cricle"></i>
                                                Completed
                                                <span className="percentage">{statusObject.co_percentage}%</span>
                                             </h4>
                                          </div>
                                       </Col>
                                    </Row>
                                 </div>
                              </Card.Body>
                           </Card>
                        </Col>
                     </Row>
                     <Row className="row-2 h-50 mx-0">
                        <Col xl="12 px-0">
                           <Card className="emp-health">
                              <Card.Title className="descriptionTitle">
                                 <div>Course Description</div>
                                 <Form className="mb-0 distancing">
                                    <Form.Group controlId="exampleForm.ControlSelect1" className="mb-0 w-100">
                                       <Form.Control as="select" value={this.state.categoryId} name="category" onChange={e => this.onchangeCourse(e.target.value)} className="courseDescription w-100">
                                          {courseList.map((course, index) =>
                                             <option key={index} value={course.categoryId}>
                                                {course.name}
                                             </option>)}
                                       </Form.Control>
                                    </Form.Group>
                                 </Form>
                              </Card.Title>
                              <Carousel responsive={responsive} ref={(el) => (this.carousel = el)} className="react__carousel" >
                                 {courseList.map((course, index) =>
                                    <div key={index} className="courseCarouseContainer">
                                       <Card.Body className="px-0 courseCarouselBody pt-0">
                                          <Row className="courseCarousel align-items-center">
                                             <Col xl="6 carouselList px-0" className="pb-0">
                                                <Card className="item card-traning" onClick={e => this.onchangeCourse(course.categoryId)}>
                                                   <Card.Body className="row p-0 social-body">
                                                      <div className="card-images" style={{ backgroundImage: `url(${imagePrefixUrl + course.bannerPath})` }} >
                                                      </div>
                                                      <div className="courseDetails">
                                                         <Card.Title>{course.name}</Card.Title>
                                                         {/* <Card.Text>
                                                            {course.description}
                                                         </Card.Text> */}
                                                      </div>
                                                   </Card.Body>
                                                </Card>
                                             </Col>
                                             <Col xl="6" className="pb-0 course__des">
                                                <p>{course.description}</p>
                                             </Col>
                                          </Row>

                                       </Card.Body>
                                    </div>)}

                              </Carousel>

                           </Card>
                        </Col>
                     </Row>
                  </Col>
                  <Col md={12} xl="6 h-100">
                     <Card className="news-update">
                        <Card.Title>
                           <div>Employee Course Consumption</div>
                        </Card.Title>
                        <Card.Body>
                           <Table className="consumptionTable">
                              <thead>
                                 <tr>
                                    <th>Name</th>
                                    <th>Status</th>
                                    <th>Total Time Spent</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {tableLoader ? <div className="loader">
                                    <Spinner animation="grow" variant="dark" />
                                 </div> : null}
                                 {userList.length != 0 ? userList.map((user, index) =>
                                    <tr key={index}>
                                       <td>{user.userName}</td>
                                       <td> <div className="ProgressConatiner">
                                          <span className={user.statusPercentage == 0 ? 'ProgressBarResult error' : 'ProgressBarResult'}>{`${user.statusPercentage} %`}</span>
                                          <ProgressBar className={user.statusColor} now={user.statusPercentage} /></div></td>
                                       <td>{user.totalTimeSpent}</td>
                                    </tr>) : <tr><td colspan="3"><div className="no-record">No Record</div></td></tr>}
                              </tbody>
                           </Table>
                        </Card.Body>
                     </Card>
                  </Col>
               </Row>
            </div>
         </div>
      );
   }
}
export default withRouter(CourseDetails);