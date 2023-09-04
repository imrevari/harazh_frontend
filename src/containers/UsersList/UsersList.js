import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import ListUserComponent from '../../components/ListUsers/ListUserComponent';


class UserList extends Component{

    constructor(props) {
        super(props);
        document.title = 'Пользователi - Г а р а ж';
         
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


    editUser = (id) =>{ 
        // console.log('editing ' + id);
        this.props.history.push("/editUser/" + id);
    }

    deleteUser = (id) =>{ 
        // console.log('delete ' + id);
        axios.delete('/users/' + id)
        .then((response) => {
            // console.log(response)
            
            this.setState({incoming: response.data,
                sortedFilteredList: response.data});
        })
        .catch(error => {
            this.setState(() => {
                throw error;
            })
        })
    }

    selectUser = (id) =>{ 
        // console.log('select ' + id);
        axios.post('/users/' + id + '/' + this.props.match.params.id)
                    .then(() => {
                        this.props.history.push("/order/" + this.props.match.params.order);
                    })
                    .catch(error => {
                        this.setState(() => {
                            throw error;
                        })
                    })
    }

    reportOfUser = (id, userName) =>{ 
        this.props.history.push({
            pathname: "/worksDoneBy/" + id,
            state: { name: userName }
          })
    }

    sortMyList = (type) => {
        //   console.log('sorting by ' + type)
           var updatableList = [...this.state.sortedFilteredList];
   
          
           if (type === 'name' && (this.state.sorted === '' || this.state.sorted === 'desc') ){
               const result = updatableList.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1 );
   
               this.setState({...this.state,
                   sorted: 'asc' , 
                   sortedFilteredList: result });
   
           }
   
           if (type === 'name' && this.state.sorted === 'asc' ){
               const result = updatableList.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? 1 : -1 );
   
               this.setState({...this.state,
                   sorted: 'desc' , 
                   sortedFilteredList: result });
   
           }
   
           if (type === 'role' && (this.state.sorted === '' || this.state.sorted === 'desc') ){
               const result = updatableList.sort((a, b) => (a.role > b.role) ? 1 : -1 );
   
               this.setState({...this.state,
                   sorted: 'asc' , 
                   sortedFilteredList: result });
   
           }
   
           if (type === 'role' && this.state.sorted === 'asc' ){
               const result = updatableList.sort((a, b) => (a.role < b.role) ? 1 : -1 );
   
               this.setState({...this.state,
                   sorted: 'desc' , 
                   sortedFilteredList: result });
   
           }

          
    }

    filterMyListByName = (event) => {
        const target = event.target;

        let value;
        value = target.value;

        const updatableList = [...this.state.incoming];

        const result = updatableList.filter((item) => item.name.includes(value) ||
         item.name.toLowerCase().includes(value) || item.name.toUpperCase().includes(value));

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


    getUsers = () => {

        axios.get('/users')
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

        this.getUsers();

    }

    render() {


        const listOfCars = this.state.sortedFilteredList.slice(this.state.beginIndex, this.state.endIndex).map( item => {

            return (
                <ListUserComponent 
                    key={item.id}
                    name={item.name}
                    role={item.role}
                    edit={() => this.editUser(item.id)}
                    delete={() => this.deleteUser(item.id)}
                    select={() => this.selectUser(item.id)}
                    report={() => this.reportOfUser(item.id, item.name)}
                    workId={this.props.match.params.id}
                    forReport={false}
                  
                />
            )
        });

        const myTable = ( 
            
                <table border="1" >
                    <thead>
                        <tr>
                            
                            <th className=""  onClick={() => this.sortMyList('name')}>Iмя &#8645;</th>
                            <th className="" onClick={() => this.sortMyList('role')}>права &#8645;</th>
                            <th className=""  style={this.props.match.params.id ? {display: 'none'} : {}} >Iзмiнити </th>
                            <th className="" style={this.props.match.params.id ? {display: 'none'} : {}} >удалити</th>
                            <th className="" style={this.props.match.params.id ? {} : {display: 'none'}}>вибрати</th>
                            <th className="" style={this.props.match.params.id ? {display: 'none'} : {}}>отчот</th>
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
                                    onChange={this.filterMyListByName}
                                    placeholder={'Find By login'}
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
                    <div style={this.props.match.params.id ? {display: 'none'} : {}} >
                                <Link to="/addUser">
                                    <button className="my-button">Свторити пользователя</button>
                                </Link>
                    </div>

                </div>
            </div>
            
        )
        
    };










}

export default UserList;