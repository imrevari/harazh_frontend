import React, {Component} from 'react';
import axios from 'axios';
import {RingLoader} from "react-spinners"

class AddCarPartToOrder extends Component{

    constructor(props) {
        super(props);
        document.title = 'Додати запчасть - Г а р а ж';
        //console.log(props);
    }

    state = {
        part: {
            id: '',
	        name: '',
	        description: '',
	        retailPrice: ''
        },

        amount: 1,
        totalPrice: '',
        disabled: false 
    };

    inputChangeHandler = (event) => {
        const target = event.target;

        const price = this.state.part.retailPrice

        // console.log(price)

        let newAmount = target.value;


        const amountInt = parseInt(newAmount);
        const priceInt = parseInt(price);
        const total = amountInt * priceInt;
        
        this.setState({...this.state, amount: newAmount,
            totalPrice: total});
    };


    postDataHandler = (event) => {
        event.preventDefault();
        this.setState({...this.state, disabled: true})
        const formData = {};

        formData.partId = this.state.part.id;
        formData.amount = this.state.amount;

        const orderId = this.props.match.params.order;

        let url = '/orders/part/' + orderId;
        let method = 'post';

        axios({method: method, url: url, data: formData})
            .then(() => {
                this.setState({
                    part: {
                        id: '',
                        name: '',
                        description: '',
                        retailPrice: ''
                    },
            
                    amount: 1,
                    totalPrice: ''
                })
            })
            .then(() => {
                this.props.history.push('/order/' + orderId);
                
            })
            .catch(error => {
                this.setState(() => {
                    throw error;
                })
            });
    };





    getPartByParamsId = () => {
        axios.get('/parts/' + this.props.match.params.part)
            .then((response) => {
                // console.log(response.data)

                const updatedProductForm = {
                    ...this.state.part
                };

                for (let field in response.data) {
                    let updatedFormElement = {
                        ...updatedProductForm[field]
                    };
                    updatedFormElement = response.data[field];
                    updatedProductForm[field] = updatedFormElement;
                }

                this.setState({...this.state, part: updatedProductForm,
                    totalPrice: response.data.retailPrice});
            })
            .catch(error => {
                this.setState(() => {
                    throw error;
                })
            })
    };




    componentDidMount() {

        if (this.props.match.params.part) {
            // console.log('calling get ' + this.props.match.params.part)
            this.getPartByParamsId();
        }
    }




    render() {
        // console.log('adding part ' + this.props.match.params.part + ' to order ' + this.props.match.params.order) 
        return (
            <div className="container">
                <h2> Додаю запчасть</h2>
                <hr/>
                <br/>
                <form onSubmit={this.postDataHandler}>
                    <RingLoader  color={"red"} loading={this.state.disabled} size={150} />
                    <div className="form-group">
                        <label
                            className={"control-label input-label"}>
                        Назва запчастi:</label>
                        <input disabled
                            className={ "form-control my-input-field" }
                            name="name"
                            value={this.state.part.name}
                        />
                    </div>
                    <div className="form-group">
                        <label
                            className={"control-label textarea-lable"}>Описанiе:</label>
              
                        <textarea className={"my-textarea"}
                            disabled
                            type="text"
                            name="description"
                            value={this.state.part.description}
                        />
                    </div>
                    <div className="form-group ">
                        <label
                            className={"control-label input-label"}>Цiна запчастей:</label>
                        <input disabled
                            className={"form-control my-input-field"}
                            type="number"
                            step="0.01"
                            min="0.01"
                            id="retailPrice"
                            name="retailPrice"
                            value={this.state.totalPrice ? this.state.totalPrice : this.state.part.retailPrice}
                        />
                    </div>

                    <div className="form-group">
                        <label
                            className={ "control-label input-label" }>Колiчество запчастей:</label>
                        <input
                            className={ "form-control my-input-field"}
                            type="number"
                            step="1"
                            min="1"
                            id="amount"
                            name="amount"
                            disabled={this.state.disabled}
                            value={this.state.amount}
                            onChange={this.inputChangeHandler}
                        />
                    </div>
                    
                    <br/>
                    <button className="btn btn-info my-button" type="submit" key="submit" disabled={this.state.disabled}>Додати</button>

                    <button className=" btn btn-danger my-button" key='cancel' type="button" disabled={this.state.disabled} onClick={this.props.history.goBack}>Отмена</button>
                </form>
            </div>
        )
    }






}

export default AddCarPartToOrder;