import React, { Component } from "react";
import "./plans-component/plan.css";
import { requests } from "../../../services/request";
import { notify } from "../../../services/notify";
import { Page, Button } from "@shopify/polaris";
import PlanBody from "../../../shared/plans/plan-body";
import { globalState } from "../../../services/globalstate";
export class Plans extends Component {
	constructor(props) {
		super(props);
        this.state = {
            necessaryInfo:{},
			button_press_upgarde:false,
            sync_plan_checkbox:false,
		};
	}
    /*getProps(nextPorps) {
        console.log("in plan",nextPorps);
        if (nextPorps.necessaryInfo !== undefined) {
            this.setState({ necessaryInfo: nextPorps.necessaryInfo });
        }
    }*/

    componentWillReceiveProps(nextPorps) {
        if (nextPorps.necessaryInfo !== undefined) {
            this.setState({ necessaryInfo: nextPorps.necessaryInfo });
            if (this.state.necessaryInfo) {
                if (this.state.necessaryInfo.credits) {
                    let available_credits = this.state.necessaryInfo.credits.available_credits;
                    // console.log("available credits",available_credits);
                    let used_credits = this.state.necessaryInfo.credits.total_used_credits;
                    let total_credits = available_credits + used_credits;
                    // console.log("used credits",used_credits);
                    // console.log("total credits",total_credits);
                    if (total_credits > 10) {
                        // console.log("1")
                        this.setState({
                            sync_plan_checkbox: true
                        })
                    }
                    // console.log("import count",this.state.necessaryInfo.import_count);
                    // console.log("upload count",this.state.necessaryInfo.upload_count);
                    if (this.state.necessaryInfo.import_count === this.state.necessaryInfo.upload_count &&
                        this.state.necessaryInfo.import_count !== 0 && this.state.necessaryInfo.upload_count !==0) {
                        // console.log("2")
                        this.setState({
                            sync_plan_checkbox: true
                        })
                    }
					/*  if (used_credits > 0) {
					 // console.log("3")
					 this.setState({
					 show_banner_onetime_payment: true
					 })
					 }*/

                    if (this.state.necessaryInfo.import_count <= 10 && total_credits < 10) {
                        // console.log("4")
                        this.setState({
                            sync_plan_checkbox: true
                        })
                    }
                    if (this.state.necessaryInfo.upload_count > 10 ){
                        // console.log("5")
                        this.setState({
                            sync_plan_checkbox: true
                        })
                    }
                }

            }
        }
    }

	paymentStatus(event) {
		if (event === "Confirmation") {
			// this.setState({modalOpen: !this.state.modalOpen});
		} else if (event === "trial") {
			requests.getRequest("amazonimporter/config/activateTrial").then(data => {
				if (data.success) {
					if (data.code === "UNDER_TRIAL") {
						notify.success(data.message);
					} else {
						notify.info(data.message);
					}
				} else {
					notify.error(data.message);
				}
			});
		} else {
			notify.info(event);
		}
	}
	componentWillUnmount() {
		// if ( globalState.getLocalStorage('trial') ) {
		//     requests.getRequest('plan/plan/getActive').then(status => {
		//         if ( status.success ) {
		//             globalState.removeLocalStorage('trial');
		//         }
		//     });
		// }
	}
	showPlanSectionUpgardePlan(){
		this.setState({
            button_press_upgarde:true
		})
        window.scrollBy(0,3000);
	}
	render() {
		return (
			<Page
				fullWidth
				title="Plans"
				primaryAction={{
					content: "Billing History",
					onClick: () => {
						this.redirect("/panel/plans/history");
					}
				}}
			>
				<div className="row">
					{/*<div className="col-12">*/}
						{/*<marquee class="marq"direction="left"bgcolor="DodgerBlue">*/}
							{/*<b>This is a sample scrolling text that has scrolls texts to left.</b>*/}
						{/*</marquee>*/}
					{/*</div>*/}
					{this.state.sync_plan_checkbox?<div className="col-12 text-center m-4">
						{" "}
						{/*tittle*/}
						<span style={{ fontSize: "20px" }}>
							<b>Choose the best offer</b>
						</span>
						<hr/>
						{/*<div>*/}
							{/*To upgrade or downgrade your plan,{' '}*/}
							{/*<Button plain monochrome*/}
									{/*onClick={this.showPlanSectionUpgardePlan.bind(this)}*/}
							{/*>*/}
								{/*{<b>Click Here</b>}*/}
							{/*</Button>*/}
						{/*</div>*/}
					</div>:null}
					<div className="col-12 mb-4">
						<div className="d-flex justify-content-center">
							<Button
								primary={true}
								onClick={() => this.redirect("/panel/plans/current")}
							>
								Show Active Plan
							</Button>
						</div>
					</div>
				</div>
				<PlanBody {...this.props} myprop_upgrade_button={this.state.button_press_upgarde}  paymentStatus={this.paymentStatus} />

			</Page>

		);
	}
    redirect(url, data) {
        if (data !== undefined) {
            this.props.history.push(url, data);
        } else this.props.history.push(url);
    }
	updateState() {
		const state = this.state;
		this.setState(state);
	}
}
