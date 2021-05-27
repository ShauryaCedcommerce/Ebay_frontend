import React, { Component } from "react";
import { isUndefined } from "util";
import { NoteMinor } from "@shopify/polaris-icons";

import {
  Stack,
  Caption,
  Page,
  Card,
  TextField,
  DisplayText,
  Pagination,
  Label,
  ResourceList,
  Tabs,
  Banner,
  Badge,
  DataTable,
  Button,
  Icon,
  DropZone,
  Thumbnail,
} from "@shopify/polaris";
import {
  faArrowAltCircleDown,
  faArrowAltCircleUp,
} from "@fortawesome/free-solid-svg-icons";

import { requests } from "../../../services/request";
import { notify } from "../../../services/notify";

const imageExists = require("image-exists");

export class Editsection extends Component {
  // validImageTypes = ["image/gif", "image/jpeg", "image/png", "image/jpg"];
  constructor(props) {
    super(props);
    this.state = {
      Titlemodal: "",
      long_descriptionmodal: "",
      vendormodal: "",
      product_typemodal: "",
      source_product_idmodal: "",
      img: [],
      files: [],
      imagePosition: 0,
      rows: [],
      type:"",
      variants: [],
      created_at:"",
      variant_attribute:[],
      product_additionalimage_url:"",
      source_marketplacename: "",
      account_name:"",
      updated_at:"",
      currentTransaction:"",
    };
    this.handleDataCheck();
    this.handlelongdescription = this.handlelongdescription.bind(this);
    this.handleallchangedata = this.handleallchangedata.bind(this);
    this.handlecancelback = this.handlecancelback.bind(this);

  }
  handleChangetitle = (e) => {
    this.setState({ Titlemodal: e });
  };
  handleChangetype = (e) => {
    this.setState({ product_typemodal: e });
  };
  handlelongdescription = (e) => {
    this.setState({ long_descriptionmodal: e.target.value });
  };
  handleChangevendor = (e) => {
    this.setState({ vendormodal: e });
  };
  handlecancelback() {
    this.redirect("/panel/products");
  }


  handleallchangedata() {
  // console.log(this.state.created_at);
let newstr= this.state.product_additionalimage_url.split(",");
let details={};
let data={};
if(newstr!= "" && newstr !== null){
  details={
  title: this.state.Titlemodal,
  long_description: this.state.long_descriptionmodal,
  vendor: this.state.vendormodal,
  source_product_id: this.state.source_product_idmodal,
  product_type: this.state.product_typemodal,
  additional_image: newstr,
  type:this.state.type,
 }
}
 else
 {
  details={
    source_product_id: this.state.source_product_idmodal,
    title: this.state.Titlemodal,
    long_description: this.state.long_descriptionmodal,
    vendor: this.state.vendormodal,
    product_type: this.state.product_typemodal,
    type:this.state.type,
   }

 }
 if(this.state.account_name !=""){
     data = {
    details:details,
    merchant_id: this.props.history.location.state.parent_props.merchant_id,
    variant_attribute: this.state.variant_attribute,
    variants: this.state.variants,
    source_marketplace: this.state.source_marketplacename,
    account_name:this.state.account_name,
    };
  }
  else
  {
    if(this.state.created_at==""){
      data = {
        details:details, 
        merchant_id: this.props.history.location.state.parent_props.merchant_id,
        variant_attribute: this.state.variant_attribute,
        variants: this.state.variants,
        source_marketplace: this.state.source_marketplacename,
        };
    }
    else{

    data = {
      details:details,
      created_at:this.state.created_at,
      currentTransaction:this.state.currentTransaction,
      merchant_id: this.props.history.location.state.parent_props.merchant_id,
      variant_attribute: this.state.variant_attribute,
      variants: this.state.variants,
      source_marketplace: this.state.source_marketplacename,
      updated_at:this.state.updated_at,
      };
    }
  }
   let maindata={
     data:data
   }
   console.log(maindata);
    requests
      .postRequest("frontend/test/updateVariantsOfScrapping", maindata,false,false)
      .then((response1) => {
        console.log(response1);
        if (response1.success) {
          notify.success("update product");
          setTimeout(function() {
            this.redirect("/panel/products");
          }, 400);
        }
        else{
            notify.error("Something went wrong"); 
        }
      });
  }
  handleImageChange = (index) => {
    // console.log(index);
    this.setState({ imagePosition: index });
  };
  pressLeftShift() {
    if (this.state.imagePosition != 0) {
      this.setState({
        imagePosition: this.state.imagePosition - 1,
      });
    }
  }
  pressRightShift = (count) => {
    if (this.state.imagePosition < count - 1) {
      this.setState({
        imagePosition: this.state.imagePosition + 1,
      });
    }
  };
  handleTableChangevariants = (variant) => {
    let rows = [];
    Object.keys(variant).forEach((e) => {
      let statechecksku = variant[e]["sku"] + variant[e]["source_variant_id"];
      rows.push([
        <span style={{ cursor: "pointer" }}>
          <Thumbnail source={variant[e]["main_image"]} alt={""} />
        </span>,
        <TextField
          type={"text"}
          value={this.state.variants[e]["sku"]}
          onChange={this.handlechangevalvetextfield.bind(this, "sku", e)}
        />,
        <TextField
          type={"number"}
          value={this.state.variants[e]["price"]}
          onChange={this.handlechangevalvetextfield.bind(this, "price", e)}
        />,
        <TextField
          type={"number"}
          value={this.state.variants[e]["quantity"]}
          onChange={this.handlechangevalvetextfield.bind(this, "quantity", e)}
        />,
      ]);
    });
    return rows;
  };
  handlechangevalvetextfield = (field, index, value) => {
    let variants = this.state.variants;
    variants[index][field] = value;
    //  console.log(variants);
    let rows = this.handleTableChangevariants(variants);
    this.setState({ variants: variants, rows: rows });
  };
  handlechangeadditionalimage_url=(e)=>{
    this.setState({product_additionalimage_url:e});
  }
 

  handleDataCheck() {
    requests
      .postRequest("connector/product/getProductById", {
        source_product_id: this.props.history.location.state.parent_props
          .source_product_id,
      })
      .then((data) => {
        console.log(data);
        if(!isUndefined(data.data["currentTransaction"])){
          this.setState({currentTransaction:data.data["currentTransaction"]});
        }
        if(!isUndefined(data.data["created_at"])){
          this.setState({created_at:data.data["created_at"]});
        }
        if(!isUndefined(data.data["updated_at"])){
          this.setState({updated_at:data.data["updated_at"]});
        }
        if(!isUndefined(data.data["source_marketplace"]) && data.data["source_marketplace"]!=="")
        {
          if(data.data["source_marketplace"]="amazonimporter"){
            if(!isUndefined(data.data["account_name"])){
             this.setState({account_name:data.data["account_name"]});
            }
          }
        }
        if(!isUndefined(data.data["details"]["type"]))
        {
          this.setState({type:data.data["details"]["type"]});
        }
        if(!isUndefined(data.data['variant_attribute']) ){
 this.setState({variant_attribute:data.data["variant_attribute"]});
        }
        if (
          !isUndefined(data.data["source_marketplace"]) &&
          data.data["source_marketplace"] !== null
        ) {
          this.setState({
            source_marketplacename: data.data["source_marketplace"],
          });
        }
        let temp = this.state;

        if (
          !isUndefined(data.data["variants"]) &&
          typeof data.data["variants"] === "object"
        ) {
          let variant = data.data["variants"];
          temp.variants = [];
          Object.keys(variant).forEach((e) => {
            if (!isUndefined(variant[e])) {
              temp.variants.push(variant[e]);
            }
          });
          temp.rows = this.handleTableChangevariants(temp.variants);
        }
        temp.img = [];
        if (
          !isUndefined(data.data.details["additional_image"]) &&
          data.data.details["additional_image"] !== null
        ) {
          Object.keys(data.data.details["additional_image"]).forEach((e) => {
            if (!isUndefined(data.data.details["additional_image"])) {
              temp.img.push(data.data.details["additional_image"]);
            }
          });
        } else if (
          !isUndefined(data.data.details["additional_images"]) &&
          data.data.details["additional_images"] !== null
        ) {
          Object.keys(data.data.details["additional_images"]).forEach((e) => {
            if (!isUndefined(data.data.details["additional_images"])) {
              temp.img.push(data.data.details["additional_images"]);
            }
          });
        }
        this.setState(temp);
        if (
          !isUndefined(data.data.details.title) &&
          data.data.details.title !== null
        ) {
          this.setState({ Titlemodal: data.data.details.title });
        }
        if (
          !isUndefined(data.data.details.long_description) &&
          data.data.details.long_description !== null
        ) {
          this.setState({
            long_descriptionmodal: data.data.details.long_description,
          });
        }
        if (
          !isUndefined(data.data.details.vendor) &&
          data.data.details.vendor !== null
        ) {
          this.setState({ vendormodal: data.data.details.vendor });
        }
        if (
          !isUndefined(data.data.details.product_type) &&
          data.data.details.product_type !== null
        ) {
          this.setState({ product_typemodal: data.data.details.product_type });
        }
        if (
          !isUndefined(data.data.details.source_product_id) &&
          data.data.details.source_product_id !== null
        ) {
          this.setState({
            source_product_idmodal: data.data.details.source_product_id,
          });
        }
      });
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <Page
            FullWidth
            primaryAction={{
              content: "Back",
              onClick: () => {
                this.redirect("/panel/products");
              },
            }}
            style={{ cursor: "pointer" }}
            title="Edit Product"
          >
            <Card>
              <div className="p-5">
              <div className="displaytextcls">
                <DisplayText size="large">
                  Title
                </DisplayText></div>
                <TextField
                  type="text"
                  value={this.state.Titlemodal}
                  onChange={this.handleChangetitle.bind(this)}
                  className="producttitle"
                />
                {this.state.long_descriptionmodal === "" ? null : (
                  <div className="react_quill_app_class">
                    <div id="textareaidineditsection">
                    <div className="displaytextcls">
                      <DisplayText size="large" >
                        Description
                      </DisplayText>
</div>
                      <textarea
                        id="texttareaiddescription"
                        className="descriptiontextarea"
                        value={this.state.long_descriptionmodal}
                        onChange={this.handlelongdescription}
                      />
                    </div>
                  </div>
                )}

                <div>
                {this.state.img.length > 1 && (
              <div className="col-12 mb-5">
                <span>
                  <div className="row p-5 d-flex justify-content-center">
                    <div
                      className="col-1 mt-5 pt-5 justify-content-center"       
                    >
                      <span onClick={this.pressLeftShift.bind(this)} style={{ cursor: "pointer" }}>
                        <img
                          style={{ height: "35px", width: "35px" }}
                          src={require("../../../assets/img/leftShift.png")}
                        />
                      </span>
                    </div>
                    <div className="col-8 col-sm-4">
                      <div className="pb-5">
                        <Thumbnail
                          // source={this.state.img[this.state.imagePosition]}
                          source={this.state.img[0][this.state.imagePosition]}
                          alt={""}
                          size={"extralarge"}
                        />
                        <div className="text-center">
                          <p style={{ color: "#585858" }}>
                            ({this.state.img.length} images)
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-1 mt-5 pt-5 justify-content-center"
                      
                      >
                      <span onClick={this.pressRightShift.bind(
                        this,
                        this.state.img.length
                      )} style={{ cursor: "pointer" }} >
                        <img
                          style={{ height: "35px", width: "35px" }}
                          src={require("../../../assets/img/rigthShift.png")}
                        />
                      </span>
                    </div>

                    <div className={"col-12"}>
                      <div className="row d-flex justify-content-center">
                        {this.state.img.map((e, i) => {
                          // console.log(this.state.img);
                          if (
                            this.state.imagePosition < i + 5 &&
                            this.state.imagePosition > i - 5
                          ) {
                            // console.log(e)
                            // console.log(i)
                            {/* console.log(this.state.img[0][0]); */}
                            return (
                              <div
                                key={i}
                                style={{ cursor: "pointer" }}
                                className="col-3 col-sm-1 mb-1"
                                onClick={this.handleImageChange.bind(this, i)}
                              >
                                <span>
                                  <Thumbnail
                                    source={this.state.img[0][i]}
                                    alt={""}
                                  />
                                </span>
                                {this.state.imagePosition === i ? (
                                  <div className="mt-1 bg-info p-1" />
                                ) : (
                                  <div
                                    style={{ color: "#585858" }}
                                    className="text-center"
                                  >
                                    {i + 1}
                                  </div>
                                )}
                              </div>
                            );
                          }
                        })}
                      </div>
                    </div>
                  </div>
                </span>
              </div>
            )}
            {this.state.img.length == 1 && (
              <div className="col-12 mb-5">
                <span>
                  <div className="row p-5 d-flex justify-content-center">
                    <div className="col-12 col-sm-5">
                      <div className="pb-5 pr-5">
                        <Thumbnail
                          source={this.state.img[this.state.imagePosition]}
                          alt={""}
                          size={"extralarge"}
                        />
                        <div className="text-center">
                          <p style={{ color: "#585858" }}>
                            ({this.state.img.length} image)
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className={"col-12"}>
                      <div className="row d-flex justify-content-center">
                        {this.state.img.map((e, i) => {
                          if (
                            this.state.imagePosition < i + 5 &&
                            this.state.imagePosition > i - 5
                          ) {
                            return (
                              <div
                                key={i}
                                style={{ cursor: "pointer" }}
                                className="col-3 col-sm-1 mb-1"
                                onClick={this.handleImageChange.bind(this, i)}
                              >
                                <span>
                                  <Thumbnail source={e} alt={""} />
                                </span>
                                {this.state.imagePosition === i ? (
                                  <div className="mt-1 bg-info p-1" />
                                ) : (
                                  <div
                                    style={{ color: "#585858" }}
                                    className="text-center"
                                  >
                                    {i + 1}
                                  </div>
                                )}
                              </div>
                            );
                          }
                        })}
                      </div>
                    </div>
                  </div>
                </span>
              </div>
            )}
                </div>
            <div>
            <div className="displaytextcls"> <DisplayText size="Large">Additional Image URL</DisplayText>
            </div>
            <TextField 
                type="text"
               value={this.state.product_additionalimage_url} 
                onChange={this.handlechangeadditionalimage_url.bind(this)}
                helpText={
            <span>
              You can add one or more than one  additional Image but sperated by Comma(","). 
            </span>
          }
          // autoComplete={true}
               />
            </div>
                <div className="checkflexclsinputfield">
                  <div className="allproductlabelcsstitle">
                  <div className="displaytextcls">
                    <DisplayText size="large">
                      Product Type
                    </DisplayText></div>
                    <TextField
                      type="text"
                      value={this.state.product_typemodal}
                      // onChange={this.handleChangevendor}
                      onChange={this.handleChangetype.bind(this)}
                      className="producttitle"
                    />
                  </div>
                  <div className="allproductlabelcsstype">
                  <div className="displaytextcls">
                    <DisplayText size="large">
                      Vendor
                    </DisplayText></div>
                    <TextField
                      type="text"
                      value={this.state.vendormodal}
                      onChange={this.handleChangevendor.bind(this)}
                      className="producttitle"
                    />
                  </div>
                </div>
                <div className="col-14 mb-5">
                  <Card>
                    <div className="pb-5">
                      <DataTable
                        columnContentTypes={["text", "text", "text", "text"]}
                        headings={["Image", "SKU", "Price", "Quantity"]}
                        rows={this.state.rows}
                        truncate={true}
                      />
                    </div>
                  </Card>
                </div>

                <div className="productupdatebtncls">
                  <Button onClick={this.handlecancelback}>Cancel</Button>
                  <div className="marginpaddingcancelbtn">
                    <Button onClick={this.handleallchangedata} primary>
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </Page>
        </div>
      </React.Fragment>
    );
  }

  redirect = (url) => {
    if (
      !isUndefined(this.props.location.state) &&
      Object.keys(this.props.location.state).length > 0
    ) {
      this.props.history.push(
        url,
        JSON.parse(JSON.stringify(this.props.location.state))
      );
    } else {
      this.props.history.push(url);
    }
  };
}
