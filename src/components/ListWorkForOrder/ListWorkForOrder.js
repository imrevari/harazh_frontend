import React, {Component} from 'react';

class ListWorkForOrder extends Component{

    // constructor(props) {
    //     super(props);
    // }


    render() {

        return (
           
            <tr>
                <td className="name">{this.props.name}</td>
                <td className="price">{this.props.price}</td>
                <td className="user">{this.props.user} <button onClick={this.props.changeUser}  style={(this.props.juser.role === 'ROLE_ADMIN' && !this.props.closed) ? (this.props.done ? {} : {display: 'none'}) : {display: 'none'}} >Iзмiнити</button> </td>
                {/* <td className="desc" style={(this.props.closed || this.props.juser.role === 'ROLE_ADMIN') ? {display: 'none'} : {}}>{this.props.desc}</td> */}
                <td className="done" style={
                    this.props.done ? {display: 'none'} : {}
                    } > <button onClick={this.props.closeWork}>Зробити</button> </td>
                <td className="done" style={
                    this.props.done ? {} : {display: 'none'}
                    }> Зроблена!</td>
                {/* <td className="done" style={
                    this.props.juser.role === 'ROLE_ADMIN' ? (this.props.done ? {display: 'none'} : {}) : ({display: 'none'})
                    } > Не Зроблена! </td> */}
                <td className="done" style={
                    (this.props.juser.role === 'ROLE_ADMIN' && !this.props.closed) ? {} : {display: 'none'}
                    } > <button onClick={this.props.remove}>Удалити</button> </td>
            </tr>
        )
    }


}


export default ListWorkForOrder;