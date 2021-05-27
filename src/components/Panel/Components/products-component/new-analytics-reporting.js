import React, {Component} from "react"
import {requests} from "../../../../services/request";
import {notify} from "../../../../services/notify";
import {validateImporter} from "../static-functions.js";
import {
    Card,
    Label,
    Thumbnail,
    Banner,
    TextStyle,
    Layout,
    Stack,
    ResourceList,
    Avatar,
    Link,
    Icon,
    Heading,
    Button
} from "@shopify/polaris";
import '@shopify/polaris/styles.css';
import "./new-analytics-reporting.css";
import {Doughnut} from 'react-chartjs-2';
import Skeleton from "../../../../shared/skeleton";
import {capitalizeWord} from "../static-functions";
class Demo_analytics_reporting extends Component {

    constructor(props) {
        super(props)
        this.state = {
            y_axis_importer: [],
            skeleton: [true, true, true],
            linegraphskeleton: true,
            datewiseskeleton: true,
            recentactivityskeleton: true,
            backgroundColor: ['#9575cd', '#5c6bc0', '#64b5f6', '#673ab7', '#3f51b5', '#0d47a1'],
            hoverBackgroundColor: ['#9575cd', '#5c6bc0', '#64b5f6', '#673ab7', '#3f51b5', '#0d47a1'],
            data1: {datasets: [{data: [0, 0, 0],}], title: "Loading Details....."},
            data2: {datasets: [{data: [0, 0, 0],}], title: "Loading Details....."},
            data3: {datasets: [{data: [0, 0, 0],}], title: "Loading Details....."},
            legend: {display: true},
            no_getOrderAnalytics: false,
            no_news_data_present:false,
            no_getOrderDatewise: false,
            no_getOrderRevenueRangewise: false,
            no_getProductsUploadedData_and_ImportedData: false,
            credits_available:false,
            Recurrying: false,
            plan: "",
            activated_on: "",
            price: "",
            next_billing: "",
            recurring_planskeleton: false,
            recentActivities: [],
            to_redirect: ["/panel/products", "/panel/products", "/panel/plans/current"],
            content_data:{
                datanews:[],
                datablog:[],
            },

        }
        this.preparedata();
    }

    preparedata() {
        this.getAllImporter();
        this.getServiceCredits();
        this.getallNotifications();
        this.getActiveRecurrying();
        this.tableBlogData();
        this.newsdatafrombackend();
    }

    getallNotifications() {
        requests.getRequest('connector/get/allNotifications', {count: 3, activePage: 0}, false, true).then(response => {
            if (response.success) {
                this.state.recentActivities = response.data.rows;
                this.state.totalRecentActivities = response.data.count;
                this.state.recentactivityskeleton = false
                this.updateState();
            }
        })
    }

    monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

    getActiveRecurrying() {
        let plan_to_be_end = "";
        requests.getRequest('plan/plan/getActive', undefined, false, true)
            .then(response => {
                if (response.success) {
                    var current_date = new Date();
                    var add_on_date = new Date(response.data.activated_at);
                    let difference = this.monthDiff(add_on_date,current_date);
                    if (new Date(new Date(add_on_date).setMonth(add_on_date.getMonth() + difference+1)) <=   current_date) {

                        plan_to_be_end = new Date(new Date(add_on_date).setMonth(add_on_date.getMonth() + difference + 2));
                    }
                    else {
                        plan_to_be_end = new Date(new Date(add_on_date).setMonth(add_on_date.getMonth() + difference + 1));
                    }
                    this.setState({
                        Recurrying: true,
                        plan: response.data.description,
                        activated_on: response.data.activated_at,
                        price: response.data.main_price,
                        next_billing: plan_to_be_end.toDateString(),
                        recurring_planskeleton: false
                    });
                }
                else {
                    this.setState({
                        Recurrying: false,
                        recurring_planskeleton: false
                    })
                }
            })
    }

    getServiceCredits() {
        requests.getRequest('shopifygql/payment/getCreditsSettings', undefined, false, true)
            .then(response => {
                if (response.success) {
                    if (response.data.available_credits === 0 && response.data.used_credits === 0){
                        this.setState({
                            credits_available:true,
                        })
                    }
                    /*let total_credit = response.d
                    ata.available_credits + response.data.total_used_credits
                     let In_Ratio = response.data.available_credits / total_credit * 100;
                     let In_Ratio1 = 100 - In_Ratio;*/
                    this.setState({
                        data3: {
                            labels: ["Available", "Used"],
                            datasets: [{
                                data: [response.data.available_credits, response.data.used_credits],
                                backgroundColor: this.state.backgroundColor,
                                hoverBackgroundColor: this.state.hoverBackgroundColor,
                            }],
                            title: "Available Credits",
                        },
                    })
                    this.state.skeleton[2] = false;
                    this.setState(
                        this.state
                    )

                }
                else {
                    this.setState({
                        credits_available:true,
                    })
                }

            });
    }

    getAllImporter() {
        let importer_title = [];
        let importer = {};
        let importer_marketplace = [];
        requests
            .getRequest("connector/get/services?filters[type]=importer")
            .then(data => {
                if (data.success) {
                    importer = data.data;
                    Object.keys(importer).map(importerkey => {
                        if (validateImporter(importerkey)) {
                            importer_title.push(importer[importerkey]["title"]);
                            importer_marketplace.push(importer[importerkey]["marketplace"]);
                        }
                    });
                    this.getYAxisImporter(
                        importer_marketplace,
                        importer_title,
                        importer
                    );
                    this.getYAxisUploader(
                        importer_marketplace,
                        importer_title,
                        importer
                    );
                    this.setState({importer: importer_title});
                } else {
                    notify.error(data.message);
                }
            });
    }

    /*getYAxisImporter(importer_marketplace_array, importer_title_array, entire_data_importer) {
        let total_products_importer = [];
        let label_mp_array = [];
        let importer_data_rec = {};
        console.log(importer_marketplace_array)
        requests.postRequest("frontend/app/getImportedProductCount", {importers: importer_marketplace_array}, false, true)
            .then(data => {
                console.log(data);
                if (data.success && (data['data']['amazonaffiliate'] !== 0 || data['data']['amazonimporter'] !== 0 || data['data']['ebayimporter'] !== 0 ||
                    data['data']['etsyimporter'] !== 0 || data['data']['walmartimporter'] !== 0 || data['data']['wishimporter'] !== 0 || data['data']['ebayaffiliate'] !== 0 || data['data']['fileimporter'] !== 0 ))

                {
                    importer_data_rec = data.data;
                    console.log(importer_title_array)

                    Object.keys(importer_data_rec).map(importer_recieved_mp => {
                        for (let i = 0; i < importer_marketplace_array.length; i++) {
                            Object.keys(entire_data_importer).map(master_key => {
                                console.log(importer_recieved_mp)
                                console.log(importer_marketplace_array[i]);
                                console.log(entire_data_importer);
                                console.log(master_key)

                                if (
                                    importer_marketplace_array[i] === entire_data_importer[master_key]["marketplace"] &&
                                    importer_title_array[i] === entire_data_importer[master_key]["title"] &&
                                    importer_marketplace_array[i] === importer_recieved_mp
                                ) {
                                    console.log('in 237');
                                    console.log(data.data[importer_recieved_mp]);
                                    if (data.data['ebayaffiliate']>0) {
                                        console.log("in 240")
                                        total_products_importer.push(
                                            importer_data_rec[importer_recieved_mp]
                                        );
                                        label_mp_array.push(
                                            importer_recieved_mp
                                        )

                                    }else{
                                        console.log("in 249")
                                        console.log(importer_recieved_mp)
                                    }
                                }else{
                                    console.log("in Elseee")
                                    console.log(importer_recieved_mp)
                                }
                            });
                        }
                    });
                    label_mp_array = label_mp_array
                        .map(e1 => (capitalizeWord(e1)));
                    console.log(label_mp_array)

                    total_products_importer.push(0);
                    this.setState({
                        data2: {
                            labels: label_mp_array,
                            datasets: [{
                                data: total_products_importer,
                                backgroundColor: this.state.backgroundColor,
                                hoverBackgroundColor: this.state.hoverBackgroundColor,
                            }], title: "Imported"
                        },
                    });
                    this.state.skeleton[1] = false;
                    this.setState(this.state)
                }  else if (data.success && data['data']['amazonaffiliate'] === 0 && data['data']['amazonimporter'] === 0 && data['data']['ebayimporter'] === 0 &&
                    data['data']['etsyimporter'] === 0 && data['data']['walmartimporter'] === 0 && data['data']['wishimporter'] === 0 && data['data']['ebayaffiliate'] === 0) {
                    console.log("in else iff");
                    this.setState({no_getProductsUploadedData_and_ImportedData: true})
                } else {
                    console.log("in else iff 2");
                    this.setState({no_getProductsUploadedData_and_ImportedData: true})
                }
            });
    }*/

    getYAxisImporter(importer_marketplace_array, importer_title_array, entire_data_importer) {
        let total_products_importer = [];
        let label_mp_array = [];
        let importer_data_rec = {};
        requests.postRequest("frontend/app/getImportedProductCount", {importers: importer_marketplace_array}, false, true)
            .then(data => {
                if (data.success && (data['data']['amazonaffiliate'] !== 0 || data['data']['amazonimporter'] !== 0 || data['data']['ebayimporter'] !== 0 ||
                    data['data']['etsyimporter'] !== 0 || data['data']['walmartimporter'] !== 0 || data['data']['wishimporter'] !== 0 || data['data']['ebayaffiliate'] !== 0 || data['data']['fileimporter'] !== 0 || data['data']['aliexpress'] !== 0 ))

                {
                    importer_data_rec = data.data;

                    Object.keys(importer_data_rec).map(importer_recieved_mp => {
                        for (let i = 0; i < importer_marketplace_array.length; i++) {
                            Object.keys(entire_data_importer).map(master_key => {

                                if (
                                    importer_marketplace_array[i] === entire_data_importer[master_key]["marketplace"] &&
                                    importer_title_array[i] === entire_data_importer[master_key]["title"] &&
                                    importer_marketplace_array[i] === importer_recieved_mp
                                ) {
                                    if (data.data[importer_recieved_mp]>0) {
                                        total_products_importer.push(
                                            importer_data_rec[importer_recieved_mp]
                                        );
                                        label_mp_array.push(
                                            importer_recieved_mp
                                        )

                                    }
                                }
                            });
                        }
                    });
                    label_mp_array = label_mp_array
                        .map(e1 => (capitalizeWord(e1)));

                    // for (let d = 0 ; d < label_mp_array.length; d++){
                    //     if (label_mp_array[d] === 'Amazon Dropshipping'){
                    //         label_mp_array[d] = 'Amazon\nDropshipping'
                    //     }
                    // }
                    // console.log(label_mp_array);

                    total_products_importer.push(0);
                    this.setState({
                        data2: {
                            labels: label_mp_array,
                            datasets: [{
                                data: total_products_importer,
                                backgroundColor: this.state.backgroundColor,
                                hoverBackgroundColor: this.state.hoverBackgroundColor,
                            }], title: "Imported"
                        },
                    });
                    this.state.skeleton[1] = false;
                    this.setState(this.state)
                }  else if (data.success && data['data']['amazonaffiliate'] === 0 && data['data']['amazonimporter'] === 0 && data['data']['ebayimporter'] === 0 &&
                    data['data']['etsyimporter'] === 0 && data['data']['walmartimporter'] === 0 && data['data']['wishimporter'] === 0 && data['data']['ebayaffiliate'] === 0 && data['data']['aliexpress'] === 0) {
                    this.setState({no_getProductsUploadedData_and_ImportedData: true})
                } else {
                    this.setState({no_getProductsUploadedData_and_ImportedData: true})
                }
            });
    }

    getYAxisUploader(uploader_marketplce, title, data) {
        let uploaderarray = [];
        let uploader = [];
        let show = false;
        requests
            .postRequest("frontend/app/getUploadedProductsCount", {
                marketplace: title
            })
            .then(data1 => {
                if (data1.success && (data1.data.length > 0))
                {
                    Object.keys(data1.data).forEach(e => {
                        if (data1.data[e] !== undefined) {
                            if (data1.data[e]["_id"] === null) {
                                uploader.push("Shopify Matched");
                                uploaderarray.push(data1.data[e]["count"]);
                                show = true;
                            } else {
                                uploader.push(capitalizeWord(data1.data[e]["_id"]));
                                uploaderarray.push(data1.data[e]["count"]);
                                show = true;
                            }
                        }
                    });
                    this.setState({
                        data1: {
                            labels: uploader,
                            datasets: [{
                                data: uploaderarray,
                                backgroundColor: this.state.backgroundColor,
                                hoverBackgroundColor: this.state.hoverBackgroundColor,
                            }],
                            title: "Uploaded",
                        },
                    })
                    this.state.skeleton[0] = false;
                    this.setState(
                        this.state
                    )
                    /* Object.keys(data1.data).forEach(e => {
                     if (data1.data[e] !== undefined) {
                     if (data1.data[e]["_id"] === null) {
                     uploader.push("Shopify Matched Product");
                     uploaderarray.push(data1.data[e]["count"]);
                     show = true;
                     } else {
                     uploader.push(capitalizeWord(data1.data[e]["_id"]));
                     uploaderarray.push(data1.data[e]["count"]);
                     show = true;
                     }
                     }
                     });
                     uploaderarray.push(0);
                     this.setState({
                     yaxisuploader: uploaderarray,
                     uploaded_product: show,
                     uploader: uploader
                     });*/
                }
                else if (data1.success && data1.data.length < 0) {

                    this.setState({
                        no_getOrderAnalytics: true
                    })
                } else {
                    this.setState({
                        no_getOrderAnalytics: true
                    })
                }
            });
    }

    to_final_render_Doughnut() {
        const legendOpts = {
            display: true,
            position: 'right',
            fullWidth: true,
            reverse: false,
            labels: {
                fontColor: 'Black'
            }
        };
        let arr = [];
        let temp_order = this.state.no_getOrderAnalytics;
        let temp_products = this.state.no_getProductsUploadedData_and_ImportedData;
        let temp_credits = this.state.credits_available;
        for (let i = 0; i < 3; i++) {
            let yourVariable = "data" + (i + 1);
            let title = this.state[yourVariable]
            if (temp_order && i == 0) {
                arr.push(<div className="col-sm-12 col-md-12 col-lg-4" key={yourVariable}>
                        <Card
                            title="Uploaded"
                            sectioned
                            actions={{
                                content: <Link><Icon source="help" color="inkLighter" backdrop={true}/></Link>,
                                onClick: () => {
                                    this.redirect('/panel/import')
                                }}
                            }>
                            <Stack distribution="center">
                                <img className='img-fluid ' src={require("../../../../assets/img/222x176.png")}/>
                            </Stack>
                        </Card>
                    </div>
                );
                temp_order = false
                continue;
            }
            else if (temp_products && i == 1) {
                arr.push(<div className=" col-sm-12 col-md-12 col-lg-4" key={yourVariable}>
                        <Card
                            title="Imported "
                            sectioned
                            actions={{
                                content: <Link><Icon source="help" color="inkLighter" backdrop={true}/></Link>,
                                onClick: () => {
                                    this.redirect('/panel/import')
                                }
                            }}>
                            <Stack distribution="center">
                                <img className='img-fluid ' src={require("../../../../assets/img/222x176.png")}/>
                            </Stack>
                        </Card>
                    </div>
                );
                temp_products = false
                continue;
            }
            else if (temp_credits && i == 2) {
                arr.push(<div className=" col-sm-12 col-md-12 col-lg-4" key={yourVariable}>
                        <Card
                            title="Credits"
                            sectioned
                            actions={{
                                content: <Link><Icon source="help" color="inkLighter" backdrop={true}/></Link>,
                                onClick: () => {
                                    this.redirect('/panel/plans/current')
                                }
                            }}>
                            <Stack distribution="center">
                                <img className='img-fluid ' src={require("../../../../assets/img/222x176.png")}/>
                            </Stack>
                        </Card>
                    </div>
                );
                temp_products = false
                continue;
            }
            arr.push(<div className="col-sm-12 col-md-12 col-lg-4 no-gutters" key={yourVariable} onClick={() => {
                    this.redirect(this.state.to_redirect[i])
                }}>
                    {
                        this.state.skeleton[i] ? <Skeleton/> :

                                <Card title={title.title} sectioned>
                                    <Doughnut data={this.state[yourVariable]} /*options={this.state.legend}*/
                                              legend={legendOpts}/>
                                </Card>
                        }
                </div >
            );
        }
        return (arr)

    }

    recurring_plan() {
        if (this.state.Recurrying === true) {
            return (this.state.recurring_planskeleton ? <Skeleton case="body"/> :
                    <Card>
                        <ResourceList
                            items={[
                                {
                                    name: 'Current Plan',
                                    location: this.state.plan,
                                },
                                {
                                    name: 'Current Plan Price',
                                    location: "$ " + this.state.price,
                                },
                                {
                                    name: 'Plan Activated On',
                                    location: this.state.activated_on,
                                },
                                {
                                    name: 'Next Billing Cycle',
                                    location: this.state.next_billing,
                                },
                            ]}
                            renderItem={(item) => {
                                const {id, url, name, location} = item;
                                const media = <Avatar customer size="medium" name={name}/>


                                return (
                                    <ResourceList.Item id={id} url={url} media={media}>
                                        <h3>
                                            <TextStyle variation="strong">{name}</TextStyle>
                                        </h3>
                                        <div>{location}</div>
                                    </ResourceList.Item>
                                );
                            }}
                        />
                    </Card>
            )
        }
        else {
            return (this.state.recurring_planskeleton ? <Skeleton case="body"/> :
                    <Layout>
                        <Layout.Section>
                            <Banner status="info">
                                <p>No Active Recurring Plan Found</p>
                            </Banner>
                        </Layout.Section>
                        <Layout.Section>
                            <img className='img-fluid' src={require("../../../../assets/img/320x260.png")}/>
                        </Layout.Section>
                    </Layout>
            )
        }
    }

    newsdatafrombackend() {
        let temparr = [];
        requests.getRequest('frontend/importer/addNews').then(data => {
            if (data.success) {
                for (let i = 0; i < data.data.length; i++) {
                    temparr.push({
                        label: data.data[i],
                        value: i
                    });
                    this.state.content_data.datanews = temparr;
                }

                this.setState(this.state);
            }
        })
    }

    tableBlogData(){
        let temparr=[];
        requests.getRequest('frontend/importer/addBlog').then(data=>{
            if (data.success) {
                for (let i = 0; i < data.data.length; i++) {
                    temparr.push({
                        label: data.data[i],
                        value: i
                    });
                    this.state.content_data.datablog = temparr;
                }

                this.setState(this.state);
            }
        })

    }

    render() {
        var rows = [];
        var rows_blog = [];
        for (let i = 0; i < this.state.content_data.datanews.length; i++) {
            rows.push(
                    {
                        url: this.state.content_data.datanews[i]['label']['content_link'],
                        name: this.state.content_data.datanews[i]['label']['title'],
                        description: this.state.content_data.datanews[i]['label']['description'],
                        media: (
                            <Thumbnail
                                source={this.state.content_data.datanews[i]['label']['image_url']}
                                alt="News Logo"
                            />)
                    }
                );

        }
        for(let i = 0; i< this.state.content_data.datablog.length; i++) {
            rows_blog.push(
                {
                    url: this.state.content_data.datablog[i]['label']['content_link'],
                    name: this.state.content_data.datablog[i]['label']['title'],
                    description: this.state.content_data.datablog[i]['label']['description'],
                    media: (
                        <Thumbnail
                            source={this.state.content_data.datablog[i]['label']['image_url']}
                            alt="News Logo"
                        />)
                }
            );
            if (rows_blog.length <= 0){

                this.state.content_data.no_blog_data = true;
                this.setState(this.state);
            }

        }
        return (
            <React.Fragment>

                <Layout>
                    <Layout.Section>
                        <Layout sectioned={false}>
                            {this.to_final_render_Doughnut()}
                        </Layout>
                    </Layout.Section>

                    <Layout.Section>
                        <Card title="">
                            {/*<div className="text-right p-3">
                                <Button
                                    primary
                                    onClick={() => {
                                        this.redirect("/panel/help/report");
                                    }}
                                >Contact Us</Button>
                            </div>*/}
                              {/*actions={[{content: 'Click Here', url: 'https://apps.cedcommerce.com/importer/app/panel/help/report',external:true}]}>*/}
                            {/*<div className="text-center">
                                <Heading>Store Development</Heading>
                                <hr style={{marginLeft:"20%", marginRight:"20%"}}/>
                            </div>*/}
                            {this.render_recent_activity()}
                            {/*<div className="text-center">
                                <Label>Get your Shopify store developed at a reasonable price.</Label>
                                <hr/>
                            </div>*/}
                        </Card>
                    </Layout.Section>
                    <Layout.Section secondary>
                        <Card title="Recurring Plan" sectioned>
                            {this.recurring_plan()}
                        </Card>
                       
                    </Layout.Section>
                </Layout>
                <br/>
                <br/>
                <Layout>
                    <Layout.Section oneThird>
                        {/*----------------------------Recommended Apps-----------------------*/}
                        <Card title="Recommended Apps"
                              actions={[{content: 'See all', url: 'https://apps.shopify.com/partners/cedcommerce',external:true}]}>
                            <Card.Section>
                                <ResourceList
                                    items={[
                                        {
                                            url: 'https://apps.shopify.com/ebay-integration?surface_detail=ebay&surface_inter_position=1&surface_intra_position=5&surface_type=search',
                                            name: 'Ebay Marketplace Integration',
                                            description: 'Easiest way to sell on eBay and manage orders.',
                                            media: (
                                                <Thumbnail
                                                    source="https://apps.shopifycdn.com/listing_images/23dc4caf6a03bf29ec864415339a7610/icon/9d1d40ec2690a2fe0a47123990917bc5.png?height=84&width=84"
                                                    alt="ebay integration logo"
                                                />
                                            ),
                                        },
                                        {
                                            url: 'https://apps.shopify.com/facebook-marketplace-connector?utm_source=ced-strip&utm_medium=GTM&utm_campaign=FB%20%26%20IG%20One%20Liner%20for%20In-app%20notifications%20Bring%20your%20products%20across%20Facebook%20commerce%20surfaces%20with%20Enhanced%20Catalogs%20and%20grow%20your%20brand%E2%80%99s%20visibility.%20Amit%20Kumar%20sir%20/%20Ankit%20Singh%20please%20assign%20developers%20to%20add%20this%20notification%20on%20our%20apps%20also%20give%20the%20link%20mentioned%20above%20with%20same%20um%20paramter%20in%20the%20notification%20section%20Ankur%20sir%20/%20Rahul%20Mehta%20please%20add%20in%20the%20google%20and%20importer%20app%20Amit%20Kumar%20sir%20/Ankur%20sir%20/%20Rahul%20Mehta%20is%20it%20done%20?',
                                            name: 'Facebook & Instagram Shopping',
                                            description: 'Sell on Facebook & Instagram, list products and manage orders.',
                                            media: (
                                                <Thumbnail
                                                    source="https://apps.shopifycdn.com/listing_images/8e58c700f1ecc2539682f6a04a8852c7/icon/7e03edcb47faf2838726e580ffda8f0d.png?height=84&width=84"
                                                    alt="Facebook connector integration logo"
                                                />
                                            ),
                                        },
                                        {
                                            url: 'https://apps.shopify.com/etsy-marketplace-integration',
                                            name: 'Etsy Marketplace Integration',
                                            description: 'Sync & Automate to selling process from Shopify to Etsy.',
                                            media: (
                                                <Thumbnail
                                                    source="https://apps.shopifycdn.com/listing_images/2fa150931ca28a5ed6a17dc69c40477b/icon/51d25ddb1cd498cac3ef8aa418ce9601.png?height=84&width=84"
                                                    alt="Walmart Integration logo"
                                                />
                                            ),
                                        },
                                    ]}
                                    renderItem={(item) => {
                                        const {url, name, media, description} = item;

                                        return (
                                        <a href={url} target="_blank" style={{textDecoration:"none", color:"#000"}}><ResourceList.Item
                                                media={media}
                                                accessibilityLabel={`View details for ${name}`}
                                            >
                                                <h3>
                                                    <TextStyle variation="strong">{name}</TextStyle>
                                                </h3>
                                                <Label>
                                                    {description}
                                                </Label>
                                            </ResourceList.Item></a>
                                        );
                                    }}
                                />
                            </Card.Section>
                        </Card>
                        {/*----------------------------End Of Recommended Apps-----------------------*/}
                    </Layout.Section>
                    {rows.length > 0 ?
                    <Layout.Section oneThird>
                        <Card title="Latest Features"
                            >
                            <Card.Section>
                                <ResourceList
                                    items={rows}
                                    renderItem={(item) => {
                                        const {url,name,description,media} = item;

                                        return (
                                            <a href={url} target="_blank" style={{textDecoration:"none", color:"#000"}}><ResourceList.Item
                                                media={media}
                                                accessibilityLabel={`View details for ${name}`}
                                            >
                                                <h3>
                                                    <TextStyle variation="strong">{name}</TextStyle>
                                                </h3>
                                                <label>
                                                    {description}
                                                </label>
                                            </ResourceList.Item></a>
                                        );
                                    }}
                                />
                            </Card.Section>
                        </Card>
                    </Layout.Section> : <Layout.Section oneThird>
                            <Card title="News">
                                <Card.Section>
                                    <Stack distribution="center">
                                        <img className='img-fluid pt-5 mt-2' src={require("../../../../assets/img/data_nahi.png")}/>
                                    </Stack>
                                </Card.Section>
                            </Card>
                        </Layout.Section>}
                    <Layout.Section oneThird>
                        {rows_blog.length > 0?
                        <Card title="Blogs"
                              actions={[{content: 'See all', url: 'https://cedcommerce.com/blog/?s=omni+importer',external:true}]}>
                            <Card.Section>
                                <ResourceList
                                    items={rows_blog}
                                    renderItem={(item) => {
                                        const {url, name,media,description} = item;

                                        return (
                                            <a href={url} target="_blank" style={{textDecoration:"none", color:"#000"}}><ResourceList.Item
                                                media={media}
                                                accessibilityLabel={`View details for ${name}`}
                                            >
                                                <h3>
                                                    <TextStyle variation="strong">{name}</TextStyle>
                                                </h3>
                                                <label>
                                                    {description}
                                                </label>
                                            </ResourceList.Item></a>
                                        );
                                    }}
                                />
                            </Card.Section>
                        </Card>: <Layout.Section oneThird>
                                <Card title="Blogs">
                                    <Card.Section>
                                        <Stack distribution="center">
                                            <img className='img-fluid pt-5 mt-2' src={require("../../../../assets/img/data_nahi.png")}/>
                                        </Stack>
                                    </Card.Section>
                                </Card>
                            </Layout.Section>}
                    </Layout.Section>
                </Layout>
            </React.Fragment>
        )
    }

    render_recent_activity() {
        return(
            <div>
            <div className="justify-content-center fleximagedashborad">
                <div className="text-center markmargingimg"
                     onClick={() => {
                         this.redirect("/panel/help/report")}}>
                    <img
                        style={{'cursor': 'pointer'}}
                    className='img-fluid' 
                    id="imageclasscheckfistImage"
                    src={require("../../../../assets/img/DigitalMarketing3.gif")} alt="Store Development"
                    /*height="650" width="650"*//>
                </div>
                <div class="vl"></div>
                <div className="justify-content-center text-right  marktestimg" 
                // onClick={() => {
                //          window.location.replace("https://calendly.com/swatishukla/walmart_ca")}}
                         ><a href="https://calendly.com/swatishukla/walmart_ca" target="_blank" >
                             <img src={require("../../../../assets/img/meeting.jpeg")} width="680" height="100"
                             alt="imgaechexck" 
                              className='img-fluid p-2' 
                              id="imageclasscheck" 
                              style={{'cursor': 'pointer'}} 
                              /></a>
                              </div>
            </div></div>
                /* class="zoom"*/
            /*<Stack  distribution="center">
                <div>
                    <a href="https://apps.cedcommerce.com/shopify-store-development/"target="_blank"><img className='img-fluid p-3' src={require("../../../../assets/img/store_dev1.png")} alt="Store_Dev"/></a>
                </div>
                <div>
                    <a href="https://apps.cedcommerce.com/digital-marketing-services/"target="_blank"><img className='img-fluid pb-5 pr-5 pl-3' src={require("../../../../assets/img/store_dev2.png")} alt="Digital Marketing"/></a>
                </div>
            </Stack>*/
        )
/*        return (this.state.recentactivityskeleton ? <Skeleton case="body"/> :

                <Card.Section>
                    {
                        this.state.recentActivities.map((activity, index) => {
                            return (
                                <Banner status={activity.severity}
                                        title={activity.message}
                                        key={this.state.recentActivities.indexOf(activity)}>
                                    <Stack vertical={true}>
                                        <Stack distribution="equalSpacing">
                                            {activity.url !== null && activity.severity !== 'success' ?
                                                <a href={activity.url} target={'_blank'}>View
                                                    Report</a>
                                                : ''}
                                            <p>{activity.created_at}</p>
                                        </Stack>
                                    </Stack>
                                </Banner>
                            );
                        })
                    }
                    {
                        this.state.recentActivities.length === 0 &&
                        <Stack distribution="center">
                            <img className='img-fluid pt-5 mt-2' src={require("../../../../assets/img/data_nahi.png")}/>
                        </Stack>

                    }


                </Card.Section>

        )*/
    }

    updateState() {
        const state = this.state;
        this.setState(state);
    }

    redirect(url) {

        this.props.history.push(url);
    }

}

export default Demo_analytics_reporting;
