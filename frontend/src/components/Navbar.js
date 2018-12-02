import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect} from 'react-redux';



class Navbar extends Component {
  
    render() {
        const { isAuthenticated, user } = this.props.auth;
        const authLinks = (
            <ul className="navbar-nav ml-auto">
                <a href="" className="nav-link">
                    <img src={user.avatar} alt={user.name} title={user.name} className="rounded-circle" 
                    style={{width: '30px', marginRight: '5px'}}/>
                </a>
            </ul>
        )
        const guestLinks = (
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    <Link className="nav-link" to='/register'>Sign Up</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to='/login'>Sign In</Link>
                
                </li>
            </ul>
        )

        return(
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <Link className="navbar-brand" to="#">Redux Auth</Link>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                   {
                       isAuthenticated ? authLinks :  guestLinks
                   }
                </div>
            </nav>
        )
    }
}


const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps)(withRouter(Navbar));