import React from 'react';
import {Route, Switch} from 'react-router-dom';

import ErrorPage from '../components/ErrorPageDetail/ErrorPageDetail'
import Navbar from './Navbar'
import NavbarAdmin from './NavbarAdmin';
import NavbarUser from './NavbarUser';
import NavbarSeniorUser from './NavbarSeniorUser'
import Login from '../containers/Login/Login'
import AdminMainPage from '../containers/AdminMainPage/AdminMainPage'
import MainPage from '../containers/MainPage/MainPage'
import Logout from '../containers/Logout/Logout'
import AddCustomer from '../containers/AddCustomer/AddCustomer'
import PrivateRoute from '../common/PrivateRoute'
import PrivateRouteAdmin from '../common/PrivateRouteAdmin'
import PrivateRouteSenioruser from '../common/PrivateRouterSenioruser'
import AddPart from '../containers/AddPart/AddPart'
//import PartsPage from '../containers/PartsPage/PartsPage'
import PartList from '../containers/PartList/PartList'
import CustomerList from '../containers/CustomerList/CustomerList'
//import CustomersPage from '../containers/CustomersPage/CustomersPage'
import NewOrder from '../containers/NewOrder/NewOrder'
import TestNewOrder from '../containers/NewOrder/TestNewOrder'
//import CarsPage from '../containers/CarsPage/CarsPage' 
import AddCar from '../containers/AddCar/AddCar';
import CarList from '../containers/CarList/CarList';
import Order from '../containers/Order/Order';
import WorkCategoryList from '../containers/WorkCategory/WorkCategoryList';
import AddWorkCategory from '../containers/AddWorkCategory/AddWorkCategory'
import AddWork from '../containers/AddWork/AddWork';
import WorkList from '../containers/WorkList/WorkList';
import AddCarPartToOrder from '../containers/AddCarPartToOrder/AddCarPartToOrder';
//import OrderOpenOrClosed from '../containers/OrderOpenOrClosed/OrderOpenOrClosed';
import OrderList from '../containers/OrderList/OrderList';
//import UsersPage from '../containers/UsersPage/UsersPage';
import AddUser from '../containers/AddUser/AddUser';
import UserList from '../containers/UsersList/UsersList';
import MyPage from '../containers/MyPage/MyPage';
import ChangePassword from '../containers/ChangePassword/ChangePassword';
import Receipt from '../containers/Receipt/Receipt';
import MyWorks from '../containers/MyWorks/MyWorks';
import OpenedOrders from '../containers/Order/OpenedOrders'
import Report from '../containers/Report/Report';
import UnpaidOrders from '../containers/Order/UnpaidOrders'
import LastOrders from '../containers/Order/LastOrders'


const layout = () => {


    const user = JSON.parse(localStorage.getItem('user'));
    const path = window.location.href
    const receipt = path.includes('receipt')
    return (
        <div>

                {localStorage.user ? 
                (
                    (user.role === 'ROLE_ADMIN') ? 
                    <NavbarAdmin user={user.name}/> :
                        ((user.role === 'ROLE_SENIOR_USER') ? <NavbarSeniorUser user={user.name}/> : <NavbarUser user={user.name}/>)
                ) 
                :
                <Navbar/>}
                

            <div className="page_content container">
                <Switch>
                    {localStorage.user ? 
                    (
                        (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_SENIOR_USER')
                        ?
                        <PrivateRouteSenioruser path="/" exact component={AdminMainPage}/>
                        :
                        <PrivateRoute path="/" exact component={MainPage}/>)
                    :
                    <Route path="/" exact component={Login}/>}

                    <Route path="/login" exact component={Login}/>
                    <Route path="/logout" exact component={Logout}/>
                    
                    <PrivateRoute path="/mainPage" exact component={MainPage}/>

                    <PrivateRouteSenioruser path="/addPart" exact component={AddPart}/>
                    <PrivateRouteSenioruser path="/editPart/:id" exact component={AddPart}/>
                    {/* <PrivateRouteAdmin path="/partsPage" exact component={PartsPage}/> */}
                    <PrivateRouteSenioruser path="/partsList" exact component={PartList}/>
                    <PrivateRoute path="/addParts/:id" exact component={PartList}/>
                    <PrivateRoute path="/addCarPartCout/:order/:part" exact component={AddCarPartToOrder}/>


                    <PrivateRouteSenioruser path="/customerList" exact component={CustomerList}/>
                    <PrivateRouteSenioruser path="/customerList/:car" exact component={CustomerList}/>
                    {/* <PrivateRouteAdmin path="/customersPage" exact component={CustomersPage}/> */}
                    <PrivateRouteSenioruser path="/newCustomer" exact component={AddCustomer}/>
                    <PrivateRouteSenioruser path="/editCustomer/:id" exact component={AddCustomer}/>
                    <PrivateRouteSenioruser path="/creatingCustomer/:car" exact component={AddCustomer}/>  


                    <PrivateRouteSenioruser path="/newOrder" exact component={NewOrder}/>
                    <PrivateRouteSenioruser path="/test" exact component={TestNewOrder}/>
                    <PrivateRouteSenioruser path="/newOrder/:cust/:car" exact component={NewOrder}/>
                    <PrivateRoute path="/order/:id" exact component={Order}/>
                    {/* <PrivateRouteSenioruser path="/openOrder/:car/:cust" exact component={OrderOpenOrClosed}/> */}
                    <PrivateRouteSenioruser path="/ordersOf/:car/:cust" exact component={OrderList}/>
                    <PrivateRouteSenioruser path="/receipt/:id" exact component={Receipt}/>
                    <PrivateRoute path="/openedOrders" exact component={OpenedOrders}/>
                    <PrivateRouteSenioruser path="/unpaid" exact component={UnpaidOrders}/>
                    <PrivateRoute path="/lastOrders" exact component={LastOrders}/>


                    {/* <PrivateRouteAdmin path="/carsPage" exact component={CarsPage}/> */}
                    <PrivateRouteSenioruser path="/addCar" exact component={AddCar}/>
                    <PrivateRouteSenioruser path="/editCar/:id" exact component={AddCar}/>
                    <PrivateRouteSenioruser path="/carList" exact component={CarList}/>
                    <PrivateRouteSenioruser path="/carList/:cust" exact component={CarList}/>
                    <PrivateRouteSenioruser path="/creatingCar/:cust" exact component={AddCar}/>


                    {/* <PrivateRouteAdmin path="/worksPage" exact component={WorksPage}/> */}
                    <PrivateRouteSenioruser path="/addWork" exact component={AddWork}/>
                    <PrivateRouteSenioruser path="/editWork/:id" exact component={AddWork}/>
                    <PrivateRouteSenioruser path="/worksList" exact component={WorkList}/>
                    <PrivateRoute path="/addWorkToOrder/:id" exact component={WorkList}/>


                    {/* <PrivateRouteAdmin path="/usersPage" exact component={UsersPage}/> */}
                    <PrivateRouteAdmin path="/addUser" exact component={AddUser}/>
                    <PrivateRouteAdmin path="/editUser/:id" exact component={AddUser}/>
                    <PrivateRouteAdmin path="/userList" exact component={UserList}/>
                    <PrivateRouteAdmin path="/changeUser/:id/:order" exact component={UserList}/>
                    <PrivateRoute path="/myWorks" exact component={MyWorks}/>
                    <PrivateRouteAdmin path="/worksDoneBy/:id" exact component={MyWorks}/>
                    <PrivateRouteAdmin path="/report" exact component={Report}/>
                    <PrivateRouteAdmin path="/reportedWorks" exact component={MyWorks}/>

                    <PrivateRouteSenioruser path="/workCategory" exact component={WorkCategoryList}/>
                    <PrivateRouteSenioruser path="/workCategory/:id" exact component={WorkCategoryList}/>
                    <PrivateRouteSenioruser path="/addWorkCategory" exact component={AddWorkCategory}/>
                    <PrivateRouteSenioruser path="/editWorkCategory/:id" exact component={AddWorkCategory}/>


                    <PrivateRoute path="/myPage" exact component={MyPage}/>
                    <PrivateRoute path="/changePassword" exact component={ChangePassword}/>


                    <Route render={() => (<ErrorPage text="There is no page for this URL"/>)}/>
                </Switch>
            </div>

            <footer style={receipt ? {display: 'none'} : {textAlign: "left"}} ><hr/> ©Imre</footer>        

        </div>
    );



};

export default layout;