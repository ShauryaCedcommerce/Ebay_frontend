import React, {Component} from "react";
import {NavLink} from "react-router-dom";

import {
    Page,
    Card,
    Select,
    Button,
    TextField,
    Label,
    Modal,
    Checkbox,
    Banner,
    DatePicker,
    DisplayText
} from "@shopify/polaris";

import "./create-profile.css";

import {notify} from "../../../../services/notify";
import {requests} from "../../../../services/request";
import {capitalizeWord, validateImporter} from "../static-functions";
import {isUndefined} from "util";

import {environment} from "../../../../environments/environment";
import {globalState} from "../../../../services/globalstate";

export class CreateProfile extends Component {
    isLive = false;
    sourceAttributes = [];
    filteredProducts = {
        runQuery: false,
        totalProducts: 0
    };
    filterConditions = [
        {label: "Equals", value: "=="},
        {label: "Not Equals", value: "!="},
        {label: "Contains", value: "%LIKE%"},
        {label: "Does Not Contains", value: "!%LIKE%"},
        {label: "Greater Then", value: ">"},
        {label: "Less Then", value: "<"},
        {label: "Greater Then Equal To", value: ">="},
        {label: "Less Then Equal To", value: "<="}
    ];
    intFilterConditions = [
        {label: "Equals", value: "=="},
        {label: "Not Equals", value: "!="},
        {label: "Greater Then", value: ">"},
        {label: "Less Then", value: "<"},
        {label: "Greater Then Equal To", value: ">="},
        {label: "Less Then Equal To", value: "<="}
    ];
    optionMapping = {};
    showOptionMapping = false;
    optionMappingIndex = -1;
    categoryList = [];

    importServices = [];
    uploadServices = [];
    importShopLists = [];
    uploadShopLists = [];

    constructor() {
        super();
        let today_date = new Date();
        this.state = {
            activeStep: 1,
            selectedAttribute:'',
            for_profiling: false,
            filterQuery: {
                primaryQuery: [
                    {
                        key: "",
                        operator: "",
                        value: ""
                    }
                ],
                condition: "AND",
                position: 1,
                secondaryQuery: {}
            },
            basicDetails: {
                name: "",
                source: "",
                sourceShop: "",
                targetShop: "",
                target: "",
                target_location: ""
            },
            products_select: {
                query: "",
                targetCategory: "",
                marketplaceAttributes: []
            },
            targetAttributes: [],
            sourceAttributes: [],
            array_marketpalce_imported: [],
            today: {
                end: new Date(),
                start: new Date()
            },
            dd: today_date.getDate(),
            mm: today_date.getMonth(), //January is 0!
            yyyy: today_date.getFullYear(),
            month: {},
            year: {},
            selected: {}
        };
        this.getProfile();
        this.getConnectors();
    }

    getConnectors() {
        requests.getRequest("connector/get/all").then(data => {
            if (data.success) {
                console.log(data)
                let installedApps = [];
                for (let i = 0; i < Object.keys(data.data).length; i++) {
                    if (data.data[Object.keys(data.data)[i]]['code'] == "ebayimporter" && data.data[Object.keys(data.data)[i]]['installed'] == 1) {
                        installedApps.push(data.data[Object.keys(data.data)[i]]["code"]);
                    }
                    if (data.data[Object.keys(data.data)[i]]['code'] == "etsyimporter" && data.data[Object.keys(data.data)[i]]['installed'] == 1) {
                        installedApps.push(data.data[Object.keys(data.data)[i]]["code"]);
                    }
                    if (data.data[Object.keys(data.data)[i]]['code'] == "amazonimporter" && data.data[Object.keys(data.data)[i]]['installed'] == 1) {
                        installedApps.push(data.data[Object.keys(data.data)[i]]["code"]);
                    }
                    if (data.data[Object.keys(data.data)[i]]['code'] == "wishimporter" && data.data[Object.keys(data.data)[i]]['installed'] == 1) {
                        installedApps.push(data.data[Object.keys(data.data)[i]]["code"]);
                    }
                    if (data.data[Object.keys(data.data)[i]]['code'] == "fba" && data.data[Object.keys(data.data)[i]]['installed'] == 1) {
                        installedApps.push(data.data[Object.keys(data.data)[i]]["code"]);
                    }
                    if (data.data[Object.keys(data.data)[i]]['code'] == "amazonaffiliate" && data.data[Object.keys(data.data)[i]]['installed'] == 1) {
                        installedApps.push(data.data[Object.keys(data.data)[i]]["code"]);
                    }
                    if (data.data[Object.keys(data.data)[i]]['code'] == "walmartimporter" && data.data[Object.keys(data.data)[i]]['installed'] == 1) {
                        installedApps.push(data.data[Object.keys(data.data)[i]]["code"]);
                    }

                    if (data.data[Object.keys(data.data)[i]]['code'] == "ebayaffiliate" && data.data[Object.keys(data.data)[i]]['installed'] == 1) {
                        installedApps.push(data.data[Object.keys(data.data)[i]]["code"]);
                    }
                }
                this.getYAxisImporter(installedApps);
            }
            else {
                notify.error(data.message);
            }
        });
    }

    getYAxisImporter(importer_marketplace_array) {
        requests
            .postRequest("frontend/app/getImportedProductCount", {
                importers: importer_marketplace_array
            }, false, true)
            .then(data => {
                console.log(data);
                for (let j = 0; j < importer_marketplace_array.length; j++) {
                    if (data.data[importer_marketplace_array[j]] > 0) {
                        this.state.array_marketpalce_imported.push(importer_marketplace_array[j]);
                    }
                }
            });
    }

    getProfile() {
        requests.getRequest("connector/profile/get").then(data => {
            if (data.success) {
                if (!isUndefined(data.data.state)) {
                    this.state.basicDetails.name = data.data.name;
                    this.state.basicDetails.source = data.data.source;
                    this.state.basicDetails.target = data.data.target;
                    this.state.basicDetails.sourceShop = data.data.sourceShop;
                    this.state.basicDetails.targetShop = data.data.targetShop;
                    switch (data.data.state) {
                        case 1:
                            this.state.activeStep = 1;
                            this.fetchDataForStepOne();
                            break;
                        case 2:
                            this.state.activeStep = 2;
                            this.state.products_select.query = data.data.query;
                            this.state.products_select.targetCategory =
                                data.data.targetCategory;
                            this.state.products_select.marketplaceAttributes =
                                data.data.marketplaceAttributes;
                            this.fetchDataForSteptwo(true);
                            break;
                    }
                } else {
                    this.fetchDataForStepOne();
                }
            } else {
                this.fetchDataForStepOne();
            }
        });
    }

    fetchDataForStepOne() {
        this.getImportServices();
        this.getUploadServices();
    }

    fetchDataForSteptwo(fetchMarketplaceAttributes) {
        this.getProductCategories();
        this.getSourceAttributes();
        if (isUndefined(fetchMarketplaceAttributes)) {
            this.getMarketplaceAttributes();
        }
    }

    fetchDataForStepThree() {
        this.getTargetAttributes();
        this.getAttributesForSelectedProducts();
    }

    getTargetAttributes() {
        requests
            .getRequest("connector/get/getAttributes", {
                marketplace: this.state.basicDetails.target,
                category: this.state.products_select.targetCategory
            })
            .then(data => {
                if (data.success) {
                    // console.log("namste",data);
                    this.state.targetAttributes = this.modifyAttributesData(data.data);
                    this.updateState();
                } else {
                    notify.error(data.message);
                }
            });
    }

    getMarketplaceAttributes() {
        console.log(this.state.basicDetails.target);
        requests
            .getRequest("connector/get/configForm", {
                marketplace: this.state.basicDetails.target
            })
            .then(data => {
                if (data.success) {
                    // console.log("qwerfdsa",data);
                    this.state.products_select.marketplaceAttributes = this.modifyConfigFormData(
                        data.data
                    );
                    this.updateState();
                } else {
                    notify.error(data.message);
                }
            });
    }

    modifyConfigFormData(data) {
        for (let i = 0; i < data.length; i++) {
            if (!isUndefined(data[i].options) && data[i].options !== null) {
                let options = [];
                for (let j = 0; j < Object.keys(data[i].options).length; j++) {
                    const key = Object.keys(data[i].options)[j];
                    options.push({
                        label: data[i].options[key],
                        value: key
                    });
                }
                data[i].options = options;
            }
        }
        return data;
    }

    getAttributesForSelectedProducts() {
        requests
            .getRequest("connector/product/getAttributesByProductQuery", {
                marketplace: this.state.basicDetails.source,
                query: this.state.products_select.query
            })
            .then(data => {
                if (data.success) {
                    this.state.sourceAttributes = this.modifyAttributesForSelect(
                        data.data
                    );
                    this.updateState();
                } else {
                    notify.error(data.message);
                }
            });
    }

    modifyAttributesForSelect(attributes) {
        let toReturnAttributes = [];
        for (let i = 0; i < attributes.length; i++) {
            let attributeData = {
                value: attributes[i].code,
                label: attributes[i].title
            };
            if (!isUndefined(attributes[i].values)) {
                attributeData["options"] = this.modifyAttributeOptions(
                    attributes[i].values
                );
            }
            toReturnAttributes.push(attributeData);
        }
        return toReturnAttributes;
    }

    modifyAttributesData(attributes) {
        let toReturnAttributes;
        let requiredAttributes = [];
        let optionalAttributes = [];
        for (let i = 0; i < attributes.length; i++) {
            let attributeData = {
                code: attributes[i].code,
                required: attributes[i].required === 1,
                title: attributes[i].title,
                mappedTo: "",
                defaultValue: ""
            };
            if (!isUndefined(attributes[i].values)) {
                attributeData["options"] = this.modifyAttributeOptions(
                    attributes[i].values
                );
            }
            if (!isUndefined(attributes[i].mapped)) {
                attributeData["mappedTo"] = attributes[i].mapped;
            }
            if (!isUndefined(attributes[i].system)) {
                attributeData["system"] = attributeData["system"] === 1;
            }
            if (!isUndefined(attributes[i].visible)) {
                attributeData["visible"] = attributeData["visible"] === 1;
            }
            if (attributeData.required) {
                requiredAttributes.push(attributeData);
            } else {
                optionalAttributes.push(attributeData);
            }
        }
        toReturnAttributes = [...requiredAttributes, ...optionalAttributes];
        // console.log(toReturnAttributes);
        return toReturnAttributes;
    }

    modifyAttributeOptions(options) {
        let toReturnOptions = [];
        for (let i = 0; i < options.length; i++) {
            toReturnOptions.push({
                mappedTo: "",
                label: options[i].title,
                value: options[i].value
            });
        }
        return toReturnOptions;
    }

    getProductCategories() {
        requests
            .getRequest("connector/get/categories", {
                marketplace: this.state.basicDetails.target
            })
            .then(data => {
                if (data.success) {
                    this.categoryList = [
                        {
                            parent_catg_id: false,
                            selected_category: "",
                            categories: this.addLabelInCategories(data.data)
                        }
                    ];
                    this.updateState();
                } else {
                    notify.error(data.message);
                }
            });
    }

    getSourceAttributes() {
        requests
            .getRequest("connector/get/getAttributes", {
                marketplace: this.state.basicDetails.source
            })
            .then(data => {
                if (data.success) {
                    this.sourceAttributes = [];
                    for (let i = 0; i < data.data.length; i++) {
                        !isUndefined(data.data[i].options)
                            ? this.sourceAttributes.push({
                            label: data.data[i].title,
                            value: data.data[i].code,
                            options_exists: data.data[i].options
                        })
                            : this.sourceAttributes.push({
                            label: data.data[i].title,
                            value: data.data[i].code
                        });
                    }
                    this.updateState();
                } else {
                    notify.error(data.message);
                }
            });
    }

    getChildCategories(parentCatg, parentCatgId) {
        requests
            .getRequest("connector/get/categories", {
                marketplace: this.state.basicDetails.target,
                category: parentCatg
            })
            .then(data => {
                if (data.success) {
                    this.categoryList.push({
                        parent_catg_id: parentCatgId,
                        selected_category: "",
                        categories: this.addLabelInCategories(data.data)
                    });
                    this.updateState();
                } else {
                    notify.error(data.message);
                }
            });
    }

    addLabelInCategories(categories) {
        if (categories !== null) {
            for (let i = 0; i < categories.length; i++) {
                categories[i]["label"] = categories[i]["code"];
                categories[i]["value"] = categories[i]["code"];
            }
        } else {
            categories = [];
        }
        return categories;
    }

    saveProfileData() {
        let data;
        switch (this.state.activeStep) {
            case 1:
                data = Object.assign({}, this.state.basicDetails);
                requests
                    .postRequest("connector/profile/set", {
                        data: data,
                        step: this.state.activeStep
                    })
                    .then(data => {
                        if (data.success) {
                            notify.success(
                                "Step " + this.state.activeStep + " completed succesfully."
                            );
                            this.state.activeStep = 2;
                            this.updateState();
                            this.fetchDataForSteptwo();
                        } else {
                            notify.error(data.message);
                        }
                    });
                break;
            case 2:
                data = Object.assign(
                    {},
                    this.state.basicDetails,
                    this.state.products_select
                );

                this.state.products_select.marketplaceAttributes.map(attribute => {
                    this.state.basicDetails.target_location = attribute.value;

                })
                if (this.state.products_select.targetCategory !== '' && this.state.basicDetails.target_location !== '') {
                    requests
                        .postRequest("connector/profile/set", {
                            data: data,
                            step: this.state.activeStep,
                            saveInTable: true
                        })
                        .then(data => {
                            if (data.success) {
                                notify.success("Profile created succesfully");
                                this.redirect("/panel/profiling");
                                // notify.success('Step ' + this.state.activeStep + ' completed succesfully.');
                                // this.state.activeStep = 3;
                                // this.updateState();
                                // this.fetchDataForStepThree();
                            } else {
                                notify.error(data.message);
                            }
                        });
                    break;
                }
                else {
                    notify.error("Please Fill Up All The Field");
                }
            // case 3:
            //     data = Object.assign({}, this.state.basicDetails, this.state.products_select, { attributeMapping: this.state.targetAttributes });
            //     requests.postRequest('connector/profile/set', {data: data, saveInTable: true})
            //         .then(data => {
            //             if (data.success) {
            //                 notify.success('Profile created succesfully');
            //                 this.redirect('/panel/profiling');
            //             } else {
            //                 notify.error(data.message);
            //             }
            //         });
            //     break;
        }
    }

    getImportServices() {
        requests
            .getRequest("connector/get/services", {"filters[type]": "importer"})
            .then(data => {
                if (data.success === true) {
                    this.importServices = [];
                    let hasService = false;
                    for (let i = 0; i < Object.keys(data.data).length; i++) {
                        let key = Object.keys(data.data)[i];
                        if (data.data[key].usable || !environment.isLive) {
                            hasService = true;
                            if (validateImporter(data.data[key].code)) {
                                if (data.data[key].code !== 'fba'&& data.data[key].code !== 'bigmanager_importer') {
                                    this.importServices.push({
                                        label: data.data[key].title,
                                        value: data.data[key].code,
                                        shops: data.data[key].shops
                                    });
                                }
                            }
                        }
                    }
                    this.state.basicDetails.source !== ""
                        ? this.handleBasicDetailsChange(
                        "source",
                        this.state.basicDetails.source
                    )
                        : null;
                    this.updateState();
                    if (!hasService) {
                    }
                    this.updateState();
                } else {
                    notify.error(
                        "You have no available product import service. Please choose a plan."
                    );
                }
            });
    }

    getUploadServices() {
        requests
            .getRequest("connector/get/services", {"filters[type]": "uploader"})
            .then(data => {
                if (data.success) {
                    this.uploadServices = [];
                    let hasService = false;
                    for (let i = 0; i < Object.keys(data.data).length; i++) {
                        let key = Object.keys(data.data)[i];
                        if (data.data[key].usable || !environment.isLive) {
                            hasService = true;
                            this.uploadServices.push({
                                label: data.data[key].title,
                                value: data.data[key].marketplace,
                                shops: data.data[key].shops
                            });
                        }
                    }
                    this.handleBasicDetailsChange("target", "shopifygql");
                    this.updateState();
                    if (!hasService) {
                        notify.info(
                            "You have no available product upload service. Please choose a plan for the plan you want to sell product on."
                        );
                    }
                    this.updateState();
                } else {
                    notify.error(
                        "You have no available product upload service. Please choose a plan for the plan you want to sell product on."
                    );
                }
            });
    }

    renderQueryBuilder(querySet) {
        return (
            <div className="row">
                {querySet.position === 1 && this.state.products_select.query !== "" && (
                    <div className="col-12 p-3">
                        {/*<Banner title="Prepared Query" status="info">*/}
                            {/*<Label>{this.state.products_select.query}</Label>*/}
                        {/*</Banner>*/}
                    </div>
                )}
                <div className="col-12 p-4">
                    <Card>
                        {/*<Banner title="*Please note" status="info">*/}
                            {/*<Label>*/}
                                {/*<h4>{"Add rule corresponding to && (AND) condition"}</h4>*/}
                            {/*</Label>*/}
                            {/*<Label>*/}
                                {/*<h4>{"Add rule group corresponding to || (OR) condition"}</h4>*/}
                            {/*</Label>*/}
                        {/*</Banner>*/}
                        {querySet.primaryQuery.map(query => {
                            return (
                                <div
                                    key={querySet.primaryQuery.indexOf(query)}
                                    className="row p-5"
                                >
                                    <div className="col-md-4 col-sm-4 col-6 pt-3">
                                        <Select
                                            label="Attribute"
                                            options={this.sourceAttributes}
                                            placeholder="Select Attribute"
                                            onChange={this.handleQueryBuilderChange.bind(
                                                this,
                                                querySet.position,
                                                querySet.primaryQuery.indexOf(query),
                                                "key"
                                            )}
                                            value={query.key}
                                        />
                                    </div>
                                    <div
                                        className={`${
                                            query.key === "importdate"
                                                ? "col-8"
                                                : "col-md-4 col-sm-4 col-6"
                                            } pt-3`}
                                    >
                                        {query.key === "importdate" ? (
                                            <DatePicker
                                                month={
                                                    this.state.month[querySet.position][
                                                        querySet.primaryQuery.indexOf(query)
                                                        ]
                                                }
                                                year={
                                                    this.state.year[querySet.position][
                                                        querySet.primaryQuery.indexOf(query)
                                                        ]
                                                }
                                                multiMonth={true}
                                                allowRange={true}
                                                selected={
                                                    this.state.selected[querySet.position][
                                                        querySet.primaryQuery.indexOf(query)
                                                        ]
                                                }
                                                onChange={this.handleChange.bind(
                                                    this,
                                                    querySet.position,
                                                    querySet.primaryQuery.indexOf(query)
                                                )}
                                                onMonthChange={this.handleMonthChange.bind(
                                                    this,
                                                    querySet.position,
                                                    querySet.primaryQuery.indexOf(query)
                                                )}
                                            />
                                        ) : (
                                            <Select
                                                label="Operator"
                                                options={query.key == 'quantity' ? this.intFilterConditions : this.filterConditions}
                                                placeholder="Select Operator"
                                                onChange={this.handleQueryBuilderChange.bind(
                                                    this,
                                                    querySet.position,
                                                    querySet.primaryQuery.indexOf(query),
                                                    "operator"
                                                )}
                                                value={query.operator}
                                            />
                                        )}
                                    </div>
                                    <div className="col-md-4 col-sm-4 col-6 pt-3">
                                        {query.key === "importdate" ? null : isUndefined(
                                            query.options
                                        ) || query.options.length <= 0 ? (
                                            <TextField
                                                label="Value"
                                                value={query.value}
                                                placeholder="Filter Value"
                                                onChange={this.handleQueryBuilderChange.bind(
                                                    this,
                                                    querySet.position,
                                                    querySet.primaryQuery.indexOf(query),
                                                    "value"
                                                )}
                                            />
                                        ) : (
                                            <Select
                                                label="Value"
                                                options={query.options}
                                                placeholder="Filter Value"
                                                onChange={this.handleQueryBuilderChange.bind(
                                                    this,
                                                    querySet.position,
                                                    querySet.primaryQuery.indexOf(query),
                                                    "value"
                                                )}
                                                onClick={this.handleQueryBuilderChange.bind(
                                                    this,
                                                    querySet.position,
                                                    querySet.primaryQuery.indexOf(query),
                                                    "value"
                                                )}
                                                value={query.value}
                                            />
                                        )}
                                    </div>
                                    <div className="col-12 text-right pt-3">
                                        {querySet.primaryQuery.indexOf(query) !== 0 && (
                                            <Button
                                                onClick={() => {
                                                    this.handleDeleteRule(
                                                        querySet.position,
                                                        querySet.primaryQuery.indexOf(query)
                                                    );
                                                }}
                                            >
                                                Delete Rule
                                            </Button>
                                        )}
                                        {querySet.primaryQuery.indexOf(query) ===
                                        querySet.primaryQuery.length - 1 && (
                                            <Button
                                                onClick={() => {
                                                    this.handleAddRule(querySet.position);
                                                }}
                                                primary
                                            >
                                                Add Rule
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </Card>
                </div>
                {Object.keys(querySet.secondaryQuery).length === 0 &&
                querySet.position !== 1 && (
                    <div className="col-12 p-2 text-right">
                        <Button
                            onClick={() => {
                                this.handleDeleteGroup(querySet.position);
                            }}
                        >
                            Delete Rule Group
                        </Button>
                    </div>
                )}
                {Object.keys(querySet.secondaryQuery).length === 0 && (
                    <div className="col-12 p-2 text-right">
                        <Button
                            onClick={() => {
                                this.handleAddGroup(querySet.position, "OR");
                            }}
                            primary
                        >
                            Add Rule Group
                        </Button>
                    </div>
                )}
                {Object.keys(querySet.secondaryQuery).length > 1 && (
                    <React.Fragment>
                        <div className="col-12">
                            {this.renderQueryBuilder(querySet.secondaryQuery)}
                        </div>
                    </React.Fragment>
                )}
            </div>
        );
    }

    handleChange = (position, index, value) => {
        let selected = this.state.selected;
        selected[position][index] = value;
        // this.prepareDateQuery(this.state.products_select.query, selected);
        this.handleFilterQueryChange(this.state.filterQuery);
        this.setState({selected: selected});
    };

    handleMonthChange = (position, index, month, year) => {
        let mm = this.state.month;
        let yy = this.state.year;

        mm[position][index] = month;
        yy[position][index] = year;

        this.setState({
            month: mm,
            year: yy
        });
    };

    handleFilterQueryChange(query) {
        this.state.products_select.query = this.prepareQuery(
            Object.assign({}, query),
            ""
        );
        // this.prepareDateQuery(this.prepareQuery(Object.assign({},query), ''), this.state.selected);
    }

    prepareQuery(query, preparedQuery) {
        preparedQuery += "(";
        let end = "";
        for (let i = 0; i < query.primaryQuery.length; i++) {
            if (
                query.primaryQuery[i].key !== "" &&
                query.primaryQuery[i].operator !== "" &&
                query.primaryQuery[i].value !== ""
            ) {
                preparedQuery +=
                    end +
                    query.primaryQuery[i].key +
                    " " +
                    query.primaryQuery[i].operator +
                    " " +
                    query.primaryQuery[i].value;
                end = " && ";
            } else if (query.primaryQuery[i].key === "importdate") {
                let date = this.prepareSingleDateQuery(query.position, i);
                preparedQuery += end + date;
                if (date !== "") {
                    end = " && ";
                }
            }
        }
        preparedQuery += ")";
        if (preparedQuery === "()") {
            preparedQuery = "";
        }
        if (Object.keys(query.secondaryQuery).length > 0) {
            const orQuery = this.prepareQuery(query.secondaryQuery, "");
            if (orQuery !== "") {
                preparedQuery += " || " + orQuery;
            }
        }
        return preparedQuery;
    }

    prepareDateQuery(query, data) {
        let date = "(";
        Object.keys(data).forEach(p_key => {
            if (date !== "(") {
                date = date + " || (";
            }
            Object.keys(data[p_key]).forEach(c_key => {
                if (date !== "(" && date[date.length - 1] !== "(") {
                    date = date + " &&";
                }
                if (!isUndefined(data[p_key][c_key]["end"])) {
                    let start = new Date(data[p_key][c_key]["start"]);
                    let end = new Date(data[p_key][c_key]["end"]);
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
                    date = date + " date from " + start + " to " + end;
                }
            });
            if (date !== "(") {
                date = date + " )";
            }
        });
        if (date === "(") {
            date = "";
        }
        let products = this.state.products_select;
        products["query"] = date;
        this.setState({products_select: products});
    }

    prepareSingleDateQuery(p_key, c_key) {
        let data = this.state.selected;
        if (!isUndefined(data[p_key][c_key]["end"])) {
            let start = new Date(data[p_key][c_key]["start"]);
            let end = new Date(data[p_key][c_key]["end"]);
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
            return query;
        }
        return "";
    }

    handleDeleteRule(position, index) {
        this.state.filterQuery = this.deleteRule(
            this.state.filterQuery,
            position,
            index
        );
        this.handleFilterQueryChange(this.state.filterQuery);
        this.updateState();
    }

    handleAddRule(position) {
        this.state.filterQuery = this.addRule(this.state.filterQuery, position);
        this.handleFilterQueryChange(this.state.filterQuery);
        this.updateState();
    }

    handleAddGroup(position, condition) {
        this.state.filterQuery = this.addGroup(
            this.state.filterQuery,
            position,
            condition
        );
        this.handleFilterQueryChange(this.state.filterQuery);
        this.updateState();
    }

    handleDeleteGroup(position) {
        this.state.filterQuery = this.deleteGroup(this.state.filterQuery, position);
        this.handleFilterQueryChange(this.state.filterQuery);
        this.updateState();
    }

    deleteGroup(query, position) {
        if (query.position === position) {
            query = {};
        } else {
            query.secondaryQuery = this.deleteGroup(query.secondaryQuery, position);
        }
        return query;
    }

    addGroup(query, position, condition) {
        if (query.position === position) {
            query.secondaryQuery = {
                primaryQuery: [
                    {
                        key: "",
                        operator: "",
                        value: ""
                    }
                ],
                condition: condition,
                position: position + 1,
                secondaryQuery: {}
            };
        } else {
            query.secondaryQuery = this.addGroup(
                query.secondaryQuery,
                position,
                condition
            );
        }
        return query;
    }

    deleteRule(query, position, index) {
        if (query.position === position) {
            query.primaryQuery.splice(index, 1);
        } else {
            query.secondaryQuery = this.deleteRule(
                query.secondaryQuery,
                position,
                index
            );
        }
        return query;
    }

    addRule(query, position) {
        if (query.position === position) {
            query.primaryQuery.push({
                key: "",
                operator: "",
                value: ""
            });
        } else {
            query.secondaryQuery = this.addRule(query.secondaryQuery, position);
        }
        return query;
    }

    handleQueryBuilderChange(position, index, field, value) {
        if (value === "importdate") {
            let month = this.state.month;
            let year = this.state.year;
            let selected = this.state.selected;
            if (isUndefined(month[position])) {
                month[position] = {};
            }
            month[position][index] = this.state.mm;
            if (isUndefined(year[position])) year[position] = {};
            year[position][index] = this.state.yyyy;
            if (isUndefined(selected[position])) selected[position] = {};
            selected[position][index] = this.state.today;
            this.setState({
                month: month,
                year: year,
                selected: selected
            });
        }

        this.checkForOptions(value);
        this.filteredProducts.runQuery = false;
        if (field === "key") {
            const options = this.checkForOptions(value);
            if (options !== false) {
                this.state.filterQuery = this.updateQueryFilter(
                    this.state.filterQuery,
                    position,
                    index,
                    field,
                    value,
                    options
                );
            } else {
                this.state.filterQuery = this.updateQueryFilter(
                    this.state.filterQuery,
                    position,
                    index,
                    field,
                    value
                );
            }
        } else {
            this.state.filterQuery = this.updateQueryFilter(
                this.state.filterQuery,
                position,
                index,
                field,
                value
            );
        }
        this.handleFilterQueryChange(this.state.filterQuery);
        this.updateState();
    }

    checkForOptions(value) {
        let temp = false;
        this.sourceAttributes.forEach(data => {
            if (data.value === value) {
                if (!isUndefined(data.options_exists)) {
                    temp = data.options_exists;
                }
            }
        });
        return temp;
    }

    updateQueryFilter(query, position, index, field, value, options) {
        if (query.position === position) {
            if (field === "key") {
                query.primaryQuery[index]["value"] = "";
                if (isUndefined(options)) {
                    query.primaryQuery[index].options = undefined;
                }
            }
            if (!isUndefined(options)) {
                query.primaryQuery[index][field] = value;
                query.primaryQuery[index].options = options;
            } else {
                query.primaryQuery[index][field] = value;
            }
        } else {
            query.secondaryQuery = this.updateQueryFilter(
                query.secondaryQuery,
                position,
                index,
                field,
                value,
                options
            );
        }
        return query;
    }

    renderProgressBar() {
        return (
            <div className="row bs-wizard" style={{borderBottom: 0}}>
                <div
                    className={
                        this.state.activeStep === 1
                            ? "col-6 bs-wizard-step active"
                            : "col-6 bs-wizard-step complete"
                    }
                >
                    <div className="text-center bs-wizard-stepnum">Step 1</div>
                    <div className="progress">
                        <div className="progress-bar"/>
                    </div>
                    <a className="bs-wizard-dot"/>
                    <div className="bs-wizard-info text-center">
                        Select product source
                    </div>
                </div>

                <div
                    className={
                        this.state.activeStep === 2
                            ? "col-6 bs-wizard-step active"
                            : this.state.activeStep > 2
                            ? " col-6 bs-wizard-step complete"
                            : "col-3 bs-wizard-step disabled"
                    }
                >
                    <div className="text-center bs-wizard-stepnum">Step 2</div>
                    <div className="progress">
                        <div className="progress-bar"/>
                    </div>
                    <a className="bs-wizard-dot"/>
                    <div className="bs-wizard-info text-center">
                        Select products you want to upload
                    </div>
                </div>

                {/*<div className={(this.state.activeStep === 3) ? 'col-4 bs-wizard-step active' : (this.state.activeStep > 3) ? 'col-4 bs-wizard-step complete' : 'col-3 bs-wizard-step disabled'}>*/}
                {/*<div className="text-center bs-wizard-stepnum">Step 3</div>*/}
                {/*<div className="progress"><div className="progress-bar"></div></div>*/}
                {/*<a className="bs-wizard-dot"></a>*/}
                {/*<div className="bs-wizard-info text-center">Attribute Mapping</div>*/}
                {/*</div>*/}
            </div>
        );
    }

    renderStepOne() {
        return (
            <div className="row">
                <div className="col-12 pt-1 pb-1">
                    <Banner title="General Info" status="info">
                        <Label>
                            Before creating profile please make sure that you have imported products on app. Go to import/upload section to Import Products{" "}
                            <NavLink to="/panel/import">Import Products</NavLink>
                        </Label>
                    </Banner>
                </div>
                <div className="col-12 pt-1 pb-1">
                    <TextField
                        label="Profile Name"
                        placeholder="You can type anything as the Profile Name."
                        onChange={this.handleBasicDetailsChange.bind(this, "name")}
                        value={this.state.basicDetails.name}
                    />
                </div>
                <div className="col-12 pt-1 pb-1">
                    <Select
                        label="Products Imported From"
                        options={this.importServices}
                        placeholder="Product Source"
                        onChange={this.handleBasicDetailsChange.bind(this, "source")}
                        value={this.state.basicDetails.source}
                    />
                </div>
                {this.state.basicDetails.source !== "" &&
                this.importShopLists.length > 1 && (
                    <div className="col-12 pt-1 pb-1">
                        <Select
                            label="Shop from which product to send"
                            options={this.importShopLists}
                            onChange={this.handleBasicDetailsChange.bind(
                                this,
                                "sourceShop"
                            )}
                            value={this.state.basicDetails.sourceShop}
                        />
                    </div>
                )}
                {/*<div className="col-12 pt-1 pb-1">*/}
                {/*<Select*/}
                {/*label="Upload Products To"*/}
                {/*options={this.uploadServices}*/}
                {/*placeholder="Product Target"*/}
                {/*disabled={true}*/}
                {/*onChange={this.handleBasicDetailsChange.bind(this, 'target')}*/}
                {/*value={this.state.basicDetails.target}*/}
                {/*/>*/}
                {/*</div>*/}
                {/*{*/}
                {/*this.state.basicDetails.target !== '' &&*/}
                {/*this.uploadShopLists.length > 1 &&*/}
                {/*<div className="col-12 pt-1 pb-1">*/}
                {/*<Select*/}
                {/*label="Shop In Which Products Will Be Uploaded"*/}
                {/*options={this.uploadShopLists}*/}
                {/*placeholder="Target Shop"*/}
                {/*onChange={this.handleBasicDetailsChange.bind(this, 'targetShop')}*/}
                {/*value={this.state.basicDetails.targetShop}*/}
                {/*/>*/}
                {/*</div>*/}
                {/*}*/}
            </div>
        );
    }

    handleBasicDetailsChange(key, value) {
        this.state.basicDetails[key] = value;
        switch (key) {
            case "source":
                for (let i = 0; i < this.importServices.length; i++) {
                    if (this.importServices[i].value === value) {
                        this.importShopLists = [];
                        for (let j = 0; j < this.importServices[i].shops.length; j++) {
                            this.importShopLists.push({
                                label: this.importServices[i].shops[j].shop_url,
                                value: this.importServices[i].shops[j].shop_url,
                                shop_id: this.importServices[i].shops[j].id
                            });
                        }
                        this.state.basicDetails.sourceShop =
                            this.importShopLists.length > 0
                                ? this.importShopLists[0].value
                                : "";
                    }
                }
                break;
            case "target":
                for (let i = 0; i < this.uploadServices.length; i++) {
                    if (this.uploadServices[i].value === value) {
                        this.uploadShopLists = [];
                        for (let j = 0; j < this.uploadServices[i].shops.length; j++) {
                            this.uploadShopLists.push({
                                label: this.uploadServices[i].shops[j].shop_url,
                                value: this.uploadServices[i].shops[j].shop_url,
                                shop_id: this.uploadServices[i].shops[j].id
                            });
                        }
                        this.state.basicDetails.targetShop =
                            this.uploadShopLists.length > 0
                                ? this.uploadShopLists[0].value
                                : "";
                    }
                }
                break;
        }
        this.updateState();
    }

    renderStepTwo() {
        return (
            <div className="row">
                {this.state.products_select.marketplaceAttributes.map(attribute => {
                    return (
                        <div
                            className="col-12 pt-1 pb-1"
                            key={this.state.products_select.marketplaceAttributes.indexOf(
                                attribute
                            )}
                        >
                            {isUndefined(attribute.options) && (
                                <React.Fragment>
                                    <TextField
                                        placeholder={attribute.title}
                                        label={attribute.title}
                                        onChange={this.handleMarketplaceAttributesChange.bind(
                                            this,
                                            this.state.products_select.marketplaceAttributes.indexOf(
                                                attribute
                                            )
                                        )}
                                        value={attribute.value}
                                    />
                                    {attribute.required ? (
                                        <div>
                                            <p style={{color: "green"}}>*Required</p>
                                        </div>
                                    ) : null}
                                </React.Fragment>
                            )}
                            {!isUndefined(attribute.options) && attribute.type === "select" && (
                                <React.Fragment>
                                    <div className="col-12">
                                        <Label>{attribute.title}</Label>
                                    </div>
                                    <div className="row">
                                        <div className="col-6 p-3">
                                            <Select
                                                options={attribute.options}
                                                placeholder={attribute.title}
                                                onChange={this.handleMarketplaceAttributesChange.bind(
                                                    this,
                                                    this.state.products_select.marketplaceAttributes.indexOf(
                                                        attribute
                                                    )
                                                )}
                                                value={attribute.value}
                                            />
                                        </div>
                                        <div className="col-3 pt-3">
                                            <Button
                                                onClick={() => {
                                                    this.getLocationDetails();
                                                }}
                                                primary
                                            >
                                                Sync Location
                                            </Button>
                                        </div>
                                    </div>
                                    {attribute.required ? (
                                        <div>
                                            <p style={{color: "green"}}>*Required</p>
                                        </div>
                                    ) : null}

                                </React.Fragment>
                            )}
                            {!isUndefined(attribute.options) &&
                            attribute.type === "checkbox" && (
                                <div className="row p-3">
                                    <div className="col-12 p-1">
                                        <Label>{attribute.title}</Label>
                                    </div>
                                    {attribute.options.map(option => {
                                        return (
                                            <div
                                                className="col-md-6 col-sm-6 col-12 p-1"
                                                key={attribute.options.indexOf(option)}
                                            >
                                                <Checkbox
                                                    checked={
                                                        attribute.value.indexOf(option.value) !== -1
                                                    }
                                                    label={option.value}
                                                    onChange={this.handleMarketplaceAttributesCheckboxChange.bind(
                                                        this,
                                                        this.state.products_select.marketplaceAttributes.indexOf(
                                                            attribute
                                                        ),
                                                        attribute.options.indexOf(option)
                                                    )}
                                                />
                                            </div>
                                        );
                                    })}
                                    {attribute.required ? (
                                        <div className="col-12">
                                            <p style={{color: "green"}}>*Required</p>
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    );
                })}
                <div className="col-12 pt-4">
                    <Label>Select Collection In Which You Want To Upload Products</Label>
                </div>
                <div className="col-12 pb-1 pl-4">{this.renderCategoryTree()}</div>
                <div className="col-12 pt-1 pb-1">
                    <Label>Prepare Query To Select Products You Want To Upload</Label>
                </div>
                <div className="col-12 pt-1 pb-1">
                    {this.renderQueryBuilder(this.state.filterQuery)}
                </div>
                <div className="col-12 pt-1 pb-1 text-center">
                    {this.state.products_select.query !== "" && (
                        <Button
                            onClick={() => {
                                this.runFilterQuery();
                            }}
                            primary
                        >
                            Run Query
                        </Button>
                    )}
                </div>
                {this.filteredProducts.runQuery && (
                    <div className="col-12 pt-2 pb-2">
                        {this.filteredProducts.totalProducts ? (
                            <Banner title="Selected Products Count" status="success">
                                <Label>
                                    {this.filteredProducts.totalProducts !== 0
                                        ? "Total " +
                                        this.filteredProducts.totalProducts +
                                        " SKU are selected under this query"
                                        : "No Product Found"}
                                    : {this.state.products_select.query}
                                </Label>
                            </Banner>
                        ) : (
                            <Banner title="Selected Products Count" status="success">
                                <Label>
                                    No products are selected under this query :{" "}
                                    {this.state.products_select.query}
                                </Label>
                            </Banner>
                        )}
                    </div>
                )}
            </div>
        );
    }

    handleMarketplaceAttributesCheckboxChange(index, optionIndex, value) {
        let option = this.state.products_select.marketplaceAttributes[index]
            .options[optionIndex].value;
        let optIndex = this.state.products_select.marketplaceAttributes[
            index
            ].value.indexOf(option);
        if (value) {
            if (optIndex === -1) {
                this.state.products_select.marketplaceAttributes[index].value.push(
                    option
                );
            }
        } else {
            if (optIndex !== -1) {
                this.state.products_select.marketplaceAttributes[index].value.splice(
                    optIndex,
                    1
                );
            }
        }
        this.updateState();
    }

    handleMarketplaceAttributesChange(index, value) {
        this.state.products_select.marketplaceAttributes[index].value = value;
        this.updateState();
    }

    renderCategoryTree() {
        return (
            <div className="row">
                {this.state.products_select.targetCategory !== "" && (
                    <div className="col-12 p-3">
                        {/*<Banner*/}
                            {/*title={*/}
                                {/*"Selected " +*/}
                                {/*capitalizeWord(this.state.basicDetails.target) +*/}
                                {/*" collection"*/}
                            {/*}*/}
                            {/*status="info"*/}
                        {/*>*/}
                            {/*<Label>{this.state.products_select.targetCategory}</Label>*/}
                        {/*</Banner>*/}
                    </div>
                )}
                {this.categoryList.map(category => {
                    return (
                        <React.Fragment>
                            <div
                                className="col-6 p-3"
                                key={this.categoryList.indexOf(category)}
                            >
                                <Select
                                    options={category.categories}
                                    placeholder="Product Collection"
                                    onChange={this.handleProductsSelectChange.bind(
                                        this,
                                        this.categoryList.indexOf(category)
                                    )}
                                    value={category.selected_category}
                                />
                                <p style={{color: "green"}}>
                                    {category.required ? "*Required" : null}
                                </p>
                            </div>
                            <div className="col-3 pt-3">
                                <Button
                                    onClick={() => {
                                        this.getCollection();
                                    }}
                                    primary
                                >
                                    Sync Collection
                                </Button>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        );
    }

    getCollection() {
        requests
            .getRequest("frontend/importer/getCollectionShopify")
            .then(data => {
                // console.log(data);
                if (data.success) {
                    notify.success(data.code);
                    this.fetchCollection();
                } else {
                    notify.error(data.code);
                }
            });

    }
    fetchCollection(){
        requests
            .getRequest("connector/get/categories", {
                marketplace: this.state.basicDetails.target
            })
            .then(data => {
                if (data.success) {
                    this.categoryList = [
                        {
                            parent_catg_id: false,
                            selected_category: "",
                            categories: this.addLabelInCategories(data.data)
                        }
                    ];
                    this.updateState();
                } else {
                    notify.error(data.message);
                }
            });
    }
    getLocationDetails(){
        requests
            .getRequest("frontend/importer/getLocationShopify")
            .then(data => {
                // console.log(data);
                if (data.success) {
                    notify.success(data.code);
                    this.getMarketplaceAttributes();
                } else {
                    notify.error(data.code);
                }
            });
    }

    runFilterQuery() {
        if (this.state.products_select.query !== "") {
            requests
                .postRequest("connector/product/getProductsByQuery", {
                    marketplace: this.state.basicDetails.source,
                    query: this.state.products_select.query,
                    sendCount: true
                })
                .then(data => {
                    if (data.success) {
                        this.filteredProducts = {
                            runQuery: true,
                            totalProducts: data.data === null ? 0 : data.data
                        };
                    } else {
                        notify.error(data.message);
                    }
                    this.updateState();
                });
        } else {
            notify.info("Please prepare a custom query to select products");
        }
    }

    handleProductsSelectChange(categoryIndex, value) {
        this.categoryList[categoryIndex].selected_category = value;
        this.state.products_select.targetCategory = value;
        this.categoryList = this.categoryList.splice(0, categoryIndex + 1);
        const parentCatgId = this.checkHasChildCategories(
            this.categoryList[categoryIndex].categories,
            value
        );
        if (parentCatgId) {
            this.getChildCategories(value, parentCatgId);
        } else {
            this.updateState();
        }
    }

    checkHasChildCategories(catgList, parentCatg) {
        for (let i = 0; i < catgList.length; i++) {
            if (catgList[i].value === parentCatg) {
                if (catgList[i].child_exist) {
                    return catgList[i].category_id;
                } else {
                    return false;
                }
            }
        }
        return false;
    }

    renderStepThree() {
        return (
            <div className="row">
                <div className="col-12 pt-1 pb-1">
                    <div className="row">
                        <div className="col-6 p-3 text-center">
                            <Label>
                                {capitalizeWord(this.state.basicDetails.target)} Atrributes
                            </Label>
                        </div>
                        <div className="col-6 p-3 text-center">
                            <Label>
                                {capitalizeWord(this.state.basicDetails.source)} Atrributes
                            </Label>
                        </div>
                        <div className="col-12 p-4">
                            {this.state.targetAttributes.map(attribute => {
                                if (isUndefined(attribute.visible) || attribute.visible) {
                                    return (
                                        <div
                                            className="row"
                                            key={this.state.targetAttributes.indexOf(attribute)}
                                        >
                                            <div className="col-6 p-3">
                                                <DisplayText size="small" className="mt-2 mb-2">
                                                    {attribute.title}
                                                </DisplayText>
                                                <Label>{attribute.code}</Label>
                                            </div>
                                            <div className="col-6 p-3">
                                                <Card>
                                                    {attribute.required && (
                                                        <div className="w-100 text-right">
                                                            <strong>*</strong>
                                                        </div>
                                                    )}
                                                    <div className="p-3 w-100">
                                                        <Select
                                                            options={this.state.sourceAttributes}
                                                            placeholder={
                                                                capitalizeWord(this.state.basicDetails.source) +
                                                                " Attributes"
                                                            }
                                                            onChange={this.handleMapAttributes.bind(
                                                                this,
                                                                this.state.targetAttributes.indexOf(attribute)
                                                            )}
                                                            value={attribute.mappedTo}
                                                            disabled={attribute.system}
                                                        />
                                                    </div>
                                                    {!isUndefined(attribute.sourceOptions) &&
                                                    attribute.sourceOptions.length > 0 && (
                                                        <div className="w-100 p-4 text-right">
                                                            <Button
                                                                onClick={() => {
                                                                    this.showOptionMappingModal(
                                                                        this.state.targetAttributes.indexOf(
                                                                            attribute
                                                                        )
                                                                    );
                                                                }}
                                                                primary
                                                            >
                                                                Map Options
                                                            </Button>
                                                        </div>
                                                    )}
                                                    {isUndefined(attribute.options) && (
                                                        <div className="p-3 w-100">
                                                            <TextField
                                                                label="Set Default Value"
                                                                placeholder={
                                                                    "Default Value For " + attribute.code
                                                                }
                                                                value={attribute.defaultValue}
                                                                onChange={this.handleDefaultValueChange.bind(
                                                                    this,
                                                                    this.state.targetAttributes.indexOf(attribute)
                                                                )}
                                                            />
                                                        </div>
                                                    )}
                                                    {!isUndefined(attribute.options) &&
                                                    attribute.options.length > 0 && (
                                                        <div className="p-3 w-100">
                                                            <Select
                                                                label="Set Default Value"
                                                                options={attribute.options}
                                                                placeholder={
                                                                    "Default Value For " + attribute.code
                                                                }
                                                                value={attribute.defaultValue}
                                                                onChange={this.handleDefaultValueChange.bind(
                                                                    this,
                                                                    this.state.targetAttributes.indexOf(
                                                                        attribute
                                                                    )
                                                                )}
                                                            />
                                                        </div>
                                                    )}
                                                </Card>
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                        <div className="col-12">{this.renderOptionMappingModal()}</div>
                    </div>
                </div>
            </div>
        );
    }

    renderOptionMappingModal() {
        return (
            <Modal
                open={this.showOptionMapping}
                onClose={() => {
                    this.showOptionMapping = false;
                    this.optionMappingIndex = -1;
                    this.optionMapping = {};
                    this.updateState();
                }}
                title="Value Mapping"
                primaryAction={{
                    content: "Save Mapping",
                    onAction: () => {
                        this.saveOptionMapping();
                    }
                }}
            >
                <Modal.Section>
                    <div className="row">
                        <div className="col-6 text-center">
                            <Label>{this.optionMapping.code} Options</Label>
                        </div>
                        <div className="col-6  text-center">
                            <Label>{this.optionMapping.mappedTo} Options</Label>
                        </div>
                        {!isUndefined(this.optionMapping.options) &&
                        this.optionMapping.options.map(option => {
                            return (
                                <React.Fragment
                                    key={this.optionMapping.options.indexOf(option)}
                                >
                                    <div className="col-6 p-3">
                                        <Label>{option.code}</Label>
                                    </div>
                                    <div className="col-6 p-3">
                                        <Select
                                            options={this.optionMapping.sourceOptions}
                                            placeholder="Target Attribute option"
                                            onChange={this.handleMapOption.bind(
                                                this,
                                                this.optionMapping.options.indexOf(option)
                                            )}
                                            value={option.mappedTo}
                                        />
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </Modal.Section>
            </Modal>
        );
    }

    handleDefaultValueChange(index, defaultValue) {
        this.state.targetAttributes[index].defaultValue = defaultValue;
        this.updateState();
    }

    handleMapOption(index, value) {
        this.optionMapping.options[index].mappedTo = value;
        this.updateState();
    }

    saveOptionMapping() {
        this.state.targetAttributes[this.optionMappingIndex] = Object.assign(
            {},
            this.optionMapping
        );
        this.showOptionMapping = false;
        this.optionMapping = {};
        this.optionMappingIndex = -1;
        this.updateState();
    }

    handleMapAttributes(index, attr) {
        this.state.targetAttributes[index].mappedTo = attr;
        if (!isUndefined(this.state.targetAttributes[index].options)) {
            const targetAttr = this.getSelectedTargetAttribute(attr);
            if (!isUndefined(targetAttr.options) && targetAttr.options.length > 0) {
                this.state.targetAttributes[index].sourceOptions = targetAttr.options;
            }
        }
        this.updateState();
    }

    getSelectedTargetAttribute(attr) {
        for (let i = 0; i < this.state.sourceAttributes.length; i++) {
            if (this.state.sourceAttributes[i].value === attr) {
                return this.state.sourceAttributes[i];
            }
        }
    }

    showOptionMappingModal(index) {
        this.optionMapping = this.state.targetAttributes[index];
        this.showOptionMapping = true;
        this.optionMappingIndex = index;
        this.updateState();
    }

    renderNextStepButton() {
        return (
            <React.Fragment>
                {this.state.activeStep < 2 && (
                    <Button
                        onClick={() => {
                            this.saveDataAndMoveToNextStep();
                        }}
                        primary
                    >
                        Save And Move to Next Step
                    </Button>
                )}
                {this.state.activeStep === 2 && (
                    <Button
                        onClick={() => {
                            this.saveDataAndMoveToNextStep();
                        }}
                        primary
                    >
                        Save
                    </Button>
                )}
            </React.Fragment>
        );
    }

    renderBackStepButton() {
        return (
            <React.Fragment>
                {this.state.activeStep > 1 && (
                    <Button
                        primary
                        onClick={() => {
                            this.moveToPreviousStep();
                        }}
                    >
                        Back
                    </Button>
                )}
            </React.Fragment>
        );
    }

    render() {
        return (
            <Page
                primaryAction={{
                    content: "Back",
                    onClick: () => {
                        this.redirect("/panel/profiling");
                    }
                }}
                title="Create Profile"
            >
                <div className="row">
                    <div className="col-12">
                        <Card>
                            <div className="p-5">{this.renderProgressBar()}</div>
                        </Card>
                    </div>
                    <div className="col-12 mt-4">
                        <Card>
                            <div className="row p-5">
                                <div className="col-12 text-center pt-3 pb-3">
                                    <div className="row">
                                        {/*<div*/}
                                            {/*className="col-md-6 col-sm-6 col-12 text-md-left text-sm-left text-center pt-3 pb-3">*/}
                                            {/*{this.renderBackStepButton()}*/}
                                        {/*</div>*/}
                                        <div
                                            className="col-md-6 col-sm-6 col-12 text-md-right text-sm-right text-center pt-3 pb-3">
                                            {/*{this.renderNextStepButton()}*/}
                                        </div>
                                    </div>
                                </div>
                                {this.state.activeStep === 1 && (
                                    <div className="col-12 pt-3 pb-3">{this.renderStepOne()}</div>
                                )}
                                {this.state.activeStep === 2 && (
                                    <div className="col-12 pt-3 pb-3">{this.renderStepTwo()}</div>
                                )}
                                {/*{*/}
                                {/*this.state.activeStep === 3 &&*/}
                                {/*<div className="col-12 pt-3 pb-3">*/}
                                {/*{this.renderStepThree()}*/}
                                {/*</div>*/}
                                {/*}*/}
                                {/*{*/}
                                {/*this.state.activeStep === 4 &&*/}
                                {/*<div className="col-12 pt-3 pb-3">*/}
                                {/*{this.renderStepFour()}*/}
                                {/*</div>*/}
                                {/*}*/}
                                <div className="col-12 text-center pt-3 pb-3">
                                    <div className="row">
                                        {/*<div*/}
                                            {/*className="col-md-6 col-sm-6 col-12 text-md-left text-sm-left text-center pt-3 pb-3">*/}
                                            {/*{this.renderBackStepButton()}*/}
                                        {/*</div>*/}
                                        <div
                                            className="col-md-6 col-sm-6 col-12 text-md-right text-sm-right text-center pt-3 pb-3">
                                            {this.renderNextStepButton()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Page>
        );
    }

    moveToPreviousStep() {
        switch (this.state.activeStep) {
            case 3:
                this.state.activeStep = 2;
                this.fetchDataForSteptwo(true);
                break;
            case 2:
                this.state.products_select.query = "";
                this.state.products_select.targetCategory = "";
                this.state.activeStep = 1;
                this.fetchDataForStepOne();
                break;
        }
    }

    saveDataAndMoveToNextStep() {
        // console.log(this.state.activeStep);
        switch (this.state.activeStep) {
            case 1:
                // console.log(this.validateStepOne());
                if (this.validateStepOne()) {
                    // console.log(this.state.array_marketpalce_imported);
                    if (this.state.basicDetails.source === 'fileimporter'){
                        this.saveProfileData();
                        this.state.for_profiling = true;
                        break;
                    }

                    for (let i = 0; i < this.state.array_marketpalce_imported.length; i++) {
                        // console.log(this.state.array_marketpalce_imported);
                        if (this.state.basicDetails.source === this.state.array_marketpalce_imported[i]) {
                            this.saveProfileData();
                            this.state.for_profiling = true;
                            break;
                        }
                        else {
                            this.state.for_profiling = false
                        }
                    }
                    if (!this.state.for_profiling) {
                        notify.error("Products not found for this Marketplace")
                    }
                }
                break;
            case 2:
                if (this.validateStepTwo()) {
                    this.saveProfileData();
                } else {
                    notify.error(
                        "Please choose product target Location, and add query to select products to upload."
                    );
                }
                break;
            // case 3:
            //     if (this.validateStepThree()) {
            //         this.saveProfileData();
            //     } else {
            //         notify.error('Please map all required attributes first.');
            //     }
            //     break;
        }
        this.updateState();
    }

    validateStepOne() {
        if (
            this.state.basicDetails.source === "" ||
            this.state.basicDetails.name === "" ||
            this.state.basicDetails.target === ""
        ) {
            notify.error("Please fill all the required fields.");
            return false;
        }
        else {
            return true;
        }
    }

    validateStepTwo() {
        if (this.state.products_select.query === "") {
            return false;
        } else {
            for (
                let i = 0;
                i < this.state.products_select.marketplaceAttributes.length;
                i++
            ) {
                if (
                    this.state.products_select.marketplaceAttributes[i].required &&
                    this.state.products_select.marketplaceAttributes[i].value === ""
                ) {
                    return false;
                }
            }
            return true;
        }
    }

    validateStepThree() {
        for (let i = 0; i < this.state.targetAttributes.length; i++) {
            if (
                this.state.targetAttributes[i].required &&
                this.state.targetAttributes[i].mappedTo === "" &&
                this.state.targetAttributes[i].defaultValue === "" &&
                !isUndefined(this.state.targetAttributes[i].visible) &&
                this.state.targetAttributes[i].visible
            ) {
                return false;
            }
        }
        return true;
    }

    updateState() {
        const state = this.state;
        this.setState(state);
    }

    redirect(url) {
        this.props.history.push(url);
    }
}
