import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import ListOrderComponentDetailed from '../../components/ListOrderComponent/ListOrderComponentDetailed';


class UnpaidOrders extends Component {
    constructor(props) {
        super(props);
        document.title = 'Неоплаченi роботи - Г а р а ж';
    }

    state = { incoming: []}

    getAllUnpaidOrders = () =>{
        axios.get('/orders/unpaid')
                    .then((response) => {
                        // console.log(response.data)
                        this.setState({incoming: response.data});
                    })
                    .catch(error => {
                        this.setState(() => {
                            throw error;
                        })
                    })



    }

    totalToPay = (works, partCounts, amountPayedInAdvance) =>{
        let total = 0;
        total -= amountPayedInAdvance;

        works.map(item =>{
            if (item.workDone){
                total += item.price;
            }
            return total;
        })
        partCounts.map(item =>{
                total += (item.retailPrice * item.amount);
                return total;      
        })
        
       return total;
    }

    openOrder = (id) =>{
        this.props.history.push("/order/" + id);
    }


    componentDidMount(){

        this.getAllUnpaidOrders();

    }

    isUndoneWorkPresent = (works) =>{
        const result = works.filter(work => {return work.workDone})
        return result < works;
    }


    render(){
        const { detect } = require('detect-browser');
        const browser = detect();

        const listOfOrders = this.state.incoming.map( item => {

            return (
                <ListOrderComponentDetailed 
                    key={item.id}
                    id={item.id}
                    opened={item.orderOpened}
                    problem={item.problem.substring(0, 20) + (item.problem.length > 20 ? '...' : '')}
                    details={() => this.openOrder(item.id)}
                    total={this.totalToPay(item.works, item.partCounts, item.amountPayedInAdvance)}
                    car={item.car.carMade}
                    name={item.customer.firstName + ' ' + item.customer.lastName }
                    browser={browser.os}
                    colorStatus={item.payedFor ? 'lightgreen' :
                                    (item.works.length === 0 ? 'pink' : 
                                        (this.isUndoneWorkPresent(item.works) ? 'pink' : 'lightgreen')
                                    )
                                }
                    
                />
            )
        });

        const myTable = ( 
            
                <table border="1" >
                    <thead>
                        <tr>
                            <th className=""  >Номер </th>
                            <th className=""  >Машина </th>
                            <th className=""  style={browser.os === 'Android OS' ? {display: 'none'} : {}} >Проблема</th>
                            <th className=""  >Клiент </th>
                            <th className=""  >Одкритий </th>
                            <th className=""  >Довг </th>
                            {/* <th className="" >Деталi</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {listOfOrders} 
                    </tbody>
                </table>
            

        );

        return (
            <div>
                <h1>Неоплаченi роботи</h1>

                <hr/>
             
                    <div  >                              
                        
                        <Link to="/newOrder">
                            <button className="btn-success my-button">Створити заказ</button>
                        </Link>

                        {/* <Link to="/"> */}
                            <button className="btn-info my-button" onClick={() => alert('Функція ще не робит')}>Старі закази</button>
                        {/* </Link> */}

                        <Link to="/lastOrders">
                            <button className="btn- my-button">Всi заказ тиждня</button>
                        </Link>

                        <Link to="/openedOrders">
                            <button className="btn-danger my-button">Закази в роботі</button>
                        </Link>

                    </div>
                    <br/>
                   

        

                <br/>
               
                <hr/>
                {myTable}   
            </div>
        );
    }

}

export default UnpaidOrders;