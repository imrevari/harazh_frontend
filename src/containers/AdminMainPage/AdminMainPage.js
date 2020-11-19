import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import ListOrderComponentDetailed from '../../components/ListOrderComponent/ListOrderComponentDetailed';

class AdminMainPage extends Component {
    constructor(props) {
        super(props);
        document.title = 'Home';
    }

    state = {


        incoming: []

       
    };

    getLastTenOrders = () =>{
        axios.get('/orders/')
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

        this.getLastTenOrders();

    }

    render(){

        const listOfOrders = this.state.incoming.map( item => {

            return (
                <ListOrderComponentDetailed 
                    key={item.id}
                    id={item.id}
                    opened={item.orderOpened}
                    details={() => this.openOrder(item.id)}
                    total={this.totalToPay(item.works, item.partCounts, item.amountPayedInAdvance)}
                    car={item.car.carMade}
                    name={item.customer.firstName + ' ' + item.customer.lastName }
                    
                />
            )
        });

        const myTable = ( 
            
                <table border="1" >
                    <thead>
                        <tr>
                            <th className=""  >Номер </th>
                            <th className=""  >Машина </th>
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
                <h1>Главне меню адмiна</h1>

                <hr/>
             
                    <div  >                              
                        
                        <Link to="/newOrder">
                            <button className=" btn-success my-button">Створити заказ</button>
                        </Link>

                    </div>

        

                <br/>
               
                <hr/>
                {myTable}   
            </div>
        );
    }

}

export default AdminMainPage;