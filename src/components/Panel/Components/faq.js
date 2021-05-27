import React, {Component} from "react";
import {
    Page,
    Stack,
    Button,
    Card,
    Collapsible,
    Banner,
    ResourceList,
    Modal,
    TextContainer,
    Tabs,
    Thumbnail,
    TextStyle,
    Label,
    Heading,
} from "@shopify/polaris";
import {faArrowsAltH} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {globalState} from "../../../services/globalstate";

class FAQPage extends Component {
    constructor(props) {
        super(props);
        this.modalOpen = this.modalOpen.bind(this); // modal function
        this.state = {
            modal: false, // modal show/hide
            selected: 0,
            search: "", // search
            noSearchFound: [1],
            faq: [
                {
                    id: 1,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "How do I send my items from Amazon to Shopify and make sure that my stocks are in sync?",
                    ans: (
                        <React.Fragment>
                            <p>

                                With the Multichannel Importer app, you can send your products from the Amazon seller
                                center to

                                your Shopify store. The process of transferring an item is very simple. Please see the
                                following points-</p>
                            <ol>
                                <li>Go to the Import/Upload section.</li>
                                <li>Click on Import Products. All the products will be listed on the app. You can see
                                    the
                                    products in the Products section.
                                </li>
                                <li>Then you can select and upload or bulk upload, depending on the seller’s
                                    requirement.
                                </li>
                            </ol>
                        </React.Fragment>
                    )
                },

                {
                    id: 2,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "How to upload products through Profiling?",
                    ans: (
                        <React.Fragment>
                            <p>
                                To create a profile, follow the steps:
                            </p>
                            <ol>
                                <li>Go to PROFILING Section.</li>
                                <li>Click on CREATE PROFILE.</li>
                                <li>Enter a profile name and select the source.</li>
                                <li>Now, click - <b>save and move to the next step.</b></li>
                                <li>Select the Target Location and Category.</li>
                                <li>Select the attributes, enter the filter value and click CREATE PROFILE.
                                    Then go to Import/Upload section.
                                </li>
                                <li>Click on Upload products and select the Custom Profile.</li>
                            </ol>
                        </React.Fragment>
                    )
                },

                {
                    id: 3,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "What is the difference between Custom and Default Profile?",
                    ans: (
                        <React.Fragment>
                            <p>
                                If you choose the Default Profile while uploading the products on Shopify, we will list
                                the products on your Shopify store. In the case of a Custom Profile, you can categorize
                                the products on the basis of product quantity, vendor, type, country, etc. and upload
                                the grouped products to Shopify.

                                Using this, you can also list your products in Shopify’s specific collection(s).
                            </p>
                        </React.Fragment>
                    )
                },


                {
                    id: 4,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div

                    ques: "Does Multichannel Importer handle my product information?",
                    ans: (
                        <React.Fragment>
                            <p>
                                Yes. Along with the main products, the app helps you fetch all the variation of the
                                products, with their description, images, price, inventory, etc.
                            </p>
                        </React.Fragment>
                    )
                },
                {
                    id: 5,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "My products are imported from Amazon to the app. What's next?",
                    ans: (
                        <React.Fragment>
                            <p>
                                Now, you can upload your products to Shopify from Import/Upload section in 3 different
                                ways:
                            </p>
                            <ol>
                                <li>Bulk Upload</li>
                                <li>Select and Upload</li>
                                <li>Through Profiling</li>
                            </ol>
                        </React.Fragment>
                    )
                },


                {
                    id: 6,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "How to connect my Amazon account to Shopify store?",
                    ans: (
                        <React.Fragment>
                            <p>
                                You can connect your Amazon account to the app by following these steps:
                            </p>
                            <ol>
                                <li>Go to the <b>Accounts</b> section.</li>
                                <li>Click on the <b>Link your Account</b> button in the Amazon section and enter the
                                    correct
                                    credentials to connect to the app.
                                </li>
                                <br/>
                                For further assistance, you can see the HELP PDF option.
                            </ol>
                        </React.Fragment>
                    )
                },

                {
                    id: 7,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "Why I am getting the error “Failed to import from Amazon. InvalidParameterValue”?",
                    ans: (
                        <React.Fragment>
                            <p>
                                This error message shows if the wrong credentials are entered while connecting Amazon
                                account. Follow the steps given below to reconnect Amazon account
                                <br/>
                            </p>
                            <ol>
                                <li>Go to Accounts section</li>
                                <li>Click Reconnect.</li>
                                <li>Select the country(where your Amazon account is)
                                    Enter your details like Seller Id and Token etc.
                                </li>
                                <li>Click on submit button.</li>
                            </ol>
                        </React.Fragment>
                    )
                },


                {
                    id: 8,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "How to upload products from app to my Shopify store?",
                    ans: (
                        <React.Fragment>
                            <p>
                                Steps to upload the products from app to the Shopify store:
                            </p>
                            <ol>
                                <li>Go to the Import/Upload section.</li>
                                <li>Select the Upload Products option.</li>
                                <li>Or go to the ‘Products’ section for uploading the selected products.</li>
                            </ol>
                        </React.Fragment>
                    )
                },


                {
                    id: 9,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "What is a profile and how it is used?",
                    ans: (
                        <React.Fragment>
                            <p>
                                A profile refers to a group of products created on the basis of product quantity, title,
                                country or price.
                            </p>
                            <ol>
                                <li>Go to Profiling section.</li>
                                <li>Click on <b>Create Profile</b></li>
                                <li>Enter Profile Name (ANY)</li>
                                <li>Enter Product source</li>
                                <li>Select the Target House (warehouse)</li>
                                <li>Select the attribute on the basis you want to create a profile</li>
                                <li>Now, from the Import/Upload section, upload products by choosing the Custom
                                    profile.
                                </li>
                            </ol>
                        </React.Fragment>
                    )
                },


                {
                    id: 10,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "Stuck on product Import/Upload process. What to do?",
                    ans: (
                        <React.Fragment>
                            <p>
                                To import products go to - <b>Import/Upload</b> section
                                <br/>
                                <b>Import Products:</b> It helps to get the products from the source marketplace (from
                                where you want to bring products) to the app.
                                <b>Upload Products:</b> It helps to upload products from the app to Shopify. This can be
                                done in 3 ways:
                            </p>
                            <ol>
                                <li><b>Bulk Upload:</b> Go to Import/Upload section. Then, click on Upload Products and
                                    select the Default Profile.
                                </li>
                                <li><b>Select and Upload:</b> Go to the Products section. Select the products you want
                                    to upload.
                                </li>
                            </ol>
                        </React.Fragment>
                    )
                },


                {
                    id: 11,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "How to re-connect my Amazon account?",
                    ans: (
                        <React.Fragment>
                            <p>
                                To reconnect your account, follow these steps:
                            </p>
                            <ol>
                                <li>Go to the Accounts section.</li>
                                <li>Go to Amazon marketplace and click on reconnect option.</li>
                                <li>Enter the correct credentials, click on Submit Button, your account will be
                                    automatically connected to the Amazon marketplace.
                                </li>
                            </ol>
                            <b>For further assistance, you can see the HELP PDF</b>
                        </React.Fragment>
                    )
                },

                {
                    id: 12,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "Can I upload selected products on Shopify?",
                    ans: (
                        <React.Fragment>
                            <p>
                                Yes, you can upload selected products on Shopify by following the steps given below:
                            </p>
                            <ol>
                                <li>Go to the Products section.</li>
                                <li>Select the products you want to upload( you can apply various filters such as- SKU,
                                    title, price, and quantity).
                                </li>
                                <li>After selecting, click on ACTIONS and select Upload.</li>
                                <li>Selected products will be uploaded on Shopify.</li>
                            </ol>
                        </React.Fragment>
                    )
                },

                {
                    id: 13,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "Product Import Process Failed: Walmart Refused Report Access, Kindly Try Later”, why am I getting this error?",
                    ans: (
                        <React.Fragment>
                            <p>
                                This error may be caused due to any of the following cases:
                                <br/>
                                <b>CASE 1:</b> The details of the Walmart seller panel that you have provided may be
                                wrong. So
                                kindly reconnect your Walmart account by following the steps:
                                <br/>
                                <ol>
                                    <li>Go to the Accounts section.</li>
                                    <li>Go to Walmart marketplace and click on reconnect option.</li>
                                    <li>Enter the correct credentials, click on Submit Button, your app panel will be
                                        automatically connected to the Walmart marketplace.
                                    </li>
                                    <li>For further assistance, you can see the HELP PDF</li>
                                </ol>

                                <b>CASE 2:</b> Please try again later, it may be happening because we didn’t get a
                                proper
                                response from Walmart.
                            </p>
                        </React.Fragment>
                    )
                },


                {
                    id: 14,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "Why can’t I see my products on Shopify despite the successful Product Import?",
                    ans: (
                        <React.Fragment>
                            <p>
                                To make products visible on Shopify you have to upload it from App to your Shopify
                                store.
                                <br/>
                                Kindly Refer Ques “Stuck on product import/upload process?” to know how to upload
                                products.

                            </p>
                        </React.Fragment>
                    )
                },


                {
                    id: 15,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "While I import products from the marketplace, will they be auto-created on my Shopify store?",
                    ans: (
                        <React.Fragment>
                            <p>
                                No. When a product is imported from the selected marketplace, it will only be listed on
                                the app. To see the product on your Shopify store, you must upload them from the
                                Import/Upload section.
                                <br/>
                                Refer the following FAQ to know more:
                            </p>
                        </React.Fragment>
                    )
                },

                {
                    id: 16,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "How to manually create your Shopify orders on FBA?",
                    ans: (
                        <React.Fragment>
                            <p>
                                Go to the Settings section, and follow these steps:
                            </p>
                            <ol>
                                <li>Go to the FBA settings.</li>
                                <li>Go to the option "Want to create order manually"</li>
                                <li>Click on it.</li>
                                <li>Select the option '"YES".</li>
                                <li>Now go to FBA section of the app</li>
                                <li>Click "Create" for the orders you want to create manually</li>
                            </ol>
                            <b>Now, your selected orders are created on FBA.</b>
                        </React.Fragment>
                    )
                },


                {
                    id: 17,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "Will the app sync my inventory from marketplaces (like Walmart, eBay, Etsy, Amazon, or Wish) to the Shopify store?",
                    ans: (
                        <React.Fragment>
                            <p>
                                Yes, you can sync your inventory from marketplace to Shopify. For this, you need to
                                choose the monthly plans as per your no.of products.
                            </p>
                        </React.Fragment>
                    )
                },


                {
                    id: 18,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "If I changed any field like title or description then, how can I update my product information on Shopify?",
                    ans: (
                        <React.Fragment>
                            <ol>
                                <li>Go to the Settings section on the app.</li>
                                <li>In Shopify settings, enable the manual sync, and select the fields you want to
                                    update.
                                    Save the changes.
                                </li>
                                <li>Now, again import and upload the products from Import/Upload section.</li>

                            </ol>
                        </React.Fragment>
                    )
                },

                {
                    id: 19,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: 'What to do while getting the error, “Failed to import from eBay. Account not found!"',
                    ans: (
                        <React.Fragment>
                            <p>
                                This error means that the wrong credentials have been entered. To fix this, you should
                                try to reconnect your eBay account. To reconnect, follow the steps given below:
                            </p>
                            <ol>
                                <li>Go to the Accounts section.</li>
                                <li>Select the country.</li>
                                <li>Click reconnect.</li>
                                <li>Enter the credentials and get connected to the app.</li>
                            </ol>
                        </React.Fragment>
                    )
                },

                {
                    id: 20,
                    show: false, // for collapse div
                    search: true, // for search, if false then hide the div
                    ques: "How to map your Shopify shipping speed category with the FBA shipping speed category?",
                    ans: (
                        <React.Fragment>
                            <p>
                                Go to the Settings section of the app, and follow the steps:
                            </p>
                            <ol>
                                <li>Go to the FBA section.</li>
                                <li>Click on the "Manage Shipping Speed Categpry".</li>
                                <li>And Map the Shopify and FBA shipping categories.</li>
                            </ol>
                        </React.Fragment>
                    )
                },

                /*  {
                 id: 21,
                 show: false, // for collapse div
                 search: true, // for search, if false then hide the div
                 ques: "What is profiling?",
                 ans: (
                 <React.Fragment>
                 <p>
                 You can upload the product to Shopify by creating a profile on the basis of several
                 grounds (such as quantity, title, country or price, etc). For uploading profile:
                 </p>
                 <ol>
                 <li>Go to Import/Upload section.</li>
                 <li>Click on Upload Product.</li>
                 <li>Select the Product source.</li>
                 <li>Then, select the Custom profile in “Upload through” option.</li>
                 <li>Click on Upload Products.</li>
                 </ol>
                 </React.Fragment>
                 )
                 },*/


            ]
        };
        if (!globalState.getLocalStorage("auth_token")) {
            this.props.disableHeader(false);
        } else {
            this.props.disableHeader(true);
        }
    }

    handleSearch() {
        try {
            let value = this.state.faq;
            let flag = 0;
            if (this.state.search.length >= 2) {
                value.forEach(data => {
                    const text = data.ques.toLowerCase();
                    if (text.search(this.state.search) === -1) {
                        data.search = false;
                    } else {
                        data.search = true;
                        flag = 1;
                    }
                });
            } else {
                value.forEach(data => {
                    data.search = true;
                    flag = 1;
                });
            }
            if (flag === 0) {
                this.setState({noSearchFound: []});
            } else {
                this.setState({noSearchFound: [1]});
            }
            this.setState({faq: value});
        } catch (e) {
        }
    }

    renderFAQ() {
        return (
            <div className="row">
                {this.state.faq.map(data => {
                    return (
                        <React.Fragment key={data.id}>
                            {data.search ? (
                                <div className="col-sm-6 col-12 mb-3">
                                    <div
                                        style={{cursor: "pointer"}}
                                        onClick={this.handleToggleClick.bind(this, data)}
                                    >
                                        <Banner title={data.ques} icon="view" status="attention">
                                            {/*<div className="pt-5">*/}
                                            {/*<Stack vertical>*/}
                                            {/*<div className=" mb-2">*/}
                                            {/*<h3>{data.ques}</h3>*/}
                                            {/*</div>*/}
                                            {/*</Stack>*/}
                                            {/*</div>*/}
                                        </Banner>
                                    </div>
                                    <Collapsible open={data.show} id={data.id}>
                                        <div className="p-3">
                                            <Banner title="Answer" status="info">
                                                <h4>{data.ans}</h4>
                                            </Banner>
                                        </div>
                                    </Collapsible>
                                </div>
                            ) : null}
                        </React.Fragment>
                    );
                })}
            </div>
        )

    }

    renderPDFNamaste() {
        return(
            <div className="row">
            <div className="col-6 col-sm-6 mb-4"
            onClick={() => {
                window.open(
                    "http://apps.cedcommerce.com/importer/amazon_UK_IN.pdf"
                );
            }}>
                <Card title="Amazon Account Help Pdf">
                    <div className="col-12">
                            {<img src="https://importer.sellernext.com/marketplace-logos/amazon.png" alt="amazon"
                                  style={{maxWidth: "80PX", height: "80px"}}/>}
                        </div>
                </Card>
            </div>
                <div className="col-6 col-sm-6 mb-4"
                     onClick={() => {
                         window.open(
                             "http://apps.cedcommerce.com/importer/ebaydropshippingImporter.pdf"
                         );
                     }}>
                    <Card title="Ebay Dropshipping Help Pdf">
                        <div className="col-12">
                            {<img src="https://importer.sellernext.com/marketplace-logos/ebayLogoCA.png" alt="ebay"
                                  style={{maxWidth: "80PX", height: "80px"}}/>}
                        </div>
                    </Card>
                </div>
                <div className="col-6 col-sm-6 mb-4"
                     onClick={() => {
                         window.open(
                             "http://apps.cedcommerce.com/importer/WorkingofAliexpressDropshippingMultichannelImporterapp.pdf"
                         );
                     }}>
                    <Card title="AliExpress Help Pdf">
                        <div className="col-12">
                            {<img src="https://importer.sellernext.com/marketplace-logos/aliexpress.jpg" alt="ebay"
                                  style={{maxWidth: "80PX", height: "80px"}}/>}
                        </div>
                    </Card>
                </div>
            </div>
        )
    }


    renderPDF() {
        return (
            <Card>
                <ResourceList
                        items={[
                            {
                                url: 'http://apps.cedcommerce.com/importer/amazon_UK_IN.pdf',
                                name: 'Amazon Help PDF',
                                description: 'You can use this PDF to guide yourself for connecting your amazon account to import products.',
                                media: (
                                    <Thumbnail
                                        source="https://importer.sellernext.com/marketplace-logos/pdfIcon.png"
                                        alt="Amazon logo"
                                    />
                                ),
                            },
                            {
                                url: 'http://apps.cedcommerce.com/importer/ebaydropshippingImporter.pdf',
                                name: 'Ebay Dropshipping Help PDF',
                                description: 'You can use this PDF to import products by Ebay Dropshipping.',
                                media: (
                                    <Thumbnail
                                        source="https://importer.sellernext.com/marketplace-logos/pdfIcon.png"
                                        alt="Ebay logo"
                                    />
                                ),
                            },
                            {
                                url: 'http://apps.cedcommerce.com/importer/WorkingofAliexpressDropshippingMultichannelImporterapp.pdf',
                                name: 'AliExpress Dropshipping Help PDF',
                                description: 'You can use this PDF to import products by AliExpress Dropshipping.',
                                media: (
                                    <Thumbnail
                                        source="https://importer.sellernext.com/marketplace-logos/pdfIcon.png"
                                        alt="Ali logo"
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
                </Card>
        );
    }

    renderVideoGif() {
        return(
            <div className="justify-content-center">
                <Heading>Store Development</Heading>
                <div className="text-right p-3"
                     onClick={() => {
                         this.redirect("/panel/help/report")}}>
                    <img
                        style={{'cursor': 'pointer'}}
                        className='img-fluid p-3'
                        src={require("../../../assets/img/DigitalMarketing3.gif")} alt="Store Development"
                        /*height="650" width="650"*//>
                </div>
            </div>
        )
    }

    handleTabChange = (selectedTabIndex) => {
        this.setState({selected: selectedTabIndex});
    };


    render() {

        const {selected} = this.state;
        const tabs = [
            {
                id: 'FAQ',
                content: 'FAQ',
                accessibilityLabel: 'FAQ',
                panelID: 'FAQ',
            },
            {
                id: 'PDF',
                content: 'PDF',
                accessibilityLabel: 'PDF',
                panelID: 'PDF',
            },
            // {
            //     id: 'Videos/Gif',
            //     content: 'Videos/Gif',
            //     panelID: 'Videos/Gif',
            // },
        ];

        return (
            <Page
                title="Help"
                primaryAction={{
                    content: "Contact Us",
                    onClick: () => {
                        this.redirect("/panel/help/report");
                    }
                }}
            >
                <div className="col-12">
                    <Card>
                        <Tabs tabs={tabs} selected={selected} onSelect={this.handleTabChange}/>
                        <Card.Section>
                            {selected === 0 ? this.renderFAQ() : selected === 1 ? this.renderPDF() : this.renderVideoGif()}
                        </Card.Section>
                    </Card>
                </div>
                {/*<div className="col-12 mt-5">*/}
                {/*<div className="text-center mt-5">*/}
                {/*<h3><b>Contact Us- </b></h3>*/}
                {/*<h5><b>Email id-</b> apps@cedcommerce.com</h5>*/}
                {/*<h5><b>Phone Number-</b>(+1) 888-882-0953</h5>*/}
                {/*</div>*/}
                {/*</div>*/}
                {/*<Modal*/}
                {/*open={this.state.modal}*/}
                {/*title="Default Profile Example"*/}
                {/*onClose={this.modalOpen}*/}
                {/*>*/}
                {/*<Modal.Section>*/}
                {/*<TextContainer>*/}
                {/*<h2>Google Attribute Mapping Are Something Like this: </h2>*/}
                {/*<h4>*/}
                {/*<ul>*/}
                {/*<li className="mb-3">*/}
                {/*'title'{" "}*/}
                {/*<FontAwesomeIcon*/}
                {/*icon={faArrowsAltH}*/}
                {/*size="1x"*/}
                {/*color="#000"*/}
                {/*/>{" "}*/}
                {/*'title*/}
                {/*</li>*/}
                {/*<li className="mb-3">*/}
                {/*'description'{" "}*/}
                {/*<FontAwesomeIcon*/}
                {/*icon={faArrowsAltH}*/}
                {/*size="1x"*/}
                {/*color="#000"*/}
                {/*/>{" "}*/}
                {/*'long_description'*/}
                {/*</li>*/}
                {/*<li className="mb-3">*/}
                {/*'price'{" "}*/}
                {/*<FontAwesomeIcon*/}
                {/*icon={faArrowsAltH}*/}
                {/*size="1x"*/}
                {/*color="#000"*/}
                {/*/>{" "}*/}
                {/*'price'*/}
                {/*</li>*/}
                {/*<li className="mb-3">*/}
                {/*'link'{" "}*/}
                {/*<FontAwesomeIcon*/}
                {/*icon={faArrowsAltH}*/}
                {/*size="1x"*/}
                {/*color="#000"*/}
                {/*/>{" "}*/}
                {/*Your Product Link{" "}*/}
                {/*</li>*/}
                {/*<li className="mb-3">*/}
                {/*'brand'{" "}*/}
                {/*<FontAwesomeIcon*/}
                {/*icon={faArrowsAltH}*/}
                {/*size="1x"*/}
                {/*color="#000"*/}
                {/*/>{" "}*/}
                {/*'vendor'*/}
                {/*</li>*/}
                {/*<li className="mb-3">*/}
                {/*'image_link'{" "}*/}
                {/*<FontAwesomeIcon*/}
                {/*icon={faArrowsAltH}*/}
                {/*size="1x"*/}
                {/*color="#000"*/}
                {/*/>{" "}*/}
                {/*'main_image'*/}
                {/*</li>*/}
                {/*<li className="mb-3">*/}
                {/*'main_image'{" "}*/}
                {/*<FontAwesomeIcon*/}
                {/*icon={faArrowsAltH}*/}
                {/*size="1x"*/}
                {/*color="#000"*/}
                {/*/>{" "}*/}
                {/*'container_id'*/}
                {/*</li>*/}
                {/*<li className="mb-3">*/}
                {/*'gtin'{" "}*/}
                {/*<FontAwesomeIcon*/}
                {/*icon={faArrowsAltH}*/}
                {/*size="1x"*/}
                {/*color="#000"*/}
                {/*/>{" "}*/}
                {/*'bar_code'*/}
                {/*</li>*/}
                {/*<li className="mb-3">*/}
                {/*'mpn'{" "}*/}
                {/*<FontAwesomeIcon*/}
                {/*icon={faArrowsAltH}*/}
                {/*size="1x"*/}
                {/*color="#000"*/}
                {/*/>{" "}*/}
                {/*'sku'*/}
                {/*</li>*/}
                {/*</ul>*/}
                {/*</h4>*/}
                {/*</TextContainer>*/}
                {/*</Modal.Section>*/}
                {/*</Modal>*/}
            </Page>
        );
    }

    handleToggleClick = event => {
        let data = this.state.faq;
        data.forEach(key => {
            if (key.id === event.id) {
                key.show = !key.show;
            }
        });
        this.setState({
            faq: data
        });
    };

    modalOpen() {
        this.setState({
            modal: !this.state.modal
        });
    }

    redirect(url) {
        this.props.history.push(url);
    }
}
export default FAQPage;