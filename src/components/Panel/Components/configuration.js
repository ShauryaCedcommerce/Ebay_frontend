import React, {Component} from "react";

import {
    Page,
    Heading,
    Card,
    Select,
    FormLayout,
    ButtonGroup,
    Stack,
    Label,
    Button,
    TextField,
    Checkbox,
    Layout,
    Banner,
    Modal,
    Icon
} from "@shopify/polaris";
import {
    RefreshMajorMonotone
} from '@shopify/polaris-icons';
import {notify} from "../../../services/notify";
import {requests} from "../../../services/request";
import {modifyOptionsData} from "./static-functions";

import {isUndefined} from "util";
import {environment} from "../../../environments/environment";
import {Formbuilder}  from '../../../shared/formbuilder';

const defaultCurrencyConverter = {
    label: '',
    value: 1,
    action: 'mul',
    additional: '',
};

export class Configuration extends Component {
    shopifyConfigurationData = [];
    amazonImporterConfigurationData = [];
    amazonAffiliateConfigurationData = [];
    ebayConfigurationData = [];
    ebayAffilaiteConfigurationData = [];
    wishConfigurationData = [];
    fbaConfigurationData = [];
    etsyConfigurationData = [];

    constructor(props) {
        super(props);
        this.state = {
            account_information: {
                username: "",
                email: "",
                skype_id: "",
                full_name: "",
                mobile: ""
            },
            shopify_configuration: {},
            show_shopify_child_component: {},
            shopify_configuration_updated: false,
            account_information_updated: false,
            etsy_shop_name:'',

            fba_configuration: {},
            open_modal: false,
            open_modal_response: false,
            shipping_user_code: [],
            shipping_array_category: [],
            initial_array:[],
            button_loader_fba:false

        };
        // this.getUserDetails();
        this.getShopifyConfigurations();
        this.getAmazonImporterConfigurations();
        this.getAmazonAffiliateConfigurations();
        this.getEbayConfig();
        this.getEtsyConfig();
        this.getWishConfig();
        this.getFbaConfig();
        this.getEbayAffiliateConfig();
        this.getDataShipping();
    }

    componentWillReceiveProps(nextPorps) {
        if (nextPorps.necessaryInfo !== undefined) {
            this.setState({necessaryInfo: nextPorps.necessaryInfo});
        }
    }

    getUserDetails() {
        requests.getRequest("user/getDetails").then(data => {
            if (data.success && data.data !== null) {
                this.state.account_information = {
                    username: data.data.username,
                    email: data.data.email,
                    skype_id: data.data.skype_id,
                    full_name: data.data.full_name,
                    mobile: data.data.mobile
                };
                if (!isUndefined(data.data.phone)) {
                    this.state.account_information["phone"] = data.data.phone;
                }
                this.updateState();
            } else {
                notify.error(data.message);
            }
        });
    }

    getAmazonImporterConfigurations() {
        requests
            .getRequest("connector/get/config", {marketplace: "amazonimporter"})
            .then(data => {
                if (data.success) {
                    // console.log(data.data)
                    this.amazonImporterConfigurationData = this.modifyConfigData(
                        data.data,
                        "amazon_importer_configuration"
                    );
                    this.updateState();
                } else {
                    notify.error(data.message);
                }
            });
    }
    getAmazonAffiliateConfigurations() {
        requests
            .getRequest("connector/get/config", {marketplace: "amazonaffiliate"})
            .then(data => {
                if (data.success) {
                    this.amazonAffiliateConfigurationData = this.modifyConfigData(
                        data.data,
                        "amazon_affiliate_configuration"
                    );
                    this.updateState();
                } else {
                    notify.error(data.message);
                }
            });
    }
    getEbayAffiliateConfigurations() {
        requests
            .getRequest("connector/get/config", {marketplace: "ebayaffiliate"})
            .then(data => {
                if (data.success) {
                    this.amazonAffiliateConfigurationData = this.modifyConfigData(
                        data.data,
                        "amazon_affiliate_configuration"
                    );
                    this.updateState();
                } else {
                    notify.error(data.message);
                }
            });
    }

    getEbayConfig() {
        requests
            .getRequest("connector/get/config", {marketplace: "ebayimporter"})
            .then(data => {
                if (data.success) {

                    this.ebayConfigurationData = this.modifyConfigData(
                        data.data,
                        "ebay_configuration"
                    );
                    this.updateState();
                } else {
                    // notify.error(data.message);
                }
            });
    }

    getEbayAffiliateConfig() {
        requests
            .getRequest("connector/get/config", {marketplace: "ebayaffiliate"})
            .then(data => {
                if (data.success) {
                    this.ebayAffilaiteConfigurationData = this.modifyConfigData(
                        data.data,
                        "ebayAffiliate_configuration"
                    );
                    this.updateState();
                } else {
                    // notify.error(data.message);
                }
            });
    }

    getWishConfig() {
        requests
            .getRequest("connector/get/config", {marketplace: "wishimporter"})
            .then(data => {
                if (data.success) {
                    this.wishConfigurationData = this.modifyConfigData(
                        data.data,
                        "wish_configuration"
                    );
                    this.updateState();
                } else {
                    // notify.error(data.message);
                }
            });
    }

    getFbaConfig() {
        requests
            .getRequest("connector/get/config", {marketplace: "fba"})
            .then(data => {
                if (data.success) {
                    this.fbaConfigurationData = this.modifyConfigData(
                        data.data,
                        "fba_configuration"
                    );
                    this.updateState();
                } else {
                    // notify.error(data.message);
                }
            });
    }

    getEtsyConfig() {
        requests
            .getRequest("connector/get/config", {marketplace: "etsyimporter"})
            .then(data => {
                if (data.success) {
                    // console.log(data.data)
                    this.etsyConfigurationData = this.modifyConfigData(
                        data.data,
                        "etsy_configuration"
                    );
                    this.updateState();
                } else {
                    // notify.error(data.message);
                }
            });
    }

    getShopifyConfigurations() {
        requests
            .getRequest("connector/get/config", {marketplace: "shopify"})
            .then(data => {
                if (data.success) {
                    // console.log(data.data);
                    this.shopifyConfigurationData = this.modifyConfigData(
                        data.data,
                        "shopify_configuration"
                    );
                    this.updateState();
                } else {
                    notify.error(data.message);
                }
            });
    }

    modifyConfigData(data, configKey) {
        // console.log(data)
        for (let i = 0; i < data.length; i++) {
            if (typeof this.state[configKey] !== "object") this.state[configKey] = {};
            this.state[configKey][data[i].code] = data[i].value;
            if (!isUndefined(data[i].options)) {
                data[i].options = modifyOptionsData(data[i].options);
            }
            if (!isUndefined(data[i]["is_parent"])) {
                this.state.show_shopify_child_component[data[i]["is_parent"]] =
                    data[i].value !== "enable";
            }
        }

        // console.log(data)
        return data;
    }

    renderUserConfigurationSection() {
        return (
            <div className="row">
                <div className="col-sm-4 col-12 text-md-left text-sm-left text-center">
                    <Heading>Account Information</Heading>
                </div>
                <div className="col-sm-8 col-12">
                    <Card>
                        <div className="row p-5">
                            <div className="col-12 pt-2 pb-2">
                                <Label id={"dew"}>Username</Label>
                                <Label id={"ert"}>{this.state.account_information.username}</Label>
                            </div>
                            <div className="col-12 pt-2 pb-2">
                                <TextField
                                    label="Email"
                                    onChange={this.accountInfoChange.bind(this, "email")}
                                    value={this.state.account_information.email}
                                    readOnly={false}
                                />
                            </div>
                            {!isUndefined(this.state.account_information.full_name) && (
                                <div className="col-12 pt-2 pb-2">
                                    <TextField
                                        label="Full name"
                                        onChange={this.accountInfoChange.bind(this, "full_name")}
                                        value={this.state.account_information.full_name}
                                        readOnly={false}/>
                                </div>
                            )}
                            {!isUndefined(this.state.account_information.mobile) && (
                                <div className="col-12 pt-2 pb-2">
                                    <TextField
                                        label="Phone no."
                                        disabled={true}
                                        readOnly={false}
                                        onChange={this.accountInfoChange.bind(this, "mobile")}
                                        value={this.state.account_information.mobile}
                                    />
                                </div>
                            )}
                            {!isUndefined(this.state.account_information.skype_id) && (
                                <div className="col-12 pt-2 pb-2">
                                    <TextField
                                        label="Skype ID"
                                        onChange={this.accountInfoChange.bind(this, "skype_id")}
                                        value={this.state.account_information.skype_id}
                                        readOnly={false}/>
                                </div>
                            )}
                            <div className="col-12 text-right pt-2 pb-2">
                                <Button
                                    disabled={!this.state.account_information_updated}
                                    onClick={() => {
                                        // this.saveProfileData();
                                    }}
                                    primary
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    renderLevelComponent = (data, parentIndex) => {
        let value = [JSON.parse(JSON.stringify(defaultCurrencyConverter))];
        let custom_option = [];
        if (typeof this.state.shopify_configuration[data.code] === 'object'
            && Object.keys(this.state.shopify_configuration[data.code]).length > 0) {
            value = this.state.shopify_configuration[data.code];
        }
        // value.push(JSON.parse(JSON.stringify(defaultCurrencyConverter)));
        Object.keys(data['custom_options']).map(e => {
            let flag = true;
            // value.forEach(key => {
            // 	if ( key.label === e ) flag = false;
            // });
            if (flag) custom_option.push({label: e, value: e, additional: data['custom_options'][e]});
        });
        let increaseIn = [
            {label: "Multiply", value: "mul"},
            {label: "Percentage Inc", value: "percentage_inc"},
            // {label:"Fixed Inc",value:"fixed_inc"},
            {label: "Percentage Dsc", value: "percentage_dsc"},
            // {label:"Fixed Dsc",value:"fixed_dsc"},
        ];
        return <div className="col-12 pt-2 pb-2" key={parentIndex}>
            <Label>Currency Converter / Price Updater</Label>
            {value.map((e, i) => {
                if (e.value == 0){
                    e.value = 1
                }
                return (
                    <React.Fragment>
                        <Stack>
                            <Stack>
                                <ButtonGroup>
                                    <Select
                                        options={custom_option}
                                        label={data.title}
                                        labelHidden
                                        placeholder={data.title}
                                        value={e.label}
                                        onChange={this.handleMultiLevelChange.bind(this, i, parentIndex, custom_option, value, 'label')}
                                    />
                                    <Select
                                        options={increaseIn}
                                        label={""}
                                        labelInline
                                        value={e.action}
                                        onChange={this.handleMultiLevelChange.bind(this, i, parentIndex, custom_option, value, 'action')}
                                    />
                                </ButtonGroup>
                            </Stack>
                            <Stack>
                                <TextField
                                    key={i}
                                    label={"Currency"}
                                    type="number"
                                    min={1}
                                    labelHidden
                                    onChange={this.handleMultiLevelChange.bind(this, i, parentIndex, custom_option, value, 'value')}
                                    value={e.value}
                                    connectedRight={<ButtonGroup segmented>
                                        <Button icon="add"
                                                onClick={this.handleAddMore.bind(this, value, parentIndex, value)}
                                                primary/>
                                        <Button icon="subtract"
                                                onClick={this.handleRemove.bind(this, i, parentIndex, value)}
                                                destructive/>
                                    </ButtonGroup>}
                                    readOnly={false}/>
                            </Stack>
                        </Stack>
                        <br/>
                    </React.Fragment>
                );
            })}
        </div>
    };

    handleAddMore = (value, mainIndex) => {
        value.push(JSON.parse(JSON.stringify(defaultCurrencyConverter)));
        this.shopifyConfigurationChange(mainIndex, value);
    };

    handleRemove = (index, mainIndex, value) => {
        value.splice(index, 1);
        this.shopifyConfigurationChange(mainIndex, value);
    };

    handleMultiLevelChange = (index, mainIndex, custom_option, prevVal, key, value) => {
        if (prevVal[index] === undefined) prevVal.push(JSON.parse(JSON.stringify(defaultCurrencyConverter)));
        if (key === 'value' && value <= 0) value = 0;
        if (key === 'label') {
            custom_option.forEach(e => {
                if (e.value === value) {
                    prevVal[index]['value'] = e.additional;
                }
            })
        }
        prevVal[index][key] = value;
        this.shopifyConfigurationChange(mainIndex, prevVal);
    };
    getLocationDetails(){
        requests
            .getRequest("frontend/importer/getLocationShopify")
            .then(data => {
                // console.log(data);
                if (data.success) {
                    notify.success(data.code);
                    window.location.reload();
                } else {
                    notify.error(data.code);
                }
            });
    }

    renderShopifyConfigurationSection(sync) {
        return (
            <div className="row">
                <div className="col-sm-4 col-12 text-md-left text-sm-left text-center">
                    <Heading>Shopify Settings</Heading>
                </div>
                <div className="col-sm-8 col-12">
                    <Card>
                        <div className="row p-5">
                            {this.shopifyConfigurationData.map(config => {
                                // console.log(this.state.shopify_configuration['Locations'])
                                if (
                                    !this.state.show_shopify_child_component[config["is_child"]]
                                ) {
                                    if (config.code == "Locations") {
                                        switch (config.type) {
                                            case "select":
                                                return (
                                                    <div
                                                        className="col-12 pt-2 pb-2"
                                                        key={this.shopifyConfigurationData.indexOf(config)}
                                                    >
                                                        <div className="row">
                                                            <div className="col-10">
                                                        <Select
                                                            options={config.options}
                                                            label={config.title}
                                                            labelInline={false}
                                                            placeholder={config.title}
                                                            disabled={!sync && ( config.code === 'inventory_sync' || config.code === 'price_sync' )}
                                                            value={
                                                                this.state.shopify_configuration[config.code]
                                                            }
                                                            onChange={this.shopifyConfigurationChange.bind(
                                                                this,
                                                                this.shopifyConfigurationData.indexOf(config)
                                                            )}
                                                        />
                                                            </div>
                                                            <div className="col-2 pt-5">
                                                                <Button
                                                                    onClick={() => {
                                                                        this.getLocationDetails();
                                                                    }}
                                                                    primary
                                                                >
                                                                <Icon
                                                                    source={RefreshMajorMonotone}
                                                                />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>


                                                );
                                            case "checkbox":
                                                return (
                                                    <div
                                                        className="col-12 pt-2 pb-2"
                                                        key={this.shopifyConfigurationData.indexOf(config)}
                                                    >
                                                        <Label id={"sss"}>{config.title}</Label>
                                                        <div className="row">
                                                            {config.options.map(option => {
                                                                return (
                                                                    <div
                                                                        className="col-md-6 col-sm-6 col-12 p-1"
                                                                        key={config.options.indexOf(option)}
                                                                    >
                                                                        <Checkbox
                                                                            checked={
                                                                                this.state.shopify_configuration[
                                                                                    config.code
                                                                                    ].indexOf(option.value) !== -1
                                                                            }
                                                                            label={option.label}
                                                                            onChange={this.shopifyConfigurationCheckboxChange.bind(
                                                                                this,
                                                                                this.shopifyConfigurationData.indexOf(
                                                                                    config
                                                                                ),
                                                                                config.options.indexOf(option)
                                                                            )}
                                                                        />
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                );
                                            case "multi_level_select_textbox":
                                                return this.renderLevelComponent(config, this.shopifyConfigurationData.indexOf(config));
                                            default:
                                                return (
                                                    <div
                                                        className="col-12 pt-2 pb-2"
                                                        key={this.shopifyConfigurationData.indexOf(config)}
                                                    >
                                                        <TextField
                                                            label={config.title}
                                                            placeholder={config.title}
                                                            value={
                                                                this.state.shopify_configuration[config.code]
                                                            }
                                                            onChange={this.shopifyConfigurationChange.bind(
                                                                this,
                                                                this.shopifyConfigurationData.indexOf(config)
                                                            )}
                                                            readOnly={false}/>
                                                    </div>
                                                );
                                        }
                                    }
                                    else {
                                        switch (config.type) {
                                            case "select":
                                                return (
                                                    <div
                                                        className="col-12 pt-2 pb-2"
                                                        key={this.shopifyConfigurationData.indexOf(config)}
                                                    >
                                                        <Select
                                                            options={config.options}
                                                            label={config.title}
                                                            labelInline={false}
                                                            placeholder={config.title}
                                                            disabled={!sync && ( config.code === 'inventory_sync' || config.code === 'price_sync' )}
                                                            value={
                                                                this.state.shopify_configuration[config.code]
                                                            }
                                                            onChange={this.shopifyConfigurationChange.bind(
                                                                this,
                                                                this.shopifyConfigurationData.indexOf(config)
                                                            )}
                                                        />
                                                    </div>
                                                );
                                            case "checkbox":
                                                return (
                                                    <div
                                                        className="col-12 pt-2 pb-2"
                                                        key={this.shopifyConfigurationData.indexOf(config)}
                                                    >
                                                        <Label id={"sss"}>{config.title}</Label>
                                                        <div className="row">
                                                            {config.options.map(option => {
                                                                return (
                                                                    <div
                                                                        className="col-md-6 col-sm-6 col-12 p-1"
                                                                        key={config.options.indexOf(option)}
                                                                    >
                                                                        <Checkbox
                                                                            checked={
                                                                                this.state.shopify_configuration[
                                                                                    config.code
                                                                                    ].indexOf(option.value) !== -1
                                                                            }
                                                                            label={option.label}
                                                                            onChange={this.shopifyConfigurationCheckboxChange.bind(
                                                                                this,
                                                                                this.shopifyConfigurationData.indexOf(
                                                                                    config
                                                                                ),
                                                                                config.options.indexOf(option)
                                                                            )}
                                                                        />
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                );
                                            case "multi_level_select_textbox":
                                                return this.renderLevelComponent(config, this.shopifyConfigurationData.indexOf(config));
                                            default:
                                                return (
                                                    <div
                                                        className="col-12 pt-2 pb-2"
                                                        key={this.shopifyConfigurationData.indexOf(config)}
                                                    >
                                                        <TextField
                                                            label={config.title}
                                                            placeholder={config.title}
                                                            value={
                                                                this.state.shopify_configuration[config.code]
                                                            }
                                                            onChange={this.shopifyConfigurationChange.bind(
                                                                this,
                                                                this.shopifyConfigurationData.indexOf(config)
                                                            )}
                                                            readOnly={false}/>
                                                    </div>
                                                );
                                        }
                                    }
                                }
                            })}
                            <div className="col-12 text-right pt-2 pb-1">
                                <Button
                                    disabled={!this.state.shopify_configuration_updated}
                                    onClick={() => {
                                        this.saveShopifyConfigData();
                                    }}
                                    primary
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    renderAmazonImporterConfigurationSection(sync) {
        return (
            <div className="row">
                <div className="col-sm-4 col-12 text-md-left text-sm-left text-center">
                    <Heading>Amazon Settings</Heading>
                </div>
                <div className="col-sm-8 col-12">
                    <Card>
                        <div className="p-5">
                            <Formbuilder
                                form={this.amazonImporterConfigurationData}
                                sync={sync}
                                onSubmit={this.onSubmit.bind(this, 'amazonimporter')}/>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }
    renderAmazonAffiliateConfigurationSection(sync) {
        return (
            <div className="row">
                <div className="col-sm-4 col-12 text-md-left text-sm-left text-center">
                    <Heading>Amazon Dropshipping Settings</Heading>
                </div>
                <div className="col-sm-8 col-12">
                    <Card>
                        <div className="p-5">
                            <Formbuilder
                                form={this.amazonAffiliateConfigurationData}
                                sync={sync}
                                onSubmit={this.onSubmit.bind(this, 'amazonaffiliate')}/>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    onSubmit = (marketplace, data) => {
        switch (marketplace) {
            case 'ebayimporter':
                this.saveEbayConfigData(data);
                break;
            case 'etsyimporter':
                this.saveEtsyConfigData(data);
                break;
            case 'amazonimporter':
                this.saveAmazonImporterConfigData(data);
                break;
            case 'wishimporter':
                this.saveWishImporterConfigData(data);
                break;
            case 'fba':
                this.saveFbaImporterConfigData(data);
                break;
            case 'walmartimporter':
                // console.log("Walmart");
                break;
            case  'amazonaffiliate':
                this.saveAmazonAffiliateConfigData(data);
                break;
            case  'ebayaffiliate':
                this.saveEbayAffiliateConfigData(data);
                break;
            default:
                // console.log("Wrong Choice");
        }
    };

    renderEbayConfig(sync) {
        return (
            <div className="row">
                <div className="col-sm-4 col-12 text-md-left text-sm-left text-center">
                    <Heading>Ebay Settings</Heading>
                </div>
                <div className="col-sm-8 col-12">
                    <Card>
                        <div className="p-5">
                            <Formbuilder
                                form={this.ebayConfigurationData}
                                sync={sync}
                                onSubmit={this.onSubmit.bind(this, 'ebayimporter')}/>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }
    renderEbayAffiliateConfig(sync) {
        return (
            <div className="row">
                <div className="col-sm-4 col-12 text-md-left text-sm-left text-center">
                    <Heading>Ebay Affiliate Settings</Heading>
                </div>
                <div className="col-sm-8 col-12">
                    <Card>
                        <div className="p-5">
                            <Formbuilder
                                form={this.ebayAffilaiteConfigurationData}
                                sync={sync}
                                onSubmit={this.onSubmit.bind(this, 'ebayaffiliate')}/>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    renderWishConfig(sync) {
        return (
            <div className="row">
                <div className="col-sm-4 col-12 text-md-left text-sm-left text-center">
                    <Heading>Wish Settings</Heading>
                </div>
                <div className="col-sm-8 col-12">
                    <Card>
                        <div className="p-5">
                            <Formbuilder
                                form={this.wishConfigurationData}
                                sync={sync}
                                onSubmit={this.onSubmit.bind(this, 'wishimporter')}/>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    getDataShipping = () => {
        requests
            .getRequest("fba/test/test")
            .then(data => {
                if (data.success && data.data!=null) {
                    // console.log("data_FBA", data);
                    this.setState({
                        open_modal_response: true
                    });
                    let counter = 0;
                    for (let i = 0; i < data.data.length; i++) {
                        this.state.initial_array.push(data.data[i]['name']);
                        /*console.log("initial array = ",this.state.shipping_user_code )
                         if (data.data[i+1]['name'] === data.data[i]['name']) {
                         console.log("in am in if here see me");
                         this.state.shipping_user_code = [];
                         this.state.shipping_user_code.push(data.data[i]['name']);
                         }*/
                    }
                    // console.log("first array = ",this.state.initial_array );

                    for (let i=0; i< this.state.initial_array.length;i++){
                        // console.log("www",this.state.shipping_array_category.indexOf(this.state.initial_array[i]));
                        if (this.state.shipping_array_category.indexOf(this.state.initial_array[i])===-1){
                            // console.log("here is code");
                            this.state.shipping_array_category.push(this.state.initial_array[i]);
                        }
                    }
                    // console.log("final array = ",this.state.shipping_array_category);
                }
            });
    }
    fetchShippingCodeFromBackend = () => {
        // console.log("OPEN MODAL HERE", this.state.open_modal)
        if (this.state.open_modal_response) {
            this.setState({
                open_modal: true,
            })
        }
    }

    onSubmitOfShippingCategory() {
        this.setState({
            button_loader_fba:true
        })
        var final_sending_array = [];
        // console.log("here is the array",this.state.shipping_array_category);
        for (let i = 0; i < this.state.shipping_array_category.length; i++) {
            let my_variable = "code_fba" + (i);
            let value_of_codes = this.state[my_variable];
            // console.log("namaste",value_of_codes);
            // console.log("shopifi_code",this.state.shipping_array_category[i]);
            final_sending_array.push(
                [{"shopify_code": this.state.shipping_array_category[i]},
                    {"fba_code": value_of_codes}]
            );
        }

        // console.log("final array = ",final_sending_array);
        requests.postRequest('fba/test/shopifyDataRMQ', {data: final_sending_array}, false, true).then(response1 => {
            if (response1.success) {
                this.setState({
                    open_modal: false,
                    button_loader_fba:false
                })
                notify.success(response1.message)
            }
            else {
                notify.error(response1.message)
            }
        });
    }

    handleChange = (field, e) => {
        // console.log("value =  =",field);
        // console.log("e =  =",e);
        this.setState({[field]: e}, () => {
            // console.log(this.state);
        });
    };

    shippingSelectMethod() {

        var array_columns = []
        // console.log("array of code", this.state.shipping_user_code);
        const {code_fba} = this.state;
        // console.log(this.state.shipping_user_code.length);
        for (let i = 0; i < this.state.shipping_array_category.length; i++) {
            let yourVariable = "code_fba" + (i);
            let title = this.state[yourVariable]
            array_columns.push(<FormLayout.Group condensed>
                <TextField
                    label="Shopify Shipping Category"
                    value={this.state.shipping_array_category[i]}
                    disabled
                />
                <Select
                    id={i}
                    label="FBA shipping Category"
                    placeholder="Select"
                    options={['Standard', 'Expedited', 'Priority']}
                    value={title}
                    onChange={this.handleChange.bind(this, 'code_fba' + i)}/>
            </FormLayout.Group>)
        }
        return array_columns;
    }

    renderModalShipping() {
        return (
            <div>
                <Modal
                    title={"Manage Shipping Speed Category"}
                    open={this.state.open_modal}
                    onClose={() => {
                        this.setState({
                            open_modal: false
                        })
                    }}
                >
                    <Modal.Section>
                        <Banner title={"Set Shipping Category"} status="info">
                            <Label id={123}>
                                Map your shipping speed category with FBA shipping speed category.
                            </Label>
                        </Banner>
                        <Banner title={"for Priority Shipping Category"} status="warming">
                            <Label id={123}>
                                Make sure that you paid the <b>Fulfilment Fees</b> for <b>Priority shipping method</b>.
                            </Label>
                        </Banner>
                        <div className="pt-3">
                            <Stack vertical spacing="extraTight">
                                <FormLayout>
                                    {/*<Select
                                     id={unit_shopify_code}
                                     label="Shopify Shipping Category"
                                     placeholder="Select"
                                     options={this.state.shipping_user_code[i]}
                                     value={code_shopify}
                                     onChange={this.handleChange('code_shopify')}
                                     />*/}
                                    {this.shippingSelectMethod()}
                                    {/*<div className="pt-5">
                                     <ButtonGroup segmented>
                                     <Button icon="add"
                                     onClick={this.handleAddMore.bind(this)}
                                     primary/>
                                     <Button icon="subtract"
                                     onClick={this.handleRemove.bind(this)}
                                     destructive/>
                                     </ButtonGroup>
                                     </div>*/}

                                </FormLayout>
                            </Stack>
                        </div>

                        <div className="text-right p-3">
                            <Button
                                loading={this.state.button_loader_fba}
                                primary
                                onClick={this.onSubmitOfShippingCategory.bind(this)}
                            >
                                Save
                            </Button>
                        </div>
                    </Modal.Section>
                </Modal>
            </div>
        )
        // console.log("see im;o", this.state.code_fba)
    }

    renderfbaConfig(sync) {
        return (
            <div className="row">
                <div className="col-sm-4 col-12 text-md-left text-sm-left text-center">
                    <Heading>Fba Settings</Heading>
                </div>
                <div className="col-sm-8 col-12">
                    <Card>
                        <div className="p-5">
                            <Formbuilder
                                form={this.fbaConfigurationData}
                                sync={sync}
                                onSubmit={this.onSubmit.bind(this, 'fba')}/>
                            <div className="p-3">
                                <Button
                                    disabled={!this.state.open_modal_response}
                                    primary
                                    fullWidth={true}
                                    onClick={this.fetchShippingCodeFromBackend.bind(this)}
                                >Manage Shipping Speed Category
                                </Button>
                            </div>
                        </div>
                        {this.state.open_modal && this.renderModalShipping()}
                    </Card>
                </div>
            </div>
        );
    }
    etsyShopName(){
        for (let i = 0 ; i < this.etsyConfigurationData.length; i++){
            if (this.etsyConfigurationData[i]['title'] === 'Etsy Shop Name'){
                this.state.etsy_shop_name = this.etsyConfigurationData[i]['value']
            }
        }

    }
    renderEtsyConfig(sync) {
       this.etsyShopName()
        return (
            <div className="row">
                <div className="col-sm-4 col-12 text-md-left text-sm-left text-center">
                    <Heading>Etsy Settings</Heading>
                </div>
                <div className="col-sm-8 col-12">
                    <Card>
                        <div className="p-5">
                            <TextField label="Etsy Shop Name" disabled placeholder={this.state.etsy_shop_name}/>
                            <Formbuilder
                                form={this.etsyConfigurationData}
                                sync={sync}
                                onSubmit={this.onSubmit.bind(this, 'etsyimporter')}/>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    render() {
        let accounts = [];
        let sync = false;
        if (
            this.state.necessaryInfo !== undefined && ( this.state.necessaryInfo.sync !== undefined || !environment.isLive )
        ) {
            accounts = this.state.necessaryInfo.account_connected_array;
            if (!environment.isLive || Object.keys(this.state.necessaryInfo.sync).length > 0) sync = true;
        }
        // console.log(accounts)
        return (
            <Page title="Settings">
                <Layout>
                    <Layout.Section>
                        { !sync && <Banner title="Note" status="info" icon="notification">
                            <Label id={123}>
                                If you want to sync your products inventory or price kindly choose the
                                <span style={{color: "blue", cursor: "pointer"}}
                                      onClick={this.redirect.bind(this, '/panel/plans')}> plan</span>.
                            </Label>
                        </Banner> }
                    </Layout.Section>
                    <Layout.Section>
                        {this.renderShopifyConfigurationSection(sync)}
                    </Layout.Section>
                    <Layout.Section>
                        {accounts !== undefined &&
                        accounts.indexOf("ebayimporter") !== -1
                            ? this.renderEbayConfig(!sync)
                            : null}
                    </Layout.Section>
                    <Layout.Section>
                        {accounts !== undefined &&
                        accounts.indexOf("ebayaffiliate") !== -1
                            ? this.renderEbayAffiliateConfig(!sync)
                            : null}
                    </Layout.Section>
                    <Layout.Section>
                        {accounts !== undefined &&
                        accounts.indexOf("etsyimporter") !== -1
                            ? this.renderEtsyConfig(!sync)
                            : null}
                    </Layout.Section>
                    <Layout.Section>
                        {accounts !== undefined &&
                        accounts.indexOf("amazonimporter") !== -1
                            ? this.renderAmazonImporterConfigurationSection(!sync)
                            : null}
                    </Layout.Section>
                    <Layout.Section>
                        {accounts !== undefined &&
                        accounts.indexOf("wishimporter") !== -1
                            ? this.renderWishConfig(!sync)
                            : null}
                    </Layout.Section>
                    <Layout.Section>
                        {accounts !== undefined &&
                        accounts.indexOf("fba") !== -1
                            ? this.renderfbaConfig(!sync)
                            : null}
                    </Layout.Section>
                    <Layout.Section>
                        {accounts !== undefined &&
                        accounts.indexOf("amazonaffiliate") !== -1
                            ? this.renderAmazonAffiliateConfigurationSection(!sync)
                            : null}
                    </Layout.Section>
                </Layout>
            </Page>
        );
    }

    saveAmazonImporterConfigData(amazon_importer_configuration) {
        requests
            .postRequest("connector/get/saveConfig", {
                marketplace: "amazonimporter",
                data: amazon_importer_configuration
            })
            .then(data => {
                if (data.success) {
                    notify.success(data.message);
                } else {
                    notify.error(data.message);
                }
                this.getAmazonImporterConfigurations();
            });
    }
    saveAmazonAffiliateConfigData(amazon_affiliate_configuration) {
        requests
            .postRequest("connector/get/saveConfig", {
                marketplace: "amazonaffiliate",
                data: amazon_affiliate_configuration
            })
            .then(data => {
                if (data.success) {
                    notify.success(data.message);
                } else {
                    notify.error(data.message);
                }
                this.getAmazonAffiliateConfigurations();
            });
    }
    saveEbayAffiliateConfigData(amazon_affiliate_configuration) {
        requests
            .postRequest("connector/get/saveConfig", {
                marketplace: "ebayaffiliate",
                data: amazon_affiliate_configuration
            })
            .then(data => {
                if (data.success) {
                    notify.success(data.message);
                } else {
                    notify.error(data.message);
                }
                this.getEbayAffiliateConfigurations();
            });
    }

    saveWishImporterConfigData(amazon_importer_configuration) {
        requests
            .postRequest("connector/get/saveConfig", {
                marketplace: "wishimporter",
                data: amazon_importer_configuration
            })
            .then(data => {
                if (data.success) {
                    notify.success(data.message);
                } else {
                    notify.error(data.message);
                }
                this.getWishConfig();
            });
    }

    saveFbaImporterConfigData(amazon_importer_configuration) {
        requests
            .postRequest("connector/get/saveConfig", {
                marketplace: "fba",
                data: amazon_importer_configuration
            })
            .then(data => {
                // console.log(data);
                if (data.success) {
                    notify.success(data.message);
                } else {
                    notify.error(data.message);
                }
                this.getFbaConfig();
            });
    }

    shopifyConfigurationChange(index, value) {
        if (this.shopifyConfigurationData[index].code === "product_sync") {
            this.state.show_shopify_child_component["sync_field"] =
                value !== "enable";
        }
        this.state.shopify_configuration_updated = true;
        this.state.shopify_configuration[
            this.shopifyConfigurationData[index].code
            ] = value;
        this.updateState();
    }

    shopifyConfigurationCheckboxChange(index, optionIndex, value) {
        this.state.shopify_configuration_updated = true;
        const option = this.shopifyConfigurationData[index].options[optionIndex]
            .value;
        const valueIndex = this.state.shopify_configuration[
            this.shopifyConfigurationData[index].code
            ].indexOf(option);
        if (value) {
            if (valueIndex === -1) {
                this.state.shopify_configuration[
                    this.shopifyConfigurationData[index].code
                    ].push(option);
            }
        } else {
            if (valueIndex !== -1) {
                this.state.shopify_configuration[
                    this.shopifyConfigurationData[index].code
                    ].splice(valueIndex, 1);
            }
        }
        this.updateState();
    }

    saveShopifyConfigData() {
        requests
            .postRequest("connector/get/saveConfig", {
                marketplace: "shopify",
                data: this.state.shopify_configuration
            })
            .then(data => {
                if (data.success) {
                    this.setState({shopify_configuration_updated: false});
                    notify.success(data.message);
                } else {
                    notify.error(data.message);
                }
                this.getShopifyConfigurations();
            });
    }

    saveEbayConfigData(ebay_configuration) {
        requests
            .postRequest("connector/get/saveConfig", {
                marketplace: "ebayimporter",
                data: ebay_configuration
            })
            .then(data => {
                if (data.success) {
                    this.setState({ebay_configuration_updated: false});
                    notify.success(data.message);
                } else {
                    notify.error(data.message);
                }
                this.getEbayConfig();
            });
    }

    saveEtsyConfigData(etsy_configuration) {
        requests
            .postRequest("connector/get/saveConfig", {
                marketplace: "etsyimporter",
                data: etsy_configuration
            })
            .then(data => {
                if (data.success) {
                    this.setState({etsy_configuration_updated: false});
                    notify.success(data.message);
                } else {
                    notify.error(data.message);
                }
                this.getEtsyConfig();
            });
    }

    saveProfileData() {
        requests
            .getRequest("core/user/updateuser", this.state.account_information)
            .then(data => {
                if (data.success) {
                    this.state.account_information_updated = false;
                    notify.success(data.message);
                } else {
                    notify.error(data.message);
                }
                this.getUserDetails();
            });
    }

    accountInfoChange(key, value) {
        this.state.account_information[key] = value;
        this.state.account_information_updated = true;
        this.updateState();
    }

    redirect(url) {
        this.props.history.push(url);
    }

    updateState() {
        const state = this.state;
        this.setState(state);
    }
}
