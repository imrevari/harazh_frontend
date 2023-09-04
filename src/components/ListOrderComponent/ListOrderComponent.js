import React, {Component} from 'react';
import date from 'date-and-time';

class ListOrderComponent extends Component{


    render() {


        return (
           
            <tr onClick={this.props.details} bgcolor={this.props.closed ? 'lightgreen' : 'yellow'}>
                <td className=""> {this.props.id} </td>
                <td className=""> {date.format(new Date(this.props.opened), 'DD. MM. YYYY. - HH:mm')  } </td>
                <td className="">
                    {this.props.closed ? date.format(new Date(this.props.closed), 'DD. MM. YYYY. - HH:mm') : 'НЕ ЗАКРИТИЙ' } 
                </td>
                <td className="" >
                    {this.props.showCustomer ? this.props.car : this.props.customer}
                </td>
                <td className="" > {this.props.total.toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                
            </tr> 
           
        )
    }




}

export default ListOrderComponent;