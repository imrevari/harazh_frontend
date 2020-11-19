import {Component} from 'react'
import axios from "axios";
import {NotificationManager} from 'react-notifications';

class Logout extends Component {
    constructor(props) {
        super(props);
        document.title = 'Logged out';
    }

    componentDidMount() {
        axios.post('/logout')
            .then(response => {
                //  console.log(response);
                localStorage.removeItem('user');
                this.props.history.push('/');
                NotificationManager.error(JSON.parse(response.data).message);
            })
            .catch(error => {
                // console.log(error.response);
                localStorage.removeItem('user');
                this.setState(() => {
                    throw error;
                })
            });
    }

    render() {
        
        return null;
    }
}

export default Logout;