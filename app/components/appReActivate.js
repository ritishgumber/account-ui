import React from 'react';
import {Link, browserHistory} from 'react-router'
import axios from 'axios'
import CircularProgress from 'material-ui/CircularProgress'

class Reset extends React.Component {
    constructor() {
        super()
        this.state = {
            appActivated: false
        }
    }
    componentDidMount() {
        if (!__isDevelopment) {
            /****Tracking*********/
            mixpanel.track('Portal:Visited ForgotPassword Page', {"Visited": "Visited ForgotPassword page in portal!"});
            /****End of Tracking*****/
        }
        console.log('this2');
        let postData = {}
        let appId = window.location.pathname.split('/')[2];
        axios.post(USER_SERVICE_URL + "/app/active/" + appId, postData).then(function(data) {
            this.state.appActivated = true;
            this.state.appname = data.data;
            this.setState(this.state);
            setTimeout(function() {
                browserHistory.replace('/');
            }, 5000);
        }.bind(this), function(err) {
            this.setProgress(false)
            this.state['errorMessage'] = 'We dont have an account with this email. Please try again.'
            if (err.response == undefined) {
                this.state['errorMessage'] = "Sorry, we currently cannot process your request, please try again later."
            }
            this.state.email = ''
            this.setState(this.state);

        }.bind(this))
        if (!__isDevelopment) {
            /****Tracking*********/
            mixpanel.track('Portal:Clicked ResetPassword Button', {"Clicked": "ResetPassword Button in portal!"});
            /****End of Tracking*****/
        }
    }

    render() {
        return (
            <div>

                <div id="login">
                    <div id="image">
                        <img className="logo" src="/assets/images/CbLogoIcon.png"/>
                        <div className={this.state.appActivated
                            ? 'hide'
                            : ''}><CircularProgress color="#4E8EF7" size={50} thickness={6}/>
                        </div>
                    </div>
                    <div id="headLine" className={this.state.appActivated
                        ? ''
                        : 'hide'}>
                        <h3 className="tacenter hfont">Your app {this.state.appname}
                            &nbsp;is now activated.</h3>
                        <h5 className="tacenter bfont">Your app is now in active state and will NOT be deleted automatically. Please make sure you use your app regularly to avoid being marked as inactive.</h5>

                    </div>
                </div>
            </div>
        );
    }
}

export default Reset;;
