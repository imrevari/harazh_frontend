import React, {Component} from 'react';
import axios from 'axios';
import ShowCustomer from '../../components/Customer/ShowCustomer'
import {RingLoader} from "react-spinners"
import './Order.css'

class TestNewOrder extends Component{

    constructor(props) {
        super(props);
        document.title = 'Новий Заказ - Г а р а ж';

        // console.log(props);
    }

    orderId = '';

    state = {
        customer: {
            id: '',
            firstName: '',
            lastName: '',
            telNumber: '+380',
            email:  '',
            listOfCars: [],
            error: false
        },
        car: {
            id: '',
            vinCode: '',
            licencePlate: '',
            carMade: '',
            error: false
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
        customers: [],
        cars: [],
        disabled: false  
    };

 


    componentDidMount(){
        this.getAllCustomers()
        this.getAllCars()
    }

    getAllCustomers = () => {
        axios.get('/' )
            .then((response) => {
                this.setState({...this.state, customers: response.data});
            })
            .catch(error => {
                this.setState(() => {
                    throw error;
                })
            })
    };

    getAllCars = () => {
        axios.get('/cars')
            .then((response) => {
                this.setState({...this.state, cars: response.data});
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

    inputChangeHandlerCustomer = (event) => {
        const target = event.target;
        const updatedCustomerForm = this.state.customer.id === '' ?
            {...this.state.customer}
            :
            {
                id: '',
                firstName: '',
                lastName: '',
                telNumber: '',
                email:  '',
                listOfCars: []
            }
        
        let value;
        value = target.value;
        updatedCustomerForm[target.name] = value;
        updatedCustomerForm.error = false

        this.setState({...this.state, customer: updatedCustomerForm});
    };

    inputChangeHandlerCar = (event) => {
        const target = event.target;
        const updatedCarForm = this.state.car.id === '' ?
            {...this.state.car}
            :
            {
                id: '',
                vinCode: '',
                licencePlate: '',
                carMade: ''
            }
        
        let value;
        value = target.value;
        updatedCarForm[target.name] = value.toUpperCase();
        updatedCarForm.error = false;

        this.setState({...this.state, car: updatedCarForm});
    };

    selectCustomer = (id) =>{
        const cust = this.state.customers.find(o => o.id === id)

        axios.get('/cust_for_order/' + id)
            .then((response) => {
                cust.listOfCars = response.data.listOfCars;
                this.setState({...this.state, customer: cust});
            })
            .catch(error => {
                this.setState(() => {
                    throw error;
                })
            })
    }

    selectCar = (id) =>{
        const car = this.state.cars.find(o => o.id === id)
        this.setState({...this.state, car: car});
    }

    postDataWithExistingCarAndCustomer = async () =>{
        const formData = {};
        formData.customer = this.state.customer.id;
        formData.car = this.state.car.id;
        formData.amountPayedInAdvance = this.state.amountPayedInAdvance.value;
        formData.problem = this.state.problem.value;

        await axios({method: 'post', url: '/orders', data: formData})
            .then((response) => {
                this.orderId = response.data.id;
                this.setState({
                    customer: {
                        id: '',
                        firstName: '',
                        lastName: '',
                        telNumber: '',
                        email:  '',
                        listOfCars: [],
                        error: false
                    },
                    car: {
                        id: '',
                        vinCode: '',
                        licencePlate: '',
                        carMade: '',
                        error: false
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
                if (error.response.data.hasOwnProperty("fieldErrors")) {
                    this.validationHandler(error);
                } else {
                    this.setState(() => {
                        throw error;
                    })
                }
            });
    }

    postNewCustomer = async () =>{
        let newCustomer = this.state.customer
        await axios({method: 'post', url: '/', data: newCustomer})
            .then((response) => {
                newCustomer['id'] = response.data.id;
                this.setState({...this.state, customer: newCustomer})
                console.log(this.state)
            })
            .catch(error => {
                if (error.response.data.hasOwnProperty("fieldErrors")) {
                    this.validationHandler(error);
                } else {
                    this.setState(() => {
                        throw error;
                    })
                }
            })
    }

    postNewCar = async () =>{
        let newCar = this.state.car
        await axios({method: 'post', url: '/cars', data: newCar})
            .then((response) => {
                newCar['id'] = response.data.id;
                this.setState({...this.state, car: newCar})
            })
            .catch(error => {
                if (error.response.data.hasOwnProperty("fieldErrors")) {
                    this.validationHandler(error);
                } else {
                    this.setState(() => {
                        throw error;
                    })
                }
            })
    }

    validationHandler = (error) => {
        const updatableProblem = {
            ...this.state.problem
        };
        updatableProblem.isValid = true;
        updatableProblem.message = '';
        
        let errorCar = {...this.state.car}
        let errorCustomer = {...this.state.customer}
   
        if (error.response.data.hasOwnProperty('fieldErrors')) {
            console.log(error.response.data.fieldErrors)
            for (let fieldError of error.response.data.fieldErrors) {
                if (fieldError.field === 'problem'){
                    updatableProblem.isValid = false;
                    updatableProblem.message = fieldError.message;
                }
                if(fieldError.field === 'licencePlate'){
                    errorCar.error = true
                }
                if(fieldError.field === 'firstName' || fieldError.field === 'telNumber'){
                    errorCustomer.error = true
                }
                
               
            }

            this.setState({ ...this.state, problem: updatableProblem, disabled: false, car: errorCar, customer: errorCustomer});
        } else {
            this.setState({
                ...this.state,
                    problem: {
                        value: '',
                        isValid: false,
                        message: 'Please don\'t mess with my input fields'
                    },
                    disabled: false
            })
        }
    };

    postDataHandler = (event) => {
        event.preventDefault();
        this.setState({...this.state, disabled: true})
        if(this.state.customer.id !== '' && this.state.car.id !== ''){
            this.postDataWithExistingCarAndCustomer()
        }else if(this.state.customer.id !== '' && this.state.car.id === ''){
            this.postNewCar()
            .then(() => this.postDataWithExistingCarAndCustomer())
        }else if(this.state.customer.id === '' && this.state.car.id !== ''){
            this.postNewCustomer()
            .then(() => this.postDataWithExistingCarAndCustomer())
        }else{
            this.postNewCustomer()
            .then(
                () => this.postNewCar()
                .then(
                    () => this.postDataWithExistingCarAndCustomer()
                )
            )
        }

    }
    
    render() {
        
        const firstNameSuggestionsList = (
            this.state.customer.firstName.length > 0 && this.state.customer.id === '' && this.state.customer.lastName.length === 0 ?
            <ul className={"suggestions"}>
                {this.state.customers.filter(
                    customer => 
                        customer.firstName.toLowerCase().includes(this.state.customer.firstName.toLowerCase())
                        ||
                        customer.lastName.toLowerCase().includes(this.state.customer.firstName.toLowerCase())
                ).filter(
                    (cust, index) =>
                        index < 7
                ).map(
                    filteredName => (
                        <li className={"suggestion-active"} key={filteredName.id} onClick={() => this.selectCustomer(filteredName.id)}>
                          {filteredName.firstName + ' ' + filteredName.lastName}
                        </li>
                ))
                }
            </ul>
            :
            ''
        )

        const lastNameSuggestionsList = (
            this.state.customer.lastName.length > 0 && this.state.customer.id === '' ?
            <ul className={"suggestions"}>
                {this.state.customers.filter(
                    customer => 
                        customer.firstName.toLowerCase().includes(this.state.customer.lastName.toLowerCase())
                        ||
                        customer.lastName.toLowerCase().includes(this.state.customer.lastName.toLowerCase())
                ).filter(
                    (cust, index) =>
                        index < 7
                ).map(
                    filteredName => (
                        <li className={"suggestion-active"} key={filteredName.id} onClick={() => this.selectCustomer(filteredName.id)}>
                          {filteredName.firstName + ' ' + filteredName.lastName}
                        </li>
                ))
                }
            </ul>
            :
            ''
        )

        const telNumberNameSuggestionsList = (
            this.state.customer.telNumber.length > 4 && this.state.customer.id === '' ?
            <ul className={"suggestions"}>
                {this.state.customers.filter(
                    customer => 
                        customer.telNumber.includes(this.state.customer.telNumber)
                ).filter(
                    (cust, index) =>
                        index < 7
                ).map(
                    filteredName => (
                        <li className={"suggestion-active"} key={filteredName.id} onClick={() => this.selectCustomer(filteredName.id)}>
                          {filteredName.telNumber}
                        </li>
                ))
                }
            </ul>
            :
            ''
        )

        const carMadeNameSuggestionsList = (
            this.state.customer.id !== '' && this.state.car.carMade.length === 0 ?
            <ul className={"suggestions"}>
                {this.state.customer.listOfCars.map(car => (
                    <li className={"suggestion-active"} key={car.id} onClick={() => this.selectCar(car.id)}>
                    {car.carMade + ' - ' + car.licencePlate}
                    </li>
                ))}
            </ul>
            :
            this.state.car.carMade.length > 0 && this.state.car.id === '' && this.state.car.licencePlate.length === 0 ?
                <ul className={"suggestions"}>
                    {this.state.cars.filter(
                        car => 
                            car.carMade.toUpperCase().includes(this.state.car.carMade.toUpperCase())
                    ).filter(
                        (_car, index) =>
                            index < 7
                    ).map(
                        filteredCar => (
                            <li className={"suggestion-active"} key={filteredCar.id} onClick={() => this.selectCar(filteredCar.id)}>
                            {filteredCar.carMade + ' - ' + filteredCar.licencePlate}
                            </li>
                    ))
                    }
                </ul>
                :
                ''
        )

        const licencePlateNameSuggestionsList = (
            this.state.car.licencePlate.length > 0 && this.state.car.id === '' ?
            <ul className={"suggestions"}>
                {this.state.cars.filter(
                    car => 
                        car.licencePlate.toUpperCase().includes(this.state.car.licencePlate.toUpperCase())
                ).filter(
                    (car, index) =>
                        index < 7
                ).map(
                    filteredCar => (
                        <li className={"suggestion-active"} key={filteredCar.id} onClick={() => this.selectCar(filteredCar.id)}>
                          {filteredCar.licencePlate + ' - ' + filteredCar.carMade}
                        </li>
                ))
                }
            </ul>
            :
            ''
        )

        return (
            <div className="container ">
                <h2>Новий Заказ </h2>
                <hr/>
                <br/>
                <form onSubmit={this.postDataHandler} autoComplete="off">
                    <RingLoader  color={"red"} loading={this.state.disabled} size={150} />
                    <table border="1">
                        <thead>
                            <tr >
                                <th className={"name "  + (this.state.customer.id  !== '' ? "green-color" : this.state.customer.error ? "red-color" : "") }>
                                <label><h4>Клiент:</h4>
                                </label>
                                </th>
                                <th className={"field"}>
                                    <div className="flex-container, align-items: flex-start" >
                                        <div className="">
                                            <label
                                                className={ "control-label input-label-order"}>
                                                Iм'я:</label>

                                            <input
                                            className={"form-control my-input-field-order"}
                                            name="firstName"
                                            disabled={this.state.disabled}
                                            value={this.state.customer.firstName}
                                            onChange={this.inputChangeHandlerCustomer}
                                            />
                                            {firstNameSuggestionsList}
                                            <span className="form-text invalid-feedback">{}</span>
                                        </div>

                                        <div className="">
                                            <label
                                                className={ "control-label input-label-order"}>
                                                Фамілія:</label>
                                            <input
                                                className={"form-control my-input-field-order"}
                                                name="lastName"
                                                disabled={this.state.disabled}
                                                value={this.state.customer.lastName}
                                                onChange={this.inputChangeHandlerCustomer}
                                            />
                                            {lastNameSuggestionsList}
                                            <span className="form-text invalid-feedback">{}</span>
                                        </div>

                                        <div className="">
                                            <label
                                                className={ "control-label input-label-order"}>
                                                Тел:</label>
                                            <input
                                                className={"form-control my-input-field-order"}
                                                name="telNumber"
                                                disabled={this.state.disabled}
                                                value={this.state.customer.telNumber}
                                                onChange={this.inputChangeHandlerCustomer}
                                            />
                                            {telNumberNameSuggestionsList}
                                            <span className="form-text invalid-feedback">{}</span>
                                        </div>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                    </table>

                    <br/>

                    <table border="1">
                        <thead>
                            <tr >
                                <th className={"name " + (this.state.car.id !== '' ? "green-color" : this.state.car.error ? "red-color" : "")}>
                                <label><h4>Авто:</h4>
                                </label>
                                </th>
                                <th className="field">
                                    <div className="flex-container, align-items: flex-start" >
                                        <div className="">
                                            <label
                                                className={ "control-label input-label-order"}>
                                                Модель i марка:</label>

                                            <input
                                            className={"form-control my-input-field-order"}
                                            name="carMade"
                                            disabled={this.state.disabled}
                                            value={this.state.car.carMade}
                                            onChange={this.inputChangeHandlerCar}
                                            />
                                            {carMadeNameSuggestionsList}
                                            <span className="form-text invalid-feedback">{}</span>
                                        </div>

                                        <div className="">
                                            <label
                                                className={ "control-label input-label-order"}>
                                                Номерний знак:</label>
                                            <input
                                                className={"form-control my-input-field-order"}
                                                name="licencePlate"
                                                disabled={this.state.disabled}
                                                value={this.state.car.licencePlate}
                                                onChange={this.inputChangeHandlerCar}
                                            />
                                            {licencePlateNameSuggestionsList}
                                            <span className="form-text invalid-feedback">{}</span>
                                        </div>

                                    </div>
                                </th>
                            </tr>
                        </thead>
                    </table>


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
                        <textarea 
                            className={this.state.problem.isValid ? "my-textarea" : "form-control my-input-field is-invalid"}
                            type="text"
                            id="problem"
                            name="problem"
                            disabled={this.state.disabled}
                            value={this.state.problem.value}
                            onChange={this.inputChangeHandlerOfProblem}
                        />
                        <span className="form-text invalid-feedback">{this.state.problem.message + "MI VAN?"} </span>
                    </div>
                    
                    <br/>
                    <button className="btn btn-info my-button" type="submit" key="submit" disabled={this.state.disabled}>Сохранити</button>

                    <button className=" btn btn-danger my-button" key='cancel' type="button" disabled={this.state.disabled} onClick={this.props.history.goBack}>Отмена</button>

                   
                </form>
            </div>
        )
    }




}

export default TestNewOrder;