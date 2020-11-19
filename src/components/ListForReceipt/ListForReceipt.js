import React, {Component} from 'react';

class ListForReceipt extends Component{


    

    render() {

        return (
           
            <tr>
                <td className="name">{this.props.name}</td>
                <td className="price">{this.props.price}</td>
                <td className="price">{this.props.amount}</td>
                <td className="price">{this.props.totalPrice}</td>
            </tr>
        )
    }





}

export default ListForReceipt;