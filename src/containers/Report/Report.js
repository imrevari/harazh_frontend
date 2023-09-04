import React, {Component} from 'react';
import axios from 'axios';
import ListUserComponent from '../../components/ListUsers/ListUserComponent';
import date from 'date-and-time';


class Report extends Component{

    constructor(props) {
        super(props);
        document.title = 'Одчот - Г а р а ж';        
    }

    state = {
        sorted: '',
        incoming: [],
        sortedFilteredList: [],
        selected: [],
        selectAll: false,

        endDate : new Date(Date.now()).toISOString().split('T')[0],
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
        error: false
    };

    getUsers = () => {
        axios.get('/users')
            .then(response => {
                let responseList = response.data
                this.setState({...this.state,
                    incoming: responseList,
                    sortedFilteredList: responseList});
            })
            .catch(error => {
                this.setState(() => {
                    throw error;
                })
            })
    };

    selectUser = (id) => {
        let updatableList = [...this.state.sortedFilteredList];
        let selectedList = [...this.state.selected]
        updatableList = updatableList.map(user => {
            if(user.id === id){
                if(typeof(user.selected) === 'undefined'){
                    selectedList.push(id)
                    return {...user, selected: true}
                }else{
                    if(user.selected){
                        const index = selectedList.indexOf(id)
                        selectedList.splice(index, 1)
                    }else{
                        selectedList.push(id)
                    }
                    return {...user, selected: !user.selected}
                }      
            }else{
                return user
            }
        })
        this.setState({...this.state, sortedFilteredList: updatableList, selected: selectedList})
    }
    
    selectUnselectAll = () =>{
        const _selectAll = this.state.selectAll
        
        if(!_selectAll){
            this.selectAll(_selectAll)
        }else{
            this.removeAll(_selectAll)
        }

    }

    selectAll = (selectAll) =>{
        let arrayOfSelected = []
        let newSortedFilteredList = this.state.sortedFilteredList.map(user => {
            arrayOfSelected.push(user.id)
            return {...user, selected: true}
        })
        this.setState({...this.state, sortedFilteredList: newSortedFilteredList, selected:  arrayOfSelected, selectAll: !selectAll})
    }

    removeAll = (selectAll) =>{
        let newSortedFilteredList = this.state.sortedFilteredList.map(user => {
            return {...user, selected: false}
        })
        this.setState({...this.state, sortedFilteredList: newSortedFilteredList, selected: [], selectAll: !selectAll})
    }

    sortMyList = (type) => {
        //console.log('sorting by ' + type)
           var updatableList = [...this.state.incoming];
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

    setBegindDate = (event) => {
        const target = event.target;
        const value = target.value;
        if(value > this.state.endDate){
            this.setState({...this.state, error: true})
        }else{
            this.setState({...this.state,
                beginDate:  target.value,
                error: false
                });
        }
    };

    setEndDate = (event) => {
        const target = event.target;
        const value = target.value;
        if(value < this.state.beginDate){
            this.setState({...this.state, error: true})
        }else{
            this.setState({...this.state,
                endDate:  value,
                error: false
                });
        }
    };

    sendRequest = () => {
        const requestBody = {
            users: this.state.selected,
            fromDate: this.state.beginDate + "T00:00:01",
            toDate: this.state.endDate + "T23:59"
        }
        this.props.history.push({
            pathname: "/reportedWorks/",
            state: { 
                requestBody: requestBody
            }
          })
    }

    componentDidMount(){
        this.getUsers();
        
    
    }

    render() {
        const listOfUsers = this.state.sortedFilteredList.map( item => {

            return (
                <ListUserComponent 
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    role={item.role}
                    forReport={true}
                    select={() => this.selectUser(item.id)}
                    selected={item.selected}
                />
            )
        });

        const myTable = ( 
            
                <table border="1" >
                    <thead>
                        <tr>
                            
                            <th className=""  onClick={() => this.sortMyList('name')}>Iмя &#8645;</th>
                            <th className="" onClick={() => this.sortMyList('role')}>права &#8645;</th>
                            <th className="" style={this.props.match.params.id ? {display: 'none'} : {}}>
                                <input type="checkbox" id={11} onChange={this.selectUnselectAll} checked={this.state.selectAll}/>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {listOfUsers} 
                    </tbody>
                </table>
            

        );

        return(
            <div>
                <h2> Одчот </h2>
                <hr/>
                <br/>
                {myTable}
                <br/>
                
                <div>
                    <div>
                        <label
                            className="control-label">
                            Зроблені мiж : </label>
                        <input
                            className={this.state.error ? "form-control my-input-search-field-3 is-invalid" : "form-control my-input-search-field-3"}
                            name="from"
                            type="date"
                            date-inline-picker="true"
                            value={this.state.beginDate}
                            onChange={this.setBegindDate}
                            placeholder={'from'}
                        />
                        <span className="form-text invalid-feedback">
                            НЕ МОЖЕ БУТИ БІЛЬШЕ ЯК {date.format(new Date(this.state.endDate), 'DD. MM. YYYY')}
                        </span>
                        {/* <strong>       </strong> */}
                        <label
                            className="control-label">
                            i :</label>
                        <input
                            className={this.state.error ? "form-control my-input-search-field-4 is-invalid" : "form-control my-input-search-field-4"}
                            name="till"
                            type="date"
                            value={this.state.endDate}
                            onChange={this.setEndDate}
                            placeholder={'till'}
                        />
                        <span className="form-text invalid-feedback">
                            НЕ МОЖЕ БУТИ МЕНШЕ ЯК {date.format(new Date(this.state.beginDate), 'DD. MM. YYYY')}
                        </span>

                    </div>

                    <br/>
                    <hr/>
                    <div  >    
                        <button className="my-button" disabled={this.state.selected.length === 0 || this.state.error} onClick={this.sendRequest}>Отримати одчот</button>
                    </div>

                </div>
            </div>
            
        )
        
    };










}

export default Report;