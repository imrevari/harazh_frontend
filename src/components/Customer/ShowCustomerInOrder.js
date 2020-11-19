import React, {Component} from 'react';

import './ShowCustomer.css'

class ShowCustomerInOrder extends Component{

    // constructor(props) {
    //     super(props);
    // }

    render() {


        return (
                 
            <div className={"cust"}>
                <table border="0" >
                    <tbody>
                        <tr>
                            <td colSpan={"2"} ><h4> {this.props.upper} </h4> </td>
                        </tr> 

                        <tr>
                           <td className="left" ><h5> {this.props.left} </h5> </td>
                           <td className="right"><h5> {this.props.right} </h5> </td>

                        </tr>
                    </tbody>
                </table>
            </div> 

        )
    }


}

export default ShowCustomerInOrder;