import React, { Component } from "react";
import { Page, Card, Banner, Label } from "@shopify/polaris";
import { requests } from "../../../../services/request";
import { notify } from "../../../../services/notify";

class ConnectedAccounts extends Component {
	constructor(props) {
		super(props);
		this.state = {
			apps: []
		};
	}
	componentWillMount() {
		requests.getRequest("connector/get/all").then(data => {
			if (data.success) {
				let installedApps = [];
				let shopName = [];
				for (let i = 0; i < Object.keys(data.data).length; i++) {
					if (data.data[Object.keys(data.data)[i]].installed === 1) {
						if (data.data[Object.keys(data.data)[i]].code !== "google")
							shopName.push(data.data[Object.keys(data.data)[i]]);
					}
				}
				requests
					.postRequest("frontend/app/getInstalledConnectorDetails", shopName)
					.then(DATA => {
						if (DATA.success) {
							this.setState({
								apps: DATA.data
							});
						} else {
							notify.error(data.message);
						}
					});
			} else {
				notify.error(data.message);
			}
		});
	}
	render() {
		return (
			<Page
				title="Accounts"
				primaryAction={{
					content: "Back",
					onClick: () => {
						this.redirect("/panel/accounts");
					}
				}}
			>
				{this.state.apps.map(app => {
					return (
						<Card title={app.title} key={this.state.apps.indexOf(app)}>
							<div className="p-5">
								<img src={app.image} alt={app.title} height={"100px"} />
								{app.shops.map((keys, index) => {
									return (
										<Banner status="info" icon="checkmark" key={index}>
											<Label id={123}>{keys.shop_url}</Label>
										</Banner>
									);
								})}
							</div>
						</Card>
					);
				})}
			</Page>
		);
	}
	redirect(url) {
		this.props.history.push(url);
	}
}

export default ConnectedAccounts;
