import React, { Component } from "react";
import {
	Button,
	Select,
	Stack,
	TextField,
	Modal,
	DatePicker
} from "@shopify/polaris";
import { isUndefined } from "util";

class Filter extends Component {
	filterConditions = [
		{ label: "equals", value: "1" },
		{ label: "not equals", value: "2" },
		{ label: "contains", value: "3" },
		{ label: "does not contains", value: "4" },
		{ label: "starts with", value: "5" },
		{ label: "ends with", value: "6" }
	];
	filterInt = [
		{ label: "equals", value: "1" },
		{ label: "not equals", value: "2" },
        // {label: "greater than equal to", value: "3"},
        // {label: "less than equal to", value: "4"},
	];

	constructor(props) {
		super(props);
		let today_date = new Date();
		this.state = {
			active: false,
			columnFilterName: props.columnFilterName,
			columnFilterNameValue: {
				name: "",
				condition: "",
				value: "",
				special_case: "no"
			},
			columnFilterNameArray: [],
			predefineFilters: this.modifiedPredefineFilter(
				props.predefineFilters,
				props.marketplace
			),
			today: {
				end: new Date(),
				start: new Date()
			},
			dd: today_date.getDate(),
			mm: today_date.getMonth(), //January is 0!
			yyyy: today_date.getFullYear(),
			marketplace: props.marketplace
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.marketplace !== this.state.marketplace) {
			this.setState({
				marketplace: nextProps.marketplace,
				columnFilterNameValue: {
					name: "",
					condition: "",
					value: "",
					special_case: "no"
				},
				columnFilterNameArray: [],
				columnFilterName: nextProps.columnFilterName,
				predefineFilters: this.modifiedPredefineFilter(
					nextProps.predefineFilters,
					nextProps.marketplace
				)
			});
		}
	}

	modifiedPredefineFilter = (filter, marketplace) => {
		if (filter === undefined) return undefined;
		filter = JSON.parse(JSON.stringify(filter));
		filter.forEach((e, i) => {
			if (e.value === "datePicker" && marketplace !== "amazonimporter") {
				filter.splice(i, 1);
			}
		});
		return filter;
	};

	render() {
		return (
			<div>
				<Button onClick={this.togglePopover} disclosure>
					Filter
				</Button>
				<Modal
					title={"Prepare Filter"}
					open={this.state.active}
					primaryAction={{
						content: "Add Filter",
						onClick: () => {
							this.handleButtonFilterSubmit();
						},
						disabled:
							this.state.columnFilterNameValue.name === "" ||
							this.state.columnFilterNameValue.condition === "" ||
							this.state.columnFilterNameValue.value.trim() === ""
					}}
					onClose={() => {
						this.setState({ active: false });
					}}
				>
					<Modal.Section>
						<div className="p-3">
							<Stack wrap={true}>
								<Select
									label="Title"
									placeholder={"Please Select"}
									options={
										this.state.predefineFilters !== undefined
											? this.state.predefineFilters
											: this.state.columnFilterName
									}
									value={this.state.columnFilterNameValue.name}
									onChange={this.handleButtonFilterChange.bind(this, "name")}
								/>
								{this.state.columnFilterNameValue.special_case === "yes" &&
									this.specialCaseHandle(this.state.columnFilterNameValue.name)}
								{this.state.columnFilterNameValue.name !== "" &&
									this.state.columnFilterNameValue.special_case === "no" && (
										<Select
											label="Condition"
											disabled={this.state.columnFilterNameValue.name === ""}
											placeholder={"select Condition"}
											options={
												!this.state.columnFilterNameValue.isInt
													? this.filterConditions
													: this.filterInt
											}
											value={this.state.columnFilterNameValue.condition}
											onChange={this.handleButtonFilterChange.bind(
												this,
												"condition"
											)}
										/>
									)}
								{this.state.columnFilterNameValue.condition !== "" &&
									this.state.columnFilterNameValue.special_case === "no" && (
										<div onKeyUp={this.handleEnterPress}>
											<TextField
												label="Value"
												disabled={
													this.state.columnFilterNameValue.condition === ""
												}
												placeholder={"Enter Value"}
												value={this.state.columnFilterNameValue.value}
												onChange={this.handleButtonFilterChange.bind(
													this,
													"value"
												)}
												readOnly={false}
											/>
										</div>
									)}
							</Stack>
						</div>
					</Modal.Section>
				</Modal>
			</div>
		);
	}

	specialCaseHandle = arg => {
		switch (arg) {
			case "datePicker":
				return (
					<React.Fragment>
						<DatePicker
							month={this.state.mm}
							year={this.state.yyyy}
							multiMonth={true}
							allowRange={true}
							selected={this.state.today}
							onChange={this.handleChange}
							onMonthChange={this.handleMonthChange}
						/>
					</React.Fragment>
				);
			case "uploaded":
				return (
					<React.Fragment>
						<Select
							label={"Status"}
							options={[
								{ label: "Uploaded", value: "1" },
								{ label: "Not Uploaded", value: "0" }
							]}
							placeholder={"Choose"}
							value={this.state.columnFilterNameValue.value}
							onChange={e => {
								let columnFilterNameValue = this.state.columnFilterNameValue;
								columnFilterNameValue.condition = "upload_status";
								columnFilterNameValue.value = e;
								this.setState({ columnFilterNameValue: columnFilterNameValue });
							}}
						/>
					</React.Fragment>
				);
			case "type":
				return(
					<React.Fragment>
						<Select
							label="Product Type"
							options={[
								{label:"Simple",value:"simple"},
								{label:"Variant",value:"variant"}
							]}
							placeholder="Choose"
							value={this.state.columnFilterNameValue.value}
							onChange={
								e=>{
									let columnFilterNameValue = this.state.columnFilterNameValue;
                                    columnFilterNameValue.condition = "product_type";
                                    columnFilterNameValue.value = e;
                                    this.setState({
                                        columnFilterNameValue:columnFilterNameValue
									});
								}}
						/>
					</React.Fragment>
				);
            case "financial_status":
                return(
					<React.Fragment>
						<Select
							label="Select Shopify Status"
							options={[
                                {label:"Paid",value:"paid"},
                                {label:"Unpaid",value:"unpaid"},
                                {label:"Refunded",value:"refunded"}
                            ]}
							placeholder="Choose"
							value={this.state.columnFilterNameValue.value}
							onChange={
                                e=>{
                                    let columnFilterNameValue = this.state.columnFilterNameValue;
                                    columnFilterNameValue.condition = "3";
                                    columnFilterNameValue.value = e;
                                    this.setState({
                                        columnFilterNameValue:columnFilterNameValue
                                    });
                                }}
						/>
					</React.Fragment>
                );
            case "processing_status":
                return(
					<React.Fragment>
						<Select
							label="Select FBA Status"
							options={[
                                {label:"Complete",value:"Fulfilled"},
                                {label:"Cancelled",value:"Cancelled"},
                                {label:"Processing",value:"Processing"},
                                {label:"Pending",value:"Pending"},

                            ]}
							placeholder="Choose"
							value={this.state.columnFilterNameValue.value}
							onChange={
                                e=>{
                                    let columnFilterNameValue = this.state.columnFilterNameValue;
                                    columnFilterNameValue.condition = "3";
                                    columnFilterNameValue.value = e;
                                    this.setState({
                                        columnFilterNameValue:columnFilterNameValue
                                    });
                                }}
						/>
					</React.Fragment>
                )
			default:
				let val = this.state.columnFilterNameValue;
				val.special_case = "no";
				this.setState({ columnFilterNameValue: val });
		}
	};

	handleEnterPress = event => {
		const enterKeyPressed = event.keyCode === 13;
		if (
			enterKeyPressed &&
			!(
				this.state.columnFilterNameValue.name === "" ||
				this.state.columnFilterNameValue.condition === "" ||
				this.state.columnFilterNameValue.value.trim() === ""
			)
		) {
			this.handleButtonFilterSubmit();
		}
	};

	togglePopover = () => {
		this.setState(({ active }) => {
			return { active: !active };
		});
	};

	handleButtonFilterChange = (fieldName, value) => {
		let { columnFilterNameValue } = this.state;
		let columnFilterName = [];
		if (isUndefined(this.state.predefineFilters)) {
			columnFilterName = this.state.columnFilterName;
		} else {
			columnFilterName = this.state.predefineFilters;
		}
		columnFilterName.forEach(key => {
			if (key.value === value) {
				if (key.type === "int" && fieldName === "name") {
					columnFilterNameValue.isInt = true;
					columnFilterNameValue.special_case = "no";
					columnFilterNameValue.condition = "";
				} else if (key.special_case === "yes") {
					columnFilterNameValue.special_case = "yes";
					columnFilterNameValue.isInt = false;
				} else {
					columnFilterNameValue.special_case = "no";
					columnFilterNameValue.isInt = false;
				}
			}
		});
		columnFilterNameValue[fieldName] = value;
		this.setState({ columnFilterNameValue: columnFilterNameValue });
	};

	handleButtonFilterSubmit = () => {
		let { columnFilterNameValue } = this.state;
		let { columnFilterNameArray } = this.state;
		columnFilterNameArray.forEach((e, i) => {
			if (e.name === columnFilterNameValue["name"]) {
				columnFilterNameArray.splice(i, 1);
			}
		});
		columnFilterNameArray.push(columnFilterNameValue);
		columnFilterNameValue = {
			name: "",
			condition: "",
			value: "",
			isInt: false,
			special_case: "no"
		};
		this.setState({
			columnFilterNameValue: columnFilterNameValue,
			columnFilterNameArray: columnFilterNameArray
		});
		this.props.handleFilterEvent(columnFilterNameArray);
		this.togglePopover();
	};

	handleChange = value => {
		let { columnFilterNameValue } = this.state;
		let start = new Date(value.start);
		let end = new Date(value.end);
		let month_start = start.getMonth() + 1;
		let day_start = start.getDate();
		let month_end = end.getMonth() + 1;
		let day_end = end.getDate();
		if (month_start < 10) {
			month_start = "0" + month_start;
		}
		if (day_start < 10) {
			day_start = "0" + day_start;
		}
		if (month_end < 10) {
			month_end = "0" + month_end;
		}
		if (day_end < 10) {
			day_end = "0" + day_end;
		}
		start = start.getFullYear() + "-" + month_start + "-" + day_start;
		end = end.getFullYear() + "-" + month_end + "-" + day_end;
		let query = "date from " + start + " to " + end;
		columnFilterNameValue["condition"] = start;
		columnFilterNameValue["value"] = end;
		this.setState({
			today: value,
			columnFilterNameValue: columnFilterNameValue
		});
	};

	handleMonthChange = (month, year) => {
		this.setState({
			mm: month,
			yyyy: year
		});
	};
}

export default Filter;
