import React, { Component } from "react";
import {
	Button,
	Card,
	Checkbox,
	Form,
	FormLayout,
	Page,
	Select,
	TextField,
    Badge,
	Label,
	Stack,
} from "@shopify/polaris";

import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';
import { isUndefined } from "util";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { term_and_condition } from "./dashboard/term&condition";
import AnalyticsReporting from "./products-component/new-analytics-reporting";

import { requests } from "../../../services/request";
import { notify } from "../../../services/notify";

import { json } from "../../../environments/static-json";

import "./dashboard/dashboard.css";
import PricingGuide from "../../../shared/pricing_guide";

class Dashboard extends Component {
	constructor(props) {
		super(props);
		props.disableHeader(false); // used in disabled header
		this.state = {
			shop_url:'',
			count:2,
			info: {
				full_name: "",
				mobile: "",
				mobile_code: "+1",
				country_code: "US",
				email: "",
				skype_id: "",
				// primary_time_zone:'Pacific Time',
				// best_time_to_contact: '8-12',
				term_and_condition: false,
				how_u_know_about_us: "",
				Other_text: ""
			}, // Step 1
			info_error: {
				full_name: false,
				mobile: "",
				email: false,
				skype_id: "",
				primary_time_zone: "Pacific Time",
				best_time_to_contact: "8-12",
				term_and_condition: false,
				how_u_know_about_us: ""
			}, // Step 1
			otpCheck: {
				status: false,
				pin: "",
				error: false,
				number_change: false
			}, // step 1
			active_step: {
				name: "", // anchor name
				step: 0 // step number
			},
			welcome_screen: false,
			stepData: [], // this will store the current showing step, which is selected from data object e.g Shopify_Google []
			selected: "",
			// stepStart:true,
			data: {
				data: [
					{
						message: <p>Enter Your Basic Information</p>, // step data
						stepperMessage: "Basic Information", // stepper Small Message
						API_endpoint: "", // Api End Point is used to check to send data or get data (no use Right Now)
						data: "", // Data additional Field
						method: "GET", // Method Type
						redirectTo: "/panel/configuration", // After Completion Where To Redirect
						anchor: "U-INFO", // Which Function to call e.g : 'U-INFO' then call div which take User basic Information
						stepperActive: false // used in stepper Check either Completed or not and also help in deciding with step to go
					}, // step 1
				]
			}
		};
		this.checkStepCompleted = this.checkStepCompleted.bind(this);
		this.autoFillDetails();
	}

	componentWillReceiveProps(nextPorps) {
		if (nextPorps.necessaryInfo !== undefined) {
			this.setState({ necessaryInfo: nextPorps.necessaryInfo });
		}
	}

	autoFillDetails() {
		requests.getRequest("frontend/app/getShopDetails").then(data => {
			if (data.success) {
				this.state.info.full_name = data.data.full_name;
				this.state.info.email = data.data.email;
				this.state.info.mobile = data.data.mobile;
				this.state.shop_url = data.data.shop_url;
				this.handleFormChange("country_code", data.data.country);
				this.setState(this.state);
			}
		});
	}

	componentDidMount() {
		this.setState({ stepData: this.state.data.data });
		this.checkStepCompleted();
	}

	checkStepCompleted() {
		let path = "/App/User/Step";
		requests
			.getRequest("frontend/app/getStepCompleted", { path: path })
			.then(data => {
				if (data.success) {
					if (data.data !== null && !isUndefined(data.data)) {
						let temp = this.state.stepData;
						let anchor = "";
						let flag = true;
						temp.forEach((keys, index) => {
							if (index < parseInt(data.data)) {
								// if  ( step here < no of step completed )
								keys.stepperActive = true;
							} else if (flag) {
								anchor = keys.anchor;
								flag = false;
							}
						});
						if (flag) {
							this.props.disableHeader(true);
						}
						this.setState({
							data: temp,
							welcome_screen: flag,
							stepStart: !flag,
							active_step: {
								name: anchor,
								step: parseInt(data.data) + 2
							}
						});
					}
				} else {
					if (data.code === "under_maintenance") {
						this.redirect(
							"/show/message?success=success&message=" +
								data.message +
								"&icon=faToolbox"
						);
					}
					// notify.error(data.message);
				}
			});
	} // initially run this to check which step is completed

	changeStep(arg) {
		// arg means step number
		let data = this.state.stepData;
		let path = [];
		path.push("/App/User/Step");
		requests
			.postRequest("frontend/app/stepCompleted", { paths: path, step: arg })
			.then(value => {
				if (value.success) {
					let anchor = "";
					let flag = 0;
					data.forEach((keys, index) => {
						if (index < arg) {
							keys.stepperActive = true;
						} else if (flag === 0) {
							anchor = keys.anchor;
							flag = 1;
						}
					});
					this.setState({
						stepData: data,
						active_step: {
							name: anchor,
							step: arg + 2
						}
					});
					if (arg >= 2) {
						this.props.disableHeader(true);
						setTimeout(() => {
							this.redirect("/panel/accounts");
						}, 500);
					}
				}
			});
	} // change stage just pass the completed step here in arg

	renderStepper() {
		// return null;
		let flag = 1;
		return (
			<div className="container">
				<div className="row bs-wizard" style={{ borderBottom: "0" }}>
					{this.state.stepData.map((data, index) => {
						let css = "disabled "; // when Previous Step is not Completed
						if (data.stepperActive) {
							css = "complete"; // When Step Is completed
						} else if (flag === 1) {
							css = "active"; // which Step Is Active
							flag++;
						}
						return (
							<React.Fragment key={index}>
								<div className={`col-6 bs-wizard-step ${css}`}>
									<div className="text-center bs-wizard-stepnum">
										Step {index + 1}
									</div>
									<div className="progress">
										<div className="progress-bar" />
									</div>
									<a href="javascript:void(0)" className="bs-wizard-dot" />
									<div className="bs-wizard-info text-center">
										{data.stepperMessage}
									</div>
								</div>
							</React.Fragment>
						);
					})}
				</div>
			</div>
		);
	}
	/********************************** MAIN BODY ***************************************/
	renderBody() {
		let flag = 1;
		return Object.keys(this.state.stepData).map(keys => {
			let css = "BG-info"; // Previous step Not Completed
			let status = false; // Used To decide if step is active then show its function body
			if (this.state.stepData[keys].stepperActive) {
				css = "BG-success"; // Completed
			} else if (flag === 1) {
				css = "BG-warn"; // Active
				status = true;
				flag++;
			}
			if (flag !== 1) {
				return (
					<React.Fragment key={keys}>
						<div
							style={
								this.state.stepData[keys].stepperActive
									? { cursor: "pointer" }
									: null
							}
							onClick={
								this.state.stepData[keys].stepperActive
									? this.redirect.bind(
											this,
											this.state.stepData[keys].redirectTo
									  )
									: null
							}
						>
							<div className="row p-4 mt-sm-0 mt-5">
								<div
									className="CARD col-12"
									style={{
										border: `1px solid ${css}`,
										backgroundColor: "#fff"
									}}
								>
									<div className={`CARD-title-small common text-center ${css}`}>
										{this.state.stepData[keys].stepperActive ? (
											<FontAwesomeIcon icon={faCheck} size="5x" />
										) : (
											<h1
												className="mt-2 font-weight-bold"
												style={{ fontSize: 50 }}
											>
												{parseInt(keys) + 1}{" "}
											</h1>
										)}
									</div>
									<div className="CARD-body p-5">
										<div className="col-12 p-3 pl-5">
											<h4>{this.state.stepData[keys].message}</h4>
										</div>
										{this.checkAnchor(this.state.stepData[keys], status)}{" "}
										{/* switch case for deciding the anchor */}
									</div>
								</div>
							</div>
							{this.state.stepData[keys].data !== "" &&
							this.state.stepData[keys].stepperActive ? (
								<div className="col-12 mt-5 p-5 text-center">
									<h4>{this.state.stepData[keys].data}</h4>
								</div>
							) : null}
						</div>
					</React.Fragment>
				);
			}
		});
	}

	checkAnchor(data, status) {
		if (status) {
			switch (data.anchor) {
				case "U-INFO":
					return this.renderGetUserInfo();
				/*case "PRICING_GUIDE":
					return this.renderPricingGuide();*/
				default:
					console.log("This Is default");
			}
		}
	} // decide where to go when step is active

	/****************** step 1 User Information Body Start Here *************************/
	handleSubmit = () => {
		// this function is used to submit user basic info
		if (
			this.state.info.term_and_condition &&
			this.state.info.full_name !== "" &&
			this.state.info.email !== "" &&
			this.state.info.mobile !== ""
		) {


			requests
				.postRequest("core/app/sendOtp", {
					phone: this.state.info.mobile_code + "" + this.state.info.mobile,
					email:	this.state.info.email
				})
				.then(data => {
					if (data.success) {
						this.handleOTPSubmit();
						let otpCheck = this.state.otpCheck;
						otpCheck.status = true;
						otpCheck.number_change = false;
						this.setState({ otpCheck: otpCheck });
						// notify.info(
						// 	"You will shortly receive an OTP on your registered mobile number"
						// );
					} else {
						notify.error(data.message);
					}
				});
		} else {
			let tempData = this.state.info_error;
			if (this.state.info.full_name === "") tempData.full_name = true;
			if (this.state.info.email === "") tempData.email = true;
			if (this.state.info.mobile === "") tempData.mobile = true;
			if (!this.state.info.term_and_condition)
				tempData.term_and_condition = true;
			this.setState({ info_error: tempData });
		}
	};

	handleFormChange = (field, value) => {
		// this function is used to submit user basic info
		let data = this.state.info;
		data[field] = value;
		let tempData = this.state.info_error;
		if (this.state.info[field] !== "" || this.state.info[field])
			tempData[field] = false;
		this.setState({
			info: data,
			info_error: tempData
		});
		if (field === "country_code") {
			let temp;
			json.country_mobile_code.forEach(e => {
				if (e.value === value) {
					temp = e.phone_code;
				}
			});
			this.handleFormChange("mobile_code", temp);
		}
	};









	//-----------OTP wala cdeis here--------------------------------

	handleOTPSubmit = () => {
						let tempInfo = Object.assign({}, this.state.info);
						tempInfo.mobile = tempInfo.mobile_code + "-" + tempInfo.mobile;
						requests.getRequest("core/user/updateuser", tempInfo).then(data => {
							if (data.success) {
								window.fbq("track", "Lead");
								window.gtag("event", "conversion", {
									send_to: "AW-944073096/6IJiCIyK8Y8BEIjTlcID",
									value: 1.0,
									currency: "USD"
								});
								requests.getRequest("shopifygql/setup/shopifydetails").then();
								notify.success(data.message);
								this.changeStep(2);
							} else {
								notify.error(data.message);
							}
						});
	};

	/*handleOTPChange = (arg, value) => {
		if (arg === "resend") {
			this.handleSubmit();
		} else {
			let otpCheck = this.state.otpCheck;
			otpCheck[arg] = value;
			this.setState({ otpCheck: otpCheck });
		}
	};*/





	//-------------------------otp wala code is here===========================

/*(
<div>
<Form onSubmit={this.handleOTPSubmit}>
<FormLayout>
<div className="row">
<div
className={`col-12 offset-0 ${
    this.state.otpCheck.number_change
        ? ""
        : "col-sm-4 offset-sm-4"
    }`}
>
{this.state.otpCheck.number_change ? (
	<div className="row">
		<div className="col-3">
			<Select
				label="Country"
				placeholder="Select"
				options={json.country_mobile_code}
				onChange={this.handleFormChange.bind(
                    this,
                    "country_code"
                )}
				value={this.state.info.country_code}
			/>
		</div>
		<div className="col-2">
			<TextField
				label={"Code"}
				readOnly={true}
				value={this.state.info.mobile_code}
			/>
		</div>
		<div className="col-7">
			<TextField
				value={this.state.info.mobile}
				minLength={5}
				maxLength={14}
				error={
                    this.state.info_error.mobile
                        ? "*Please Enter Detail"
                        : null
                }
				onChange={this.handleFormChange.bind(
                    this,
                    "mobile"
                )}
				helpText={
                    "OTP will be sent on this number for verification."
                }
				label="Phone Number:"
				type="number"
			/>
		</div>
		<div className="col-12 col-md-12 text-left">
            {this.state.info.mobile === "" &&
            this.state.info_error.mobile !== true ? (
				<p className="mt-1" style={{ color: "green" }}>
					*required
				</p>
            ) : null}
		</div>
	</div>
) : (
	<div>
		<Label>Phone number: </Label>
		<Label>
            {this.state.info.mobile_code +
            "" +
            this.state.info.mobile}
		</Label>
		<a
			href="javascript:void(0)"
			onClick={this.handleOTPChange.bind(
                this,
                "number_change",
                true
            )}
		>
			Change Mobile Number
		</a>
		<br />
		<div className="row mt-4">
			<div className="col-12">
				<TextField
					value={this.state.otpCheck.pin}
					minLength={5}
					maxLength={14}
					error={
                        this.state.otpCheck.error
                            ? "*Please Enter Detail"
                            : null
                    }
					onChange={this.handleOTPChange.bind(
                        this,
                        "pin"
                    )}
					label="Enter OTP"
					type="number"
				/>
			</div>
			<div className="col-12">
				<a
					href="javascript:void(0)"
					onClick={this.handleOTPChange.bind(
                        this,
                        "resend"
                    )}
				>
					Resend OTP
				</a>
			</div>
		</div>
	</div>
)}
<div className="mt-4">
<Button
submit
primary
disabled={
    this.state.otpCheck.pin.length <= 3 &&
    !this.state.otpCheck.number_change
}
>
Submit
</Button>
{this.state.otpCheck.number_change ? (
    ""
) : (
	<p>OTP will valid for 5 min</p>
)}
</div>
</div>
</div>
</FormLayout>
</Form>
</div>
)*/



	//-------------------------otp wala code is here===========================


	renderGetUserInfo() {
		return (
			<div className="row">
				<div className="col-12">
					{this.state.otpCheck.status ? null : (
						<Form onSubmit={this.handleSubmit}>
							<FormLayout>
								<div className="row">
									<div className="col-12 col-md-12">
										<TextField
											value={this.state.info.full_name}
											minLength={5}
											onChange={this.handleFormChange.bind(this, "full_name")}
											error={
												this.state.info_error.full_name
													? "*Please Enter Detail"
													: null
											}
											label="Full Name:"
											type="text"
										/>
									</div>
									<div className="col-12 col-md-12 text-left">
										{this.state.info.full_name === "" &&
										this.state.info_error.full_name !== true ? (
											<p className="mt-1" style={{ color: "green" }}>
												*required
											</p>
										) : null}
									</div>
								</div>
								<div className="row">
									<div className="col-sm-3 col-6">
										<Select
											label="Country"
											placeholder="Select"
											options={json.country_mobile_code}
											onChange={this.handleFormChange.bind(
												this,
												"country_code"
											)}
											value={this.state.info.country_code}
										/>
									</div>
									<div className="col-sm-2 col-6">
										<TextField
											label={"Code"}
											readOnly={true}
											value={this.state.info.mobile_code}
										/>
									</div>
									<div className="col-sm-7 col-12">
										<TextField
											value={this.state.info.mobile}
											minLength={5}
											maxLength={14}
											error={
												this.state.info_error.mobile
													? "*Please Enter Detail"
													: null
											}
											onChange={this.handleFormChange.bind(this, "mobile")}
											label="Phone Number:"
											type="number"
											readOnly={false}
										/>
									</div>
									<div className="col-12 col-md-12 text-left">
										{this.state.info.mobile === "" &&
										this.state.info_error.mobile !== true ? (
											<p className="mt-1" style={{ color: "green" }}>
												*required
											</p>
										) : null}
									</div>
								</div>
								{/*<div className="row">*/}
									{/*<div className="col-12 col-md-12">*/}
										{/*<TextField*/}
											{/*value={this.state.info.email}*/}
											{/*minLength={5}*/}
											{/*error={*/}
												{/*this.state.info_error.email*/}
													{/*? "*Please Enter Detail"*/}
													{/*: null*/}
											{/*}*/}
											{/*onChange={this.handleFormChange.bind(this, "email")}*/}
											{/*label="Email:"*/}
											{/*type="email"*/}
										{/*/>*/}
									{/*</div>*/}
									{/*<div className="col-12 col-md-12 text-left">*/}
										{/*{this.state.info.email === "" &&*/}
										{/*this.state.info_error.email !== true ? (*/}
											{/*<p className="mt-1" style={{ color: "green" }}>*/}
												{/**required*/}
											{/*</p>*/}
										{/*) : null}*/}
									{/*</div>*/}
								{/*</div>*/}
								{/*<TextField
									value={this.state.info.skype_id}
									onChange={this.handleFormChange.bind(this, "skype_id")}
									label="Skype ID:"
									type="text"
								/>*/}
								<Select
									label="How did you come across us?"
									placeholder="Select"
									options={[
										{ label: "Shopify App Store", value: "Shopify App Store" },
										{ label: "Google Ads", value: "Google Ads" },
										{ label: "Facebook Ads", value: "Facebook Ads" },
										{ label: "Twitter", value: "Twitter" },
										{ label: "Yahoo", value: "Yahoo" },
										{ label: "Youtube", value: "Youtube" },
										{ label: "Other", value: "Other" }
									]}
									onChange={this.handleFormChange.bind(
										this,
										"how_u_know_about_us"
									)}
									value={this.state.info.how_u_know_about_us}
								/>
								{this.state.info.how_u_know_about_us === "Other" ? (
									<TextField
										value={this.state.info.Other_text}
										onChange={this.handleFormChange.bind(this, "Other_text")}
										label="Kindly Mention your Source"
										type="text"
									/>
								) : null}
								<div
									className="form-control"
									style={{ height: "180px", width: "100%", overflow: "auto" }}
								>
									<h3>CedCommerce Terms & Condition and Privacy Policy</h3>
									<br />
									<br />
									<br />
									{term_and_condition()}
								</div>
								<Checkbox
									checked={this.state.info.term_and_condition}
									label="Accept Terms & Conditions"
									error={
										this.state.info_error.term_and_condition
											? "Please Accept Terms & Conditions"
											: ""
									}
									onChange={this.handleFormChange.bind(
										this,
										"term_and_condition"
									)}
								/>
								<Button submit primary>
									Submit
								</Button>
							</FormLayout>
						</Form>
					)}
				</div>
			</div>
		);
	}

	/***************************** Step 2 Pricing Plan *************************************************/

	handlePricingSubmit = () => {
		this.changeStep(2);
	};

	/*renderPricingGuide = () => {
		return (
			<React.Fragment>
				<div className="pt-5 pb-5">
					<PricingGuide />
				</div>
				<div className="p-5 mt-5">
					<Button onClick={this.handlePricingSubmit} primary>
                        Next
					</Button>
				</div>
			</React.Fragment>
		);
	};*/

	/************************************  Render()   ***********************************/
	render() {
		return (

			<Page

				fullWidth={true}
				title={this.state.stepStart ? "Registration" : "Dashboard"}
				subtitle={<Badge status="success">{this.state.shop_url}</Badge>}
			>


				<div className="p-2"></div>
				{this.state.welcome_screen ? (
					<div>
						<AnalyticsReporting history={this.props.history} />
					</div>
				) : this.state.stepStart ? (
					<Stack vertical={true}>
						{/*<Card>{this.renderStepper()}</Card>*/}  {/*Stepper*/}
						{this.renderBody()}  {/*Main Body Function Call Here*/}
						 {/*Open For Step 3 to see Connected Account*/}
					</Stack>
				) : (
					<div>
						<Card>
							<div>
								<img
									src={require("../../../assets/background/welcome_screen.png")}
									style={{ height: "100%", width: "100%" }}
								/>
							</div>
						</Card>
					</div>
				)}

				</Page>
		);
	}

	redirect(url) {
		this.props.history.push(url);
	}

	updateState() {
		const state = this.state;
		this.setState(state);
	}
}

export default Dashboard;
