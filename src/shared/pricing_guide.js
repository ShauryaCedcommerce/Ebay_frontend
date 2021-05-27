import React, { Component } from "react";
import { Card, DisplayText, Label, Modal, TextStyle } from "@shopify/polaris";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft, faQuoteRight } from "@fortawesome/free-solid-svg-icons";

class PricingGuide extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false
		};
	}

	renderOneTime = () => {
		return (
			<Card>
				<div
					className="row p-5"
					style={{ backgroundColor: "#5765c17a", height: "150px" }}
				>
					<div className="col-12 col-sm-2 text-center text-sm-left">
						<FontAwesomeIcon icon={faQuoteLeft} size="2x" color={"#4a4a4a"} />
					</div>
					<div className="col-12 col-sm-8 text-center">
						<span style={{ fontSize: "15px", color: "#1a1a1a" }}>
							<b>I only want to import products on Shopify</b>
						</span>
					</div>
					<div className="col-12 col-sm-2 text-center text-sm-right">
						<FontAwesomeIcon icon={faQuoteRight} size="2x" color={"#4a4a4a"} />
					</div>
				</div>
				<div className="ml-5 mr-5">
					<hr style={{ backgroundColor: "#c7c7c7" }} />
				</div>
				<div className="p-5">
					<Label id={"2"}>
						<p className="mt-4">Say, you got 15010 products to Import</p>
					</Label>
					<Label id={"3"}>
						<ul className="mt-4">
							<li>10 products are free to check your listing.</li>
							<li>Afterwards, pricing is $0.1 per product</li>
							<li>So, one-time estimated charge will be :-</li>
						</ul>
					</Label>
					<div className="text-center m-5">
						<DisplayText size="medium">15000*0.1 = $300</DisplayText>
					</div>
					<div className="mt-5">
						<TextStyle>
							Depending upon the no.of products, you will be getting a discount of up to 80%
						</TextStyle>
					</div>
					<div className="m-sm-5 p-sm-5 m-0 p-0">
						<img
							src={"https://apps.cedcommerce.com/importer/image_one_time.png"}
							onClick={() => {
								this.handleImageShow(
									"https://apps.cedcommerce.com/importer/image_one_time.png"
								);
							}}
							alt={"image here"}
							width={"100%"}
						/>
						<Label id={"3"}>
							<TextStyle variation="subdued">
								*Click on Image to Enlarge
							</TextStyle>
						</Label>
					</div>
				</div>
			</Card>
		);
	};

	renderSync = () => {
		return (
			<Card>
				<div
					className="row p-5"
					style={{ backgroundColor: "#5765c17a", minHeight: "150px" }}
				>
					<div className="col-12 col-sm-2 text-center text-sm-left">
						<FontAwesomeIcon icon={faQuoteLeft} size="2x" color={"#4a4a4a"} />
					</div>
					<div className="col-12 col-sm-8 text-center">
						<span style={{ fontSize: "15px", color: "#1a1a1a" }}>
							<b>
								I want Import products on Shopify + keep my inventory price
								synced with Marketplace
							</b>
						</span>
					</div>
					<div className="col-12 col-sm-2 text-center text-sm-right">
						<FontAwesomeIcon icon={faQuoteRight} size="2x" color={"#4a4a4a"} />
					</div>
				</div>
				<div className="ml-5 mr-5">
					<hr style={{ backgroundColor: "#c7c7c7" }} />
				</div>
				<div className="p-5">
					<Label id={"2"}>
						<p className="mt-4">Say, you got 15010 products to Import</p>
					</Label>
					<Label id={"3"}>
						<ul className="mt-4">
							<li>10 products are free to check your listing.</li>
							<li>Afterwards, pricing is $0.1 per product</li>
							<li>So, one-time estimated charge will be :-</li>
						</ul>
					</Label>
					<div className="text-center m-5">
						<DisplayText size="medium">15000*0.1 = $300</DisplayText>
					</div>
					<div className="mt-5">
						<TextStyle>
							To Sync Inventory and price of Uploaded products, you have to pay
							monthly charge for sync.
						</TextStyle>
					</div>
					<div className="mt-5">
						<TextStyle>e.g :- $29 (valid upto 10,000 products).</TextStyle>
					</div>
					{/*<div className="text-center m-5">*/}
					{/*<DisplayText size="medium">$45 + $29 = $74 </DisplayText>*/}
					{/*</div>*/}
					<div className="m-sm-5 p-sm-5 m-0 p-0">
						<img
							src={"https://apps.cedcommerce.com/importer/one_time.png"}
							onClick={() => {
								this.handleImageShow(
									"https://apps.cedcommerce.com/importer/sync.png"
								);
							}}
							alt={"image here"}
							width={"100%"}
						/>
						<Label id={"3"}>
							<TextStyle variation="subdued">
								*Click on Image to Enlarge
							</TextStyle>
						</Label>
					</div>
					{/*<div className="mt-5">*/}
					{/*<TextStyle variation="strong">while choosing recurring, how often will i get charges?</TextStyle>*/}
					{/*</div>*/}
					{/*<div className="mb-5">*/}
					{/*<TextStyle>Recurring is manage by Shopify ,and will charge every 30 day (Plan Lifetime)</TextStyle>*/}
					{/*</div>*/}
					{/*<div className="mt-5">*/}
					{/*<TextStyle variation="strong">why pay recurring when i already paid for import charges?</TextStyle>*/}
					{/*</div>*/}
					{/*<div className="mb-5">*/}
					{/*<TextStyle>One time payment is required to upload products on shopify, but to sync price and inventory daily.</TextStyle>*/}
					{/*</div>*/}
				</div>
			</Card>
		);
	};

	render() {
		return (
			<React.Fragment>
				{/*<Card>*/}
				<div className="mt-5 guide-plan">{this.renderOneTime()}</div>
				<div style={{ float: "left", width: "2%" }}>
					<div
						className="w-100 d-flex justify-content-center"
						style={{ marginTop: "80px" }}
					>
						<div
							className={"d-none d-sm-block"}
							style={{
								paddingTop: "100px",
								marginBottom: "100px",
								height: "500px",
								borderRadius: "20px",
								backgroundColor: "#8e8e8e",
								width: "2px"
							}}
						/>
					</div>
				</div>
				<div className="mt-5 guide-plan">{this.renderSync()}</div>
				{/*</Card>*/}
				<Modal
					open={this.state.open}
					onClose={() => {
						this.setState({ open: false });
					}}
					title={"Image"}
					large
				>
					<Modal.Section>
						<img src={this.state.image} width={"100%"} />
					</Modal.Section>
				</Modal>
			</React.Fragment>
		);
	}

	handleImageShow = image => {
		this.setState({ open: true, image: image });
	};
}

export default PricingGuide;
