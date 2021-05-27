import React, { Component } from "react";

class Progress extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className="p-5 row">
				<div className="col-12 d-flex justify-content-center">
					<div className="row">
						<div className="col-12 text-center">
							<h1>404! Page Not Found</h1>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Progress;
