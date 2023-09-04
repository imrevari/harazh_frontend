import React, {Component} from 'react';
import date from 'date-and-time';

class ListWorkdoneComponent extends Component{

    render() {

        return (
           
            <tr>
                <td className="" onClick={this.props.forwardToOrder}> {this.props.id} </td>
                <td className="" onClick={this.props.forwardToOrder}> {this.props.name} </td>
                <td className="" onClick={this.props.forwardToOrder} style={this.props.showDoneBy ?  {} : {display: 'none'}}> {this.props.price} </td>
                <td className="" onClick={this.props.forwardToOrder}> {date.format(new Date(this.props.closed), 'DD. MM. YYYY. - HH:mm')  } </td>
                <td className="" onClick={this.props.forwardToOrder}
                style={this.props.showDoneBy ?  {} : {display: 'none'}}> {this.props.doneBy} </td>
                
                <td className="" onClick={this.props.forwardToOrder}> {this.props.salary} </td>
                <td className="" onClick={this.props.forwardToOrder}> {this.props.car} </td>
            </tr> 
           
        )
    }

}

export default ListWorkdoneComponent;