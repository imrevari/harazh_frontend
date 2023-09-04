import React, {Component} from 'react';
import axios from 'axios';

import ListCustomerComponent from '../../components/Customer/ListCustomerComponent'
import '../../components/Customer/ListCustomerComponent.css'


class CustomerList extends Component{

    constructor(props) {
        super(props);
        document.title = 'Клiенти - Г а р а ж';
        // console.log(props);
    }

    left = '<<<';
    right = '>>>'

    state = {

        sorted: '',

        incoming: [],

        sortedFilteredList: [],

        fileteredBy: '',

        itemsToShow: 10,

        beginIndex: 0,

        endIndex: 10
    };

    editCustomer = (id) =>{ 
        // console.log('editing ' + id);
        this.props.history.push("/editCustomer/" + id);
    }

    deleteCustomer = (id) =>{ 
        //TODO to be done
        console.log('deleting ' + id);
    }

    addCustomer = (id) =>{
        this.props.history.push("/newOrder/" + id + "/" + this.props.match.params.car); 
        // console.log('adding ' + id);
    }

    createOrder = (id) =>{ 
        // console.log('creating order for ' + id);
        const carId = (typeof(this.props.match.params.car) === 'undefined') ? 0 : this.props.match.params.car
        this.props.history.push("/newOrder/" + id + "/" + carId);
    }

    allOrders = (id) =>{
        // console.log('orders of ' + id);
        this.props.history.push("/ordersOf/x/" + id);
    }

    sortMyList = () => {

           var updatableList = [...this.state.sortedFilteredList];
   
           if (this.state.sorted === '' || this.state.sorted === 'desc'){
               const result = updatableList.sort((a, b) => (a.lastName.toLowerCase() > b.lastName.toLowerCase()) ? 1 : -1 );
   
               this.setState({...this.state,
                   sorted: 'asc' , 
                   sortedFilteredList: result });
   
           }
   
           if (this.state.sorted === 'asc' ){
               const result = updatableList.sort((a, b) => (a.lastName.toLowerCase() < b.lastName.toLowerCase()) ? 1 : -1 );
   
               this.setState({...this.state,
                   sorted: 'desc' , 
                   sortedFilteredList: result });
   
           }
   
       }

    filterMyList = (event) => {
        const target = event.target;

        let value;
        value = target.value;

        let names = value.split(' ', 3);

        const lName = names[0];
        const fName = names[1];

        const updatableList = [...this.state.incoming];

        const result = updatableList.filter((item) => item.firstName.includes(value) ||
         item.firstName.toLowerCase().includes(value) || 
         item.firstName.toUpperCase().includes(value) ||
         item.lastName.includes(value) ||
         item.lastName.toLowerCase().includes(value) || 
         item.lastName.toUpperCase().includes(value) ||
         
         (item.firstName.includes(fName) && item.lastName.includes(lName)) || 
         (item.firstName.toLowerCase().includes(fName) && item.lastName.toLowerCase().includes(lName)) || 
         (item.firstName.toUpperCase().includes(fName) && item.lastName.toUpperCase().includes(lName)) || 
         
         (item.firstName.includes(lName) && item.lastName.includes(fName)) || 
         (item.firstName.toLowerCase().includes(lName) && item.lastName.toLowerCase().includes(fName)) || 
         (item.firstName.toUpperCase().includes(lName) && item.lastName.toUpperCase().includes(fName))
         );

        const iToShow = [this.state.itemsToShow];

        this.setState({...this.state, 
            fileteredBy: value,
            sortedFilteredList: result,
            endIndex: result.length < iToShow ? result.length : iToShow});

    };

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

    getCustomers = () => {

        axios.get('/')
            .then(response => {
               // console.log(response);
                this.setState({incoming: response.data,
                    sortedFilteredList: response.data});
            })
            .catch(error => {
                // console.log('hello' + error);
                this.setState(() => {
                    throw error;
                })
                // this.props.history.push('/login');
            })
    };

    createNewCustomer = () =>{
        this.props.history.push({
            pathname: "/newCustomer",
            state: { 
                newName: this.state.fileteredBy,
                car: this.props.match.params.car
            }
          })
    }



    componentDidMount(){

        this.getCustomers();

    }



    render() {

        const juser = JSON.parse(localStorage.getItem('user'));


        const listOfCustomers = this.state.sortedFilteredList.slice(this.state.beginIndex, this.state.endIndex).map( item => {

            return (
           
                <ListCustomerComponent 
                    key={item.id}
                    name={item.lastName + ' ' + item.firstName}
                    telNumber={item.telNumber}
                    email={item.email}
                    edit={() => this.editCustomer(item.id)}
                    delete={() => this.deleteCustomer(item.id)}
                    juser={juser}
                    add={() => this.addCustomer(item.id)}
                    create={() => this.createOrder(item.id)}
                    allOrders={() => this.allOrders(item.id)}
                    car={this.props.match.params.car}
                />
            )
        });

        const myTable = ( 
            
                <table border="1" >
                    <thead>
                        <tr>
                            <th className="name" onClick={() => this.sortMyList()} >Фамiлiя iм'я &#8645;</th>
                            <th className="telNumber" >Номер тел.:</th>
                            <th className="edite" style={this.props.match.params.car === undefined ?  {} : {display: 'none'}} >Iзмiнити</th>
                            <th className="delete" style={this.props.match.params.car === undefined ?  {} : {display: 'none'}}>Удалити</th>
                            <th className="add" style={this.props.match.params.car === undefined ?  {display: 'none'} : {}}>Додати</th>
                            <th className="allOrders" style={this.props.match.params.car === undefined ?  {} : {display: 'none'}}>Старi закази</th>
                        </tr>
                    </thead>
                    <tbody>
                    {listOfCustomers} 
                    </tbody>
                </table>
            

        );

        return(
            <div>
                <div className="form-group">
                            <div>
                                <input
                                    className="form-control my-input-search-field" 
                                    name="fileteredBy"
                                    value={this.state.fileteredBy}
                                    onChange={this.filterMyList}
                                    placeholder={'Find By'}
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
                                    value={this.state.itemsToShow}
                                    onChange={this.changeListSize}
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
                    <hr/>
                    <div style={this.props.match.params.car ? {display: 'none'} : {}} >
                        <button className="my-button" onClick={this.createNewCustomer}>Свторити Клiента</button>
                    </div>

                    <div style={this.props.match.params.car ? {} : {display: 'none'}} >
                        <button className="my-button" onClick={this.createNewCustomer}>Свторити і добавити Клiента</button>
                    </div>

                </div>
            </div>
            
        )
        
    };




}

export default CustomerList;