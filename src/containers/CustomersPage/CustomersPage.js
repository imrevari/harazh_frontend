import React, {Component} from 'react';
import {Link} from 'react-router-dom';


class CustomersPage extends Component {
    constructor(props) {
        super(props);
        document.title = 'Клiенти - Г а р а ж';
    }

    render(){
        return (
            <div>
                <h1>Клiенти</h1>

                        <div  >
                                <Link to="/newCustomer">
                                    <button className="btn-success my-button">Свторити Клiента</button>
                                </Link>
                        </div>

                    <br/>

                        <div>
                                <Link to="/customerList">
                                    <button className=" btn-success my-button">Список Клiенту</button>
                                </Link>
                        </div>

                    <br/>

                        <div>
                                <Link to="/">
                                    <button className=" btn-success my-button ">Найти Клiента</button>
                                </Link>
                        </div>


            </div>
        );
    }

}

export default CustomersPage;