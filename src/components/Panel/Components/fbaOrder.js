/**
 * Created by cedcoss on 17/6/19.
 */
import React, {Component} from "react";
import {isUndefined} from "util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowAltCircleDown,
    faArrowAltCircleUp
} from "@fortawesome/free-solid-svg-icons";
import {
    Page,
    Card,
    Select,
    Pagination,
    Label,
    ResourceList,
    Modal,
    TextContainer,
    Tabs,
    TextField,
    Banner,
    Badge,
    Button,
    Stack,
    Icon
} from "@shopify/polaris";

import {requests} from "../../../services/request";
import {notify} from "../../../services/notify";
import {
    ViewMinor,EditMinor
} from '@shopify/polaris-icons';

import SmartDataTable from "../../../shared/smartTable";

import {paginationShow} from "./static-functions";
export class FbaOrder extends Component {
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
    customButton = ["button_order"]; // button
    columnTitles = {
        shopify_order_name: {
            title: "Shopify Order",
            sortable: false,
            type: "string"
        },
        shopify_order_id: {
            title: "Order Id",
            sortable: false,
            type: "string"
        },
        created_at: {
            title: "Created at",
            sortable: false,
            type: "string"
        },
        financial_status: {
            title: "Shopify Status",
            type: "string",
            sortable: false
        },
        processing_status: {
            title: "Amazon Status",
            sortable: false
        },
        button_order: {
            title: "Create Order",
            label: "Create", // button Label
            id: "button_order",
            sortable: false
        },
        button_order_view: {
            title: "View Order",
            label: "View", // button Label
            id: "button_order_view",
            sortable: false
        },
        button_order_edit: {
            title: "Edit order on app",
            label: "Edit", // button Label
            id: "button_order_edit",
            sortable: false
        },

    };
    gridSettings = {
        count: "10",
        activePage: 1
    };
    visibleColumns = [
        "shopify_order_name",
        "created_at",
        "financial_status",
        "processing_status",
        "button_order",
        "button_order_view",
        "button_order_edit",
        "shopify_order_id"
    ];
    pageLimits = [
        { label: 10, value: "10" },
        { label: 20, value: "20" },
        { label: 30, value: "30" },
        { label: 40, value: "40" },
        { label: 50, value: "50" },
        { label: 500, value: "500" },
        { label: 2000, value: "2000 *(Slow)" },
    ];

    predefineFilters = [
     { label: "Shopify Order", value: "shopify_order_name", type: "string", special_case: "no" },
     { label: "Order Id", value: "shopify_order_id", type: "string", special_case: "no" },
     /*{ label: "SKU", value: "sku", type: "string", special_case: "no" },
     { label: "Price", value: "price", type: "int", special_case: "no" },
     { label: "Quantity", value: "quantity", type: "int", special_case: "no" },
     { label:"Type", value:"type", type:"type", special_case:"yes"},*/
     /*{
     label: "Created at",
     value: "created_at",
     type: "string",
     special_case: "yes"
     },*/
     {
     label: "Order Status shopify",
     value: "financial_status",
     type: "financial_status",
     special_case: "yes"
     },
        {
            label: "Amazon order status",
            value: "processing_status",
            type: "processing_status",
            special_case: "yes"
        }
     ];
    constructor(props) {
        super(props);
        this.state = {
            pagination_show: 0,
            trail_days_left:0,
            show_trail_banner:false,
            show_trail_banner_webhook:false,
            selectedFetchOrders:'',
            shopifyOrderId:'',
            editModal:false,
            editModalOrderName:'',
            fetchOrderShopify:false,
            order: [],
            selectedProducts: [],
            single_column_filter: [],
            button_create_disable: false,
            create_button_loader: false,
            appliedFilters: {}

        }
        this.getOrders();
        this.checkingOrderManuallyCreate();
        this.installedAtFbaDate();
        this.deleteWebhookClient();
    }

    prepareFilterObject() {
        this.state.appliedFilters = {};
        if (this.filters.full_text_search !== "") {
            this.state.appliedFilters["search"] = this.filters.full_text_search;
        }
        this.filters.single_column_filter.forEach((e, i) => {
            switch (e.name) {
                case "shopify_order_name":
                case "shopify_order_id":
                case "created_at":
                    this.state.appliedFilters[
                    "filter[" + e.name + "][" + e.condition + "]"
                        ] = e.value;
                    break;
                case "financial_status":
                case "processing_status":
                    this.state.appliedFilters[
                    "filter[" + e.name + "][" + e.condition + "]"
                        ] = e.value;
                    break;
            }
        });
        for (let i = 0; i < Object.keys(this.filters.column_filters).length; i++) {
            const key = Object.keys(this.filters.column_filters)[i];
            if (this.filters.column_filters[key].value !== "") {
                switch (key) {
                    case "shopify_order_name":
                    case "shopify_order_id":
                    case "created_at":
                    case "financial_status":
                    case "processing_status":
                }
            }
        }
        this.updateState();
    }

    getOrders = () => {
        this.prepareFilterObject();
        const pageSettings = Object.assign({}, this.gridSettings);
        requests
            .getRequest("fba/test/cronHitting", Object.assign(pageSettings,this.state.appliedFilters),
                false,
                false)
            .then(data => {
                if (data.success) {
                    window.showGridLoader = false;
                    this.setState({
                        totalPage: data.data.count,
                        tempProductData: data.data.rows
                    });
                    if (!isUndefined(data.data.mainCount)) {
                        this.setState({totalMainCount: data.data.mainCount});
                    }
                    const order = this.modifyProductsData(data.data.rows, "");
                    this.state["order"] = order;
                    this.state.showLoaderBar = !data.success;
                    this.state.hideLoader = data.success;
                    this.state.pagination_show = paginationShow(
                        this.gridSettings.activePage,
                        this.gridSettings.count,
                        data.data.count,
                        true
                    );
                    this.updateState();
                } else {
                    this.setState({
                        showLoaderBar: false,
                        hideLoader: true,
                        pagination_show: paginationShow(0, 0, 0, false)
                    });
                    window.showGridLoader = false;
                    setTimeout(() => {
                        window.handleOutOfControlLoader = true;
                    }, 3000);
                    notify.error(data.message);
                    this.updateState();
                }
            });
    };

    createOrderOnFba(ordername) {
        requests.postRequest('fba/test/manuallyOrderCreateButtonHit', {data: ordername}, false, false).then(response1 => {
            if (response1.success) {
                notify.success(response1.message)
            }
            else {
                notify.error(response1.message)
            }
        });
    }


    modifyProductsData(data, product_grid_collapsible) {
        this.setState({
            pagination_show: data.length
        })
        let products = [];
        let str = "";
        for (let i = 0; i < data.length; i++) {
            let rowData = {};
            if (data[i] !== {} && !isUndefined(data[i])) {
                if (
                    data[i]["shopify_order_name"] !== ""
                ) {
                    str = data[i]["shopify_order_name"];
                    rowData["shopify_order_name"] = str;
                }
                if (
                    data[i]["shopify_order_id"] !== ""
                ) {
                    str = data[i]["shopify_order_id"];
                    rowData["shopify_order_id"] = str;
                }
                if (
                    data[i]["created_at"] !== ""
                ) {
                    str = data[i]["created_at"];
                    rowData["created_at"] = str;
                }
                if (data[i]["financial_status"] !== '') {
                    if (data[i]["financial_status"] === "paid") {
                        rowData["financial_status"] = (
                            <React.Fragment>
                                <Badge status="success">Paid</Badge>
                            </React.Fragment>
                        );
                    }
                    else if (data[i]["financial_status"] === "refunded") {
                        rowData["financial_status"] = (
                            <React.Fragment>
                                <Badge status="info">Refunded</Badge>
                            </React.Fragment>
                        );
                    }
                    else if (data[i]["financial_status"] === "partially_refunded") {
                        rowData["financial_status"] = (
                            <React.Fragment>
                                <Badge status="info">Refunded</Badge>
                            </React.Fragment>
                        );
                    }


                    else {
                        rowData["financial_status"] = (
                            <React.Fragment>
                                <Badge status="attention">Unpaid</Badge>
                            </React.Fragment>
                        );
                    }
                }
                if (data[i]["processing_status"] !== '') {
                    if (data[i]["processing_status"] === "Processing") {
                        rowData["processing_status"] = (
                            <React.Fragment>
                                <Badge status="success">Processing</Badge>
                            </React.Fragment>
                        );
                    }
                    else if (data[i]["processing_status"] === "Fulfilled") {
                        rowData["processing_status"] = (
                            <React.Fragment>
                                <Badge status="success">Complete</Badge>
                            </React.Fragment>
                        );
                    }
                    else if (data[i]['processing_status'] === "Pending") {
                        rowData["processing_status"] = (
                            <React.Fragment>
                                <Badge status="info">Pending</Badge>
                            </React.Fragment>
                        );
                    }
                    else if (data[i]['processing_status'] === "Denied") {
                        rowData["processing_status"] = (
                            <React.Fragment>
                                <Badge status="warning">Denied</Badge>
                            </React.Fragment>
                        );
                    }
                    else if (data[i]['processing_status'] === 'CANCELLED By Fba' || data[i]['processing_status'] === 'Cancelled'
                        || data[i]['processing_status'] === 'Canceled') {
                        rowData["processing_status"] = (
                            <React.Fragment>
                                <Badge status="warning">Cancelled</Badge>
                            </React.Fragment>
                        );
                    }
                    else if (data[i]['processing_status'] === 'COMPLETE_PARTIALLED') {
                        rowData["processing_status"] = (
                            <React.Fragment>
                                <Badge status="warning">Cancelled</Badge>
                            </React.Fragment>
                        );
                    }
                    else if (data[i]['processing_status'] === 'CANCELLED') {
                        rowData["processing_status"] = (
                            <React.Fragment>
                                <Badge status="warning">Cancelled</Badge>
                            </React.Fragment>
                        );
                    }
                    else if (data[i]['processing_status'] === 'not yet created') {
                        rowData["processing_status"] = (
                            <React.Fragment>
                                <Badge status="info">Not Yet Created</Badge>
                            </React.Fragment>
                        );
                    }
                    else {
                        rowData["processing_status"] = (
                            <React.Fragment>
                                <Badge status="warning">Pending</Badge>
                            </React.Fragment>
                        );
                    }

                }
                if (data[i]['processing_status'] === 'not yet created') {
                    str = <div className="text-center">
                        <Button
                            disabled={false}
                            primary
                            onClick={() => {
                                this.createOrderOnFba(data[i]['shopify_order_name']);
                            }}
                        >
                            Create
                        </Button>
                    </div>
                    rowData["button_order"] = str;
                }
                else {
                    str = <div className="text-center"
                               style={{cursor:'pointer'}}>
                        <Button
                            disabled={true}
                            primary
                            onClick={() => {
                                this.createOrderOnFba(data[i]['shopify_order_name']);
                            }}
                        >
                            Create
                        </Button>
                    </div>
                    rowData["button_order"] = str;
                }

                str =<div
                    style={{cursor:'pointer'}}
                    onClick={() => {
                    this.operations(data[i]['shopify_order_name']);
                }}>
                    <Icon
                        source={ViewMinor}
                        on
                    />
                </div>
                rowData["button_order_view"] = str;

                // str =<div
                //     style={{cursor:'pointer'}}
                //     onClick={() => {
                //         this.operationsEdit(data[i]['shopify_order_name']);
                //     }}>
                //     <Icon
                //         source={EditMinor}
                //         on
                //     />
                // </div>
                // rowData["button_order_edit"] = str;



            }

            products.push(rowData);
        }
        return products;
    }

 /*   operations(event, id) {
        switch (id) {
            case "button_order":
                break;
            default:
        }
    }*/

    operations = (order_id) => {
        // console.log("event",event);
        let shopify_order_name_trim =  order_id;
        let is_order_name = false;
        // console.log(shopify_order_name_trim[0]);
        if (shopify_order_name_trim[0] === '#'){
            is_order_name=true
            shopify_order_name_trim = shopify_order_name_trim.split('#').join("");
            // console.log(shopify_order_name_trim);
        }
        // console.log(id);

                let parent_props = {
                    is_hash_order_name:is_order_name
                };
                console.log(parent_props);
                // console.log("/panel/vieworderfba/" + shopify_order_name_trim);
                /*this.redirect("/panel/vieworderfba/1139" , {
                    parent_props: parent_props
                });*/
                this.redirect("/panel/vieworderfba/" + shopify_order_name_trim, {
                    parent_props: parent_props
                });

    };

    // operationsEdit = (order_id) => {
    //     this.setState({
    //         editModal:true,
    //         editModalOrderName:order_id,
    //     })
    //
    // };

    checkingOrderManuallyCreate() {
        requests
            .getRequest("fba/test/toBeCreateOrderManually")
            .then(data => {
                if (data.success) {
                    if (data.data[0]['value'] === "no") {
                        this.setState({
                            button_create_disable: true
                        })
                    }
                }
            });
    }

    installedAtFbaDate(){
        requests
            .getRequest("fba/test/getWebhookCall")
            .then(data => {
                if (data.success) {
                    this.setState({
                        trail_days_left:3-data.days
                    })
                    console.log(this.state.trail_days_left);
                    if (data.days<=3){
                        this.setState({
                            show_trail_banner:true
                        })
                    }
                }
            });
    }
    deleteWebhookClient() {
        if (this.state.trail_days_left < 0) {
            requests
                .getRequest("fba/test/getWebhookDetailsAndDelete")
                .then(data => {
                    console.log(data)
                    if (data.success) {
                        if (data.message == "webhook are deleted") {
                            this.setState({
                                show_trail_banner_webhook: true
                            })
                        }
                    }
                });
        }
    }
    redirect(url, data) {
        if (!isUndefined(data)) {
            this.props.history.push(url, JSON.parse(JSON.stringify(data)));
        } else {
            this.props.history.push(url);
        }
    }

    fetchOrderFromShopify(){
        requests
            .getRequest("fba/test/fetchOrderFromShopify")
            .then(data => {
                console.log(data)
            });
    }

    handleSelectChangeMarketplaceCsv(selectedMarketplace){

        this.setState({
            selectedFetchOrders:selectedMarketplace
        })
    }

    handleChangeSingleOrderId(orderId){
        this.setState({
            shopifyOrderId:orderId
        })
    }
    OnSubmitOrder(){
        if (this.state.selectedFetchOrders !== ''){
            if (this.state.selectedFetchOrders === 'singleOrders' && this.state.shopifyOrderId ===''){
                notify.error("Enter order Id")
            }else {
                let orderdata = {
                    orderAction: this.state.selectedFetchOrders,
                    order_id:this.state.shopifyOrderId
                };

                requests.postRequest('fba/test/fetchOrderFromShopify', orderdata, false, false).then(response1 => {
                    if (response1.success) {
                        notify.success(response1.message)
                    }
                    else {
                        notify.error(response1.message)
                    }
                });
            }
        }else {
            notify.error("Select Any Order Option")
        }
        this.setState({
            fetchOrderShopify: false,
            selectedFetchOrders:'',
            shopifyOrderId:''
        });

    }


    render() {

        const options = [
            {label: 'Pending', value: 'allOrders'},
            {label: 'Single Orders', value: 'singleOrders'},
           ];

        const optionsOrderStatus = [
            {label: 'Processing', value: 'Processing'},
            {label: 'Fulfilled', value: 'Complete'},
            {label: 'Pending', value: 'Pending'},
            {label: 'Denied', value: 'Denied'},
            {label: 'CANCELLED By Fba', value: 'Cancelled'},
            {label: 'Cancelled', value: 'Cancelled'},
            {label: 'Canceled', value: 'Cancelled'},
            {label: 'not yet created', value: 'Not Yet Created'},
        ];

        return (
            <Page
                primaryAction={{
                    content: "Sync Order Form Shopify",
                    onClick:() => {
                        this.setState({
                            fetchOrderShopify:true
                        });
                    }
                }}
                style={{ cursor: "pointer" }}

                title="FBA Orders">
                <Card>
                    <div className="p-5">
                        <div className="row">
                            {this.state.show_trail_banner ?<div className="col-4 offset-4 text-center">
                                <Banner status="warning">
                                    {this.state.trail_days_left != 0 ?
                                        <p><b>{this.state.trail_days_left} days trial left </b><Button
                                            plain
                                            onClick={() => {
                                                this.redirect("/panel/plans");
                                            }}
                                        >
                                            Buy Plan Now
                                        </Button></p> :
                                        <p><b>last day for trial </b><Button
                                            plain
                                            onClick={() => {
                                                this.redirect("/panel/plans");
                                            }}
                                        >
                                            Buy Plan Now
                                        </Button></p>}
                                        {/*<Button
                                        plain
                                        onClick={() => {
                                            this.redirect("/panel/plans");
                                        }}
                                        >
                                            Buy Plan Now
                                        </Button>*/}
                                </Banner>
                            </div>:null}
                            {this.state.show_trail_banner_webhook?<div className="col-4 offset-4 text-center">
                                <Banner status="warning">
                                    <div className="text-center">
                                        <Badge status="warning">Service Paused</Badge>
                                    </div>

                                    <p><b>Your trial period has been expired, kindly </b><Button
                                        plain
                                        onClick={() => {
                                            this.redirect("/panel/plans");
                                        }}
                                    >
                                        Buy Plan Now
                                    </Button></p>
                                </Banner>
                                </div>:null}
                            <div className="col-12 p-3 text-right">
                                {/*<Label>{this.state.totalMainCount && Object.keys(this.filters.column_filters).length <= 0?`Total Main Orders : ${this.state.totalMainCount}`:''}</Label>
                                <Label>{`Active Page : ${this.gridSettings.activePage}`}</Label>*/}
                                <Label>{this.state.pagination_show} Orders</Label>
                            </div>
                            <div className="col-12">
                                <SmartDataTable
                                    data={this.state.order}
                                    uniqueKey="shopify_order_name"
                                    showLoaderBar={this.state.showLoaderBar}
                                    count={this.gridSettings.count}
                                    activePage={this.gridSettings.activePage}
                                    hideFilters={this.hideFilters}
                                    columnTitles={this.columnTitles}
                                    customButton={this.customButton} // button
                                    //marketplace={this.filters.marketplace}
                                    // multiSelect={true}
                                    operations={this.operations} //button
                                    // selected={this.state.selectedProducts}
                                    className="ui compact selectable table"
                                    withLinks={true}
                                    visibleColumns={this.visibleColumns}
                                    actions={this.massActions}
                                    showColumnFilters={false}
                                    predefineFilters={this.predefineFilters}
                                    showButtonFilter={true}
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
                                            event.data.shopify_order_name
                                        );
                                        if (event.isSelected) {
                                            if (itemIndex === -1) {
                                                this.state.selectedProducts.push(
                                                    event.data.shopify_order_name
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
                                                    rows[i].shopify_order_name
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
                                        this.setState({selectedProducts: data});
                                    }}
                                    columnFilters={filters => {
                                        this.filters.column_filters = filters;
                                        this.getOrders();
                                    }}
                                    singleButtonColumnFilter={filter => {
                                        this.filters.single_column_filter = filter;
                                        this.getOrders();
                                    }}

                                    /*massAction={event => {
                                     switch (event) {
                                     case "upload":
                                     this.state.selectedProducts.length > 0
                                     ? this.handleSelectedUpload("profile")
                                     : notify.info("No Product Selected");
                                     break;
                                     default:
                                     console.log(event, this.state.selectedProducts);
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
                                     this.filters.single_column_filter = filter;
                                     this.getProducts();
                                     }}*/
                                    sortable
                                />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-6 text-right">
                                <Pagination
                                    hasPrevious={1 < this.gridSettings.activePage}
                                    onPrevious={() => {
                                        if (1 < this.gridSettings.activePage) {
                                            this.gridSettings.activePage--;
                                            this.getOrders();
                                        }
                                    }}
                                    hasNext={
                                        this.state.totalPage / this.gridSettings.count >
                                        this.gridSettings.activePage
                                    }
                                    nextKeys={[39]}
                                    previousKeys={[37]}
                                    previousTooltip="use Right Arrow"
                                    nextTooltip="use Left Arrow"
                                    onNext={() => {
                                        if (
                                            this.state.totalPage / this.gridSettings.count >
                                            this.gridSettings.activePage
                                        ) {
                                            this.gridSettings.activePage++;
                                            this.getOrders();
                                        }
                                    }}
                                />
                            </div>
                            <div className="col-md-2 col-sm-2 col-6">
                                <Select
                                    options={this.pageLimits}
                                    value={this.gridSettings.count}
                                    onChange={this.pageSettingsChange.bind(this)}
                                    label={""}
                                    labelHidden={true}
                                />
                            </div>
                        </div>

                    </div>
                    <Modal
                        title={"Fetch Order From Shopify"}
                        open={this.state.fetchOrderShopify}
                        onClose={() => {
                            this.setState({fetchOrderShopify: false});
                        }}
                    >
                        <Modal.Section>
                            <div className="row">

                                <div className="col-md-12 col-sm-12 col-12 p-3">
                                    <Select
                                        label="Order Sync Type"
                                        placeholder="select"
                                        options={options}
                                        onChange={this.handleSelectChangeMarketplaceCsv.bind(this)}
                                        value={this.state.selectedFetchOrders}
                                    />
                                </div>

                                {this.state.selectedFetchOrders == 'singleOrders'?<div className="col-md-12 col-sm-12 col-12 p-3">
                                    <TextField
                                        label="Order Id"
                                        helpText="Enter Shopify Order Id (For Multiple Order Id use ',' between Order Id (3084497649832,3083335270568,3082898309288,..))"
                                        value={this.state.shopifyOrderId}
                                        onChange={this.handleChangeSingleOrderId.bind(this)} />
                                </div>:null}

                                <div className="col-md-4 col-sm-4 col-12"></div>

                                <div className="col-md-4 col-sm-4 col-12 p-3">
                                    <Button
                                        primary
                                        onClick={() => {
                                        this.OnSubmitOrder();}}
                                    >
                                        Submit
                                    </Button>
                                </div>


                                {/*<div className="col-md-6 col-sm-6 col-12 p-3">*/}
                                    {/*<Card>*/}
                                        {/*<div*/}
                                            {/*onClick={() => {*/}
                                                {/*this.fetchOrderFromShopify();*/}
                                            {/*}}*/}
                                            {/*style={{cursor: "pointer"}}*/}
                                        {/*>*/}
                                            {/*<div className="text-center pt-5 pb-5">*/}
                                                {/*<FontAwesomeIcon*/}
                                                    {/*icon={faArrowAltCircleDown}*/}
                                                    {/*color="#3f4eae"*/}
                                                    {/*size="10x"*/}
                                                {/*/>*/}
                                            {/*</div>*/}
                                            {/*<div className="text-center pt-2 pb-4">*/}

                                                {/*<span className="h2" style={{color: "#3f4eae"}}>*/}
										{/*Import Orders*/}
									{/*</span>*/}
                                                {/*<Label>(Import Shopify Unfulfilled Orders)</Label>*/}
                                            {/*</div>*/}
                                        {/*</div>*/}
                                    {/*</Card>*/}
                                {/*</div>*/}
                                {/*<div className="col-md-6 col-sm-6 col-12 p-3">*/}
                                    {/*<Card>*/}
                                        {/*<div*/}
                                            {/*onClick={this.fetchOrderFromShopify.bind(this)}*/}
                                            {/*style={{cursor: "pointer"}}*/}
                                        {/*>*/}
                                            {/*<div className="text-center pt-5 pb-5">*/}
                                                {/*<FontAwesomeIcon*/}
                                                    {/*icon={faArrowAltCircleUp}*/}
                                                    {/*color="#3f4eae"*/}
                                                    {/*size="10x"*/}
                                                {/*/>*/}
                                            {/*</div>*/}
                                            {/*<div className="text-center pt-2 pb-4">*/}
									{/*<span className="h2" style={{color: "#3f4eae"}}>*/}
										{/*Upload Csv File*/}
									{/*</span>*/}
                                                {/*<Label>(Import updated CSV on app)</Label>*/}
                                            {/*</div>*/}
                                        {/*</div>*/}
                                    {/*</Card>*/}
                                {/*</div>*/}
                            </div>
                        </Modal.Section>
                    </Modal>
                </Card>
            </Page>
        )
    }

    pageSettingsChange(event) {
        this.gridSettings.count = event;
        this.gridSettings.activePage = 1;
        this.getOrders();
    }

    updateState() {
        const state = this.state;
        this.setState(state);
    }
}
export default FbaOrder;