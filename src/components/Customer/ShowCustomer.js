import React, {Component} from 'react';

import './ShowCustomer.css'

class ShowCustomer extends Component{

    // constructor(props) {
    //     super(props);
    // }

    render() {


        return (
                 
            <div className={"cust"}>
               <h3>{this.props.name}</h3>
            </div> 

        )
    }


}

export default ShowCustomer;