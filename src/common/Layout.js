import React from 'react';
import {Route, Switch} from 'react-router-dom';

import ErrorPage from '../components/ErrorPageDetail/ErrorPageDetail'
import Navbar from './Navbar'
import NavbarAdmin from './NavbarAdmin';
import NavbarUser from './NavbarUser';
import Login from '../containers/Login/Login'
import AdminMainPage from '../containers/AdminMainPage/AdminMainPage'
import MainPage from '../containers/MainPage/MainPage'
import Logout from '../containers/Logout/Logout'
import AddCustomer from '../containers/AddCustomer/AddCustomer'
import PrivateRoute from '../common/PrivateRoute'
import PrivateRouteAdmin from '../common/PrivateRouteAdmin'
import AddPart from '../containers/AddPart/AddPart'
//import PartsPage from '../containers/PartsPage/PartsPage'
import PartList from '../containers/PartList/PartList'
import CustomerList from '../containers/CustomerList/CustomerList'
//import CustomersPage from '../containers/CustomersPage/CustomersPage'
import NewOrder from '../containers/NewOrder/NewOrder'
//import CarsPage from '../containers/CarsPage/CarsPage' 
import AddCar from '../containers/AddCar/AddCar';
import CarList from '../containers/CarList/CarList';
import Order from '../containers/Order/Order';
import WorkCategoryList from '../containers/WorkCategory/WorkCategoryList';
import AddWorkCategory from '../containers/AddWorkCategory/AddWorkCategory'
import AddWork from '../containers/AddWork/AddWork';
import WorkList from '../containers/WorkList/WorkList';
import AddCarPartToOrder from '../containers/AddCarPartToOrder/AddCarPartToOrder';
import OrderOpenOrClosed from '../containers/OrderOpenOrClosed/OrderOpenOrClosed';
import OrderList from '../containers/OrderList/OrderList';
//import UsersPage from '../containers/UsersPage/UsersPage';
import AddUser from '../containers/AddUser/AddUser';
import UserList from '../containers/UsersList/UsersList';
import MyPage from '../containers/MyPage/MyPage';
import ChangePassword from '../containers/ChangePassword/ChangePassword';
import Receipt from '../containers/Receipt/Receipt';
import MyWorks from '../containers/MyWorks/MyWorks';


const layout = () => {


    const user = JSON.parse(localStorage.getItem('user'));
    
    return (
        <div>

                {localStorage.user ? ((user.role === 'ROLE_ADMIN') ? <NavbarAdmin user={user.name}/> :
                <NavbarUser user={user.name}/>) :
                <Navbar/>}
                

            <div className="page_content container">
                <Switch>
                    {localStorage.user ? ((user.role === 'ROLE_ADMIN') ? <PrivateRouteAdmin path="/" exact component={AdminMainPage}/> :
                    <PrivateRoute path="/" exact component={MainPage}/>) :
                    <Route path="/" exact component={Login}/>}

                    <Route path="/login" exact component={Login}/>
                    <Route path="/logout" exact component={Logout}/>
                    
                    <PrivateRoute path="/mainPage" exact component={MainPage}/>

                    <PrivateRouteAdmin path="/addPart" exact component={AddPart}/>
                    <PrivateRouteAdmin path="/editPart/:id" exact component={AddPart}/>
                    {/* <PrivateRouteAdmin path="/partsPage" exact component={PartsPage}/> */}
                    <PrivateRouteAdmin path="/partsList" exact component={PartList}/>
                    <PrivateRoute path="/addParts/:id" exact component={PartList}/>
                    <PrivateRoute path="/addCarPartCout/:order/:part" exact component={AddCarPartToOrder}/>


                    <PrivateRouteAdmin path="/customerList" exact component={CustomerList}/>
                    <PrivateRoute path="/customerList/:car" exact component={CustomerList}/>
                    {/* <PrivateRouteAdmin path="/customersPage" exact component={CustomersPage}/> */}
                    <PrivateRouteAdmin path="/newCustomer" exact component={AddCustomer}/>
                    <PrivateRouteAdmin path="/editCustomer/:id" exact component={AddCustomer}/>
                    <PrivateRouteAdmin path="/creatingCustomer/:car" exact component={AddCustomer}/>  


                    <PrivateRouteAdmin path="/newOrder" exact component={NewOrder}/>
                    <PrivateRouteAdmin path="/newOrder/:cust/:car" exact component={NewOrder}/>
                    <PrivateRoute path="/order/:id" exact component={Order}/>
                    <PrivateRouteAdmin path="/openOrder/:car/:cust" exact component={OrderOpenOrClosed}/>
                    <PrivateRouteAdmin path="/ordersOf/:state/:car/:cust" exact component={OrderList}/>
                    <PrivateRoute path="/receipt/:id" exact component={Receipt}/>


                    {/* <PrivateRouteAdmin path="/carsPage" exact component={CarsPage}/> */}
                    <PrivateRouteAdmin path="/addCar" exact component={AddCar}/>
                    <PrivateRouteAdmin path="/editCar/:id" exact component={AddCar}/>
                    <PrivateRouteAdmin path="/carList" exact component={CarList}/>
                    <PrivateRouteAdmin path="/carList/:cust" exact component={CarList}/>
                    <PrivateRouteAdmin path="/creatingCar/:cust" exact component={AddCar}/>


                    {/* <PrivateRouteAdmin path="/worksPage" exact component={WorksPage}/> */}
                    <PrivateRouteAdmin path="/addWork" exact component={AddWork}/>
                    <PrivateRouteAdmin path="/editWork/:id" exact component={AddWork}/>
                    <PrivateRouteAdmin path="/worksList" exact component={WorkList}/>
                    <PrivateRoute path="/addWorkToOrder/:id" exact component={WorkList}/>


                    {/* <PrivateRouteAdmin path="/usersPage" exact component={UsersPage}/> */}
                    <PrivateRouteAdmin path="/addUser" exact component={AddUser}/>
                    <PrivateRouteAdmin path="/editUser/:id" exact component={AddUser}/>
                    <PrivateRouteAdmin path="/userList" exact component={UserList}/>
                    <PrivateRouteAdmin path="/changeUser/:id/:order" exact component={UserList}/>
                    <PrivateRoute path="/myWorks" exact component={MyWorks}/>
                    <PrivateRouteAdmin path="/worksDoneBy/:id" exact component={MyWorks}/>

                    <PrivateRouteAdmin path="/workCategory" exact component={WorkCategoryList}/>
                    <PrivateRouteAdmin path="/workCategory/:id" exact component={WorkCategoryList}/>
                    <PrivateRouteAdmin path="/addWorkCategory" exact component={AddWorkCategory}/>
                    <PrivateRouteAdmin path="/editWorkCategory/:id" exact component={AddWorkCategory}/>


                    <PrivateRoute path="/myPage" exact component={MyPage}/>
                    <PrivateRoute path="/changePassword" exact component={ChangePassword}/>


                    <Route render={() => (<ErrorPage text="There is no page for this URL"/>)}/>
                </Switch>
            </div>

            <footer style={ {textAlign: "left"}}><hr/> ©Imre</footer>        

        </div>
    );



};

export default layout;