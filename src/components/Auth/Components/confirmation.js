import React, { Component } from "react";
import * as queryString from "query-string";
import { notify } from "../../../services/notify";
import { requests } from "../../../services/request";

class ConfirmationPage extends Component {
	componentWillMount() {
		const queryParams = queryString.parse(this.props.location.search);
		if (queryParams.token != null) {
			requests
				.getRequest("user/verifyuser", { token: queryParams["token"] })
				.then(data => {
					if (data.success == true) {
						notify.success("User Registered Successfully");
						notify.success("Redirecting to Login");
						this.redirect("/auth");
					} else {
						notify.error("User Registration Failed");
						this.redirect("/auth");
					}
				});
		} else {
			notify.error("Unauthorized Access");
			this.redirect("/auth");
		}
	}
	redirect(url) {
		this.props.history.push(url);
	}
	render() {
		return <div />;
	}
}

export default ConfirmationPage;
