import React, { Component } from "react";

import { Page, Select, Pagination, Label, Card } from "@shopify/polaris";

import { requests } from "../../../services/request";
import { notify } from "../../../services/notify";
import SmartDataTable from "../../../shared/smart-table";
import { capitalizeWord } from "./static-functions";

export class Profiling extends Component {
	filters = {
		column_filters: {}
	};
	gridSettings = {
		activePage: 1,
		count: 10
	};
	pageLimits = [
		{ label: 10, value: 10 },
		{ label: 20, value: 20 },
		{ label: 30, value: 30 },
		{ label: 40, value: 40 },
		{ label: 50, value: 50 }
	];
	visibleColumns = [
		"name",
		"source",
		"target",
		"query",
		"profile_id",
		"product_count"
	];
	customButton = ["profile_id"]; // button
	hideFilters = ["profile_id", "query", "source"];
	columnTitles = {
		name: {
			title: "Name",
			sortable: true
		},
		source: {
			title: "Source",
			sortable: true
		},
		targetCategory: {
			title: "Collection",
			sortable: true
		},
		query: {
			title: "Query",
			sortable: true
		},
		product_count: {
			title: "Items",
			sortable: true
		},
		profile_id: {
			title: "Detail",
			label: "View", // button Label
			id: "profile_id",
			sortable: false
		}
	};
	totalProfiles = 0;

	constructor() {
		super();
		this.state = {
			profiles: [],
			totalPage: 0
		};
		this.getProfiles();
		this.operations = this.operations.bind(this);
	}
	operations(event, id) {
		switch (id) {
			case "profile_id":
				this.redirect("/panel/profiling/view?id=" + event);
				break;
			default:
				console.log("Default Case");
		}
	}

	getProfiles() {
		requests
			.getRequest(
				"connector/profile/getAllProfiles",
				Object.assign({}, this.gridSettings, this.prepareFilterObject())
			)
			.then(data => {
				if (data.success) {
					this.setState({ totalPage: data.data.count });
					this.state["profiles"] = this.modifyProfilesData(data.data.rows);
					this.totalProfiles = data.data.count;
					this.updateState();
				} else {
					notify.error(data.message);
				}
			});
	}

	modifyProfilesData(profiles) {
		let profilesList = [];
		for (let i = 0; i < profiles.length; i++) {
			profilesList.push({
				name: profiles[i].name,
				source: capitalizeWord(profiles[i].source),
				product_count:
					profiles[i]["product_count"] !== undefined
						? profiles[i]["product_count"]
						: "N/A",
				targetCategory: profiles[i].targetCategory,
				query: this.preapreUser(profiles[i].query),
				profile_id: profiles[i].profile_id
			});
		}
		return profilesList;
	}

	preapreUser = str => {
		let equals = "==";
		let nequals = "!=";
		let like = "%LIKE%";
		let nlike = "!%LIKE%";
		let gt = ">";
		let lt = "<";
		let gte = ">=";
		let lte = "<=";
		str = str.replace(new RegExp(equals, "g"), "Equals");
		str = str.replace(new RegExp(nequals, "g"), "Not Equals");
		str = str.replace(new RegExp(nlike, "g"), "Not Contains");
		str = str.replace(new RegExp(like, "g"), "Contains");
		str = str.replace(new RegExp(gt, "g"), "greater then");
		str = str.replace(new RegExp(gte, "g"), "greater then equals to");
		str = str.replace(new RegExp(lte, "g"), "less then equals to");
		str = str.replace(new RegExp(lt, "g"), "less then");
		str = str.replace(new RegExp("&&", "g"), "And");
		return str;
	};

	prepareFilterObject() {
		const filters = {};
		for (let i = 0; i < Object.keys(this.filters.column_filters).length; i++) {
			const key = Object.keys(this.filters.column_filters)[i];
			if (this.filters.column_filters[key].value !== "") {
				filters[
					"filter[" +
						key +
						"][" +
						this.filters.column_filters[key].operator +
						"]"
				] = this.filters.column_filters[key].value;
			}
		}
		return filters;
	}

	render() {
		return ( 
			<Page
				primaryAction={{
					content: "Create Profile",
					onClick: () => {
						this.redirect("/panel/profiling/create");
					}
				}}
				title="Import Profiles"
			>
				<Card>
					<div className="p-5">
						<div className="row mt-3">
							<div className="col-12 p-3 text-right">
								<Label>Total {this.totalProfiles} profiles</Label>
							</div>
							<div className="col-12">
								<SmartDataTable
									data={this.state.profiles}
									multiSelect={false}
									className="ui compact selectable table"
									count={this.gridSettings.variantsCount}
									activePage={this.gridSettings.activePage}
									visibleColumns={this.visibleColumns}
									customButton={this.customButton} // button
									operations={this.operations} //button
									getVisibleColumns={event => {
										this.visibleColumns = event;
									}}
									hideFilters={this.hideFilters}
									columnTitles={this.columnTitles}
									showColumnFilters={true}
									rowActions={{
										edit: false,
										delete: true
									}}
									deleteRow={row => {
										if (window.confirm("Do You Want To Delete This Profile?"))
											this.deleteProfile(row);
									}}
									columnFilters={filters => {
										this.filters.column_filters = filters;
										this.getProfiles();
									}}
									sortable
								/>
							</div>
							<div className="col-6 text-right">
								<Pagination
									hasPrevious={1 < this.gridSettings.activePage}
									onPrevious={() => {
										this.gridSettings.activePage--;
										this.getProfiles();
									}}
									hasNext={
										this.state.totalPage / this.gridSettings.count >
										this.gridSettings.activePage
									}
									onNext={() => {
										this.gridSettings.activePage++;
										this.getProfiles();
									}}
								/>
							</div>
							<div className="col-md-2 col-sm-2 col-6">
								<Select
									options={this.pageLimits}
									value={this.gridSettings.count}
									onChange={this.pageSettingsChange.bind(this)}
								/>
							</div>
						</div>
					</div>
				</Card>
			</Page>
		);
	}

	deleteProfile = row => {
		requests
			.getRequest("connector/profile/delete?id=" + row["profile_id"])
			.then(e => {
				if (e.success) {
					notify.success(e.message);
				} else {
					notify.error(e.message);
				}
				this.getProfiles();
			});
	};

	pageSettingsChange(event) {
		this.gridSettings.count = event;
		this.gridSettings.activePage = 1;
		this.getProfiles();
	}

	updateState() {
		const state = this.state;
		this.setState(state);
	}

	redirect(url) {
		this.props.history.push(url);
	}
}
