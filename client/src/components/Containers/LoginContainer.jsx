import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import loginActions from '../../redux/actions/loginActions';
import LoginForm from '../LoginForm/LoginForm';
import {Form} from 'antd';
import 'antd/dist/antd.css';
import {Redirect} from 'react-router';

class LoginContainer extends Component {

	constructor(props) {
		super(props);
		this.state = {
			errorMessage: "",
			email: "",
			password: ""
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.inCreatNewPassword = /password\/reset\//.test(props.location.pathname);
	}

	onSubmit(values) {
		var loginForm = {
			password: values.password || "",
			email: values.userName
		};

		this.props.onLoginSubmit(loginForm);
	}

	render() {
		const WrappedNormalLoginForm = Form.create()(LoginForm);
		if (this.props.response === "success") {
			return (<Redirect push="push" to="/"/>);
		}
		return (<div className='signin-container content-main-center'>

			<WrappedNormalLoginForm onSubmit={this.props.onLoginSubmit} email={this.state.email} password={this.state.password} errorMessage={this.props.response} onForgotPassword={this.props.onForgotPassword} onCreateNewPasswordPassword={this.props.onCreateNewPasswordPassword} inCreatNewPassword={this.inCreatNewPassword}/>
		</div>);

	}
}

LoginContainer.propTypes = {
	response: PropTypes.string
};

LoginContainer.defaultProps = {
	response: ""
};

const mapDispatchToProps = function(dispatch, props) {
	etPasswordToken = props.location.search && props.location.search.match(/\?token=(.*)/)[1];
	return {
		onLoginSubmit: (loginForm) => dispatch(loginActions.login(loginForm)),
		onForgotPassword: (email) => dispatch(loginActions.forgotPassword(email)),
		onCreateNewPasswordPassword: (password) => dispatch(loginActions.createNewPassword({password, token: resetPasswordToken}))
	};
};

const mapStateToProps = function(state) {
	return {response: state.loginReducer.response};
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
