import React, {Component} from 'react';
import axios from 'axios';

class Login extends Component {
    constructor(props) {
        super(props);
        document.title = 'Login';
    }

    state = {
        email: {
            value: '',
            isValid: true,
            message: ''
        },
        password: {
            value: '',
            isValid: true,
            message: ''
        },
        registrationSaved:{
            value: false,
            isValid: true,
            message: ''
        }

    };

    componentDidMount() {

        const user = JSON.parse(localStorage.getItem('user'));

        if (user) {
            this.props.history.push('/');
            // console.log(user);
        }

        navigator.geolocation.getCurrentPosition(function(position) {
            console.log("Latitude is :", position);
          });
    }

    inputChangeHandler = (event) => {
        const updatedFromField = {};
        updatedFromField.value = event.target.value;
        updatedFromField.isValid = true;
        this.setState({
            [event.target.name]: updatedFromField
        })
    };

    validationHandler = (error) => {
        const updatedState = {
            ...this.state
        };

        for (let field in this.state) {
            const updatedFormElement = {
                ...updatedState[field]
            };
            updatedFormElement.isValid = true;
            updatedFormElement.message = '';
            updatedState[field] = updatedFormElement;
        }

        for (let fieldError of error.fieldErrors) {
            const updatedFormElement = {
                ...updatedState[fieldError.field]
            };
            updatedFormElement.isValid = false;
            updatedFormElement.message = fieldError.message;
            updatedState[fieldError.field] = updatedFormElement;
        }

        this.setState(updatedState);
    };

    postDataHandler = (event) => {
        event.preventDefault();

        const formData = {};
        for (let formElementIdentifier in this.state) {
            formData[formElementIdentifier] = this.state[formElementIdentifier].value;
        }

        axios.get('/users/me', {
            auth: {
                username: this.state.email.value,
                password: this.state.password.value
            }
        })
            .then(response => {
                //  console.log(response.data);
                localStorage.setItem('user', JSON.stringify(response.data));
                this.props.history.push('/');
            })
            .catch(error => {
                // console.log('error is ');
                // console.log(error);
                if (error.response && error.response.status === 401) {
                    const errors = {
                        fieldErrors: [
                            {
                                field: 'email',
                                message: 'Не правильнi логiн i пароль'
                            },
                            {
                                field: 'password',
                                message: 'Не правильнi логiн i пароль'
                            }
                        ]
                    };
                    this.validationHandler(errors);
                } else {
                    this.setState(() => {
                        throw error;
                    })
                }
            });
    };


    render() {
        return (
            <div className="container">
                <h2>Вход у систему</h2>
                <hr/>
                <br/>
                <form onSubmit={this.postDataHandler}>
                    <div className={"login-block"}>
                        <label
                            className={this.state.email.isValid ? "control-label input-label" : "control-label input-label invalid-label"}>
                            Iм'я:
                        </label>
                        <input
                            className={this.state.email.isValid ? (this.state.registrationSaved.value ? "form-control my-input-login-field is-saved" : "form-control my-input-login-field") : "form-control my-input-login-field is-invalid"}
                            type="text"
                            name="email"
                            value={this.state.email.value}
                            onChange={this.inputChangeHandler}
                        />
                        <span className="form-text invalid-feedback">{this.state.email.message}</span>
                    </div>
                    <div className={"login-block"}>
                        <label
                            className={this.state.password.isValid ? "control-label input-label" : "control-label input-label invalid-label"}>
                            Пароль:
                        </label>
                        <input
                            className={this.state.password.isValid ? ( "form-control my-input-login-field") : "form-control my-input-login-field is-invalid"}
                            type="password"
                            name="password"
                            value={this.state.password.value}
                            onChange={this.inputChangeHandler}
                        />
                        <br/>
                        <div className="category-saved">{this.state.registrationSaved.value && "Registration was successful"}</div>
                        <span className="form-text invalid-feedback">{this.state.password.message}</span>
                    </div>
                    <br/>
                    <div>
                        <button className="btn btn-success my-button" type="submit">Login</button>
                    </div>


                    <br/>
                    <br/>


                </form>
            </div>
        )
    }
}

export default Login;