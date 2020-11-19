import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class WorksPage extends Component {
    constructor(props) {
        super(props);
        document.title = 'Роботи - Г а р а ж';
    }

    render(){
        return (
            <div>
                <h1>Роботи</h1>

                        <div  >
                                <Link to="/addWork">
                                    <button className="btn-success my-button">Свторити роботу</button>
                                </Link>
                        </div>

                    <br/>

                        <div>
                                <Link to="/worksList">
                                    <button className=" btn-success my-button">Список робот</button>
                                </Link>
                        </div>

                    <br/>

                        <div>
                                <Link to="/">
                                    <button className=" btn-success my-button ">Найти роботу</button>
                                </Link>
                        </div>


            </div>
        );
    }



}

export default WorksPage;