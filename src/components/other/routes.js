import MessageShow from "./message";
import { Route, Switch, Redirect } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import { AppProvider } from "@shopify/polaris";
import React, { Component } from "react";
import PrivatePolicy from "./private_policy";
import Progress from "./progress";

class OthersRoutes extends Component {
	render() {
		return (
			<Switch>
				<Route
					exact
					path="/show/"
					render={() => <Redirect to="/show/progress" />}
				/>
				<Route exact path="/show/message" component={MessageShow} />
				<Route exact path="/show/policy" component={PrivatePolicy} />
				<Route exact path="/show/progress" component={Progress} />
				<Route
					exact
					path="**"
					render={() => <Redirect to="/show/progress" />}
				/>
			</Switch>
		);
	}
}

export default OthersRoutes;
