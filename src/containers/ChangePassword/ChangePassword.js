import React, {Component} from 'react';
import axios from 'axios';


class ChangePassword extends Component{

    constructor(props) {
        super(props);
        document.title = 'Нова Машина - Г а р а ж';

        // console.log(props);
    }

    state = {
        changePasswordForm: {
            oldPassword: {
                value: '',
                isValid: true,
                message: ''
            },
            newPasswordCheck: {
                value: '',
                isValid: true,
                message: ''
            },
            newPassword: {
                value: '',
                isValid: true,
                message: ''
            }
        }
    };


    inputChangeHandler = (event) => {
        const target = event.target;
        const updatedCarForm = {
            ...this.state.changePasswordForm
        };
        const updatedFormElement = {
            ...updatedCarForm[target.name]
        };

        let value;
        value = target.value;

        updatedFormElement.value = value;
        updatedFormElement.isValid = true;
        updatedCarForm[target.name] = updatedFormElement;

        this.setState({...this.state, changePasswordForm: updatedCarForm});

    };

    checkIfPasswordsMatch = () => {
        
        const password1 = {...this.state.changePasswordForm.newPasswordCheck};

       const password2 = {...this.state.changePasswordForm.newPassword};
        // console.log(password2)
        if(password1.value === password2.value){
            return true;
        }else{
            // console.log('passwords do not match')
            this.setState({
                changePasswordForm: {
                    oldPassword: {
                        value: '',
                        isValid: true,
                        message: ''
                    },
                    newPasswordCheck: {
                        value: '',
                        isValid: false,
                        message: 'Паролi не похожi'
                    },
                    newPassword: {
                        value: '',
                        isValid: false,
                        message: 'Паролi не похожi'
                    }
                }
            })
        }

    };



    postDataHandler = (event) => {
        event.preventDefault();
        // console.log('I was called 1 ')
        let result = this.checkIfPasswordsMatch();
        if (result){
            // console.log('I was called')
            this.postData();
        }

    }


    postData = () => {
        // event.preventDefault();

        const formData = {};
        for (let formElementIdentifier in this.state.changePasswordForm) {
            formData[formElementIdentifier] = this.state.changePasswordForm[formElementIdentifier].value;
        }


        let url = '/users/password';
        let method = 'post';
    
            axios({method: method, url: url, data: formData})
            .then(() => {
                this.setState({
                    changePasswordForm: {
                        oldPassword: {
                            value: '',
                            isValid: true,
                            message: ''
                        },
                        newPasswordCheck: {
                            value: '',
                            isValid: true,
                            message: ''
                        },
                        newPassword: {
                            value: '',
                            isValid: true,
                            message: ''
                        }
                    }
                })
            })
            .then(() => {
                this.props.history.push('/logout');
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

    validationHandler = (error) => {
        const updatedCategoryForm = {
            ...this.state.changePasswordForm
        };

        for (let field in this.state.changePasswordForm) {
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

            this.setState({...this.state, changePasswordForm: updatedCategoryForm});
        } else {
            this.setState({
                ...this.state,
                changePasswordForm: {
                    oldPassword: {
                        value: '',
                        isValid: false,
                        message: 'Please don\'t mess with my input fields'
                    }
                }
            })
        }
    };




    render() {

        const user = JSON.parse(localStorage.getItem('user'));

        return (
            <div className="container">
                <h2> Змiна пароля для {user.name}</h2>
                <hr/>
                <br/>
                <form onSubmit={this.postDataHandler}>
                    <div className="form-group">
                        <label
                            className={this.state.changePasswordForm.oldPassword.isValid ? "control-label input-label" : "control-label input-label invalid-label"}>
                            Старий пароль:</label>
                        <input
                            className={this.state.changePasswordForm.oldPassword.isValid ? "form-control my-input-field" : "form-control my-input-field is-invalid"}
                            name="oldPassword"
                            type="password"
                            value={this.state.changePasswordForm.oldPassword.value}
                            onChange={this.inputChangeHandler}
                        />
                        <span className="form-text invalid-feedback">{this.state.changePasswordForm.oldPassword.message}</span>
                    </div>
                    <div className="form-group">
                        <label
                            className={this.state.changePasswordForm.newPasswordCheck.isValid ? "control-label input-label" : "control-label input-label invalid-label"}>
                                Новий пароль:</label>
                        <input
                            className={this.state.changePasswordForm.newPasswordCheck.isValid ? "form-control my-input-field" : "form-control my-input-field is-invalid"}
                            name="newPasswordCheck"
                            type="password"
                            value={this.state.changePasswordForm.newPasswordCheck.value}
                            onChange={this.inputChangeHandler}
                        />
                        <span className="form-text invalid-feedback">{this.state.changePasswordForm.newPasswordCheck.message}</span>
                    </div>
                    <div className="form-group">
                        <label
                            className={this.state.changePasswordForm.newPassword.isValid ? "control-label input-label" : "control-label input-label invalid-label"}>
                                Новий пароль ще раз:</label>
                        <input
                            className={this.state.changePasswordForm.newPassword.isValid ? "form-control my-input-field" : "form-control my-input-field is-invalid"}
                            name="newPassword"
                            type="password"
                            value={this.state.changePasswordForm.newPassword.value}
                            onChange={this.inputChangeHandler}
                        />
                        <span className="form-text invalid-feedback">{this.state.changePasswordForm.newPassword.message}</span>
                    </div>
                    
                    <br/>
                    <button className="btn btn-info my-button" type="submit" key="submit">Сохранити</button>

                    <button className=" btn btn-danger my-button" key='cancel' type="button" onClick={this.props.history.goBack}>Отмена</button>

                </form>

                
            </div>
        )
    }


}

export default ChangePassword;