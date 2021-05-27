import React, { Component } from "react";
import { requests } from "../../services/request";
import { isUndefined } from "util";
import { notify } from "../../services/notify";
import { modifyOptionsData } from "../../components/Panel/Components/static-functions";
import {
	Button,
	Card,
	Checkbox,
	Heading,
	Label,
	Layout,
	Page,
	Select,
	TextField
} from "@shopify/polaris";

class ConfigShared extends Component {
	shopifyConfigurationData = [];
	amazonImporterConfigurationData = [];

	constructor(props) {
		super(props);
		this.state = {
			account_information: {
				username: "",
				email: ""
			},
			google_configuration: {},
			shopify_configuration: {},
			amazon_importer_configuration: {},
			google_configuration_updated: false,
			shopify_configuration_updated: false,
			amazon_importer_configuration_updated: false,
			account_information_updated: false
		};
		this.getShopifyConfigurations();
		this.getAmazonImporterConfigurations();
	}
	getAmazonImporterConfigurations() {
		requests
			.getRequest("connector/get/config", { marketplace: "amazonimporter" })
			.then(data => {
				if (data.success) {
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

	getShopifyConfigurations() {
		requests
			.getRequest("connector/get/config", { marketplace: "shopify" })
			.then(data => {
				if (data.success) {
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
		for (let i = 0; i < data.length; i++) {
			this.state[configKey][data[i].code] =
				typeof data[i].value === "object" ? "" : data[i].value;
			if (!isUndefined(data[i].options)) {
				data[i].options = modifyOptionsData(data[i].options);
			}
		}
		return data;
	}

	renderShopifyConfigurationSection() {
		return (
			<div className="col-sm-6 col-12">
				<Card title="Shopify Configuration">
					<div className="row p-5">
						{this.shopifyConfigurationData.map(config => {
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
												placeholder={"Select"}
												value={this.state.shopify_configuration[config.code]}
												onChange={this.shopifyConfigurationChange.bind(
													this,
													this.shopifyConfigurationData.indexOf(config)
												)}
											/>
										</div>
									);
									break;
								case "checkbox":
									return (
										<div
											className="col-12 pt-2 pb-2"
											key={this.shopifyConfigurationData.indexOf(config)}
										>
											<Label>{config.title}</Label>
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
																	this.shopifyConfigurationData.indexOf(config),
																	config.options.indexOf(option)
																)}
															/>
														</div>
													);
												})}
											</div>
										</div>
									);
									break;
								default:
									return (
										<div
											className="col-12 pt-2 pb-2"
											key={this.shopifyConfigurationData.indexOf(config)}
										>
											<TextField
												label={config.title}
												placeholder={config.title}
												value={this.state.shopify_configuration[config.code]}
												onChange={this.shopifyConfigurationChange.bind(
													this,
													this.shopifyConfigurationData.indexOf(config)
												)}
											/>
										</div>
									);
									break;
							}
						})}
						{/*<div className="col-12 text-right pt-2 pb-1">*/}
						{/*<Button*/}
						{/*// disabled={!this.state.shopify_configuration_updated}*/}
						{/*onClick={() => {*/}
						{/*this.saveShopifyConfigData();*/}
						{/*}}*/}
						{/*primary>Save</Button>*/}
						{/*</div>*/}
					</div>
				</Card>
			</div>
		);
	}

	renderAmazonImporterConfigurationSection() {
		return (
			<div className="col-sm-6 col-12">
				<Card title="Amazon Importer Configuration">
					<div className="row p-5">
						{this.amazonImporterConfigurationData.map(config => {
							switch (config.type) {
								case "select":
									return (
										<div
											className="col-12 pt-2 pb-2"
											key={this.amazonImporterConfigurationData.indexOf(config)}
										>
											<Select
												options={config.options}
												label={config.title}
												placeholder={config.title}
												value={
													this.state.amazon_importer_configuration[config.code]
												}
												onChange={this.amazonImporterConfigurationChange.bind(
													this,
													this.amazonImporterConfigurationData.indexOf(config)
												)}
											/>
										</div>
									);
								case "checkbox":
									return (
										<div
											className="col-12 pt-2 pb-2"
											key={this.amazonImporterConfigurationData.indexOf(config)}
										>
											<Label>{config.title}</Label>
											<div className="row">
												{config.options.map(option => {
													return (
														<div
															className="col-md-6 col-sm-6 col-12 p-1"
															key={config.options.indexOf(option)}
														>
															<Checkbox
																checked={
																	this.state.amazon_importer_configuration[
																		config.code
																	].indexOf(option.value) !== -1
																}
																label={option.label}
																onChange={this.amazonImporterConfigurationCheckboxChange.bind(
																	this,
																	this.amazonImporterConfigurationData.indexOf(
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
								default:
									return (
										<div
											className="col-12 pt-2 pb-2"
											key={this.amazonImporterConfigurationData.indexOf(config)}
										>
											<TextField
												label={config.title}
												placeholder={config.title}
												value={
													this.state.amazon_importer_configuration[config.code]
												}
												onChange={this.amazonImporterConfigurationChange.bind(
													this,
													this.amazonImporterConfigurationData.indexOf(config)
												)}
											/>
										</div>
									);
							}
						})}
						{/*<div className="col-12 text-right pt-2 pb-1">*/}
						{/*<Button*/}
						{/*disabled={!this.state.amazon_importer_configuration_updated}*/}
						{/*onClick={() => {*/}
						{/*this.saveAmazonImporterConfigData();*/}
						{/*}}*/}
						{/*primary>Save</Button>*/}
						{/*</div>*/}
					</div>
				</Card>
			</div>
		);
	}

	render() {
		return (
			<Page title="Configuration">
				<div className="row">
					{this.renderShopifyConfigurationSection()}
					{this.renderAmazonImporterConfigurationSection()}
					<div className="col-12 p-5 text-center">
						<Button
							onClick={() => {
								this.saveAmazonImporterConfigData();
								this.saveShopifyConfigData();
							}}
							// disabled={!this.state.amazon_importer_configuration_updated}
							primary
						>
							Submit
						</Button>
					</div>
				</div>
			</Page>
		);
	}

	amazonImporterConfigurationChange(index, value) {
		this.state.amazon_importer_configuration_updated = true;
		this.state.amazon_importer_configuration[
			this.amazonImporterConfigurationData[index].code
		] = value;
		this.updateState();
	}

	amazonImporterConfigurationCheckboxChange(index, optionIndex, value) {
		this.state.amazon_importer_configuration_updated = true;
		const option = this.amazonImporterConfigurationData[index].options[
			optionIndex
		].value;
		const valueIndex = this.state.amazon_importer_configuration[
			this.amazonImporterConfigurationData[index].code
		].indexOf(option);
		if (value) {
			if (valueIndex === -1) {
				this.state.amazon_importer_configuration[
					this.amazonImporterConfigurationData[index].code
				].push(option);
			}
		} else {
			if (valueIndex !== -1) {
				this.state.amazon_importer_configuration[
					this.amazonImporterConfigurationData[index].code
				].splice(valueIndex, 1);
			}
		}
		this.updateState();
	}

	saveAmazonImporterConfigData() {
		requests
			.postRequest("connector/get/saveConfig", {
				marketplace: "amazonimporter",
				data: this.state.amazon_importer_configuration
			})
			.then(data => {
				if (data.success) {
					notify.success(data.message);
					this.props.checkConfig("amazonimporter");
				} else {
					notify.error(data.message);
				}
				this.getAmazonImporterConfigurations();
			});
	}

	shopifyConfigurationChange(index, value) {
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
					//  notify.success(data.message);
				} else {
					// notify.error(data.message);
				}
				this.getShopifyConfigurations();
			});
	}

	importConfigurationChange(key, value) {
		this.state.importer_configuration_updated = true;
		this.state.importer_configuration[key] = value;
		this.updateState();
	}

	defaultProfileChange(value, event) {
		this.state.importer_configuration_updated = true;
		const itemIndex = this.state.importer_configuration.default_profile_settings.indexOf(
			value
		);
		if (event) {
			if (itemIndex === -1) {
				this.state.importer_configuration.default_profile_settings.push(value);
			}
		} else {
			if (itemIndex !== -1) {
				this.state.importer_configuration.default_profile_settings.splice(
					itemIndex,
					1
				);
			}
		}
		this.updateState();
	}

	accountInfoChange(key, value) {
		this.state.account_information[key] = value;
		this.state.account_information_updated = true;
		this.updateState();
	}

	updateState() {
		const state = this.state;
		this.setState(state);
	}
}

export default ConfigShared;
