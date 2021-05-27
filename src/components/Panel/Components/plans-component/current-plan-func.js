import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCalendarCheck,
	faCalendarTimes,
	faCogs,
	faHandsHelping,
	faDollarSign,
	faHeadphones,
	faTasks
} from "@fortawesome/free-solid-svg-icons";
import React from "react";

const primaryColor = "#9c27b0";
const warningColor = "#ff9800";
const dangerColor = "#f44336";
const successColor = "#4caf50";
const infoColor = "#00acc1";
const roseColor = "#e91e63";
const grayColor = "#ffffff";

export function displayArray(event) {
	let card_service = [];
	let data = event.activated_at.split(" ");
	event.services.forEach(data => {
		card_service.push({
			text: data.title,
			text_info: "",
			icon: <FontAwesomeIcon icon={faHandsHelping} size="5x" />
		});
	});
	return {
		description: event.description, // lvl 2
		card: [
			// lvl 1
			{
				text: event.title,
				text_info: "Active Plan",
				icon: <FontAwesomeIcon icon={faTasks} size="5x" color={grayColor} />
			},
			{
				text: event.main_price + " $",
				text_info: "Price",
				icon: (
					<FontAwesomeIcon icon={faDollarSign} size="5x" color={grayColor} />
				)
			},
			{
				text: event.validity + " Days ",
				text_info: "validity",
				icon: (
					<FontAwesomeIcon icon={faCalendarTimes} size="5x" color={grayColor} />
				)
			},
			{
				text: data[0],
				text_info: "Plan Started",
				icon: (
					<FontAwesomeIcon icon={faCalendarCheck} size="5x" color={grayColor} />
				)
			}
		],
		card_service: card_service
	};
}
