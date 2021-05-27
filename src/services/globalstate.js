import { environment } from "../environments/environment";
import { isUndefined } from "util";

export const globalState = {
	setLocalStorage: (key, value) => {
		// console.log(window);
		sessionStorage.setItem(key, value);
	},
	getLocalStorage: key => {
        // console.log(window);
		return sessionStorage.getItem(key);
	},
	removeLocalStorage: key => {
        // console.log(window);
		return sessionStorage.removeItem(key);
	},
	getBearerToken: () => {
		if (sessionStorage.getItem("user_authenticated") !== "true") {
			return environment.Bearer;
		} else {
			return sessionStorage.getItem("auth_token");
		}
	},
	prepareQuery: params => {
		let queryString = Object.keys(params).length > 0 ? "?" : "";
		let end = "";
		for (let i = 0; i < Object.keys(params).length; i++) {
			let key = params[Object.keys(params)[i]];
			queryString += end + key + "=" + params[key];
			key = "&";
		}
		return queryString;
	},
	log: (msg1, msg2, msg3) => {
		if (!environment.isLive) {
			if (!isUndefined(msg2) && !isUndefined(msg3)) {
				return console.log(msg1, msg2, msg3);
			} else if (!isUndefined(msg2)) {
				return console.log(msg1, msg2);
			} else {
				return console.log(msg1);
			}
		}
	}
};
