import React, {Component} from 'react';
import axios from 'axios';

class AddWorkCategory extends Component{


    constructor(props) {
        super(props);
        document.title = 'Нова ?????? - Г а р а ж';
        // console.log(this.context.router.history);
    }



    state = {
        newWorkForm: {
            categoryName: {
                value: '',
                isValid: true,
                message: ''
            }
        }
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



    postDataHandler = (event) => {
        event.preventDefault();

        const formData = {};
        for (let formElementIdentifier in this.state.newWorkForm) {
            formData[formElementIdentifier] = this.state.newWorkForm[formElementIdentifier].value;
        }

        let url = '/work_category';
        let method = 'post';
        const id = this.props.match.params.id;
        if (id) {
            url += '/' + id;
            method = 'put';
        }

        axios({method: method, url: url, data: formData})
            .then(() => {
                this.setState({
                    newWorkForm: {
                        categoryName: {
                            value: '',
                            isValid: true,
                            message: ''
                        }
                    }
                })
            })
            .then(() => {
                this.props.history.push('/workCategory');
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

            this.setState({...this.state, newWorkForm: updatedCategoryForm});
        } else {
            this.setState({
                ...this.state,
                newWorkForm: {
                    categoryName: {
                        value: '',
                        isValid: false,
                        message: 'Please don\'t mess with my input fields'
                    }
                }
            })
        }
    };


    getWorkByParamsId = () => {
        axios.get('/work_category/' + this.props.match.params.id)
            .then((response) => {
                const updatedProductForm = {
                    ...this.state.newWorkForm
                };

                for (let field in response.data) {
                    const updatedFormElement = {
                        ...updatedProductForm[field]
                    };
                    updatedFormElement.value = response.data[field];
                    updatedProductForm[field] = updatedFormElement;
                }

                this.setState({...this.state, newWorkForm: updatedProductForm});
            })
            .catch(error => {
                this.setState(() => {
                    throw error;
                })
            })
    };

    componentDidMount() {

        if (this.props.match.params.id) {
            this.getWorkByParamsId();
        }
    }











    render() {

        

        return (
            <div className="container">
                <h2> {this.props.match.params.id != null ? "Змынити" : "Нова"}  Категорi{this.props.match.params.id != null ? "ю" : "а"}</h2>
                <hr/>
                <br/>
                <form onSubmit={this.postDataHandler}>
                    <div className="form-group">
                        <label
                            className={this.state.newWorkForm.categoryName.isValid ? "control-label input-label" : "control-label input-label invalid-label"}>
                        Назва Категорiii:</label>
                        <input
                            className={this.state.newWorkForm.categoryName.isValid ? "form-control my-input-field" : "form-control my-input-field is-invalid"}
                            name="categoryName"
                            value={this.state.newWorkForm.categoryName.value}
                            onChange={this.inputChangeHandler}
                        />
                        <span className="form-text invalid-feedback">{this.state.newWorkForm.categoryName.message}</span>
                    </div>
                    <br/>
                    <button className="btn btn-info my-button" type="submit" key="submit">Сохранити</button>

                
                    <button className=" btn btn-danger my-button" key='cancel' type="button" onClick={this.props.history.goBack}>Отмена</button>
                    
                </form>
            </div>
        )
    }





}


export default AddWorkCategory;