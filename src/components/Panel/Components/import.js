import React, {Component} from "react";
import {NavLink} from "react-router-dom";
import "./import-component/import.css";
import "./switch.css";
import {
    Page,
    Card,
    Select,
    Button,
    Label,
    Modal,
    TextField,
    Collapsible,
    Tabs,
    Banner,
    DatePicker,
    DisplayText,
    Stack
} from "@shopify/polaris";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowAltCircleDown,
    faArrowAltCircleUp
} from "@fortawesome/free-solid-svg-icons";

import {notify} from "../../../services/notify";
import {requests} from "../../../services/request";
import {environment} from "../../../environments/environment";
import {capitalizeWord, validateImporter} from "./static-functions";
import FileImporter from "./import-component/fileimporter";
import {MagnetoImport} from "./import-component/MagnetoImport";
import EbayAffiliate from "./import-component/EbayAffiliate";
import AliExpress from "./import-component/AliExpress";
export class Import extends Component {
    profilesList = [];

    constructor(props) {
        let today_date = new Date();
        super(props);
        this.state = {
            listing_type: "active",
            selectedLocation: 'NA',
            selectedUploadStatus: 'all',
            publishOnShopify: 'publish',
            switch: false,
            TabToBeRender: '',
            customUpload: false,
            isLocationPresent: false,
            importServicesList: [],
            importerShopLists: [],
            uploadServicesList: [],
            uploaderShopLists: [],
            finalRenderImporterShopLists: [],
            showImportProducts: false,
            showUploadProducts: false,
            importProductsDetails: {
                source: "",
                shop: "",
                shop_id: ""
            },
            affiliate: {
                type: "asin",
                value: ""
            },
            amazon_list_type: "all",
            ebay_list_type: "active",
            uploadProductDetails: {
                source: "",
                source_shop: "",
                source_shop_id: "",
                target: "",
                target_shop: "",
                target_shop_id: "",
                selected_profile: "",
                profile_type: ""
            },
            selectedEndDate : new  Date(),
            selectedStartDate : new  Date(),
            startDate: null,
            endDate: null,
            dd: today_date.getDate(),
            mm: today_date.getMonth(), //January is 0!
            yyyy: today_date.getFullYear(),
            edd: today_date.getDate(),
            emm: today_date.getMonth(), //January is 0!
            eyyyy: today_date.getFullYear(),
            openModal: false,
            necessaryInfo: {},
            mainTab: 0
        };
        this.getAllImporterServices();
        this.getAllUploaderServices();
        this.redirect = this.redirect.bind(this);
        this.handleModalChange = this.handleModalChange.bind(this);
        this.getShopifyConfigurations();
        this.customUploadDiv();
        this.handleSelectUploadStatus = this.handleSelectUploadStatus.bind(this);
        this.handleSelectPublishStatus = this.handleSelectPublishStatus.bind(this);

    }

    componentWillReceiveProps(nextPorps) {
        // console.log("qwerty",nextPorps);
        if (nextPorps.necessaryInfo !== undefined) {
            this.setState({necessaryInfo: nextPorps.necessaryInfo});
        }
    }

    customUploadDiv() {
        requests
            .getRequest("ebayimporter/request/customUploadDiv")
            .then(data => {
                if (data.success) {
                    this.setState({
                        customUpload: true
                    })
                }
            });
    }

    handleChangeForCustomUpload() {
        requests
            .getRequest("ebayimporter/request/initiateCustomUpload")
            .then(data => {
                if (data.success) {

                }
            });
    }

    getAllImporterServices() {
        requests
            .getRequest("connector/get/services", {"filters[type]": "importer"})
            .then(data => {
                if (data.success) {
                    this.state.importServicesList = [];
                    for (let i = 0; i < Object.keys(data.data).length; i++) {
                        let key = Object.keys(data.data)[i];
                        // console.log("key = ",  key)
                        if (data.data[key].usable || !environment.isLive) {
                            if (validateImporter(data.data[key].code)) {
                                // console.log(data.data[key].code)
                                if (data.data[key].code !== 'fba' && data.data[key].code !== 'bigmanager_importer') {
                                    this.state.importServicesList.push({
                                        label: data.data[key].title,
                                        value: data.data[key].marketplace,
                                        shops: [] //data.data[key].shops
                                    });
                                }
                            }
                        }
                    }
                    // console.log("marketplace = = = ", this.state.importServicesList);
                    this.updateState();
                    // console.log(this.state.importServicesList);
                    for (let i = 0; i < this.state.importServicesList.length; i++) {
                        if (this.state.importServicesList[i]['value'] !== 'fileimporter' && this.state.importServicesList[i]['value'] !== 'bigmanager' /*&& this.state.importServicesList[i]['value'] !== 'aliexpress'*/) {
                            this.state.finalRenderImporterShopLists.push(this.state.importServicesList[i]);
                        }
                    }
                } else {
                    notify.error(data.message);
                }
            });
    }

    getAllUploaderServices() {
        requests
            .getRequest("connector/get/services", {"filters[type]": "uploader"})
            .then(data => {
                if (data.success) {
                    this.state.uploadServicesList = [];
                    for (let i = 0; i < Object.keys(data.data).length; i++) {
                        let key = Object.keys(data.data)[i];
                        if (data.data[key].usable || !environment.isLive) {
                            this.state.uploadServicesList.push({
                                label: data.data[key].title,
                                value: data.data[key].marketplace,
                                shops: data.data[key].shops
                            });
                        }
                    }
                    // this.handleImportChange('shop','shopify');
                    this.updateState();
                } else {
                    notify.error(data.message);
                }
            });
        // console.log("hello",this.state.uploadServicesList);
    }

    renderImportProductsModal() {
        // console.log(this.state.importProductsDetails.source);
        // console.log("qqqqq = ",this.state.importProductsDetails.source.toLowerCase());
        return (
            <div>
                <Modal
                    open={this.state.showImportProducts}
                    onClose={() => {
                        this.state.showImportProducts = false;
                        this.updateState();
                    }}
                    title="Import Products"
                >
                    <Modal.Section>
                        <div className="row">
                            <div className="col-12 pt-1 pb-1">
                                <Select
                                    label="Import From"
                                    placeholder="Marketplace"
                                    options={this.state.finalRenderImporterShopLists}
                                    onChange={this.handleImportChange.bind(this, "source")}
                                    value={this.state.importProductsDetails.source}
                                />
                            </div>
                            {this.handleMarketplaceAdditionalInput(
                                this.state.importProductsDetails.source.toLowerCase()
                            )}
                            <div className="col-12 pt-1 pb-1">
                                {this.state.importProductsDetails.source !== "" &&
                                this.state.importerShopLists.length > 1 && (
                                    <Select
                                        label="Shop"
                                        placeholder="Source Shop"
                                        options={this.state.importerShopLists}
                                        onChange={this.handleImportChange.bind(this, "shop")}
                                        value={this.state.importProductsDetails.shop}
                                    />
                                )}
                            </div>
                            {this.state.importProductsDetails.source !== 'ebayaffiliate' && this.state.importProductsDetails.source !== 'aliexpress' ?
                                <div className="col-12 pt-1 pb-1 text-center">
                                    <Button
                                        disabled={this.state.importProductsDetails.source === ""}
                                        onClick={() => {
                                            this.importProducts();
                                        }}
                                        primary
                                    >
                                        Import Products
                                    </Button>
                                </div> : null}
                        </div>
                    </Modal.Section>
                </Modal>
            </div>
        );
    }

    handleChange = value => {
        let start = new Date(value.start);

        let month_start = start.getMonth() + 1;
        let day_start = start.getDate();
        if (month_start < 10) {
            month_start = "0" + month_start;
        }
        if (day_start < 10) {
            day_start = "0" + day_start;
        }
        this.setState({
            selectedStartDate : start
        })
        start = start.getFullYear() + "-" + month_start + "-" + day_start;
        this.setState({
            startDate: start,
        });
    };

    handleMonthChange = (month, year) => {
        this.setState({
            mm: month,
            yyyy: year
        });
    };

    handleChangeEnd = value => {
        let start = new Date(value.start);

        let month_start = start.getMonth() + 1;
        let day_start = start.getDate();
        if (month_start < 10) {
            month_start = "0" + month_start;
        }
        if (day_start < 10) {
            day_start = "0" + day_start;
        }
        this.setState({
            selectedEndDate:start
        })
        start = start.getFullYear() + "-" + month_start + "-" + day_start;
        this.setState({
            endDate: start,
        });
    };

    handleMonthChangeEnd = (month, year) => {
        this.setState({
            emm: month,
            eyyyy: year
        });
    };

    switchclick = () => {
        this.setState({
            switch: !this.state.switch
        })
    };

    handleMarketplaceAdditionalInput = marketplace => {
        switch (marketplace) {
            case "etsyimporter":
                return (
                    <div className="col-12 pt-1 pb-1">
                        <Select
                            label="Product Listing Type"
                            options={[
                                {label: "Active Products", value: "active"},
                                {label: "Inactive Products", value: "edit"},
                                {label: "Expired Products", value: "expired"},
                                {label: "Draft Products", value: "draft"}
                            ]}
                            value={this.state.listing_type}
                            onChange={this.handleImportChange.bind(this, "listing_type")}
                        />
                    </div>
                );
            case "amazonaffiliate":
                return (
                    <div className="col-12 pt-1 pb-1">
                        <Select
                            label="Product Type"
                            options={[
                                {label: "ASIN", value: "asin"},
                                {label: "Product URL", value: "product_url"}
                            ]}
                            onChange={this.handleImportChange.bind(this, "affiliate_type")}
                            value={this.state.affiliate.type}
                        />
                        <TextField
                            label={"Value"}
                            onChange={this.handleImportChange.bind(this, "affiliate_value")}
                            value={this.state.affiliate.value}
                            multiline
                            helpText={
                                "You can enter Comma separated e.g :- BF123RRSF,BGTR45WSD"
                            }
                        />
                    </div>
                );
            case "ebayaffiliate":
                return (
                    <div className="col-12 pt-2 pb-1">
                        <div className="col-12 text-right" style={{color: '#bf0711'}}>
                            <Button monochrome outline
                                    onClick={() => {
                                        window.open(
                                            "http://apps.cedcommerce.com/importer/ebaydropshippingImporter.pdf"
                                        );
                                    }}
                                    size={"slim"}
                            >
                                Help PDF
                            </Button>
                        </div>
                        <div className="pt-3">
                            <EbayAffiliate {...this.props}/>
                        </div>
                    </div>
                );

            case "aliexpress":
                return (
                    <div className="col-12 pt-2 pb-1">
                        {/*<div className="col-12 text-right" style={{color: '#bf0711'}}>
                         <Button monochrome outline
                         onClick={() => {
                         window.open(
                         "http://apps.cedcommerce.com/importer/ebaydropshippingImporter.pdf"
                         );
                         }}
                         size={"slim"}
                         >
                         Help PDF
                         </Button>
                         </div>*/}
                        <React.Fragment>
                            <AliExpress {...this.props} redirect={this.redirect}/>
                        </React.Fragment>
                    </div>
                );
            case "ebayimporter":
                // case "amazonimporter":
                // 	return (
                // 		<div className="col-12 pt-1 pb-1">
                // 			<Select
                // 				label="Account Name To Be Import"
                // 				options={[
                // 					{ label: "AmazonUS", value: "all" },
                // 					{ label: "AmazonUK", value: "active" },
                // 					{ label: "AmazonDE", value: "inactive" }
                // 				]}
                // 				onChange={e => {
                // 					this.setState({ amazon_list_type: e });
                // 				}}
                // 				value={this.state.amazon_list_type}
                // 			/>
                // 		</div>
                // 	);
                return (
                    <div className="col-12 pt-1 pb-1">
                        <Select
                            disabled = {this.state.switch}
                            label="Product Type"
                            options={[
                                {label: "Active Listing", value: "active"},
                                {label: "Unsold Listing", value: "unsold"},
                                {label: "Schedule Listing", value: "schedule_listing"}
                            ]}
                            onChange={e => {
                                this.setState({ebay_list_type: e});
                            }}
                            value={this.state.ebay_list_type}
                        />
                        <div>
                            <Stack distribution="fillEvenly">
                                <div className="pt-3">
                                    <DisplayText size="small">Product to be import by custom date</DisplayText>
                                </div>
                                <div className="pt-3">
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            onClick={() => {
                                                this.switchclick();
                                            }}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </Stack>
                            {!this.state.switch ? null :
                                <Stack>
                                    <DatePicker
                                        month={this.state.mm}
                                        year={this.state.yyyy}
                                        multiMonth={false}
                                        selected={this.state.selectedStartDate}
                                        onChange={this.handleChange}
                                        onMonthChange={this.handleMonthChange}
                                    />

                                    <DatePicker
                                        month={this.state.emm}
                                        year={this.state.eyyyy}
                                        multiMonth={false}
                                        selected={this.state.selectedEndDate}
                                        onChange={this.handleChangeEnd}
                                        onMonthChange={this.handleMonthChangeEnd}
                                    />
                                </Stack>}


                        </div>

                    </div>


                );
        }
    };

    /*handleImportChange(key, value) {
     console.log("value = ",value);
     console.log("key = ",key);
     this.state.importProductsDetails[key] = value;
     if (key === "--Customer Action--") {
     console.log("aaaa = ",this.state.importServicesList);
     console.log("in if condition of key ===")
     this.state.importerShopLists = [];
     this.state.importProductsDetails.shop = "";
     this.state.importProductsDetails.shop_id = "";
     for (let i = 0; i < this.state.importServicesList.length; i++) {
     if (this.state.importServicesList[i].value === value) {
     for (
     let j = 0;
     j < this.state.importServicesList[i].shops.length;
     j++
     ) {
     this.state.importerShopLists.push({
     label: this.state.importServicesList[i].shops[j].shop_url,
     value: this.state.importServicesList[i].shops[j].shop_url,
     shop_id: this.state.importServicesList[i].shops[j].id
     });
     }
     break;
     }
     }
     console.log("aaaaaaaasssssssss = ",this.state.importerShopLists);
     if (this.state.importerShopLists.length > 0) {
     this.state.importProductsDetails.shop = this.state.importerShopLists[0].value;
     this.state.importProductsDetails.shop_id = this.state.importerShopLists[0].shop_id;
     }
     } else if (key === "Import") {
     for (let i = 0; i < this.state.importerShopLists.length; i++) {
     if (this.state.importerShopLists[i].value === value) {
     this.state.importProductsDetails.shop_id = this.state.importerShopLists[
     i
     ].shop_id;
     break;
     }
     }
     } else if (key === "Upload") {
     this.state.listing_type = value;
     }
     this.updateState();
     }*/
    handleImportChange(key, value) {
        this.state.importProductsDetails[key] = value;
        if (key === "source") {
            this.state.importerShopLists = [];
            this.state.importProductsDetails.shop = "";
            this.state.importProductsDetails.shop_id = "";
            for (let i = 0; i < this.state.importServicesList.length; i++) {
                if (this.state.importServicesList[i].value === value) {
                    for (
                        let j = 0;
                        j < this.state.importServicesList[i].shops.length;
                        j++
                    ) {
                        this.state.importerShopLists.push({
                            label: this.state.importServicesList[i].shops[j].shop_url,
                            value: this.state.importServicesList[i].shops[j].shop_url,
                            shop_id: this.state.importServicesList[i].shops[j].id
                        });
                    }
                    break;
                }
            }
            if (this.state.importerShopLists.length > 0) {
                this.state.importProductsDetails.shop = this.state.importerShopLists[0].value;
                this.state.importProductsDetails.shop_id = this.state.importerShopLists[0].shop_id;
            }
        } else if (key === "shop") {
            for (let i = 0; i < this.state.importerShopLists.length; i++) {
                if (this.state.importerShopLists[i].value === value) {
                    this.state.importProductsDetails.shop_id = this.state.importerShopLists[
                        i
                        ].shop_id;
                    break;
                }
            }
        } else if (key === "listing_type") {
            this.state.listing_type = value;
        } else if (key === "affiliate_type") {
            this.state.affiliate.type = value;
        } else if (key === "affiliate_value") {
            this.state.affiliate.value = value;
        }
        this.updateState();
    }

    importProducts() {
        let sendData = {
            marketplace: this.state.importProductsDetails.source,
            shop: this.state.importProductsDetails.shop,
            shop_id: this.state.importProductsDetails.shop_id
        };
        if (this.state.importProductsDetails.source === "etsyimporter") {
            sendData["listing_type"] = this.state.listing_type;
        }
        if (this.state.importProductsDetails.source === "amazonaffiliate") {
            sendData["import_identifier"] = this.state.affiliate.type;
            sendData["identifier_value"] = this.state.affiliate.value;
        }
        if (this.state.importProductsDetails.source === "ebayimporter") {
            sendData["list_type"] = this.state.ebay_list_type;
            if (this.state.switch || this.state.startDate != null || this.state.endDate != null) {
                sendData["startDate"] = this.state.startDate;
                sendData["endDate"] = this.state.endDate;
            }

        }
        if (this.state.importProductsDetails.source === "amazonimporter") {
            sendData["accountname"] = this.state.amazon_list_type;
        }
        if (this.state.importProductsDetails.source === "etsydropshipping") {
            sendData["listing_type"] = this.state.listing_type;
        }
        requests.getRequest("connector/product/import", sendData).then(data => {
            this.state.showImportProducts = false;
            this.updateState();
            if (data.success === true) {
                if (
                    data.code === "product_import_started" ||
                    data.code === "import_started"
                ) {
                    notify.info("Import process started. Check progress in activities section.");
                    setTimeout(() => {
                        this.redirect("/panel/queuedtasks");
                    }, 1000);
                } else {
                    notify.success(data.message);
                }
            } else {
                if (data.code === "import_failed") {
                    setTimeout(() => {
                        this.redirect("/panel/accounts");
                    }, 1000);
                    notify.info("User Account Not Found. Please Connect The Account First.");
                } else if (data.code === "already_in_progress") {
                    setTimeout(() => {
                        this.redirect("/panel/accounts");
                    }, 1000);
                    notify.info(data.message);
                } else {
                    notify.error(data.message);
                }
            }
        });
    }

    getShopifyConfigurations() {
        requests
            .getRequest("connector/get/config", {marketplace: "shopify"})
            .then(data => {
                if (data.success) {
                    if (data.data[0]['value'] != "") {
                        var locationValue = data.data[0]['value'];
                        this.setState({
                            selectedLocation: data.data[0]['options'][locationValue]
                        })
                    }
                    else {
                        this.setState({
                            isLocationPresent: true,
                        })
                    }
                } else {
                    notify.error(data.message);
                }
            });
    }

    handleSelectUploadStatus(event) {
        this.setState({
            selectedUploadStatus: event
        });
    }

    handleSelectPublishStatus(event) {
        this.setState({
            publishOnShopify: event
        });
    }

    renderUploadProductsModal() {
        const status_to_upload = [
            {
                label: "All",
                value: "all"
            },
            {
                label: "Uploaded Products",
                value: "uploaded"
            },
        ];
        const publish_status = [
            {
                label: "Published",
                value: "publish"
            },
            {
                label: "Unpublished",
                value: "unpublish"
            },
        ];
        return (
            <Modal
                open={this.state.showUploadProducts}
                onClose={() => {
                    this.state.showUploadProducts = false;
                    this.updateState();
                }}
                title="Upload Products"
            >
                <Modal.Section>
                    <div className="row">
                        <div className="col-12 pt-1 pb-1 mt-2 mb-2">
                            <Select
                                label="Upload Products Of"
                                placeholder="Product Source"
                                options={this.state.importServicesList}
                                onChange={this.handleUploadChange.bind(this, "source")}
                                value={this.state.uploadProductDetails.source}
                            />
                        </div>
                        <div className="col-12 pt-1 pb-1 mt-2 mb-2">
                            <Select
                                label="Upload By Status"
                                placeholder="Upload Product By Status In App"
                                options={status_to_upload}
                                onChange={this.handleSelectUploadStatus}
                                value={this.state.selectedUploadStatus}
                            />
                        </div>
                        <div className="col-12 pt-1 pb-1 mt-2 mb-2">
                            <Select
                                label="Want to list your products on Shopify as:"
                                placeholder="Want to list your products on Shopify as?"
                                options={publish_status}
                                onChange={this.handleSelectPublishStatus}
                                value={this.state.publishOnShopify}
                            />
                        </div>
                        {this.state.uploadProductDetails.source !== "" &&
                        this.state.importerShopLists.length > 1 && (
                            <div className="col-12 pt-1 pb-1 mt-2 mb-2">
                                <Select
                                    label={"Amazon Shop"}
                                    placeholder="Source Shop"
                                    options={this.state.importerShopLists}
                                    onChange={this.handleUploadChange.bind(this, "source_shop")}
                                    value={this.state.uploadProductDetails.source_shop}
                                />
                            </div>
                        )}
                        <div className="col-12 pt-1 pb-1 mt-2 mb-2">
                            <Select
                                label="Upload Products To"
                                placeholder="Target"
                                disabled={true}
                                options={this.state.uploadServicesList}
                                onChange={this.handleUploadChange.bind(this, "target")}
                                value={this.state.uploadProductDetails.target}
                            />
                        </div>
                        {this.state.uploadProductDetails.target !== "" &&
                        this.state.uploaderShopLists.length > 1 && (
                            <div className="col-12 pt-1 pb-1 mt-2 mb-2">
                                <Select
                                    label={"Shopify Shop"}
                                    placeholder="Target Shop"
                                    options={this.state.uploaderShopLists}
                                    onChange={this.handleUploadChange.bind(this, "target_shop")}
                                    value={this.state.uploadProductDetails.target_shop}
                                />
                            </div>
                        )}
                        {/*<div className="col-12 pt-1 pb-1">*/}
                            {/*<Banner status="info">*/}
                                {/*<Label>*/}
                                    {/*Upload specific product on Shopify by creating profile{" "}*/}
                                    {/*<NavLink to="/panel/profiling/create">click here</NavLink>*/}
                                {/*</Label>*/}
                            {/*</Banner>*/}
                        {/*</div>*/}
                        <div className="col-12 pt-1 pb-1">
                                        {this.state.uploadProductDetails.profile_type !== "custom" && (
                                <Select
                                    label="Upload Through"
                                    placeholder="Choose Profile"
                                    options={[
                                        {
                                            label: "Default Profile(Upload products with default attribute mapping)",
                                            value: "default_profile"
                                        },
                                        {
                                            label: "Custom Profile(Upload products by providing attribute mapping details by yourself)",
                                            value: "custom_profile"
                                        }
                                    ]}
                                    onChange={this.handleUploadChange.bind(
                                        this,
                                        "selected_profile"
                                    )}
                                    value={this.state.uploadProductDetails.selected_profile}
                                />
                            )}
                        </div>
                        <div className="col-12 pt-1 pb-1">
                            <div>
                                <Button plain
                                        onClick={() => {
                                            this.redirect("/panel/configuration")
                                        }}>
                                    Click Here
                                </Button>
                                {' '}to Select the warehouse
                            </div>
                            {this.state.isLocationPresent ?
                                <TextField
                                    disabled value={this.state.selectedLocation}
                                    // helpText="You can change Warehouse from Setting Section"
                                    error="Warehouse not selected"
                                    // labelAction={{content: 'Settings'}}
                                /> :
                                <TextField label="Selected Warehouse"
                                           disabled value={this.state.selectedLocation}
                                    // helpText="You can change Warehouse from Setting Section"
                                    // labelAction={{content: 'Settings Option'}}
                                />}
                        </div>
                        {/*<div className="col-12 pt-1 pb-1" style={{color: '#000000'}}>
                         You can change Warehouse from Setting Section By{' '}
                         <Button
                         plain primary
                         onClick={() => {
                         this.redirect("/panel/configuration")}}
                         >
                         Checking Here
                         </Button>
                         </div>*/}
                        {this.state.uploadProductDetails.profile_type === "custom" && (
                            <div className="col-12 pt-1 pb-1">
                                {this.profilesList.length > 0 && (
                                    <Select
                                        label="Select Custom Profile"
                                        options={this.profilesList}
                                        placeholder="Custom Profile"
                                        onChange={this.handleProfileSelect.bind(this)}
                                        value={this.state.uploadProductDetails.selected_profile}
                                    />
                                )}
                                {this.profilesList.length === 0 && (
                                    <div className="text-center">
                                        <Banner status="warning">
                                            <Label>
                                                No profiles for{" "}
                                                {this.state.uploadProductDetails.source ===
                                                "amazonimporter"
                                                    ? "Amazon"
                                                    : capitalizeWord(
                                                        this.state.uploadProductDetails.source
                                                    )}{" "}
                                                and{" "}
                                                {this.state.uploadProductDetails.target === "shopifygql"
                                                    ? "Shopify"
                                                    : capitalizeWord(
                                                        this.state.uploadProductDetails.target
                                                    )}
                                            </Label>
                                        </Banner>
                                        <div className="text-center mt-2 mb-2">
                                            <Button
                                                onClick={() => {
                                                    this.redirect("/panel/profiling/create");
                                                }}
                                                primary
                                            >
                                                Create Profile
                                            </Button>
                                        </div>
                                        <div className="text-center mt-2 mb-2">
                                            <Button
                                                onClick={() => {
                                                    this.state.uploadProductDetails.profile_type = "";
                                                    this.state.uploadProductDetails.selected_profile =
                                                        "default_profile";
                                                    this.updateState();
                                                }}
                                                primary
                                            >
                                                Select Default Profile
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="col-12 text-center pt-3 pb-3">
                            <Button
                                onClick={() => {
                                    this.uploadProducts();
                                }}
                                disabled={!(this.state.uploadProductDetails.source !== "")}
                                primary
                            >
                                Upload Products
                            </Button>
                        </div>
                    </div>
                </Modal.Section>
            </Modal>
        );
    }

    handleProfileSelect(profile) {
        this.state.uploadProductDetails.selected_profile = profile;
        this.updateState();
    }

    handleUploadChange(key, value) {
        switch (key) {
            case "selected_profile":
                if (value === "custom_profile") {
                    if (
                        this.state.uploadProductDetails.source === "" ||
                        this.state.uploadProductDetails.target === ""
                    ) {
                        notify.info(
                            "Please choose product import source and product upload target first"
                        );
                    } else {
                        this.getMatchingProfiles();
                        this.state.uploadProductDetails.profile_type = "custom";
                        this.state.uploadProductDetails[key] = "";
                    }
                } else {
                    this.state.uploadProductDetails.profile_type = "";
                    this.state.uploadProductDetails[key] = value;
                }
                break;
            case "source":
                this.state.importerShopLists = [];
                this.state.uploadProductDetails.source = value;
                this.state.uploadProductDetails.profile_type = "";
                this.state.uploadProductDetails.selected_profile = "default_profile";
                this.state.uploadProductDetails.source_shop = "";
                this.state.uploadProductDetails.source_shop_id = "";
                for (let i = 0; i < this.state.importServicesList.length; i++) {
                    if (this.state.importServicesList[i].value === value) {
                        for (
                            let j = 0;
                            j < this.state.importServicesList[i].shops.length;
                            j++
                        ) {
                            this.state.importerShopLists.push({
                                label: this.state.importServicesList[i].shops[j].shop_url,
                                value: this.state.importServicesList[i].shops[j].shop_url,
                                shop_id: this.state.importServicesList[i].shops[j].id
                            });
                        }
                        break;
                    }
                }
                if (this.state.importerShopLists.length > 0) {
                    this.state.uploadProductDetails.source_shop = this.state.importerShopLists[0].value;
                    this.state.uploadProductDetails.source_shop_id = this.state.importerShopLists[0].shop_id;
                }
                break;
            case "target":
                this.state.uploaderShopLists = [];
                this.state.uploadProductDetails.target = value;
                this.state.uploadProductDetails.profile_type = "";
                this.state.uploadProductDetails.selected_profile = "default_profile";
                this.state.uploadProductDetails.target_shop = "";
                this.state.uploadProductDetails.target_shop_id = "";
                for (let i = 0; i < this.state.uploadServicesList.length; i++) {
                    if (this.state.uploadServicesList[i].value === value) {
                        for (
                            let j = 0;
                            j < this.state.uploadServicesList[i].shops.length;
                            j++
                        ) {
                            this.state.uploaderShopLists.push({
                                label: this.state.uploadServicesList[i].shops[j].shop_url,
                                value: this.state.uploadServicesList[i].shops[j].shop_url,
                                shop_id: this.state.uploadServicesList[i].shops[j].id
                            });
                        }
                        break;
                    }
                }
                if (this.state.uploaderShopLists.length > 0) {
                    this.state.uploadProductDetails.target_shop = this.state.uploaderShopLists[0].value;
                    this.state.uploadProductDetails.target_shop_id = this.state.uploaderShopLists[0].shop_id;
                }
                break;
            case "source_shop":
                this.state.uploadProductDetails.profile_type = "";
                this.state.uploadProductDetails.selected_profile = "default_profile";
                for (let i = 0; i < this.state.importerShopLists.length; i++) {
                    if (this.state.importerShopLists[i].value === value) {
                        this.state.uploadProductDetails.source_shop_id = this.state.importerShopLists[
                            i
                            ].shop_id;
                        this.state.uploadProductDetails.source_shop = this.state.importerShopLists[
                            i
                            ].value;
                        break;
                    }
                }
                break;
            case "target_shop":
                this.state.uploadProductDetails.profile_type = "";
                this.state.uploadProductDetails.selected_profile = "default_profile";
                for (let i = 0; i < this.state.uploaderShopLists.length; i++) {
                    if (this.state.uploaderShopLists[i].value === value) {
                        this.state.uploadProductDetails.target_shop_id = this.state.uploaderShopLists[
                            i
                            ].shop_id;
                        this.state.uploadProductDetails.target_shop = this.state.uploaderShopLists[
                            i
                            ].value;
                        break;
                    }
                }
                break;
        }
        this.updateState();
    }

    getMatchingProfiles() {
        this.profilesList = [];
        const data = {
            source: this.state.uploadProductDetails.source,
            target: this.state.uploadProductDetails.target
        };
        if (
            this.state.uploadProductDetails.source_shop !== "" &&
            this.state.uploadProductDetails.source_shop !== null
        ) {
            data["source_shop"] = this.state.uploadProductDetails.source_shop;
        }
        if (
            this.state.uploadProductDetails.target_shop !== "" &&
            this.state.uploadProductDetails.target_shop !== null
        ) {
            data["target_shop"] = this.state.uploadProductDetails.target_shop;
        }
        requests
            .getRequest("connector/profile/getMatchingProfiles", data)
            .then(data => {
                if (data.success) {
                    for (let i = 0; i < data.data.length; i++) {
                        this.profilesList.push({
                            label: data.data[i].name,
                            value: data.data[i].id.toString()
                        });
                    }
                    this.updateState();
                } else {
                    notify.error(data.message);
                }
            });
    }

    uploadProducts() {
        if (this.state.selectedLocation != "NA") {
            if (this.state.selectedUploadStatus == 'uploaded') {
                const data = Object.assign({}, this.state.uploadProductDetails);
                data["marketplace"] = data["target"];
                data["publish_status"] = this.state.publishOnShopify;
                requests
                    .postRequest("shopify/product/uploadAllUploadedProducts", data, false, false)
                    .then(data1 => {
                        if (data1['success']) {
                            notify.info(
                                "Upload process started. Check progress in activities section."
                            );
                            setTimeout(() => {
                                this.redirect("/panel/queuedtasks");
                            }, 1000);
                        } else {
                            notify.error("Please Contact Dev Team")
                        }
                    });
            }
            else if (this.state.selectedUploadStatus == 'all') {
                const data = Object.assign({}, this.state.uploadProductDetails);
                data["marketplace"] = data["target"];
                data["publish_status"] = this.state.publishOnShopify;
                requests.postRequest("connector/product/upload", data).then(data => {
                    this.state.showUploadProducts = false;
                    if (data.success) {
                        if (data.code === "product_upload_started") {
                            notify.info(
                                "Upload process started. Check progress in activities section."
                            );
                            setTimeout(() => {
                                this.redirect("/panel/queuedtasks");
                            }, 1000);
                        } else {
                            notify.success(data.message);
                        }
                    } else {
                        // notify.error(data.message);
                        if (data.code === "link_your_account") {
                            setTimeout(() => {
                                this.redirect("/panel/accounts");
                            }, 1200);
                            notify.info("Account Not Linked.");
                        }
                        if (data.code === "limit_exhausted") {
                            setTimeout(() => {
                                this.redirect("/panel/plans");
                            }, 1000);
                            notify.info("Credit Not Available.");
                        } else {
                            notify.error(data.message);
                        }
                    }
                    this.updateState();
                });
            }
            else {
                notify.error("In Maintaince Please Try After Some Time")
            }

        }
        else {
            notify.error("Please select warehouse setting section")
        }
    }

    handleTabChange = (event, key = 'mainTab') => {
        this.setState({[key]: event});
    };

    getCollectionAndLocation() {
        // console.log("in function getCollectionAnd Location");
        requests
            .getRequest("frontend/importer/getCollectionShopify")
            .then(data => {
                // console.log(data);
                if (data.success) {
                    notify.success(data.code);
                } else {
                    notify.error(data.code);
                }
            });

    }

    handleChangeModakCsv = () => {
        // console.log("qwerty",this.state.active);
        // this.setState(({active}) => ({active: !active}));
        this.setState({
            active: !this.state.active
        })
        // console.log("asdfgh",this.state.active);
        // this.csvManagementRender();
    };

    hitInitiateSyncProduct() {
        requests.postRequest("shopify/product/buttonInitaiateSync").then(data => {
            if (data.success) {
                notify.success("Syncing for getting matching product from shopify start")
            }
        });
    }

    render() {
        let {mainTab, necessaryInfo} = this.state;
        const tabs = [
            {
                id: 'Import',
                content: 'Import',
                accessibilityLabel: 'All',
                panelID: 'all',
            }
        ];
        /*if( necessaryInfo.account_connected_array && necessaryInfo.account_connected_array.indexOf('aliexpress') > -1){
         tabs.push(
         {
         id: 'AliExpress',
         content: 'AliExpress Dropshipping',
         panelID: 'AliExpress',
         },
         )
         }*/
        /*if(  necessaryInfo.account_connected_array && necessaryInfo.account_connected_array.indexOf('ebayaffiliate') > -1 ){
         tabs.push(
         {
         id: 'Ebay Affiliate',
         content: 'Ebay Dropshipping',
         panelID: 'Ebay Affiliate',
         },
         )
         }*/
        return (
            <Page
                primaryAction={{
                    content: "Get Shopify Match Products",
                    onClick: () => {
                        this.hitInitiateSyncProduct();
                    }
                }}
                title="Manage Products">
                <Tabs
                    name={"hello"}
                    selected={this.state.mainTab}
                    tabs={tabs}
                    onSelect={this.handleTabChange}/>
                {mainTab === 0 ?
                    <div className="row">
                        <div className="col-12 p-3">
                            <Banner title="Information" status="info">
                                <Label>
                                    In order to upload your products to Shopify, click on
                                    “Import Products”. Further, click on “Upload Products” to convey
                                    product details from the app to Shopify. You can transfer the
                                    product details from CSV to the app by clicking on “Upload CSV”.
                                    {/*<a href="javascript:void(0)" onClick={this.handleModalChange}>
                                     Click Here
                                     </a>*/}
                                </Label>
                            </Banner>
                        </div>
                        {/*<div className="col-12">
                         <Button
                         fullWidth={true}
                         onClick={() => {
                         this.setState({ openFileUpload: !this.state.openFileUpload });
                         }}
                         >
                         CSV Import
                         </Button>
                         <Collapsible id={"ddd"} open={this.state.openFileUpload}>
                         <FileImporter {...this.props} />
                         </Collapsible>
                         </div>*/}
                        <div className="col-md-4 col-sm-4 col-12 p-3">
                            <Card>
                                <div
                                    onClick={() => {
                                        this.state.importProductsDetails.source = "";
                                        this.state.importProductsDetails.shop = "";
                                        this.state.importProductsDetails.shop_id = "";
                                        this.state.showImportProducts = true;
                                        this.updateState();
                                    }}
                                    style={{cursor: "pointer"}}
                                >
                                    <div className="text-center pt-5 pb-5">
                                        <FontAwesomeIcon
                                            icon={faArrowAltCircleDown}
                                            color="#3f4eae"
                                            size="10x"
                                        />
                                    </div>
                                    <div className="text-center pt-2 pb-4">
									<span className="h2" style={{color: "#3f4eae"}}>
										Import Products
									</span>
                                        <Label>(Pull from marketplace to app)</Label>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        <div className="col-md-4 col-sm-4 col-12 p-3">
                            <Card>
                                <div
                                    onClick={() => {
                                        this.state.uploadProductDetails.source = "";
                                        this.state.uploadProductDetails.target = "";
                                        this.state.uploadProductDetails.selected_profile = "";
                                        this.state.uploadProductDetails.profile_type = "";
                                        this.state.showUploadProducts = true;
                                        this.handleUploadChange("target", "shopifygql");
                                        this.handleUploadChange(
                                            "selected_profile",
                                            "default_profile"
                                        );
                                        this.updateState();
                                    }}
                                    style={{cursor: "pointer"}}
                                >
                                    <div className="text-center pt-5 pb-5">
                                        <FontAwesomeIcon
                                            icon={faArrowAltCircleUp}
                                            color="#3f4eae"
                                            size="10x"
                                        />
                                    </div>
                                    <div className="text-center pt-2 pb-4">
									<span className="h2" style={{color: "#3f4eae"}}>
										Upload Products
									</span>
                                        <Label>(Push From App To Shopify)</Label>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        <div className="col-md-4 col-sm-4 col-12 p-3">
                            <Card>
                                <div style={{cursor: "pointer"}}
                                     onClick={this.handleChangeModakCsv.bind(this)}
                                >
                                    <div className="text-center pt-5 pb-5">
                                        <img style={{height: '105px', width: '105px', cursor: "pointer"}}
                                             src={require("../../../assets/img/csv.svg")}
                                             onClick={this.handleChangeModakCsv.bind(this)}
                                        />
                                    </div>
                                    <div className="text-center pt-2 pb-4">
									<span className="h2" style={{color: "#3f4eae"}}>
										Upload CSV
									</span>
                                        <Label>(Upload Your CSV To App)</Label>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        {this.state.customUpload ? <div className="col-md-4 col-sm-4 col-12 p-3">
                            <Card>
                                <div style={{cursor: "pointer"}}
                                     onClick={this.handleChangeForCustomUpload.bind(this)}
                                >
                                    <div className="text-center pt-5 pb-5">
                                        <FontAwesomeIcon
                                            icon={faArrowAltCircleUp}
                                            color="#ae3f3f"
                                            size="10x"
                                        />
                                    </div>
                                    <div className="text-center pt-2 pb-4">
									<span className="h2" style={{color: "#ae3f3f"}}>
										Custom Upload
									</span>
                                        <Label>(Upload Your Product)</Label>
                                    </div>
                                </div>
                            </Card>
                        </div> : null}

                        <Modal
                            open={this.state.active}
                            onClose={this.handleChangeModakCsv.bind(this)}
                            title="Upload CSV"
                        >
                            <Modal.Section>
                                <FileImporter {...this.props} />
                            </Modal.Section>
                        </Modal>
                    </div> : tabs[mainTab].panelID === "AliExpress" ? (<React.Fragment>
                        <AliExpress {...this.props} redirect={this.redirect}/>
                    </React.Fragment>) : (tabs[mainTab].panelID === "Ebay Affiliate") ? (<React.Fragment>
                        <EbayAffiliate {...this.props}/>
                    </React.Fragment>) : null
                }
                {this.renderImportProductsModal()}
                {this.renderUploadProductsModal()}
                {this.renderHelpModal()}
                <input
                    type="hidden"
                    id="openHelpModal"
                    className="btn btn-primary"
                    data-toggle="modal"
                    data-target="#exampleModalCenter"
                />
            </Page>
        );
    }


    /*******************       *********************/

    renderHelpModal() {
        return (
            <React.Fragment>
                <div
                    className="modal fade"
                    id="exampleModalCenter"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalCenterTitle"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="modal-title" id="exampleModalLongTitle">
                                    How to Import/Upload Products
                                </h2>
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                >
									<span aria-hidden="true" style={{fontSize: "30px"}}>
										&times;
									</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-12">
                                        <div
                                            id="carouselExampleIndicators"
                                            className="carousel slide"
                                            data-ride="carousel"
                                            data-interval="4000"
                                        >
                                            <ol className="carousel-indicators">
                                                <li
                                                    data-target="#carouselExampleIndicators"
                                                    data-slide-to="0"
                                                    className="active"
                                                />
                                                <li
                                                    data-target="#carouselExampleIndicators"
                                                    data-slide-to="1"
                                                />
                                                <li
                                                    data-target="#carouselExampleIndicators"
                                                    data-slide-to="2"
                                                />
                                                <li
                                                    data-target="#carouselExampleIndicators"
                                                    data-slide-to="3"
                                                />
                                                <li
                                                    data-target="#carouselExampleIndicators"
                                                    data-slide-to="4"
                                                />
                                                <li
                                                    data-target="#carouselExampleIndicators"
                                                    data-slide-to="5"
                                                />
                                            </ol>
                                            <div className="carousel-inner">
                                                <div className="carousel-item active">
                                                    <img
                                                        className="d-block w-100"
                                                        src={require("../../../assets/img/s1.png")}
                                                        alt="First slide"
                                                        height={480}
                                                    />
                                                    <div className="carousel-caption text-dark">
                                                        <h2 className="cation-back">Step 1</h2>
                                                        {/*<h3 className="cation-back">Choose Import To Start The Import Process</h3>*/}
                                                    </div>
                                                </div>
                                                <div className="carousel-item">
                                                    <img
                                                        className="d-block w-100"
                                                        src={require("../../../assets/img/s2.png")}
                                                        alt="Second slide"
                                                        height={480}
                                                    />
                                                    <div className="carousel-caption text-dark">
                                                        <h2 className="cation-back">Step 2</h2>
                                                    </div>
                                                </div>
                                                <div className="carousel-item">
                                                    <img
                                                        className="d-block w-100"
                                                        src={require("../../../assets/img/s3.png")}
                                                        alt="Third slide"
                                                        height={480}
                                                    />
                                                    <div className="carousel-caption text-dark">
                                                        <h2 className="cation-back">Step 3</h2>
                                                    </div>
                                                </div>
                                                <div className="carousel-item">
                                                    <img
                                                        className="d-block w-100"
                                                        src={require("../../../assets/img/s4.png")}
                                                        alt="Third slide"
                                                        height={480}
                                                    />
                                                    <div className="carousel-caption text-dark">
                                                        <h2 className="cation-back">Step 4</h2>
                                                    </div>
                                                </div>
                                                <div className="carousel-item">
                                                    <img
                                                        className="d-block w-100"
                                                        src={require("../../../assets/img/s5.png")}
                                                        alt="Third slide"
                                                        height={480}
                                                    />
                                                    <div className="carousel-caption text-dark">
                                                        <h2 className="cation-back">Step 5</h2>
                                                    </div>
                                                </div>
                                                <div className="carousel-item">
                                                    <img
                                                        className="d-block w-100"
                                                        src={require("../../../assets/img/s6.png")}
                                                        alt="Third slide"
                                                        height={480}
                                                    />
                                                    <div className="carousel-caption text-dark">
                                                        <h2 className="cation-back">Step 6</h2>
                                                    </div>
                                                </div>
                                            </div>
                                            <a
                                                className="carousel-control-prev"
                                                href="#carouselExampleIndicators"
                                                role="button"
                                                data-slide="prev"
                                            >
												<span
                                                    className="carousel-control-prev-icon"
                                                    aria-hidden="true"
                                                />
                                                <span className="sr-only">Previous</span>
                                            </a>
                                            <a
                                                className="carousel-control-next"
                                                href="#carouselExampleIndicators"
                                                role="button"
                                                data-slide="next"
                                            >
												<span
                                                    className="carousel-control-next-icon"
                                                    aria-hidden="true"
                                                />
                                                <span className="sr-only">Next</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*<div className="pb-5">*/}
                            {/*<div className="d-none text-center d-md-block text-dark">*/}
                            {/*<h2>Step 1</h2>*/}
                            {/*<h3>Choose Import To Start The Import Process</h3>*/}
                            {/*</div>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    handleModalChange() {
        // this.setState({openModal: !this.state.openModal});
        document.getElementById("openHelpModal").click();
    }

    updateState() {
        const state = this.state;
        this.setState(state);
    }

    redirect(url, data) {
        if (data !== undefined) {
            this.props.history.push(url, data);
        } else this.props.history.push(url);
    }
}
