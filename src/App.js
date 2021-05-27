import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import { AppProvider, Loading } from "@shopify/polaris";

import { Auth } from "./components/Auth/auth";
import { Panel } from "./components/Panel/panel";
import { PageLoader } from "./shared/loader";
import OthersRoutes from "./components/other/routes";
import { globalState } from "./services/globalstate";
import { environment } from "./environments/environment";
import { isUndefined } from "util";

export class App extends Component {
	state = {
		showLoader: false,
		shopOrigin: "",
		hide_offer: true
	};
	constructor(props) {
		super(props);
		this.checkLoader();
		setTimeout(() => {
			this.getShopOrigin();
		}, 400);
	}

	getShopOrigin() {
		if (globalState.getLocalStorage("shop") !== null) {
			if (!this.inFrame()) {
				this.state.shopOrigin = globalState.getLocalStorage("shop");
				globalState.removeLocalStorage("shop");
				this.setState(this.state);
			}
		}
	}

	inFrame() {
		try {
			return window.self !== window.top;
		} catch (e) {
			return true;
		}
	}

	checkLoader() {
		setInterval(() => {
			if (
				this.state.showLoader !== window.showLoader &&
				!isUndefined(window.showLoader)
			) {
				this.state.showLoader = window.showLoader;
				const state = this.state;
				this.setState(state);
			}
		}, 50);
	}

	renderApp() {
		return (
			<div>
				{this.state.showLoader && (
					<PageLoader height="100" width="100" type="Watch" color="#3f4eae">
						{" "}
					</PageLoader>
				)}
				{/*{this.state.hide_offer && <div style={{'position':'fixed','bottom':'10px','left':'10px',zIndex:'999998'}}>*/}
				{/*<div className="text-right">*/}
				{/*<h1 style={{zIndex:'999999'}} onClick={() => {this.setState({hide_offer: false})}}>❎</h1>*/}
				{/*</div>*/}
				{/*<a href={"https://apps.cedcommerce.com/offers/"} target="_blank">*/}
				{/*<img src={require('./assets/img/christmas_image.png')} width={"150"}/>*/}
				{/*</a>*/}
				{/*</div>}*/}
				<Switch>
					<Route exact path="/" render={() => <Redirect to="/auth" />} />
					<Route path="/auth" component={Auth} />
					<Route
						path="/panel"
						render={() => {
							// return globalState.getLocalStorage('user_authenticated') === 'true' ? <Panel/> : <Redirect to="/auth"/>
							return <Route path="/panel" component={Panel} />;
						}}
					/>
					<Route
						path="/show"
						render={() => {
							// return globalState.getLocalStorage('user_authenticated') === 'true' ? <Panel/> : <Redirect to="/auth"/>
							return <Route path="/show" component={OthersRoutes} />;
						}}
					/>
					<Route path="**" render={() => <Redirect to="/auth" />} />
				</Switch>
			</div>
		);
	}

    verifyCompatibilityofBrowser(){

        var nVer = navigator.appVersion;
        var nAgt = navigator.userAgent;
        var browserName = navigator.appName;
        var fullVersion = ''+parseFloat(navigator.appVersion);
        var majorVersion = parseInt(navigator.appVersion,10);
        var nameOffset,verOffset,ix;

// In Opera 15+, the true version is after "OPR/"
        if ((verOffset=nAgt.indexOf("OPR/"))!=-1) {
            browserName = "Opera";
            fullVersion = nAgt.substring(verOffset+4);
        }
// In older Opera, the true version is after "Opera" or after "Version"
        else if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
            browserName = "Opera";
            fullVersion = nAgt.substring(verOffset+6);
            if ((verOffset=nAgt.indexOf("Version"))!=-1)
                fullVersion = nAgt.substring(verOffset+8);
        }
// In MSIE, the true version is after "MSIE" in userAgent
        else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
            browserName = "Microsoft Internet Explorer";
            fullVersion = nAgt.substring(verOffset+5);
        }
// In Chrome, the true version is after "Chrome"
        else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
            browserName = "Chrome";
            fullVersion = nAgt.substring(verOffset+7);
        }
// In Safari, the true version is after "Safari" or after "Version"
        else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
            browserName = "Safari";
            fullVersion = nAgt.substring(verOffset+7);
            if ((verOffset=nAgt.indexOf("Version"))!=-1)
                fullVersion = nAgt.substring(verOffset+8);
        }
// In Firefox, the true version is after "Firefox"
        else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
            browserName = "Firefox";
            fullVersion = nAgt.substring(verOffset+8);
        }
// In most other browsers, "name/version" is at the end of userAgent
        else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
            (verOffset=nAgt.lastIndexOf('/')) )
        {
            browserName = nAgt.substring(nameOffset,verOffset);
            fullVersion = nAgt.substring(verOffset+1);
            if (browserName.toLowerCase()==browserName.toUpperCase()) {
                browserName = navigator.appName;
            }
        }
// trim the fullVersion string at semicolon/space if present
        if ((ix=fullVersion.indexOf(";"))!=-1)
            fullVersion=fullVersion.substring(0,ix);
        if ((ix=fullVersion.indexOf(" "))!=-1)
            fullVersion=fullVersion.substring(0,ix);

        majorVersion = parseInt(''+fullVersion,10);
        if (isNaN(majorVersion)) {
            fullVersion = ''+parseFloat(navigator.appVersion);
            majorVersion = parseInt(navigator.appVersion,10);
        }
       /* let compatible=true;
        console.log(browserName)
        switch (browserName) {
            case 'Firefox':
                if(majorVersion<67){
                    compatible=false;
                }
                break;
            case 'Opera':
                if(majorVersion<60){
                    compatible=false;
                }
                break;
            case 'Chrome':
                if(majorVersion<74){
                    compatible=false;
                }
                break;
            case 'Safari':
                if(majorVersion<12){
                    compatible=false;
                }
                break;
        }*/

        return browserName;

    }

	render() {
		var browser = this.verifyCompatibilityofBrowser();
		const loadingMarkup = this.state.showLoader && <Loading />;
		// console.log(this.state.shopOrigin)
		if (this.state.shopOrigin !== "") {
			if (browser == "Firefox"){
                return (
					<AppProvider
						 // apiKey={environment.APP_API_KEY}
						 // shopOrigin={this.state.shopOrigin}
						 // forceRedirect={true}
					>
                        {/*{loadingMarkup}*/}
                        {this.renderApp()}
					</AppProvider>
                );
			}else {
                return (
					<AppProvider
						// apiKey={environment.APP_API_KEY}
						// shopOrigin={this.state.shopOrigin}
						 //forceRedirect={true}
					>
                        {loadingMarkup}
                        {this.renderApp()}
					</AppProvider>
                );
			}

		} else {
			return <AppProvider>{this.renderApp()}</AppProvider>;
		}
	}
}
