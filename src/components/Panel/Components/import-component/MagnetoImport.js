/**
 * Created by cedcoss on 16/5/19.
 */
import React, { Component } from "react";
import {
    Card, Label,Modal,Select,Button,ChoiceList} from "@shopify/polaris";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowAltCircleDown,
    faArrowAltCircleUp
} from "@fortawesome/free-solid-svg-icons";
import {requests} from "../../../../services/request";
export class MagnetoImport extends Component {
    constructor() {
        super();
        this.state = {
            importServicesList: ["Import", "Upload"],
            importProductsDetails: {
                source: "",
                shop: "",
                shop_id: ""
            },
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
            checkbox_data: {
                response_data: {},

            },
            upload_checkbox_data:{
                upload_response_data : [],
            },
            selected: [],
            order_select:[],
            action:'',
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-6 col-sm-6 col-12 p-3">
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
										Customer Action
									</span>
                                <Label>(Import Customer)</Label>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="col-md-6 col-sm-6 col-12 p-3">
                    <Card>
                        <div
                            onClick={() => {
                                this.state.uploadProductDetails.source = "";
                                this.state.uploadProductDetails.target = "";
                                this.state.uploadProductDetails.selected_profile = "";
                                this.state.uploadProductDetails.profile_type = "";
                                this.state.showUploadProducts = true;
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
										Order Action
									</span>
                                <Label>(Import Order)</Label>
                            </div>
                        </div>
                    </Card>
                </div>
                {this.renderCustomerActionModal()}
                {this.renderOrderActionModal()}
                <input
                    type="hidden"
                    id="openHelpModal"
                    className="btn btn-primary"
                    data-toggle="modal"
                    data-target="#exampleModalCenter"
                />
            </div>

        );

    }

    renderCustomerActionModal() {
        return (
            <div>
                <Modal
                    open={this.state.showImportProducts}
                    onClose={() => {
                        this.state.showImportProducts = false;
                        this.updateState();
                    }}
                    title="Customer Action"
                >
                    <Modal.Section>
                        <div className="row">
                            <div className="col-12 pt-1 pb-1">
                                <Select
                                    label="Action"
                                    placeholder="--Customer Action--"
                                    options={this.state.importServicesList}
                                    onChange={this.handleImportChange.bind(this, "source")}
                                    value={this.state.importProductsDetails.source}
                                />
                            </div>


                            {this.state.action === 'import' ? this.final_renderCheckbox() : null}

                            <div className="col-12 pt-1 pb-1 text-center">
                                <Button
                                    disabled={this.state.importProductsDetails.source === ""}
                                    onClick={() => {
                                        this.importProducts();
                                        this.state.showImportProducts = false;
                                        this.updateState();
                                    }}
                                    primary
                                >
                                    {this.state.action==='import'?"Import Customer":"UploadCustomer"}
                                </Button>
                            </div>

                        </div>
                    </Modal.Section>
                </Modal>
            </div>
        );
    }
    renderOrderActionModal(){
        return (
            <div>
                <Modal
                    open={this.state.showUploadProducts}
                    onClose={() => {
                        this.state.showUploadProducts = false;
                        this.updateState();
                    }}
                    title="Order Action"
                >
                    <Modal.Section>
                        <div className="row">
                            <div className="col-12 pt-1 pb-1">
                                <Select
                                    label="Action"
                                    placeholder="--Order Action--"
                                    options={this.state.importServicesList}
                                    onChange={this.handleUploadChange.bind(this, "source")}
                                    value={this.state.uploadProductDetails.source}
                                />
                            </div>

                            {this.state.action === 'import' ?this.uploadFinal_renderCheckbox():null};
                            <div className="col-12 pt-1 pb-1 text-center">
                                <Button
                                    disabled={this.state.uploadProductDetails.source === ""}
                                    onClick={() => {
                                        this.importOrder();
                                        this.state.showImportProducts = false;
                                        this.updateState();
                                    }}
                                    primary
                                >
                                    {this.state.action==='import'?"Import Order":"Upload Order"}
                                </Button>
                            </div>

                        </div>
                    </Modal.Section>
                </Modal>
            </div>
        );
    }

    handleImportChange(key, value) {
        this.state.importProductsDetails[key] = value;
        {
            this.handleMarketplaceAdditionalInput(
                this.state.importProductsDetails.source.toLowerCase()
            )
        }
    }
    handleUploadChange(key, value) {
        this.state.uploadProductDetails[key] = value;
        {
            this.UploadDataSelect(
                this.state.uploadProductDetails.source.toLowerCase()
            )
        }
    }
    updateState() {
        const state = this.state;
        this.setState(state);
    }

    handleMarketplaceAdditionalInput = importServicesList => {
        console.log(importServicesList);
        this.setState({action:importServicesList});
        if (importServicesList == 'import'){
            this.renderImportCheckBox();
        }
    }
    UploadDataSelect = importServicesList => {
        this.setState({action:importServicesList});
        if (importServicesList == 'import'){
            this.renderUploadCheckBox();
        }
    }

    renderImportCheckBox() {
        let temparr = [];
        let { checkbox_data } = this.state;
        if ( Object.keys(checkbox_data.response_data).length <= 0 )
        requests.getRequest("magento/get/getWebsite", {code: "customer"})
            .then(response => {
                if (response.success) {
                    checkbox_data.response_data= response['data']['websites'];
                    this.setState({checkbox_data:checkbox_data});

                }
                else {
                    console.log("error hai bhai koi");
                }
            });
    }
    renderUploadCheckBox() {
        let temparr = [];
        let {upload_checkbox_data } = this.state;
        if ( Object.keys(upload_checkbox_data.upload_response_data).length <= 0 )
        requests.getRequest("magento/get/getStore", {code: "order"})
                .then(response => {
                    console.log(response);
                    if (response.success) {
                        upload_checkbox_data.upload_response_data= response['data']['store'];
                        this.setState({upload_checkbox_data:upload_checkbox_data});

                    }
                    else {
                        console.log("error hai bhai koi");
                    }
                });
    }
    final_renderCheckbox() {
        let temparr=[]
        const {selected} = this.state;
        for (let i = 0; i < Object.keys(this.state.checkbox_data.response_data).length; i++) {
            temparr.push(
                <div className="col-6 col-sm-4">
                <ChoiceList
                    allowMultiple
                    choices={[
                        {
                            label: this.state.checkbox_data.response_data[i]['name'],
                            value: this.state.checkbox_data.response_data[i]['id'],
                        },
                    ]}
                    selected={selected}
                    onChange={this.handleChange}
                />
                </div>
            );
        }
        return temparr;
    }
    uploadFinal_renderCheckbox() {
        let temparr=[]
        const {order_select} = this.state;
        for (let i = 0; i < Object.keys(this.state.upload_checkbox_data.upload_response_data).length; i++) {
            temparr.push(
                <div className="col-6 col-sm-4">
                    <ChoiceList
                        allowMultiple
                        choices={[
                            {
                                label: this.state.upload_checkbox_data.upload_response_data[i]['name'],
                                value: this.state.upload_checkbox_data.upload_response_data[i]['id'],
                            },
                        ]}
                        selected={order_select}
                        onChange={this.handleChangeOrder}
                    />
                </div>
            );
        }
        return temparr;
    }
    handleChange = (value) => {
        this.setState({selected: value});
    };
    handleChangeOrder = (value) => {
        this.setState({order_select: value});
    };
    importProducts(){
        let send_data = this.state.selected;
        let data=""
        data = {
            websites:send_data,
            action:this.state.action,
        }

        requests.postRequest('magento/get/initiateCustomer',data,false,true)
            .then(response =>{
                console.log(response);
            })
    }
    importOrder(){
        let send_data = this.state.order_select;
        let data=""
        data = {
            websites:send_data,
            action:this.state.action,
        }
        requests.postRequest('magento/get/initiateOrder',data,false,true)
            .then(response =>{
                console.log(response);
            })
    }
}