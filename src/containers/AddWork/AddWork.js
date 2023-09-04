import React, {Component} from 'react';
import axios from 'axios';
import {RingLoader} from "react-spinners"
import { Switch } from 'react-switch-input';
import './AddWork.css'

class AddWork extends Component{


    constructor(props) {
        super(props);
        document.title = 'Нова робота - Г а р а ж';
        // console.log(this.context.router.history);
    }



    state = {
        categories: [],
        newWorkForm: {
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
            price: {
                value: '',
                isValid: true,
                message: ''
            },
            salary: {
                value: null,
                isValid: true,
                message: ''
            },
            workCategory: {
                value: '',
                isValid: true,
                message: ''
            },
            workCategoryResponseDto:{
                value: {id: ''},
                isValid: true,
                message: ''
            }
        },
        disabled: false
    };


    inputChangeHandler = (event) => {
        const target = event.target;
        const updatedCustomerForm = {
            ...this.state.newWorkForm
        };
        const updatedFormElement = {
            ...updatedCustomerForm[target.name]
        };

        let value;
        value = target.value;

        updatedFormElement.value = value;
        updatedFormElement.isValid = true;
        updatedCustomerForm[target.name] = updatedFormElement;

        this.setState({...this.state, newWorkForm: updatedCustomerForm});

    };

    updateSalaryStatus = () => {

        const updatedCustomerForm = {
            ...this.state.newWorkForm
        };
        const updatedFormElement = {
            ...updatedCustomerForm["salary"]
        };

        if(updatedFormElement.value === null){
            updatedFormElement.value = 1
        }else{
            updatedFormElement.value = null
        }
        updatedCustomerForm["salary"] = updatedFormElement;

        this.setState({...this.state, newWorkForm: updatedCustomerForm});

    };

    addWorkToOrder = (workId, orderId) =>{ 
        //  console.log('adding ' + idOfWork);
        axios.post('/orders/work/' + workId + '/' + orderId)
        .then(response => { })
        .catch(error => {
             // console.log('hello' + error);
            this.setState(() => {
                throw error;
            })
            // this.props.history.push('/login');
        })
    };



    postDataHandler = (event) => {
        event.preventDefault();
        this.setState({...this.state, disabled: true})
        const formData = {};
        for (let formElementIdentifier in this.state.newWorkForm) {
            formData[formElementIdentifier] = this.state.newWorkForm[formElementIdentifier].value;
        }

        let url = '/work';
        let method = 'post';
        const id = this.props.match.params.id;
        if (id) {
            url += '/' + id;
            method = 'put';
        }

        axios({method: method, url: url, data: formData})
            .then((response) => {
                if(typeof(this.props.location.state) !== 'undefined' && this.props.location.state.orderId){
                    const workId = response.data.id
                    const orderId = this.props.location.state.orderId
                    this.addWorkToOrder(workId, orderId)

                    setTimeout(() => { 
                        this.props.history.push("/order/" + this.props.location.state.orderId)
                     }, 2000);
                }else{
                    setTimeout(() => { 
                        this.props.history.push('/worksList');
                     }, 1500);
                }
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
    };



    hideMessage = () => {
        
    };


    validationHandler = (error) => {
        const updatedCategoryForm = {
            ...this.state.newWorkForm
        };

        for (let field in this.state.newWorkForm) {
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

            this.setState({...this.state, newWorkForm: updatedCategoryForm, disabled: false});
        } else {
            this.setState({
                ...this.state,
                newWorkForm: {
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


    getWorkByParamsId = () => {
        axios.get('/work/' + this.props.match.params.id)
            .then((response) => {
                
                const updatedProductForm = {
                    ...this.state.newWorkForm
                };

                for (let field in response.data) {
                    if(field ==='workCategoryResponseDto'){
                        const updatedFormElement = {
                            ...updatedProductForm['workCategory']
                        };
                        updatedFormElement.value = response.data[field].id;
                        updatedProductForm['workCategory'] = updatedFormElement;
                    }else{
                        const updatedFormElement = {
                            ...updatedProductForm[field]
                        };
                        updatedFormElement.value = response.data[field];
                        updatedProductForm[field] = updatedFormElement;
                    } 
                }

                this.setState({...this.state, newWorkForm: updatedProductForm});
            })
            .catch(error => {
                this.setState(() => {
                    throw error;
                })
            })
    };

    getWorkCategories = () => {

        axios.get('/work_category')
            .then(response => {
                if(response.data.length === 0){
                    alert('Нема категорiй!!!! Раз треба створити категорiю');
                    this.props.history.push('/addWorkCategory')
                }
                this.setState({...this.state,
                    categories : response.data});
            })
            .catch(error => {
                // console.log('hello' + error);
                this.setState(() => {
                    throw error;
                })
                // this.props.history.push('/login');
            })
    };

    componentDidMount() {
        if (this.props.match.params.id) {
            this.getWorkByParamsId();
        }
        else if(this.props.location.state){
            let updatableForm = this.state.newWorkForm
            updatableForm['name'].value = this.props.location.state.workName
            updatableForm['workCategory'].value = this.props.location.state.category

            this.setState({...this.state, newWorkForm: updatableForm})
        }
        this.getWorkCategories();
    }

    render() {
        return (
            <div className="container">              
                <h2> {this.props.match.params.id != null ? "Змiнити" : "Нова"}  Робот{this.props.match.params.id != null ? "у" : "а"}</h2>
                <hr/>
                <br/>
                <form onSubmit={this.postDataHandler}>
                    <RingLoader  color={"red"} loading={this.state.disabled} size={150} />
                    <div className="form-group">
                        <label
                            className={this.state.newWorkForm.workCategory.isValid ? "control-label input-label" : "control-label input-label invalid-label"}>Категорія</label>
                        <select
                            className={this.state.newWorkForm.workCategory.isValid ? "form-control my-input-field" : "form-control my-input-field is-invalid"}
                            id="workCategory"
                            name="workCategory"
                            disabled={this.state.disabled}
                            value={this.state.newWorkForm.workCategory.value}
                            onChange={this.inputChangeHandler}>
                            <option key="" value=""></option>
                            {this.state.categories.map((value) => {
                                return <option key={value.id} value={value.id}>{value.categoryName}</option>
                            })}
                        </select>
                        <span
                            className="form-text invalid-feedback">{this.state.newWorkForm.workCategory.message}</span>
                    </div>
                    
                    
                    <div className="form-group">
                        <label
                            className={this.state.newWorkForm.name.isValid ? "control-label input-label" : "control-label input-label invalid-label"}>
                        Назва роботи:</label>
                        <input
                            className={this.state.newWorkForm.name.isValid ? "form-control my-input-field" : "form-control my-input-field is-invalid"}
                            name="name"
                            disabled={this.state.disabled}
                            value={this.state.newWorkForm.name.value}
                            onChange={this.inputChangeHandler}
                        />
                        <span className="form-text invalid-feedback">{this.state.newWorkForm.name.message}</span>
                    </div>
                    <div className="form-group">
                        <label
                            className={this.state.newWorkForm.description.isValid ? "control-label textarea-lable" : "control-label input-label invalid-label"}>Опис:</label>
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
                            value={this.state.newWorkForm.description.value}
                            onChange={this.inputChangeHandler}
                        />
                        <span className="form-text invalid-feedback">{this.state.newWorkForm.description.message}</span>
                    </div>
                    <div className="form-group ">
                        <label
                            className={this.state.newWorkForm.price.isValid ? "control-label input-label" : "control-label input-label invalid-label"}>Цiна роботи:</label>
                        <input
                            className={this.state.newWorkForm.price.isValid ? "form-control my-input-field" : "form-control my-input-field is-invalid"}
                            type="number"
                            step="0.01"
                            min="0.01"
                            id="price"
                            name="price"
                            disabled={this.state.disabled}
                            value={this.state.newWorkForm.price.value}
                            onChange={this.inputChangeHandler}
                        />
                        <span className="form-text invalid-feedback">{this.state.newWorkForm.price.message}</span>
                    </div>


                    <div className="flex-container">

                        <div className="form-group">
                            <g>З/П:</g>
                        </div>

                        <div className="form-group"> 
                        
                            <Switch
                                labelLeft="процент"
                                labelRight="фікс сумма"
                                checked={this.state.newWorkForm.salary.value ? true : false}
                                onChange={() => {this.updateSalaryStatus()}}
                            />
                        </div>

                        <div className="form-group">
                            
                            <input
                                className={this.state.newWorkForm.salary.isValid ? "form-control my-input-field" : "form-control my-input-field is-invalid"}
                                type="number"
                                step="0.01"
                                min="0.01"
                                id="salary"
                                name="salary"
                                disabled={this.state.disabled ? true : this.state.newWorkForm.salary.value ? false : true}
                                value={this.state.newWorkForm.salary.value ? this.state.newWorkForm.salary.value : ''}
                                onChange={this.inputChangeHandler}
                            />
                            <span className="form-text invalid-feedback">{this.state.newWorkForm.salary.message}</span>
                        </div>
                    </div> 
                    
                    <br/>
                    <button className="btn btn-info my-button" type="submit" key="submit" disabled={this.state.disabled}>
                        {typeof (this.props.location.state) === 'undefined' ?
                            'Сохранити' :
                         this.props.location.state.orderId ? 'Сохранити і добавити' : 'Сохранити'}
                    </button>

                
                    <button 
                        className=" btn btn-danger my-button" 
                        key='cancel' 
                        type="button" 
                        disabled={this.state.disabled} 
                        onClick={this.props.history.goBack}>
                        Отмена
                    </button>
                    
                </form>
                
            </div>
        )
    }





}


export default AddWork;