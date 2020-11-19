import React, {Component} from 'react';
import './ListPartComponent.css'


class ListWorkCategoryComponent extends Component{

    // constructor(props) {
    //     super(props);

    //     // console.log(props);
    // }

    render() {

        return (
           
            <table border="1" >
            <tbody>
            <tr>
                <td className="n" >{this.props.name}</td>
                
                <td className="edit" style={
                    this.props.id === undefined ?  {} : {display: 'none'}
                }> <button onClick={this.props.edit}>Iзмiнити</button> </td>
                <td className="delete" style={
                    this.props.id === undefined ?  {} : {display: 'none'}
                    }> <button onClick={this.props.delete}>Удалити</button> </td>
            </tr> 
            </tbody>
            </table>
        )
    }

}

export default ListWorkCategoryComponent;