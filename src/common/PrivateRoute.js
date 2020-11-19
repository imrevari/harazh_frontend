import React from 'react';
import {Redirect, Route} from 'react-router-dom';

const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={(props) => {
        const user = JSON.parse(localStorage.getItem('user'));

        return (
            user
                ? <Component {...props} />
                : <Redirect to='/login'/>
        )
    }}
    />
);

export default PrivateRoute;