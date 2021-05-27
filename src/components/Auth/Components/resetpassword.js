import React, { Component } from "react";
import { Button, Card, Page, TextField } from "@shopify/polaris";
import { NavLink } from "react-router-dom";
import * as queryString from "query-string";
import { requests } from "../../../services/request";
import { notify } from "../../../services/notify";

class ResetPassword extends Component {
	constructor() {
		super();
		this.state = {
			newpassword: "",
			confirmpassword: "",
			reset_key: ""
		};
	}

	fieldErrors = {
		newpassword: false,
		confirmpassword: false
	};
	fieldValidations = {
		password: /^.{4,}$/
	};
	handleChange(key, event) {
		const state = Object.assign({}, this.state);
		state[key] = event;
		this.validateForm(event, key);
		this.setState(state);
	}

	validateForm(data, key) {
		this.fieldErrors[key] = !this.fieldValidations.password.test(data);
		if (data == "") {
			this.fieldErrors[key] = false;
		}
	}
	isFormValid() {
		for (let i = 0; i < Object.keys(this.state).length; i++) {
			const key = Object.keys(this.state)[i];
			if (
				key != "reset_key" &&
				!this.fieldValidations.password.test(this.state[key])
			) {
				return false;
			}
		}
		return true;
	}
	submit() {
		if (this.isFormValid()) {
			if (this.state.newpassword == this.state.confirmpassword) {
				requests
					.getRequest("user/forgotreset", {
						newpassword: this.state.newpassword,
						token: this.state.reset_key
					})
					.then(data => {
						if (data.success === true) {
							notify.success(data.message);
							this.redirect("/auth");
						} else {
							notify.error(data.message);
						}
					});
			} else {
				notify.error("Both Password did not matched");
			}
		} else {
			notify.error("Please fill valid credentials");
		}
	}
	componentWillMount() {
		const queryParams = queryString.parse(this.props.location.search);
		if (queryParams.reset_key != null) {
			this.setState({
				reset_key: queryParams["reset_key"]
			});
		} else {
			notify.error("Token Not Found");
			this.redirect("/auth");
		}
	}
	redirect(url) {
		this.props.history.push(url);
	}
	render() {
		return (
			<div className="row pt-5">
				<div className="offset-md-4 offset-sm-2 col-md-4 col-sm-8 col-12 mt-5">
					<Card>
						<div className="col-12 mt-5 text-center">
							<h1 className="d-inline-block">Reset Password</h1>
						</div>
						<div className="col-12 mt-1 mb-1">
							<TextField
								label="New Password"
								type="password"
								error={
									this.fieldErrors.newpassword ? "Enter valid Password" : ""
								}
								value={this.state.newpassword}
								placeholder="New Password"
								focused="true"
								onChange={this.handleChange.bind(this, "newpassword")}
							/>
						</div>
						<div className="col-12 mt-1 mb-1">
							<TextField
								label="Confirm Password"
								type="password"
								error={
									this.fieldErrors.confirmpassword ? "Enter valid Password" : ""
								}
								value={this.state.confirmpassword}
								placeholder="Confirm Password"
								focused="true"
								onChange={this.handleChange.bind(this, "confirmpassword")}
							/>
						</div>
						<div className="col-12 text-center mt-2 mb-4">
							<Button
								onClick={() => {
									this.submit();
								}}
							>
								Submit
							</Button>
						</div>
						{/*<div className="col-12 text-left" style={{fontSize:'15px'}}>*/}
						{/*<NavLink className="" to="/auth/login">Go Back</NavLink>*/}
						{/*</div>*/}
					</Card>
				</div>
			</div>
		);
	}
}

export default ResetPassword;
