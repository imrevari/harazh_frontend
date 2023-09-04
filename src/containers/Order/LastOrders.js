import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import ListOrderComponentDetailed from '../../components/ListOrderComponent/ListOrderComponentDetailed';
import date from 'date-and-time';


class LastOrders extends Component {
    constructor(props) {
        super(props);
        document.title = 'Послiднi роботи - Г а р а ж';
    }

    state = {
        endDate : new Date(Date.now()).toISOString().split('T')[0],
        beginDate: 
        (new Date(Date.now()).getDay() === 1)
          ?
          new Date(Date.now()).toISOString().split('T')[0]
          :
          (
            new Date(Date.now()).getDay() === 0
            ?
            new Date(new Date(Date.now()).setDate(new Date(Date.now()).getDate() - 6)).toISOString().split('T')[0]
            :
            new Date(new Date(Date.now()).setDate(new Date(Date.now()).getDate() - new Date(Date.now()).getDay() + 1)).toISOString().split('T')[0]
          ), 
        incoming: []
    }

    getAllOrdersBetweenDates = (requestBody) =>{
        axios({method: 'post', url: '/orders/dates/', data: requestBody})
            .then((response) => {
                this.setState({...this.state, incoming: response.data});
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
        const requestBody = {
            fromDate: this.state.beginDate + "T00:00:01",
            toDate: this.state.endDate + "T23:59"
        }
        this.getAllOrdersBetweenDates(requestBody);
    }

    isUndoneWorkPresent = (works) =>{
        const result = works.filter(work => {return work.workDone})
        return result < works;
    }

    setBegindDate = (event) => {
        const target = event.target;
        const value = target.value;
        if(value > this.state.endDate){
            this.setState({...this.state, error: true})
        }else{
            this.setState({...this.state,
                beginDate:  target.value,
                error: false
                });
            const requestBody = {
                fromDate: target.value + "T00:00:01",
                toDate: this.state.endDate + "T23:59"
            }
            this.getAllOrdersBetweenDates(requestBody);
        }

        
    };

    setEndDate = (event) => {
        const target = event.target;
        const value = target.value;
        if(value < this.state.beginDate){
            this.setState({...this.state, error: true})
        }else{
            this.setState({...this.state,
                endDate:  value,
                error: false
                });
            const requestBody = {
                fromDate: this.state.beginDate + "T00:00:01",
                toDate: target.value + "T23:59"
            }
            this.getAllOrdersBetweenDates(requestBody);
        }
    };


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
                    colorStatus={(item.orderClosed && !item.payedFor) ? 'yellow' :
                        
                                item.payedFor ? 'lightgreen' :
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
        
        const juser = JSON.parse(localStorage.getItem('user'));

        return (
            <div>
                    <div>
                        <label
                            className="control-label">
                            <h1> Роботи вiд:</h1></label>
                        <input
                            className={this.state.error ? "form-control my-input-search-field-3 is-invalid" : "form-control my-input-search-field-3"}
                            name="from"
                            type="date"
                            date-inline-picker="true"
                            value={this.state.beginDate}
                            onChange={this.setBegindDate}
                            placeholder={'from'}
                        />
                        <span className="form-text invalid-feedback">
                            НЕ МОЖЕ БУТИ БІЛЬШЕ ЯК {date.format(new Date(this.state.endDate), 'DD. MM. YYYY')}
                        </span>
                        {/* <strong>       </strong> */}
                        <label
                            className="control-label">
                            <h1>до :</h1></label>
                        <input
                            className={this.state.error ? "form-control my-input-search-field-4 is-invalid" : "form-control my-input-search-field-4"}
                            name="till"
                            type="date"
                            value={this.state.endDate}
                            onChange={this.setEndDate}
                            placeholder={'till'}
                        />
                        <span className="form-text invalid-feedback">
                            НЕ МОЖЕ БУТИ МЕНШЕ ЯК {date.format(new Date(this.state.beginDate), 'DD. MM. YYYY')}
                        </span>

                    </div>
               

                <hr/>
             
                    <div  >                              
                        
                        <Link to="/newOrder">
                            <button className="btn-success my-button">Створити заказ</button>
                        </Link>

                        {/* <Link to="/"> */}
                            <button className="btn-info my-button" onClick={() => alert('Функція ще не робит')}>Старі закази</button>
                        {/* </Link> */}

                        <Link to="/unpaid" style={juser.role === 'ROLE_ADMIN' ? {} : {display: 'none'}}>
                            <button className="btn-success my-button">Неоплаченi закритi закази</button>
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

export default LastOrders;