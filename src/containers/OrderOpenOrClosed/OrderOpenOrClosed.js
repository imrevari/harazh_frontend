import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class OrderOpenOrClosed extends Component {

    constructor(props) {
        super(props);
        document.title = 'Робота - Г а р а ж';
    }

    openLink = '/ordersOf/open/' + this.props.match.params.car + '/' + this.props.match.params.cust;

    closedLink = '/ordersOf/closed/' + this.props.match.params.car + '/' + this.props.match.params.cust;


    render(){
        return (
            <div>
                <h1>Закази</h1>

             
                        <div  >
                                <Link to={this.openLink}>
                                    <button className="btn-info my-button">Одкритi закази</button>
                                </Link>
                        </div>

                    <br/>

                        <div>
                                <Link to={this.closedLink}>
                                    <button className=" btn-success my-button ">Закритi закази</button>
                                </Link>
                        </div>

            </div>
        );
    }








}

export default OrderOpenOrClosed;