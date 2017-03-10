import React from 'react';
import { Link } from 'react-router'
import axios from 'axios'
import cookie from 'react-cookie'
import CircularProgress from 'material-ui/CircularProgress'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class NewServer extends React.Component {
   constructor(){
      super()
      this.state = {
         errorMessage:'',
         name:'',
         email:'',
         password:'',
         progress:false
      }
   }
   componentWillMount() {
     if(__isBrowser) document.title = "CloudBoost | New Server"
      axios.get(USER_SERVICE_URL+'/server/isNewServer').then((res)=>{
         if(!res.data){
            window.location.href = '/#/login'
         }
      });
   }
   signUp(e){
      e.preventDefault()
      this.setProgress(true)
      let postData = {email:this.state.email,password:this.state.password,name:this.state.name,isAdmin:true}
      axios.post(USER_SERVICE_URL+"/user/signup",postData).then(function(data){
         cookie.save('userId', data.data._id, { path: '/' ,domain:SERVER_DOMAIN});
         cookie.save('userFullname', data.data.name, { path: '/' ,domain:SERVER_DOMAIN});
         cookie.save('email', data.data.email, { path: '/' ,domain:SERVER_DOMAIN});
         cookie.save('createdAt', data.data.createdAt, { path: '/' ,domain:SERVER_DOMAIN});
         window.location.href = DASHBOARD_URL;
      }.bind(this),function(err){
         this.setProgress(false) 
         this.state['errorMessage'] = 'User with same credentials exists, Please try again.'
         if(err.response == undefined){
            this.state['errorMessage'] = "Sorry, we currently cannot process your request, please try again later."
         }
         this.setState(this.state)
      }.bind(this))
   }
   changeHandler(which,e){
      this.state[which] = e.target.value
      this.setState(this.state)
   }
   setProgress(which){
      this.state.progress = which
      this.setState(this.state)
   }
   render() {
      return (
         <MuiThemeProvider>
            <div>
               <div className={this.state.progress ? 'loader':'hide'}>
                  <CircularProgress color="#4E8EF7" size={50} thickness={6} />
               </div>
             	<div id="login" className={!this.state.progress ? '':'hide'}>
            		<div id="image">
            			<img className="logo" src="/assets/images/CbLogoIcon.png"/>
            		</div>
            		<div id="headLine">
            			<h3 className="tacenter hfont">Setup your CloudBoost Server.</h3>
            		</div>
            		<div id="box">
            			<h5 className="tacenter bfont">Create an admin account to get started.</h5>
            		</div>
            		<div className="loginbox">
                     <h5 className="tacenter red">{ this.state.errorMessage }</h5>
                     <form onSubmit={this.signUp.bind(this)}>
               			<input type="text" value={this.state.name} onChange={this.changeHandler.bind(this,'name')} className="loginInput from-control" placeholder="Full Name" required/>
                        <input type="email" value={this.state.email} onChange={this.changeHandler.bind(this,'email')} className="loginInput from-control" placeholder="Email" required/>
                        <input type="password" value={this.state.password} onChange={this.changeHandler.bind(this,'password')} className="loginInput from-control" placeholder="Password" required/>
               			<button className="loginbtn" type="submit"> Setup Server</button>
                     </form>
            		</div>
                  <div className="loginbox twotop">
                     <h5 className="tacenter bfont fs13">By creating an account, you agree with the <a href="https://cloudboost.io/terms" target="_blank" className="forgotpw">Terms and Conditions </a>.</h5>
                  </div>
            	</div>
            </div>
         </MuiThemeProvider>
      );
   }
}

export default NewServer;