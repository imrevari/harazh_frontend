import React, {Component} from 'react';
import axios from 'axios';
import ShowCustomer from '../../components/Customer/ShowCustomer'
import {RingLoader} from "react-spinners"

class NewOrder extends Component{

    constructor(props) {
        super(props);
        document.title = 'Новий Заказ - Г а р а ж';

        // console.log(props);
    }

    orderId = '';

    state = {
        customerIsPresent: false,
        carIsPresent: false,
        customer: {
            id: '',
            firstName: '',
            lastName: '',
            telNumber: '',
            email:  '',
            listOfCars: []
        },
        car: {
             id: '',
            vinCode: '',
            licencePlate: '',
            carMade: ''
        },
        amountPayedInAdvance: {
            value: '',
            isValid: true,
            message: ''
        },
        problem: {
            value: '',
            isValid: true,
            message: ''
        },
        disabled: false  
    };

    newCustomer = () => {
        // console.log('new ');
        let id = this.state.car.id === '' ? 0 : this.state.car.id;
        this.props.history.push("/creatingCustomer/" + id);
    }

    customerFromList = () => {
        // console.log(this.state.car.id);
        let id = this.state.car.id === '' ? 0 : this.state.car.id;
        this.props.history.push("/customerList/" + id);
    }


    newCar = () => {
        // console.log('new car');
        let id = this.state.customer.id === '' ? 0 : this.state.customer.id;
        this.props.history.push("/creatingCar/" + id);
    }

    carFromList = () => {
        // console.log(this.state.customer.id);
        let id = this.state.customer.id === '' ? 0 : this.state.customer.id;
        this.props.history.push("/carList/" + id);
    }


    carsOfTheCustomr = () => {
        // console.log(this.state.customer.id);
        let id = this.state.customer.id === '' ? 0 : this.state.customer.id;
        this.props.history.push({
            pathname: "/carList/" + id,
            state: {
                cars: this.state.customer.listOfCars
            }
        })
    }


    componentDidMount(){

        if (this.props.match.params.car){

            if(this.props.match.params.car !== '0'){
                // console.log('getting car info')
                this.getCarByParamId();
            }

            if(this.props.match.params.cust !== '0'){
                // console.log('getting customer info')
                this.getCustomerByParamId();
                
            }
        }
    }

    getCustomerByParamId = () => {
        axios.get('/cust_for_order/' + this.props.match.params.cust)
            .then((response) => {
                // console.log(response)
                const updatedProductForm = {
                    ...this.state.customer
                };

                for (let field in response.data) {
                    let updatedFormElement = response.data[field];
                    updatedProductForm[field] = updatedFormElement;
                }

                this.setState({...this.state, customer: updatedProductForm,
                    customerIsPresent: true});
            })
            .catch(error => {
                this.setState(() => {
                    throw error;
                })
            })
    };

    getCarByParamId = () => {
        axios.get('/cars/id/' + this.props.match.params.car)
            .then((response) => {
                const updatedProductForm = {
                    ...this.state.car
                };

                for (let field in response.data) {
                    let updatedFormElement = response.data[field];
                    updatedProductForm[field] = updatedFormElement;
                }

                this.setState({...this.state, car: updatedProductForm,
                    carIsPresent: true});
            })
            .catch(error => {
                this.setState(() => {
                    throw error;
                })
            })
    };


    inputChangeHandlerOfProblem = (event) => {
        const target = event.target;
        const updatedCustomerForm = {
            ...this.state.problem
        };

        let value;
        value = target.value;

        updatedCustomerForm.value = value;
        updatedCustomerForm.isValid = true;
        

        this.setState({...this.state, problem: updatedCustomerForm});

    };

    inputChangeHandlerOfAmount = (event) => {
        const target = event.target;
        const updatedCustomerForm = {
            ...this.state.amountPayedInAdvance
        };

        let value;
        value = target.value;

        updatedCustomerForm.value = value;
        updatedCustomerForm.isValid = true;
        

        this.setState({...this.state, amountPayedInAdvance: updatedCustomerForm});

    };



    postDataHandler = (event) => {
        event.preventDefault();
        this.setState({...this.state, disabled: true})
        const formData = {};
        formData.customer = this.state.customer.id;
        formData.car = this.state.car.id;
        formData.amountPayedInAdvance = this.state.amountPayedInAdvance.value;
        formData.problem = this.state.problem.value;

        // console.log(formData);

        let url = '/orders';
        let method = 'post';
      
        axios({method: method, url: url, data: formData})
            .then((response) => {
                this.orderId = response.data.id;
                this.setState({
                    customerIsPresent: false,
                    carIsPresent: false,
                    customer: {
                        id: '',
                        firstName: '',
                        lastName: '',
                        telNumber: '',
                        email:  '',
                        listOfCars: []
                    },
                    car: {
                        id: '',
                        vinCode: '',
                        licencePlate: '',
                        carMade: ''
                    },
                    amountPayedInAdvance: {
                        value: '',
                        isValid: true,
                        message: ''
                    },
                    problem: {
                        value: '',
                        isValid: true,
                        message: ''
                    }
                })
            })
            .then(() => {
                this.props.history.push('/order/' + this.orderId);
                setTimeout(this.hideMessage, 1500);
            })
            .catch(error => {
                //  console.log(error.response.data);
                if (error.response.data.hasOwnProperty("fieldErrors")) {
                    this.validationHandler(error);
                } else {
                    this.setState(() => {
                        throw error;
                    })
                }
            });
    };



    hideMessage = () => {
        this.setState({
            ...this.state,
            emailSent: false
        })
    };

    validationHandler = (error) => {
        const updatedCategoryForm = {
            ...this.state.problem
        };
        updatedCategoryForm.isValid = true;
        updatedCategoryForm.message = '';
   
        if (error.response.data.hasOwnProperty('fieldErrors')) {
            for (let fieldError of error.response.data.fieldErrors) {
                if (fieldError.field === 'problem')
               
                updatedCategoryForm.isValid = false;
                updatedCategoryForm.message = fieldError.message;
               
            }

            this.setState({ ...this.state, problem: updatedCategoryForm, disabled: false});
        } else {
            this.setState({
                ...this.state,
                newPartForm: {
                    name: {
                        value: '',
                        isValid: false,
                        message: 'Please don\'t mess with my input fields'
                    }
                },
                disabled: false
            })
        }
    };

    render() {
        return (
            <div className="container ">
                <h2> {this.props.match.params.id != null ? "Змынити" : "Новий"} Заказ </h2>
                <hr/>
                <br/>
                <form onSubmit={this.postDataHandler}>
                    <RingLoader  color={"red"} loading={this.state.disabled} size={150} />
                    <div className="form-group try-border" >
                        <label
                            className={ "control-label label-for-buttons"}><h4>Клiент:</h4>
                            </label>

                            <button className={this.state.customerIsPresent ? "toHide" : "button-for-new-order"}
                            onClick={this.newCustomer}
                            disabled={this.state.disabled}>Створити</button>

                            <button className={this.state.customerIsPresent ? "toHide" : "button-for-new-order"}
                            onClick={this.customerFromList}
                            disabled={this.state.disabled}>Добавити з списка</button>

                            {this.state.customerIsPresent ? <ShowCustomer 
                            name={this.state.customer.firstName + ' ' + this.state.customer.lastName}/> : ""}

                    </div>

                    <br/>

                    <div className="form-group try-border">
                        <label
                            className={ "control-label label-for-buttons"}><h4>Машина:</h4>
                            </label>

                            <button className={this.state.carIsPresent ? "toHide" : 
                            (this.state.customer.listOfCars.length > 0 ? "toHide" : "button-for-new-order")}
                            onClick={this.newCar}
                            disabled={this.state.disabled}>Створити</button>

                            <button className={this.state.carIsPresent ? "toHide" : "button-for-new-order"}
                            onClick={this.carFromList}
                            disabled={this.state.disabled}>Добавити з списка</button>

                            <button 
                                className=
                                    {this.state.customer.listOfCars.length === 0 || this.state.carIsPresent ? "toHide" : "button-for-new-order"}
                            onClick={this.carsOfTheCustomr}
                            disabled={this.state.disabled}>Авто кліента</button>

                            {this.state.carIsPresent ? <ShowCustomer 
                            name={this.state.car.licencePlate}/> : ""}

                    </div>


                    <div className="form-group">
                        <label
                            className={this.state.amountPayedInAdvance.isValid ? "control-label label-for-buttons" : "control-label input-label invalid-label"}>
                                Сума предоплати:</label>
                        <input
                            className={this.state.amountPayedInAdvance.isValid ? "form-control my-input-field" : "form-control my-input-field is-invalid"}
                            id="amountPayedInAdvance"
                            name="amountPayedInAdvance"
                            disabled={this.state.disabled}
                            type="number"
                            step="0.01"
                            min="0"
                            value={this.state.amountPayedInAdvance.value}
                            onChange={this.inputChangeHandlerOfAmount}
                        />
                        <span className="form-text invalid-feedback">{this.state.amountPayedInAdvance.message}</span>
                    </div>

                    <div className="form-group">
                        <label
                            className={this.state.problem.isValid ? "control-label label-2" : "control-label input-label invalid-label"}>
                                Описанie проблеми:</label>
                        <textarea className={"my-textarea"}
                            // className={this.state.problem.isValid ? "form-control my-input-field" : "form-control my-input-field is-invalid"}
                            type="text"
                            id="problem"
                            name="problem"
                            disabled={this.state.disabled}
                            value={this.state.problem.value}
                            onChange={this.inputChangeHandlerOfProblem}
                        />
                        <span className="form-text invalid-feedback">{this.state.problem.message}</span>
                    </div>
                    
                    <br/>
                    <button className="btn btn-info my-button" type="submit" key="submit" disabled={this.state.disabled}>Сохранити</button>

                    <button className=" btn btn-danger my-button" key='cancel' type="button" disabled={this.state.disabled} onClick={this.props.history.goBack}>Отмена</button>

                   
                </form>
            </div>
        )
    }




}

export default NewOrder;