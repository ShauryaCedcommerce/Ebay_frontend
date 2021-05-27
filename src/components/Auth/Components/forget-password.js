import React, { Component } from "react";
import { Button, Card, TextField } from "@shopify/polaris";
import { NavLink } from "react-router-dom";
import { requests } from "../../../services/request";
import { notify } from "../../../services/notify";
import { globalState } from "../../../services/globalstate";

class ForgetPasswordPage extends Component {
	fieldErrors = {
		username: false,
		password: false
	};
	fieldValidations = {
		username: /^[A-Za-z0-9_-][A-Za-z0-9_-][A-Za-z0-9_-]+(?:[_-][A-Za-z0-9]+)*$/,
		password: /^.{4,}$/
	};
	constructor() {
		super();
		this.state = {
			username: ""
		};
	}
	render() {
		return (
			<div className="row pt-5">
				<div className="offset-md-4 offset-sm-2 col-md-4 col-sm-8 col-12 mt-5">
					<Card>
						<div className="col-12 mt-5 text-center">
							<h1 className="d-inline-block">Forget Password</h1>
						</div>
						<div className="col-12 mt-1 mb-1">
							<TextField
								label="Username"
								type="text"
								error={this.fieldErrors.username ? "Enter valid username" : ""}
								value={this.state.username}
								placeholder="Enter username"
								focused="true"
								onChange={this.handleChange.bind(this, "username")}
							/>
						</div>
						<div className="col-12 text-center mt-2 mb-4">
							<Button
								onClick={() => {
									this.submitLogin();
								}}
							>
								Submit
							</Button>
						</div>
						<div className="col-12 text-left" style={{ fontSize: "15px" }}>
							<NavLink className="" to="/auth/login">
								Go Back
							</NavLink>
							<NavLink className="float-right mb-3" to="/auth/signup">
								New User?
							</NavLink>
						</div>
					</Card>
				</div>
			</div>
		);
	}
	handleChange(key, event) {
		const state = Object.assign({}, this.state);
		state[key] = event;
		this.validateForm(event, key);
		this.setState(state);
	}

	validateForm(data, key) {
		this.fieldErrors[key] = !this.fieldValidations[key].test(data);
	}

	isFormValid() {
		for (let i = 0; i < Object.keys(this.state).length; i++) {
			const key = Object.keys(this.state)[i];
			if (!this.fieldValidations[key].test(this.state[key])) {
				return false;
			}
		}
		return true;
	}

	submitLogin() {
		if (this.isFormValid()) {
			requests.getRequest("core/user/forgot", this.state).then(data => {
				if (data.success === true) {
					notify.success(data.message);
					this.redirect("/auth");
				} else {
					notify.error(data.message);
				}
			});
		} else {
			notify.error("Please fill valid credentials");
		}
	}

	redirect(url) {
		this.props.history.push(url);
	}
}

export default ForgetPasswordPage;
