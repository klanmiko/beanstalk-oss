import React, {Component} from 'react';
import constants from './constants'


import NotificationComponent from './Notification.js';

var urlProfile = constants.link + "/api/User/profile/"

export default class ActivityFeedComponent extends Component {
    static navigationOptions = ({navigation}) => {
      return {
        title: 'Beanstalk',
        header: null
      }
    }
    constructor(props){
       super(props);
       this.state = {
        isLoading: true,
        first_name: ''
      }
     }

    componentDidMount() {
      this.subscription = global.events.addListener('userDataChanged', () => {
        this.forceUpdate();
      });
    }
    componentWillUnmount() {
      this.subscription.remove();
    }
  
    static navigationOptions = ({navigation}) => {
      return {
        title: 'notifications',
        headerTitleStyle: {
          fontFamily: constants.FONT,
          paddingTop:5,
          fontSize:14,

        },
      
      }
    }
  
    helloUser = () => {
          const { navigate } = this.props.navigation;
       return fetch(urlProfile + global.curr_username, {
                                  method: 'GET',
                                  headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    'Authorization': auth_token
                                  }
       })
         .then((response) => response.json())
         .then((responseJson) => {
           this.setState({
             isLoading: false,
             dataSource: responseJson.data,
             first_name: responseJson.data.first_name,
           }, function(){
  
                //Alert.alert("in profile");
       navigate('Profile');
           });
         })
         .catch((error) => {
           console.error(error);
         });
       
     }
    render() {
      const { navigate } = this.props.navigation;
      return (
        
            <NotificationComponent navigation={this.props.navigation}></NotificationComponent>
           

      );
    }
  }