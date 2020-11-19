import React from 'react';
import {Link} from 'react-router-dom';

const ErrorPageDetail = (props) => {

    const Notification = (text) => {
      // console.log(text)
        switch(text) {
          case 'Failed to execute \'btoa\' on \'Window\': The string to be encoded contains characters outside of the Latin1 range.':
            return 'Логiн або/i пароль мож лиш латинськими буквами, нашими не мож';
          case 'Network Error':
            return 'Проблема з сеттю! Може зроби логaут i опять зайди';
          case 'Request failed with status code 401':
            return 'Доступ Запрещён!!!! Може зроби логaут i опять зайди';
          case 'Request failed with status code 403':
            return 'Ти шось мутиш!!!! Доступ Запрещён!!!! Ти не адмiн або не залогiнився.';
          default:
            return text;
        }
      }


    return(
        <div>
            <h2>Йойооой! Шось ся стало!</h2> 
            <hr/><br/>
            <div>Бiзуно проблема в сьому:</div>
            <div>{Notification(props.text)}</div>
            <footer style={ { textAlign: "right"} }><Link to="/logout" style={props.text === 'Request failed with status code 403' ? {display: 'none'} : {} }> logout </Link></footer> 
        </div>
        
        
    )
};

export default ErrorPageDetail;