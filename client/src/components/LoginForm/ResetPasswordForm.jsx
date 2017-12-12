import React, {Component} 						from 'react';
import PropTypes 								from 'prop-types';
require('./reset-pass.scss')

class ResetPasswordForm extends Component {

	constructor(props){
		super(props);
		this.handleNewPasswordSubmit = this.handleNewPasswordSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.state = {
			newPass: ''
		};
	}

	handleNewPasswordSubmit(event) {
		this.props.onSubmit(this.state.newPass);
		event.preventDefault();
	}

	handleChange(event) {
		this.setState({newPass: event.target.value});
	}

	render() {
		return(
			<div className="newPassWrapper">
				<img className="make-it-fit" src="https://i.imgur.com/kcRbDo8.png" alt="התמונה חסרה"/>
				<div className="goodMorning">שלום!</div>
				<form className="newPassForm" onSubmit={this.handleNewPasswordSubmit}>
					סיסמא חדשה: <input className="newPassInput" type="text" value={this.state.newPass} onChange={this.handleChange}/>
					<input className="newPassSubmit" type="submit" value="שליחה"/>
				</form>
			</div>
		);
	}

}

ResetPasswordForm.propTypes = {
	errorMessage: PropTypes.string,
	onSubmit: PropTypes.func
};

ResetPasswordForm.defaultProps = {
	errorMessage: "",
};

export default ResetPasswordForm;