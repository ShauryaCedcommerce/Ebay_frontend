import React, {Component} from "react";
import {
    Card,
    Select,
    Page,
    Banner,
    Label,
    TextStyle,
    Stack,
    Button,
    Tag,
    TextField,
    Scrollable,
    Modal
} from "@shopify/polaris";
import {
    faArrowsAltH,
    faMinus,
    faTimes,
    faPlus,
    faExclamation,
    faCheck
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {notify} from "../../../../services/notify";
import {requests} from "../../../../services/request";

class FileMapping extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openMapping: false,
            mappedObject: this.setValue(),
            canSubmit: false,
            marketPlace: props.location.state["marketplace"]
                ? props.location.state["marketplace"]
                : "default",
            key: props.location.state["key"],
            container_field: this.modifyMappingArray(props.location.state["field"]),
            csv_fields: Object.keys(props.location.state["header"]).map(e => ({
                label: props.location.state["header"][e],
                value: props.location.state["header"][e]
            }))
        };
    }

    setValue() {
        if (this.props.location.state.mapped !== undefined) {
            let mapped = {};
            let propsMapped = this.props.location.state["mapped"];
            Object.keys(propsMapped).forEach(e => {
                mapped[propsMapped[e]["original_value"]] = propsMapped[e]["value"];
            });
            return mapped;
        }
        return {};
    }

    componentDidMount() {
        let addField = [];
        let {mappedObject, container_field} = this.state;
        Object.keys(container_field["non_required"]).forEach(e => {
            if (
                mappedObject[container_field["non_required"][e]["value"]] !== undefined
            )
                addField.push({
                    field: container_field["non_required"],
                    value: container_field["non_required"][e]["value"]
                });
        });
        addField.forEach(e => {
            this.addMoreMappingOption(e["field"], e["value"]);
        });
    }

    renderRequired = arg => {
        return arg.map((e, i) => {
            return (
                <React.Fragment key={i}>
                    <Card title="Required">
                        <div className="row p-4">
                            <div className="col-4">
                                <Stack>
                                    <p className="font-weight-bold">{e.label}</p>
                                    <p style={{color: "red"}}><b>*</b></p>
                                </Stack>
                                {e["help_text"] !== undefined && (
                                    <TextStyle variation="subdued">{e["help_text"]}</TextStyle>
                                )}
                            </div>
                            <div className="col-1">
                                <FontAwesomeIcon icon={faArrowsAltH} size="1x" color="#000"/>
                            </div>
                            <div className="col-4">{this.inCaseType(e)}</div>
                            <div className="col-1 text-center">
                                <FontAwesomeIcon icon={faMinus} size="1x" color="#c7c7c7"/>
                            </div>
                            <div className="col-1 text-center">
                                <FontAwesomeIcon icon={faMinus} size="1x" color="#c7c7c7"/>
                            </div>
                            <div className="col-1 text-center">
                                {this.state.mappedObject[e.value] === undefined ||
                                this.state.mappedObject[e.value].length <= 0 ?
                                    <FontAwesomeIcon
                                        icon={faExclamation}
                                        size="1x"
                                        color="#FF7D4D"
                                    />
                                    :
                                    <FontAwesomeIcon icon={faCheck} size="1x" color="#4fdc35"/>
                                }
                            </div>
                        </div>
                    </Card>
                </React.Fragment>
            );
        });
    };

    renderNonRequired = arg => {
        return (
            <React.Fragment>
                <Card title="Optionals">
                    <div className="row p-4">
                        <div className="col-4">
                            <Select
                                placeholder={"choose to Map"}
                                label={"Mapping With"}
                                labelHidden={true}
                                onChange={this.addMoreMappingOption.bind(
                                    this,
                                    arg["non_required"]
                                )}
                                options={arg["non_required"]}
                            />
                        </div>
                        <div className="col-1">
                            <FontAwesomeIcon icon={faArrowsAltH} size="1x" color="#000"/>
                        </div>
                        <div className="col-4">
                            <Select label={""} disabled={true}/>
                        </div>
                        <div
                            className="col-1 text-center"
                            style={{cursor: "pointer"}}
                            onClick={this.addMoreMappingOption.bind(
                                this,
                                arg["non_required"],
                                undefined
                            )}
                        >
                            <FontAwesomeIcon icon={faPlus} size="1x" color="#162e2f"/>
                        </div>
                        <div className="col-1 text-center">
                            <FontAwesomeIcon icon={faTimes} size="1x" color="#c7c7c7"/>
                        </div>
                    </div>
                </Card>
                {arg["show_non_required"].map((e, i) => {
                    return (
                        <React.Fragment key={i}>
                            <Card>
                                <div className="row p-4">
                                    <div className="col-4 text-center">
                                        <p className="font-weight-bold">{e.label}</p>
                                        {e["help_text"] !== undefined && (
                                            <TextStyle variation="subdued">
                                                {e["help_text"]}
                                            </TextStyle>
                                        )}
                                    </div>
                                    <div className="col-1">
                                        <FontAwesomeIcon
                                            icon={faArrowsAltH}
                                            size="1x"
                                            color="#000"
                                        />
                                    </div>
                                    <div className="col-4">{this.inCaseType(e)}</div>
                                    <div className="col-1 text-center">
                                        <FontAwesomeIcon icon={faPlus} size="1x" color="#c7c7c7"/>
                                    </div>
                                    <div
                                        className="col-1 text-center"
                                        style={{cursor: "pointer"}}
                                        onClick={this.removeMappingOption.bind(this, e, i)}
                                    >
                                        <FontAwesomeIcon icon={faTimes} size="1x" color="#162e2f"/>
                                    </div>
                                    <div className="col-1 text-center">
                                        {this.state.mappedObject[e.value] === undefined ||
                                        this.state.mappedObject[e.value].length <= 0 ? (
                                            <FontAwesomeIcon
                                                icon={faExclamation}
                                                size="1x"
                                                color="#FF7D4D"
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faCheck}
                                                size="1x"
                                                color="#4fdc35"
                                            />
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </React.Fragment>
                    );
                })}
            </React.Fragment>
        );
    };

    inCaseType = arg => {
        console.log(this.state.csv_fields);
        switch (arg.type) {
            case "multi":
                return (
                    <React.Fragment>
                        <Select
                            placeholder={" "}
                            label={"mapped with"}
                            labelInline
                            onChange={this.handleMappingChange.bind(this, arg, arg.value)}
                            options={this.state.csv_fields}
                        />
                        <br />
                        <Scrollable style={{maxHeight: "100px"}}>
                            <Stack spacing="tight">
                                {this.state.mappedObject[arg.value] !== undefined &&
                                Object.keys(this.state.mappedObject[arg.value]).map(
                                    (eve, index) => (
                                        <Tag key={index}
                                             onRemove={this.removeMultiSelected.bind(
                                                 this,
                                                 arg.value,
                                                 this.state.mappedObject[arg.value][eve]
                                             )}
                                        >
                                            {this.state.mappedObject[arg.value][eve]}
                                        </Tag>
                                    )
                                )}
                            </Stack>
                        </Scrollable>
                    </React.Fragment>
                );
            case "select":
                return (
                    <React.Fragment>
                        <Select
                            label={""}
                            labelHidden={true}
                            placeholder={arg.label}
                            value={this.state.mappedObject[arg.value]}
                            onChange={this.handleMappingChange.bind(this, arg, arg.value,)}
                            options={arg["select_options"]}
                        />
                    </React.Fragment>
                );
            default:
                return (
                    <React.Fragment>
                        <Select
                            placeholder={" ?"}
                            label={"mapped with - "}
                            labelInline
                            onChange={this.handleMappingChange.bind(this, arg, arg.value)}
                            value={this.state.mappedObject[arg.value]}
                            options={this.state.csv_fields}
                        />
                    </React.Fragment>
                );
        }
    };

    handleNeedHelpModal = () => {
        this.setState({needHelpModal: !this.state.needHelpModal});
    };

    render() {
        let {container_field} = this.state;
        let buttons = (
            <Stack distribution="trailing" spacing="extraLoose">
                {/*<Select
                 label={"Marketplace"}
                 labelInline
                 options={[
                 { label: "Bonanza", value: "bonanza" },
                 { label: "Morecommerce", value: "morecommerce" },
                 { label: "Default", value: "default" }
                 ]}
                 value={this.state.marketPlace}
                 onChange={e => {
                 this.setState({ marketPlace: e });
                 }}
                 />*/}
                <Button
                    primary
                    onClick={() => {
                        this.setState({canSubmit: this.validateData()});
                    }}
                >
                    Submit
                </Button>
            </Stack>
        );
        return (
            <Page
                title={"Mapping"}
                primaryAction={{
                    content: "Back",
                    onClick: () => {
                        this.redirect("/panel/import");
                    }
                }}
            >
                <Card>
                    <div className="p-5">
                        {this.renderRequired(container_field["required"])}
                        {this.renderNonRequired(container_field)}
                        <br />
                        {buttons}
                    </div>
                </Card>
                <Modal
                    open={this.state.canSubmit}
                    title={"Action"}
                    onClose={() => {
                        this.setState({canSubmit: false});
                    }}
                >
                    <Modal.Section>
                        <Card>
                            <div className="p-5">
                                <Stack spacing="extraLoose" distribution="fill">
                                    <Button
                                        destructive
                                        onClick={() => {
                                            this.setState({canSubmit: false});
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    {/*<Button
                                     onClick={() => {
                                     this.onSubmit(false);
                                     this.redirect("/panel/import");
                                     }}
                                     >
                                     Save
                                     </Button>*/}
                                    <Button
                                        primary
                                        onClick={() => {
                                            this.onSubmit(true);
                                        }}
                                    >
                                        Save & Import
                                    </Button>
                                </Stack>
                            </div>
                        </Card>
                    </Modal.Section>
                </Modal>
                <NeedHelp needHelpModal={this.state.needHelpModal} handleNeedHelpModal={this.handleNeedHelpModal}/>
            </Page>
        );
    }

    handleMappingChange = (obj, key, value) => {
        console.log(obj, key, value);
        let {mappedObject} = this.state;
        switch (obj.type) {
            case "multi":
                if (mappedObject[key] === undefined) mappedObject[key] = [];
                if (mappedObject[key].indexOf(value) === -1)
                    mappedObject[key].push(value);
                break;
            default:
                mappedObject[key] = value;
        }
        this.setState({mappedObject: mappedObject});
    };

    removeMultiSelected = (key, value) => {
        let {mappedObject} = this.state;
        let index = mappedObject[key].indexOf(value);
        mappedObject[key].splice(index, 1);
        this.setState({mappedObject: mappedObject});
    };

    addMoreMappingOption = (arg, value) => {
        let {container_field} = this.state;
        let obj = container_field["show_non_required"];
        if (value !== undefined) {
            arg.forEach((e, index) => {
                if (e.value === value && obj.indexOf(e) === -1) {
                    obj.push(e);
                    container_field["non_required"].splice(index, 1);
                }
            });
        } else if (container_field["non_required"][0] !== undefined) {
            obj.push(container_field["non_required"][0]);
            container_field["non_required"].splice(0, 1);
        } else {
            notify.warn("All Field Are Selected");
        }
        container_field["show_non_required"] = obj;
        this.setState({container_field: container_field});
    };

    removeMappingOption = (arg, index) => {
        let {container_field, mappedObject} = this.state;
        delete mappedObject[arg.value];
        container_field["show_non_required"].splice(index, 1);
        container_field["non_required"].push(arg);
        this.setState({
            container_field: container_field,
            mappedObject: mappedObject
        });
    };

    onSubmit = importNow => {
        if (this.validateData()) {
            let newData = this.changeSubmitData(
                JSON.parse(JSON.stringify(this.state.mappedObject))
            );
            console.log(newData);
            requests
                .postRequest("fileimporter/request/getMapping", {
                    mappedObject: newData,
                    marketplace: this.state.marketPlace
                })
                .then(e => {
                    if (e.success) {
                        if (importNow) {
                            this.importProduct();
                        }
                        notify.success(e.message);
                    } else {
                        notify.error(e.message);
                    }
                });
        } else {
            notify.warn("Please Fill All The Required (*) Field.");
        }
    };

    changeSubmitData(data) {
        let newData = [];
        Object.keys(data).forEach(e => {
            let keys = e.split(".");
            if (keys[1] === undefined) {
                keys[1] = keys[0];
                keys[0] = "";
            }
            newData.push({
                key: keys[1],
                prefix: keys[0],
                value: data[e],
                original_value: e
            });
        });
        return newData;
    }

    modifyMappingArray(arg) {
        let obj = {
            required: [],
            non_required: [],
            show_non_required: []
        };
        Object.keys(arg).forEach(e => {
            arg[e].required
                ? obj["required"].push(arg[e])
                : obj["non_required"].push(arg[e]);
        });
        return obj;
    }

    validateData = () => {
        let {mappedObject, container_field} = this.state;
        let canSubmit = true;
        Object.keys(container_field["required"]).forEach(e => {
            if (mappedObject[container_field["required"][e]["value"]] === undefined) {
                canSubmit = false;
            }
        });
        return canSubmit;
    };

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

    redirect(url) {
        this.props.history.push(url);
    }
}

class NeedHelp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            needHelpModal: props.needHelpModal
        };
    }

    componentWillReceiveProps(nextprops) {
        if (this.state.needHelpModal !== nextprops.needHelpModal) {
            this.setState({
                needHelpModal: nextprops.needHelpModal,
                marketPlace: '',
                message: '',
            });
        }
    }

    closeModal() {
        this.props.handleNeedHelpModal();
    }

    render() {
        return <Modal
            title={"Need help"}
            open={this.state.needHelpModal}
            onClose={() => {
                this.setState({needHelpModal: false});
            }}>
            <Card
                secondaryFooterAction={{
                    content: "cancel", onClick: () => {
                        this.closeModal()
                    }
                }}
                sectioned
                primaryFooterAction={{
                    content: "Submit", onClick: () => {
                        this.needHelp()
                    }
                }}>
                <Banner title="Note" icon="notification" status="info">
                    <Label id="123">
                        One of are support team will contact you within 24 hr.
                    </Label>
                </Banner>
                <TextField
                    label={"MarketPlace"}
                    onChange={(e) => this.handleChange('marketPlace', e)}
                    value={this.state['marketPlace']}
                    readOnly={false}/>
                <TextField
                    label={"Message"}
                    onChange={(e) => this.handleChange('message', e)}
                    readOnly={false}
                    value={this.state['message']}
                />
            </Card>
        </Modal>
    }

    handleChange = (key, value) => {
        this.setState({
            [key]: value
        });
    };

    needHelp = () => {
        if (this.state.marketPlace === "" || this.state.message === "") {
            notify.info("Validation Error: Field's can not be null.");
            return true;
        }
        let sendData = {
            marketPlace: this.state.marketPlace,
            message: this.state.message
        };
        requests.postRequest('fileimporter/request/needHelp', sendData).then(e => {
            if (e.success) {
                notify.success(e.message);
            } else {
                notify.error(e.message);
            }
            this.closeModal();
        });
    };

}

export default FileMapping;
