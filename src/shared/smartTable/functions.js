// Import modules
import flatten from "flat";
import capitalize from "lodash/capitalize";
import isString from "lodash/isString";
import camelCase from "lodash/camelCase";
import filter from "lodash/filter";
import forOwn from "lodash/forOwn";
import isEmpty from "lodash/isEmpty";
import isArray from "lodash/isArray";
import isPlainObject from "lodash/isPlainObject";
import sortBy from "lodash/sortBy";
import reverse from "lodash/reverse";

import { isUndefined } from "util";

export function fetchData(data, key = "data") {
	return new Promise((resolve, reject) => {
		if (Array.isArray(data)) {
			resolve(data);
		} else if (typeof data === "string") {
			fetch(data)
				.then(response => {
					if (
						response.ok ||
						response.status === 200 ||
						response.statusText === "OK"
					) {
						return response.json();
					}
					reject(
						new Error(`${response.status} - ${response.statusText} - ${data}`)
					);
				})
				.then(json => {
					resolve(key ? json[key] : json);
				})
				.catch(reason => reject(reason));
		} else {
			reject(new Error("data type is invalid"));
		}
	});
}

export function capitalizeAll(arr) {
	return arr
		.map(m => (m ? capitalize(m) : ""))
		.join(" ")
		.trim();
}

export function parseHeader(val) {
	if (isString(val)) {
		const toCamelCase = camelCase(val);
		const parser = /^[a-z]+|[A-Z][a-z]*/g;
		return capitalizeAll(toCamelCase.match(parser));
	}
	return "";
}

export function columnObject(key, columnTitles) {
	if (!isUndefined(columnTitles) && !isUndefined(columnTitles[key])) {
		return {
			key,
			title: isUndefined(columnTitles[key])
				? parseHeader(key)
				: columnTitles[key].title,
			visible: true,
			sortable: isUndefined(columnTitles[key])
				? true
				: columnTitles[key].sortable,
			type: isUndefined(columnTitles[key].type)
				? "string"
				: columnTitles[key].type,
			filterable: true
		};
	} else {
		// console.log(columnTitles,key);
	}
}

export function parseDataForColumns(_data, columnTitles) {
	const columns = [];
	if (_data && isArray(_data) && !isEmpty(_data)) {
		const data = _data.filter(row => !!row);
		const firstElemnt = data[0];
		if (isPlainObject(firstElemnt)) {
			const keys = Object.keys(firstElemnt);
			keys.forEach(key => {
				columns.push(columnObject(key, columnTitles));
			});
		}
	}
	return columns;
}

export function getColumnFilters(columns, columnFilters, defaultKey) {
	for (let i = 0; i < columns.length; i++) {
		if (isUndefined(columnFilters[columns[i].key])) {
			if (!isUndefined(columns[i].type) && columns[i].type == "int") {
				columnFilters[columns[i].key] = {
					operator: 1,
					value: ""
				};
			} else {
				columnFilters[columns[i].key] = {
					operator: defaultKey,
					value: ""
				};
			}
		}
	}
	return columnFilters;
}

export function updateColumnVisibility(allColumns, visibleColumns) {
	for (let i = 0; i < allColumns.length; i++) {
		if (!isUndefined(allColumns[i])) {
			if (visibleColumns.indexOf(allColumns[i].key) === -1) {
				allColumns[i].visible = false;
			} else {
				allColumns[i].visible = true;
			}
		}
	}
	return allColumns;
}

export function parseDataForRows(_data) {
	let rows = [];
	if (_data && isArray(_data) && !isEmpty(_data)) {
		const data = _data.filter(row => !!row);
		rows = data.map(row => flatten(row));
	}
	return _data;
}

export function parseCell(val) {
	return val || JSON.stringify(val);
}

export function filterRowsByValue(value, rows) {
	return filter(rows, row => {
		const regex = new RegExp(`.*?${value}.*?`, "i");
		let hasMatch = false;
		forOwn(row, val => {
			hasMatch = hasMatch || regex.test(val);
		});
		return hasMatch;
	});
}

export function filterRows(value, rows) {
	if (!value) {
		return rows;
	}
	return filterRowsByValue(value, rows);
}

export function sliceRowsPerPage(rows, currentPage, perPage) {
	if (perPage && perPage > 0) {
		// const numRows = rows.length
		// const numPages = Math.ceil(numRows / perPage)
		const start = perPage * (currentPage - 1);
		const end = perPage * currentPage;
		return rows.slice(start, end);
	}
	return rows;
}

export function sortData(filterValue, sorting, data) {
	let sortedRows = [];
	if (sorting.dir) {
		if (sorting.dir === "ASC") {
			sortedRows = sortBy(data, [sorting.key]);
		} else {
			sortedRows = reverse(sortBy(data, [sorting.key]));
		}
	} else {
		sortedRows = data.slice(0);
	}
	return filterRows(filterValue, sortedRows);
}
export function columnFilterName(columnTitles, hideFilters) {
	let val = [];
	if (!isUndefined(columnTitles)) {
		if (!isUndefined(hideFilters)) {
			Object.keys(columnTitles).forEach(key => {
				if (hideFilters.indexOf(key) === -1) {
					const type = isUndefined(columnTitles[key].type)
						? "string"
						: columnTitles[key].type;
					val.push({ label: columnTitles[key].title, value: key, type: type });
				}
			});
		} else {
			Object.keys(columnTitles).forEach(key => {
				const type = isUndefined(columnTitles[key].type)
					? "string"
					: columnTitles[key].type;
				val.push({ label: columnTitles[key].title, value: key, type: type });
			});
		}
	}
	return val;
}
