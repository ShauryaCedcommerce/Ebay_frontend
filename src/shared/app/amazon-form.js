import React, {Component} from "react";
import {
    Banner,
    Button,
    Checkbox,
    Heading,
    Label,
    Select,
    TextField,
    TextStyle
} from "@shopify/polaris";
import {modifyOptionsData} from "../../components/Panel/Components/static-functions";
import {isUndefined} from "util";
import {requests} from "../../services/request";
import {notify} from "../../services/notify";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

class AmazonInstallationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schema: [],
            page: isUndefined(props.page) ? "account" : props.page,
            action: [],
            verification: "",
            yes_submit: false,
            postType: [],
            hide: [],
            region: "",
            noChange: true,
            dev_acc_avail: "true",
            init_show: false,
            init_array_show: ["country_code", "account_name"],
            dev_credentials: {
                region_in: ["CEDCOMMERCE IN", "1634-1171-8947"],
                region_europe: ["CEDCOMMERCE", "2336-2330-8975"],
                region_na: ["CedCommerce Inc", "337320726556"],
                region_au: ["CedCommerce AU", "048563819005"],
            },
            dev: []
        };
        this.amazonCredentials();
    }

    amazonCredentials() {
        requests.getRequest("amazonimporter/config/getCredentials").then(data => {
            if (data.success) {
                let schema = this.modifySchemaData(data.data);
                this.setState({schema: schema, page: "config"});
            } else {
                this.getAppInstallationForm();
            }
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-12">
                        <Banner title="Note" status="info">
                            <Label>Connect your another amazon account to import it's products also, just give another different account name</Label>
                        </Banner>
                    </div>

                    <div className="col-12 pt-3 text-right" style={{color: '#bf0711'}}>
                        <Button monochrome outline
                                onClick={() => {
                                    window.open(
                                        "http://apps.cedcommerce.com/importer/amazon_UK_IN.pdf"
                                    );
                                }}
                                size={"slim"}
                        >
                            Help PDF
                        </Button>
                    </div>
                    <div className="col-12 text-right p-3">
                        <TextStyle variation="positive">Get Seller id and Token</TextStyle>
                    </div>
                    {this.state.init_show &&
                    this.state.page !== "config" &&
                    this.state.dev.length > 0 && (
                        <div className="col-12 mt-1">
                            <Banner status="info">
                                <Label>
                                    <b>Developer name: </b>
                                    {this.state.dev[0]}
                                </Label>
                                <Label>
                                    <b>Developer id: </b> {this.state.dev[1]}
                                </Label>
                            </Banner>
                        </div>
                    )}
                    <div className="col-12 mt-1">
                        <div className="row">
                            {!isUndefined(this.state.schema) &&
                            this.state.schema.map(field => {
                                //console.log(field);
                                if (this.state.hide.indexOf(field.key) === -1)
                                    if (
                                        this.state.init_array_show.indexOf(field.key) !== -1 ||
                                        this.state.init_show
                                    )
                                        switch (field.type) {
                                            case "select":
                                                return (
                                                    <div
                                                        className="col-12 pt-2 pb-2"
                                                        key={this.state.schema.indexOf(field)}
                                                    >
                                                        <Select
                                                            options={field.options}
                                                            label={field.title}
                                                            placeholder={field.title}
                                                            value={field.value}
                                                            onChange={e => {
                                                                this.handleChange(field.key, e);
                                                            }}
                                                        />
                                                        <p style={{color: "green"}}>
                                                            {field.required ? "*required" : null}
                                                        </p>
                                                    </div>
                                                );
                                            case "checkbox":
                                                return (
                                                    <div
                                                        className="col-12 pt-2 pb-2"
                                                        key={this.state.schema.indexOf(field)}
                                                    >
                                                        <Label>{field.title}</Label>
                                                        <div className="row">
                                                            {field.options.map(option => {
                                                                return (
                                                                    <div
                                                                        className="col-md-6 col-sm-6 col-12 p-1"
                                                                        key={field.options.indexOf(option)}
                                                                    >
                                                                        <Checkbox
                                                                            checked={
                                                                                field.value.indexOf(option.value) !==
                                                                                -1
                                                                            }
                                                                            label={option.value}
                                                                            onChange={this.handleMultiselectChange.bind(
                                                                                this,
                                                                                this.state.schema.indexOf(field),
                                                                                field.options.indexOf(option)
                                                                            )}
                                                                        />
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                        <div className="col-12">
                                                            <p style={{color: "green"}}>
                                                                {field.required ? "*required" : null}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                                break;
                                            case "custom_country":
                                                return (
                                                    <div
                                                        className="col-12 pt-2 pb-2"
                                                        style={{fontSize: "14px"}}
                                                        key={this.state.schema.indexOf(field)}
                                                    >
                                                        <Dropdown
                                                            options={field.options}
                                                            onChange={e => {
                                                                this.handleChange(field.key, e);
                                                                this.handleHideComponent(field.options, e);
                                                            }}
                                                            value={field.value}
                                                            placeholder="Select an Country"
                                                        />
                                                        <p style={{color: "green"}}>
                                                            {field.required ? "*required" : null}
                                                        </p>
                                                    </div>
                                                );
                                            default:
                                                return (
                                                    <div
                                                        className="col-12 pt-2 pb-2"
                                                        key={this.state.schema.indexOf(field)}
                                                    >
                                                        <TextField
                                                            label={field.title}
                                                            placeholder={field.title}
                                                            helpText={field.hint}
                                                            value={field.value !== null ? field.value : ""}
                                                            disabled={
                                                                field.key === "account_name" &&
                                                                this.state.page === "config"
                                                            }
                                                            onChange={this.handleChange.bind(
                                                                this,
                                                                field.key
                                                            )}
                                                        />
                                                        <p style={{color: "green"}}>
                                                            {field.required ? "*required" : null}
                                                        </p>
                                                    </div>
                                                );
                                                break;
                                        }
                            })}
                            {/*<div className="col-6 text-left mt-3">
                             <Button
                             onClick={() => {
                             this.onClickVerify();
                             }}
                             disabled={this.state.noChange}
                             primary
                             >
                             Verify
                             </Button>
                             </div>*/}
                            <div className="col-12 text-right mt-3">
                                <Button
                                    onClick={() => {
                                        this.onSubmit();
                                    }}
                                    disabled={this.state.noChange}
                                    primary
                                >
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    getAppInstallationForm() {
        // let win = window.open('', '_blank', 'location=yes,height=600,width=550,scrollbars=yes,status=yes');
        let params = this.props.code;
        requests
            .getRequest("connector/get/installationForm", {code: params})
            .then(data => {
                if (data.success === true) {
                    if (data.data.post_type === "redirect") {
                        let tempURL = {
                            open: true,
                            url: data.data.action
                        };
                        this.setState({confirmOpen: tempURL});
                    } else {
                        this.state["schema"] = this.modifySchemaData(data.data.schema);
                        this.state["action"] = data.data.action;
                        this.state["postType"] = data.data.post_type;
                        this.updateState();
                    }
                } else {
                    notify.error(data.message);
                    this.redirect();
                }
            });
    }

    handleChange(key, event) {
        this.state.noChange = false;
        for (let i = 0; i < this.state.schema.length; i++) {
            if (this.state.schema[i].key === key) {
                const state = this.state;
                if (typeof event === "object" && !isUndefined(event.value)) {
                    this.setState({init_show: true});
                    state.schema[i].value = event.value;
                } else {
                    state.schema[i].value = event;
                }
                this.setState(state);
                break;
            }
        }
    }

    handleMultiselectChange(index, optionIndex, event) {
        const checkboxValue = this.state.schema[index].options[optionIndex].value;
        const optIndex = this.state.schema[index].value.indexOf(checkboxValue);
        if (event) {
            if (optIndex === -1) {
                this.state.schema[index].value.push(checkboxValue);
            }
        } else {
            if (optIndex !== -1) {
                this.state.schema[index].value.splice(optIndex, 1);
            }
        }
        this.updateState();
    }

    onSubmit() {
        if (this.state.postType === "external") {
            let url = this.state.action;
            let end = url.indexOf("?") === -1 ? "?" : "&";
            for (let i = 0; i < this.state.schema.length; i++) {
                url +=
                    end + this.state.schema[i].key + "=" + this.state.schema[i].value;
                end = "&";
            }
            window.open(
                url,
                "_blank",
                "location=yes,height=600,width=550,scrollbars=yes,status=yes"
            );
        } else {
            let url = this.state.action;
            let temp = {};
            let data = {};
            let flag = true;
            for (let i = 0; i < this.state.schema.length; i++) {
                if (
                    this.state.schema[i].value !== "" &&
                    this.state.schema[i].type !== "checkbox"
                ) {
                    temp[this.state.schema[i].key] = this.state.schema[i].value;
                } else if (
                    this.state.schema[i].type === "checkbox" &&
                    this.state.schema[i].value.length > 0
                ) {
                    temp[this.state.schema[i].key] = this.state.schema[i].value;
                } else if (
                    this.state.schema[i].required !== 0 &&
                    this.state.hide.indexOf(this.state.schema[i].key) === -1
                ) {
                    flag = false;
                }
            }
            Object.keys(temp).forEach(key => {
                if (this.state.hide.indexOf(key) === -1) {
                    data[key] = temp[key];
                }
            });
            if (this.state.region !== "") {
                data["region"] = this.state.region;
                data["dev_acc_avail"] = this.state.dev_acc_avail;
            }
            if (flag) {
                this.onClickVerify(url);
                /*             if (this.state.page === "config") {
                 requests
                 .postRequest("amazonimporter/request/setAmazonCredentials", data)
                 .then(data => {
                 if (data.success) {
                 notify.success(data.message);
                 this.setState({noChange: true});
                 } else {
                 notify.error(data.message);
                 }
                 this.redirect();
                 });
                 } else {
                 requests.postRequest(url, data, true).then(data => {
                 if (data.success) {
                 this.props.success3({code: this.props.code});
                 notify.success(data.message);
                 } else {
                 notify.error(data.message);
                 this.props.success3({code: false});
                 }
                 this.redirect();
                 });
                 }*/
            } else {
                notify.info("Please Fill Up All Required Field");
            }
        }
    }

    onClickVerify(url) {
        console.log("in function where i want!!!");
        let temp = {};
        let data = {};
        let flag = true;
        for (let i = 0; i < this.state.schema.length; i++) {
            if (
                this.state.schema[i].value !== "" &&
                this.state.schema[i].type !== "checkbox"
            ) {
                temp[this.state.schema[i].key] = this.state.schema[i].value;
            } else if (
                this.state.schema[i].type === "checkbox" &&
                this.state.schema[i].value.length > 0
            ) {
                temp[this.state.schema[i].key] = this.state.schema[i].value;
            } else if (
                this.state.schema[i].required !== 0 &&
                this.state.hide.indexOf(this.state.schema[i].key) === -1
            ) {
                flag = false;
            }
        }
        Object.keys(temp).forEach(key => {
            if (this.state.hide.indexOf(key) === -1) {
                data[key] = temp[key];
            }
        });
        if (this.state.region !== "") {
            data["region"] = this.state.region;
            data["dev_acc_avail"] = this.state.dev_acc_avail;
        }
        console.log("DATA is here",data);

        requests
            .postRequest("amazonimporter/request/amazonImporterClientDetailsVerification", data)
            .then(data1 => {
                if (data1['success']) {
                    this.savingFormData(data, url);
                    notify.success(data1["message"]);
                } else {
                    this.setState({
                        verification: data1["message"] + " " + data1["code"]
                    })
                    notify.error(this.state.verification);
                }
            });

    }

    savingFormData(data, url) {
        console.log("saving foe=rm data");
        console.log("data = ", data);
        console.log("url = ",url);
        if (this.state.page === "config") {
            requests
                .postRequest("amazonimporter/request/setAmazonCredentials", data)
                .then(data => {
                    if (data.success) {
                        notify.success(data.message);
                        this.setState({noChange: true});
                    } else {
                        notify.error(data.message);
                    }
                    this.redirect();
                });
        } else {
            requests.postRequest(url, data, true).then(data => {
                if (data.success) {
                    this.props.success3({code: this.props.code});
                    notify.success(data.message);
                } else {
                    notify.error(data.message);
                    this.props.success3({code: false});
                }
                this.redirect();
            });
        }

    }

    handleHideComponent = (arg, value) => {
        let hide = [];
        let region = "";
        let dev_acc_avail = "true";
        arg.forEach(e => {
            e.items.forEach(key => {
                if (key.value === value.value) {
                    hide = e.hide;
                    region = e.region;
                    dev_acc_avail = e.dev_acc_avail;
                }
            });
        });
        if (!isUndefined(this.state.dev_credentials[region])) {
            this.setState({dev: this.state.dev_credentials[region]});
        } else {
            this.setState({dev: []});
        }
        this.setState({
            hide: hide,
            region: region,
            dev_acc_avail: dev_acc_avail,
            init_show: true
        });
    };

    modifySchemaData(data) {
        for (let i = 0; i < data.length; i++) {
            if (!isUndefined(data[i].options)) {
                data[i].options = modifyOptionsData(data[i].options);
            }
            if (data[i]["type"] === "custom_country") {
                let option = [];
                Object.keys(data[i]["region"]).forEach(e => {
                    option.push({
                        type: "group",
                        name: data[i]["region"][e],
                        items: modifyOptionsData(data[i][e]["options"]),
                        hide: data[i][e]["hide"],
                        region: e,
                        dev_acc_avail: data[i][e]["dev_acc_avail"] // if dev account of that region is available
                    });
                });
                if (data[i]["value"] !== "") {
                    option.forEach(e => {
                        e.items.forEach(key => {
                            if (key.value === data[i]["value"]) {
                                this.setState({hide: e.hide, init_show: true});
                            }
                        });
                    });
                }
                data[i]["options"] = option;
            }
        }
        return data;
    }

    updateState() {
        const state = this.state;
        this.setState(state);
    }

    redirect() {
        this.props.redirect(false);
    }
}

export default AmazonInstallationForm;
