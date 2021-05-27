import React, { Component } from "react";
import { Page, Card, Pagination, Select, Label,Modal,Banner } from "@shopify/polaris";
import * as queryString from "query-string";
import { requests } from "../../../../services/request";
import { notify } from "../../../../services/notify";
import { faArrowsAltH, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isUndefined } from "util";
import { paginationShow } from "../static-functions";
import SmartDataTable from "../../../../shared/smartTable";

class ViewProfile extends Component {

	//--------------OLD--------------------
	// filters = {
	// 	column_filters: {}
	// };
	// gridSettings = {
	// 	activePage: 1,
	// 	count: 5
	// };
	// pageLimits = [
	// 	{ label: 5, value: 5 },
	// 	{ label: 10, value: 10 },
	// 	{ label: 15, value: 15 },
	// 	{ label: 20, value: 20 },
	// 	{ label: 25, value: 25 }
	// ];
    //--------------OLD--------------------

    filters = {
        full_text_search: "",
        marketplace: "all",
        single_column_filter: [],
        column_filters: {}
    };

    gridSettings = {
        count: "20",
        activePage: 1
    };

    pageLimits = [
        { label: 10, value: "10" },
        { label: 20, value: "20" },
        { label: 30, value: "30" },
        { label: 40, value: "40" },
        { label: 50, value: "50" },
        { label: 500, value: "500" },
        { label: 2000, value: "2000 *(Slow)" },
    ];

    massActions = [
        { label: "Upload", value: "upload" },
    ];

    hideFilters = [
        "main_image",
        "long_description",
        "type",
        "upload_status",
        "inventory"
    ];

    predefineFilters = [
        { label: "Title", value: "title", type: "string", special_case: "no" },
        { label: "SKU", value: "sku", type: "string", special_case: "no" },
        { label: "ASIN", value: "source_variant_id", type: "string", special_case: "no" },
        { label: "Price", value: "price", type: "int", special_case: "no" },
        { label: "Quantity", value: "quantity", type: "int", special_case: "no" },
        { label:"Type", value:"type", type:"type", special_case:"yes"},
        { label:"Country", value:"site", type:"string", special_case:"yes"},
        {
            label: "Date Picker",
            value: "datePicker",
            type: "date-picker",
            special_case: "yes"
        },
        {
            label: "Status",
            value: "uploaded",
            type: "uploaded",
            special_case: "yes"
        }
    ];

	visibleColumns = ["source_variant_id","title","main_image", "price","type","quantity"];
	imageColumns = ["main_image"];
	columnTitles = {
        main_image: {
            title: "Image",
            sortable: false,
            type:"image"
        },
        source_variant_id: {
			title: "ID",
			sortable: false
		},
		title: {
			title: "Title",
			sortable: false
		},
		type: {
			title: "Type",
			sortable: false
		},
		quantity: {
			title: "Quantity",
			sortable: false
		},
		sku: {
			title: "Sku",
			sortable: false
		},
		price: {
			title: "Price",
			sortable: false
		},
		weight: {
			title: "Weight",
			sortable: false
		},
		weight_unit: {
			title: "Weight Unit",
			sortable: false
		}
	};

	constructor(props) {
		super(props);
		this.state = {

            product_grid_collapsible: "",
            tempProductData: [],
            // products: [],
            appliedFilters: {},
            installedApps: [],
            selectedApp: 0,
            selectedProducts: [],
            deleteProductData: false,
            toDeleteRow: {},
            // totalPage: 0,
            totalMainCount: 0,
            // showLoaderBar: true,
            bulkUpdateModal:false,
            selectedMarketplace:'',
            shownMarketplace:[],
            hideLoader: false,
            // pagination_show: 0,
            selectedUploadModal: false,
            selectUpload: { option: [], value: "" },
            parent_sku: 0,
            child_sku: 0,
            requiredParamNotRecieved: true,
            csvUrl:"",
            uploadcsvModal:false,


			// -------------------------------------
			queryParams: queryString.parse(props.location.search),
			data: {
				name: { name: "Name", value: "" },
				source: { name: "Source", value: "" },
				target: { name: "Target", value: "" },
				cat: { name: "Category", value: "" },
				query: { name: "Query", value: "" }
			},
			products: [],
			attributeMapping: [],
			marketplaceAttributes: [],
			totalPage: 0,
			pagination_show: 0
		};
		this.getProducts();
	}


    prepareFilterObject() {
        this.state.appliedFilters = {};
        if (this.filters.marketplace !== "all") {
            this.state.appliedFilters[
                "filter[source_marketplace][1]"
                ] = this.filters.marketplace;
        }
        if (this.filters.full_text_search !== "") {
            this.state.appliedFilters["search"] = this.filters.full_text_search;
        }
        this.filters.single_column_filter.forEach((e, i) => {
            switch (e.name) {
                case "title":
                case "site":
                case "long_description":
                    this.state.appliedFilters[
                    "filter[details." + e.name + "][" + e.condition + "]"
                        ] = e.value;
                    break;
                case "source_variant_id":
                case "sku":
                case "price":
                case "weight":
                case "weight_unit":
                case "main_image":
                case "quantity":
                    this.state.appliedFilters[
                    "filter[variants." + e.name + "][" + e.condition + "]"
                        ] = e.value;
                    break;
                case "datePicker":
                    this.state.appliedFilters["filter[details.created_at][7][from]"] =
                        e.condition; // start date
                    this.state.appliedFilters["filter[details.created_at][7][to]"] =
                        e.value; // end date
                    break;
                case "uploaded":
                    this.state.appliedFilters["uploaded"] = e.value;
                    break;
                case "type":
                    this.state.appliedFilters["filter[details.type][1]"] = e.value;
                    break;

            }
        });
        for (let i = 0; i < Object.keys(this.filters.column_filters).length; i++) {
            const key = Object.keys(this.filters.column_filters)[i];
            if (this.filters.column_filters[key].value !== "") {
                switch (key) {
                    case "asin":
                    case "type":
                    case "title":
                    case "long_description":
                        this.state.appliedFilters[
                        "filter[details." +
                        key +
                        "][" +
                        this.filters.column_filters[key].operator +
                        "]"
                            ] = this.filters.column_filters[key].value;
                        break;
                    case "source_variant_id":
                    case "sku":
                    case "price":
                    case "weight":
                    case "weight_unit":
                    case "main_image":
                    case "quantity":
                        this.state.appliedFilters[
                        "filter[variants." +
                        key +
                        "][" +
                        this.filters.column_filters[key].operator +
                        "]"
                            ] = this.filters.column_filters[key].value;
                        break;
                }
            }
        }
        this.updateState();
    }
    updateState() {
        const state = this.state;
        this.setState(state);
    }

	getProducts = () => {
        console.log(this.filters.column_filters);
        console.log(this.filters.single_column_filter);

        this.prepareFilterObject();
        const pageSettings = Object.assign({}, this.gridSettings);
		requests
			.postRequest("connector/profile/getProfile", {
				id: this.state.queryParams.id,
				activePage: this.gridSettings.activePage,
				count: this.gridSettings.count,
				additionalQuery : this.filters.single_column_filter
			})
			.then(data => {
				if (data.success) {
					// console.log("data",data)
					this.prepareData(data.data);
					const products = this.modifyProductsData(data.data.products_data);

					this.setState({
						products: products,
						totalPage: data.data.products_data_count,
						pagination_show: paginationShow(
							this.gridSettings.activePage,
							this.gridSettings.count,
							data.data.products_data_count,
							true
						)
					});
				} else {
					notify.error(data.message);
					this.setState({
						pagination_show: paginationShow(0, 0, 0, false)
					});
				}
			});
	};

	prepareData(value) {
		let basicInfo = this.state.data;
		let attributeMapping = this.state.attributeMapping;
		let marketplaceAttributes = this.state.marketplaceAttributes;
		this.filters.marketplace = value.source
		basicInfo.name.value = value.name;
		basicInfo.source.value =
			value.source === "amazonimporter" ? "Amazon" : value.source;
		basicInfo.target.value =
			value.target === "shopifygql" ? "Shopify" : value.target;
		basicInfo.cat.value = value.targetCategory;
		basicInfo.query.value = this.preapreUser(value.query);
		if (
			!isUndefined(value.attributeMapping) &&
			value.attributeMapping !== null
		) {
			value.attributeMapping.forEach(e => {
				if (e.mappedTo !== "" || e.defaultValue !== "") {
					if (e.mappedTo !== "") {
						attributeMapping.push({
							target: e.code,
							source: e.mappedTo,
							default: "-"
						});
					} else if (e.defaultValue !== "") {
						e.options.forEach(t => {
							if (t.value === e.defaultValue) {
								attributeMapping.push({
									target: e.code,
									source: "-",
									default: t.label + " (" + e.defaultValue + ")"
								});
							}
						});
					}
				}
			});
		}
		if (
			!isUndefined(value.marketplaceAttributes) &&
			value.marketplaceAttributes !== null
		) {
			value.marketplaceAttributes.forEach(e => {
				if (typeof e.value !== "object") {
					if (e.value !== null && e.value !== "") {
						marketplaceAttributes.push({ title: e.title, value: e.value });
					}
				} else {
					let _e = e.value
						.map(data => {
							return data;
						})
						.join(", ");
					if (_e !== "" && _e !== null) {
						marketplaceAttributes.push({ title: e.title, value: _e });
					}
				}
			});
		}
		this.setState({
			data: basicInfo,
			attributeMapping: attributeMapping,
			marketplaceAttributes: marketplaceAttributes
		});
	}

	modifyProductsData(data) {
		let products = [];
		for (let i = 0; i < data.length; i++) {
			let rowData = {};
			rowData["source_variant_id"] = data[i].details.source_product_id.toString();
			rowData["main_image"] = data[i].variants["main_image"];
			rowData["title"] = data[i].details.title;
			rowData["sku"] = data[i].variants["sku"].toString();
			rowData["price"] = data[i].variants["price"].toString();
			rowData["quantity"] =
				isUndefined(data[i].variants["quantity"]) ||
				data[i].variants["quantity"] === null
					? ""
					: data[i].variants["quantity"].toString();
			// rowData['type'] = data[i].details.type;
			// rowData['weight'] = isUndefined(data[i].variants['weight']) || data[i].variants['weight'] === null?'':data[i].variants['weight'].toString();
			// rowData['weight_unit'] = data[i].variants['weight_unit'];
			products.push(rowData);
		}
		return products;
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

	render() {
		return (
			<Page
				title="View"
				primaryAction={{
					content: "Back",
					onClick: () => {
						this.redirect("/panel/profiling");
					}
				}}
			>
				<Card>
					<div className="p-5">
						<Card title="Products Details">
							<div className="row p-5">
								{Object.keys(this.state.data).map((data, index) => {
									if (
										this.state.data[data].value !== null &&
										this.state.data[data].value !== ""
									) {
										return (
											<div className="col-6 mb-4" key={index}>
												<Label id={this.state.data[data].name}>
													<h3>
														<b>{this.state.data[data].name}</b>
													</h3>
													<h4>{this.state.data[data].value}</h4>
												</Label>
											</div>
										);
									}
								})}
							</div>
							{this.state.attributeMapping.length > 0 && (
								<div className="p-5">
									<Card title="Attribute Mapping">
										<div className="row pr-5 pl-5 pt-5">
											<div className="col-3 text-center d-none d-sm-block">
												<h3>Shopify</h3>
											</div>
											<div className="offset-1 col-3 text-center d-none d-sm-block">
												<h3>Amazon</h3>
											</div>
											<div className="offset-1 col-3 text-center d-none d-sm-block">
												<h3>Default Value</h3>
											</div>
											<div className="col-12 d-none d-sm-block">
												<hr />
											</div>
										</div>
										<div className="p-5">
											{this.state.attributeMapping.map((data, key) => {
												return (
													<React.Fragment key={key}>
														<Card>
															<div className="row p-4 text-center">
																<div className="col-sm-3 col-12">
																	<h4>{data.target}</h4>
																	<span
																		className="d-block d-sm-none"
																		style={{ color: "#b4afb0" }}
																	>
																		<h6>(Google)</h6>
																	</span>
																</div>
																<div className="col-sm-1 col-12 text-center">
																	<FontAwesomeIcon
																		icon={faArrowsAltH}
																		size="2x"
																		color="#000"
																	/>
																</div>
																<div className="col-sm-3 col-12 text-center">
																	{data.source !== "-" ? (
																		<h4>{data.source}</h4>
																	) : (
																		<FontAwesomeIcon
																			icon={faMinus}
																			size="2x"
																			color="#cccccc"
																		/>
																	)}
																	<span
																		className="d-block d-sm-none"
																		style={{ color: "#b4afb0" }}
																	>
																		<h6>(Shopify)</h6>
																	</span>
																</div>
																<div className="col-sm-1 col-12 text-center">
																	<FontAwesomeIcon
																		icon={faArrowsAltH}
																		size="2x"
																		color="#000"
																	/>
																</div>
																<div className="col-sm-3 col-12 text-center">
																	{data.default !== "-" ? (
																		<h4>{data.default}</h4>
																	) : (
																		<FontAwesomeIcon
																			icon={faMinus}
																			size="2x"
																			color="#cccccc"
																		/>
																	)}
																	<span
																		className="d-block d-sm-none"
																		style={{ color: "#b4afb0" }}
																	>
																		<h6>(Default Value)</h6>
																	</span>
																</div>
															</div>
														</Card>
													</React.Fragment>
												);
											})}
										</div>
									</Card>
								</div>
							)}
							{this.state.marketplaceAttributes.length > 0 ? (
								<div className="p-5">
									<Card title="MarketPlace Mapping">
										<div className="p-5">
											{this.state.marketplaceAttributes.map((data, key) => {
												return (
													<React.Fragment key={key}>
														<Card>
															<div className="row p-4 text-center">
																<div className="col-5 text-center">
																	<h4>{data.title}</h4>
																</div>
																<div className="col-1 text-center">
																	<FontAwesomeIcon
																		icon={faArrowsAltH}
																		size="2x"
																		color="#000"
																	/>
																</div>
																<div className="col-5 text-center">
																	<h4>{data.value}</h4>
																</div>
															</div>
														</Card>
													</React.Fragment>
												);
											})}
										</div>
									</Card>
								</div>
							) : null}
						</Card>
						{this.state.products.length > 0 ? (
							<Card title="Product Data">
								<div className="p-5">
									<div className="row">
										<div className="col-12 text-right">
											<h5 className="mr-5">
												{this.state.pagination_show} Products
											</h5>
											<hr />
										</div>
										<div className="col-12">
											{/*<SmartDataTable*/}
												{/*data={this.state.products}*/}
												{/*uniqueKey="sku"*/}
												{/*columnTitles={this.columnTitles}*/}
												{/*className="ui compact selectable table"*/}
												{/*withLinks={true}*/}
												{/*visibleColumns={this.visibleColumns}*/}
												{/*imageColumns={this.imageColumns}*/}
												{/*getVisibleColumns={event => {*/}
													{/*this.visibleColumns = event;*/}
												{/*}}*/}
												{/*sortable*/}
											{/*/>*/}


											{/*-------My SmartTable Code -------*/}


											<SmartDataTable
												data={this.state.products}
												uniqueKey="source_variant_id"
												showLoaderBar={this.state.showLoaderBar}
												count={this.gridSettings.count}
												activePage={this.gridSettings.activePage}
												hideFilters={this.hideFilters}
												columnTitles={this.columnTitles}
												marketplace={this.filters.marketplace}
												multiSelect={true}
												operations={this.operations} //button
												selected={this.state.selectedProducts}
												className="ui compact selectable table"
												withLinks={true}
												visibleColumns={this.visibleColumns}
												actions={this.massActions}
												showColumnFilters={false}
												predefineFilters={this.predefineFilters}
												showButtonFilter={false}
												columnFilterNameArray={this.filters.single_column_filter}
												rowActions={{
                                                    edit: false,
                                                    delete: false
                                                }}
												getVisibleColumns={event => {
                                                    this.visibleColumns = event;
                                                }}
												userRowSelect={event => {
                                                    const itemIndex = this.state.selectedProducts.indexOf(
                                                        event.data.source_variant_id
                                                    );
                                                    if (event.isSelected) {
                                                        if (itemIndex === -1) {
                                                            this.state.selectedProducts.push(
                                                                event.data.source_variant_id
                                                            );
                                                        }
                                                    } else {
                                                        if (itemIndex !== -1) {
                                                            this.state.selectedProducts.splice(itemIndex, 1);
                                                        }
                                                    }
                                                    const state = this.state;
                                                    this.setState(state);
                                                }}
												allRowSelected={(event, rows) => {
                                                    let data = this.state.selectedProducts.slice(0);
                                                    if (event) {
                                                        for (let i = 0; i < rows.length; i++) {
                                                            const itemIndex = this.state.selectedProducts.indexOf(
                                                                rows[i].source_variant_id
                                                            );
                                                            if (itemIndex === -1) {
                                                                data.push(rows[i].source_variant_id);
                                                            }
                                                        }
                                                    } else {
                                                        for (let i = 0; i < rows.length; i++) {
                                                            if (data.indexOf(rows[i].source_variant_id) !== -1) {
                                                                data.splice(
                                                                    data.indexOf(rows[i].source_variant_id),
                                                                    1
                                                                );
                                                            }
                                                        }
                                                    }
                                                    this.setState({ selectedProducts: data });
                                                }}
												massAction={event => {
                                                    switch (event) {
                                                        case "upload":
                                                            this.state.selectedProducts.length > 0
                                                                ? this.handleSelectedUpload("profile")
                                                                : notify.info("No Product Selected");
                                                            break;
                                                        default:
                                                            // console.log(event, this.state.selectedProducts);
                                                    }
                                                }}
												editRow={row => {
                                                    this.redirect("/panel/products/edit/" + row.id);
                                                }}
												deleteRow={row => {
                                                    this.state.toDeleteRow = row;
                                                    this.state.deleteProductData = true;
                                                    const state = this.state;
                                                    this.setState(state);
                                                }}
												columnFilters={filters => {
                                                    this.filters.column_filters = filters;
                                                    this.getProducts();
                                                }}
												singleButtonColumnFilter={filter => {
                                                    // console.log(filter);
                                                    this.filters.single_column_filter = filter;
                                                    this.getProducts();
                                                }}
												sortable
											/>



										</div>
									</div>
									<div className="row mt-3">
										<div className="col-6 text-right">
											<Pagination
												hasPrevious={1 < this.gridSettings.activePage}
												onPrevious={() => {
													this.gridSettings.activePage--;
													this.getProducts();
												}}
												hasNext={
													this.state.totalPage / this.gridSettings.count >
													this.gridSettings.activePage
												}
												onNext={() => {
													this.gridSettings.activePage++;
													this.getProducts();
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
						) : null}
					</div>
				</Card>
				<Modal
					open={this.state.selectedUploadModal}
					onClose={this.handleSelectedUpload.bind(this, "modalClose")}
					title={"Upload"}
					primaryAction={{
                        content: "Start Upload",
                        onClick: () => {
                            this.handleSelectedUpload("Start_Upload");
                        }
                    }}
					secondaryActions={{
                        content: "Cancel",
                        onClick: () => {
                            this.handleSelectedUpload("modalClose");
                        }
                    }}
				>
					<Modal.Section>
						<div>
							<Banner title="Please Note" status="info">
								<Label id={"sUploadLabel"}>
									Product without a profile, will be uploaded via default
									profile.
								</Label>
								<Label id={"sUploadLabel2"}>
									The multiple variants of a product will be auto uploaded on
									selecting one of the variants.
								</Label>
								<br />
								<Label id={"sUploadLabel3"}>
									<h5>Total Selected Products:</h5>
									<h5>
										Main Product: <b>{this.state.parent_sku}</b>
									</h5>
									<h5>
										SKU: <b>{this.state.child_sku}</b>
									</h5>
								</Label>
							</Banner>
						</div>
					</Modal.Section>
				</Modal>
			</Page>
		);
	}

    operations = (event, id) => {
        // console.log(event);
        // console.log(id)
        switch (id) {
            case "grid":
                let parent_props = {
                    gridSettings: this.gridSettings,
                    filters: this.filters,
                    position: this.state.selectedApp
                };
                this.redirect("/panel/products/view/" + event["source_variant_id"], {
                    parent_props: parent_props
                });
                break;
            default:
                // console.log("Default Case");
        }
    };

    handleSelectedUpload = (arg, val) => {
        console.log(arg);
        console.log(val);
        console.log(this.state.selectedProducts);

        switch (arg) {
            case "modalClose":
                this.setState({ selectedUploadModal: false });
                break;
            case "profile":
                this.state.selectUpload.option = [];
                let data = {
                    list_ids: this.state.selectedProducts
                };
                requests.postRequest("frontend/app/getSKUCount", data).then(data => {
                    if (data.success) {
                        if (
                            !isUndefined(data.data.parent) &&
                            !isUndefined(data.data.child)
                        ) {
                            this.setState({
                                selectedUploadModal: true,
                                parent_sku: data.data.parent,
                                child_sku: data.data.child
                            });
                        } else {
                            notify.warn("Something Went Wrong.Not Found");
                        }
                    } else {
                        notify.error(data.message);
                    }
                });
                break;
            case "Start_Upload":
                requests
                    .getRequest(
                        "frontend/app/getShopID?marketplace=shopifygql&source=" +
                        this.filters.marketplace
                    )
                    .then(e => {
                        if (e.success) {
                            let source_shop_id = e.data.source_shop_id;
                            let target_shop_id = e.data.target_shop_id;
                            requests
                                .postRequest("connector/product/selectProductAndUpload", {
                                    marketplace: "shopifygql",
                                    source: this.filters.marketplace,
                                    source_shop_id: source_shop_id,
                                    target_shop_id: target_shop_id,
                                    selected_profile: this.state.selectUpload.value,
                                    selected_products: this.state.selectedProducts
                                })
                                .then(data => {
                                    if (data.success) {
                                        if (data.code === "product_upload_started") {
                                            notify.info(data.message);
                                        }
                                        setTimeout(() => {
                                            this.redirect("/panel/queuedtasks");
                                        }, 400);
                                    } else {
                                        notify.error(data.message);
                                    }
                                });
                        } else {
                            notify.error(e.message);
                        }
                    });
                break;
            case "select":
                let selectUpload = this.state.selectUpload;
                selectUpload.value = val;
                this.setState({ selectUpload: selectUpload });
                break;
            default:
                notify.info("Case Not Exits");
        }
    };

	pageSettingsChange(event) {
		this.gridSettings.count = event;
		this.gridSettings.activePage = 1;
		this.getProducts();
	}

	redirect(url) {
		this.props.history.push(url);
	}


	pageSettingsChange(event) {
        this.gridSettings.count = event;
        this.gridSettings.activePage = 1;
        this.getProducts();
    }

    manageStateChange = old_state => {
        this.filters = Object.assign({}, old_state["filters"]);
        this.gridSettings = Object.assign({}, old_state["gridSettings"]);
        this.state.selectedApp = old_state["position"];
        this.props.location.state = undefined;
        this.updateState();
        this.prepareHeader(this.props);
    };

    redirect(url, data) {
        if (!isUndefined(data)) {
            this.props.history.push(url, JSON.parse(JSON.stringify(data)));
        } else {
            this.props.history.push(url);
        }
    }

}

export default ViewProfile;
