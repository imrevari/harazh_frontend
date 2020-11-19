import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class CarsPage extends Component {

    constructor(props) {
        super(props);
        document.title = 'Машини - Г а р а ж';
    }

    render(){
        return (
            <div>
                <h1>Машини</h1>

                        <div  >
                                <Link to="/addCar">
                                    <button className="btn-success my-button">Свторити Машину</button>
                                </Link>
                        </div>

                    <br/>

                        <div>
                                <Link to="/carList">
                                    <button className="btn-success my-button">Список Машин</button>
                                </Link>
                        </div>

                    <br/>

                        <div>
                                <Link to="/">
                                    <button className="btn-success my-button">Найти Машину</button>
                                </Link>
                        </div>


            </div>
        );
    }




}

export default CarsPage;