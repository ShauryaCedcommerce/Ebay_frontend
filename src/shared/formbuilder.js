import React, { Component } from "react";

import {
	TextField,
	Checkbox,
	RadioButton,
	Select,
	Button,
	Label
} from "@shopify/polaris";

export class Formbuilder extends Component {
	constructor(props) {
		super(props);
		this.state = {
			form: props.form,
			updated: false,
            sync: props.sync !== undefined? props.sync:false
		};
	}

	render() {
		return (
			<div className="row">
				{this.state.form.map((field, index) => {
					switch (field.type) {
						case "textfield":
							return (
								<div
									className="col-12 mt-1 mb-1"
									key={index}
								>
									<TextField
										label={field.title}
										value={field.value}
										onChange={this.handleChange.bind(
											this,
											index
										)}
									 readOnly={false}/>
								</div>
							);
						case "select":
                            return (
								<div
									className="col-12 mt-1 mb-1"
									key={index}
								>
									<Select
										label={field.title}
										options={field.options}
                                        labelInline
                                        disabled={this.state.sync && (
											field.code === 'auto_sync' ||
											field.code === 'inventory_sync' ||
											field.code === 'price_sync' ||
											field.code === 'auto_sync_code')}
										onChange={this.handleChange.bind(
											this,
											index
										)}
										value={field.value}
									/>
								</div>
							);
						case "checkbox":
							return (
								<div
									className="col-12 mt-1 mb-1"
									key={index}
								>
									<Label>{field.title}</Label>
									<div className="row">
										{field.options.map(option => {
											return (
												<div
													className="col-md-4 col-sm-6 col-12"
													key={field.options.indexOf(option)}
												>
													<Checkbox
														checked={field.value.indexOf(option.value) !== -1}
														label={option.label}
														onChange={this.handleOptionsChange.bind(
															this,
															index,
															field.options.indexOf(option)
														)}
													/>
												</div>
											);
										})}
									</div>
								</div>
							);
						case "radio":
							return (
								<div
									className="col-12 mt-1 mb-1"
									key={index}
								>
									<Label>{field.title}</Label>
									<div className="row">
										{field.options.map(option => {
											return (
												<div
													className="col-md-4 col-sm-6 col-12"
													key={field.options.indexOf(option)}
												>
													<RadioButton
														label={option.label}
														checked={option.value === field.value}
														id={option.key}
														name={option.key}
														onChange={this.handleOptionsChange.bind(
															this,
															index,
															field.options.indexOf(option)
														)}
													/>
												</div>
											);
										})}
									</div>
								</div>
							);
					}
				})}
				<div className="col-12 text-right mt-3">
					<Button
						onClick={() => {
							this.submitForm();
						}}
						disabled={!this.state.updated}
						primary
					>
						Save
					</Button>
				</div>
			</div>
		);
	}

	componentWillReceiveProps(nextProps, nextContext) {
		this.setState({
			form: nextProps.form
		});
	}

	submitForm() {
		let { form } = this.state;
		let submitObj = {};
		Object.keys(form).forEach(e => {
            submitObj[form[e]['code']] = form[e]['value'];
		});
        this.setState({updated:false});
		this.props.onSubmit(submitObj);
	}

	handleChange(fieldIndex, value) {
		this.state.form[fieldIndex].value = value;
		this.state.updated = true;
		const state = this.state;
		this.setState(state);
	}

	handleOptionsChange(fieldIndex, optionIndex, value) {
		const keyValue = this.state.form[fieldIndex].options[optionIndex].value;
        this.state.updated = true;
        switch (this.state.form[fieldIndex].type) {
			case "checkbox":
				const keyIndex = this.state.form[fieldIndex].value.indexOf(keyValue);
				if (value) {
					if (keyIndex === -1) {
						this.state.form[fieldIndex].value.push(keyValue);
					}
				} else {
					if (keyIndex !== -1) {
						this.state.form[fieldIndex].value.splice(keyIndex, 1);
					}
				}
				break;
			case "radio":
				this.state.form[fieldIndex].value = keyValue;
				break;
		}
		const state = this.state;
		this.setState(state);
	}
}
