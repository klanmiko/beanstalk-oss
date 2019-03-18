import React, {Component} from 'react';
import {Text, View, FlatList, ScrollView, RefreshControl, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import { Feather } from '@expo/vector-icons';
import update from 'immutability-helper';
import UnreadContext from './UnreadContext';

import styles from './styles'
import constants from './constants'


class NotificationComponent extends Component {
	constructor(props) {

    super(props);
    	this.state = {
      		haveNotifs: false,
      		refreshing: false,
          username: ''
    	}
    	// this.username = props.navigation.getParam('username', global.curr_username)
  	}

  	 async _onRefresh() {
    	this.setState({refreshing: true});
    	await this.refresh()
    	this.setState({refreshing: false})
  	}

  	async refresh() {
	    let response = await fetch(constants.link + "/api/User/Notification", {
	      headers: {
	        Authorization: global.auth_token
	      }
	    });
	    let responseJson = await response.json();
	    let stringData = JSON.stringify(responseJson.data);
	    if (response.status == 200) {
		    this.setState({
		    	haveNotifs: true,
		    	notifs: responseJson.data
		    })
				let unread = responseJson.data.filter(el => el.read==false).length;
				try{
				this.props.context.set(unread)
				}
				catch(e){
					console.error(e)
				}
			}
  	}

  	async componentDidMount() {
	    
  		await this._onRefresh();

  	}


  	async navToProfileOrPost(item, index) {
			try{
				const state2 = update(this.state, {
					notifs: {
						[index]: {
							read: {$set: true}
						}
					}
				});

				this.setState(state2);

				fetch(constants.link + "/api/User/Notification/" + item.id, {
					method: 'POST',
					headers: {
						Authorization: global.auth_token
					}
				});

				this.props.context.set(this.props.context.unread - 1);

				if (item.notif_type == "L" || item.notif_type == "C") {
					this.props.navigation.navigate('Post',{id: Number(item.link)});
				} else {
					this.props.navigation.navigate('UserProfile', {username: item.link});
				}
			}
			catch(error) {
				console.error(error);
			}
  	}

	render() {
		return (
              <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing}
								onRefresh={() => this._onRefresh()} />} >

              	{this.state.haveNotifs == true &&

              	<FlatList
              		data={this.state.notifs}
              		
              		renderItem={({item, index}) => {
										let split = item.message.split(' ');
										let userName = split[0];
										let userNameSpace = userName + " ";
										split.shift();

										let messageTail = split.join(" ");
										return (
              		 	<View style={{...styles.notifContainer, backgroundColor: "transparent"}}>
                    
              		 	<View style={styles.notif_pic_container}>
										 
											
              		 		{item.notif_type == "L" && <Feather name="heart" size={20} style={{backgroundColor:"transparent",}} color={'#ff8080'}/>}
              		 		{item.notif_type == "C" && <Feather name="message-circle" style={{backgroundColor:"transparent"}}size={20} color={'#62cce3'}/>}
              		 		{item.notif_type == "F" && <Feather name="user" size={20} style={{backgroundColor:"transparent"}}color={'#77c548'}/>}
              		 	</View>
											<View style={{flexDirection:"row",flex:1,alignItems:"center",justifyContent:"space-between",paddingRight:10}}>
              		 	<TouchableOpacity onPress={() => this.navToProfileOrPost(item, index)}>
              		 	<Text style={styles.notif}>
                      
                      <Text style={{fontWeight:'bold'}} onPress={() => this.props.navigation.navigate('UserProfile', {username: userName})}>{userNameSpace}</Text>
              
                      {messageTail}
                      
              		 	</Text>
              		 	</TouchableOpacity>
										 { !item.read && <View style={{width:8, 
											height:8,
											backgroundColor:"#40bf80",
											borderRadius:100,}}></View>}
											</View>
              		 	</View>
              		 )}}
              		 keyExtractor={(item) => item.id.toString()}
              	/>

				
			
			}
				</ScrollView>
				
			
		)
	}
}

export default props => (
  <UnreadContext.Consumer>
    {value => <NotificationComponent {...props} context={value} />}
  </UnreadContext.Consumer>
);

NotificationComponent.propTypes = {
	imageUri: PropTypes.object,
	username: PropTypes.string,
	action: PropTypes.string,
	notifText: PropTypes.string,  // will carry whole notification action
}
