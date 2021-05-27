import React, { Component } from "react";

import {
	Page,
	TextStyle,
	Button,
	ResourceList,
	Card,
	ProgressBar,
	Label,
	Banner,
	Modal,
	Stack,
	FormLayout
} from "@shopify/polaris";

import { requests } from "../../../services/request";
import { notify } from "../../../services/notify";

import "./circle.css";
import {environment} from "../../../environments/environment";
let intervalRunning;
export class QueuedTask extends Component {
	constructor(props) {
		super(props);
		this.state = {
			queuedTasks: [],
			totalQueuedTasks: 0,
			recentActivities: [],
			totalRecentActivities: 0,
			modalOpen: false,
			isAlreadyActive: true
		};
		this.getAllNotifications();
		this.getAllQueuedTasks();
		intervalRunning = setInterval(() => {
			const activeUrl = this.props.history.location.pathname;
			if (activeUrl === "/panel/queuedtasks") {
				this.getAllNotifications();
				this.getAllQueuedTasks();
			}
		}, 3000);
	}
	componentWillUnmount() {
		clearInterval(intervalRunning);
	}
	getAllQueuedTasks() {
		requests
			.getRequest("connector/get/allQueuedTasks", {}, false, true)
			.then(data => {
				if (data.success) {
					this.state.queuedTasks = this.modifyQueuedTaskData(data.data.rows);
					this.state.totalQueuedTasks = data.data.count;
					this.updateState();
				}
			});
	}

	modifyQueuedTaskData(data) {
		for (let i = 0; i < data.length; i++) {
			data[i].progress = Math.ceil(data[i].progress);
		}
		return data;
	}

	getAllNotifications() {
		requests
			.getRequest(
				"connector/get/allNotifications",
				{ count: 3, activePage: 0 },
				false,
				true
			)
			.then(data => {
				if (data.success) {
					this.state.recentActivities = data.data.rows;
					this.state.totalRecentActivities = data.data.count;
					this.updateState();
				}
			});
	}
	handleClearAllActivity = () => {
		requests.getRequest("/connector/get/clearNotifications").then(data => {
			if (data.success) {
				notify.success(data.message);
			} else {
				notify.error(data.message);
			}
		});
	};

    manageTheCreatedAtTime(time) {
        // create Date object for current location
        let offsetTime = -4;

        if ( !environment.isLive ) {
            offsetTime = 5.5;
		}

        let serverTimeThen = new Date(time);
        let localTimeNow = new Date();
        // convert to msec
        // add local time zone offset
        // get UTC time in msec
        let localUTC = localTimeNow.getTime() + (localTimeNow.getTimezoneOffset() * 60000);
        // create new Date object for different city
        // using supplied offset
        let serverTimeNow = new Date(localUTC + (3600000*(offsetTime)));
        if ( serverTimeThen.getMonth() === serverTimeNow.getMonth()
			&&  serverTimeThen.getDate() ===  serverTimeNow.getDate()
			&& serverTimeThen.getHours() ===  serverTimeNow.getHours()
			&& serverTimeThen.getMinutes() ===  serverTimeNow.getMinutes()
		) {
        	let SecRem = serverTimeThen.getSeconds() -  serverTimeNow.getSeconds();
        	if ( SecRem < 20 ) return 'Just Now';
        	let minRem = serverTimeThen.getMinutes() - serverTimeNow.getMinutes();
            return minRem > 0 ? minRem + ' min ago' : SecRem > 0 ? SecRem + ' sec ago' : time;
		}
        return time;
    }

	render() {
		return (
			<Page title="Queued Tasks">
				<Card title="Recent Activities" sectioned>
					{this.state.recentActivities.map(activity => {
						if (activity.message == "Failed to import from Ebay. Account Not Found or No Active Product !!"){
							return (
								<Banner
									status={activity.severity}
									title={activity.message}
									key={this.state.recentActivities.indexOf(activity)}
								>
									<Stack distribution="trailing" spacing="extraLoose" alignment="center">
										<div style={{color: '#bf0711'}}>
											Want Ebay Dropshipping?{' '}
											<Button plain
													onClick={() => {
                                                        this.redirect("/panel/accounts");
                                                    }}
											>
												Click Here
											</Button>
										</div>
										<Label id={123}>
                                            {this.manageTheCreatedAtTime(activity.created_at)}
										</Label>
									</Stack>
								</Banner>

                            );
                        }
                        else {
                            return (
								<Banner
									status={activity.severity}
									title={activity.message}
									key={this.state.recentActivities.indexOf(activity)}
								>
									<Stack distribution="trailing" spacing="extraLoose" alignment="center">
                                        {activity.url !== null ? (
											<a href={activity.url} target={"_blank"}>
												View Report
											</a>
                                        ) : (
                                            null
                                        )}
										<Label id={123}>
                                            {this.manageTheCreatedAtTime(activity.created_at)}
										</Label>
									</Stack>
								</Banner>
                            );
						}
					})}
					{this.state.recentActivities.length === 0 && (
						<Banner status="info">
							<Label>No Recent Activities</Label>
						</Banner>
					)}
					{this.state.totalRecentActivities > 3 && (
						<div className="col-12 pb-0 pl-5 pr-5 pt-5 text-right">
							<span className="pr-4">
								<Button onClick={this.handleClearAllActivity}>
									Clear All Activities
								</Button>
							</span>
							<Button
								onClick={() => {
									this.redirect("/panel/queuedtasks/activities");
								}}
								primary
							>
								View All Activities
							</Button>
						</div>
					)}
				</Card>
				<Card title="Currently Running Processes" sectioned>
						{this.state.queuedTasks.length === 0 && (
							<Banner status="info">
								<Label>All Processes Completed</Label>
							</Banner>
						)}
						{this.state.queuedTasks.length > 0 && (
						<ResourceList
							resourceName={{ singular: "customer", plural: "customers" }}
							items={this.state.queuedTasks}
							renderItem={item => {
								const { id, message, progress } = item;
								const progressClass =
									"c100 p" + progress + " small polaris-green";
								return (
									<ResourceList.Item id={id} accessibilityLabel={message}>
										<FormLayout>
                                            <div className={progressClass}>
                                                <span>{progress}%</span>
                                                <div className="slice">
                                                    <div className="bar" />
                                                    <div className="fill" />
                                                </div>
                                            </div>
                                            <Stack vertical distribution="fill">
												<TextStyle variation="strong">
													{message}
												</TextStyle>
												<ProgressBar progress={progress} />
											</Stack>
										</FormLayout>
									</ResourceList.Item>
								);
							}}
						/>
					)}
				</Card>
				<Modal
					onClose={() => {
						this.setState({ modalOpen: false });
					}}
					open={this.state.modalOpen}
					primaryAction={{
						content: "Yes",
						onClick: () => {
							this.redirect("/panel/plans");
						}
					}}
					secondaryActions={{
						content: "Cancel",
						onClick: () => {
							this.setState({ modalOpen: false });
						}
					}}
					title={"Buy A Plan"}
				>
					<Modal.Section>
						<div className="text-center">
							<Label>During Trial Period You Can Only Upload 10 Product.</Label>
						</div>
					</Modal.Section>
				</Modal>
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

