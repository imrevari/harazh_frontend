import React, {Component} from 'react';
import date from 'date-and-time';

class ListOrderComponentDetailed extends Component{






    render() {



        return (
           
            <tr>
                <td className="" onClick={this.props.details}> {this.props.id} </td>
                <td className="" onClick={this.props.details}> {this.props.car} </td>
                <td className="" onClick={this.props.details}> {this.props.name} </td>
                <td className="" onClick={this.props.details}> {date.format(new Date(this.props.opened), 'DD. MM. YYYY. - HH:mm')  } </td>
                <td className=""  style={this.props.isClosed ? {} : {display: 'none'} } > {date.format(new Date(this.props.closed), 'DD. MM. YYYY. - HH:mm')  } </td>
                <td className="" onClick={this.props.details}> {this.props.total.toLocaleString(undefined, {maximumFractionDigits:2})}</td>
            </tr> 
           
        )
    }




}

export default ListOrderComponentDetailed;