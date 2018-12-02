import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';
//
import { loginUser} from '../actions/authentication';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            errors: {}
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        const user = {
            email: this.state.email,
            password: this.state.password,
        }
        this.props.loginUser(user);
    }
    // componentWillReceiveProps(nextProps) {
    //     console.log('cmrp');
    //     if(nextProps.auth.isAuthenticated) {
    //         this.props.history.push('/')
    //     }
    //     if(nextProps.errors) {
    //         this.setState({
    //             errors: nextProps.errors
    //         });
    //     }
    // }

    static getDerivedStateFromProps(nextProps, prevState) {
        console.log('gds');
        if(nextProps.auth.isAuthenticated){
            this.props.history.push('/');
        } 
        if(nextProps.errors) {
            return {
                errors: nextProps.errors
            }
        }
        return null;
    }
 
    render() {
        console.log('render login');
        const { errors } = this.state;
        return(
        <div className="container" style={{ marginTop: '50px', width: '700px'}}>
            <h2 style={{marginBottom: '40px'}}>Login</h2>
            <form onSubmit={ this.handleSubmit }>
                <div className="form-group">
                    <input
                    type="email"
                    placeholder="Email"
                    className={classnames('form-control form-control-lg', {
                        'is-invalid': errors.email
                    })}
                    name="email"
                    onChange={ this.handleInputChange }
                    value={ this.state.email }
                    />
                        {(errors.email && (<div className="invalid-feedback">{errors.email}</div>))}
                </div>
                <div className="form-group">
                    <input
                    type="password"
                    placeholder="Password"
                    className={ classnames('form-control form-control-lg', { 'is-invalid': errors.password})}
                    name="password"
                    onChange={ this.handleInputChange }
                    value={ this.state.password }
                    />
                        {(errors.password && <div className="invalid-feedback">{errors.password}</div>)}
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">
                        Login User
                    </button>
                </div>
            </form>
        </div>
        )
    }
}


const mapStateToProps = state => ({
    errors: state.errors,
    auth: state.auth
})
export default connect(
    mapStateToProps,
    { loginUser }
)(withRouter(Login));