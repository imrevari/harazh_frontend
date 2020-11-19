import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';


import ListCarComponent from '../../components/ListCar/ListCarComponent'

import '../../components/ListCar/ListCarComponent.css'

class CarList extends Component{

    constructor(props) {
        super(props);
        document.title = 'Машини - Г а р а ж';
         
    }

    

    left = '<<<';
    right = '>>>'

    state = {

        sorted: '',

        incoming: [],

        sortedFilteredList: [],

        fileteredByLicense: '',

        fileteredByCarMade: '',

        fileteredByVin: '',

        itemsToShow: 10,

        beginIndex: 0,

        endIndex: 10
    };

    editCar = (id) =>{ 
        // console.log('editing ' + id);
        this.props.history.push("/editCar/" + id);
    }

    deleteCar = (id) =>{ 
        console.log('deleting ' + id);
    }

    addCar = (id) =>{ 
        // console.log('adding ' + id);
        this.props.history.push("/newOrder/" + this.props.match.params.cust + "/" +  id); 
    }

    createOrder = (id) =>{ 
        // console.log('creating order for ' + id);
        this.props.history.push("/newOrder/0/" + id);
    }

    allOrders = (id) =>{
        // console.log('orders of ' + id);
        this.props.history.push("/openOrder/" + id + "/x");
    }


    sortMyList = (type) => {
        //   console.log('sorting by ' + type)
           var updatableList = [...this.state.sortedFilteredList];
   
          
           if (type === 'vin' && (this.state.sorted === '' || this.state.sorted === 'desc') ){
               const result = updatableList.sort((a, b) => (a.vinCode.toLowerCase() > b.vinCode.toLowerCase()) ? 1 : -1 );
   
               this.setState({...this.state,
                   sorted: 'asc' , 
                   sortedFilteredList: result });
   
           }
   
           if (type === 'vin' && this.state.sorted === 'asc' ){
               const result = updatableList.sort((a, b) => (a.vinCode.toLowerCase() < b.vinCode.toLowerCase()) ? 1 : -1 );
   
               this.setState({...this.state,
                   sorted: 'desc' , 
                   sortedFilteredList: result });
   
           }
   
           if (type === 'license' && (this.state.sorted === '' || this.state.sorted === 'desc') ){
               const result = updatableList.sort((a, b) => (a.licencePlate.toLowerCase() > b.licencePlate.toLowerCase()) ? 1 : -1 );
   
               this.setState({...this.state,
                   sorted: 'asc' , 
                   sortedFilteredList: result });
   
           }
   
           if (type === 'license' && this.state.sorted === 'asc' ){
               const result = updatableList.sort((a, b) => (a.licencePlate.toLowerCase() < b.licencePlate.toLowerCase()) ? 1 : -1 );
   
               this.setState({...this.state,
                   sorted: 'desc' , 
                   sortedFilteredList: result });
   
           }

           if (type === 'made' && (this.state.sorted === '' || this.state.sorted === 'desc') ){
            const result = updatableList.sort((a, b) => (a.carMade.toLowerCase() > b.carMade.toLowerCase()) ? 1 : -1 );

            this.setState({...this.state,
                sorted: 'asc' , 
                sortedFilteredList: result });

            }

            if (type === 'made' && this.state.sorted === 'asc' ){
                const result = updatableList.sort((a, b) => (a.carMade.toLowerCase() < b.carMade.toLowerCase()) ? 1 : -1 );

                this.setState({...this.state,
                    sorted: 'desc' , 
                    sortedFilteredList: result });

            }
   
    }


    filterMyListByVin = (event) => {
        const target = event.target;

        let value;
        value = target.value;

        const updatableList = [...this.state.incoming];

        const result = updatableList.filter((item) => item.vinCode.includes(value) ||
         item.vinCode.toLowerCase().includes(value) || item.vinCode.toUpperCase().includes(value));

        const iToShow = [this.state.itemsToShow];

        this.setState({...this.state, 
            fileteredByVin: value,
            sortedFilteredList: result,
            endIndex: result.length < iToShow ? result.length : iToShow});

    };

    filterMyListByCarMade = (event) => {
        const target = event.target;

        let value;
        value = target.value;

        const updatableList = [...this.state.incoming];

        const result = updatableList.filter((item) => item.carMade.includes(value) ||
         item.carMade.toLowerCase().includes(value) || item.carMade.toUpperCase().includes(value));

        const iToShow = [this.state.itemsToShow];

        this.setState({...this.state, 
            fileteredByCarMade: value,
            sortedFilteredList: result,
            endIndex: result.length < iToShow ? result.length : iToShow});

    };

    filterMyListByLicensePlate = (event) => {
        const target = event.target;

        let value;
        value = target.value;

        const updatableList = [...this.state.incoming];

        const result = updatableList.filter((item) => item.licencePlate.includes(value) ||
         item.licencePlate.toLowerCase().includes(value) || item.licencePlate.toUpperCase().includes(value));

        const iToShow = [this.state.itemsToShow];

        this.setState({...this.state, 
            fileteredByLicense: value,
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




    getCars = () => {

        axios.get('/cars')
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



    componentDidMount(){

        this.getCars();

    }





    render() {

        const { detect } = require('detect-browser');
        const browser = detect();
        // console.log(browser.name + ' ' + browser.version  + ' ' + browser.os + 'Android OS')

        const juser = JSON.parse(localStorage.getItem('user'));


        const listOfCars = this.state.sortedFilteredList.slice(this.state.beginIndex, this.state.endIndex).map( item => {

            return (
                <ListCarComponent 
                    key={item.id}
                    vinCode={'...' + item.vinCode.substring(item.vinCode.length - 7, item.vinCode.length)}
                    licencePlate={item.licencePlate}
                    carMade={item.carMade}
                    edit={() => this.editCar(item.id)}
                    delete={() => this.deleteCar(item.id)}
                    juser={juser}
                    add={() => this.addCar(item.id)}
                    create={() => this.createOrder(item.id)}
                    allOrders={() => this.allOrders(item.id)}
                    cust={this.props.match.params.cust}
                    browser={browser.os}
                />
            )
        });

        const myTable = ( 
            
                <table border="1" >
                    <thead>
                        <tr>
                            <th className="made" onClick={() => this.sortMyList('made')} >Марка &#8645;</th>
                            <th className="vin" style={browser.os === 'Android OS' ? {display: 'none'} : {}} onClick={() => this.sortMyList('vin')} >VIN code &#8645;</th>
                            <th className="license" onClick={() => this.sortMyList('license')} >Номера &#8645;</th>
                            <th className="edite" style={this.props.match.params.cust === undefined ?  {} : {display: 'none'}} >Iзмiнити</th>
                            <th className="delete" style={this.props.match.params.cust === undefined ?  {} : {display: 'none'}}>Удалити</th>
                            <th className="add" style={this.props.match.params.cust === undefined ?  {display: 'none'} : {}}>Додати</th>
                            <th className="allOrders" style={this.props.match.params.cust === undefined ?  {} : {display: 'none'}}>Старi закази</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listOfCars} 
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
                                    value={this.state.fileteredByVin}
                                    onChange={this.filterMyListByVin}
                                    placeholder={'Find By VIN'}
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

                            <div>
                                <input
                                    className="form-control my-input-search-field-2" 
                                    name="fileteredBy"
                                    value={this.state.fileteredByLicense}
                                    onChange={this.filterMyListByLicensePlate}
                                    placeholder={'Номера'}
                                />

                                <strong>       </strong>
                                
                                <input
                                    className="form-control my-input-search-field-2" 
                                    name="fileteredBy"
                                    value={this.state.fileteredByCarMade}
                                    onChange={this.filterMyListByCarMade}
                                    placeholder={'Модель'}
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
                    <div style={this.props.match.params.cust ? {display: 'none'} : {}} >
                                <Link to="/addCar">
                                    <button className="my-button">Свторити Машину</button>
                                </Link>
                    </div>

                </div>
            </div>
            
        )
        
    };



}

export default CarList;