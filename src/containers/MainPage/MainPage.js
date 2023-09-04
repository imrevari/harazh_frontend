import React, {Component} from 'react';
import {Link} from 'react-router-dom'
class MainPage extends Component {
    constructor(props) {
        super(props);
        document.title = 'Робота - Г а р а ж';
    }

    render(){
        
        return (
            <div>
                <h1>Главне меню</h1>

                <hr/>
                        <Link to="/openedOrders">
                            <button className="btn-danger my-button">Закази в роботі</button>
                        </Link>

                        {/* <Link to="/"> */}
                            <button className="btn-info my-button" onClick={() => alert('Функція ще не робит')}>Старі закази</button>
                        {/* </Link> */}
                
                <hr/>
            </div>
        );
    }

}

export default MainPage;