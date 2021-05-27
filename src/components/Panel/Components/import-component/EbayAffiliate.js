import React, { Component } from 'react';
import {
    Card,
    Collapsible,
    DisplayText,
    Icon,
    Label,
    ResourceList,Pagination, Select,
    Filters,
    ChoiceList,
    TextField,
    Button,
    Scrollable,
    Stack,
} from '@shopify/polaris';
import { CaretDownMinor } from '@shopify/polaris-icons';
import { isUndefined } from 'util';
import { json } from '../../../../environments/static-json';
import { requests } from '../../../../services/request';
import { notify } from '../../../../services/notify';
import SmartDataTable from '../../../../shared/smartTable';
import { paginationShow } from '../static-functions';

class EbayAffiliate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsible : {
                search_div: false,
                itemId:false,
                url : false,
            },
            itemID: '',
            url: '',
            filter: {
                queryValue: '',
                select_country: [],
                ListingType: ['FixedPrice'],
                Condition: ['New'],
            },
        };
        this.redirect = this.redirect.bind(this);
    }

    handleToggleClick = (key) => {
        this.setState(state => {
            state.collapsible[key] = !state.collapsible[key];
            return state;
        });
    };

    render() {
        const {
            select_country,
            ListingType,
            Condition,
            queryValue,
        } = this.state.filter;
        const filters = [
            {
                key: 'select_country',
                label: 'Country',
                filter: (
                    <ChoiceList
                        title={'Account status'}
                        titleHidden
                        choices={json.ebay_Country}
                        selected={select_country}
                        onChange={this.handleChange('select_country')}
                    />
                ),
                shortcut: true,
            },
            {
                key: 'ListingType',
                label: 'Listing Type',
                filter: (
                    <ChoiceList
                        title={'Listing Type'}
                        titleHidden
                        choices={json.listing_type}
                        selected={ListingType}
                        onChange={this.handleChange('ListingType')}
                    />
                ),
                shortcut: true,
            },
            {
                key: 'Condition',
                label: 'Condition',
                filter: (
                    <ChoiceList
                        title={'Condition'}
                        titleHidden
                        choices={json.condition}
                        selected={Condition}
                        onChange={this.handleChange('Condition')}
                    />
                ),
            },
        ];
        const appliedFilters = Object.keys(this.state.filter)
            .filter(key => !isEmpty(this.state.filter[key]) && key !== 'queryValue')
            .map(key => {
                return {
                    key,
                    label: disambiguateLabel(key, this.state.filter[key]),
                    onRemove: this.handleRemove,
                };
            });
        return (
            <Card sectioned>
                <br/>
                <br/>
                <Stack vertical={'true'}>
                    <div className="col-12">
                        <div className="row collapsible-ebay pt-4" style={{ cursor: 'pointer' }} onClick={this.handleToggleClick.bind(this,'itemId')}>
                            <div className="col-11 pl-4 ">
                                <DisplayText size="small">Item ID</DisplayText>
                            </div>
                            <div className="col-1 text-right">
                                <Icon source={CaretDownMinor} />
                            </div>
                             <div className="col-12 mt-3">
                                <hr />
                            </div>
                        </div>
                        <Collapsible open={this.state.collapsible.itemId} id="itemId">
                            <Card sectioned title="Search Using Item ID">
                                <TextField
                                    label=""
                                    clearButton
                                    onClearButtonClick={() => {this.setState({itemID:''})}}
                                    onChange={(value) => {this.setState({itemID:value.trim()});}}
                                    labelHidden value={this.state.itemID}
                                    helpText={"For Multiple add comma ',' between them e.g. : 156748416168,15645643134"}
                                    readOnly={false}/>
                                <br/>
                                <Button disabled={this.state.itemID.trim() === ''} primary onClick={() => {
                                    let sendData = {
                                        'itemID': this.state.itemID,
                                        'code': 'itemID'
                                    };
                                    this.importProducts(sendData);
                                }}>Import Now</Button>
                            </Card>
                        </Collapsible>
                    </div>
                </Stack>
                <Stack vertical={'true'}>
                    <div className="col-12">
                        <div className="row collapsible-ebay pt-4" style={{ cursor: 'pointer' }} onClick={this.handleToggleClick.bind(this,'url')}>
                            <div className="col-11 pl-4 ">
                                <DisplayText size="small">URL</DisplayText>
                            </div>
                            <div
                                className="col-1 text-right"
                                children={<Icon source={CaretDownMinor} />}
                            />
                             <div className="col-12 mt-3">
                                <hr />
                            </div>
                        </div>
                        <Collapsible open={this.state.collapsible.url} id="url">
                            <Card sectioned title="Search Using URL">
                                <TextField
                                    label=""
                                    clearButton
                                    onClearButtonClick={() => {this.setState({url:''})}}
                                    onChange={(value) => {this.setState({url:value.trim()});}}
                                    labelHidden value={this.state.url}
                                    helpText={"For Multiple add comma ',' between them e.g. : https://ebay.com***,https://ebay.com***"}
                                    readOnly={false}/>
                                <br/>
                                <Button disabled={this.state.url.trim() === ''} primary onClick={() => {
                                    let sendData = {
                                        'url': this.state.url,
                                        'code': 'url'
                                    };
                                    this.importProducts(sendData);
                                }}>Import Now</Button>
                            </Card>
                        </Collapsible>
                    </div>
                </Stack>
                <Stack vertical={'true'}>
                    <div className="col-12">
                        <div className="row collapsible-ebay pt-4" style={{ cursor: 'pointer' }} onClick={this.handleToggleClick.bind(this,'search_div')}>
                            <div className="col-11">
                                <DisplayText size="small">Search</DisplayText>
                            </div>
                            <div className="col-1 text-right">
                                <Icon source={CaretDownMinor} />
                            </div>
                            <div className="col-12 mt-3">
                                <hr />
                            </div>
                        </div>
                        <Collapsible open={this.state.collapsible.search_div} id="ggg">
                            <Card>
                                <ResourceList
                                    resourceName={{
                                        singular: 'product',
                                        plural: 'products',
                                    }}
                                    filterControl={
                                        <Filters
                                            queryValue={queryValue}
                                            filters={filters}
                                            appliedFilters={appliedFilters}
                                            onQueryChange={this.handleChange('queryValue')}
                                            onQueryClear={this.handleQueryClear}
                                            onClearAll={this.handleClearAll}
                                        />
                                    }
                                    items={[{}, {}]}
                                    renderItem={item => {}}
                                />
                                <RenderSearchGrid filter={this.state.filter} redirect={this.redirect}/>
                            </Card>
                        </Collapsible>
                    </div>
                </Stack>
            </Card>
        );
    }

    importProducts = (sendData) => {
        if ( !isEmpty(this.state.filter.select_country) ) {
            sendData['global_id'] = this.state.filter.select_country[0];
        }
        requests
            .postRequest('ebayaffiliate/request/importProduct', sendData)
            .then(data => {
               if ( data.success ) {
                    notify.success(data.message);
                    if ( data.code && data.code == 'move_to_activity_section' ) {
                        this.props.redirect('/panel/queuedtasks')
                    }
               } else {
                    notify.error(data.message);
               }
            });
    }

    handleChange = key => value => {
        this.setState(state => {
            state.filter[key] = value;
            return state;
        });
    };

    handleQueryClear = () => {
        this.setState(state => {
            state.filter['queryValue'] = '';
            return state;
        });
    };

    handleRemove = (key) => {
        console.log(key);
        this.setState(state => {
            console.log(state.filter);
            state.filter[key] = '';
            return state;
        });
    };

    handleClearAll = () => {
        this.setState(state => {
            Object.keys(state.filter)
                .filter(key => !isEmpty(this.state.filter[key]) && key !== 'queryValue')
                .forEach(key => {
                state.filter[key] = '';
            });
            return state;
        });
    };

    redirect(url) {
        this.props.history.push(url);
    } 
}

function isEmpty(value) {
    if (Array.isArray(value)) {
        return value.length === 0;
    } else {
        return value === '' || value == null;
    }
}

function disambiguateLabel(key, value) {
    switch (key) {
        case 'Condition':
            return `${value[0]} Condition`;
        case 'ListingType':
            return `Listing Type ${value}`;
        case 'select_country':
            return `Selected Country ${value}`;
        default:
            return value;
    }
}

export default EbayAffiliate;

class RenderSearchGrid extends Component {
    columnTitles = {
        main_image: {
            title: 'Image',
            sortable: false,
            type: 'image',
        },
        itemId: {
            title: 'ItemId',
            sortable: false,
            type: 'string',
        },
        product_title: {
            title: 'Title',
            sortable: false,
            type: 'string',
        },
        global_id: {
            title: 'Global ID',
            sortable: false,
            type: 'string',
        },
        price: {
            title: 'Price',
            type: 'string',
            sortable: false,
        },
        selling_status: {
            title: 'Selling Status',
            sortable: false,
        },
        import : {
            title: 'Import Now',
            sortable: false,
            label:'Import',
            id : 'import',
            type: 'button',
        },
        productUrl:{
            title:'Product URL',
            sortable:false,
            label:'Show',
            id:'productUrl',
            type:'button'
        }
    };
    visibleColumns = [
        'main_image',
        'product_title',
        'global_id',
        'price',
        'import',
        'productUrl'
    ];
    gridSettings = {
        count: '10',
        activePage: 1,
    };
    pageLimits = [
        { label: 10, value: "10" },
        { label: 20, value: "20" },
        { label: 30, value: "30" },
    ];
    massActions = [{ label: "Import All", value: "import" }];
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            filter: {
                queryValue: '',
                select_country: [],
                ListingType: ['FixedPrice'],
                Condition: ['New'],
            },
            pagination: {
                entriesPerPage: 0,
                pageNumber: 0,
                totalEntries: 0,
                totalPages: 0,
            },
            selectedProducts: []
        };
        this.paginationRender = this.paginationRender.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.filter) {
            this.setState({ filter: nextProps.filter });
        }
    }

    operations = (event, id,data) => {
        switch(id) {
            case 'import' : 
            let sendData = {'itemID' : data['itemId']};
            this.importProducts(sendData);break;
            case 'productUrl':
                window.open(event);
            default :  console.log(event,  id,data);
        }
    };

    redirect(url, data) {
        if (!isUndefined(data)) {
            this.props.history.push(url, JSON.parse(JSON.stringify(data)));
        } else {
            this.props.history.push(url);
        }
    }

    importProducts = (sendData) => {
        if ( !isEmpty(this.state.filter.select_country) ) {
            sendData['global_id'] = this.state.filter.select_country[0];
        }
        requests
            .postRequest('ebayaffiliate/request/importProduct', sendData)
            .then(data => {
               if ( data.success ) {
                    notify.success(data.message);
                    if ( data.code && data.code == 'move_to_activity_section' ) {
                        this.props.redirect('/panel/queuedtasks')
                    } else {
                        this.setState((state, props) => {
                            Object.keys(state.products).forEach(pKey => {
                                if ( state.products[pKey]['itemId'] == sendData['itemID'] )
                                     state.products[pKey]['import'] = 'disable_button';
                            })
                            return state;
                        });
                    }
               } else {
                    notify.error(data.message);
               }
            });
    }

    render() {
        let { pagination } = this.state;
        return (
            <div className="col-12">
                <div className="p-sm-3 p-0">
                    <Stack>
                        <Stack.Item fill>
                            <Button
                                primary={true}
                                loading={this.state.button_loader}
                                onClick={this.onClickSearch}
                            >
                                Search
                            </Button>
                        </Stack.Item>
                        <Stack.Item >
                            <div style={{height:"10px"}}/>
                            {pagination.entriesPerPage > 0 &&
                            <Label>
                                Showing <b>{ pagination.entriesPerPage }</b> items from page <b>{ pagination.pageNumber }</b>, Total items <b>{ pagination.totalEntries }</b>
                            </Label>}
                        </Stack.Item>
                        {/*<Stack.Item >
                            {pagination.entriesPerPage > 0 && this.paginationRender(false)}
                        </Stack.Item>*/}
                    </Stack>
                </div>

                <SmartDataTable
                    data={this.state.products}
                    uniqueKey="itemId"
                    showLoaderBar={this.state.showLoaderBar}
                    count={this.gridSettings.count}
                    activePage={this.gridSettings.activePage}
                    columnTitles={this.columnTitles}
                    operations={this.operations} //button
                    selected={this.state.selectedProducts}
                    className="ui compact selectable table"
                    withLinks={true}
                    multiSelect={true}
                    visibleColumns={this.visibleColumns}
                    actions={this.massActions}
                    rowActions={{
                        edit: false,
                        delete: false,
                    }}
                    getVisibleColumns={event => {
                        this.visibleColumns = event;
                    }}
                    userRowSelect={event => {
                        console.log(event);
                        const itemIndex = this.state.selectedProducts.indexOf(
                            event.data.itemId,
                        );
                        if (event.isSelected) {
                            if (itemIndex === -1) {
                                this.setState((state, props) => {
                                    state.selectedProducts.push(event.data.itemId);
                                    return state;
                                });
                            }
                        } else {
                            if (itemIndex !== -1) {
                                 this.setState((state, props) => {
                                   state.selectedProducts.splice(itemIndex, 1);
                                    return state;
                                });
                            }
                        }
                    }}
                    allRowSelected={(event, rows) => {
                        let data = this.state.selectedProducts.slice(0);
                        if (event) {
                            for (let i = 0; i < rows.length; i++) {
                                const itemIndex = this.state.selectedProducts.indexOf(
                                    rows[i].itemId,
                                );
                                if (itemIndex === -1) {
                                    data.push(rows[i].itemId);
                                }
                            }
                        } else {
                            for (let i = 0; i < rows.length; i++) {
                                if (data.indexOf(rows[i].itemId) !== -1) {
                                    data.splice(data.indexOf(rows[i].itemId), 1);
                                }
                            }
                        }
                        this.setState({ selectedProducts: data });
                    }}
                    massAction={event => {
                        switch (event) {
                            case 'import':
                                let sendData = {
                                    'itemID' : this.state.selectedProducts.join(),
                                    'code' : 'ItemID'
                                };

                                this.importProducts(sendData);

                                 // this.handleSelectedUpload('profile')
                                break;
                                case 'productUrl':
                                    window.open(event['productUrl'])
                                    console.log("abcd = ",event['productUrl']);
                                    break;
                             default:
                                console.log(event, this.state.selectedProducts);
                        }
                    }}
                    sortable
                />
                <br/>
                {this.paginationRender()}
                <br/>
            </div>
        );
    }

    paginationRender(showDropdown = true) {
        return(

        <div className="row">
                    <div className="col-6 text-right">
                        <Scrollable shadow style={{ height: '100px' }} horizontal={true}>
                        <Pagination
                            hasPrevious={1 < this.gridSettings.activePage}
                            onPrevious={() => {
                                if (1 < this.gridSettings.activePage) {
                                    this.gridSettings.activePage--;
                                    this.onClickSearch();
                                }
                            }}
                            hasNext={
                                this.state.totalPage / this.gridSettings.count >
                                this.gridSettings.activePage
                            }
                            nextKeys={[39]}
                            previousKeys={[37]}
                            previousTooltip="use Right Arrow"
                            nextTooltip="use Left Arrow"
                            onNext={() => {
                                if (
                                    this.state.totalPage / this.gridSettings.count >
                                    this.gridSettings.activePage
                                ) {
                                    this.gridSettings.activePage++;
                                    this.onClickSearch();
                                }
                            }}
                        />
                        </Scrollable>
                    </div>
                    {showDropdown && <div className="col-md-2 col-sm-2 col-6">
                        <Select
                            options={this.pageLimits}
                            value={this.gridSettings.count}
                            onChange={this.pageSettingsChange.bind(this)}
                            label={""}
                            labelHidden={true}
                        />
                    </div>}
                </div>
        );
    }

    pageSettingsChange(event) {
        this.gridSettings.count = event;
        this.gridSettings.activePage = 1;
        this.onClickSearch();
    }

    onClickSearch = () => {
        this.setState({
            button_loader: true
        });
        let search_key = this.state.filter.queryValue;
        let country_globalId = this.state.filter.select_country;
        let page = this.gridSettings.count;
        let count = this.gridSettings.activePage;
        if ( isEmpty(search_key) ) {
            notify.info('Search field cannot be empty');
            this.setState({button_loader: false});
            return true;
        }

        let data = {
            keyword: search_key,
            page: this.gridSettings.activePage,
            count: this.gridSettings.count,
            global_id: country_globalId[0],
            itemFilter: Object.keys(this.state.filter)
                .filter(
                    key =>
                        !isEmpty(this.state.filter[key]) &&
                        key !== 'queryValue' &&
                        key !== 'select_country',
                )
                .map(key => {
                    return {
                        name: key,
                        value: this.state.filter[key][0],
                    };
                }),
        };

        requests
            .postRequest('ebayaffiliate/request/getProducts', data, false, true)
            .then(data => {
                if (data.success && data.items) {
                    window.showGridLoader = false;
                    this.setState({
                        totalPage: data.pagination.totalPages,
                        tempProductData: data.items,
                    });
                    this.setState((state, props) => {
                        Object.keys(state.pagination).forEach(keyMain => {
                            state.pagination[keyMain] = parseInt(data.pagination[keyMain]);
                        })
                        return state;
                    });
                    this.setState({
                        products: this.modifyProductsData(data.items),
                        showLoaderBar: !data.success,
                        hideLoader: data.success,
                        pagination_show: data.pagination.entriesPerPage,
                    });
                    // notify.success("Show");
                } else {
                    this.setState({
                        showLoaderBar: false,
                        hideLoader: true,
                        pagination_show: paginationShow(0, 0, 0, false),
                    });
                    window.showGridLoader = false;
                    setTimeout(() => {
                        window.handleOutOfControlLoader = true;
                    }, 3000);
                    notify.error("Not Found !!" + data.messge);
                }
                this.setState({
                    button_loader: false,
                });
            });
    };

    modifyProductsData(data) {
        this.setState({
            pagination_show: data.length,
        });
        let products = [];
        for (let i = 0; i < data.length; i++) {
            let rowData = {};
            if (data !== {} && !isUndefined(data)) {
                rowData['main_image'] = data[i]['galleryURL'];
                rowData['itemId'] = data[i]['itemId'];
                rowData['product_title'] = data[i]['title'];
                rowData['global_id'] = data[i]['globalId'];
                rowData['price'] = data[i]['sellingStatus']['convertedCurrentPrice']['_value'];
                rowData['selling_status'] = data[i]['sellingStatus']['sellingState'];
                rowData['import'] =  'Import';
                rowData['productUrl'] = data[i]['viewItemURL'];
            }
            products.push(rowData);
        }
        return products;
    }

}
// export default EbayAffiliate;