import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

import ListPartComponent from '../../components/ListPart/ListPartComponent'
import '../../components/ListPart/ListPartComponent.css'


class WorkList extends Component{


    constructor(props) {
        super(props);
        document.title = 'Роботи - Г а р а ж';
    }

    left = '<<<';
    right = '>>>'

    state = {

        sorted: '',

        incoming: [],

        sortedFilteredList: [],

        fileteredBy: '',

        fileteredByCategory: '',

        itemsToShow: 10,

        beginIndex: 0,

        endIndex: 10,

        work_categories: []
    };

    editWork = (id) => {
        if (this.props.match.params.id){
            this.props.history.push({
                pathname: "/editWork/" + id,
                state: { 
                    orderId: this.props.match.params.id,
                }
              })

        }else{
            this.props.history.push("/editWork/" + id);
        }
    };
 
    deleteWork = (id, name) =>{
        const result = window.confirm("ВИДАЛИТИ " + name + '?');
        if(result){
            this.delete(id, name)
        }
    };

    delete = (id, name) =>{
        axios.delete('/work/' + id)
            .then(response => {
                //console.log(response);
                alert('Видаляю: ' + name)
                window.location.reload(false)
            })
            .catch(error => {
                // console.log('hello' + error);
                this.setState(() => {
                    throw error;
                })
            })
    } 
 
     addWork = (idOfWork) =>{ 
        //  console.log('adding ' + idOfWork);
         if (this.props.match.params.id) {
            // console.log('adding ' + this.props.match.params.id);

            axios.post('/orders/work/' + idOfWork + '/' + this.props.match.params.id)
            .then(response => {
               // console.log(response);
                // this.setState({incoming: response.data,
                //     sortedFilteredList: response.data});
                this.props.history.push("/order/" + this.props.match.params.id);
            })
            .catch(error => {
                // console.log('hello' + error);
                this.setState(() => {
                    throw error;
                })
                // this.props.history.push('/login');
            })


        }
    };



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
   
           if (type === 'price' && (this.state.sorted === '' || this.state.sorted === 'desc') ){
               const result = updatableList.sort((a, b) => (a.price >= b.price) ? 1 : -1 );
               this.setState({...this.state,
                   sorted: 'asc' , 
                   sortedFilteredList: result });
           }
   
           if (type === 'price' && this.state.sorted === 'asc' ){
               const result = updatableList.sort((a, b) => (a.price < b.price) ? 1 : -1 );
               this.setState({...this.state,
                   sorted: 'desc' , 
                   sortedFilteredList: result });
           }
   
    }

    filterMyList = (event) => {
        const target = event.target;

        const updatableList = [...this.state.incoming];
        let value = target.value;
        let filteredByValue;
        let filteredByCategory;
        let result;
        let allCategories = false;

        if(target.name === 'fileteredBy'){
            filteredByValue = value;
            if(this.state.fileteredByCategory === ''){
                allCategories = true;
            }else{
                filteredByCategory = this.state.fileteredByCategory;
            }
        }else if(target.name === 'workCategory'){
            filteredByValue = this.state.fileteredBy;
            if (value === 'all'){
                allCategories = true;
                value = '';
            }else{
                filteredByCategory = value;
            }
        }

        const firstResult = updatableList.filter((item) => item.name.includes(filteredByValue) ||
            item.name.toLowerCase().includes(filteredByValue) || item.name.toUpperCase().includes(filteredByValue));

        result = (allCategories) ? firstResult : firstResult.filter((item) => item.workCategoryResponseDto.id === parseInt(filteredByCategory));

        const iToShow = [this.state.itemsToShow];


        if(target.name === 'fileteredBy'){
            this.setState({...this.state, 
                fileteredBy: value,
                sortedFilteredList: result,
                endIndex: result.length < iToShow ? result.length : iToShow});
        }else if(target.name === 'workCategory'){
            this.setState({...this.state, 
                fileteredByCategory: value,
                sortedFilteredList: result,
                endIndex: result.length < iToShow ? result.length : iToShow});
        }
        
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



    getWorks = () => {

        axios.get('/work')
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

    getWorkCategories = () => {

        axios.get('/work_category')
            .then(response => {
                //console.log(response);
                this.setState({work_categories: response.data});
            })
            .catch(error => {
                // console.log('hello' + error);
                this.setState(() => {
                    throw error;
                })
                // this.props.history.push('/login');
            })
    };

    createWorkForOrder = (orderId) =>{
        this.props.history.push({
            pathname: "/addWork/",
            state: { 
                orderId: orderId,
                category: this.state.fileteredByCategory,
                workName: this.state.fileteredBy
            }
          })
    }



    componentDidMount(){

        this.getWorks();
        this.getWorkCategories();
    }


    render() {

        const juser = JSON.parse(localStorage.getItem('user'));

        const listOfParts = this.state.sortedFilteredList.slice(this.state.beginIndex, this.state.endIndex).map( item => {

            return (
           
                <ListPartComponent 
                    key={item.id}
                    name={item.name}
                    desc={item.description}
                    price={item.price}
                    edit={() => this.editWork(item.id)}
                    delete={() => this.deleteWork(item.id, item.name)}
                    juser={juser}
                    add={() => this.addWork(item.id)}
                    id={this.props.match.params.id}
                />
            )
        });

        const header = ( 
            
                <table border="1" >
                    <thead>
                        <tr>
                            <th className="n"  onClick={() => this.sortMyList('name')}>Назва &#8645;</th>
                            <th className="p" onClick={() => this.sortMyList('price')}>цiна &#8645;</th>
                            <th className="edit" style={
                                juser.role=== 'ROLE_JUNIOR_USER' ? 
                                {display: 'none'} : 
                                {}
                            } ></th>
                            <th className="delete" style={
                                juser.role=== 'ROLE_JUNIOR_USER' ? 
                                {display: 'none'} : 
                                (this.props.match.params.id === undefined ?  {} : {display: 'none'})
                            }></th>
                            <th className="delete" style={this.props.match.params.id === undefined ?  {display: 'none'} : {}}></th>
                        </tr>
                    </thead>
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

                                {/* <label
                                    className="control-label input-label">Category:</label> */}
                                <select
                                    className="form-control my-input-field"
                                    id="workCategory"
                                    name="workCategory"
                                    value={this.state.fileteredByCategory}
                                    onChange={this.filterMyList}
                                    >
                                    <option key="all" value="all">всi Категорiї</option>
                                    {this.state.work_categories.map((value) => {
                                        return <option key={value.id} value={value.id}>{value.categoryName}</option>
                                    })}
                                </select>

                            </div>

                  
                </div>
                {header}
                {listOfParts}

                <br/>
                
                <div >
                   {/* paginator code goes here */}
                    <strong onClick={this.paginatorLeft}>{this.left}     </strong> 
                    <strong>{this.state.beginIndex + 1} - {this.state.endIndex}</strong>
                    <strong onClick={this.paginatorRight}>     {this.right}</strong>

                    <br/>
                    <hr/>
                    <div style={this.props.match.params.id ? {display: 'none'} : {}} >
                                
                                <button className="my-button" onClick={() => this.createWorkForOrder()}>Свторити роботу</button>
                                
                                <Link to="/workCategory">
                                    <button className="my-button">Категорiї</button>
                                </Link>
                    </div>

                    <div style={this.props.match.params.id ? (juser.role==='ROLE_JUNIOR_USER' ? {display: 'none'} : {}) : {display: 'none'}} >
                        <button className="my-button" onClick={() => this.createWorkForOrder(this.props.match.params.id)}>Свторити і добавити роботу</button>
                    </div>

                </div>
            </div>
            
        )
        
    };







}


export default WorkList;