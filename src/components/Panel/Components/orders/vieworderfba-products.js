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
} from "@shopify/polaris";
import {isUndefined} from 'util';
import {requests} from "../../../../services/request";
// import {Skeleton} from "../../../../shared/skeleton";

class Order extends Component {

    constructor(props) {
        super(props);
        this.state = {
            actual_data: {},
            entire_data: {},
            totalPage: 0,
            order_timeline_skeleton: false,
            fulfil: [],
            order: {
                source_order_id: '',
                placed_at: '',
                status: '',
                source: '',
                purchased_from: '',
                number_of_line_item: 0,
            },
            client_details: {
                customer_name: '',
                contact_email: '',
                contact_number: '',
                browser_ip: ''
            },
            line_items: {
                product_title: '',
                product_price: '',
                product_quantity: '',
                product_sku: '',
            },
            order_price: {
                subtotal: 0,
                shipping_amount: 0,
                tax: 0,
                payment_method: '',
                total_price: 0,
            },
            shipping_address:{
                shipping_city:'',
                shipping_zip:'',
                shipping_address: '',
                shipping_country:'',
            },
            item: [],
            syncfulfillment: false,
            syncCancellation: false,
            source_shop_id: 0,
            source_url: "",
            refunds: false,
            Toast_render: false,
            Toastmsg: "checking",
            isSuccess: true,
            ToastTime: 300,
        };
        this.getOrder();
    }

    productListing(){
        var newArray=[];
        for (let i=0;i<this.state.item.length;i++){
            this.state.line_items.product_title = this.state.item[i][0];
            this.state.line_items.product_price = this.state.item[i][1];
            this.state.line_items.product_quantity = this.state.item[i][2];
            this.state.line_items.product_sku = this.state.item[i][3];
            newArray.push( <FormLayout>
                    <Stack vertical={true}>
                        <Stack  distribution="fill">
                            <div>
                                <p>{ this.state.line_items.product_title}</p>
                                <p><b>SKU : </b>{this.state.line_items.product_sku}</p>
                            </div>
                            <div>
                                <p><b>Price :</b>{this.state.line_items.product_price}</p>
                                <p><b>Quantity :</b> {this.state.line_items.product_quantity}</p>
                            </div>
                        </Stack>
                    </Stack>
                </FormLayout>
            )
            return newArray;
        }
    }

    getOrder() {
        requests.getRequest('fba/test/webhookCall?order_id=1722').then(data => {
            if (data.success) {
                this.state.order_timeline_skeleton = true;
                this.state.order.placed_at = data.data.created_at
                this.state.order.source_order_id = data.data.source_id
                this.state.order.status = data.data.status
                this.state.order.purchased_from = data.data.store_name
                if (data.data.payment) {
                    this.state.order_price.subtotal = data.data.payment.amount_ordered;
                    this.state.order_price.shipping_amount = data.data.payment.shipping_amount;
                    this.state.order_price.tax = data.data.total_tax;
                    this.state.order_price.payment_method = data.data.payment.method;
                    this.state.order_price.total_price = data.data.total_price;
                }
                if (data.data[0]['shipping_address']) {
                    this.state.client_details.customer_name = data.data[0]['shipping_address']['first_name'] + "  " + data.data[0]['shipping_address']['last_name']
                    this.state.client_details.contact_email = data.data[0]['shipping_address']['phone']
                    this.state.client_details.contact_number = data.data.billing_address.phone
                }
                if (data.data[0]['order_listing_item']) {
                    this.state.order.number_of_line_item = Object.keys(data.data[0]['order_listing_item']).length
                    for (let i = 0; i < this.state.order.number_of_line_item; i++) {
                        var line_item_data =[
                            this.state.line_items.product_title = data.data.line_items[0].title,
                            this.state.line_items.product_price = data.data.line_items[0].price,
                            this.state.line_items.product_quantity = data.data.line_items[0].quantity,
                            this.state.line_items.product_sku = data.data.line_items[0].sku
                        ];
                    }
                    var new_data=[];
                    new_data.push(line_item_data);
                    this.state.item = new_data;
                }
                if (data.data.shipping_address){
                    this.state.shipping_address.shipping_city = data.data.shipping_address.city;
                    this.state.shipping_address.shipping_address = data.data.shipping_address.address1+""+data.data.shipping_address.address2;
                    this.state.shipping_address.shipping_zip = data.data.shipping_address.zip;
                    this.state.shipping_address.shipping_country = data.data.shipping_address.country;
                }
                this.updateState()
                console.log(this.state.item);
            } else {
                // this.showToast(data.message,false,600);
            }
        });
    }

    updateState() {
        const state = this.state;
        this.setState(state);
    }

    render() {
        return (
            <Page fullWidth={true}
                  title={'View Order'}
                  titleMetadata={this.state.entire_data.status}
            >
                <FormLayout>
                    <Layout>
                        <Layout.Section>
                            {this.state.order_timeline_skeleton ?
                                <Card title={'Order timeline'}>
                                    <Card.Section>
                                        <FormLayout>
                                            <Stack distribution={"equalSpacing"}>
                                                <Heading element={"p"}>Order id</Heading>
                                                <p style={{fontSize: '1.5rem'}}>{this.state.order.source_order_id}</p>
                                            </Stack>
                                            <Stack distribution={"equalSpacing"}>
                                                <Heading element={"p"}>Order placed at</Heading>
                                                <p style={{fontSize: '1.5rem'}}>{this.state.order.placed_at}</p>
                                            </Stack>
                                            <Stack distribution={"equalSpacing"}>
                                                <Heading element={"p"}>Order status</Heading>
                                                <p style={{fontSize: '1.5rem'}}>{this.state.order.status}</p>
                                            </Stack>
                                            <Stack distribution={"equalSpacing"}>
                                                <Heading element={"p"}>Purchased from</Heading>
                                                <p style={{fontSize: '1.5rem'}}>{this.state.order.purchased_from}</p>
                                            </Stack>
                                            <Stack distribution={"equalSpacing"}>
                                                <Heading element={"p"}>Line items ordered</Heading>
                                                <p style={{fontSize: '1.5rem'}}>{this.state.order.number_of_line_item}</p>
                                            </Stack>
                                        </FormLayout>
                                    </Card.Section>
                                </Card> : <Card title={'Order timeline'}>
                                    <Card.Section>
                                        <FormLayout>
                                            <Stack distribution={"equalSpacing"}>
                                                <Heading element={"p"}>Order id</Heading>
                                                <p style={{fontSize: '1.5rem'}}>{this.state.order.source_order_id}</p>
                                            </Stack>
                                            <Stack distribution={"equalSpacing"}>
                                                <Heading element={"p"}>Order placed at</Heading>
                                                <p style={{fontSize: '1.5rem'}}>{this.state.order.placed_at}</p>
                                            </Stack>
                                            <Stack distribution={"equalSpacing"}>
                                                <Heading element={"p"}>Order status</Heading>
                                                <p style={{fontSize: '1.5rem'}}>{this.state.order.status}</p>
                                            </Stack>
                                            <Stack distribution={"equalSpacing"}>
                                                <Heading element={"p"}>Purchased from</Heading>
                                                <p style={{fontSize: '1.5rem'}}>{this.state.order.purchased_from}</p>
                                            </Stack>
                                            <Stack distribution={"equalSpacing"}>
                                                <Heading element={"p"}>Line items ordered</Heading>
                                                <p style={{fontSize: '1.5rem'}}>{this.state.order.number_of_line_item}</p>
                                            </Stack>
                                        </FormLayout>
                                    </Card.Section>
                                </Card>} {/*<Skeleton case="body"/>*/}

                            {this.state.order_timeline_skeleton ?
                                <Card title={'Listing Items'}>
                                    <Card.Section>
                                        {this.productListing()}
                                        <hr/>
                                    </Card.Section>
                                </Card> : <Card title={'Listing Items'}>
                                    <Card.Section>
                                        {this.productListing()}
                                        <hr/>
                                    </Card.Section>
                                </Card>} {/*<Skeleton case="body"/>*/}

                            {this.state.fulfil.length > 0 && <React.Fragment>
                            </React.Fragment>}
                        </Layout.Section>

                        <Layout.Section secondary>
                            <FormLayout>
                                {this.state.order_timeline_skeleton ?
                                    <Card title={'Account details'} actions={[{
                                        content: <img style={{height: '35px', width: '35px'}}
                                                      src={require("../../../../assets/img/contact-us.png")}/>
                                    }]}>
                                        <Card.Section title={'Customer'}>
                                            <p style={{
                                                fontSize: '1.5rem',
                                                color: 'blue'
                                            }}>{this.state.client_details.customer_name}</p>
                                        </Card.Section>
                                        <Card.Section title={'Contact information'}>
                                            <p style={{
                                                fontSize: '1.5rem',
                                                color: 'blue'
                                            }}>{this.state.client_details.contact_email}<br/>
                                                {this.state.client_details.contact_number}</p>
                                        </Card.Section>
                                        <Card.Section title={'Shipping information'}>
                                            <p style={{
                                                fontSize: '1.5rem',
                                                color: 'blue'
                                            }}>{this.state.shipping_address.shipping_address}<br/>
                                                {this.state.shipping_address.shipping_city}<br/>
                                                {this.state.shipping_address.shipping_zip}<br/>
                                                {this.state.shipping_address.shipping_country}
                                            </p>
                                        </Card.Section>
                                    </Card> : <Card title={'Account details'} actions={[{
                                        content: <img style={{height: '35px', width: '35px'}}
                                                      src={require("../../../../assets/img/contact-us.png")}/>
                                    }]}>
                                        <Card.Section title={'Customer'}>
                                            <p style={{
                                                fontSize: '1.5rem',
                                                color: 'blue'
                                            }}>{this.state.client_details.customer_name}</p>
                                        </Card.Section>
                                        <Card.Section title={'Contact information'}>
                                            <p style={{
                                                fontSize: '1.5rem',
                                                color: 'blue'
                                            }}>{this.state.client_details.contact_email}<br/>
                                                {this.state.client_details.contact_number}</p>
                                        </Card.Section>
                                        <Card.Section title={'Shipping information'}>
                                            <p style={{
                                                fontSize: '1.5rem',
                                                color: 'blue'
                                            }}>{this.state.shipping_address.shipping_address}<br/>
                                                {this.state.shipping_address.shipping_city}<br/>
                                                {this.state.shipping_address.shipping_zip}<br/>
                                                {this.state.shipping_address.shipping_country}
                                            </p>
                                        </Card.Section>
                                    </Card>} {/*<Skeleton case="body"/>*/}
                                {this.state.order_timeline_skeleton ?
                                    <Card title={'Pricing details'} actions={[{
                                        content: <img style={{height: '35px', width: '35px'}}
                                                      src={require("../../../../assets/img/contact-us.png")}/>
                                    }]}>
                                        <Card.Section>
                                            <FormLayout>
                                                <Stack distribution={"equalSpacing"}>
                                                    <Heading element={"p"}>Price</Heading>
                                                    <p style={{fontSize: '1.3rem'}}>{this.state.order_price.subtotal}</p>
                                                </Stack>
                                                <Stack distribution={"equalSpacing"}>
                                                    <Heading element={"p"}>Shipping Amount</Heading>
                                                    <p style={{fontSize: '1.3rem'}}>{parseFloat(this.state.order_price.shipping_amount).toFixed(2)}</p>
                                                </Stack>
                                                <Stack distribution={"equalSpacing"}>
                                                    <Heading element={"p"}>Inclusive tax</Heading>
                                                    <p style={{fontSize: '1.3rem'}}>{parseFloat(this.state.order_price.tax).toFixed(2)}</p>
                                                </Stack>
                                                <Stack distribution={"equalSpacing"}>
                                                    <Heading element={"p"}>Payment Method</Heading>
                                                    <p style={{fontSize: '1.3rem'}}>{this.state.order_price.payment_method}</p>
                                                </Stack>
                                            </FormLayout>
                                        </Card.Section>
                                        <Card.Section>
                                            <Stack distribution={"equalSpacing"}>
                                                <Heading element={"p"}>Total price</Heading>
                                                <p style={{fontSize: '1.3rem'}}>{this.state.order_price.total_price}</p>
                                            </Stack>
                                        </Card.Section>
                                    </Card> : <Card title={'Pricing details'} actions={[{
                                        content: <img style={{height: '35px', width: '35px'}}
                                                      src={require("../../../../assets/img/contact-us.png")}/>
                                    }]}>
                                        <Card.Section>
                                            <FormLayout>
                                                <Stack distribution={"equalSpacing"}>
                                                    <Heading element={"p"}>Price</Heading>
                                                    <p style={{fontSize: '1.3rem'}}>{this.state.order_price.subtotal}</p>
                                                </Stack>
                                                <Stack distribution={"equalSpacing"}>
                                                    <Heading element={"p"}>Shipping Amount</Heading>
                                                    <p style={{fontSize: '1.3rem'}}>{parseFloat(this.state.order_price.shipping_amount).toFixed(2)}</p>
                                                </Stack>
                                                <Stack distribution={"equalSpacing"}>
                                                    <Heading element={"p"}>Inclusive tax</Heading>
                                                    <p style={{fontSize: '1.3rem'}}>{parseFloat(this.state.order_price.tax).toFixed(2)}</p>
                                                </Stack>
                                                <Stack distribution={"equalSpacing"}>
                                                    <Heading element={"p"}>Payment Method</Heading>
                                                    <p style={{fontSize: '1.3rem'}}>{this.state.order_price.payment_method}</p>
                                                </Stack>
                                            </FormLayout>
                                        </Card.Section>
                                        <Card.Section>
                                            <Stack distribution={"equalSpacing"}>
                                                <Heading element={"p"}>Total price</Heading>
                                                <p style={{fontSize: '1.3rem'}}>{this.state.order_price.total_price}</p>
                                            </Stack>
                                        </Card.Section>
                                    </Card>} {/*<Skeleton case="body"/>*/}
                            </FormLayout>
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

