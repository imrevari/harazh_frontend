import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class UsersPage extends Component {

    constructor(props) {
        super(props);
        document.title = 'Пользователi - Г а р а ж';
    }

    render(){
        return (
            <div>
                <h1>Пользователi</h1>

                        <div  >
                                <Link to="/addUser">
                                    <button className="btn-success my-button">Свторити пользователя</button>
                                </Link>
                        </div>

                    <br/>

                        <div>
                                <Link to="/userList">
                                    <button className="btn-success my-button">Список пользователю</button>
                                </Link>
                        </div>

                    


            </div>
        );
    }




}

export default UsersPage;