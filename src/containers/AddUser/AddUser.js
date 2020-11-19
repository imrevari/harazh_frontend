import React, {Component} from 'react';
import axios from 'axios';


class AddUser extends Component{

    constructor(props) {
        super(props);
        document.title = 'Новий пользователь - Г а р а ж';
        // console.log(props);
    }


    state = {
        newUserForm: {
            name: {
                value: '',
                isValid: true,
                message: ''
            },
            password: {
                value: '',
                isValid: true,
                message: ''
            },
            role: {
                value: '',
                isValid: true,
                message: ''
            }
        },
        roles: []
    };

    postDataHandler = (event) => {
        event.preventDefault();

        const formData = {};
        for (let formElementIdentifier in this.state.newUserForm) {
            formData[formElementIdentifier] = this.state.newUserForm[formElementIdentifier].value;
        }

        // console.log(formData)

        let url = '/users';
        let method = 'post';
        const id = this.props.match.params.id;
        if (id) {
            url += '/' + id;
            method = 'put';
        }

        axios({method: method, url: url, data: formData})
            .then(() => {
                this.setState({
                    newUserForm: {
                        id: {
                            value: '',
                        },
                        name: {
                            value: '',
                            isValid: true,
                            message: ''
                        },
                        password: {
                            value: '',
                            isValid: true,
                            message: ''
                        },
                        role: {
                            value: '',
                            isValid: true,
                            message: ''
                        }
                    }
                })
            })
            .then(() => {
                this.props.history.push('/userList');
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
    };



    hideMessage = () => {
        
    };

    validationHandler = (error) => {
        const updatedCategoryForm = {
            ...this.state.newUserForm
        };

        for (let field in this.state.newUserForm) {
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

            this.setState({...this.state, newUserForm: updatedCategoryForm});
        } else {
            this.setState({
                ...this.state,
                newUserForm: {
                    name: {
                        value: '',
                        isValid: false,
                        message: 'Please don\'t mess with my input fields'
                    }
                }
            })
        }
    };
   

    inputChangedHandler = (event) => {
        const target = event.target;

        const updatedUser = {
            ...this.state.newUserForm
        };

        updatedUser[target.name].value = target.value;

        this.setState({newUserForm: updatedUser});

    }


    getUserByParamsId = () => {
        axios.get('/users/' + this.props.match.params.id)
            .then((response) => {
                // console.log(response)
                const updatedProductForm = {
                    ...this.state.newUserForm
                };

                for (let field in response.data) {
                    const updatedFormElement = {
                        ...updatedProductForm[field]
                    };
                    updatedFormElement.value = response.data[field];
                    updatedProductForm[field] = updatedFormElement;
                }

                this.setState({...this.state, newUserForm: updatedProductForm});
            })
            .catch(error => {
                this.setState(() => {
                    throw error;
                })
            })
    };

    componentDidMount(){

        if(this.props.match.params.id){
            axios.get('/users/roles')
            .then((response) => {
                this.setState({
                    roles: response.data
                })
            });
        this.getUserByParamsId();
        }

        
    }


    render() {

        // console.log(this.state)

        return (
            <div className="container">
                <h2> {this.props.match.params.id != null ? "Змiнити" : "Новий"}  пользователь{this.props.match.params.id != null ? "а" : ""} </h2>
                <hr/>
                <br/>
                <form onSubmit={this.postDataHandler}>
                    <div className="form-group">
                        <label
                            className={this.state.newUserForm.name.isValid ? "control-label input-label" : "control-label input-label invalid-label"}>
                        Лонiн:</label>
                        <input
                            className={this.state.newUserForm.name.isValid ? "form-control my-input-field" : "form-control my-input-field is-invalid"}
                            name="name"
                            value={this.state.newUserForm.name.value}
                            onChange={this.inputChangedHandler}
                        />
                        <span className="form-text invalid-feedback">{this.state.newUserForm.name.message}</span>
                    </div>
                    <div className="form-group" style={this.props.match.params.id ?  {display: 'none'} : {}}>
                        <label
                            className={this.state.newUserForm.password.isValid ? "control-label textarea-lable" : "control-label input-label invalid-label"}>Пароль:</label>
                        <input
                            
                            className={this.state.newUserForm.password.isValid ? "form-control my-input-field" : "form-control my-input-field is-invalid"}
                            type="password"
                            name="password"
                            value={this.state.newUserForm.password.value}
                            onChange={this.inputChangedHandler}
                        />
                        <span className="form-text invalid-feedback">{this.state.newUserForm.password.message}</span>
                    </div>
                    <div className="form-group " style={this.props.match.params.id ?  {} : {display: 'none'}}>
                        <label
                            className={this.state.newUserForm.role.isValid ? "control-label input-label" : "control-label input-label invalid-label"}>Права:</label>
                        <select name="role"
                        

                        value={this.state.newUserForm.role.value}
                        onChange={this.inputChangedHandler}
                        className="my-input-field">

                            {Object.entries(this.state.roles).map(([key, value]) => {
                                return <option key={key} value={key}>{value}</option>
                            })}
                        </select> 
                        <span className="form-text invalid-feedback">{this.state.newUserForm.role.message}</span>
                    </div>
                    
                    
                    <br/>
                    <button className="btn btn-info my-button" type="submit" key="submit">Сохранити</button>

                    <button className=" btn btn-danger my-button" key='cancel' type="button" onClick={this.props.history.goBack}>Отмена</button>
                </form>
            </div>
        )
    }



















}

export default AddUser;