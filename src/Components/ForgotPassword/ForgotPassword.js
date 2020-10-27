import React, { Component } from 'react';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import loginImg from '../../assets/images/login-img.png';
import loginLogo from '../../assets/images/logo.svg';
import ccpLogo from '../../assets/images/cloudnow-logo.png';
import emailIcon from '../../assets/images/email.svg';

import { LoginService } from '../../Service/LoginService';
import { UrlConstants } from '../../Service/UrlConstants';


class ForgotPassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			isError: {
				email: ''
			},
			message: '',
			isSentReq: false,
			Loader: false
		}
	}

	emailValidator = (Param) => {
		var returnMsg = '';
		var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

		if (mailformat.test(Param)) {
			returnMsg = '';
		} else {
			returnMsg = 'Please enter a valid email id';
		}
		return returnMsg;
	}

	formValChange = e => {
		const { value, name } = e.target;
		let isError = { ...this.state.isError };
		switch (name) {
			case 'email':
				isError.email = this.emailValidator(value)
				break;
			default:
				break;
		}
		this.setState({
			isError,
			[name]: value
		});
	}


	handleSubmit = (e) => {
		e.preventDefault()
		const payload = {
			emailId: this.state.email
		}
		this.setState({ Loader: true });
		LoginService.post(UrlConstants.forgotPasswordUrl, payload)
			.then(response => {
				this.setState({ Loader: false });
				if (response.status.success === 'SUCCESS') {
					this.setState({ isSentReq: true });
				} else if (response.status.success === 'Fail') {
					this.setState({
						isError: { email: response.status.message }
					});
				}
			})
	}

	render() {
		const { isSentReq, isError, Loader , email} = this.state;
		return (

			<div className="login-container">

				<Container>
					<Row>
						<Col lg="6" className="login-img">
							<img src={loginImg} className="img-fluid" />
						</Col>
						<Col lg="6" className="login-details">
							<div className="login-logo">
								<img src={loginLogo} className="img-fluid" />
							</div>
							<div className="login-section text-center">
								{Loader ? <div className="loader">
									<Spinner animation="grow" variant="dark" />
								</div> : null}
								{!isSentReq ? <div className="forget-password">
									<h5>Forgot Password?</h5>
									<p>We will send you a link to reset your password</p>
									<Form className="login-form" noValidate>
										<Form.Group controlId="username">
											<Form.Control type="text" placeholder="Email ID" name="email"
												onChange={this.formValChange.bind(this)} />
											<Form.Text className="error-msg"> </Form.Text>
											<div className="input-icon">
												<img src={emailIcon} className="img-fluid" />
											</div>
										</Form.Group>
										{
											isError.email.length > 0 && <Form.Text className="error-msg">{isError.email}</Form.Text>
										}
										<div className="login-btn">
											<span className="sign-text" onClick={() => this.props.history.push('/login')}>Sign in</span>
											<Button variant="primary" type="submit" onClick={e => this.handleSubmit(e)}>
												Send Reset Link
										</Button>
										</div>
									</Form>

								</div>
									:
									<div className="check-mail">
										<h5>Check your Email</h5>
										<p>We have sent a password reset link to the email ID below {email}</p>
										<div className="login-btn">
											<Button variant="primary" type="submit" onClick={() => this.props.history.push('/login')}>
											Sign in
									 	   </Button>
										</div>
									</div>}
							</div>

							<div className="powered-by">
								<p>Powered By</p>
								<img src={ccpLogo} className="img-fluid" />
							</div>
						</Col>
					</Row>
				</Container>

			</div>

		);
	}
}

export default ForgotPassword;