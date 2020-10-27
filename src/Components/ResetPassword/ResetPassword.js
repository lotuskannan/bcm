import React, { Component } from 'react';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import loginImg from '../../assets/images/login-img.png';
import loginLogo from '../../assets/images/logo.svg';
import ccpLogo from '../../assets/images/cloudnow-logo.png';
import { LoginService } from '../../Service/LoginService';
import { UrlConstants } from '../../Service/UrlConstants';

class ResetPassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isError: {
				password: ''
			},
			newPassword: '',
			confirmPassword: '',
			token: '',
			Loader: false,
			passwordMatch: '',
			inputType: true,
			token:'',
			email:'example@gmail.com'


		}
	}
	componentDidMount() {
		
		const token = this.props.location.search.split('token=')[1];
		const email = this.props.location.search.split('email=')[1];

		if (token) {
        this.setState({token,email});
		}

	}

	passwordValidator = (Param) => {
		var returnMsg = '';
		var passwordRegex =
		 /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#$@$!%*?&~()<>{}.+-_=|\:;"])[A-Za-z\d$@$!%*?&].{7,}$/
		if (passwordRegex.test(Param)) {
			returnMsg = '';
		} else {
			returnMsg = 'Password must be 8 Charcters and includes one UpperCase, LowerCase, Number and SpecialChars.';
		}
		return returnMsg;
	}

	changeNewPassword = e => {
		const { value, name } = e.target;
		let isError = { ...this.state.isError };

		switch (name) {
			case 'newPassword':
				isError.password = this.passwordValidator(value)
				break;
			default:
				break;
		}

		this.setState({
			isError,
			[name]: value
		});


	}

	changeConfirmPassword = (e) => {
		const { value, name } = e.target;
		this.setState({
			[name]: value
		});

		const { newPassword } = this.state;
		var confirmPassword = value;
		if (confirmPassword && newPassword) {
			if (confirmPassword == newPassword) {
				this.setState({ passwordMatch: '' });
			} else {
				this.setState({ passwordMatch: "Password doesn't match" });
			}

		} else {
			this.setState({ passwordMatch: '' });
		}
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.setState({
			 Loader: true,
			 passwordMatch: ''
		 });
		const url = `${UrlConstants.resetPasswordUrl}?password=${this.state.confirmPassword}&resetPasswordToken=${this.state.token}`
		LoginService.post(url, {})
		.then(response => {
			this.setState({ Loader: false });
			if (response.status.success === 'SUCCESS') {
				this.setState({ Loader: false });
				this.props.history.push('/login')
			} else if (response.status.success === 'Fail') {
				this.setState({
					passwordMatch: response.status.message 
				});
			}
		})

	}
	changeType = e => {
		this.setState({ inputType: !this.state.inputType });
	}
	render() {
		const { isError, Loader, passwordMatch , inputType ,email} = this.state;
		return (
			<div className="login-container">

				<Container>
					<Row>
						<Col lg="6">
							<img src={loginImg} className="img-fluid" />
						</Col>
						<Col lg="6">
							<div className="login-logo">
								<img src={loginLogo} className="img-fluid" />
							</div>
							<div className="login-section text-center">
								{Loader ? <div className="loader">
									<Spinner animation="grow" variant="dark" />
								</div> : null}
								<h5>Reset Password</h5>
								<p>For the below email id <br /> {email}</p>
								<Form className="login-form" noValidate>
									<Form.Group controlId="username">
										<Form.Control type={inputType ? "password" : 'text'} onChange={this.changeNewPassword.bind(this)} placeholder="New Password" name="newPassword"
										/>
										<div class="input-icon pwd" onClick={this.changeType}><i class={inputType ? 'password-icon hide' : 'password-icon show'}></i></div>
										{isError.password.length > 0 &&
											<Form.Text className="error-msg">{isError.password}</Form.Text>
										}
									</Form.Group>
									<Form.Group controlId="username">
										<Form.Control onChange={this.changeConfirmPassword.bind(this)} type="text" placeholder="Confirm Password" name="confirmPassword"
										/>
										<div class="input-icon pwd"><i class="tick"></i></div>
									</Form.Group>

									{passwordMatch.length > 0 && <Form.Text className="error-msg">{passwordMatch}</Form.Text>}
									<div className="login-btn">

										<Button variant="primary" type="submit" onClick={e => this.handleSubmit(e)}>
											Confirm
									</Button>
									</div>

								</Form>

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

export default ResetPassword;