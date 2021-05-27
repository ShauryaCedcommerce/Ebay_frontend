import React, { Component } from 'react';

class Modalsectiondata extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    
    render() { 
        let data=this.props.productdata;
        console.log(data); 
    // this.props.forEach(element => {
    //     for(let i=0;i<Object.keys(element).length;i++){
    //         console.log(element[i]);
    //     }
        
    // });
    return (<div></div>);
    }
}
 
export default Modalsectiondata;