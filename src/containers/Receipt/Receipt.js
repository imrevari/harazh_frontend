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
        },
        customerName: '',
        edit: false
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
                        let name = ''
                        for (let field in response.data) {
                            if(field === 'customer'){
                                name = response.data[field].firstName + ' ' + response.data[field].lastName
                            }
                            let updatedFormElement = {
                                ...updatedProductForm[field]
                            };
                            updatedFormElement = response.data[field];
                            updatedProductForm[field] = updatedFormElement;
                        }
                        updatedProductForm.amountToPay = this.amountToPay;
                        
                        this.setState({...this.state, order: updatedProductForm, customerName: name});
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

    totalToPay = () =>{
        let total = 0;
        const works = [...this.state.order.works]
        const parts = [...this.state.order.partCounts]
        
        works.map(item => 
            total = total + (item.price * 1)
        )

        parts.map(item =>
            total = total + (item.retailPrice * item.amount)
        )
        return total
    }

    updatePrice(value, id, type){
        let stateCopy = {...this.state.order}
        if(type === 'work'){
            stateCopy.works = stateCopy.works.map(item => {
                if(item.id === id){
                    return {...item, price: value}
                }else{
                    return item
                }   
            })
        }else if(type === 'part'){
            stateCopy.partCounts = stateCopy.partCounts.map(item => {
                if(item.id === id){
                    return {...item, retailPrice: value}
                }else{
                    return item
                }   
            })
        }
        this.setState({...this.state, order: stateCopy})
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            this.getOrderByParamsId();
        }
        //this.state.order.customer.firstName + ' ' + this.state.order.customer.lastName
    }

    setName(name){
        this.setState({...this.state, customerName: name})
    }

    render() {

        const workBody = this.state.order.works.map( (item, index) => {
            return (
                <ListForReceipt 
                    key={item.id}
                    editable={this.state.edit}
                    id  ={index + 1}
                    name={item.workName}
                    price={item.price}
                    amount={1}
                    updatePrice={(value) => this.updatePrice(value, item.id, 'work')}
                />
            )
        });

        const partBody = this.state.order.partCounts.map( (item, index) => {
            return (
                <ListForReceipt
                    key={item.id}
                    editable={this.state.edit}
                    id  ={index + 1 + this.state.order.works.length}
                    name={item.partName}
                    amount={item.amount}
                    price={item.retailPrice}
                    updatePrice={(value) => this.updatePrice(value, item.id, 'part')}
                />
            )
        });

        const endingPart =  
                <tr border="0" >
                    <td  border="0" colSpan={"3"}></td>
                    <td className="price" align="left">Підсумок</td>
                    
                    <td className="price"><b>{this.totalToPay().toLocaleString(undefined, {maximumFractionDigits:2}) + ' грн.'} </b></td>
                </tr>

        const nameInputField = <input 
                        name="name"
                        value={this.state.customerName}
                        onChange={ (event) => this.setName(event.target.value)}
                    />



        const workBlock = ( 
            
            <table border="1" >
                <thead>
                    <tr>
                        <th className="" >№ з/п</th>
                        <th className="" >Назва товарів, робіт</th>
                        <th className="" >Кiлькiсть</th> 
                        <th className="" >Цiна</th>
                        <th className="" >Сумма</th>
                    </tr>
                </thead>
                <tbody>
                    {workBody}
                    {partBody}
                    {endingPart}
                </tbody>
            </table>
        

        );

        const customerBlock = (   
            <table border="0" >
                <tbody>
                    <tr>
                        <td className="">
                            <h4 align="left" >Кому відпущено:</h4>
                        </td>
                        <td className="">
                            <h4>{this.state.edit ? nameInputField : this.state.customerName}</h4>
                        </td>
                    </tr>
                </tbody>
            </table>
        );

        return (

            <div >
                <div align="left">
                    <button onClick={() => {
                            this.setState({...this.state, edit: !this.state.edit
                            });
                        }
                    }>{this.state.edit ? "Сохранити" : 'Редактіровати'} </button>
                </div>
                
                <h2 className=" ">НАКЛАДНА N: {this.state.order.id}</h2>
                <br/>
                <h4 className=" ">від {date.format(new Date(this.state.order.orderClosed), 'DD. MM. YYYY')} p.</h4>
                {/* <h4 className=" ">від {formatDate(this.state.order.orderClosed, ukr)} p.</h4> */}
                
                    
                <h3 align="left">СТО “ГАРАЖ“</h3>
                <h4 align="left">м. Хуст, вул. Івана Франка, 197</h4> 
                <h4 align="left">тел. 097-900-80-59</h4>
                
                
                {customerBlock}
                {/* {blankCell} */}
                <br/>
                {workBlock}
                <br/>
                <br/>
                <h4 align="left">Директор </h4>
               

            </div>

        )
    }




}

export default Receipt;