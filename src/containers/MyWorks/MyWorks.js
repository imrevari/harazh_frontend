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

        beginDate: 
        (new Date(Date.now()).getDay() === 1)
          ?
          new Date(Date.now()).toISOString().split('T')[0]
          :
          (
            new Date(Date.now()).getDay() === 0
            ?
            new Date(new Date(Date.now()).setDate(new Date(Date.now()).getDate() - 6)).toISOString().split('T')[0]
            :
            new Date(new Date(Date.now()).setDate(new Date(Date.now()).getDate() - new Date(Date.now()).getDay() + 1)).toISOString().split('T')[0]
          ),

        endDate: new Date(Date.now()).toISOString().split('T')[0],

        itemsToShow: 10,

        beginIndex: 0,

        endIndex: 10
    };

    totalToget = () =>{
        let total = 0;
        this.state.sortedFilteredList.map( item => { return(total += item.salary)})
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

            if (type === 'user' && (this.state.sorted === '' || this.state.sorted === 'desc') ){
                const result = updatableList.sort((a, b) => (a.userName.toLowerCase() > b.userName.toLowerCase()) ? 1 : -1 );
    
                this.setState({...this.state,
                    sorted: 'asc' , 
                    sortedFilteredList: result });
    
            }
    
            if (type === 'user' && this.state.sorted === 'asc' ){
                 const result = updatableList.sort((a, b) => (a.userName.toLowerCase() < b.userName.toLowerCase()) ? 1 : -1 );
    
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

        const result = updatableList.filter((item) => item.orderClosed >= value && item.orderClosed <= this.state.endDate + 'Z');

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

        const result = updatableList.filter((item) => item.orderClosed >= this.state.beginDate && item.orderClosed <= value + 'Z') ;

        const iToShow = [this.state.itemsToShow];

        this.setState({...this.state,
            endDate:  value,
            sortedFilteredList: result,
            endIndex: result.length < iToShow ? result.length : iToShow
            });

    };

    setStateFromResponse = (response) =>{
        let beginDateToUpdate = this.state.beginDate
        let endDateToUpdate = this.state.endDate
        if(typeof(this.props.location.state) !== 'undefined'){
            if(typeof(this.props.location.state.requestBody) !== 'undefined'){
                beginDateToUpdate = this.props.location.state.requestBody.fromDate
                endDateToUpdate = this.props.location.state.requestBody.toDate
            } 
        }
        let maxToShow = !this.props.match.params.id && this.props.location.state ? 
        response.data.length : this.state.itemsToShow
        const listWithSetDates = response.data.filter((item) => item.orderClosed >= beginDateToUpdate + 'T00:00:00' && item.orderClosed <= endDateToUpdate + 'T23:59:50');
        this.setState({
            ...this.state,
            incoming: response.data,
            sortedFilteredList: listWithSetDates,
            itemsToShow: maxToShow,
            endIndex: maxToShow,
            beginDate: beginDateToUpdate,
            endDate: endDateToUpdate
            });
    }
    
    forwardToOrder = (id) =>{ 
        // console.log('creating order for ' + id);
        this.props.history.push("/order/" + id);
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

    getWorksFromRequestBody = (requestBody) =>{
        axios({method: 'post', url: '/users/report/', data: requestBody})
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
        }else if(this.props.location.state){
            //get from the server
            this.getWorksFromRequestBody(this.props.location.state.requestBody)
        }else{
            this.getMyWorks();
        }
    }

    render() {

        const juser = JSON.parse(localStorage.getItem('user'));
        // const { detect } = require('detect-browser');
        // const browser = detect();
        // console.log(browser.name + ' ' + browser.version  + ' ' + browser.os + 'Android OS')
        const showDoneBy = !this.props.match.params.id && this.props.location.state;

        const listOfOrders = this.state.sortedFilteredList.slice(this.state.beginIndex, this.state.endIndex).map( (item, index) => {
            
            return (
                <ListWorkdoneComponent 
                    key={index}
                    id={item.orderId}
                    name={item.workName}
                    price={item.price}
                    car={item.licencePlate}
                    closed={item.orderClosed}
                    forwardToOrder={() => this.forwardToOrder(item.orderId)}
                    doneBy={item.userName}
                    showDoneBy={showDoneBy}
                    salary={item.salary}
                />
            )
        });
        const myTable = ( 
                
                <table border="1" >
                    <thead>
                        <tr>
                            <th className="" onClick={() => this.sortMyList('number')}>Заказ &#8645;</th>
                            <th className="" onClick={() => this.sortMyList('work')}>Робота &#8645;</th>
                            <th className=""  style={showDoneBy ?  {} : {display: 'none'}}>грн</th>
                            <th className="" onClick={() => this.sortMyList('date')}>Зроблена &#8645;</th>
                            <th className="" onClick={() => this.sortMyList('user')}
                            style={showDoneBy ?  {} : {display: 'none'}}>Зробив &#8645;</th>
                            <th className=""  >з/п</th>
                            <th className="" onClick={() => this.sortMyList('car')}>машина &#8645;</th>
                        </tr>
                    </thead>
                    <tbody>
                    {listOfOrders} 
                    <tr>
                        <td colSpan={showDoneBy ? "5" :"3"}>Всього:</td>
                        <td className="">{this.totalToget()}</td>
                        <td className="">грн</td>
                    </tr>
                    </tbody>
                </table>
            

        );

        return(
            <div>
                <h2> {
                     (this.props.match.params.id)
                    ?
                    (this.props.location.state) ? 'Роботи ' + this.props.location.state.name : 'Роботи nameX'
                    :
                    (this.props.location.state
                        ? 
                        'Одчоти з ' + date.format(new Date(this.props.location.state.requestBody.fromDate), 'DD. MM. YYYY') +
                        ' по ' + date.format(new Date(this.props.location.state.requestBody.toDate), 'DD. MM. YYYY')
                        :
                        'Роботи ' + juser.name
                    ) 
                }</h2>
                <hr/>
                <br/>

                <div className="form-group">
                            <div style={showDoneBy ?  {display: 'none'} : {}}>
                               
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

                            <div style={showDoneBy ?  {display: 'none'} : {}}>
                                <label
                                    className="control-label">
                                    Зроблені мiж : </label>
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
                
                <div style={showDoneBy ?  {display: 'none'} : {}}>
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