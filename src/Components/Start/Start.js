import React, { Component } from 'react';
import auth from '../../auth/auth';
import './Start.css';
import {connect} from 'react-redux';
import userStore from "../../Store/stores/user-store";
class Start extends Component {
    handleLogout = () => {
        auth.logout(()=>{
            this.props.history.push("/");
        });
    };
    render() {

        let userData = userStore.getState().user;
       console.log(userData)
        return (
            <div>
                <h1>{userData.Name}</h1>
                <h1>{userData.Email}</h1>
                <button onClick={this.handleLogout}>Logout</button>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.root.user
    }
};

export default connect(mapStateToProps)(Start);
