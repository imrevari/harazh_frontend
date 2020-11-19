import React, {Component} from 'react';

class ListPartForOrder extends Component{


    // constructor(props) {
    //     super(props);
    // }

    render() {

        return (
           
            <tr>
                <td className="name">{this.props.name}</td>
                <td className="price">{this.props.amount}</td>
                <td className="price">{this.props.totalPrice}</td>
                <td className="desc" style={(this.props.closed || this.props.juser.role === 'ROLE_ADMIN') ? {display: 'none'} : {}}>{this.props.desc}</td>
                <td className="done" style={(this.props.juser.role === 'ROLE_ADMIN' && !this.props.closed) ? {} : {display: 'none'}} > <button onClick={this.props.remove}>Удалити</button> </td>
            </tr>
        )
    }





}

export default ListPartForOrder;