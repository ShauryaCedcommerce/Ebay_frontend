import React, { Component } from "react";

import { notify } from "../../../../services/notify";

import * as queryString from "query-string";
import { isUndefined } from "util";

export class AppInstalled extends Component {
	queryParams = {};
	constructor(props) {
		super(props);
		this.queryParams = queryString.parse(props.location.search);
		this.showInstallationMessage(props);
	}

	showInstallationMessage(props) {
		if (!isUndefined(this.queryParams["message"])) {
			notify.success("App installed successfully");
			setTimeout(() => {
				window.close();
			}, 3000);
		} else {
			props.history.push("/panel/products");
		}
	}

	render() {
		return <h1 />;
	}
}
