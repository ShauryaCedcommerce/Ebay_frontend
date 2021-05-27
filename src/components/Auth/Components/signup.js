import React, { Component } from "react";
import { Link } from "react-router-dom";

import { TextField, Button, Card } from "@shopify/polaris";

import { requests } from "../../../services/request";
import { notify } from "../../../services/notify";

export class Signup extends Component {
	fieldErrors = {
		username: false,
		email: false,
		password: false,
		repeatPassword: false,
		phone: false
	};
	fieldValidations = {
		username: /^[A-Za-z0-9_-][A-Za-z0-9_-][A-Za-z0-9_-]+(?:[_-][A-Za-z0-9]+)*$/,
		email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		password: /^.{4,}$/,
		repeatPassword: /^.{4,}$/,
		phone: /^[+()0-9 ]{8,16}$/
	};
	constructor() {
		super();
		this.state = {
			username: "",
			email: "",
			password: "",
			repeatPassword: "",
			phone: ""
		};
	}

	render() {
		return (
			<div className="row pt-5">
				<div className="offset-md-4 offset-sm-2 col-md-4 col-sm-8 col-12 mt-5">
					<Card>
						<div className="col-12 mt-5 text-center">
							<h1 className="d-inline-block">Signup</h1>
						</div>
						<div className="col-12 mt-1 mb-1">
							<TextField
								label="Username"
								type="text"
								error={this.fieldErrors.username ? "Enter valid username" : ""}
								value={this.state.username}
								placeholder="Enter Username"
								focused="true"
								onChange={this.handleChange.bind(this, "username")}
							/>
						</div>
						<div className="col-12 mt-1 mb-1">
							<TextField
								label="Email"
								type="email"
								error={this.fieldErrors.email ? "Enter valid email" : ""}
								value={this.state.email}
								placeholder="Enter Email"
								onChange={this.handleChange.bind(this, "email")}
							/>
						</div>
						<div className="col-12 mt-1 mb-1">
							<TextField
								label="Password"
								type="password"
								error={this.fieldErrors.password ? "Password too small" : ""}
								value={this.state.password}
								placeholder="Enter Password"
								onChange={this.handleChange.bind(this, "password")}
							/>
						</div>
						<div className="col-12 mt-1 mb-1">
							<TextField
								label="Repeat Password"
								type="password"
								error={
									this.fieldErrors.repeatPassword
										? "Passwords do not match"
										: ""
								}
								value={this.state.repeatPassword}
								placeholder="Repeat Password"
								onChange={this.handleChange.bind(this, "repeatPassword")}
							/>
						</div>
						<div className="col-12 mt-1 mb-1">
							<TextField
								label="Contact Number"
								type="number"
								error={
									this.fieldErrors.phone ? "Enter valid contact number" : ""
								}
								value={this.state.phone}
								placeholder="Enter Phone Number"
								onChange={this.handleChange.bind(this, "phone")}
							/>
						</div>
						<div className="col-12 text-center mt-4">
							<Button
								onClick={() => {
									this.register();
								}}
							>
								Signup
							</Button>
						</div>
						<div className="col-12 text-center mt-4 mb-5">
							<Link className="mt-3" to="/auth/login">
								Already have an account?
							</Link>
						</div>
					</Card>
				</div>
			</div>
		);
	}

	validateForm(data, key) {
		if (key === "repeatPassword") {
			this.fieldErrors[key] = this.state.password !== data;
		} else {
			this.fieldErrors[key] = !this.fieldValidations[key].test(data);
		}
	}

	isFormValid() {
		for (let i = 0; i < Object.keys(this.state).length; i++) {
			const key = Object.keys(this.state)[i];
			if (key === "repeatPassword") {
				if (this.state.password !== this.state.repeatPassword) {
					return false;
				}
			} else {
				if (!this.fieldValidations[key].test(this.state[key])) {
					return false;
				}
			}
		}
		return true;
	}

	handleChange(key, event) {
		const state = Object.assign({}, this.state);
		state[key] = event;
		this.validateForm(event, key);
		this.setState(state);
	}

	register() {
		if (this.isFormValid()) {
			requests.getRequest("user/create", this.state).then(data => {
				if (data.success) {
					notify.success(data.message);
					this.redirect("/auth/login");
				} else {
					notify.error(data.message);
				}
			});
		} else {
			notify.error("Fill all required fields");
		}
	}

	redirect(url) {
		this.props.history.push(url);
	}
}
