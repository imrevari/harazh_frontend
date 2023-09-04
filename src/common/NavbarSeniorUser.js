import React from 'react';
import {Link} from 'react-router-dom';

const navbarSenorUser = (props) => (


    <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
            <Link className="navbar-brand" to="/">ГАРАЖ - МАЙСТЕР</Link>
            {/* {console.log( props.user)} */}
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor03"
                    aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

                <div className="collapse navbar-collapse" id="navbarColor03">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Закази</Link>
                            <Link className="nav-link" to="/customerList">Клiенти</Link>
                            <Link className="nav-link" to="/carList">Машини</Link>
                            <Link className="nav-link" to="/partsList">Запчастi </Link>
                            <Link className="nav-link" to="/worksList">Роботи</Link>
                            {/* <div className="nav-link" onClick={() => alert('Функція ще не робит')}></div>  */}
                            <Link className="nav-link" to="/logout">Вийти</Link>
                        </li>
                    </ul>
                    
                    <ul className="navbar-nav ml-auto">
                        <li><Link className="nav-link" to="/myPage"><i className=""></i>{props.user}</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
);

export default navbarSenorUser;