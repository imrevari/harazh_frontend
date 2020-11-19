import React, {Component} from 'react';
import date from 'date-and-time';

class ListWorkdoneComponent extends Component{

    render() {

        return (
           
            <tr>
                <td className=""> {this.props.id} </td>
                <td className=""> {this.props.name} </td>
                <td className="" > {date.format(new Date(this.props.closed), 'DD. MM. YYYY. - HH:mm')  } </td>
                <td className=""> {this.props.price} </td>
                <td className=""> {this.props.car} </td>
            </tr> 
           
        )
    }

}

export default ListWorkdoneComponent;