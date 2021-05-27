import React, { Component } from "react";
import Loader from "react-loader-spinner";

import "./loader.css";

export class PageLoader extends Component {
	render() {
		return (
			<div className="overlay">
				<div className="loader-area">
					{/*<img src={require('../assets/img/loader.gif')} height={"120px"}/>*/}
					<Loader
						type={this.props.type}
						color={this.props.color}
						height={this.props.height}
						width={this.props.width}
					/>
				</div>
			</div>
		);
	}
}
