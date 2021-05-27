import React, { Component } from "react";

import {
    Page,
    AccountConnection,
    Button,
    Card,
    Select,
    Modal
} from "@shopify/polaris";
import { requests } from "../../../services/request";
import { notify } from "../../../services/notify";
import { faArrowsAltH, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { environment } from "../../../environments/environment";
import { json } from "../../../environments/static-json";
import AppsShared from "../../../shared/app/apps";
import { isUndefined } from "util";
import InstallAppsShared from "../../../shared/app/install-apps";

export class Apps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            API_code: ["google"], // connector/get/installationForm, method -> get, eg: { code : 'google' }
            account_linked: [], // merchant center account. linked type
            modalOpen: false,
            success_code: {},
            importerServices: []
        };
// this.getConnectors();
    }

    checkLinkedAccount() {
        requests
            .postRequest("frontend/app/checkAccount", {
                code: this.state.importerServices
            })
            .then(data => {
                if (data.success) {
                    if (data.data.account_connected) {
                        notify.success("Account Connected Successfully");
                    } else {
                        notify.info("Please Connect Your Account First");
                    }
                } else {
                    notify.error(data.message);
                }
            });
    }
    openNewWindow = (code, val) => {
        this.setState({
            modalOpen: !this.state.modalOpen,
            code: code,
            additional_data: val
        });
    }; // Open Modal And A new Small Window For User
    handleImporterService = arg => {
        this.setState({ importerServices: arg });
    };
    redirectResult = (code, val) => {
        if (isUndefined(val)) {
            val = "";
        }
        this.openNewWindow(code, val);
    }; // used in step 3 to get child data and send back to new child
    renderAccountInfo = () => {
        return (
            <div className="">
                <AppsShared
                    history={this.props.history}
                    importerServices={this.handleImporterService}
                    redirectResult={this.redirectResult}
                    success={this.state.success_code}
                />
            </div>
        );
    };
    handleModalChange = event => {
        if (event === "init_modal") {
            notify.info("Please Select A Integration First");
        } else {
            this.setState({ modalOpen: !this.state.modalOpen });
        } // if he/she cancel or close the modalpanel/dashboard
    };
    render() {
        return (
            <React.Fragment>
                <Page
                    title={"Accounts"}
                    primaryAction={{
                        content: "Connected Accounts",
                        onClick: () => {
                            this.redirect("/panel/accounts/connect");
                        }
                    }}
                >
                    {this.renderAccountInfo()}
                    <Modal
                        open={this.state.modalOpen}
                        onClose={this.handleModalChange.bind(
                            this,
                            "no",
                            this.state.active_step
                        )}
                        title="Connect Account"
                    >
                        <Modal.Section>
                            <InstallAppsShared
                                history={this.props.history}
                                redirect={this.redirectResult}
                                code={this.state.code}
                                additional_data={this.state.additional_data}
                                success3={this.handleLinkedAccount}
                            />
                        </Modal.Section>
                    </Modal>{" "}
                </Page>
            </React.Fragment>
        );
    }
    handleLinkedAccount = event => {
        if (!isUndefined(event) && event.code !== false) {
            this.props.getNecessaryInfo();
        }
        this.setState({ success_code: event });
    };
    redirect(url) {
        this.props.history.push(url);
    }
}