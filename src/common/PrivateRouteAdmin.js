import React from 'react';
import {Redirect, Route} from 'react-router-dom';


const PrivateRouteAdmin = ({component: Component, ...rest}) => (

    <Route {...rest} render={(props) => {
        const user = JSON.parse(localStorage.getItem('user'));

        return (

            user
                ? ((user.role === 'ROLE_ADMIN')
                ? <Component {...props} />
                : <Redirect to='/mainPage'/>)
                : <Redirect to='/login'/>

        )
    }}
    />

);

export default PrivateRouteAdmin;