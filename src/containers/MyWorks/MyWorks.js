import React, {Component} from 'react';
import axios from 'axios';
import ListWorkdoneComponent from '../../components/ListWorkdoneComponent/ListWorkdoneComponent';
import date from 'date-and-time';



class MyWorks extends Component{


    constructor(props) {
        super(props);
        document.title = 'Зробленi роботи - Г а р а ж';
         
    }


    left = '<<<';
    right = '>>>'

    state = {

        sorted: '',

        incoming: [],

        sortedFilteredList: [],

        beginDate: '1970-01-01',

        endDate: '1970-01-01',

        itemsToShow: 10,

        beginIndex: 0,

        endIndex: 10
    };

    totalToget = () =>{
        let total = 0;
        this.state.sortedFilteredList.map( item => { return(total += item.price)})
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
               const result = updatableList.sort((a, b) => (a.orderId > b.orderId) ? 1 : -1 );
   
               this.setState({...this.state,
                   sorted: 'asc' , 
                   sortedFilteredList: result });
   
           }
   
           if (type === 'number' && this.state.sorted === 'asc' ){
               const result = updatableList.sort((a, b) => (a.orderId < b.orderId) ? 1 : -1 );
   
               this.setState({...this.state,
                   sorted: 'desc' , 
                   sortedFilteredList: result });
   
           }
   
           if (type === 'date' && (this.state.sorted === '' || this.state.sorted === 'desc') ){
               const result = updatableList.sort((a, b) => (a.orderClosed > b.orderClosed) ? 1 : -1 );
   
               this.setState({...this.state,
                   sorted: 'asc' , 
                   sortedFilteredList: result });
   
           }
   
           if (type === 'date' && this.state.sorted === 'asc' ){
               const result = updatableList.sort((a, b) => (a.orderClosed < b.orderClosed) ? 1 : -1 );
   
               this.setState({...this.state,
                   sorted: 'desc' , 
                   sortedFilteredList: result });
   
           }

           if (type === 'work' && (this.state.sorted === '' || this.state.sorted === 'desc') ){
            const result = updatableList.sort((a, b) => (a.workName.toLowerCase() > b.workName.toLowerCase()) ? 1 : -1 );

            this.setState({...this.state,
                sorted: 'asc' , 
                sortedFilteredList: result });

            }

            if (type === 'work' && this.state.sorted === 'asc' ){
                const result = updatableList.sort((a, b) => (a.workName.toLowerCase() < b.workName.toLowerCase()) ? 1 : -1 );

                this.setState({...this.state,
                    sorted: 'desc' , 
                    sortedFilteredList: result });

            }

            if (type === 'car' && (this.state.sorted === '' || this.state.sorted === 'desc') ){
                const result = updatableList.sort((a, b) => (a.licencePlate.toLowerCase() > b.licencePlate.toLowerCase()) ? 1 : -1 );
    
                this.setState({...this.state,
                    sorted: 'asc' , 
                    sortedFilteredList: result });
    
            }
    
            if (type === 'car' && this.state.sorted === 'asc' ){
                 const result = updatableList.sort((a, b) => (a.licencePlate.toLowerCase() < b.licencePlate.toLowerCase()) ? 1 : -1 );
    
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

    setStateFromResponse = (response) =>{
        let _begDate = '1970-01-01';
        let _endDate = '1970-01-01';
        if(response.data.length !== 0){
            _begDate = response.data[0].orderClosed;
            _endDate = response.data[response.data.length - 1].orderClosed;
        }
        this.setState({incoming: response.data,
            sortedFilteredList: response.data,
            beginDate: date.format(new Date(_begDate), 'YYYY-MM-DD'),
            endDate: date.format(new Date(_endDate), 'YYYY-MM-DD')
            });
    }               


    getMyWorks = () =>{
        axios.get('/users/myworks')
            .then((response) => {
                this.setStateFromResponse(response)
            })
            .catch(error => {
                 this.setState(() => {
                     throw error;
                })
            })
    }

    getWorksOfUser = () =>{
        axios.get('/users/userworks/' + this.props.match.params.id)
            .then((response) => {
                this.setStateFromResponse(response)
            })
            .catch(error => {
                 this.setState(() => {
                     throw error;
                })
            })
    }


    componentDidMount(){

        if (this.props.match.params.id) {
            this.getWorksOfUser();
        }else{
            this.getMyWorks();
        }
    }




    render() {

        const juser = JSON.parse(localStorage.getItem('user'));
        // const { detect } = require('detect-browser');
        // const browser = detect();
        // console.log(browser.name + ' ' + browser.version  + ' ' + browser.os + 'Android OS')


        const listOfOrders = this.state.sortedFilteredList.slice(this.state.beginIndex, this.state.endIndex).map( (item, index) => {
            
            return (
                <ListWorkdoneComponent 
                    key={index}
                    id={item.orderId}
                    name={item.workName}
                    price={item.price}
                    car={item.licencePlate}
                    closed={item.orderClosed} 
                />
            )
        });

        const myTable = ( 
            
                <table border="1" >
                    <thead>
                        <tr>
                            <th className="" onClick={() => this.sortMyList('number')}>Заказ &#8645;</th>
                            <th className="" onClick={() => this.sortMyList('work')}>Робота &#8645;</th>
                            <th className="" onClick={() => this.sortMyList('date')}>Зроблена &#8645;</th>
                            <th className=""  >грн</th>
                            <th className="" onClick={() => this.sortMyList('car')}>машина &#8645;</th>
                        </tr>
                    </thead>
                    <tbody>
                    {listOfOrders} 
                    <tr>
                        <td colSpan={"3"}>Всього:</td>
                        <td className="">{this.totalToget()}</td>
                        <td className="">грн</td>
                    </tr>
                    </tbody>
                </table>
            

        );

        return(
            <div>
                
                <h2> Роботи {juser.name}</h2>
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

export default MyWorks;