import React, { Component } from 'react';
import { GenericApiService } from '../../Service/GenericApiService';
import { UrlConstants } from '../../Service/UrlConstants';
import { withRouter } from 'react-router-dom';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Spinner } from 'react-bootstrap';
import sharingService from '../../Service/DataSharingService';
import * as DashboardService from './DashboardService';

class CleaninessAndSanitization extends Component {
    constructor(props) {
        super(props);
        this.state = {
            plantStatusList: props.plantList ? props.plantList : [],
            Loader: props.Loader ? props.Loader : false,
            plantId: 0
        }
    }

    componentDidMount() {
        // var plantId = sessionStorage.getItem("plantId") ? sessionStorage.getItem("plantId") : 0;
        // this.setState({ plantId });
        // this.subscription = sharingService.getMessage().subscribe(message => {
        //     if (message) {
        //         var plantId = +message.text
        //         this.setState({ plantId });
        //         if (this.props.history.location.pathname == '/home/dashboard') {
        //             this.getPlantStatusCount(plantId);
        //         }
        //     }
        // });
        // this.getPlantStatusCount(plantId);
    }


    getPlantStatusCount = (plantId) => {
        this.setState({ Loader: true });
        DashboardService.getPlantList(plantId).then(response => {
                var plantList = response.data;
                this.plantStatusList(plantList);
            }).catch(error => {

            })

    }

    plantStatusList(plantList) {
        if (plantList) {
            plantList.filter(plant => {
                if ((plant.overdueCount == 0 && plant.doneCount == 0 && plant.ipCount > 0)
                    || (plant.overdueCount == 0 && plant.doneCount > 0 && plant.ipCount > 0)) {
                    plant.color = 3;
                } else if (plant.overdueCount == 0 && plant.ipCount == 0 && plant.doneCount > 0) {
                    plant.color = 2;
                } else if (plant.overdueCount == 0 && plant.ipCount == 0 && plant.doneCount == 0) {
                    plant.color = 0;
                } else {
                    plant.color = 1;
                }

            });
        }
        this.setState({
            plantStatusList: plantList,
            Loader: false
        });
    }

    gotPlantPage(plant) {
        return this.props.history.push('/home/cleansanitization?plant=' + plant.clientPlantMasterId);
    }
    render() {
        const { Loader, plantStatusList } = this.state;
        const responsive = {
            desktop: {
                breakpoint: { max: 3000, min: 1024 },
                items: 3,
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
        return (
            <>
                {Loader ? <div className="loader">
                    <Spinner animation="grow" variant="dark" />
                </div> : null}
                {plantStatusList.length != 0 ? <Carousel responsive={responsive} >
                    {plantStatusList.map((plant, index) =>
                        <div key={index}
                            className={`plants plant-` + plant.color} >
                            <div className="plant-circle" onClick={() => this.gotPlantPage(plant, index)}>
                                <div className="plant-number">
                                    {plant.plant}
                                </div>
                            </div>
                            <div className="plant-data">
                                <ul className="list-unstyled plant-data-list">
                                    <li>
                                        <span className="label">Yet to Start</span>
                                        <span className="value text-danger">{plant.yetToStartCount}</span>
                                    </li>
                                    <li>
                                        <span className="label">Overdue</span>
                                        <span className="value text-danger">{plant.overdueCount}</span>
                                    </li>
                                    <li>
                                        <span className="label">In-Progress</span>
                                        <span className="value text-warning">{plant.ipCount}</span>
                                    </li>
                                    <li>
                                        <span className="label">Done</span>
                                        <span className="value text-success">{plant.doneCount}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>)}
                </Carousel> : <div className="text-center " style={{ marginTop: 75 }}>
                        Oops! Branch details needs to be added.</div>}
            </>
        )
    }
}
export default withRouter(CleaninessAndSanitization);