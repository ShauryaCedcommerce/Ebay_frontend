import React, { Component } from "react";
import { Page } from "@shopify/polaris";

import "./dashboard.css";
import PricingGuide from "../../../../shared/pricing_guide";

class Guide extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<Page
				title={"Guide"}
				primaryAction={{
					content: "back",
					onClick: () => {
						this.redirect("/panel/dashboard");
					}
				}}
			>
				<PricingGuide />
			</Page>
		);
	}

	redirect = url => {
		this.props.history.push(url);
	};
}

export default Guide;
