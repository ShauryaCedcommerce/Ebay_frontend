import React, { Component } from "react";

import {
	Page,
	TextStyle,
	Button,
	ResourceList,
	Card,
	Avatar,
	Label,
	Banner
} from "@shopify/polaris";

import { requests } from "../../../../services/request";
import { notify } from "../../../../services/notify";

export class Activities extends Component {
	constructor() {
		super();
		this.state = {
			activities: [],
			totalActivities: 0
		};
		this.getAllNotifications();
	}

	getAllNotifications() {
		requests.getRequest("connector/get/allNotifications").then(data => {
			if (data.success) {
				this.state.activities = data.data.rows;
				this.state.totalActivities = data.data.count;
				this.updateState();
			} else {
				notify.error(data.message);
			}
		});
	}
	handleClearAllActivity = () => {
		requests.getRequest("/connector/get/clearNotifications").then(data => {
			if (data.success) {
				notify.success(data.message);
				this.redirect("/panel/queuedtasks");
			} else {
				notify.error(data.message);
			}
		});
	};
	render() {
		return (
			<Page
				primaryAction={{
					content: "Back",
					onClick: () => {
						this.redirect("/panel/queuedtasks");
					}
				}}
				title="Activities"
			>
				<div className="row">
					<div className="col-12">
						<Card
							secondaryFooterAction={{
								content: "Clear All Activity",
								onClick: () => {
									this.handleClearAllActivity();
								}
							}}
						>
							<div className="w-100 p-3">
								<Banner>
									<Label>
										{"Last " + this.state.totalActivities + " activities"}
									</Label>
								</Banner>
							</div>
						</Card>
					</div>
				</div>
				<ResourceList
					showHeader={false}
					items={this.state.activities}
					renderItem={item => {
						return (
							<ResourceList.Item id={item.id} accessibilityLabel={item.message}>
								<Banner status={item.severity}>
									<div className="row p-3">
										<div className="col-12">
											<h5>
												<TextStyle variation="strong">{item.message}</TextStyle>
											</h5>
										</div>
										<div className="col-12">
											{item.url !== null ? (
												<a href={item.url} target={"_blank"}>
													View Report
												</a>
											) : (
												""
											)}
										</div>
										<div className="col-12">
											<div>{item.created_at}</div>
										</div>
									</div>
								</Banner>
							</ResourceList.Item>
						);
					}}
				/>
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
