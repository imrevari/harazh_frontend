import React, {Component} from 'react';
import date from 'date-and-time';

class ListOrderComponent extends Component{


    render() {



        return (
           
            <tr>
                <td className=""> {this.props.id} </td>
                <td className="" > {date.format(new Date(this.props.opened), 'DD. MM. YYYY. - HH:mm')  } </td>
                <td className=""  style={this.props.isClosed ? {} : {display: 'none'} } > {date.format(new Date(this.props.closed), 'DD. MM. YYYY. - HH:mm')  } </td>
                <td className="" > {this.props.total.toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                <td className="" > <button   onClick={this.props.details}>Деталi</button> </td>
            </tr> 
           
        )
    }




}

export default ListOrderComponent;