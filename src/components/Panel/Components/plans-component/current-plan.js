import React, { Component } from "react";
import {
	Page,
	Card,
	Button,
	Label,
	ProgressBar,
	DisplayText
} from "@shopify/polaris";
import { faQuoteLeft, faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { displayArray } from "./current-plan-func";
import { requests } from "../../../../services/request";
import { notify } from "../../../../services/notify";
import "./plan.css";

const grayColor = "#999999";
class CurrentPlan extends Component {
	constructor(props) {
		super(props);
		this.state = {
			description: (
				<React.Fragment>
					<h3>No Active Plan</h3>
					<h4>Please Choose A Plan</h4>
				</React.Fragment>
			),
			card: [],
			card_service: [],
			available_credits: 0,
			used_credits: 1
		};
		this.getCreditsSettings();
	}

	getCreditsSettings() {
		requests.getRequest("shopifygql/payment/getCreditsSettings").then(data => {
			if (data.success) {
				this.state.available_credits = data["data"]["available_credits"];
				this.state.used_credits = data["data"]["used_credits"];
				this.setState(this.state);
			}
		});
	}

	componentWillMount() {
		requests.getRequest("plan/plan/getActive").then(data => {
			if (data.success) {
				const state = displayArray(data.data);
				this.setState(state);
			}
		});
	}
	render() {
		return (
			<Page
				primaryAction={{
					content: "Back",
					onClick: () => {
						this.redirect("/panel/plans");
					}
				}}
				title="Current Plan"
			>
				<Card>
					<div className="container">
						<div className="row p-4 p-sm-5">
							<div className="col-12">
								<div className="row">
									<div className="col-3 d-md-block d-sm-none">
										<hr />
									</div>
									<div className="col-md-6 col-sm-12 col-12 text-center">
										<DisplayText element="h3">Available Credits</DisplayText>
									</div>
									<div className="col-3 d-md-block d-sm-none">
										<hr />
									</div>
								</div>
							</div>
							<div className="col-12">
								<div className="row">
									<div className="col-12">
										<Label>
											Product Upload Credits -:{" "}
											<b>{this.state.available_credits}</b>
										</Label>
									</div>
									<div className="col-12">
										<ProgressBar
											size="large"
											progress={
												(this.state.available_credits /
													(this.state.available_credits +
														this.state.used_credits)) *
												100
											}
										/>
									</div>
								</div>
								{/*<div className="col-12 p-3 text-center">
									<Button
										className="d-block"
										onClick={this.redirect.bind(this, "/panel/plans")}
									>
                                        {this.state.card.length > 0
                                            ? "Upgrade Plan"
                                            : "Choose a Plan"}
									</Button>
								</div>*/}
							</div>
							<div className="col-12 mb-5">
								<div className="row">
									<div className="col-3 d-md-block d-sm-none">
										<hr />
									</div>
									<div className="col-md-6 col-sm-12 col-12 pt-3 text-center">
										<DisplayText element="h3">Active Plan</DisplayText>
									</div>
									<div className="col-3 d-md-block d-sm-none">
										<hr />
									</div>
								</div>
							</div>
							{this.state.card.map((keys, index) => {
								{
									/*LVL1*/
								}
								let col = "col-12 col-sm-6 mb-5";
								if (this.state.card.length % 2 === 1) {
									if (index + 1 === this.state.card.length) {
										col = "col-12 col-sm-6 mb-5";
									}
								}
								return (
									<div className={col} key={index}>
										<div className="">
											<div className="CARD mt-5">
												<div className="CARD-title-small text-center BG-primary">
													{keys.icon}
												</div>
												<div className="CARD-body p-5">
													<h2>{keys.text}</h2>
													<h6>{keys.text_info}</h6>
												</div>
											</div>
										</div>
									</div>
								);
							})}

							{/*<div className="col-12 mt-5">
								<div className="row">
									<div className="col-12 col-sm-2 text-center text-sm-left">
										<FontAwesomeIcon
											icon={faQuoteLeft}
											size="3x"
											color={grayColor}
										/>
									</div>
									<div className="col-12 col-sm-8 text-center">
										<span style={{ fontSize: "20px", color: "#999999" }}>
											{this.state.description}
										</span>
									</div>
									<div className="col-12 col-sm-2 text-center text-sm-right">
										<FontAwesomeIcon
											icon={faQuoteRight}
											size="3x"
											color={grayColor}
										/>
									</div>
								</div>
							</div>*/}
							{/*<div className="col-12 mt-5 mb-5">
								<hr />
							</div>
							<div className="col-12 mb-5 pb-5 pt-0">
								<h2>
									{this.state.card_service.length > 0 ? "My Services" : ""}
								</h2>
								Tittle
							</div>*/}
						{/*	{this.state.card_service.map((key, titleIndex) => {
								return (
									<React.Fragment key={titleIndex}>
										<div className="col-12 mb-5">
											<div className="CARD mt-5">
												<div className="CARD-title-small common text-center BG-warn">
													{key.icon}
												</div>
												<div className="CARD-body p-5">
													<h2>{key.text}</h2>
													<h6>{key.text_info}</h6>
												</div>
											</div>
										</div>
									</React.Fragment>
								);
							})}*/}
						</div>
					</div>
				</Card>
			</Page>
		);
	}
	redirect(url) {
		this.props.history.push(url);
	}
}

export default CurrentPlan;
