import React, {Component} from 'react';
import axios from 'axios';
import ShowCustomerInOrder from '../../components/Customer/ShowCustomerInOrder';
import ListWorkForOrder from '../../components/ListWorkForOrder/ListWorkForOrder'
import date from 'date-and-time';


import './Order.css'
import '../../components/ListWorkForOrder/ListWorkForOrder.css'
import '../../components/ListPart/ListPartComponent.css'
import ListPartForOrder from '../../components/ListPartForOrder/ListPartForOrder';


class Order extends Component{

    constructor(props) {
        super(props);
        document.title = 'Заказ - Г а р а ж';
        //console.log(props);
    }

    left = '<<<';
    right = '>>>'

    amountToPay = 0;

    state = {
        order: {
            id: '', 
            customer: {
                firstName: '',
                lastName: '',
                telNumber: '',
                email: ''
            },
            car: {
                vinCode: '',
                licencePlate: '',
                carMade: ''
            },
            works: [],
            partCounts: [],
            orderOpened: '',
            orderClosed: '',
            payedFor: '',
            amountPayedInAdvance: '',
            problem: '',
            amountToPay: ''
        },

        sortedWork: '',

        sortedFilteredListWork: [],

        workFileteredBy: '',

        itemsToShowWork: 5,

        workBeginIndex: 0,

        workEndIndex: 5,



        sortedPart: '',

        sortedFilteredListPart: [],

        partFileteredBy: '',

        itemsToShowPart: 5,

        partBeginIndex: 0,

        partEndIndex: 5


    };

    calcTotalToPay = (works) => {
        const parts = [...this.state.order.partCounts];
        let preapid = this.state.order.amountPayedInAdvance;
        let total = 0;
        total -= preapid;

        works.map(item =>{
            if (item.workDone){
                total += item.price;
            }
            return total;
        })
        parts.map(item =>{
                total += (item.retailPrice * item.amount);
                return total;      
        })
        
       return total;
    }

    calcTotalToPay2 = (parts) => {
        const works = [...this.state.order.works];
        let preapid = this.state.order.amountPayedInAdvance;
        let total = 0;
        total -= preapid;

        parts.map(item =>{
            total += (item.retailPrice * item.amount); 
            return total;
        })
        works.map(item =>{
            if (item.workDone){
                total += item.price;
            }
            return total;       
        })
        
       return total;
    }

    ifAllWorksAreDone = () =>{
        const works = [...this.state.order.works]

        let result = works.filter(item => !item.workDone)
        if (result.length > 0){
            return false;
        }else{
            return true;
        }
    }

    filterMyWorkList = (event) => {
        const target = event.target;

        let value;
        value = target.value;

        const updatableList = [...this.state.order.works];

        const result = updatableList.filter((item) => item.workName.includes(value) ||
         item.workName.toLowerCase().includes(value) || item.workName.toUpperCase().includes(value));

        const iToShow = [this.state.itemsToShowWork];

        this.setState({...this.state, 
            workFileteredBy: value,
            sortedFilteredListWork: result,
            workEndIndex: result.length < iToShow ? result.length : iToShow});

    };

    filterMyPartList = (event) => {
        const target = event.target;

        let value;
        value = target.value;

        const updatableList = [...this.state.order.partCounts];

        const result = updatableList.filter((item) => item.partName.includes(value) ||
         item.partName.toLowerCase().includes(value) || item.partName.toUpperCase().includes(value));

        const iToShow = [this.state.itemsToShowPart];

        this.setState({...this.state, 
            partFileteredBy: value,
            sortedFilteredListPart: result,
            partEndIndex: result.length < iToShow ? result.length : iToShow});

    };

    changeWorkListSize = (event) =>{
        const target = event.target;

        let value;
        value = target.value;
        const listSize = this.state.sortedFilteredListWork.length;
        const bIndex = [this.state.workBeginIndex];
        const listSizeInt = parseInt(listSize);
        const bIndexInt = parseInt(bIndex);
        const valueInt = parseInt(value);
        const eIndex = bIndexInt + valueInt;
        
        if(value !== '' && eIndex < listSizeInt){
            this.setState({...this.state, 
                itemsToShowWork: value,
                workEndIndex: eIndex});
        }else if(value !== '' && eIndex > listSizeInt){
            this.setState({...this.state, 
                itemsToShowWork: value,
                workEndIndex: listSizeInt});      
        }else{
            this.setState({...this.state, 
                itemsToShowWork: value});
        }
    }

    changePartListSize = (event) =>{
        const target = event.target;

        let value;
        value = target.value;
        const listSize = this.state.sortedFilteredListPart.length;
        const bIndex = [this.state.partBeginIndex];
        const listSizeInt = parseInt(listSize);
        const bIndexInt = parseInt(bIndex);
        const valueInt = parseInt(value);
        const eIndex = bIndexInt + valueInt;
        
        if(value !== '' && eIndex < listSizeInt){
            this.setState({...this.state, 
                itemsToShowPart: value,
                partEndIndex: eIndex});
        }else if(value !== '' && eIndex > listSizeInt){
            this.setState({...this.state, 
                itemsToShowPart: value,
                partEndIndex: listSizeInt});      
        }else{
            this.setState({...this.state, 
                itemsToShowPart: value});
        }
    }

    workPaginatorLeft = () => {
        const bIndex = [this.state.workBeginIndex];
        const eIndex = [this.state.workEndIndex];
        const size = [this.state.itemsToShowWork];

        let begIndexInt = parseInt(bIndex);
        let endIndexInt = parseInt(eIndex);
        const sizeInt = parseInt(size);

        endIndexInt = begIndexInt;
        begIndexInt = endIndexInt - sizeInt; 

        if (begIndexInt <= 0){
            this.setState({...this.state, 
                workBeginIndex: 0,
                workEndIndex: sizeInt}); 
        }else{
            this.setState({...this.state, 
                workBeginIndex: begIndexInt,
                workEndIndex: endIndexInt});
        }
        
    }

    partPaginatorLeft = () => {
        const bIndex = [this.state.partBeginIndex];
        const eIndex = [this.state.partEndIndex];
        const size = [this.state.itemsToShowPart];

        let begIndexInt = parseInt(bIndex);
        let endIndexInt = parseInt(eIndex);
        const sizeInt = parseInt(size);

        endIndexInt = begIndexInt;
        begIndexInt = endIndexInt - sizeInt; 

        if (begIndexInt <= 0){
            this.setState({...this.state, 
                partBeginIndex: 0,
                partEndIndex: sizeInt}); 
        }else{
            this.setState({...this.state, 
                partBeginIndex: begIndexInt,
                partEndIndex: endIndexInt});
        }
        
    }

    workPaginatorRight = () => {
        

        const listSize = this.state.sortedFilteredListWork.length;
        const bIndex = [this.state.workBeginIndex];
        const eIndex = [this.state.workEndIndex];
        const size = [this.state.itemsToShowWork];

        let begIndexInt = parseInt(bIndex);
        let endIndexInt = parseInt(eIndex);
        const sizeInt = parseInt(size);
        const listSizeInt = parseInt(listSize); 
        
        endIndexInt = endIndexInt + sizeInt;
        begIndexInt = begIndexInt + sizeInt;      

        if (endIndexInt <= listSizeInt){
            this.setState({...this.state, 
                workBeginIndex: begIndexInt,
                workEndIndex: endIndexInt});
        }

        else if(endIndexInt >= listSizeInt && begIndexInt < listSizeInt){
            const newBegIndex = [this.state.workEndIndex];
            const newBegIndexInt = parseInt(newBegIndex);
            this.setState({...this.state, 
                workBeginIndex: newBegIndexInt,
                workEndIndex: listSizeInt});
        }
  
    }

    partPaginatorRight = () => {
        

        const listSize = this.state.sortedFilteredListPart.length;
        const bIndex = [this.state.partBeginIndex];
        const eIndex = [this.state.partEndIndex];
        const size = [this.state.itemsToShowPart];

        let begIndexInt = parseInt(bIndex);
        let endIndexInt = parseInt(eIndex);
        const sizeInt = parseInt(size);
        const listSizeInt = parseInt(listSize); 
        
        endIndexInt = endIndexInt + sizeInt;
        begIndexInt = begIndexInt + sizeInt;      

        if (endIndexInt <= listSizeInt){
            this.setState({...this.state, 
                partBeginIndex: begIndexInt,
                partEndIndex: endIndexInt});
        }

        else if(endIndexInt >= listSizeInt && begIndexInt < listSizeInt){
            const newBegIndex = [this.state.partEndIndex];
            const newBegIndexInt = parseInt(newBegIndex);
            this.setState({...this.state, 
                partBeginIndex: newBegIndexInt,
                partEndIndex: listSizeInt});
        }
  
    }

    sortMyWorkList = (type) => {
        //   console.log('sorting by ' + type)
           var updatableList = [...this.state.sortedFilteredListWork];
   
          
           if (type === 'name' && (this.state.sortedWork === '' || this.state.sortedWork === 'desc') ){
               const result = updatableList.sort((a, b) => (a.workName.toLowerCase() > b.workName.toLowerCase()) ? 1 : -1 );
   
               this.setState({...this.state,
                sortedWork: 'asc' , 
                sortedFilteredListWork: result });
   
           }
   
           if (type === 'name' && this.state.sortedWork === 'asc' ){
               const result = updatableList.sort((a, b) => (a.workName.toLowerCase() < b.workName.toLowerCase()) ? 1 : -1 );
   
               this.setState({...this.state,
                sortedWork: 'desc' , 
                sortedFilteredListWork: result });
   
           }
   
           if (type === 'doneBy' && (this.state.sortedWork === '' || this.state.sortedWork === 'desc') ){
               const result = updatableList.sort((a, b) => (a.userName.toLowerCase() > b.userName.toLowerCase()) ? 1 : -1 );
   
               this.setState({...this.state,
                sortedWork: 'asc' , 
                sortedFilteredListWork: result });
   
           }
   
           if (type === 'doneBy' && this.state.sortedWork === 'asc' ){
               const result = updatableList.sort((a, b) => (a.userName.toLowerCase() < b.userName.toLowerCase()) ? 1 : -1 );
   
               this.setState({...this.state,
                sortedWork: 'desc' , 
                sortedFilteredListWork: result });
   
           }

           if (type === 'ifDone' && (this.state.sortedWork === '' || this.state.sortedWork === 'desc') ){
            const result = updatableList.sort((a, b) => (a.workDone > b.workDone) ? 1 : -1 );

            this.setState({...this.state,
             sortedWork: 'asc' , 
             sortedFilteredListWork: result });

            }

            if (type === 'ifDone' && this.state.sortedWork === 'asc' ){
                const result = updatableList.sort((a, b) => (a.workDone < b.workDone) ? 1 : -1 );

                this.setState({...this.state,
                sortedWork: 'desc' , 
                sortedFilteredListWork: result });

            }
   
    }

    sortMyPartList = () =>{
        var updatableList = [...this.state.sortedFilteredListPart];
   
          
        if (this.state.sortedWork === '' || this.state.sortedWork === 'desc') {
            const result = updatableList.sort((a, b) => (a.partName.toLowerCase() > b.partName.toLowerCase()) ? 1 : -1 );

            this.setState({...this.state,
             sortedWork: 'asc' , 
             sortedFilteredListPart: result });

        }

        if (this.state.sortedWork === 'asc' ){
            const result = updatableList.sort((a, b) => (a.partName.toLowerCase() < b.partName.toLowerCase()) ? 1 : -1 );

            this.setState({...this.state,
             sortedWork: 'desc' , 
             sortedFilteredListPart: result });

        }



    }

    removePartCount = (id) =>{
        axios.delete('/orders/remove_part/' + this.state.order.id + '/' + id)
        .then((response) => {
            const updatedProductForm = {
                ...this.state.order
            };

            for (let field in response.data) {
                let updatedFormElement = {
                    ...updatedProductForm[field]
                };
                updatedFormElement = response.data[field];
                updatedProductForm[field] = updatedFormElement;
            }
             updatedProductForm.amountToPay = this.calcTotalToPay2(response.data.partCounts);
            
            this.setState({...this.state, order: updatedProductForm ,
                sortedFilteredListWork:  response.data.works,
                sortedFilteredListPart: response.data.partCounts});
        })
        .catch(error => {
            this.setState(() => {
                throw error;
            })
        })
    }

    closeWork = (id) => {
     //   console.log('work is closing ' + id)
        axios.post('/orders/close_work/' + this.state.order.id + '/' + id)
        .then((response) => {
            const updatedProductForm = {
                ...this.state.order
            };

            for (let field in response.data) {
                let updatedFormElement = {
                    ...updatedProductForm[field]
                };
                updatedFormElement = response.data[field];
                updatedProductForm[field] = updatedFormElement;
            }
             updatedProductForm.amountToPay = this.calcTotalToPay(response.data.works);
            
            this.setState({...this.state, order: updatedProductForm,
                sortedFilteredListWork:  response.data.works});

            // this.props.history.push('/order/' + this.state.order.id);
        })
        .catch(error => {
            this.setState(() => {
                throw error;
            })
        })

        
    };

    removeWork = (id) => {
        // console.log(id);
        axios.delete('/orders/remove_work/' + this.state.order.id + '/' + id)
        .then((response) => {
            const updatedProductForm = {
                ...this.state.order
            };

            for (let field in response.data) {
                let updatedFormElement = {
                    ...updatedProductForm[field]
                };
                updatedFormElement = response.data[field];
                updatedProductForm[field] = updatedFormElement;
            }
             updatedProductForm.amountToPay = this.calcTotalToPay(response.data.works);
            
            this.setState({...this.state, order: updatedProductForm ,
                sortedFilteredListWork:  response.data.works,
                sortedFilteredListPart: response.data.partCounts});
        })
        .catch(error => {
            this.setState(() => {
                throw error;
            })
        })
    };

    addNewWork = () => {
        // console.log('adding new work')
        this.props.history.push("/addWorkToOrder/" + this.state.order.id);
    };

    payFor = () =>{
        axios.post('/orders/pay_for/' + this.state.order.id)
                    .then((response) => {
                        const updatedProductForm = {
                            ...this.state.order
                        };
        
                        for (let field in response.data) {
                            let updatedFormElement = {
                                ...updatedProductForm[field]
                            };
                            updatedFormElement = response.data[field];
                            updatedProductForm[field] = updatedFormElement;
                        }
                        updatedProductForm.amountToPay = 0;
                        
                        this.setState({...this.state, order: updatedProductForm ,
                            sortedFilteredListWork:  response.data.works});
                    })
                    .catch(error => {
                        this.setState(() => {
                            throw error;
                        })
                    })
    }

    closeOrder = () =>{
        if (!this.ifAllWorksAreDone()){
            alert('Ще не всi роботи зробленi!!! Раз зроби всi роботи!');
        }else if(this.ifAllWorksAreDone() && !this.state.order.payedFor) {
            alert('Заказ ще не оплачений!!! Раз оплатiт заказ!');
        }else{
            axios.get('/orders/close/' + this.state.order.id)
                    .then((response) => {
                        const updatedProductForm = {
                            ...this.state.order
                        };
        
                        for (let field in response.data) {
                            let updatedFormElement = {
                                ...updatedProductForm[field]
                            };
                            updatedFormElement = response.data[field];
                            updatedProductForm[field] = updatedFormElement;
                        }
                        
                        this.setState({...this.state, order: updatedProductForm ,
                            sortedFilteredListWork:  response.data.works});
                    })
                    .catch(error => {
                        this.setState(() => {
                            throw error;
                        })
                    })
        }
        
    }

    getReceipt = () =>{
        console.log('getting the receipt');
        this.props.history.push("/receipt/" + this.state.order.id);
    }

    changeUser = (id) =>{
        // console.log('changing user for ' + id)
        this.props.history.push("/changeUser/" + id + '/' + this.state.order.id);
    }

    addCarPart = () =>{
        this.props.history.push("/addParts/" + this.state.order.id);
    }

    getOrderByParamsId = () => {

        axios.get('/orders/total_to_pay/' + this.props.match.params.id)
            .then((response) => {

                this.amountToPay = response.data;
            })
            .then(() => {
                    axios.get('/orders/' + this.props.match.params.id)
                    .then((response) => {
                        // console.log(response.data)
                        const updatedProductForm = {
                            ...this.state.order
                        };
        
                        for (let field in response.data) {
                            let updatedFormElement = {
                                ...updatedProductForm[field]
                            };
                            updatedFormElement = response.data[field];
                            updatedProductForm[field] = updatedFormElement;
                        }
                        updatedProductForm.amountToPay = this.amountToPay;
                        
                        this.setState({...this.state, order: updatedProductForm ,
                            sortedFilteredListWork:  response.data.works,
                            sortedFilteredListPart: response.data.partCounts
                        });
                    })
                    .catch(error => {
                        this.setState(() => {
                            throw error;
                        })
                    })

                }
            )
            .catch(error => {
                this.setState(() => {
                    throw error;
                })
            })
        
    };

    componentDidMount() {

        if (this.props.match.params.id) {
            // console.log('id is ' + this.props.match.params.id)
            this.getOrderByParamsId();
        }
    }

    render() {

        const juser = JSON.parse(localStorage.getItem('user'));

        const workBody = this.state.sortedFilteredListWork.slice(this.state.workBeginIndex, this.state.workEndIndex).map( item => {

            return (
           
                <ListWorkForOrder 
                    key={item.id}
                    name={item.workName}
                    desc={item.description.slice(0, 50)}
                    price={item.price}
                    done={item.workDone}
                    closeWork={() => this.closeWork(item.id)}
                    user={item.userName}
                    juser={juser}
                    remove={() => this.removeWork(item.id)}
                    closed={this.state.order.orderClosed}
                    changeUser={() => this.changeUser(item.id)}
                />
            )
        });

        const workBlock = ( 
            
            <table border="1" >
                <thead>
                    <tr>
                        <th className="name"  onClick={() => this.sortMyWorkList('name')} >робота &#8645;</th> 
                        <th className="price" >цiна</th>
                        <th className="user"  onClick={() => this.sortMyWorkList('doneBy')} >Добавив/Зробив &#8645;</th>
                        {/* <th className="desc" style={(this.state.order.orderClosed || juser.role === 'ROLE_ADMIN') ? {display: 'none'} : {}} >опiсанiе</th> */}
                        <th className="done" onClick={() => this.sortMyWorkList('ifDone')}>&#8645;</th>
                        <th className="done" style={(juser.role === 'ROLE_ADMIN' && !this.state.order.orderClosed) ? {} : {display: 'none'}} >Удалити</th>
                    </tr>
                </thead>
                <tbody>
                    {workBody}  
                </tbody>
            </table>
        

        );


        const partBody = this.state.sortedFilteredListPart.slice(this.state.partBeginIndex, this.state.partEndIndex).map( item => {

            return (
           
                <ListPartForOrder
                    key={item.id}
                    name={item.partName}
                    desc={item.description.slice(0, 50)}
                    amount={item.amount}
                    totalPrice={item.retailPrice * item.amount}
                    juser={juser}
                    remove={() => this.removePartCount(item.id)}
                    closed={this.state.order.orderClosed}
                />
                
            )
        });

        const partBlock = ( 
            
            <table border="1" >
                <tbody>
                    <tr>
                        <th className="name"  onClick={() => this.sortMyPartList()} >запчасть &#8645;</th>
                        <th className="done" >колiчество </th> 
                        <th className="price" > обща цiна</th>
                        <th className="user" style={(this.state.order.orderClosed || juser.role === 'ROLE_ADMIN') ? {display: 'none'} : {}} >опiсанiе</th>
                        <th className="done" style={(juser.role === 'ROLE_ADMIN' && !this.state.order.orderClosed) ? {} : {display: 'none'}} >Удалити</th>
                    </tr>
                </tbody>
                <tbody>
                    {partBody}  
                </tbody>
            </table>
        

        );



        return (

            <div >
                <div className="for-div">
                    <h3 className="tt1">Заказ: {this.state.order.id}</h3>
                    <h3 className={this.state.order.orderClosed ? "ml-auto closed" : "ml-auto open"}>{this.state.order.orderClosed ? "закритий" : "одкритий"}</h3>
                </div>
                

                <div className="form-group try-border">
                        <label
                            className={ "control-label label-for-buttons"}><h4>Клiент:</h4>
                            </label>

                            <ShowCustomerInOrder upper={this.state.order.customer.firstName + ' ' + this.state.order.customer.lastName}
                            left={this.state.order.customer.telNumber}
                            right={this.state.order.customer.email}/>

                </div>

                <div className="form-group try-border">
                        <label
                            className={ "control-label label-for-buttons"}><h4>Машина:</h4>
                            </label>

                            <ShowCustomerInOrder upper={this.state.order.car.carMade}
                            left={this.state.order.car.licencePlate}
                            right={this.state.order.car.vinCode}/>

                </div>

                <h4 className="date">Заказ одкритий: {date.format(new Date(this.state.order.orderOpened), 'DD. MM. YYYY. - HH:mm')  }</h4>

                <h4 className="date"  style={this.state.order.orderClosed ? {} : {display: 'none'}}>Заказ закритий:   {date.format(new Date(this.state.order.orderClosed), 'DD. MM. YYYY. - HH:mm')  }</h4>

                <h4 className="date">Cyмма предоплати: {this.state.order.amountPayedInAdvance}</h4>
                <h4 className="date">{this.state.order.orderClosed ? 'Оплачено:' : 'Довг:'} {this.state.order.amountToPay.toLocaleString(undefined, {maximumFractionDigits:2})}</h4>

                <h4 className="date">Проблема: {this.state.order.problem}</h4>

                <div style={(this.state.order.orderClosed) ? {display: 'none'} : {}}>
                    <hr/>
                    <button className="btn btn-info my-button" onClick={() => this.addNewWork()}>Добавити роботу</button>
                    <button className="btn btn-info my-button" onClick={() => this.addCarPart()}>Добавити запчасть</button> 
                    <button className="btn btn-info my-button" onClick={() => this.payFor()} style={
                        this.state.order.payedFor ?
                         {display: 'none'} : 
                         ((juser.role === 'ROLE_ADMIN') ? {} : {display: 'none'})
                         }>Оплатити</button>
                    <h4 className="btn btn-success my-button" style={this.state.order.payedFor ? {} : {display: 'none'}}>Оплачено</h4>
                    <button className="btn btn-info my-button" onClick={() => this.closeOrder()} style={
                         ((juser.role === 'ROLE_ADMIN') ? {} : {display: 'none'})
                         }>Закрити</button>
                    <hr/>
                </div>

                <div style={this.state.order.orderClosed ? {} : {display: 'none'}}>
                    <hr/>
                    <button className="btn btn-success my-button" onClick={() => this.getReceipt()}>Щот за роботу</button>
                    <hr/>
                </div>
                

                <br/>
                <br/>
                <h4>Роботи:</h4>
                            <div style={(this.state.order.works.length < 6) ? {display: 'none'} : {}}>
                                <input
                                    className="form-control my-input-search-field" 
                                    name="fileteredBy"
                                    value={this.state.workFileteredBy}
                                    onChange={this.filterMyWorkList}
                                    placeholder={'Назва роботи'}
                                />
                                <strong>       </strong>
                                <label
                                    className="control-label input-search-label">
                                    Показувати:</label>
                                <input
                                    className="form-control my-input-paginator-field " 
                                    name="itemsToShow"
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={this.state.itemsToShowWork}
                                    onChange={this.changeWorkListSize}
                                />

                            </div>

                {workBlock}

                <div style={(this.state.order.works.length < 6) ? {display: 'none'} : {}}>
                   {/* paginator code goes here */}
                    <strong onClick={this.workPaginatorLeft}>{this.left}     </strong> 
                    <strong>{this.state.workBeginIndex + 1} - {this.state.workEndIndex}</strong>
                    <strong onClick={this.workPaginatorRight}>     {this.right}</strong>

                    <br/>

                </div>

                <br/>
                <hr/>
                <br/>
                <h4>Запчастi:</h4>

                            <div style={(this.state.order.partCounts.length < 6) ? {display: 'none'} : {}}>
                                <input
                                    className="form-control my-input-search-field" 
                                    name="fileteredBy"
                                    value={this.state.partFileteredBy}
                                    onChange={this.filterMyPartList}
                                    placeholder={'Назва запчастi'}
                                />
                                <strong>       </strong>
                                <label
                                    className="control-label input-search-label">
                                    Показувати:</label>
                                <input
                                    className="form-control my-input-paginator-field " 
                                    name="itemsToShow"
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={this.state.itemsToShowPart}
                                    onChange={this.changePartListSize}
                                />

                            </div>

                {partBlock}

                <div style={(this.state.order.partCounts.length < 6) ? {display: 'none'} : {}}>
                   {/* paginator code goes here */}
                    <strong onClick={this.partPaginatorLeft}>{this.left}     </strong> 
                    <strong>{this.state.partBeginIndex + 1} - {this.state.partEndIndex}</strong>
                    <strong onClick={this.partPaginatorRight}>     {this.right}</strong>

                    <br/>

                </div>

            </div>

        )
    }


}


export default Order;