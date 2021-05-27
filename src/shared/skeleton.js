import React, {Component} from 'react';
import {Card, Layout, SkeletonBodyText, SkeletonDisplayText, SkeletonPage,Thumbnail, TextContainer} from "@shopify/polaris";

import { isUndefined } from 'util';

class Skeleton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedSkeleton: isUndefined(props.case)?'dounut':props.case
        }
    }
    componentWillReceiveProps(nextProps, nextContext) {
        if ( !isUndefined(nextProps.select) && nextProps.select !== this.props.select )
            this.setState({selectedSkeleton: nextProps.select});
    }
    render() {
        return (
            this.handleSkeletonChoose(this.props.case)
        );
    }
    handleSkeletonChoose = () => {
        switch (this.state.selectedSkeleton) {
            case 'page': return (
                <React.Fragment>
                    <SkeletonPage secondaryActions={2}>
                        <Layout>
                            <Layout.Section>
                                <Card sectioned>
                                    <SkeletonBodyText />
                                </Card>
                                <Card sectioned>
                                    <TextContainer>
                                        <SkeletonDisplayText size="small" />
                                        <SkeletonBodyText />
                                    </TextContainer>
                                </Card>
                                <Card sectioned>
                                    <TextContainer>
                                        <SkeletonDisplayText size="small" />
                                        <SkeletonBodyText />
                                    </TextContainer>
                                </Card>
                            </Layout.Section>
                            <Layout.Section secondary>
                                <Card>
                                    <Card.Section>
                                        <TextContainer>
                                            <SkeletonDisplayText size="small" />
                                            <SkeletonBodyText lines={2} />
                                        </TextContainer>
                                    </Card.Section>
                                    <Card.Section>
                                        <SkeletonBodyText lines={1} />
                                    </Card.Section>
                                </Card>
                                <Card subdued>
                                    <Card.Section>
                                        <TextContainer>
                                            <SkeletonDisplayText size="small" />
                                            <SkeletonBodyText lines={2} />
                                        </TextContainer>
                                    </Card.Section>
                                    <Card.Section>
                                        <SkeletonBodyText lines={5} />
                                    </Card.Section>
                                </Card>
                            </Layout.Section>
                        </Layout>
                    </SkeletonPage>
                </React.Fragment>
            );
            case 'body': return (
                <React.Fragment>
                        <Layout>
                            <Layout.Section>
                                <Card sectioned>
                                    <TextContainer>
                                        <SkeletonDisplayText size="small" />
                                        <SkeletonBodyText />
                                        <SkeletonBodyText />
                                        <SkeletonBodyText />
                                    </TextContainer>
                                </Card>

                            </Layout.Section>
                        </Layout>
                </React.Fragment>
            );
            case 'activity_render': return (
                <React.Fragment>
                    <Layout>
                        <Layout.Section>
                            <Card sectioned>
                                <TextContainer>
                                    <SkeletonDisplayText size="small" />
                                    <SkeletonBodyText />
                                    <SkeletonBodyText />
                                </TextContainer>
                            </Card>

                        </Layout.Section>
                    </Layout>
                </React.Fragment>
            );
            case 'component': return (
                <React.Fragment>
                    <Card sectioned>
                        <SkeletonBodyText />
                    </Card>
                    <Card sectioned>
                        <TextContainer>
                            <SkeletonDisplayText size="small" />
                            <SkeletonBodyText />
                        </TextContainer>
                    </Card>
                    <Card sectioned>
                        <TextContainer>
                            <SkeletonDisplayText size="small" />
                            <SkeletonBodyText />
                        </TextContainer>
                    </Card>
                </React.Fragment>
            );
            case 'setting': return (
                <React.Fragment>
                    <Card sectioned>
                        <SkeletonBodyText />
                    </Card>
                    <Card sectioned>
                        <TextContainer>
                            <SkeletonDisplayText size="small" />
                            <SkeletonBodyText />
                        </TextContainer>
                    </Card>
                    <Card sectioned>
                        <TextContainer>
                            <SkeletonDisplayText size="small" />
                            <SkeletonBodyText />
                        </TextContainer>
                    </Card>
                </React.Fragment>
            );
            case 'plan' : return (<React.Fragment>
                <div className="row">
                    <div className="col-12 col-sm-4">
                        <Card sectioned>
                            <SkeletonDisplayText size="large" />
                        </Card>
                        <Card sectioned>
                            <TextContainer>
                                <SkeletonDisplayText size="small" />
                                <SkeletonBodyText />
                            </TextContainer>
                        </Card>
                        <Card sectioned>
                            <TextContainer>
                                <SkeletonDisplayText size="small" />
                                <SkeletonBodyText />
                            </TextContainer>
                        </Card>
                    </div>
                    <div className="col-12 col-sm-4">
                        <Card sectioned>
                            <SkeletonDisplayText size="large" />
                        </Card>
                        <Card sectioned>
                            <TextContainer>
                                <SkeletonDisplayText size="small" />
                                <SkeletonBodyText />
                            </TextContainer>
                        </Card>
                        <Card sectioned>
                            <TextContainer>
                                <SkeletonDisplayText size="small" />
                                <SkeletonBodyText />
                            </TextContainer>
                        </Card>
                    </div>
                    <div className="col-12 col-sm-4">
                        <Card sectioned>
                            <SkeletonDisplayText size="large" />
                        </Card>
                        <Card sectioned>
                            <TextContainer>
                                <SkeletonBodyText />
                            </TextContainer>
                        </Card>
                        <Card sectioned>
                            <TextContainer>
                                <SkeletonDisplayText size="small" />
                                <SkeletonBodyText />
                            </TextContainer>
                        </Card>
                    </div>
                </div>
            </React.Fragment>);
            case 'import': return (
                <React.Fragment>
                    <SkeletonPage secondaryActions={2}>
                        <div className="row p-5">
                            <div className="col-12 mb-5">
                                <TextContainer>
                                    <SkeletonDisplayText size="small" />
                                    <SkeletonBodyText />
                                </TextContainer>
                            </div>
                            <div className="col-12 col-sm-6" style={{height:'200px'}}>
                                <Card>
                                    <div className="p-5">
                                        <div className="p-5">
                                            <SkeletonDisplayText size="large" />
                                            <SkeletonBodyText />
                                        </div>
                                    </div>
                                </Card>
                            </div>
                            <div className="col-12 col-sm-6" style={{height:'200px'}}>
                                <Card>
                                    <div className="p-5">
                                        <div className="p-5">
                                            <SkeletonDisplayText size="large" />
                                            <SkeletonBodyText />
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </SkeletonPage>
                </React.Fragment>
            );
            case 'dounut':return (
                <React.Fragment>
                    <Card>
                    <SkeletonPage secondaryActions={1}>
                        <div className="row">
                            <div className="col-12 text-sm-center">
                                <SkeletonDisplayText size="small" />
                                <SkeletonDisplayText size="small" />
                                <SkeletonDisplayText size="small" />
                            </div>
                        </div>
                    </SkeletonPage>
                    </Card>
                </React.Fragment>
                            );
            case 'config_heading':return (
                <React.Fragment>
                    <SkeletonPage secondaryActions={0}>
                    </SkeletonPage>
                </React.Fragment>
            );
            case 'bodyconfig': return (
                <React.Fragment>
                    <Layout>
                        <Layout.Section>
                            <Card sectioned>
                                <TextContainer>
                                    <SkeletonDisplayText size="small" />
                                    <SkeletonBodyText />
                                    <SkeletonBodyText />
                                    <SkeletonBodyText />
                                    <SkeletonBodyText />
                                    <SkeletonBodyText />
                                    <SkeletonBodyText />
                                </TextContainer>
                            </Card>

                        </Layout.Section>
                    </Layout>
                </React.Fragment>
            );
            default: return (
                <React.Fragment>
                    <Card sectioned>
                        <TextContainer>
                            <SkeletonBodyText lines={12} />
                        </TextContainer>
                    </Card>
                </React.Fragment>
            );
        }
    };
}

export default Skeleton;