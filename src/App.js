import React from 'react';
import './App.css';
import {BrowserRouter} from 'react-router-dom';
// import {NotificationContainer} from "react-notifications";


import Layout from './common/Layout'
import ErrorBoundry from "./common/ErrorBoundry";

const app = () => (


  <BrowserRouter>
      <div className="App">
          <ErrorBoundry>
              <Layout/>
              {/* <NotificationContainer/> */}
          </ErrorBoundry>
      </div>
  </BrowserRouter>
);

// class App extends React.Component {
//     render() {
//         return (
//             <div>
//                 <BrowserRouter>
//                     <ErrorBoundry>
//                         {/* <Layout/> */}
//                         <NotificationContainer/>
//                     </ErrorBoundry>
//                 </BrowserRouter>
//             </div>
//         )    
//     }
// }

export default app;
