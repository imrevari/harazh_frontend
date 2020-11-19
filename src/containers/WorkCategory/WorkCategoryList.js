import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

import ListWorkCategoryComponent from '../../components/ListWorkCategory/ListWorkCategoryComponent'
import '../../components/ListPart/ListPartComponent.css'


class WorkCategoryList extends Component{


    // constructor(props) {
    //     super(props);
    // }

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

    editWork = (id) => {
         this.props.history.push("/editWorkCategory/" + id);
    };
 
     deleteWork = (id) =>{ 
         console.log('deleting ' + id);
    };
 
    sortMyList = (type) => {
        //   console.log('sorting by ' + type)
           var updatableList = [...this.state.sortedFilteredList];
   
          
           if (type === 'name' && (this.state.sorted === '' || this.state.sorted === 'desc') ){
               const result = updatableList.sort((a, b) => (a.categoryName.toLowerCase() > b.categoryName.toLowerCase()) ? 1 : -1 );
   
               this.setState({...this.state,
                   sorted: 'asc' , 
                   sortedFilteredList: result });
   
           }
   
           if (type === 'name' && this.state.sorted === 'asc' ){
               const result = updatableList.sort((a, b) => (a.categoryName.toLowerCase() < b.categoryName.toLowerCase()) ? 1 : -1 );
   
               this.setState({...this.state,
                   sorted: 'desc' , 
                   sortedFilteredList: result });
   
           }
   
    }

    filterMyList = (event) => {
        const target = event.target;

        let value;
        value = target.value;

        const updatableList = [...this.state.incoming];

        const result = updatableList.filter((item) => item.categoryName.includes(value) ||
         item.categoryName.toLowerCase().includes(value) || item.categoryName.toUpperCase().includes(value));

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



    getWorkCategories = () => {

        axios.get('/work_category')
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

        this.getWorkCategories();
    }


    render() {

        const listOfParts = this.state.sortedFilteredList.slice(this.state.beginIndex, this.state.endIndex).map( item => {

            return (
           
                <ListWorkCategoryComponent 
                    key={item.id}
                    name={item.categoryName}
                    edit={() => this.editWork(item.id)}
                    delete={() => this.deleteWork(item.id)}
                    id={this.props.match.params.id}
                />
            )
        });

        const header = ( 
            
                <table border="1" >
                    <thead>
                        <tr>
                            <th className="n"  onClick={() => this.sortMyList('name')}>Назва &#8645;</th>
                            
                            <th className="edit" style={
                                this.props.match.params.id === undefined ?  {} : {display: 'none'}
                            } ></th>
                            <th className="delete" style={
                                this.props.match.params.id === undefined ?  {} : {display: 'none'}
                            }></th>
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
                                <Link to="/addWorkCategory">
                                    <button className="my-button">Свторити категорiю</button>
                                </Link>
                    </div>

                </div>
            </div>
            
        )
        
    };







}


export default WorkCategoryList;