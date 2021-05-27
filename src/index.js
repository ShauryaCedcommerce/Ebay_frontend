import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.slim.min";
import "popper.js/dist/umd/popper.min";
import "bootstrap/dist/js/bootstrap.min";
import "react-dom/cjs/react-dom.production.min";
import "@shopify/polaris/styles.css";
import "antd/dist/antd.css";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { App } from "./App";
import { ToastContainer } from "react-toastify";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
	<div style={{ height: "100%" }}>
		<BrowserRouter basename="/importer/app">
			<App />
		</BrowserRouter>
		<ToastContainer />
	</div>,
	document.getElementById("root")
);
registerServiceWorker();
