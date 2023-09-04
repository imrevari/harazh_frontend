import React, {Component} from 'react';
import axios from 'axios';
import {RingLoader} from "react-spinners"

class AddPart extends Component{

    constructor(props) {
        super(props);
        document.title = 'Нова запчасть - Г а р а ж';
        // console.log(props);
    }

    state = {
        newPartForm: {
            name: {
                value: '',
                isValid: true,
                message: ''
            },
            description: {
                value: '',
                isValid: true,
                message: ''
            },
            retailPrice: {
                value: '',
                isValid: true,
                message: ''
            },
            purchasePrice: {
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
            ...this.state.newPartForm
        };
        const updatedFormElement = {
            ...updatedCustomerForm[target.name]
        };

        let value;
        value = target.value;

        updatedFormElement.value = value;
        updatedFormElement.isValid = true;
        updatedCustomerForm[target.name] = updatedFormElement;

        this.setState({...this.state, newPartForm: updatedCustomerForm});

    };


    postDataHandler = (event) => {
        event.preventDefault();
        this.setState({...this.state, disabled: true})
        const formData = {};
        for (let formElementIdentifier in this.state.newPartForm) {
            formData[formElementIdentifier] = this.state.newPartForm[formElementIdentifier].value;
        }

        let url = '/parts';
        let method = 'post';
        const id = this.props.match.params.id;
        if (id) {
            url += '/' + id;
            method = 'put';
        }

        axios({method: method, url: url, data: formData})
            .then((response) => {
                if(typeof(this.props.location.state) !== 'undefined' && this.props.location.state.orderId){
                    const partId = response.data.id
                    const orderId = this.props.location.state.orderId
                    //this.addWorkToOrder(workId, orderId)
                    setTimeout(() => { 
                        this.props.history.push("/addCarPartCout/" + orderId + '/' + partId)
                     }, 1000);
                }else{
                    setTimeout(() => { 
                        this.props.history.push('/partsList');
                     }, 1500);
                }
                this.setState({...this.state})
            })
            .catch(error => {
                console.log(error);
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
        
    };

    validationHandler = (error) => {
        const updatedCategoryForm = {
            ...this.state.newPartForm
        };

        for (let field in this.state.newPartForm) {
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

            this.setState({...this.state, newPartForm: updatedCategoryForm, disabled: false});
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

    getPartByParamsId = () => {
        axios.get('/parts/id/' + this.props.match.params.id)
            .then((response) => {
                const updatedProductForm = {
                    ...this.state.newPartForm
                };

                for (let field in response.data) {
                    const updatedFormElement = {
                        ...updatedProductForm[field]
                    };
                    updatedFormElement.value = response.data[field];
                    updatedProductForm[field] = updatedFormElement;
                }

                this.setState({...this.state, newPartForm: updatedProductForm});
            })
            .catch(error => {
                this.setState(() => {
                    throw error;
                })
            })
    };

    componentDidMount() {

        if (this.props.match.params.id) {
            this.getPartByParamsId();
        }
        else if(this.props.location.state){
            let updatableForm = this.state.newPartForm
            updatableForm['name'].value = this.props.location.state.partName
            this.setState({...this.state, newWorkForm: updatableForm})
        }
    }


    render() {
        return (
            <div className="container">
                <h2> {this.props.match.params.id != null ? "Змiнити" : "Нова"}  Запчасть</h2>
                <hr/>
                <br/>
                <form onSubmit={this.postDataHandler}>
                    <RingLoader  color={"red"} loading={this.state.disabled} size={150} />
                    <div className="form-group">
                        <label
                            className={this.state.newPartForm.name.isValid ? "control-label input-label" : "control-label input-label invalid-label"}>
                        Назва запчастi:</label>
                        <input
                            className={this.state.newPartForm.name.isValid ? "form-control my-input-field" : "form-control my-input-field is-invalid"}
                            name="name"
                            disabled={this.state.disabled}
                            value={this.state.newPartForm.name.value}
                            onChange={this.inputChangeHandler}
                        />
                        <span className="form-text invalid-feedback">{this.state.newPartForm.name.message}</span>
                    </div>
                    <div className="form-group">
                        <label
                            className={this.state.newPartForm.description.isValid ? "control-label textarea-lable" : "control-label input-label invalid-label"}>Описанiе:</label>
                        {/* <input
                            className={this.state.newPartForm.description.isValid ? "form-control my-input-field" : "form-control my-input-field is-invalid"}
                            name="description"
                            value={this.state.newPartForm.description.value}
                            onChange={this.inputChangeHandler}
                        /> */}
                        <textarea className={"my-textarea"}
                            type="text"
                            name="description"
                            disabled={this.state.disabled}
                            value={this.state.newPartForm.description.value}
                            onChange={this.inputChangeHandler}
                        />
                        <span className="form-text invalid-feedback">{this.state.newPartForm.description.message}</span>
                    </div>
                    <div className="form-group ">
                        <label
                            className={this.state.newPartForm.retailPrice.isValid ? "control-label input-label" : "control-label input-label invalid-label"}>Продажна цiна:</label>
                        <input
                            className={this.state.newPartForm.retailPrice.isValid ? "form-control my-input-field" : "form-control my-input-field is-invalid"}
                            type="number"
                            step="0.01"
                            min="0.01"
                            id="retailPrice"
                            name="retailPrice"
                            disabled={this.state.disabled}
                            value={this.state.newPartForm.retailPrice.value}
                            onChange={this.inputChangeHandler}
                        />
                        <span className="form-text invalid-feedback">{this.state.newPartForm.retailPrice.message}</span>
                    </div>

                    <div className="form-group">
                        <label
                            className={this.state.newPartForm.purchasePrice.isValid ? "control-label input-label" : "control-label input-label invalid-label"}>Закупочна цына:</label>
                        <input
                            className={this.state.newPartForm.purchasePrice.isValid ? "form-control my-input-field" : "form-control my-input-field is-invalid"}
                            type="number"
                            step="0.01"
                            min="0.01"
                            id="purchasePrice"
                            name="purchasePrice"
                            disabled={this.state.disabled}
                            value={this.state.newPartForm.purchasePrice.value}
                            onChange={this.inputChangeHandler}
                        />
                        <span className="form-text invalid-feedback">{this.state.newPartForm.purchasePrice.message}</span>
                    </div>
                    
                    <br/>
                    <button className="btn btn-info my-button" type="submit" key="submit" disabled={this.state.disabled}>
                        {typeof (this.props.location.state) === 'undefined' ?
                        'Сохранити' :
                         this.props.location.state.orderId ? 'Сохранити і добавити' : 'Сохранити'}
                    </button>

                    <button className=" btn btn-danger my-button" key='cancel' type="button" disabled={this.state.disabled} onClick={this.props.history.goBack}>Отмена</button>
                </form>
            </div>
        )
    }


}

export default AddPart;