import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import { Signup } from "./Components/signup";
import { Login } from "./Components/login";
import ForgetPasswordPage from "./Components/forget-password";
import ResetPassword from "./Components/resetpassword";
import ConfirmationPage from "./Components/confirmation";
import * as queryString from "query-string";
import { isUndefined } from "util";
import { environment } from "../../environments/environment";
import { globalState } from "../../services/globalstate";

export class Auth extends Component {
	constructor() {
		super();
		this.state = {failedMessage:""}
		this.removeLocalStorage();
	}

	removeLocalStorage() {
        console.log("Checking for Session",sessionStorage);
        try {
            if ( sessionStorage && sessionStorage.getItem ) {
                globalState.removeLocalStorage("user_authenticated");
                globalState.removeLocalStorage("auth_token");
                globalState.removeLocalStorage("activePlan");
            } else {
                this.setState({failedMessage:"Kindly Enable Third Party Cookies. And Refresh the Page"});
                console.log("session not found");
            }
        } catch (e) {
            this.setState({failedMessage:"Kindly Enable Third Party Cookies.  And Refresh the Page"});
            console.log(e);
        }
	}
	componentWillMount() {
		const params = queryString.parse(this.props.location.search);
		if (!isUndefined(params.hmac) && !isUndefined(params.shop)) {
			let url = environment.API_ENDPOINT + "shopify/site/login?";
			let end = "";
			for (let i = 0; i < Object.keys(params).length; i++) {
				const key = Object.keys(params)[i];
				url += end + key + "=" + params[key];
				end = "&";
			}
			window.location = url;
		}
	}
	render() {
		return (
			<div className="container-fluid">
				<Switch>
					<Route
						exact
						path="/auth/"
						render={() => <Redirect to="/auth/login" />}
					/>
					<Route path="/auth/login" component={Login} />
					<Route path="/auth/signup" component={Signup} />
					<Route path="/auth/forget" component={ForgetPasswordPage} />
					<Route path="/auth/confirmation" component={ConfirmationPage} />
					<Route path="/auth/resetpassword" component={ResetPassword} />
				</Switch>
				{this.state.failedMessage}
			</div>
		);
	}
}
