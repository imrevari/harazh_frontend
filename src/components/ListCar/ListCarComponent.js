import React, {Component} from 'react';


class ListCarComponent extends Component{


    // constructor(props) {
    //     super(props);

    //     // console.log(props);
    // }

    render() {


        return (
                 
            <tr>
                <td className="made" onClick={this.props.create}>{this.props.carMade}</td>
                <td className="vin" style={this.props.browser === 'Android OS' ? {display: 'none'} : {}} onClick={this.props.create}>{this.props.vinCode}</td>
                <td className="license" onClick={this.props.create}>{this.props.licencePlate}</td>  
                <td className="edite" style={
                    this.props.cust === undefined ?  {} : {display: 'none'}
                    }> <button onClick={this.props.edit}>Iзмiнити</button> </td>
                <td className="delete" style={
                    this.props.cust === undefined ?  {} : {display: 'none'}
                    }> <button onClick={this.props.delete}>Удалити</button> </td>
                <td className="add" style={
                    this.props.cust === undefined ?  {display: 'none'} : {}
                    }>  <button   onClick={this.props.add}>Додати</button> </td>
                <td className="allOrders" style={
                    this.props.cust === undefined ?  {} : {display: 'none'} 
                    }>  <button   onClick={this.props.allOrders}>Старi закази</button> </td>
            </tr> 

        )
    }


}

export default ListCarComponent;