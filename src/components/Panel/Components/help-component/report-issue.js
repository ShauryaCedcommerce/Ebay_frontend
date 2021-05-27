import React, {Component} from "react";
import {Page, Card, TextField, Select, Layout, Stack, Thumbnail, Button} from "@shopify/polaris";
import {requests} from "../../../../services/request";
import {notify} from "../../../../services/notify";

class ReportAnIssue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subject: "",
            body: "",
            option: "",
            selectedMarketplace:''
        };
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleSelectMarketplaceChange = this.handleSelectMarketplaceChange.bind(this);
    }

    handleTextChange(key, event) {
        this.setState({
            [key]: event
        });
    }

    handleSelectChange(event) {
        this.setState({
            option: event
        });
    }
    handleSelectMarketplaceChange(event) {
        this.setState({
            selectedMarketplace: event
        });
    }

    submit() {
        let data = {
            body: "",
            subject: ""
        };
        if (this.state.option !== "other") {
            data.body = this.state.body;
            data.subject =
                "We have Received Your Issue Related to " + this.state.option;
        } else {
            data.body = this.state.body;
            data.subject = "We have Received Your Issue ";
        }
        if (data.body !== "" && data.subject !== "") {
            requests.postRequest("frontend/app/submitReport", data).then(e => {
                if (e.success) {
                    notify.success(e.message);
                } else {
                    notify.error(e.message);
                }
            });
        } else {
            notify.info("Field Are Empty");
        }
    }

    productSync() {
        let sendingData = {
            marketplace: this.state.selectedMarketplace,
        };
        requests
            .postRequest("frontend/test/shopifySyncingTest", sendingData, false, false)
            .then(data1 => {
                if (data1['success']) {
                } else {
                }
            });
    }

    fullProductSync() {
        let sendingData = {
            marketplace: this.state.selectedMarketplace,
        };
        requests
            .postRequest("frontend/test/marketplaceSyncingTest", sendingData, false, false)
            .then(data1 => {
                if (data1['success']) {
                } else {
                }
            });
    }

    render() {
        const options = [
            {
                label: "Issue  regarding Amazon or Ebay seller panel",
                value: "Amazon/Ebay Seller Panel"
            },
            {
                label: "Issue regarding product import or product upload to Shopify",
                value: "Import/Upload"
            },
            {label: "Issue regarding pricing plan", value: "Pricing Plan"},
            {label: "Issue regarding profiling", value: "Profiling"},
            {label: "Other", value: "other"}
        ];
        const marketplace_options = [
            {
                label: "Amazon",
                value: "amazonimporter"
            },
            {
                label: "Ebay",
                value: "ebayimporter"
            },
            {
                label: "Etsy",
                value: "etsyimporter"
            }
        ];
        return (
            <Page
                title="Contact Us"
                primaryAction={{
                    content: "Back",
                    onClick: () => {
                        this.redirect("/panel/help");
                    }
                }}
            >
                <div className="row">
                    <div className="col-12 col-sm-8 order-2 order-sm-1">
                        <Card
                            primaryFooterAction={{
                                content: "Send mail",
                                onClick: () => {
                                    this.submit();
                                }
                            }}
                            title={"Have an issue?"}
                        >
                            <div className="p-5">
                                <div className="mt-4 mb-4">
                                    <Select
                                        label="Issue"
                                        options={options}
                                        onChange={this.handleSelectChange}
                                        placeholder="Select here"
                                        value={this.state.option}
                                    />
                                </div>
                                <TextField
                                    label="Description"
                                    placeholder="Eg. how to create profile"
                                    value={this.state.body}
                                    onChange={this.handleTextChange.bind(this, "body")}
                                />
                            </div>
                        </Card>
                    </div>
                    {/*					<div className="col-12 col-sm-4 order-1 order-sm-2 mb-4">
                     <Card>
                     <div className="row">
                     <div className="col-12 p-5 text-center">
                     <img
                     src={require("../../../../assets/img/contact-us.png")}
                     height={"165px"}
                     />
                     <h5>
                     <b>Email:</b>{" "}
                     </h5>
                     <h5>apps@cedcommerce.com</h5>
                     <hr />
                     <h5>
                     <b>Phone:</b>
                     </h5>
                     <h5>(+91) 9532100695</h5>
                     </div>
                     </div>
                     </Card>
                     </div>*/}
                    <div className="col-12 col-sm-4 order-1 order-sm-2 mb-3 mt-3">
                        <Card>
                            <Card.Section>
                                <Stack vertical={true} alignment={"center"} spacing={"extraTight"}>
                                    <Thumbnail
                                        source={require('../../../../assets/img/whatsapp.png')}
                                        size="large"
                                        alt="WhatsApp"
                                    />
                                    <h5><a
                                        href={'https://wa.me/+919532100695?text=I have a query regarding the Omni Importer app.'}
                                        target={'_blank'}>Contact Us</a></h5>
                                </Stack>
                            </Card.Section>
                        </Card>
                        <Card>
                            <Card.Section>
                                <Stack vertical={true} alignment={"center"} spacing={"extraTight"}>
                                    <Thumbnail
                                        source={require('../../../../assets/img/skype.png')}
                                        size="large"
                                        alt="Skype"
                                    />
                                    <h5><a href={'skype:live:deeptishukla_1?chat'}>Contact Us</a></h5>
                                </Stack>
                            </Card.Section>
                        </Card>
                        <div className="row p-5">
                            <div className="col-12">
                                <Select
                                    options={marketplace_options}
                                    label='Marketplace'
                                    labelHidden
                                    placeholder='Select Marketplace'
                                    value={this.state.selectedMarketplace}
                                    onChange={this.handleSelectMarketplaceChange}
                                />
                            </div>
                            <div className="p-5 col-6">
                                <Button
                                    onClick={() => {
                                        this.productSync();
                                    }}
                                    primary

                                >
                                    Shopify Sync
                                </Button>
                            </div>
                            <div className="p-5 col-6">
                                <Button
                                    onClick={() => {
                                        this.fullProductSync();
                                    }}
                                    primary

                                >
                                    Full Sync
                                </Button>
                            </div>
                        </div>
                    </div>
                    {/*<Layout>
                     <Layout.Section oneThird>
                     <Card>
                     <Card.Section>
                     <Stack vertical={true} alignment={"center"} spacing={"extraTight"}>
                     <Thumbnail
                     source={require('../../../../assets/img/whatsapp.png')}
                     size="large"
                     alt="WhatsApp"
                     />
                     <h5><a href={'https://wa.me/918765246941?text=eBayAppAssistance'} target={'_blank'}><b>Connect with us on WhatsApp</b></a></h5>
                     </Stack>
                     </Card.Section>
                     </Card>
                     </Layout.Section>
                     <Layout.Section oneThird>
                     <Card>
                     <Card.Section>
                     <Stack vertical={true} alignment={"center"} spacing={"extraTight"}>
                     <Thumbnail
                     source={require('../../../../assets/img/skype.jpg')}
                     size="large"
                     alt="Skype"
                     />
                     <h5><a href={'skype:live:srajanshukla_2?chat'}><b>Connect with us on Skype</b></a></h5>
                     </Stack>
                     </Card.Section>
                     </Card>
                     </Layout.Section>
                     <Layout.Section oneThird>
                     </Layout.Section>
                     </Layout>*/}
                </div>

            </Page>
        );
    }

    redirect(url) {
        this.props.history.push(url);
    }
}

export default ReportAnIssue;
