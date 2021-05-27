import React, {Component} from "react";
import {
    Select,
    Button,
    Card,
    TextField,
    Banner,
    Label,
    Tooltip,
    Icon, Tabs,
    Collapsible, Stack, FormLayout, Modal, Badge, DisplayText, Heading, Checkbox, Page
} from "@shopify/polaris";
import {
    CirclePlusMajorMonotone,CirclePlusMajorTwotone,CirclePlusMinor,CirclePlusOutlineMinor
} from '@shopify/polaris-icons';
import {requests} from "../../services/request";
import {notify} from "../../services/notify";
import {json} from "../../environments/static-json";
import FileImporter from "../../components/Panel/Components/import-component/fileimporter";
import {environment} from "../../environments/environment";
import {capitalizeWord,modifyOptionsData} from "../../components/Panel/Components/static-functions";
import {isUndefined} from "util";

class AppsShared extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_banner: false,
            deviceTest:  false,
            account_details_amazon:[],
            country_code:"",
            account_name:"",
            ebayAccountModal:false,
            amazonAccountModal:false,
            amazonAccountName:"",
            ebayAccountName:"",
        };
        this.getConnectors();
        // this.checkDevice();
        // this.getFbaAccountList();
    }

    componentDidMount() {
        if (
            this.props.necessaryInfo !== undefined &&
            Object.keys(this.props.necessaryInfo.credits).length > 0
        ) {
            let credits =
                this.props.necessaryInfo.credits.available_credits +
                this.props.necessaryInfo.credits["total_used_credits"];
            if (credits < 11) {
                this.setState({show_banner: true});
            }
        }
    }
    /*getFbaAccountList(){
         var temp_arry=[];
         var temp_array_1=[];
         var account_name="";
         var country_code="";
        requests.getRequest("fba/fbaconfig/getAmazonAccountDetials").then(data => {
            if (data.success) {
                for (let i=0;i<data.data.length;i++){
                    console.log(data.data[i]['country_code'])
                    temp_arry=[
                         this.state.account_name = data.data[i]['account_name'],
                         this.state.country_code = data.data[i]['country_code'],
                    ];
                    temp_array_1.push(temp_arry);
                }
                this.setState({
                    account_details_amazon:temp_array_1
                })

            }

        });
    }*/

    getConnectors() {
        this.state = {
            apps: [],
            ebay_county_code: "",
            code_usable: [],
            selected:0,
            banner_paln: false,
        };
        requests.getRequest("connector/get/all").then(data => {
            if (data.success) {
                let installedApps = [];
                let code = [];
                for (let i = 0; i < Object.keys(data.data).length; i++) {
                    if (data.data[Object.keys(data.data)[i]]['code'] == "ebayimporter") {
                        installedApps.push(data.data[Object.keys(data.data)[i]]);
                        code.push(data.data[Object.keys(data.data)[i]]["code"]);
                    }
                }
                for (let i = 0; i < Object.keys(data.data).length; i++) {
                    if (data.data[Object.keys(data.data)[i]]['code'] == "etsyimporter") {
                        installedApps.push(data.data[Object.keys(data.data)[i]]);
                        code.push(data.data[Object.keys(data.data)[i]]["code"]);
                    }
                }
                for (let i = 0; i < Object.keys(data.data).length; i++) {
                    if (data.data[Object.keys(data.data)[i]]['code'] == "amazonimporter") {
                        installedApps.push(data.data[Object.keys(data.data)[i]]);
                        code.push(data.data[Object.keys(data.data)[i]]["code"]);
                    }
                }
                for (let i = 0; i < Object.keys(data.data).length; i++) {
                    if (data.data[Object.keys(data.data)[i]]['code'] == "ebayaffiliate") {
                        installedApps.push(data.data[Object.keys(data.data)[i]]);
                        code.push(data.data[Object.keys(data.data)[i]]["code"]);
                    }
                }
                for (let i = 0; i < Object.keys(data.data).length; i++) {
                    if (data.data[Object.keys(data.data)[i]]['code'] == "wishimporter") {
                        installedApps.push(data.data[Object.keys(data.data)[i]]);
                        code.push(data.data[Object.keys(data.data)[i]]["code"]);
                    }
                }
                for (let i = 0; i < Object.keys(data.data).length; i++) {
                    if (data.data[Object.keys(data.data)[i]]['code'] == "fba") {
                        installedApps.push(data.data[Object.keys(data.data)[i]]);
                        code.push(data.data[Object.keys(data.data)[i]]["code"]);
                    }
                }
                for (let i = 0; i < Object.keys(data.data).length; i++) {
                    if (data.data[Object.keys(data.data)[i]]['code'] == "amazonaffiliate") {
                        installedApps.push(data.data[Object.keys(data.data)[i]]);
                        code.push(data.data[Object.keys(data.data)[i]]["code"]);
                    }
                }
                for (let i = 0; i < Object.keys(data.data).length; i++) {
                    if (data.data[Object.keys(data.data)[i]]['code'] == "walmartimporter") {
                        installedApps.push(data.data[Object.keys(data.data)[i]]);
                        code.push(data.data[Object.keys(data.data)[i]]["code"]);
                    }
                }
                for (let i = 0; i < Object.keys(data.data).length; i++) {
                    if (data.data[Object.keys(data.data)[i]]['code'] == "aliexpress") {
                        installedApps.push(data.data[Object.keys(data.data)[i]]);
                        code.push(data.data[Object.keys(data.data)[i]]["code"]);
                    }
                }
                this.props.importerServices(code);
                this.setState({
                    apps: installedApps
                });
            } else {
                notify.error(data.message);
            }
        });
    }

    handleChange = (obj, val) => {
        this.setState({[obj]: val});
    };

    handleTabChange = (selectedTabIndex) => {
        this.setState({selected: selectedTabIndex});
    };
    checkDevice() {

        var widthScreen = window.screen.width
        console.log(window.screen.width)

        if (widthScreen <=451){
            this.setState({
                deviceTest:true
            })
        }
        console.log(this.state.deviceTest);

        // window.mobileAndTabletCheck = function () {
        //     let check = false;
        //     (function (a) {
        //         if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        //     })(navigator.userAgent || navigator.vendor || window.opera);
        //     if (check){
        //         this.setState({
        //             deviceTest:true
        //         })
        //     }
        //     return check;
        // };
        /*window.mobileCheck = function() {
            let check = false;
            (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
            if (check){
                this.setState({
                    deviceTest:true
                })
            }
            return check;
        };*/
        /*var MobileDetect = require('mobile-detect'),
            md = new MobileDetect(req.headers['user-agent']);
        this.setState({
            deviceTest:MobileDetect
        })*/
    }

    addAnotherEbayAccount(){
        this.setState({
            ebayAccountModal:true
        })
    }

    addAnotherAmazonAccount(){
        this.setState({
            amazonAccountModal:true
        })
    }

    renderMarketplace() {
           return this.state.apps.map(app => {
               if (app.code == "ebayimporter"){
                   if (app.code !== 'fba' && app.code !== 'ebayaffiliate' && app.code !== 'amazonaffiliate' && app.code !== 'aliexpress' && app.title !== 'Etsy Dropshipping') {
                       if (this.validateCode(app.code)) {
                           return (
                               <div
                                   className="col-6 col-sm-6 mb-4"
                                   key={this.state.apps.indexOf(app)}
                               >
                                   <Card title={app.title}>
                                       {this.props.success.code === app.code ||
                                       app["installed"] !== 0
                                           ?<div className="text-left pt-3 pl-4">
                                               <Badge progress="complete" status="success">Connected</Badge>
                                           </div>:<div className="text-left pt-3 pl-4"></div>}
                                       <div className="row p-5">
                                           <div className="col-12 text-center">
                                               {window.screen.width <= 500 ?<img src={app.image} alt={app.title}
                                                                                 style={{maxWidth: "60px"}}/>:<img src={app.image} alt={app.title}
                                                                                                                                   style={{maxWidth: "80%"}}/>}
                                           </div>
                                           <div className="col-12 mt-4">


                                               {/*<div className="row">*/}
                                               {/*    <div className="col-12 col-sm-6">*/}
                                               {/*        {this.additionalInput(app.code)}*/}
                                               {/*    </div>*/}
                                               {/*    <div className="col-12 col-sm-6">*/}
                                               {/*        <Button*/}
                                               {/*            // disabled={this.props.success.code === app.code || app['installed'] !==0 && app.code !== 'ebayimporter'}*/}
                                               {/*            onClick={() => {*/}
                                               {/*                this.installApp(app.code);*/}
                                               {/*            }}*/}
                                               {/*            primary*/}
                                               {/*            fullWidth={true}*/}
                                               {/*        >*/}
                                               {/*            {this.props.success.code === app.code ||*/}
                                               {/*            app["installed"] !== 0*/}
                                               {/*                ? "ReConnect"*/}
                                               {/*                : "Link your Account"}*/}
                                               {/*        </Button>*/}
                                               {/*    </div>*/}
                                               {/*</div>*/}

                                                   {this.props.success.code === app.code ||
                                                   app["installed"] !== 0
                                                       ?   <div className="row">
                                                           <div className="col-12 col-sm-4">
                                                               {this.additionalInput(app.code)}
                                                           </div>
                                                           <div className="col-12 col-sm-4">
                                                               <Button
                                                                   // disabled={this.props.success.code === app.code || app['installed'] !==0 && app.code !== 'ebayimporter'}
                                                                   onClick={() => {
                                                                       this.installApp(app.code);
                                                                   }}
                                                                   primary
                                                                   fullWidth={true}
                                                               >
                                                                   {this.props.success.code === app.code ||
                                                                   app["installed"] !== 0
                                                                       ? "ReConnect"
                                                                       : "Link your Account"}
                                                               </Button>
                                                           </div>
                                                           <div className="col-12 col-sm-4">
                                                               <Button
                                                                   onClick={() => {
                                                                       this.addAnotherEbayAccount();
                                                                   }}
                                                                   primary
                                                               >
                                                                   <Icon
                                                                       source={CirclePlusMajorMonotone}
                                                                   />
                                                               </Button>
                                                           </div>
                                                       </div>:   <div className="row">
                                                           <div className="col-12 col-sm-6">
                                                               {this.additionalInput(app.code)}
                                                           </div>
                                                           <div className="col-12 col-sm-6">
                                                               <Button
                                                                   // disabled={this.props.success.code === app.code || app['installed'] !==0 && app.code !== 'ebayimporter'}
                                                                   onClick={() => {
                                                                       this.installApp(app.code);
                                                                   }}
                                                                   primary
                                                                   fullWidth={true}
                                                               >
                                                                   {this.props.success.code === app.code ||
                                                                   app["installed"] !== 0
                                                                       ? "ReConnect"
                                                                       : "Link your Account"}
                                                               </Button>
                                                           </div>
                                                       </div>}
                                           </div>
                                       </div>
                                   </Card>
                               </div>
                           );
                       }
                   }
               }
               else if (app.code == "amazonimporter"){
                   if (app.code !== 'fba' && app.code !== 'ebayaffiliate' && app.code !== 'amazonaffiliate' && app.code !== 'aliexpress' && app.title !== 'Etsy Dropshipping') {
                       if (this.validateCode(app.code)) {
                           return (
                               <div
                                   className="col-6 col-sm-6 mb-4"
                                   key={this.state.apps.indexOf(app)}
                               >
                                   <Card title={app.title}>
                                       {this.props.success.code === app.code ||
                                       app["installed"] !== 0
                                           ?<div className="text-left pt-3 pl-4">
                                               <Badge progress="complete" status="success">Connected</Badge>
                                           </div>:<div className="text-left pt-3 pl-4"></div>}
                                       <div className="row p-5">
                                           <div className="col-12 text-center">
                                               {window.screen.width <= 500 ?<img src={app.image} alt={app.title}
                                                                                 style={{maxWidth: "60px"}}/>:<img src={app.image} alt={app.title}
                                                                                                                                   style={{maxWidth: "80%"}}/>}
                                           </div>
                                           <div className="col-12 mt-4">

                                               {/*<div className="row">*/}
                                               {/*    <div className="col-12 col-sm-6">*/}
                                               {/*        {this.additionalInput(app.code)}*/}
                                               {/*    </div>*/}
                                               {/*    <div className="col-12 col-sm-6">*/}
                                               {/*        <Button*/}
                                               {/*            // disabled={this.props.success.code === app.code || app['installed'] !==0 && app.code !== 'ebayimporter'}*/}
                                               {/*            onClick={() => {*/}
                                               {/*                this.installApp(app.code);*/}
                                               {/*            }}*/}
                                               {/*            primary*/}
                                               {/*            fullWidth={true}*/}
                                               {/*        >*/}
                                               {/*            {this.props.success.code === app.code ||*/}
                                               {/*            app["installed"] !== 0*/}
                                               {/*                ? "ReConnect"*/}
                                               {/*                : "Link your Account"}*/}
                                               {/*        </Button>*/}
                                               {/*    </div>*/}
                                               {/*</div>*/}

                                               {this.props.success.code === app.code ||
                                               app["installed"] !== 0
                                                   ?   <div className="row">
                                                       <div className="col-12 col-sm-4">
                                                           {this.additionalInput(app.code)}
                                                       </div>
                                                       <div className="col-12 col-sm-4">
                                                           <Button
                                                               // disabled={this.props.success.code === app.code || app['installed'] !==0 && app.code !== 'ebayimporter'}
                                                               onClick={() => {
                                                                   this.installApp(app.code);
                                                               }}
                                                               primary
                                                               fullWidth={true}
                                                           >
                                                               {this.props.success.code === app.code ||
                                                               app["installed"] !== 0
                                                                   ? "ReConnect"
                                                                   : "Link your Account"}
                                                           </Button>
                                                       </div>
                                                       <div className="col-12 col-sm-4">
                                                           <Button
                                                               onClick={() => {
                                                                   this.addAnotherAmazonAccount();
                                                               }}
                                                               primary
                                                           >
                                                               <Icon
                                                                   source={CirclePlusMajorMonotone}
                                                               />
                                                           </Button>
                                                       </div>
                                                   </div>:   <div className="row">
                                                       <div className="col-12 col-sm-6">
                                                           {this.additionalInput(app.code)}
                                                       </div>
                                                       <div className="col-12 col-sm-6">
                                                           <Button
                                                               // disabled={this.props.success.code === app.code || app['installed'] !==0 && app.code !== 'ebayimporter'}
                                                               onClick={() => {
                                                                   this.installApp(app.code);
                                                               }}
                                                               primary
                                                               fullWidth={true}
                                                           >
                                                               {this.props.success.code === app.code ||
                                                               app["installed"] !== 0
                                                                   ? "ReConnect"
                                                                   : "Link your Account"}
                                                           </Button>
                                                       </div>
                                                   </div>}
                                           </div>
                                       </div>
                                   </Card>
                               </div>
                           );
                       }
                   }
               }

               else {
                   if (app.code !== 'fba' && app.code !== 'ebayaffiliate' && app.code !== 'amazonaffiliate' && app.code !== 'aliexpress' && app.title !== 'Etsy Dropshipping') {
                       if (this.validateCode(app.code)) {
                           app
                           return (
                               <div
                                   className="col-6 col-sm-6 mb-4"
                                   key={this.state.apps.indexOf(app)}
                               >
                                   <Card title={app.title}>
                                       {this.props.success.code === app.code ||
                                       app["installed"] !== 0
                                           ?<div className="text-left pt-3 pl-4">
                                               <Badge progress="complete" status="success">Connected</Badge>
                                           </div>:<div className="text-left pt-3 pl-4"></div>}
                                       <div className="row p-5">
                                           <div className="col-12 text-center">
                                               {window.screen.width <= 500 ?<img src={app.image} alt={app.title}
                                                                                 style={{maxWidth: "60px"}}/>:<img src={app.image} alt={app.title}
                                                                                                                                   style={{maxWidth: "80%"}}/>}
                                           </div>
                                           <div className="col-12 mt-4">
                                               <div className="row">
                                                   <div className="col-12 col-sm-6">
                                                       {this.additionalInput(app.code)}
                                                   </div>
                                                   <div className="col-12 col-sm-6">
                                                       <Button
                                                           // disabled={this.props.success.code === app.code || app['installed'] !==0 && app.code !== 'ebayimporter'}
                                                           onClick={() => {
                                                               this.installApp(app.code);
                                                           }}
                                                           primary
                                                           fullWidth={true}
                                                       >
                                                           {this.props.success.code === app.code ||
                                                           app["installed"] !== 0
                                                               ? "ReConnect"
                                                               : "Link your Account"}
                                                       </Button>
                                                   </div>
                                               </div>
                                           </div>
                                       </div>
                                   </Card>
                               </div>
                           );
                       }
                   }
               }
            })
        }

    renderOrderManagement(){

        return this.state.apps.map(app => {
            if (app.code === 'fba') {
                if (this.validateCode(app.code)) {
                        return (
                            <React.Fragment>
                                <div
                                    className="col-6 col-sm-6 mb-4"
                                    key={this.state.apps.indexOf(app)}
                                >
                                    <Card title={app.title}>
                                        {this.props.success.code === app.code ||
                                        app["installed"] !== 0
                                            ? <div className="text-left pt-3 pl-4">
                                                <Badge progress="complete" status="success">Connected</Badge>
                                            </div> : <div className="text-left pt-3 pl-4"></div>}
                                        <div className="row p-5">
                                            <div className="col-12 text-center">
                                                {window.screen.width <= 500 ?<img src={app.image} alt={app.title}
                                                                                  style={{maxWidth: "60px"}}/>:<img src={app.image} alt={app.title}
                                                                                                                                    style={{maxWidth: "80%"}}/>}
                                            </div>
                                            <div className="col-12 mt-4">
                                                <div className="row">
                                                    <div className="col-12 col-sm-6">
                                                        {this.additionalInput(app.code)}
                                                    </div>
                                                    <div className="col-12 col-sm-6">
                                                        <Button
                                                            // disabled={this.props.success.code === app.code || app['installed'] !==0 && app.code !== 'ebayimporter'}
                                                            onClick={() => {
                                                                this.installApp(app.code);
                                                            }}
                                                            primary
                                                            fullWidth={true}
                                                        >
                                                            {this.props.success.code === app.code ||
                                                            app["installed"] !== 0
                                                                ? "ReConnect"
                                                                : "Link your Account"}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                                {/*<div className="col-6 col-sm-6 mt-5 text-center">
                                    <img className='img-fluid pt-5 mt-2'
                                         style={{cursor: 'pointer'}}
                                         height="100"
                                         width="100"
                                         align="middle"
                                         src={require("../../assets/img/add_account.png")}
                                         onClick={() => {
                                             this.installApp(app.code);
                                         }}
                                    />
                                    <DisplayText size="small">Add More Account For FBA</DisplayText>
                                </div>*/}
                            </React.Fragment>

                        );
                }
            }
        })
    }
    renderDropshipping(){

        return this.state.apps.map(app => {
            if (app.code === 'aliexpress' || app.code === 'amazonaffiliate' || app.code === 'ebayaffiliate' || app.title === 'Etsy Dropshipping') {
                if (this.validateCode(app.code)) {
                    return (
                        <React.Fragment>
                            <div
                                className="col-6 col-sm-6 mb-4"
                                key={this.state.apps.indexOf(app)}
                            >
                                {app.code ==='aliexpress'||app.code ==='ebayaffiliate'?<Card title={app.title}
                                      actions={[{content: 'Help PDF',
                                      url:app.code === "ebayaffiliate" ? "http://apps.cedcommerce.com/importer/ebaydropshippingImporter.pdf":"http://apps.cedcommerce.com/importer/WorkingofAliexpressDropshippingMultichannelImporterapp.pdf",
                                          external : true,
                                      }]}
                                >
                                    {this.props.success.code === app.code ||
                                    app["installed"] !== 0
                                        ? <div className="text-left pt-1 pl-4">
                                            <Badge progress="complete" status="success">Connected</Badge>
                                        </div> : <div className="text-left pt-3 pl-4"></div>}

                                    <div className="row p-5">
                                        <div className="col-12 text-center">
                                            {window.screen.width <= 500 ?<img src={app.image} alt={app.title}
                                                                              style={{maxWidth: "60px"}}/>:<img src={app.image} alt={app.title}
                                                                                                                                style={{maxWidth: "80%"}}/>}
                                        </div>
                                        <div className="col-12 mt-4">
                                            <div className="row">
                                                <div className="col-12 col-sm-6">
                                                    {this.additionalInput(app.code)}
                                                </div>
                                                <div className="col-12 col-sm-6">
                                                    <Button
                                                        // disabled={this.props.success.code === app.code || app['installed'] !==0 && app.code !== 'ebayimporter'}
                                                        onClick={() => {
                                                            this.installApp(app.code);
                                                        }}
                                                        primary
                                                        fullWidth={true}
                                                    >
                                                        {this.props.success.code === app.code ||
                                                        app["installed"] !== 0
                                                            ? "Connected"
                                                            : "Link your Account"}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>:<Card title={app.title}
                                              // actions={[{content: 'Help PDF',
                                              //     url:"http://apps.cedcommerce.com/importer/ebaydropshippingImporter.pdf",
                                              //     external : true,
                                              // }]}
                                    >
                                        {this.props.success.code === app.code ||
                                        app["installed"] !== 0
                                            ? <div className="text-left pt-1 pl-4">
                                                <Badge progress="complete" status="success">Connected</Badge>
                                            </div> : <div className="text-left pt-3 pl-4"></div>}

                                        <div className="row p-5">
                                            <div className="col-12 text-center">
                                                {window.screen.width <= 500 ?<img src={app.image} alt={app.title}
                                                                                  style={{maxWidth: "60px"}}/>:<img src={app.image} alt={app.title}
                                                                                                                                    style={{maxWidth: "80%"}}/>}
                                            </div>
                                            <div className="col-12 mt-4">
                                                <div className="row">
                                                    <div className="col-12 col-sm-6">
                                                        {this.additionalInput(app.code)}
                                                    </div>
                                                    <div className="col-12 col-sm-6">
                                                        <Button
                                                            // disabled={this.props.success.code === app.code || app['installed'] !==0 && app.code !== 'ebayimporter'}
                                                            onClick={() => {
                                                                this.installApp(app.code);
                                                            }}
                                                            primary
                                                            fullWidth={true}
                                                        >
                                                            {this.props.success.code === app.code ||
                                                            app["installed"] !== 0
                                                                ? "Connected"
                                                                : "Link your Account"}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>}
                            </div>
                            {/*<div className="col-6 col-sm-6 mt-5 text-center">
                             <img className='img-fluid pt-5 mt-2'
                             style={{cursor: 'pointer'}}
                             height="100"
                             width="100"
                             align="middle"
                             src={require("../../assets/img/add_account.png")}
                             onClick={() => {
                             this.installApp(app.code);
                             }}
                             />
                             <DisplayText size="small">Add More Account For FBA</DisplayText>
                             </div>*/}
                        </React.Fragment>

                    );
                }
            }
        })
    }

    handleToggleClick = () => {

        this.setState((state) => {
            const banner_plan = !state.banner_plan;
            return {
                banner_plan,
            };
        });
    };

    handleChangeModakCsv = () => {
        // console.log("qwerty",this.state.active);
        // this.setState(({active}) => ({active: !active}));
        this.setState({
            active : !this.state.active,
        })
        // console.log("asdfgh",this.state.active);
        // this.csvManagementRender();
    };

    handleChangeModakEbayModal = () => {
        // console.log("qwerty",this.state.active);
        // this.setState(({active}) => ({active: !active}));
        this.setState({
            ebayAccountModal : !this.state.ebayAccountModal,
        })
        // console.log("asdfgh",this.state.active);
        // this.csvManagementRender();
    };

    handleChangeModakAmazonModal = () => {
        this.setState({
            amazonAccountModal : !this.state.amazonAccountModal,
        })
    };


    renderCsvUploadManagement() {
        const {active} = this.state;
        return (<React.Fragment>
                <div className="col-12 mb-3">
                    <div
                        style={{cursor: "pointer"}}
                        onClick={this.handleToggleClick.bind(this.state.banner_paln)}
                    >
                    </div>
                    <Collapsible open={true}
                                 ariaExpanded={this.state.fba_plan}
                    >
                        <FormLayout>
                            <FormLayout.Group condensed>
                                <div className="col-12 m-4">
                                    {/* Starting Of Plan Card */}
                                    <Card>
                                        <div className="d-flex justify-content-center p-5">
                                            <div className="pt-5">
                                                <div className="mb-5 text-center">
                                                    {" "}
                                                </div>
                                                <Stack distribution="center">
                                                    {" "}

                                                    <div className="col-12">
                                                        {window.screen.width <= 500 ?<img style={{height: '50px', width: '50px', cursor: "pointer"}}
                                                                                          src={require("../../assets/img/csv_upload.png")}
                                                                                          onClick={this.handleChangeModakCsv.bind(this)}
                                                        />:<img style={{height: '100px', width: '100px', cursor: "pointer"}}
                                                                src={require("../../assets/img/csv.svg")}
                                                                onClick={this.handleChangeModakCsv.bind(this)}
                                                            />}
                                                    </div>

                                                </Stack>
                                                <div className="mb-5 text-center">
                                                    {" "}
                                                    {/* Descriptions For Particular deatails */}
                                                    <h1 className="mb-4 mt-4">
                                                        <b>Upload CSV</b>
                                                    </h1>
                                                    <h4>Upload Your Product's CSV File To import all the products into an
                                                        App</h4>
                                                </div>
                                                <hr />
                                                <div className="text-center mt-5">
                                                </div>
                                            </div>
                                            {/*{console.log(this.state.active)}*/}

                                        </div>
                                    </Card>
                                </div>
                            </FormLayout.Group>
                        </FormLayout>
                    </Collapsible>
                </div>
            </React.Fragment>
        );

    }
    handleChangeEbayAccount= (event) => {
        this.setState({ebayAccountName: event});
    };
    handleChangeAmazonAccount= (event) => {
        console.log(event);
        this.setState({amazonAccountName: event});
    };


    render() {

        const {selected} = this.state;
        const tabs = [
            {
                id: 'account_marketplace',
                content: 'Marketplace',
                accessibilityLabel: 'accountmarketplace',
                panelID: 'accountmarketplace',
            },
            {
                id: 'dropshipping',
                content: 'Dropshipping',
                panelID: 'dropshipping',
            },
            {
                id: 'order_management',
                content: 'Order Management',
                panelID: 'order-management',
            },
            {
                id: 'cvs_management',
                content: 'CSV Upload',
                panelID: 'csv-management'
            }
        ];
        return (
            <div className="row">
                {this.state.show_banner && (
                    <div className="col-12 mb-5">
                        <Banner title="Note" status="info">
                            <Label id={"trial"}>You can upload 10 products free.</Label>
                        </Banner>
                    </div>
                )}

                <div className="col-12">
                    <Card>
                        <Tabs tabs={tabs} selected={selected} onSelect={this.handleTabChange}/>
                        <Card.Section>
                            <div className="row">
                            {selected == 0 ? this.renderMarketplace() : selected === 2 ? this.renderOrderManagement() :selected === 1 ? this.renderDropshipping() : this.renderCsvUploadManagement()}
                            </div>
                        </Card.Section>
                    </Card>
                </div>

                <Modal
                    open={this.state.active}
                    onClose={this.handleChangeModakCsv.bind(this)}
                    title="Upload CSV"
                >
                    <Modal.Section>
                        <FileImporter {...this.props} />
                    </Modal.Section>
                </Modal>

                <Modal
                    open={this.state.ebayAccountModal}
                    onClose= {this.handleChangeModakEbayModal.bind(this)}
                    title="Add Your Another Ebay Account"
                >
                    <Modal.Section>
                        <Banner title="Note" status="info">
                            <Label>Connect your another ebay account to import it's products also, just give another different account name</Label>
                        </Banner>
                        <div>
                            <TextField
                                label="Account Name"
                                placeholder="Enter Account Name"
                                helpText= "Enter different account name from previous connected ebay account"
                                value={this.state.ebayAccountName}
                                onChange={this.handleChangeEbayAccount.bind(this)}
                            />
                        </div>
                        <div className="row pt-3">
                            <div className="col-12 col-sm-6">
                                {this.additionalInput("ebayimporter")}
                            </div>
                        <div className="col-12 col-sm-6">
                            <Button
                                // disabled={this.props.success.code === app.code || app['installed'] !==0 && app.code !== 'ebayimporter'}
                                onClick={() => {
                                    this.installAnotherEbayAccount("ebayimporter");
                                }}
                                primary
                                fullWidth={false}
                            >
                                Link your Account
                            </Button>
                        </div>
                        </div>

                    </Modal.Section>
                </Modal>


                <Modal
                open={this.state.amazonAccountModal}
                onClose= {this.handleChangeModakAmazonModal.bind(this)}
                title="Add Your Another Amazon Account"
                title="Connect Account"
                >
                    <Modal.Section>

                        <Banner title="Note" status="info">
                            <Label>Connect your another amazon account to import it's products also, just give another different account name</Label>
                        </Banner>
                        <div >
                            <TextField
                                label="Account Name"
                                placeholder="Enter Account Name"
                                value={this.state.amazonAccountName}
                                onChange={this.handleChangeAmazonAccount.bind(this)}
                            />

                            <TextField
                                label="*required"
                                placeholder="Enter HArshit Name"
                                value={this.state.amazonAccountName}
                                onChange={this.handleChangeAmazonAccount.bind(this)}
                            />
                            <TextField
                                label="Seller ID"
                                placeholder="Enter Seller ID"
                                value={this.state.amazonAccountName}
                                onChange={this.handleChangeAmazonAccount.bind(this)}
                                label="*required"
                            />
                            <TextField
                                label="Token"
                                placeholder="Enter Token"
                                // helpText= "Enter different account name from previous connected amazon account"
                                value={this.state.amazonAccountName}
                                onChange={this.handleChangeAmazonAccount.bind(this)}
                            />
                            <TextField
                                label="Using FBA for fullfilment"
                                options={'NO'}
                                placeholder={"Choose FBA"}
                                value={this.state.amazonAccountName}
                                onChange={this.handleChangeAmazonAccount.bind(this)}

                            />

                        </div>
                        <div className="row pt-3">
                            <div className="col-12 col-sm-6">
                                {this.additionalInput("amazonimporter")}
                            </div>
                            <div className="col-12 col-sm-6">
                                <Button
                                    // disabled={this.props.success.code === app.code || app['installed'] !==0 && app.code !== 'ebayimporter'}
                                    onClick={() => {
                                        this.installAnotherAmazonAccount("amazonimporter");
                                    }}
                                    primary
                                    fullWidth={false}
                                >
                                    Link your Account
                                </Button>
                            </div>
                        </div>

                    </Modal.Section>
                </Modal>
                {/*Amazon code from origial*/}

                {/*<Page*/}
                {/*        open={this.state.amazonAccountModal}*/}
                {/*        onClose= {this.handleChangeModakAmazonModal.bind(this)}*/}
                {/*        title="Add Your Another Amazon Account"*/}
                {/*    title="Connect Account"*/}
                {/*>*/}
                {/*    <Card>*/}
                {/*        <div className="row p-5">*/}
                {/*            <div className="col-12 mt-4 mb-4">*/}
                {/*                <Banner status="info">*/}
                {/*                    <Heading>*/}
                {/*                        {"Connect "}{"amazonimporter "}*/}
                {/*                        /!*{capitalizeWord(this.state.code) === "amazonimporter"*!/*/}
                {/*                        /!*    ? "Amazon Importer"*!/*/}
                {/*                        /!*    : capitalizeWord(this.state.code)}*!/*/}
                {/*                    </Heading>*/}
                {/*                </Banner>*/}
                {/*            </div>*/}
                {/*            <div className="col-12 mt-1">*/}
                {/*                <div className="row">*/}
                {/*                    {!isUndefined(this.state.schema) &&*/}
                {/*                    this.state.schema.map(field => {*/}
                {/*                        switch (field.type) {*/}
                {/*                            case "select":*/}
                {/*                                return (*/}
                {/*                                    <div*/}
                {/*                                        className="col-12 pt-2 pb-2"*/}
                {/*                                        key={this.state.schema.indexOf(field)}*/}
                {/*                                    >*/}
                {/*                                        <Select*/}
                {/*                                            options={field.options}*/}
                {/*                                            label={field.title}*/}
                {/*                                            placeholder={field.title}*/}
                {/*                                            value={field.value}*/}
                {/*                                            onChange={this.handleChangeAmazonAccount.bind(*/}
                {/*                                                this,*/}
                {/*                                                field.key*/}
                {/*                                            )}*/}
                {/*                                        />*/}
                {/*                                        <p style={{ color: "green" }}>*/}
                {/*                                            {field.required ? "*required" : null}*/}
                {/*                                        </p>*/}
                {/*                                    </div>*/}
                {/*                                );*/}
                {/*                                break;*/}
                {/*                            case "checkbox":*/}
                {/*                                return (*/}
                {/*                                    <div*/}
                {/*                                        className="col-12 pt-2 pb-2"*/}
                {/*                                        key={this.state.schema.indexOf(field)}*/}
                {/*                                    >*/}
                {/*                                        <Label>{field.title}</Label>*/}
                {/*                                        <div className="row">*/}
                {/*                                            {field.options.map(option => {*/}
                {/*                                                return (*/}
                {/*                                                    <div*/}
                {/*                                                        className="col-md-6 col-sm-6 col-12 p-1"*/}
                {/*                                                        key={field.options.indexOf(option)}*/}
                {/*                                                    >*/}
                {/*                                                        <Checkbox*/}
                {/*                                                            checked={*/}
                {/*                                                                field.value.indexOf(option.value) !==*/}
                {/*                                                                -1*/}
                {/*                                                            }*/}
                {/*                                                            label={option.value}*/}
                {/*                                                            onChange={this.handleMultiselectChange.bind(*/}
                {/*                                                                this,*/}
                {/*                                                                this.state.schema.indexOf(field),*/}
                {/*                                                                field.options.indexOf(option)*/}
                {/*                                                            )}*/}
                {/*                                                        />*/}
                {/*                                                    </div>*/}
                {/*                                                );*/}
                {/*                                            })}*/}
                {/*                                        </div>*/}
                {/*                                        <div className="col-12">*/}
                {/*                                            <p style={{ color: "green" }}>*/}
                {/*                                                {field.required ? "*required" : null}*/}
                {/*                                            </p>*/}
                {/*                                        </div>*/}
                {/*                                    </div>*/}
                {/*                                );*/}
                {/*                                break;*/}
                {/*                            default:*/}
                {/*                                return (*/}
                {/*                                    <div*/}
                {/*                                        className="col-12 pt-2 pb-2"*/}
                {/*                                        key={this.state.schema.indexOf(field)}*/}
                {/*                                    >*/}
                {/*                                        <TextField*/}
                {/*                                            label={field.title}*/}
                {/*                                            placeholder={field.title}*/}
                {/*                                            value={field.value}*/}
                {/*                                            onChange={this.handleChangeAmazonAccount.bind(*/}
                {/*                                                this,*/}
                {/*                                                field.key*/}
                {/*                                            )}*/}
                {/*                                        />*/}
                {/*                                        <p style={{ color: "green" }}>*/}
                {/*                                            {field.required ? "*required" : null}*/}
                {/*                                        </p>*/}
                {/*                                    </div>*/}
                {/*                                );*/}
                {/*                                break;*/}
                {/*                        }*/}
                {/*                    })}*/}
                {/*                    <div className="col-12 text-center mt-3">*/}
                {/*                        <Button*/}
                {/*                            onClick={() => {*/}
                {/*                                this.onSubmit();*/}
                {/*                            }}*/}
                {/*                        >*/}
                {/*                            Submit*/}
                {/*                        </Button>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </Card>*/}
                {/*</Page>*/}









                {/*{this.state.apps.map(app => {
                    if (this.validateCode(app.code)) {
                        return (
                            <div
                                className="col-12 col-sm-6 mb-4"
                                key={this.state.apps.indexOf(app)}
                            >
                                <Card title={app.title}>
                                    <div className="row p-5">
                                        <div className="col-12">
                                            <img src={app.image} alt={app.title}
                                                 style={{maxWidth: "100%", height: "160px"}}/>
                                        </div>
                                        <div className="col-12 mt-4 mb-4">
                                            <div className="row">
                                                <div className="col-12 col-sm-6">
                                                    {this.additionalInput(app.code)}
                                                </div>
                                                <div className="col-12 col-sm-6">
                                                    <Button
                                                        // disabled={this.props.success.code === app.code || app['installed'] !==0 && app.code !== 'ebayimporter'}
                                                        onClick={() => {
                                                            this.installApp(app.code);
                                                        }}
                                                        primary
                                                        fullWidth={true}
                                                    >
                                                        {this.props.success.code === app.code ||
                                                        app["installed"] !== 0
                                                            ? "ReConnect"
                                                            : "Link your Account"}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        );
                    }
                })}*/}
                <input
                    type={"hidden"}
                    data-toggle="modal"
                    data-target="#exampleModal"
                    id={"openEtsyHelp"}
                />

                <div
                    className="modal fade"
                    id="exampleModal"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Etsy Help
                                </h5>
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <img
                                    src={require("../../assets/img/etsy_help.png")}
                                    width={"100%"}
                                />
                            </div>
                            {/*<div class="modal-footer">*/}
                            {/*<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>*/}
                            {/*<button type="button" class="btn btn-primary">Save changes</button>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    validateCode = code => {
        return (
            code === "amazonimporter" ||
            code === "ebayimporter" ||
            code === "fba" ||
            code === "walmartimporter" ||
            code === "wishimporter" ||
            code === "etsyimporter" ||
            code === "amazonaffiliate" ||
            code === "ebayaffiliate" ||
            code === "aliexpress"
        );
    };
    additionalInput = code => {
        if (code === "ebayimporter") {
            return (
                <Select
                    options={json.country}
                    value={this.state.ebay_county_code}
                    onChange={this.handleChange.bind(this, "ebay_county_code")}
                    placeholder={"Choose Country"}
                    label={""}
                />
            );
        } else if (code === "etsyimporter") {
            return (
                <TextField
                    label={"Shop Name"}
                    value={this.state.etsy}
                    connectedRight={
                        <span
                            onClick={() => {
                                document.getElementById("openEtsyHelp").click();
                            }}
                        >
							<Tooltip content={"Help"} light={true}>
								<Icon source="help" color="inkLighter" backdrop={true}/>
							</Tooltip>
						</span>
                    }
                    onChange={this.handleChange.bind(this, "etsy")}
                    placeholder={"Etsy Shop Name"}
                    labelHidden={true}
                    readOnly={false}
                />
            );
        }
        // else if (code === "amazonimporter") {
        //     return (
        //         <Select
        //             options={json.country}
        //             value={this.state.amazonAccountName}
        //             // onChange={this.handleChange.bind(this, "ebay_county_code")}
        //             // placeholder={"Choose Amazon"}
        //             // label={""}
        //         />
        //     );
        // }
        return null;
    };

    installAnotherEbayAccount(code){
        if (code === "ebayimporter" && this.state.ebayAccountModal && this.state.ebayAccountName!='') {
            if (this.state.ebay_county_code !== "" && this.state.ebayAccountName!=="") {
                console.log(this.state.ebay_county_code);
                console.log(this.state.ebayAccountName);
                console.log(this.state.ebayAccountModal);
                this.props.redirectResult(code, {
                    code: code,
                    ebay_site_id: this.state.ebay_county_code,
                    another_account:true,
                    account_name_ebay: this.state.ebayAccountName
                });
            } else {
                notify.info("Country is not selected");
            }
        }
    }

    installAnotherAmazonAccount(code){
        console.log('1016 App.js');
        // if (code === "amazonimporter" && this.state.amazonAccountModal && this.state.amazonAccountName!='') {
        //     if (this.state.ebay_county_code !== "" || this.state.amazonAccountName!=="") {
        //         // console.log(this.state.ebay_county_code);
        //         console.log(this.state.amazonAccountName);
        //         // console.log(this.state.ebayAccountModal);
        //         this.props.redirectResult(code, {
        //             code: code,
        //             // ebay_site_id: this.state.ebay_county_code,
        //             another_account:true,
        //             account_name_amazon: this.state.amazonAccountName
        //         });
        //     } else {
        //         notify.info("Country is not selected");
        //     }
        // }
    }

    installApp(code) {

        if (code === "ebayimporter"){
            if (this.state.ebay_county_code !== "") {
                this.props.redirectResult(code, {
                    code: code,
                    ebay_site_id: this.state.ebay_county_code
                });
            } else {
                notify.info("Country is not selected");
            }
        }
        // if (code === "amazonimporter") {
        //     console.log('1046 App.js');
        //     // if (this.state.amazon_county_code !== "") {
        //     // this.props.redirectResult(code, {
        //     //     code: code,
        //     //     ebay_site_id: this.state.ebay_county_code
        //     // });
        // // }
        // //         else {
        // //         notify.info("Country is not selected");
        // //     }
        // }

        // if (code === "ebayimporter") {
        //     if (this.state.ebay_county_code !== "") {
        //         this.props.redirectResult(code, {
        //             code: code,
        //             another_account:false,
        //             ebay_site_id: this.state.ebay_county_code
        //         });
        //     } else {
        //         notify.info("Country is not selected");
        //     }
        // }

        else if (code === "etsyimporter") {
            if (this.state.etsy !== undefined && this.state.etsy !== "") {
                this.props.redirectResult(code, {
                    code: code,
                    shop_name: this.state.etsy
                });
            } else {
                notify.info("Please Provide The Valid Shop Name.");
            }
        } else {
            this.props.redirectResult(code, "");
        }
    }
}

export default AppsShared;
