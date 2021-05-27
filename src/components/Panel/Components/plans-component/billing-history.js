import React, { Component } from "react";
import { Page, Card, Button, DataTable, EmptyState } from "@shopify/polaris";
import "./plan.css";
import { requests } from "../../../../services/request";
import { notify } from "../../../../services/notify";

class BillingHistory extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			open_plan: false,
			data: [],
			data_secondary: [],
			data_plan: [
				["28 march 2018 1:59 PM", "Starter Plan", "$99", "28", "Active"],
				["12 sept 2018 4:48", "Advance Plan", "$199", "28", "Expire"],
				["28 march 2018 1:59 PM", "Starter Plan", "$99", "28", "Expire"],
				["12 sept 2018 4:48", "Advance Plan", "$199", "28", "Expire"]
			]
		};
		this.handleToggleClick = this.handleToggleClick.bind(this);
		this.preparedata();
	}
	preparedata() {
		let mainarr = [];
		requests.getRequest("frontend/app/getTransactionLog").then(data => {
			if (data.success) {
				mainarr = [];
				data.data.forEach(key => {
					let arr = [];
					arr.push(key["created_at"]);
					arr.push(key["description"]);
					arr.push(key["payment"]);
					arr.push("$ " + key["amount"]);
					mainarr.push(arr);
				});
				this.setState({
					data: mainarr.slice(0, 4),
					data_secondary: mainarr.slice(4, mainarr.length)
				});
			} else {
				notify.error("Something Went Wrong");
			}
		});
	}

	handleToggleClick() {
		this.setState({ open: !this.state.open });
		const value = this.state.data_secondary;
		setTimeout(() => {
			let data = this.state.data;
			if (this.state.open) {
				value.forEach(e => data.push(e));
			} else {
				data.splice(4, data.length);
			}
			this.setState({ data: data });
		});
	}
	render() {
		return (
			<Page
				title="Billing History"
				primaryAction={{
					content: "Back",
					onClick: () => {
						this.redirect("/panel/plans");
					}
				}}
			>
				<Card title="Billing History">
					<div className="p-5">
						<DataTable
							columnContentTypes={["text", "text", "text", "numeric"]}
							headings={["Date", "Detail", "Payment status", "Price"]}
							rows={this.state.data}
						/>
						{this.state.data.length == 0 ? (
							<img
								className="w-100"
								style={{ height: 300 }}
								src="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
							/>
						) : null}
						<div className={"mt-5"}>
							{this.state.data_secondary.length != 0 ? (
								<Button
									className="pl-0"
									primary={true}
									onClick={this.handleToggleClick}
								>
									{!this.state.open ? "Show More History" : "Show Less History"}
								</Button>
							) : null}
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

export default BillingHistory;
