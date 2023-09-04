import React, {Component} from 'react';


class ListUserComponent extends Component{



    render() {


        return (
                 
            <tr>
                <td className="">{this.props.name}</td>
                <td className="">{this.props.role === 'ROLE_ADMIN' ? "адмiн" : (this.props.role === 'ROLE_SENIOR_USER' ? "майстер" : "помічник") }</td>
                <td className="" style={
                    this.props.workId === undefined && !this.props.forReport ?  {} : {display: 'none'}
                }>  <button   onClick={this.props.edit}>Iзмiнити</button> </td>
                <td className="" style={
                    this.props.workId === undefined && !this.props.forReport ?  {} : {display: 'none'}
                }>  <button   onClick={this.props.delete}>удалити</button> </td>
                <td className="" style={this.props.workId === undefined ?  {display: 'none'} : {}}>  <button   onClick={this.props.select}>вибрати</button> </td>
                <td className="" style={
                    this.props.workId === undefined && !this.props.forReport ?  {} : {display: 'none'}
                }>  <button   onClick={this.props.report}>отчот</button> </td>
                <td className="" style={
                    this.props.forReport ?  {} : {display: 'none'}
                }>  <input type="checkbox" id={this.props.id} onClick={this.props.select} checked={this.props.selected}></input> </td>
            </tr> 

        )
    }


}

export default ListUserComponent;