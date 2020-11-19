import React, {Component} from 'react';
import axios from 'axios';

class AddCar extends Component{

    constructor(props) {
        super(props);
        document.title = 'Нова Машина - Г а р а ж';

        // console.log(props);
    }

    state = {
        newCarForm: {
            vinCode: {
                value: '',
                isValid: true,
                message: ''
            },
            licencePlate: {
                value: '',
                isValid: true,
                message: ''
            },
            carMade: {
                value: '',
                isValid: true,
                message: ''
            }
        }
    };

    inputChangeHandler = (event) => {
        const target = event.target;
        const updatedCarForm = {
            ...this.state.newCarForm
        };
        const updatedFormElement = {
            ...updatedCarForm[target.name]
        };

        let value;
        value = target.value;

        if (target.name === 'carMade'){
            updatedFormElement.value = value.toUpperCase();
        }else{
            updatedFormElement.value = value;
        }
        updatedFormElement.isValid = true;
        updatedCarForm[target.name] = updatedFormElement;

        this.setState({...this.state, newCarForm: updatedCarForm});

    };


    postDataHandler = (event) => {
        event.preventDefault();

        const formData = {};
        for (let formElementIdentifier in this.state.newCarForm) {
            formData[formElementIdentifier] = this.state.newCarForm[formElementIdentifier].value;
        }


        let url = '/cars';
        let method = 'post';
        const id = this.props.match.params.id;
        const cust = this.props.match.params.cust;
        if (id) {
            url += '/' + id;
            method = 'put';
        }

        // console.log(method + ' ' + url);
        // console.log(formData);

        if (cust){
            axios({method: method, url: url, data: formData})
            .then((response) => {
                // console.log(response);
                this.props.history.push('/newOrder/' + cust + '/' + response.data.id);
                setTimeout(this.hideMessage, 1500);
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
                this.setState({
                    newCarForm: {
                        vinCode: {
                            value: '',
                            isValid: true,
                            message: ''
                        },
                        licencePlate: {
                            value: '',
                            isValid: true,
                            message: ''
                        },
                        carMade: {
                            value: '',
                            isValid: true,
                            message: ''
                        }
                    }
                })
            })
            .then(() => {
                this.props.history.push('/carList');
                setTimeout(this.hideMessage, 1500);
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


    hideMessage = () => {
        this.setState({
            ...this.state,
            emailSent: false
        })
    };

    validationHandler = (error) => {
        const updatedCategoryForm = {
            ...this.state.newCarForm
        };

        for (let field in this.state.newCarForm) {
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

            this.setState({...this.state, newCarForm: updatedCategoryForm});
        } else {
            this.setState({
                ...this.state,
                newCarForm: {
                    vinCode: {
                        value: '',
                        isValid: false,
                        message: 'Please don\'t mess with my input fields'
                    }
                }
            })
        }
    };


    getCarByParamsId = () => {
        axios.get('/cars/id/' + this.props.match.params.id)
            .then((response) => {
              
                const updatedProductForm = {
                    ...this.state.newCarForm
                };

                for (let field in response.data) {
                    const updatedFormElement = {
                        ...updatedProductForm[field]
                    };
                    updatedFormElement.value = response.data[field];
                    updatedProductForm[field] = updatedFormElement;
                }

                this.setState({...this.state, newCarForm: updatedProductForm});
            })
            .catch(error => {
                this.setState(() => {
                    throw error;
                })
            })
    };

    componentDidMount() {

        if (this.props.match.params.id) {
            this.getCarByParamsId();
        }
    }

    




    render() {
        return (
            <div className="container">
                <h2> {this.props.match.params.id != null ? "Змiнити" : "Нова"} Машин{this.props.match.params.id != null ? "у" : "а"}</h2>
                <hr/>
                <br/>
                <form onSubmit={this.postDataHandler}>
                    <div className="form-group">
                        <label
                            className={this.state.newCarForm.carMade.isValid ? "control-label input-label" : "control-label input-label invalid-label"}>
                                Модель i марка:</label>
                        <input
                            className={this.state.newCarForm.carMade.isValid ? "form-control my-input-field" : "form-control my-input-field is-invalid"}
                            name="carMade"
                            value={this.state.newCarForm.carMade.value}
                            onChange={this.inputChangeHandler}
                        />
                        <span className="form-text invalid-feedback">{this.state.newCarForm.carMade.message}</span>
                    </div>
                    
                    <div className="form-group">
                        <label
                            className={this.state.newCarForm.licencePlate.isValid ? "control-label input-label" : "control-label input-label invalid-label"}>
                            Номерний знак:</label>
                        <input
                            className={this.state.newCarForm.licencePlate.isValid ? "form-control my-input-field" : "form-control my-input-field is-invalid"}
                            name="licencePlate"
                            value={this.state.newCarForm.licencePlate.value}
                            onChange={this.inputChangeHandler}
                        />
                        <span className="form-text invalid-feedback">{this.state.newCarForm.licencePlate.message}</span>
                    </div>
                    <div className="form-group">
                        <label
                            className={this.state.newCarForm.vinCode.isValid ? "control-label input-label" : "control-label input-label invalid-label"}>
                                VIN код:</label>
                        <input
                            className={this.state.newCarForm.vinCode.isValid ? "form-control my-input-field" : "form-control my-input-field is-invalid"}
                            name="vinCode"
                            value={this.state.newCarForm.vinCode.value}
                            onChange={this.inputChangeHandler}
                        />
                        <span className="form-text invalid-feedback">{this.state.newCarForm.vinCode.message}</span>
                    </div>
                    
                    
                    <br/>
                    <button className="btn btn-info my-button" type="submit" key="submit">Сохранити</button>

                    <button className=" btn btn-danger my-button" key='cancel' type="button" onClick={this.props.history.goBack}>Отмена</button>

                </form>

                
            </div>
        )
    }



}

export default AddCar;