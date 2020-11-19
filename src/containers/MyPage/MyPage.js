import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class MyPage extends Component {

    constructor(props) {
        super(props);
        document.title = 'Моя сторiнка - Г а р а ж';
    }

    render(){

        const user = JSON.parse(localStorage.getItem('user'));

        return (
            <div>
                <h1>Моя сторiнка - {user.name}</h1>

                        <div  >
                                <Link to="/changePassword">
                                    <button className="btn-success my-button">Змiнити пароль</button>
                                </Link>
                        </div>

                    <br/>

                        <div>
                                <Link to="/myWorks">
                                    <button className="btn-success my-button">Зробленi роботи</button>
                                </Link>
                        </div>

                    


            </div>
        );
    }




}

export default MyPage;