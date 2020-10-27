import React, { Component } from 'react';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import loginImg from '../../assets/images/login-img.png';
import loginLogo from '../../assets/images/logo.png';
import ccpLogo from '../../assets/images/cloudnow-logo.png';
import pwdIcon from '../../assets/images/password.svg';
import emailIcon from '../../assets/images/email.svg';
import axios from 'axios';

import BaseUrl from '../../Service/BaseUrl';
// import * as LoginService from '../../Service/LoginService';
import AuthGuard from '../../AuthGuard';
import Axios from 'axios';
import { LoginService } from '../../Service/LoginService';

var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			isChecked: false,
			isError: {
				email: '',
				password: ''
			},
			message: '',
			inputType: true,
			Loader: false,
			restrictMsg: null,
			components: [],
		}
	}
	redirectToDashboard = () => {
		if (this.state.components.includes("Dashboard")) {
			this.props.history.push("/home/dashboard");
		}
		else if (this.state.components.includes("Survey")) {
			this.props.history.push("/home/onsitesurvey");
		}
		else if (this.state.components.includes("EmployeeHealth")) {
			this.props.history.push("/home/employeehealth");
		}
		else if (this.state.components.includes("Cleanliness&Sanitization")) {
			this.props.history.push("/home/cleansanitization");
		}
		else if (this.state.components.includes("DataManagement")) {
			this.props.history.push("/home/datamanagement");
		}
		else if (this.state.components.includes("ReportManagement")) {
			this.props.history.push("/home/reportmanagement");
		}
		else if (this.state.components.includes("Training&Awareness")) {
			this.props.history.push("/home/traningawareness");
		}
		else if (this.state.components.includes("News&Updates")) {
			this.props.history.push("/home/newsandupdates");
		}
		else if (this.state.components.includes("RoleManagement")) {
			this.props.history.push("/home/roleManagement");
		}
		else {
			this.props.history.push("/home/notAuthorised");
		}

	};
	redirectToOnsitesurvey = () => {
		this.props.history.push("/home/onsitesurvey");
	};
	componentDidMount() {
		if (AuthGuard.getAuth() == true || AuthGuard.getAuth() == 'true') {
			this.redirectToDashboard();
		}
		if (localStorage.checkbox && localStorage.username !== "") {
			this.setState({
				isChecked: true,
				email: localStorage.username,
				password: localStorage.password
			})
		}
	}
	emailValidator = (Param) => {
		var returnMsg = '';
		// mailformat.test(Param)
		if (Param.length >= 3) {
			returnMsg = '';
		} else {
			returnMsg = 'Please enter the user name';
		}
		return returnMsg;
	}
	passwordValidator = (Param) => {
		var returnMsg = '';
		if (Param.length > 0) {
			returnMsg = '';
		} else {
			returnMsg = 'Please enter the password';
		}
		return returnMsg;
	}
	formValChange = e => {
		e.preventDefault();
		const { name, value } = e.target;
		let isError = { ...this.state.isError };
		switch (name) {
			case "email":
				isError.email = this.emailValidator(value)
				break;
			case "password":
				isError.password = this.passwordValidator(value)
				break;
			default:
				break;
		}

		this.setState({
			isError,
			[name]: value
		});
	};
	userlogin = e => {
		this.setState({ restrictMsg: null })
		sessionStorage.loginUserToken = '';
		e.preventDefault();
		const { email, password, isChecked, isError } = this.state
		if (this.emailValidator(email) == '' && this.passwordValidator(password) == '') {
			// var requestData = {
			// 	"emailId": email,
			// 	"password": password
			// };
			var requestData = {
				"username": email,
				"password": password
			};
			this.setState({
				Loader: true,
				message: ''
			})
			LoginService.login(requestData).then(Response => {

				if (Response.status.success == 'Fail' || Response.status.success == 'FAILED') {
					this.setState({
						Loader: false
					});
					this.setState({ message: Response.status.message });
					sessionStorage.setItem('isAuthorized', false);
				} else {
					sessionStorage.LoginUserObject = JSON.stringify(Response.data);
					sessionStorage.setItem('isAuthorized', true);
					sessionStorage.loginUserToken = Response.token;
					if (Response.data.plantOrBranchList.length == 1) {
						var selectedPlant = Response.data.plantOrBranchList[0].clientPlantMasterId;
						sessionStorage.setItem("plantId", selectedPlant);
					}
					var dbComponents = Response.data.bcmUserGroupWrapper.objBcmAppPermissionWrapper;
					var UIComponents = [];
					for (let compo of dbComponents) {
						var menu = compo.navigationMenu;
						menu = menu.replace(/\s/g, '');;
						UIComponents.push(menu);
					}
					this.setState({
						components: UIComponents
					});
					if (Response.data.bcmUserGroupWrapper.userGroup === 'Security') {
						//vani comentin this after adding role access for application
						//this.redirectToOnsitesurvey();
						this.redirectToDashboard();
					} else {
						this.getAuthToken(Response.data);
						// this.redirectToDashboard();
					}
				}

				if (isChecked && email !== "") {
					localStorage.username = email
					localStorage.password = password
					localStorage.checkbox = isChecked
				} else if (!isChecked) {

				}

			}).catch(error => {
				this.setState({ message: error.message, Loader: false });
			})
		} else {

			// console.log(isError);
			isError.email = this.emailValidator(email);
			isError.password = this.passwordValidator(password);
			this.setState({ isError: isError });
		}
	}
	getAuthToken(obj) {
		const payLoad = { "emailId": obj.elmsUserId, "passwordHash": obj.elmsPassword };
		const domainName = obj.elmsDomain ? obj.elmsDomain : 'https://elms.meritgroup.cloudnowtech.com';
		const url = `${domainName}/core/api/v1/hbfx-insta-authentication/user/login`
		return Axios(url, {
			method: 'POST',
			data: payLoad,
			headers: {
				'content-type': 'application/json',
			}
		})
			.then(response => {
				this.setState({
					Loader: false
				})
				if (response.data.data) {
					sessionStorage.setItem('token', response.data.token);
					sessionStorage.setItem('orgId', response.data.data.organisation.organisationId);
					sessionStorage.setItem('orgName', response.data.data.organisation.name);

					// this.chuttiLoginWithEmail();
					this.redirectToDashboard();
				} else {
					// this.chuttiLoginWithEmail();
					this.redirectToDashboard();
				}
			})
			.catch(error => {
				this.redirectToDashboard();

			});
	}

	chuttiLoginWithEmail = () => {
		let email = 'jayanta.d@cloudnowtech.com';
		LoginService.chuttiLoginWithEmail(email).then(Response => {
			this.setState({
				Loader: false
			})
			sessionStorage.setItem('chuttiLoginObject', JSON.stringify(Response));
			this.redirectToDashboard();
		}).catch(error => {
			this.setState({
				Loader: false
			})
			this.redirectToDashboard();
		});
	}

	changeType = e => {
		this.setState({ inputType: !this.state.inputType });
	}
	onChangeCheckbox = event => {
		console.log(event.target.checked);

		this.setState({
			isChecked: event.target.checked
		});

	}
	render() {
		const { isError, inputType, isChecked, Loader } = this.state;
		return (
			<div className="login-container">
				<Container>
					<div className="row">
						<div className="col-12 col-md-6 login-img">
							<img src={loginImg} className="img-fluid" />
						</div>
						<div className="col-12 col-md-6 login-details">
							<div className="login-logo">
								<img src={loginLogo} className="img-fluid" />
							</div>
							<div className="login-section">
								{Loader ? <div className="loader">
									<Spinner animation="grow" variant="dark" />
								</div> : null}
								<Form className="login-form" noValidate>
									<Form.Group controlId="username">
										<Form.Control type="text" placeholder="User Name" name="email"
											onChange={this.formValChange.bind(this)} value={this.state.email} />
										{isError.email.length > 0 && (
											<Form.Text className="error-msg"> {isError.email} </Form.Text>
										)}
										<div className="input-icon">
											<img src={emailIcon} className="img-fluid" />
										</div>
									</Form.Group>

									<Form.Group controlId="password">
										<Form.Control type={inputType ? "password" : 'text'} name="password" placeholder="Password"
											onChange={this.formValChange.bind(this)} value={this.state.password} />
										{isError.password.length > 0 && (
											<Form.Text className="error-msg">{isError.password}</Form.Text>
										)}
										<div className="input-icon pwd" onClick={this.changeType}>
											<i className={inputType ? 'password-icon hide' : 'password-icon show'}></i>
										</div>
									</Form.Group>
									<Form.Group controlId="password" className="row remember">
										<div className="col-6">
											<div key={`custom-checkbox`}>
												<Form.Check
													custom
													type={'checkbox'}
													checked={isChecked}
													onChange={this.onChangeCheckbox}
													id={`custom-checkbox`}
													label={`Remember me`}
												/>
											</div>
										</div>
										<div className="col-6 text-right">
											<Button variant="link" className="p-0" onClick={e => this.props.history.push('/forgotpwd')}>Forgot Password?</Button>
										</div>
									</Form.Group>
									{
										this.state.message == ""
											? ''
											: <Form.Text className="error-msg">{this.state.message}</Form.Text>
									}
									{
										this.state.restrictMsg == null
											? ''
											: <Form.Text className="error-msg">{this.state.restrictMsg}</Form.Text>
									}
									<div className="login-btn">
										<Button variant="primary" type="submit" onClick={this.userlogin}>
											Sign in
									</Button>
									</div>

								</Form>

							</div>

							<div className="powered-by">
								<p>Powered By</p>
								<img src={ccpLogo} className="img-fluid" />
							</div>
						</div>
					</div>
				</Container>
			</div>
		);
	}
}

export default Login;