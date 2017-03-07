import React from 'react';
import {Link} from 'react-router'
import axios from 'axios'
import cookie from 'react-cookie'
import CircularProgress from 'material-ui/CircularProgress';

class Login extends React.Component {
    constructor() {
        super()
        this.state = {
            errorMessage: '',
            email: '',
            password: '',
            notVerified: false,
            progress: false,
            isHosted: __isHosted
                ? __isHosted
                : false
        }
    }
    componentDidMount() {
        if (!__isDevelopment) {
            /****Tracking*********/
            mixpanel.track('Portal:Visited LogIn Page', {"Visited": "Visited Log In page in portal!"});
            /****End of Tracking*****/
        }
    }
    login(e) {
        e.preventDefault()
        this.setProgress(true)
        let postData = {
            email: this.state.email,
            password: this.state.password
        }
        axios.post(USER_SERVICE_URL + "/user/signin", postData).then(function(data) {
            if (!__isDevelopment) {
                /****Tracking*********/
                mixpanel.identify(data.data._id);
                mixpanel.register({"Name": data.data.name, "Email": data.data.email});
                mixpanel.track('LogIn', {
                    "Name": data.data.name,
                    "Email": data.data.email
                });
                /****End of Tracking*****/
            }
            cookie.save('userId', data.data._id, {
                path: '/',
                domain: SERVER_DOMAIN
            });
            cookie.save('userFullname', data.data.name, {
                path: '/',
                domain: SERVER_DOMAIN
            });
            cookie.save('email', data.data.email, {
                path: '/',
                domain: SERVER_DOMAIN
            });
            cookie.save('createdAt', data.data.createdAt, {
                path: '/',
                domain: SERVER_DOMAIN
            });
            if (this.props.location.query.redirectUrl)
                window.location.href = this.props.location.query.redirectUrl;
            else
                window.location.href = DASHBOARD_URL;
            }
        .bind(this), function(error) {
            this.setProgress(false)
            if (error.response.data.message == "Account verification needed") {
                this.state['errorMessage'] = 'You email is not verified yet!.'
                this.state.notVerified = true
            } else {
                this.state.notVerified = false
                this.state['errorMessage'] = 'Invalid Credentials, Please try again or create a new account.'
            }
            if (error.response == undefined) {
                this.state['errorMessage'] = "Sorry, we currently cannot process your request, please try again later."
            }
            this.setState(this.state)
        }.bind(this))
        if (!__isDevelopment) {
            /****Tracking*********/
            mixpanel.track('Portal:Clicked LogIn Button', {"Clicked": "LogIn Button in portal!"});
            /****End of Tracking*****/
        }
    }
    resend() {
        let postData = {
            email: this.state.email
        }
        axios.post(USER_SERVICE_URL + "/user/resendverification", postData)
        this.state['verificationEmailSent'] = true;
        this.setState(this.state)
    }
    changeHandler(which, e) {
        this.state[which] = e.target.value
        this.setState(this.state)
    }
    setInitialState() {

        this.state = {
            errorMessage: '',
            email: '',
            password: '',
            notVerified: false,
            progress: false
        }

        if (__isHosted) {
            this.state.isHosted = true;
        }
        this.setState(this.state)
    }
    setProgress(which) {
        this.state.progress = which
        this.setState(this.state)
    }
    render() {

        return (
            <div>
                <div className={this.state.progress
                    ? 'loader'
                    : 'hide'}>
                    <CircularProgress color="#4E8EF7" size={50} thickness={6}/>
                </div>
                <div id="login" className={!this.state.progress
                    ? ''
                    : 'hide'}>
                    <div id="image">
                        <img className="logo" src="/assets/images/CbLogoIcon.png"/>
                    </div>
                    <div id="headLine">
                        <h3 className={this.state.notVerified || this.state.verificationEmailSent
                            ? 'hide'
                            : ''}>Welcome back!</h3>
                        <h3 className={!this.state.notVerified || this.state.verificationEmailSent
                            ? 'hide'
                            : ''}>Your email is not verified.</h3>
                        <h3 className={!this.state.verificationEmailSent
                            ? 'hide'
                            : ''}>Verification email sent.</h3>
                    </div>
                    <div id="box">
                        <h5 className={this.state.notVerified || this.state.verificationEmailSent
                            ? 'hide'
                            : ''}>Sign in with your CloudBoost ID to continue.</h5>
                        <h5 className={!this.state.notVerified || this.state.verificationEmailSent
                            ? 'hide'
                            : ''}>Please click on resend email button and we'll send you a verification email.</h5>
                        <h5 className={!this.state.verificationEmailSent
                            ? 'hide'
                            : ''}>We have sent you the verification email. Please make sure you check spam.</h5>
                    </div>
                    <div id="loginbox" className={this.state.verificationEmailSent
                        ? 'hide'
                        : ''}>
                        <h5 className={this.state.notVerified
                            ? 'hide'
                            : 'tacenter red'}>{this.state.errorMessage}</h5>
                        <button onClick={this.resend.bind(this)} className={this.state.notVerified
                            ? 'loginbtn'
                            : 'hide'}>Resend Verification Email</button>
                        <form onSubmit={this.login.bind(this)} className={!this.state.notVerified
                            ? ''
                            : 'hide'}>
                            <input type="email" value={this.state.email} onChange={this.changeHandler.bind(this, 'email')} className="loginInput from-control" placeholder="Your Email." required/>
                            <input type="password" value={this.state.password} onChange={this.changeHandler.bind(this, 'password')} className="loginInput from-control" placeholder="Your Password." required/>
                            <button className="loginbtn" type="submit">
                                Sign in to CloudBoost
                                <i className="icon ion-chevron-right"></i>
                            </button>
                        </form>
                        <Link to="/reset" className={!this.state.notVerified
                            ? ''
                            : 'hide'}>
                            <span className="forgotpw fl">Forgot password.</span>
                        </Link>
                        <Link to="/login" className={this.state.notVerified
                            ? ''
                            : 'hide'} onClick={this.setInitialState.bind(this)}>
                            <span className="forgotpw fl">Login.</span>
                        </Link>
                        <Link to="/signup" className={this.state.isHosted
                            ? ''
                            : 'hide'}>
                            <span className="forgotpw fr">
                                <span className="greydonthaveaccnt">Dont have an account?</span>
                                Get Started.</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
