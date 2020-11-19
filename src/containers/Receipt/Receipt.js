import React, {Component} from 'react';
import axios from 'axios';
import ListForReceipt from '../../components/ListForReceipt/ListForReceipt';
import date from 'date-and-time';


class Receipt extends Component{

    constructor(props) {
        super(props);
        document.title = 'Щот - Г а р а ж';
        //console.log(props);
    }


    amountToPay = 0;

    state = {
        order: {
            id: '', 
            customer: {
                firstName: '',
                lastName: '',
                telNumber: '',
                email: ''
            },
            car: {
                vinCode: '',
                licencePlate: '',
                carMade: ''
            },
            works: [],
            partCounts: [],
            orderOpened: '',
            orderClosed: '',
            payedFor: '',
            amountPayedInAdvance: '',
            problem: '',
            amountToPay: ''
        }
    };





    getOrderByParamsId = () => {

        axios.get('/orders/total_to_pay/' + this.props.match.params.id)
            .then((response) => {

                this.amountToPay = response.data;
            })
            .then(() => {
                    axios.get('/orders/' + this.props.match.params.id)
                    .then((response) => {
                        // console.log(response.data)
                        const updatedProductForm = {
                            ...this.state.order
                        };
        
                        for (let field in response.data) {
                            let updatedFormElement = {
                                ...updatedProductForm[field]
                            };
                            updatedFormElement = response.data[field];
                            updatedProductForm[field] = updatedFormElement;
                        }
                        updatedProductForm.amountToPay = this.amountToPay;
                        
                        this.setState({...this.state, order: updatedProductForm,
                            sortedFilteredListWork:  response.data.works,
                            sortedFilteredListPart: response.data.partCounts
                        });
                    })
                    .catch(error => {
                        this.setState(() => {
                            throw error;
                        })
                    })

                }
            )
            .catch(error => {
                this.setState(() => {
                    throw error;
                })
            })
        
    };

    componentDidMount() {

        if (this.props.match.params.id) {
            this.getOrderByParamsId();
        }
    }

    render() {


        const workBody = this.state.order.works.map( item => {

            return (
           
                <ListForReceipt 
                    key={item.id}
                    name={item.workName}
                    price={item.price}
                    amount={1}
                    totalPrice={item.price}
                />
                
            )
        });

        const partBody = this.state.order.partCounts.map( item => {

            return (
           
                <ListForReceipt
                    key={item.id}
                    name={item.partName}
                    price={item.retailPrice}
                    amount={item.amount}
                    totalPrice={item.retailPrice * item.amount}
                />
                
                
            )
        });

        const workBlock = ( 
            
            <table border="1" >
                <thead>
                    <tr>
                        <th className="" >Назва </th> 
                        <th className="" >цiна за одиницю</th>
                        <th className="" >кiлькiсть</th>
                        <th className="" >цiна разом</th>
                    </tr>
                </thead>
                <tbody>
                    {workBody}
                    {partBody}  
                </tbody>
            </table>
        

        );

        const headerBlock = ( 
            
            <table border="1" >
                <tbody>
                    <tr>
                        <td className="">Клiент</td>
                        <td className=""><h5>{this.state.order.customer.firstName + ' ' + this.state.order.customer.lastName}</h5></td>
                    </tr>

                    <tr>
                        <td className="">Авто</td>
                        <td className=""><h5> {this.state.order.car.carMade + ' / ' + this.state.order.car.licencePlate + ' / ' + this.state.order.car.vinCode}</h5></td>
                    </tr>

                    <tr>
                        <td className="">проблема</td>
                        <td className=""><h5>{this.state.order.problem}</h5></td>
                    </tr>

                    <tr>
                        <td className="">правили од</td>
                        <td className=""><h5>{date.format(new Date(this.state.order.orderOpened), 'DD. MM. YYYY. - HH:mm')}</h5></td>
                    </tr>

                    <tr>
                        <td className="">правили до</td>
                        <td className=""><h5> {date.format(new Date(this.state.order.orderClosed), 'DD. MM. YYYY. - HH:mm')} </h5></td>
                    </tr>

                    
                </tbody>
            </table>
            

        );

        const blankCell = ( 
            
            <table border="1" >
                <tbody>
                    <tr>
                        <td className=""><h2> </h2></td>
                    </tr>
                </tbody>
            </table>
            

        );



       


        return (

            <div >
                <div className="for-div">
                    <h3 className="tt1">Заказ: {this.state.order.id}</h3>
                </div>
            
                <br/>
                <br/>
                <h2 className=" "> Щот:</h2>
                
                {headerBlock}
                {blankCell}
                {workBlock}

                <h4 className=" "> {this.state.order.amountToPay.toLocaleString(undefined, {maximumFractionDigits:2})} </h4>
               

            </div>

            

        )
    }




}

export default Receipt;