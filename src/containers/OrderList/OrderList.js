import React, {Component} from 'react';
import axios from 'axios';
import ListOrderComponent from '../../components/ListOrderComponent/ListOrderComponent';
import date from 'date-and-time';



class OrderList extends Component{


    constructor(props) {
        super(props);
        document.title = 'Закази - Г а р а ж';
         
    }


    left = '<<<';
    right = '>>>'

    state = {

        name: '',

        sorted: '',

        incoming: [],

        sortedFilteredList: [],

        beginDate: '1970-01-01',

        endDate: '1970-01-01',

        itemsToShow: 10,

        beginIndex: 0,

        endIndex: 10,

        closedOrders: false
    };

    openOrder = (id) =>{
        this.props.history.push("/order/" + id);
    }

    totalToPay = (works, partCounts, amountPayedInAdvance) =>{
        let total = 0;
        total -= amountPayedInAdvance;

        works.map(item =>{
            if (item.workDone){
                total += item.price;
            }
            return total;
        })
        partCounts.map(item =>{
                total += (item.retailPrice * item.amount);
                return total;      
        })
        
       return total;
    }

    paginatorLeft = () => {
        const bIndex = [this.state.beginIndex];
        const eIndex = [this.state.endIndex];
        const size = [this.state.itemsToShow];

        let begIndexInt = parseInt(bIndex);
        let endIndexInt = parseInt(eIndex);
        const sizeInt = parseInt(size);

        endIndexInt = begIndexInt;
        begIndexInt = endIndexInt - sizeInt; 

        if (begIndexInt <= 0){
            this.setState({...this.state, 
                beginIndex: 0,
                endIndex: sizeInt}); 
        }else{
            this.setState({...this.state, 
                beginIndex: begIndexInt,
                endIndex: endIndexInt});
        }
        
    }

    paginatorRight = () => {
        

        const listSize = this.state.sortedFilteredList.length;
        const bIndex = [this.state.beginIndex];
        const eIndex = [this.state.endIndex];
        const size = [this.state.itemsToShow];

        let begIndexInt = parseInt(bIndex);
        let endIndexInt = parseInt(eIndex);
        const sizeInt = parseInt(size);
        const listSizeInt = parseInt(listSize); 
        
        endIndexInt = endIndexInt + sizeInt;
        begIndexInt = begIndexInt + sizeInt;      

        if (endIndexInt <= listSizeInt){
            this.setState({...this.state, 
                beginIndex: begIndexInt,
                endIndex: endIndexInt});
        }

        else if(endIndexInt >= listSizeInt && begIndexInt < listSizeInt){
            const newBegIndex = [this.state.endIndex];
            const newBegIndexInt = parseInt(newBegIndex);
            this.setState({...this.state, 
                beginIndex: newBegIndexInt,
                endIndex: listSizeInt});
        }
  
    }

    changeListSize = (event) =>{
        const target = event.target;

        let value;
        value = target.value;
        const listSize = this.state.sortedFilteredList.length;
        const bIndex = [this.state.beginIndex];
        const listSizeInt = parseInt(listSize);
        const bIndexInt = parseInt(bIndex);
        const valueInt = parseInt(value);
        const eIndex = bIndexInt + valueInt;
        
        if(value !== '' && eIndex < listSizeInt){
            this.setState({...this.state, 
                itemsToShow: value,
                endIndex: eIndex});
        }else if(value !== '' && eIndex > listSizeInt){
            this.setState({...this.state, 
                itemsToShow: value,
                endIndex: listSizeInt});      
        }else{
            this.setState({...this.state, 
                itemsToShow: value});
        }
    }

    sortMyList = (type) => {
        //   console.log('sorting by ' + type)
           var updatableList = [...this.state.sortedFilteredList];
   
          
           if (type === 'number' && (this.state.sorted === '' || this.state.sorted === 'desc') ){
               const result = updatableList.sort((a, b) => (a.id > b.id) ? 1 : -1 );
   
               this.setState({...this.state,
                   sorted: 'asc' , 
                   sortedFilteredList: result });
   
           }
   
           if (type === 'number' && this.state.sorted === 'asc' ){
               const result = updatableList.sort((a, b) => (a.id < b.id) ? 1 : -1 );
   
               this.setState({...this.state,
                   sorted: 'desc' , 
                   sortedFilteredList: result });
   
           }
   
           if (type === 'close' && (this.state.sorted === '' || this.state.sorted === 'desc') ){
               const result = updatableList.sort((a, b) => (a.orderClosed > b.orderClosed) ? 1 : -1 );
   
               this.setState({...this.state,
                   sorted: 'asc' , 
                   sortedFilteredList: result });
   
           }
   
           if (type === 'close' && this.state.sorted === 'asc' ){
               const result = updatableList.sort((a, b) => (a.orderClosed < b.orderClosed) ? 1 : -1 );
   
               this.setState({...this.state,
                   sorted: 'desc' , 
                   sortedFilteredList: result });
   
           }
   
    }

    setBegindDate = (event) => {
        const target = event.target;

        let value;
        value = target.value;

        const updatableList = [...this.state.incoming];

        const result = updatableList.filter((item) => item.orderOpened >= value && item.orderOpened <= this.state.endDate + 'Z');

        // console.log(result)

        const iToShow = [this.state.itemsToShow];

        this.setState({...this.state,
            beginDate:  value,
            sortedFilteredList: result,
            endIndex: result.length < iToShow ? result.length : iToShow
            });

    };

    setEndDate = (event) => {
        const target = event.target;

        let value;
        value = target.value;

        // console.log(value)

        const updatableList = [...this.state.incoming];

        const result = updatableList.filter((item) => item.orderOpened >= this.state.beginDate && item.orderOpened <= value + 'Z') ;

        const iToShow = [this.state.itemsToShow];

        this.setState({...this.state,
            endDate:  value,
            sortedFilteredList: result,
            endIndex: result.length < iToShow ? result.length : iToShow
            });

    };

    setStateFromResponseForCar = (response, isOpened) =>{
        let _name = '';
        let _begDate = '1970-01-01';
        let _endDate = '1970-01-01';
        if(response.data.length !== 0){
            _name = response.data[0].car.carMade;
            _begDate = response.data[0].orderOpened;
            _endDate = response.data[response.data.length - 1].orderOpened;
        }
        this.setState({incoming: response.data,
            sortedFilteredList: response.data,
            closedOrders: isOpened,
            name: _name,
            beginDate: date.format(new Date(_begDate), 'YYYY-MM-DD'),
            endDate: date.format(new Date(_endDate), 'YYYY-MM-DD')
            });
    }               

    setStateFromResponseForCustomer = (response, isOpened) =>{
        let _name = '';
        let _begDate = '1970-01-01';
        let _endDate = '1970-01-01';
        if(response.data.length !== 0){
            _name = response.data[0].customer.firstName + ' ' + response.data[0].customer.lastName;
            _begDate = response.data[0].orderOpened;
            _endDate = response.data[response.data.length - 1].orderOpened;
        }
        this.setState({incoming: response.data,
            sortedFilteredList: response.data,
            closedOrders: isOpened,
            name: _name,
            beginDate: date.format(new Date(_begDate), 'YYYY-MM-DD'),
            endDate: date.format(new Date(_endDate), 'YYYY-MM-DD')
            });
    }               
    
    getClosedOrdersbyCar = () =>{
        axios.get('/orders/car/closed/' + this.props.match.params.car)
                    .then((response) => {
                        // console.log(response.data)
                        this.setStateFromResponseForCar(response, true);
                    })
                    .catch(error => {
                        this.setState(() => {
                            throw error;
                        })
                    })
    }

    getOpenedOrdersbyCar = () =>{
        axios.get('/orders/car/open/' + this.props.match.params.car)
                    .then((response) => {
                        // console.log(response.data)
                        this.setStateFromResponseForCar(response, false);
                    })
                    .catch(error => {
                        this.setState(() => {
                            throw error;
                        })
                    })
    }

    getClosedOrdersbyCustomer = () =>{
        axios.get('/orders/customer/closed/' + this.props.match.params.cust)
                    .then((response) => {
                        // console.log(response.data)
                        this.setStateFromResponseForCustomer(response, true);
                    })
                    .catch(error => {
                        this.setState(() => {
                            throw error;
                        })
                    })
    }

    getOpenedOrdersbyCustomer = () =>{
        axios.get('/orders/customer/open/' + this.props.match.params.cust)
                    .then((response) => {
                        // console.log(response.data)
                        this.setStateFromResponseForCustomer(response, false);
                    })
                    .catch(error => {
                        this.setState(() => {
                            throw error;
                        })
                    })
    }





    componentDidMount(){

        if(this.props.match.params.state === 'open'){

            if(this.props.match.params.car === 'x'){
                // console.log('getting open order of cust ' + this.props.match.params.cust)
                this.getOpenedOrdersbyCustomer();
            }else{
                // console.log('getting open order of car ' + this.props.match.params.car);
                this.getOpenedOrdersbyCar();
            }

        }else if(this.props.match.params.state === 'closed'){

            if(this.props.match.params.car === 'x'){
                // console.log('getting closed order of cust ' + this.props.match.params.cust)
                this.getClosedOrdersbyCustomer();
            }else{
                // console.log('getting closed order of car ' + this.props.match.params.car)
                this.getClosedOrdersbyCar();
            }

        }

    }




    render() {

        // const { detect } = require('detect-browser');
        // const browser = detect();
        // console.log(browser.name + ' ' + browser.version  + ' ' + browser.os + 'Android OS')


        const listOfOrders = this.state.sortedFilteredList.slice(this.state.beginIndex, this.state.endIndex).map( item => {

            return (
                <ListOrderComponent 
                    key={item.id}
                    id={item.id}
                    opened={item.orderOpened}
                    closed={item.orderClosed}
                    details={() => this.openOrder(item.id)}
                    isClosed={this.state.closedOrders}
                    total={this.totalToPay(item.works, item.partCounts, item.amountPayedInAdvance)}
                    
                />
            )
        });

        const myTable = ( 
            
                <table border="1" >
                    <thead>
                        <tr>
                            <th className=""  onClick={() => this.sortMyList('number')}>Номер &#8645;</th>
                            <th className=""  >Одкритий </th>
                            <th className="" onClick={() => this.sortMyList('close')} style={this.state.closedOrders ? {} : {display: 'none'} } >Закритий &#8645;</th>
                            <th className=""  >{this.state.closedOrders ? 'Оплачено' : 'Довг' } </th>
                            <th className="" >Деталi</th>
                        </tr>
                    </thead>
                    <tbody>
                    {listOfOrders} 
                    </tbody>
                </table>
            

        );

        return(
            <div>
                
                <h2> {this.props.match.params.state === 'open' ? "Одкритi" : "Закритi"}  закази {this.state.name}</h2>
                <hr/>
                <br/>

                <div className="form-group">
                            <div>
                               
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
                                    value={this.state.itemsToShow}
                                    onChange={this.changeListSize}
                                />

                            </div>

                            <div>
                                <label
                                    className="control-label">
                                    Одкритi мiж : </label>
                                <input
                                    className="form-control my-input-search-field-3" 
                                    name="from"
                                    type="date"
                                    date-inline-picker="true"
                                    value={this.state.beginDate}
                                    onChange={this.setBegindDate}
                                    placeholder={'from'}
                                />

                                <strong>       </strong>
                                <label
                                    className="control-label">
                                     i :</label>
                                <input
                                    className="form-control my-input-search-field-4" 
                                    name="till"
                                    type="date"
                                    value={this.state.endDate}
                                    onChange={this.setEndDate}
                                    placeholder={'till'}
                                />

                            </div>

                  
                </div>
                {myTable}
    

                <br/>
                
                <div >
                   {/* paginator code goes here */}
                    <strong onClick={this.paginatorLeft}>{this.left}     </strong> 
                    <strong>{this.state.beginIndex + 1} - {this.state.endIndex}</strong>
                    <strong onClick={this.paginatorRight}>     {this.right}</strong>

                    <br/>

                </div>
            </div>
            
        )
        
    };







}

export default OrderList;