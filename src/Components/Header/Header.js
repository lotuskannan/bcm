import React, { Component } from 'react';
import { Dropdown, Form, Alert } from 'react-bootstrap';
import logo from '../../assets/images/logo-white.svg';
import bellIcon from '../../assets/images/bell.svg';
import searchIcon from '../../assets/images/search.svg';
import searchIconWhite from '../../assets/images/loupe.svg';
import userImg from '../../assets/images/user.png';
import man from '../../assets/images/man.png';
import { withRouter } from 'react-router-dom';
import * as RosterManagementService from '../RosterManagement/RosterManagementService';
import sharingService from '../../Service/DataSharingService';
class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			Data: [],
			selectedPlant: "",
			plants: [],
		};

	}

	componentDidMount() {
		this.getPlantsByManager();
		console.log(sessionStorage.plantId)
		if(sessionStorage.plantId!=undefined && sessionStorage.plantId!=""){
			var plantId=sessionStorage.plantId
			this.setState({ selectedPlant: plantId });
			sessionStorage.setItem("plantId", plantId);
			sharingService.sendMessage(plantId);
		}
		sharingService.getMessage().subscribe(message => {
			if (message.text === 'new plant added' || message.text === 'plant deleted') {
				if (window.location.href.includes('/home/cleansanitization')) {
					setTimeout(() => {
						this.getPlantsByManager();
					}, 2000);
				}
			}
		});
	}

	logout = () => {
		this.props.history.push('/login');
		var checkbox = localStorage.checkbox ? localStorage.checkbox : '';
		var password = localStorage.password ? localStorage.password : '';
		var username = localStorage.username ? localStorage.username : '';
		sessionStorage.clear();

		if (checkbox && password && username) {
			localStorage.checkbox = checkbox;
			localStorage.password = password;
			localStorage.username = username;
		}

	}
	handlePlantChange = (e) => {
		console.log(e.target.value);
		var plantId = e.target.value
		this.setState({ selectedPlant: plantId });
		sessionStorage.setItem("plantId", plantId);
		sharingService.sendMessage(plantId);
	}
	getPlantsByManager = () => {
		RosterManagementService.getPlantsBasedOnUser().then(response => {
			if (response.data != null) {
				var plants = response.data;
				this.setState({
					plants: plants,
				});
			}
		}).catch(error => {
		});
	}

	render() {
		return (

			<header className="header navbar fixed-top">
				<div className="sticky">
					<ul className="stickyList">
						<li><i className="settingIcon"></i></li>
						<li><i className="messageIcon"></i></li>
					</ul>
				</div>

				<a className="navbar-brand logo">
					<img src={logo} />
				</a>
				<button className="navbar-toggler sidebar-toggler d-none" type="button">
					<span className="navbar-toggler-icon"></span>
				</button>

				<ul className="nav navbar-nav ml-auto">
					<li className="nav-item">
						<Form.Group controlId="exampleForm.ControlSelect1" className="mb-0 selectGroup" id="choose-plant">
							<Form.Control as="select" value={this.state.selectedPlant} onChange={this.handlePlantChange.bind(this)}>
								{this.state.plants.length > 1 ? <option key={'all'} value={0}>All</option> : null}
								{this.state.plants.map((plant, index) =>
									<option key={index} value={plant.clientPlantMasterId}>{plant.plantName}</option>
								)}
							</Form.Control>
						</Form.Group>
					</li>
					<li className="nav-item searchPhone"><span className="search-icon"><img src={searchIconWhite} /></span></li>
					{/* <li className="nav-item search">
						<form>
							<input className="form-control" type="text" placeholder="Search" aria-label="Search"/>
							<span className="search-icon"><img src={searchIcon} /></span>
						</form>
					</li> 
						<li className="nav-item dropdown notification">
							<a href="javascript:void(0);" className="nav-link" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								<img src={bellIcon} />
								<span className="badge badge-primary">4</span>
							</a>
							<div className="noti-dropdown dropdown-menu dropdown-menu-right" aria-labelledby="dropdown07">
								<div className="noti-container">
									<div className="dropdown-title">
										<h4>Notification</h4>
									</div>
									<ul className="list-unstyled noti-list">
										<li className="row noti">
											<figure className="col profile-pic">
												<div className="pic">

												</div>
											</figure>
											<div className="col noti-details">
												<div className="row">
													<div className="col user-info">
														<h5 className="user-name">Pablo Picasso</h5>
														<small>Management</small>
													</div>
													<div className="col quote-num">
														<h6>Quotation Number : <span>IM2019051855BC</span></h6>
													</div>
												</div>
												<div className="row quote-msg">
													<div className="col">
														<p>This quotation has been <span className="text-success">APPROVED</span>
															from
															Management</p>
													</div>
												</div>
											</div>
										</li>
										<li className="row noti">
											<figure className="col profile-pic">
												<div className="pic">

												</div>
											</figure>
											<div className="col noti-details">
												<div className="row">
													<div className="col user-info">
														<h5 className="user-name">Pablo Picasso</h5>
														<small>Staff</small>
													</div>
													<div className="col quote-num">
														<h6>Quotation Number : <span>IM2019051855BC</span></h6>
													</div>
												</div>
												<div className="row quote-msg">
													<div className="col">
														<p>This quotation has been <span className="text-success">APPROVED</span>
															from
															Management</p>
													</div>
												</div>
											</div>
										</li>
									</ul>
								</div>
							</div>
						</li>                    
						*/}
					<li className="nav-item dropdown user-profile">
						<Dropdown>
							<Dropdown.Toggle className="nav-link" id="user-profile">
								<img src={man} />
							</Dropdown.Toggle>
							<Dropdown.Menu>
								<Dropdown.Item onClick={this.logout}>Logout</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</li>
				</ul>
			</header>
		);
	}
}

export default withRouter(Header);