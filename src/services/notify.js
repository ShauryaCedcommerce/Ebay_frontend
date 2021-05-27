import { toast } from "react-toastify";
import { css } from "glamor";

export const notify = {
	success: msg => {
		toast(msg, {
			hideProgressBar: true,
			type: "success",
			bodyClassName: css({
				fontSize: "14px"
			}),
			position: toast.POSITION.BOTTOM_CENTER
		});
	},
	error: msg => {
		toast(msg, {
			hideProgressBar: true,
			type: "error",
			bodyClassName: css({
				fontSize: "14px"
			}),
			position: toast.POSITION.BOTTOM_CENTER
		});
	},
	warn: msg => {
		toast(msg, {
			hideProgressBar: true,
			type: "warning",
			bodyClassName: css({
				fontSize: "14px"
			}),
			position: toast.POSITION.BOTTOM_CENTER
		});
	},
	info: msg => {
		toast(msg, {
			hideProgressBar: true,
			type: "info",
			bodyClassName: css({
				fontSize: "14px"
			}),
			position: toast.POSITION.BOTTOM_CENTER
		});
	}
	/*This Is Toasty Notifation*/
};
