import React, {Component} from 'react';
import {Link} from 'react-router-dom';


class PartsPage extends Component {
    constructor(props) {
        super(props);
        document.title = 'Робота - Г а р а ж';
    }

    render(){
        return (
            <div>
                <h1>Запчасты</h1>

             
                        <div  >
                                <Link to="/addPart">
                                    <button className="btn-success my-button">Свторити запчасть</button>
                                </Link>
                        </div>

                    <br/>

                        <div>
                                <Link to="/partsList">
                                    <button className=" btn-success my-button ">Список запчастей</button>
                                </Link>
                        </div>
                    
                    <br/>

                        <div>
                                <Link to="/">
                                    <button className=" btn-success my-button ">Найти запчасть</button>
                                </Link>
                        </div>

            </div>
        );
    }

}

export default PartsPage;