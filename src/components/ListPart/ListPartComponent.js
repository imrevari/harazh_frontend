import React, {Component} from 'react';
import './ListPartComponent.css'


class ListPartComponent extends Component{

    // constructor(props) {
    //     super(props);

    //     // console.log(props);
    // }

    state = {
        showDetails: false
    };

    showOrHide = () => {
        const showOrHide = this.state.showDetails

        this.setState({...this.state, showDetails: !showOrHide});
    }


    render() {



        return (
           
            <table border="1" >
            <tbody>
            <tr>
                <td className="n" onClick={this.showOrHide}>{this.props.name}</td>
                <td className="p" onClick={this.showOrHide}>{this.props.price}</td>
                <td className="edit" style={
                    this.props.juser.role === 'ROLE_JUNIOR_USER' ? 
                    {display: 'none'} : 
                    {}
                }> <button onClick={this.props.edit}>Iзмiнити</button> </td>
                <td className="delete" style={
                    this.props.juser.role === 'ROLE_JUNIOR_USER' ? 
                    {display: 'none'} : 
                    (this.props.id === undefined ?  {} : {display: 'none'})
                    }> <button onClick={this.props.delete}>Видалити</button> </td>
                <td className="delete" style={this.props.id === undefined ?  {display: 'none'} : {} }>
                      <button   onClick={this.props.add}>Добавити</button> </td>
            </tr> 

            <tr  className={this.state.showDetails ? "" : "toHide"}  >
                <td colSpan={this.props.juser.role === 'ROLE_JUNIOR_USER' ? "3" : "4"} > {this.props.desc}</td>

            </tr>
            </tbody>

            </table>


           
        )
    }


}

export default ListPartComponent;