/**
 * Created by cedcoss on 11/9/19.
 */
/**
 * Created by cedcoss on 14/7/19.
 */
import React, {Component} from 'react';
import {
    Page,
    Card,
    FormLayout,
    Layout,
    Stack,
    Heading,
    Badge,
    Button
} from "@shopify/polaris";
import {isUndefined} from 'util';
import {requests} from "../../../services/request";
import {capitalizeWord} from "./static-functions";
import {notify} from "../../../services/notify";
// import {Skeleton} from "../../../../shared/skeleton";

class Order extends Component {

    constructor(props) {
        super(props);
        // console.log(props.match.params.id)
        this.state = {
            id: props.match.params.id,
            is_order_trim: props.location.state.parent_props.is_hash_order_name,
            actual_data: {},
            entire_data: {},
            totalPage: 0,
            order_timeline_skeleton: false,
            reason_for_cancellation: false,
            tracking_id: false,
            tracking_name: false,
            fulfil: [],
            order: {
                source_order_id: '',
                placed_at: '',
                status: '',
                number_of_line_item: 0,
                order_name: '',
                financial_status: '',
                tracking_id: '',
                tracking_name: '',
                badge_status: '',
                badge_progress: '',
                error_message: "",
            },
            client_details: {
                customer_name: '',
                contact_email: '',
                contact_number: '',
            },
            line_items: {
                product_title: '',
                product_price: '',
                product_quantity: '',
                product_sku: '',
            },
            shipping_address: {
                shipping_city: '',
                shipping_zip: '',
                shipping_address: '',
                shipping_country: '',
            },
            item: [],
        };
        this.getOrder();
    }

    productListing() {
        // console.log(this.state.item);
        var newArray = [];
        // console.log(this.state.item.length);
        for (let i = 0; i < this.state.item.length; i++) {
            this.state.line_items.product_title = this.state.item[i][0];
            this.state.line_items.product_quantity = this.state.item[i][1];
            this.state.line_items.product_sku = this.state.item[i][2];
            let product_list = <FormLayout>
                <Stack distribution={"equalSpacing"}>
                    <b><Heading element={"p"}>Product Title</Heading></b>
                    <p style={{fontSize: '1.5rem'}}>{this.state.line_items.product_title}</p>
                </Stack>
                <Stack distribution={"equalSpacing"}>
                    <b><Heading element={"p"}>SKU</Heading></b>
                    <p style={{fontSize: '1.5rem'}}>{this.state.line_items.product_sku}</p>
                </Stack>
                <Stack distribution={"equalSpacing"}>
                    <b><Heading element={"p"}>Quantity</Heading></b>
                    <p style={{fontSize: '1.5rem'}}>{this.state.line_items.product_quantity}</p>
                </Stack>
                <Stack distribution={"equalSpacing"}>
                    <b><Heading element={"p"}>Financial Status</Heading></b>
                    {this.state.order.financial_status === "paid" ?
                        <Badge progress="complete" status="success">{this.state.order.financial_status}</Badge> :
                        <Badge progress="incomplete" status="attention">{this.state.order.financial_status}</Badge>}
                </Stack>
                <hr/>
            </FormLayout>;
            newArray.push(product_list);
        }

        return newArray;
    }

    getOrder() {
        let str1 = "#";
        if (this.state.is_order_trim) {
            this.state.id = str1.concat(this.state.id)
        }
        // console.log(this.state.id)
        requests
            .postRequest("fba/test/webhookCall", {
                shopify_order_name: this.state.id
            }).then(data => {

            if (data.success) {
                console.log(data);
                if (data.data[0]['error_message'] && data.data[0]['error_message'] != '') {
                    this.state.reason_for_cancellation = true;
                    // console.log(data.data[0]['error_message'])
                    this.state.order.error_message = capitalizeWord(data.data[0]['error_message']);
                }
                this.state.order_timeline_skeleton = true;
                this.state.order.placed_at = data.data[0]['created_at']
                this.state.order.source_order_id = data.data[0]['shopify_order_id']
                this.state.order.status = data.data[0]['processing_status']
                this.state.order.order_name = data.data[0]['shopify_order_name']
                this.state.order.financial_status = data.data[0]['financial_status']
                if (data.data[0]['Tracking_ID']) {
                    this.state.order.tracking_id = data.data[0]['Tracking_ID']
                    this.state.tracking_id = true
                }
                if (data.data[0]['CarrierCode']) {
                    this.state.order.tracking_name = data.data[0]['CarrierCode']
                    this.state.tracking_name = true
                }
                // console.log(data.data[0]['Tracking_ID'])
                if (this.state.order.status === 'Fulfilled') {
                    this.state.order.badge_status = 'success'
                    this.state.order.badge_progress = 'complete'
                }
                else if (this.state.order.status === 'Processing') {
                    this.state.order.badge_status = 'info'
                    this.state.order.badge_progress = 'partiallyComplete'
                }
                else if (this.state.order.status === 'Pending') {
                    this.state.order.badge_status = 'attention'
                    this.state.order.badge_progress = 'incomplete'
                }
                else {
                    this.state.order.badge_status = 'warning'
                }
                //---------------SHIPPING ADDRESS------------------------------

                if (data.data[0]['shipping_address']) {
                    this.state.client_details.customer_name = data.data[0]['shipping_address']['first_name'] + "  " + data.data[0]['shipping_address']['last_name']
                    this.state.client_details.contact_number = data.data[0]['shipping_address']['phone']
                    this.state.shipping_address.shipping_city = data.data[0]['shipping_address']['city'];
                    this.state.shipping_address.shipping_address = data.data[0]['shipping_address']['address1'] + " " + data.data[0]['shipping_address']['address2'];
                    this.state.shipping_address.shipping_zip = data.data[0]['shipping_address']['zip'];
                    this.state.shipping_address.shipping_country = data.data[0]['shipping_address']['country'];
                }
                //-----------------ORDER LISTING ITEMS--------------------------------------

                if (data.data[0]['order_listing_item']) {
                    var new_data = [];
                    this.state.order.number_of_line_item = Object.keys(data.data[0]['order_listing_item']).length
                    for (let i = 0; i < this.state.order.number_of_line_item; i++) {
                        var line_item_data = [
                            this.state.line_items.product_title = data.data[0]['order_listing_item'][i]['product_name'],
                            this.state.line_items.product_quantity = data.data[0]['order_listing_item'][i]['quantity'],
                            this.state.line_items.product_sku = data.data[0]['order_listing_item'][i]['sku']
                        ];
                        new_data.push(line_item_data);
                    }
                    this.state.item = new_data;
                    // console.log(this.state.item);
                }
                this.updateState()
            } else {
                // this.showToast(data.message,false,600);
            }
        });
    }

    updateState() {
        const state = this.state;
        this.setState(state);
    }

    deleteOrderFromApp(orderId){
        let orderdata = {
            orderAction: 'deleteOrder',
            order_id:orderId
        };

        requests.postRequest('fba/test/fetchOrderFromShopify', orderdata, false, false).then(response1 => {
            if (response1.success) {
                notify.success(response1.message)
                this.redirect("/panel/fbaOrders");
            }
            else {
                notify.error(response1.message)
            }
        });
    }

    render() {
        this.state.order_timeline_skeleton = true;
        this.state.order_timeline_skeleton = true
        return (
            <Page fullWidth={true}
                  title={'View Order'}
                  primaryAction={{
                      content: "Back",
                      onClick: () => {
                          this.redirect("/panel/fbaOrders");
                      }
                  }}
                  titleMetadata={this.state.entire_data.status}
            >
                {/*<b><h1>{this.state.order.order_name}</h1></b>*/}
                <b><p style={{fontSize: '2.5rem', color: 'blue'}}>{this.state.order.order_name}</p></b>

                    <div className=" pt-3">
                        <Badge progress={this.state.order.badge_progress}
                               status={this.state.order.badge_status}>{this.state.order.status}</Badge>
                        {this.state.order.financial_status === "paid" ?
                            <Badge progress="complete" status="success">{this.state.order.financial_status}</Badge> :
                            <Badge progress="incomplete" status="attention">{this.state.order.financial_status}</Badge>}
                    </div>
                <FormLayout>
                    <Layout>
                        <Layout.Section>
                            {this.state.order_timeline_skeleton ?
                                <Card title={'Order timeline'} actions={[{
                                    content: <img style={{height: '35px', width: '35px'}}
                                                  src={require("../../../assets/img/order.png")}/>
                                }]}>
                                    <Card.Section>
                                        <FormLayout>
                                            <Stack distribution={"equalSpacing"}>
                                                <b><Heading element={"p"}>Order id</Heading></b>
                                                <p style={{fontSize: '1.5rem'}}>{this.state.order.source_order_id}</p>
                                            </Stack>
                                            <Stack distribution={"equalSpacing"}>
                                                <b><Heading element={"p"}>Order placed at</Heading></b>
                                                <p style={{fontSize: '1.5rem'}}>{this.state.order.placed_at}</p>
                                            </Stack>
                                            <Stack distribution={"equalSpacing"}>
                                                <b><Heading element={"p"}>Order status</Heading></b>
                                                {/*<p style={{fontSize: '1.5rem'}}>{this.state.order.status}</p>*/}
                                                <Badge progress={this.state.order.badge_progress}
                                                       status={this.state.order.badge_status}>{this.state.order.status}</Badge>
                                            </Stack>
                                            {/*<Stack distribution={"equalSpacing"}>
                                             <Heading element={"p"}>Purchased from</Heading>
                                             <p style={{fontSize: '1.5rem'}}>{this.state.order.purchased_from}</p>
                                             </Stack>*/}
                                            <Stack distribution={"equalSpacing"}>
                                                <b><Heading element={"p"}>Line items ordered</Heading></b>
                                                <p style={{fontSize: '1.5rem'}}>{this.state.order.number_of_line_item}</p>
                                            </Stack>
                                            {
                                                this.state.reason_for_cancellation ?
                                                    <Stack distribution={"equalSpacing"}>
                                                        <b><Heading element={"p"}>Reason For cancellation</Heading></b>
                                                        <Badge status="warning"><p
                                                            style={{fontSize: '1.5rem'}}>{this.state.order.error_message}</p>
                                                        </Badge>

                                                    </Stack> : null}
                                            {
                                                this.state.tracking_id ? <Stack distribution={"equalSpacing"}>
                                                    <b><Heading element={"p"}>Tracking ID</Heading></b>
                                                    <p style={{fontSize: '1.5rem'}}>{this.state.order.tracking_id}</p>
                                                </Stack> : null
                                            }
                                            {
                                                this.state.tracking_id ? <Stack distribution={"equalSpacing"}>
                                                    <b><Heading element={"p"}>Tracking Company</Heading></b>
                                                    <p style={{fontSize: '1.5rem'}}>{this.state.order.tracking_name}</p>
                                                </Stack> : null
                                            }
                                        </FormLayout>
                                    </Card.Section>
                                </Card> : null} {/*<Skeleton case="body"/>*/}

                            {this.state.order_timeline_skeleton ?
                                <Card title={'Listing Items'} actions={[{
                                    content: <img style={{height: '35px', width: '35px'}}
                                                  src={require("../../../assets/img/productorder.png")}/>
                                }]}>
                                    <Card.Section>
                                        {this.productListing()}
                                    </Card.Section>
                                </Card> : null} {/*<Skeleton case="body"/>*/}

                            {this.state.fulfil.length > 0 && <React.Fragment>
                            </React.Fragment>}
                        </Layout.Section>

                        <Layout.Section secondary>
                            <FormLayout>
                                {this.state.order_timeline_skeleton ?
                                    <Card title={'Account details'} actions={[{
                                        content: <img style={{height: '35px', width: '35px'}}
                                                      src={require("../../../assets/img/user.png")}/>
                                    }]}>
                                        <Card.Section title={'Customer'}>
                                            <p style={{
                                                fontSize: '1.5rem',
                                                color: 'blue'
                                            }}>{this.state.client_details.customer_name}</p>
                                        </Card.Section>
                                        <Card.Section title={'Contact information'}>
                                            {/*<p style={{
                                             fontSize: '1.5rem',
                                             color: 'blue'
                                             }}>{this.state.client_details.contact_email}<br/>
                                             {this.state.client_details.contact_number}</p>*/}
                                            <Stack distribution={"equalSpacing"}>
                                                <b><Heading element={"p"}>Contact Number</Heading></b>
                                                {this.state.client_details.contact_number === '' || this.state.client_details.contact_number === null ?
                                                    <p style={{fontSize: '1.5rem', color: 'blue'}}>NaN</p> :
                                                    <p style={{
                                                        fontSize: '1.5rem',
                                                        color: 'blue'
                                                    }}>{this.state.client_details.contact_number}</p>}
                                            </Stack>
                                        </Card.Section>
                                        {/*<Card.Section title={'Shipping information'}>
                                         <p style={{
                                         fontSize: '1.5rem',
                                         color: 'blue'
                                         }}>{this.state.shipping_address.shipping_address}<br/>
                                         {this.state.shipping_address.shipping_city}<br/>
                                         {this.state.shipping_address.shipping_zip}<br/>
                                         {this.state.shipping_address.shipping_country}
                                         </p>
                                         </Card.Section>*/}
                                    </Card> : null} {/*<Skeleton case="body"/>*/}
                                {this.state.order_timeline_skeleton ?
                                    <Card title={'Shipping details'} actions={[{
                                        content: <img style={{height: '35px', width: '35px'}}
                                                      src={require("../../../assets/img/delivery.png")}/>
                                    }]}>
                                        <Card.Section>
                                            <FormLayout>
                                                <Stack distribution={"equalSpacing"}>
                                                    <Heading element={"p"}>Full Address</Heading>
                                                    <p style={{fontSize: '1.3rem'}}>{this.state.shipping_address.shipping_address}</p>
                                                </Stack>
                                                <hr/>
                                                <Stack distribution={"equalSpacing"}>
                                                    <Heading element={"p"}>Zip Code</Heading>
                                                    <p style={{fontSize: '1.3rem'}}>{this.state.shipping_address.shipping_zip}</p>
                                                </Stack>
                                                <hr/>
                                                <Stack distribution={"equalSpacing"}>
                                                    <Heading element={"p"}>City</Heading>
                                                    <p style={{fontSize: '1.3rem'}}>{this.state.shipping_address.shipping_city}</p>
                                                </Stack>
                                                <hr/>
                                                <Stack distribution={"equalSpacing"}>
                                                    <Heading element={"p"}>Country</Heading>
                                                    <p style={{fontSize: '1.3rem'}}>{this.state.shipping_address.shipping_country}</p>
                                                </Stack>
                                            </FormLayout>
                                        </Card.Section>
                                        {/* <Card.Section>
                                         <Stack distribution={"equalSpacing"}>
                                         <Heading element={"p"}>Total price</Heading>
                                         <p style={{fontSize: '1.3rem'}}>{this.state.order_price.total_price}</p>
                                         </Stack>
                                         </Card.Section>*/}
                                    </Card> : null} {/*<Skeleton case="body"/>*/}
                            </FormLayout>
                            <div  className="Polaris-Button--textAlignRight">
                                <Button
                                    primary
                                    onClick={() => {
                                        this.deleteOrderFromApp(this.state.order.source_order_id)
                                    }}
                                >
                                    Delete Order From App
                                </Button>
                            </div>
                        </Layout.Section>
                    </Layout>
                </FormLayout>
            </Page>
        );
    }

    redirect(url) {
        if (!isUndefined(this.props.location.state) && Object.keys(this.props.location.state).length > 0) {
            this.props.history.push(url, JSON.parse(JSON.stringify(this.props.location.state)))
        } else {
            this.props.history.push(url);
        }
    }
}

export default Order;

