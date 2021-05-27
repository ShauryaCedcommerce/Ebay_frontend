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
    Stack,
} from '@shopify/polaris';
import { CaretDownMinor } from '@shopify/polaris-icons';
import { isUndefined } from 'util';
import { json } from '../../../../environments/static-json';
import { requests } from '../../../../services/request';
import { notify } from '../../../../services/notify';
import SmartDataTable from '../../../../shared/smartTable';
import { paginationShow } from '../static-functions';

class AliExpress extends Component {

    constructor(props) {
        super(props);
        console.log(props);

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
                product_url: '',
                product_id: '',
                category: '',
                pricefrom: '',
                priceto: '',
                feedfrom: '',
                feedto: '',
                soldfrom: '',
                soldto: '',
                select_country: [],
                Categories: [],
                // Currency: '',
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
            Categories,
            queryValue,
            // Currency
        } = this.state.filter;
        const filters = [
            {
                key: 'select_country',
                label: 'Country',
                filter: (
                    <ChoiceList
                        title={'Account status'}
                        titleHidden
                        choices={[{value:'AF',label:'AFGHANISTAN'},
                            {value:'AL',label:'ALBANIA'},
                            {value:'DZ',label:'ALGERIA'},
                            {value:'AS',label:'AMERICAN SAMOA'},
                            {value:'AD',label:'ANDORRA'},
                            {value:'AO',label:'ANGOLA'},
                            {value:'AI',label:'ANGUILLA'},
                            {value:'AQ',label:'ANTARCTICA'},
                            {value:'AG',label:'ANTIGUA AND BARBUDA'},
                            {value:'AR',label:'ARGENTINA'},
                            {value:'AM',label:'ARMENIA'},
                            {value:'AW',label:'ARUBA'},
                            {value:'AU',label:'AUSTRALIA'},
                            {value:'AT',label:'AUSTRIA'},
                            {value:'AZ',label:'AZERBAIJAN'},
                            {value:'BS',label:'BAHAMAS'},
                            {value:'BH',label:'BAHRAIN'},
                            {value:'BD',label:'BANGLADESH'},
                            {value:'BB',label:'BARBADOS'},
                            {value:'BY',label:'BELARUS'},
                            {value:'BE',label:'BELGIUM'},
                            {value:'BZ',label:'BELIZE'},
                            {value:'BJ',label:'BENIN'},
                            {value:'BM',label:'BERMUDA'},
                            {value:'BT',label:'BHUTAN'},
                            {value:'BO',label:'BOLIVIA'},
                            {value:'BA',label:'BOSNIA AND HERZEGOVINA'},
                            {value:'BW',label:'BOTSWANA'},
                            {value:'BV',label:'BOUVET ISLAND'},
                            {value:'BR',label:'BRAZIL'},
                            {value:'IO',label:'BRITISH INDIAN OCEAN TERRITORY'},
                            {value:'BN',label:'BRUNEI DARUSSALAM'},
                            {value:'BG',label:'BULGARIA'},
                            {value:'BF',label:'BURKINA FASO'},
                            {value:'BI',label:'BURUNDI'},
                            {value:'KH',label:'CAMBODIA'},
                            {value:'CM',label:'CAMEROON'},
                            {value:'CA',label:'CANADA'},
                            {value:'CV',label:'CAPE VERDE'},
                            {value:'KY',label:'CAYMAN ISLANDS'},
                            {value:'CF',label:'CENTRAL AFRICAN REPUBLIC'},
                            {value:'TD',label:'CHAD'},
                            {value:'CL',label:'CHILE'},
                            {value:'CN',label:'CHINA'},
                            {value:'CX',label:'CHRISTMAS ISLAND'},
                            {value:'CC',label:'COCOS (KEELING) ISLANDS'},
                            {value:'CO',label:'COLOMBIA'},
                            {value:'KM',label:'COMOROS'},
                            {value:'CG',label:'CONGO'},
                            {value:'CD',label:'CONGO, THE DEMOCRATIC REPUBLIC OF THE'},
                            {value:'CK',label:'COOK ISLANDS'},
                            {value:'CR',label:'COSTA RICA'},
                            {value:'CI',label:'COTE D IVOIRE'},
                            {value:'HR',label:'CROATIA'},
                            {value:'CU',label:'CUBA'},
                            {value:'CY',label:'CYPRUS'},
                            {value:'CZ',label:'CZECH REPUBLIC'},
                            {value:'DK',label:'DENMARK'},
                            {value:'DJ',label:'DJIBOUTI'},
                            {value:'DM',label:'DOMINICA'},
                            {value:'DO',label:'DOMINICAN REPUBLIC'},
                            {value:'TP',label:'EAST TIMOR'},
                            {value:'EC',label:'ECUADOR'},
                            {value:'EG',label:'EGYPT'},
                            {value:'SV',label:'EL SALVADOR'},
                            {value:'GQ',label:'EQUATORIAL GUINEA'},
                            {value:'ER',label:'ERITREA'},
                            {value:'EE',label:'ESTONIA'},
                            {value:'ET',label:'ETHIOPIA'},
                            {value:'FK',label:'FALKLAND ISLANDS (MALVINAS)'},
                            {value:'FO',label:'FAROE ISLANDS'},
                            {value:'FJ',label:'FIJI'},
                            {value:'FI',label:'FINLAND'},
                            {value:'FR',label:'FRANCE'},
                            {value:'GF',label:'FRENCH GUIANA'},
                            {value:'PF',label:'FRENCH POLYNESIA'},
                            {value:'TF',label:'FRENCH SOUTHERN TERRITORIES'},
                            {value:'GA',label:'GABON'},
                            {value:'GM',label:'GAMBIA'},
                            {value:'GE',label:'GEORGIA'},
                            {value:'DE',label:'GERMANY'},
                            {value:'GH',label:'GHANA'},
                            {value:'GI',label:'GIBRALTAR'},
                            {value:'GR',label:'GREECE'},
                            {value:'GL',label:'GREENLAND'},
                            {value:'GD',label:'GRENADA'},
                            {value:'GP',label:'GUADELOUPE'},
                            {value:'GU',label:'GUAM'},
                            {value:'GT',label:'GUATEMALA'},
                            {value:'GN',label:'GUINEA'},
                            {value:'GW',label:'GUINEA-BISSAU'},
                            {value:'GY',label:'GUYANA'},
                            {value:'HT',label:'HAITI'},
                            {value:'HM',label:'HEARD ISLAND AND MCDONALD ISLANDS'},
                            {value:'VA',label:'HOLY SEE (VATICAN CITY STATE)'},
                            {value:'HN',label:'HONDURAS'},
                            {value:'HK',label:'HONG KONG'},
                            {value:'HU',label:'HUNGARY'},
                            {value:'IS',label:'ICELAND'},
                            {value:'IN',label:'INDIA'},
                            {value:'ID',label:'INDONESIA'},
                            {value:'IR',label:'IRAN, ISLAMIC REPUBLIC OF'},
                            {value:'IQ',label:'IRAQ'},
                            {value:'IE',label:'IRELAND'},
                            {value:'IL',label:'ISRAEL'},
                            {value:'IT',label:'ITALY'},
                            {value:'JM',label:'JAMAICA'},
                            {value:'JP',label:'JAPAN'},
                            {value:'JO',label:'JORDAN'},
                            {value:'KZ',label:'KAZAKSTAN'},
                            {value:'KE',label:'KENYA'},
                            {value:'KI',label:'KIRIBATI'},
                            {value:'KP',label:'KOREA DEMOCRATIC PEOPLES REPUBLIC OF'},
                            {value:'KR',label:'KOREA REPUBLIC OF'},
                            {value:'KW',label:'KUWAIT'},
                            {value:'KG',label:'KYRGYZSTAN'},
                            {value:'LA',label:'LAO PEOPLES DEMOCRATIC REPUBLIC'},
                            {value:'LV',label:'LATVIA'},
                            {value:'LB',label:'LEBANON'},
                            {value:'LS',label:'LESOTHO'},
                            {value:'LR',label:'LIBERIA'},
                            {value:'LY',label:'LIBYAN ARAB JAMAHIRIYA'},
                            {value:'LI',label:'LIECHTENSTEIN'},
                            {value:'LT',label:'LITHUANIA'},
                            {value:'LU',label:'LUXEMBOURG'},
                            {value:'MO',label:'MACAU'},
                            {value:'MK',label:'MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF'},
                            {value:'MG',label:'MADAGASCAR'},
                            {value:'MW',label:'MALAWI'},
                            {value:'MY',label:'MALAYSIA'},
                            {value:'MV',label:'MALDIVES'},
                            {value:'ML',label:'MALI'},
                            {value:'MT',label:'MALTA'},
                            {value:'MH',label:'MARSHALL ISLANDS'},
                            {value:'MQ',label:'MARTINIQUE'},
                            {value:'MR',label:'MAURITANIA'},
                            {value:'MU',label:'MAURITIUS'},
                            {value:'YT',label:'MAYOTTE'},
                            {value:'MX',label:'MEXICO'},
                            {value:'FM',label:'MICRONESIA, FEDERATED STATES OF'},
                            {value:'MD',label:'MOLDOVA, REPUBLIC OF'},
                            {value:'MC',label:'MONACO'},
                            {value:'MN',label:'MONGOLIA'},
                            {value:'MS',label:'MONTSERRAT'},
                            {value:'MA',label:'MOROCCO'},
                            {value:'MZ',label:'MOZAMBIQUE'},
                            {value:'MM',label:'MYANMAR'},
                            {value:'NA',label:'NAMIBIA'},
                            {value:'NR',label:'NAURU'},
                            {value:'NP',label:'NEPAL'},
                            {value:'NL',label:'NETHERLANDS'},
                            {value:'AN',label:'NETHERLANDS ANTILLES'},
                            {value:'NC',label:'NEW CALEDONIA'},
                            {value:'NZ',label:'NEW ZEALAND'},
                            {value:'NI',label:'NICARAGUA'},
                            {value:'NE',label:'NIGER'},
                            {value:'NG',label:'NIGERIA'},
                            {value:'NU',label:'NIUE'},
                            {value:'NF',label:'NORFOLK ISLAND'},
                            {value:'MP',label:'NORTHERN MARIANA ISLANDS'},
                            {value:'NO',label:'NORWAY'},
                            {value:'OM',label:'OMAN'},
                            {value:'PK',label:'PAKISTAN'},
                            {value:'PW',label:'PALAU'},
                            {value:'PS',label:'PALESTINIAN TERRITORY, OCCUPIED'},
                            {value:'PA',label:'PANAMA'},
                            {value:'PG',label:'PAPUA NEW GUINEA'},
                            {value:'PY',label:'PARAGUAY'},
                            {value:'PE',label:'PERU'},
                            {value:'PH',label:'PHILIPPINES'},
                            {value:'PN',label:'PITCAIRN'},
                            {value:'PL',label:'POLAND'},
                            {value:'PT',label:'PORTUGAL'},
                            {value:'PR',label:'PUERTO RICO'},
                            {value:'QA',label:'QATAR'},
                            {value:'RE',label:'REUNION'},
                            {value:'RO',label:'ROMANIA'},
                            {value:'RU',label:'RUSSIAN FEDERATION'},
                            {value:'RW',label:'RWANDA'},
                            {value:'SH',label:'SAINT HELENA'},
                            {value:'KN',label:'SAINT KITTS AND NEVIS'},
                            {value:'LC',label:'SAINT LUCIA'},
                            {value:'PM',label:'SAINT PIERRE AND MIQUELON'},
                            {value:'VC',label:'SAINT VINCENT AND THE GRENADINES'},
                            {value:'WS',label:'SAMOA'},
                            {value:'SM',label:'SAN MARINO'},
                            {value:'ST',label:'SAO TOME AND PRINCIPE'},
                            {value:'SA',label:'SAUDI ARABIA'},
                            {value:'SN',label:'SENEGAL'},
                            {value:'SC',label:'SEYCHELLES'},
                            {value:'SL',label:'SIERRA LEONE'},
                            {value:'SG',label:'SINGAPORE'},
                            {value:'SK',label:'SLOVAKIA'},
                            {value:'SI',label:'SLOVENIA'},
                            {value:'SB',label:'SOLOMON ISLANDS'},
                            {value:'SO',label:'SOMALIA'},
                            {value:'ZA',label:'SOUTH AFRICA'},
                            {value:'GS',label:'SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS'},
                            {value:'ES',label:'SPAIN'},
                            {value:'LK',label:'SRI LANKA'},
                            {value:'SD',label:'SUDAN'},
                            {value:'SR',label:'SURINAME'},
                            {value:'SJ',label:'SVALBARD AND JAN MAYEN'},
                            {value:'SZ',label:'SWAZILAND'},
                            {value:'SE',label:'SWEDEN'},
                            {value:'CH',label:'SWITZERLAND'},
                            {value:'SY',label:'SYRIAN ARAB REPUBLIC'},
                            {value:'TW',label:'TAIWAN, PROVINCE OF CHINA'},
                            {value:'TJ',label:'TAJIKISTAN'},
                            {value:'TZ',label:'TANZANIA, UNITED REPUBLIC OF'},
                            {value:'TH',label:'THAILAND'},
                            {value:'TG',label:'TOGO'},
                            {value:'TK',label:'TOKELAU'},
                            {value:'TO',label:'TONGA'},
                            {value:'TT',label:'TRINIDAD AND TOBAGO'},
                            {value:'TN',label:'TUNISIA'},
                            {value:'TR',label:'TURKEY'},
                            {value:'TM',label:'TURKMENISTAN'},
                            {value:'TC',label:'TURKS AND CAICOS ISLANDS'},
                            {value:'TV',label:'TUVALU'},
                            {value:'UG',label:'UGANDA'},
                            {value:'UA',label:'UKRAINE'},
                            {value:'AE',label:'UNITED ARAB EMIRATES'},
                            {value:'GB',label:'UNITED KINGDOM'},
                            {value:'UM',label:'UNITED STATES MINOR OUTLYING ISLANDS'},
                            {value:'UY',label:'URUGUAY'},
                            {value:'UZ',label:'UZBEKISTAN'},
                            {value:'VU',label:'VANUATU'},
                            {value:'VE',label:'VENEZUELA'},
                            {value:'VN',label:'VIET NAM'},
                            {value:'VG',label:'VIRGIN ISLANDS, BRITISH'},
                            {value:'VI',label:'VIRGIN ISLANDS, U.S.'},
                            {value:'WF',label:'WALLIS AND FUTUNA'},
                            {value:'EH',label:'WESTERN SAHARA'},
                            {value:'YE',label:'YEMEN'},
                            {value:'YU',label:'YUGOSLAVIA'},
                            {value:'ZM',label:'ZAMBIA'},
                            {value:'ZW',label:'ZIMBABWE'}]
                        }
                        selected={select_country}
                        onChange={this.handleChange('select_country')}
                    />
                ),
                shortcut: true,
            },
            {
                key: 'Categories',
                label: 'Categories',
                filter: (
                    <ChoiceList
                        title={'Categories'}
                        titleHidden
                        choices={[
                            {label: 'Automobiles & Motorcycles', value: '34'},
                            {label: 'Beauty & Health', value: '66'},
                            {label: 'Home Improvement', value: '13'},
                            {label: 'Computer & Office', value: '7'},
                            {label: 'Consumer Electronics', value: '44'},
                            {label: 'Electrical Equipment & Supplies', value: '5'},
                            {label: 'Furniture', value: '1503'},
                            {label: 'Hardware', value: '42'},
                            {label: 'Home Appliances', value: '6'},
                            {label: 'Jewelry & Accessories', value: '36'},
                            {label: 'Lights & Lighting', value: '39'},
                            {label: 'Luggage & Bags', value: '1524'},
                            {label: 'Mother & Kids', value: '1501'},
                            {label: 'Office & School Supplies', value: '1521'},
                            {label: 'Security & Protection', value: '30'},
                            {label: 'Shoes', value: '322'},
                            {label: 'Sports & Entertainment', value: '18'},
                            {label: 'Tools', value: '1420'},
                            {label: 'Toys & Hobbies', value: '26'},
                            {label: 'Watches', value: '1511'},
                            {label: 'Weddings & Events', value: '320'},
                        ]}
                        selected={Categories}
                        onChange={this.handleChange('Categories')}
                    />
                ),
                shortcut: true,
            },
            {
                key: 'pricefrom',
                label: 'PriceFrom',
                filter:(
                    <TextField
                        label="PriceFrom"
                        labelHidden
                        type = "number"
                        value={this.state.filter.pricefrom}
                        onChange={this.handleChangeText('pricefrom')} />
                ),
            },
            {
                key: 'priceto',
                label: 'PriceTo',
                filter:(
                    <TextField
                        label="PriceTo"
                        type="number"
                        labelHidden
                        value={this.state.filter.priceto}
                        onChange={this.handleChangeText('priceto')} />
                ),
            },
            // {
            //     key: 'Currency',
            //     label: 'Currency',
            //     filter:(
            //         <ChoiceList
            //             title={'Currency'}
            //             titleHidden
            //             choices={[
            //                 {label: 'USD', value: 'USD'},
            //                 {label: 'RUP', value: 'RUP'},
            //                 {label: 'GBP', value: 'GBP'},
            //             ]}
            //             selected={Currency}
            //             onChange={this.handleChange('Currency')}
            //         />
            //     ),
            // },
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
                                    helpText={"For Multiple add comma ',' between them e.g. : https://aliexpress.com***,https://aliexpress.com***"}
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
                                <div onKeyDown={this.handleEnter}>

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
                                </div>
                                <RenderSearchGrid {...this.props} filter={this.state.filter} redirect={this.redirect}/>
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
            .postRequest('aliexpress/request/importProduct', sendData)
            .then(data => {
                console.log(data);
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


    handleChangeText = key => event => {
        console.log(key, event);
        const state = Object.assign({}, this.state.filter);
        event = parseFloat(event);
        console.log(event);
        if ( isNaN(event) ) event = 0;
        console.log(state);
        this.setState(state => {
            state['filter'][key] = event;
            return state;
        });
        // this.setState(state);
    }

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
        case 'Categories':
            return `Category ${value}`;
        case 'select_country':
            return `Selected Country ${value}`;
        case 'priceto':
            return `Price To ${value}`;
        case 'pricefrom':
            return `Price From ${value}`;
        case 'Currency':
            return `Currency ${value}`;
        default:
            return value;
    }
}

export default AliExpress;

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
        Sales_price: {
            title: 'Sales_price',
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
        'Sales_price',
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
                Categories: [],
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
            .postRequest('aliexpress/request/importProduct', sendData)
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
        console.log(this.state.pagination);
        let { pagination } = this.state;
        return (
            <div className="col-12">
                <div className="p-sm-3 p-0" >
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
                        <Stack.Item >
                            {pagination.entriesPerPage > 0 && this.paginationRender(false)}
                        </Stack.Item>
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
        return <div className="row">
            <div className="col-6 text-right">
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

        // console.log(this.state);
        let data = {
            keyword: search_key,
            product_url: this.state.filter.product_url,
            product_id: this.state.filter.product_id,
            category: this.state.filter.Categories[0],
            pricefrom: this.state.filter.pricefrom,
            feedfrom: this.state.filter.feedfrom,
            feedto: this.state.filter.feedto,
            soldfrom: this.state.filter.soldfrom,
            soldto: this.state.filter.soldto,
            country: this.state.filter.select_country[0],
            // currency: this.state.filter.currency,
            count: this.gridSettings.count,
            page: this.gridSettings.activePage,
        };

        requests
            .postRequest('aliexpress/request/getProducts', data, false, true)
            .then(data => {
                console.log(data);
                if (data.success && data.result && data.result.products)  {
                    window.showGridLoader = false;
                    this.setState({
                        totalPage: data.result.totalResults,
                        tempProductData: data.result.products,

                    });
                    this.setState((state, props) => {
                            state.pagination.totalEntries = data.result.totalResults;
                            state.pagination.entriesPerPage = this.gridSettings.count;
                            state.pagination.pageNumber = this.gridSettings.activePage;
                    });
                    this.setState({
                        products: this.modifyProductsData(data.result.products),
                        showLoaderBar: !data.success,
                        hideLoader: data.success,
                        pagination_show: data.result.totalResults,
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
        console.log(data);
        this.setState({
            pagination_show: data.length,
        });
        let products = [];
        for (let i = 0; i < data.length; i++) {
            let rowData = {};
            if (data !== {} && !isUndefined(data)) {
                rowData['main_image'] = data[i]['imageUrl'];
                rowData['itemId'] = data[i]['productId'];
                rowData['product_title'] = data[i]['productTitle'];
                rowData['price'] = data[i]['originalPrice'];
                rowData['Sales_price'] = data[i]['salePrice'];
                rowData['import'] =  'Import';
                rowData['productUrl'] = data[i]['productUrl'];
            }
            products.push(rowData);
        }
        return products;
    }

    // handleEnter = event => {
    //     const enterKeyPressed = event.keyCode === 13;
    //     if (enterKeyPressed) {
    //         this.onClickSearch();
    //     }
    // };
}