import React, {Component} from 'react';
import axios from 'axios';
import {RingLoader} from "react-spinners"
class AddCustomer extends Component{

    constructor(props) {
        super(props);
        document.title = 'Новий Клiент - Г а р а ж';
        // console.log(props);
    }

    state = {
        newCustomerForm: {
            firstName: {
                value: '',
                isValid: true,
                message: ''
            },
            lastName: {
                value: '',
                isValid: true,
                message: ''
            },
            telNumber: {
                value: '+380',
                isValid: true,
                message: ''
            },
            email: {
                value: '',
                isValid: true,
                message: ''
            }
        },
        disabled: false
    };

    inputChangeHandler = (event) => {
        const target = event.target;
        const updatedCustomerForm = {
            ...this.state.newCustomerForm
        };
        const updatedFormElement = {
            ...updatedCustomerForm[target.name]
        };

        let value;
        value = target.value;

        updatedFormElement.value = value;
        updatedFormElement.isValid = true;
        updatedCustomerForm[target.name] = updatedFormElement;

        this.setState({...this.state, newCustomerForm: updatedCustomerForm});

    };

    postDataHandler = (event) => {
        event.preventDefault();
        this.setState({...this.state, disabled: true})
        const formData = {};
        for (let formElementIdentifier in this.state.newCustomerForm) {
            formData[formElementIdentifier] = this.state.newCustomerForm[formElementIdentifier].value;
        }

        let url = '/';
        let method = 'post';
        const id = this.props.match.params.id;
        const car = this.props.match.params.car ? 
        this.props.match.params.car :
        (typeof(this.props.location.state) === 'undefined' ? false :
            (this.props.location.state.car ? this.props.location.state.car : false)
        )

        if (id) {
            url += id;
            method = 'put';
            formData['id'] = id;
        }

        if(car){
            axios({method: method, url: url, data: formData})
            .then((response) => {
                // console.log(response);
                setTimeout(() => { 
                    this.props.history.push('/newOrder/' + response.data.id + '/' + car);
                 }, 100);
                this.setState({...this.state})
            })
            .catch(error => {
                // console.log(error.response);
                if (error.response.data.hasOwnProperty("fieldErrors")) {
                    this.validationHandler(error);
                } else {
                    this.setState(() => {
                        throw error;
                    })
                }
            });
        }else{
            axios({method: method, url: url, data: formData})
            .then(() => {
                setTimeout(() => { 
                    this.props.history.push('/customerList')
                 }, 500);
                this.setState({...this.state})
            })
            .catch(error => {
                // console.log(error.response);
                if (error.response.data.hasOwnProperty("fieldErrors")) {
                    this.validationHandler(error);
                } else {
                    this.setState(() => {
                        throw error;
                    })
                }
            });
        }


        
    };

    validationHandler = (error) => {
        const updatedCategoryForm = {
            ...this.state.newCustomerForm
        };

        for (let field in this.state.newCustomerForm) {
            const updatedFormElement = {
                ...updatedCategoryForm[field]
            };
            updatedFormElement.isValid = true;
            updatedFormElement.message = '';
            updatedCategoryForm[field] = updatedFormElement;
        }

        if (error.response.data.hasOwnProperty('fieldErrors')) {
            for (let fieldError of error.response.data.fieldErrors) {
                const updatedFormElement = {
                    ...updatedCategoryForm[fieldError.field]
                };
                updatedFormElement.isValid = false;
                updatedFormElement.message = fieldError.message;
                updatedCategoryForm[fieldError.field] = updatedFormElement;
            }

            this.setState({...this.state, newCustomerForm: updatedCategoryForm, disabled: false});
        } else {
            this.setState({
                ...this.state,
                newCustomerForm: {
                    firstName: {
                        value: '',
                        isValid: false,
                        message: 'Please don\'t mess with my input fields'
                    }
                },
                disabled: false
            })
        }
    };

    getCustomerByParamsId = () => {
        axios.get('/' + this.props.match.params.id)
            .then((response) => {
                const updatedProductForm = {
                    ...this.state.newCustomerForm
                };

                for (let field in response.data) {
                    const updatedFormElement = {
                        ...updatedProductForm[field]
                    };
                    updatedFormElement.value = response.data[field];
                    updatedProductForm[field] = updatedFormElement;
                }

                this.setState({...this.state, newCustomerForm: updatedProductForm});
            })
            .catch(error => {
                this.setState(() => {
                    throw error;
                })
            })
    };

    componentDidMount() {
        
        if (this.props.match.params.id) {
            
            this.getCustomerByParamsId();
        }
        else if(this.props.location.state){
            const newName = this.props.location.state.newName
            const nameArray = newName.split(' ')
            this.updateName(nameArray) 
        }
    }

    updateName(nameArray){
        const updatableCustomerForm = {
            ...this.state.newCustomerForm
        };
        updatableCustomerForm['firstName'].value = nameArray[0];
        if(nameArray.length > 1){
            updatableCustomerForm['lastName'].value = nameArray[1];
        }
        this.setState({...this.state, newCustomerForm: updatableCustomerForm});
    }






    render() {
        const saveOrSaveAndNeworder = this.props.match.params.car ? 
        true :
        (typeof(this.props.location.state) === 'undefined' ? false : (this.props.location.state.car ? true : false))

        return (
            <div className="container">
                <h2> {this.props.match.params.id != null ? "Змiнити" : "Новий"} Клiент{this.props.match.params.id != null ? "а" : ""}</h2>
                <hr/>
                <br/>
                <form onSubmit={this.postDataHandler}>
                    <RingLoader  color={"red"} loading={this.state.disabled} size={150} />
                    <div className="form-group">
                        <label
                            className={this.state.newCustomerForm.firstName.isValid ? "control-label input-label" : "control-label input-label invalid-label"}>
                            Iм'я:</label>
                        <input
                            className={this.state.newCustomerForm.firstName.isValid ? "form-control my-input-field" : "form-control my-input-field is-invalid"}
                            name="firstName"
                            disabled={this.state.disabled}
                            value={this.state.newCustomerForm.firstName.value}
                            onChange={this.inputChangeHandler}
                        />
                        <span className="form-text invalid-feedback">{this.state.newCustomerForm.firstName.message}</span>
                    </div>
                    <div className="form-group">
                        <label
                            className={this.state.newCustomerForm.lastName.isValid ? "control-label input-label" : "control-label input-label invalid-label"}>Фамiлiя:</label>
                        <input
                            className={this.state.newCustomerForm.lastName.isValid ? "form-control my-input-field" : "form-control my-input-field is-invalid"}
                            name="lastName"
                            disabled={this.state.disabled}
                            value={this.state.newCustomerForm.lastName.value}
                            onChange={this.inputChangeHandler}
                        />
                        <span className="form-text invalid-feedback">{this.state.newCustomerForm.lastName.message}</span>
                    </div>
                    <div className="form-group">
                        <label
                            className={this.state.newCustomerForm.telNumber.isValid ? "control-label input-label" : "control-label input-label invalid-label"}>Тел.:</label>
                        <input
                            className={this.state.newCustomerForm.telNumber.isValid ? "form-control my-input-field" : "form-control my-input-field is-invalid"}
                            id="telNumber"
                            name="telNumber"
                            disabled={this.state.disabled}  
                            value={this.state.newCustomerForm.telNumber.value}
                            onChange={this.inputChangeHandler}
                        />
                        <span className="form-text invalid-feedback">{this.state.newCustomerForm.telNumber.message}</span>
                    </div>

                    <div className="form-group">
                        <label
                            className={this.state.newCustomerForm.email.isValid ? "control-label input-label" : "control-label input-label invalid-label"}>email:</label>
                        <input
                            className={this.state.newCustomerForm.email.isValid ? "form-control my-input-field" : "form-control my-input-field is-invalid"}
                            type="email"
                            id="email"
                            name="email"
                            disabled={this.state.disabled}
                            value={this.state.newCustomerForm.email.value}
                            onChange={this.inputChangeHandler}
                        />
                        <span className="form-text invalid-feedback">{this.state.newCustomerForm.email.message}</span>
                    </div>
                    
                    <br/>
                    <button className="btn btn-info my-button" type="submit" key="submit" disabled={this.state.disabled}>
                        {saveOrSaveAndNeworder ? 'Сохранити і добавити' : 'Сохранити'}
                    </button>

                    <button className=" btn btn-danger my-button" key='cancel' type="button" disabled={this.state.disabled} onClick={this.props.history.goBack}>Отмена</button>

                   
                </form>
            </div>
        )
    }


}

export default AddCustomer;