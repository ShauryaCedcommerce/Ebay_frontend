import { isUndefined } from "util";
/********************************  Array Is prepared Here  *************************************************/
export function dataGrids(result, manageService) {
	let data = [];
	result.forEach(value => {
		data.push({
			id: value.plan_id,
			validity_display: checkValidity(value.validity),
			validity: value.validity,
			title: value.title,
			description: value.description,
			connectors: value.connectors,
			main_price: checkValue(
				value.custom_price,
				value.discount_type,
				value.discount,
				value.services_groups,
				manageService,
				value.plan_id
			),
			const_main_price: checkValue(
				value.custom_price,
				value.discount_type,
				value.discount,
				value.services_groups,
				manageService,
				value.plan_id
			),
			discount: value.discount,
			originalValue:
				value.custom_price !== ""
					? value.custom_price
					: checkIfNull(value.services_groups),
			services: createServices(value.services_groups)
		});
	});
	return data;
}
function checkValue(main, type, disc, service, manageService, id) {
	if (main !== 0 && main !== "" && main !== undefined && main !== null) {
		if (type === "Fixed") {
			return main - disc;
		} else {
			return ((100 - disc) * main) / 100;
		}
	} else {
		let price = 0;
		let temp = [];
		Object.keys(service).map(keys => {
			Object.keys(service[keys].services).map(key1 => {
				if (
					service[keys].services[key1].charge_type.toLowerCase() === "prepaid"
				) {
					if (manageService !== null) {
						manageService.forEach(e => {
							if (
								e.code === service[keys].services[key1].code &&
								e.isSelected &&
								temp.indexOf(e.code) === -1 &&
								id === e.key
							) {
								temp.push(e.code);
								price =
									price +
									parseInt(service[keys].services[key1].prepaid.fixed_price) +
									parseInt(service[keys].services[key1].service_charge);
							}
						});
					}
					// else {
					//     price = price + parseInt(service[keys].services[key1].prepaid.fixed_price) + parseInt(service[keys].services[key1].service_charge);
					// }
				}
			});
		});
		if (type === "Fixed") {
			return price - disc;
		} else {
			return ((100 - disc) * price) / 100;
		}
	}
}
function createServices(result) {
	// let service = [];
	// result.forEach(data => {
	//     const title = data.title;
	//     const description = data.description;
	//
	// });
	return result;
}
function checkValidity(data) {
	if (data <= "30" && data >= "28") {
		return "/month";
	} else if (data === "365" || data === "366") {
		return "/annual";
	}
	if (data === "180") {
		return "/6 month";
	}
}
function checkIfNull(service) {
	let price = 0;
	Object.keys(service).map(keys => {
		Object.keys(service[keys].services).map(key1 => {
			if (service[keys].services[key1].charge_type.toLowerCase() === "prepaid")
				price =
					price +
					parseInt(service[keys].services[key1].prepaid.fixed_price) +
					parseInt(service[keys].services[key1].service_charge);
		});
	});
	return price;
}
/*************************  Remove unselected Services  *******************************************/
export function RemoveService(arg, service) {
	let val = [];
	let arg2 = JSON.stringify(arg);
	arg2 = JSON.parse(arg2);
	arg2.services.forEach(value => {
		value.services.forEach((data, index) => {
			service.forEach(serv => {
				if (data.code === serv.code) {
					if (serv.isSelected) {
						let flag = 0;
						val.forEach(val => {
							if (val.code === serv.code) {
								flag = 1;
							}
						});
						if (flag === 0) {
							val.push(data);
						}
					}
				}
			});
			if (data.required === 1) {
				if (data.required === 1) {
					let flag = 0;
					val.forEach(val => {
						if (val.code === data.code) {
							flag = 1;
						}
					});
					if (flag === 0) {
						val.push(data);
					}
				}
			}
		});
	});
	arg2.services = val;
	return arg2;
}
/***************************  manage MarketPlace price Plan   *************************************/
export function marketPlacePricingPlan(arg, plan) {
	let trueCases = 0;
	Object.keys(arg).forEach(e => {
		if (arg[e].isSelected) {
			trueCases++;
		}
	});
	plan.forEach(e => {
		e.main_price = e.const_main_price;
	});
	if (trueCases > 1) {
		plan.forEach(e => {
			e.main_price = parseInt(
				((e.main_price * 70) / 100) * (trueCases - 1) + e.const_main_price
			);
		});
	}
	return plan;
}
