import React, { Component } from "react";
import {
	Card,
	Button,
    ButtonGroup,
    ProgressBar
} from "@shopify/polaris";
import { isUndefined } from "util";
import FileUploadProgress  from 'react-fileupload-progress';

import { requests } from "../../../../services/request";
import { notify } from "../../../../services/notify";
import { globalState } from "../../../../services/globalstate";
import { environment } from "../../../../environments/environment";
import { capitalizeWord } from "../static-functions";

const styles = {
    bslabel: {
        display: 'inline-block',
        maxWidth: '100%',
        marginBottom: '5px',
        fontWeight: 700
    },
    bsHelp: {
        display: 'block',
        marginTop: '5px',
        marginBottom: '10px',
        color: '#737373'
    },

    bsButton: {
        fontSize: '12px',
        lineHeight: '1.5',
        borderRadius: '3px',
        color: '#fff',
        backgroundColor: '#337ab7',
        borderColor: '#2e6da4',
        display: 'inline-block',
        padding: '6px 12px',
        marginBottom: 0,
        fontWeight: 400,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        verticalAlign: 'middle',
        touchAction: 'manipulation',
        cursor: 'pointer',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
        backgroundImage: 'none',
        border: '1px solid transparent'
    }
};


class FileImporter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			files: [],
			hasError: false,
			rejectedFiles: [],
			openMapping: false,
			container_field: [],
			csv_fields: [],
			upload_status: false,
			mapping_status: false,
			upload_new: false,
			response: {},
            progress: 0
		};
		console.clear();
		this.status();
	}

	status() {
		requests.getRequest("fileimporter/request/getStatus").then(response => {
            if ( response.success ) {
                if (response.data && !response.data["file_uploaded"]) {
                    this.setState({ upload_status: true });
                } else {
                    this.setState({
                        response: response["data"],
                        mapping_status: true,
                        upload_new: true
                    });
                }
            }
		});
	}

    formGetter(){
        return new FormData(document.getElementById('customForm'));
    }

    customFormRenderer(onSubmit) {
        let mapped = this.state.response["mapped"];
        return (
            <form id='customForm' style={{marginBottom: '15px'}}>
                <label style={styles.bslabel} htmlFor="exampleInputFile">File input</label>
                <input style={{display: 'block'}} type="file" name='file' id="exampleInputFile" />
                <p style={styles.bsHelp}>File Must be in CSV format.</p>
                <ButtonGroup>
                    <Button primary onClick={onSubmit}>
                        Upload
                    </Button>
                    {mapped && <ButtonGroup>
                        <Button
                            primary={mapped !== undefined && mapped["errorFlag"]}
                            onClick={() => {
                                this.redirect("/panel/import/mapping", {
                                    field: this.state.response["field"],
                                    header: this.state.response["header"],
                                    mapped: mapped["mappedObject"],
                                    marketplace: mapped["marketplace"]
                                });
                            }}
                        >
                            {mapped !== undefined && mapped["errorFlag"]
                                ? "Mapping"
                                : "Edit Mapping"}
                        </Button>
                        <Button
                            primary
                            onClick={this.importProduct}
                            disabled={mapped !== undefined && mapped["errorFlag"]}
                        >
                            Import
                        </Button>
                    </ButtonGroup>}
                </ButtonGroup>
            </form>
        );
    }

    importProduct = () => {
        let sendData = {
            marketplace: "fileimporter"
        };
        requests.getRequest("connector/product/import", sendData).then(data => {
            if (data.success === true) {
                setTimeout(() => {
                    this.props.getNecessaryInfo();
                    this.redirect("/panel/queuedtasks");
                }, 1000);
            } else {
                if (data.code === "account_not_connected") {
                    setTimeout(() => {
                        this.redirect("/panel/accounts");
                    }, 1000);
                    notify.info(
                        "User Account Not Found. Please Connect The Account First."
                    );
                }
                if (data.code === "already_in_progress") {
                    setTimeout(() => {
                        this.redirect("/panel/accounts");
                    }, 1000);
                    notify.info(data.message);
                } else {
                    notify.error(data.message);
                }
            }
        });
    };

	render() {
		let url = environment.API_ENDPOINT + 'fileimporter/request/fileUpload?bearer=' + globalState.getLocalStorage('auth_token');
		return (
			<Card sectioned>
                <FileUploadProgress method="POST" key='ex1' url={url}
                                    onProgress={(e, request, progress) => {console.log('progress', e, request, progress);}}
                                    onLoad={ (e, request) => {
                                        this.setState({progress:100});
                                        let response = JSON.parse(request.response);
                                        if ( response.success ) {
                                            this.redirect("/panel/import/mapping", {
                                                field: response["data"]["fields"],
                                                header: response["data"]["header"],
                                                mapped: response["data"]["mapped"]
                                            });
                                        } else {
                                            notify.error(response.message);
                                        }
                                    }}
                                    onError={ (e, request) => {console.log('error', e, request);}}
                                    onAbort={ (e, request) => {console.log('abort', e, request);}}
                                    // progressRenderer={(progress, hasError, cancelHandler) => {
                                    //     // this.setState({progress:progress - 1});
                                    // }}
                                    formGetter={this.formGetter.bind(this)}
                                    formRenderer={this.customFormRenderer.bind(this)}
                />
                {/*{progress !== 0 && <ProgressBar progress={progress}/> }*/}
			</Card>
		);
	}

	redirect(url, data) {
		if (data !== undefined) {
			this.props.history.push(url, data);
		} else this.props.history.push(url);
	}
}

export default FileImporter;
