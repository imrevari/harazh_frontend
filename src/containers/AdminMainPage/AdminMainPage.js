import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class AdminMainPage extends Component {
    constructor(props) {
        super(props);
        document.title = 'Home';
    }
   
    render(){
        const user = JSON.parse(localStorage.getItem('user'));
        const vityaCondition = ((user.name === 'Oleksandr') && (new Date().toISOString().split('T')[0] === '2021-05-20'))
        //const vityaCondition = ((user.name === 'pista') && (new Date().toISOString().split('T')[0] === '2021-05-10'))
        return (
            <div>
                <h1>Головне меню {user.role === 'ROLE_ADMIN' ? 'адмiна' : 'майстра'}</h1>

                <hr/>
             
                    <div  >                              
                        
                        <Link to="/test">
                            <button className="btn-success my-button">Створити заказ</button>
                        </Link>
                        <Link to="/openedOrders">
                            <button className="btn-danger my-button">Закази в роботі</button>
                        </Link>

                        {/* <Link to="/"> */}
                            <button className="btn-info my-button" onClick={() => alert('Функція ще не робит')}>Старі закази</button>
                        {/* </Link> */}

                    </div>
                    <br/>
                    <div style={vityaCondition ? {display: 'none'} : {}}>
                        <img 
                        src={"https://st2.depositphotos.com/3682225/11228/v/600/depositphotos_112288198-stock-illustration-automotive-repair-icon-car-service.jpg"} 
                        width={'80%'}
                        height={'auto'}
                        />
                    </div>

                    <div style={vityaCondition ? {} : {display: 'none'}}>
                        <img 
                        src={"https://cdn.shopify.com/s/files/1/0065/4917/6438/products/a-man-raising-a-birthday-cake-and-inside-an-auto-repair-shop-with-cars_740x.jpg?v=1534312906"} 
                        width={'80%'}
                        height={'auto'}
                        />
                    </div>

        

                <br/>
               
                <hr/>
                {/* {myTable}    */}
            </div>
        );
    }

}

export default AdminMainPage;