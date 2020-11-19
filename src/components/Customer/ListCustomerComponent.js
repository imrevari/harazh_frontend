import React, {Component} from 'react';
import './ListCustomerComponent.css'

class ListCustomerComponent extends Component{

    // constructor(props) {
    //     super(props);

    //     // console.log(props);
    // }

    render() {


        return (
                 
            <tr>
                <td className="name" onClick={this.props.create}>{this.props.name}</td>
                <td className="telNumber" onClick={this.props.create}>{this.props.telNumber}</td>
                <td className="edite" style={
                    this.props.car === undefined ?  {} : {display: 'none'} 
                    }> <button onClick={this.props.edit}>Iзмiнити</button> </td>
                <td className="delete" style={
                    this.props.car === undefined ?  {} : {display: 'none'} 
                    }> <button onClick={this.props.delete}>Удалити</button> </td>
                <td className="add" style={
                    this.props.car === undefined ?  {display: 'none'} : {}
                    }>  <button   onClick={this.props.add}>Додати</button> </td>
                <td className="allOrders" style={
                    this.props.car === undefined ?  {} : {display: 'none'} 
                    }>  <button   onClick={this.props.allOrders}>Старi закази</button> </td>
            </tr> 

        )
    }


}

export default ListCustomerComponent;