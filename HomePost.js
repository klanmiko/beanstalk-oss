import React, {Component} from 'react';
import {Text, View, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Image, Dimensions} from 'react-native';
import { Button } from 'native-base';
import PropTypes from 'prop-types';
import { Feather } from '@expo/vector-icons';

import styles from './styles'
import constants from './constants'



export default class HomePostComponent extends Component {
	constructor(props) {
    super(props);
    	this.state = {
				pressLike: props.like || false,
				showHash:false
    	}
    	// this.username = props.navigation.getParam('username', global.curr_username)
  	}
  	async likePicture() { // do some stuff on the backend
  		if (!this.state.pressLike) {
				response = await fetch(constants.link + "/api/Post/" + this.props.id + "/like", {
					method: "POST",
					headers: {
						Authorization: global.auth_token
					}
				});
				if(response.status == 200) {
					this.setState({pressLike: true});
				}
  		} else {
				response = await fetch(constants.link + "/api/Post/" + this.props.id + "/like", {
					method: "DELETE",
					headers: {
						Authorization: global.auth_token
					}
				});
				if(response.status == 200) {
					this.setState({pressLike: false});
				}
  		}
  	}
		handleshowHash = () => {
			if (this.state.showHash ==false){
				 this.setState({showHash: true});
	
			} else {
				 this.setState({showHash: false});
	
			}
	}
	render() {
		let {width} = Dimensions.get('window')
		return (

					<View style={styles.postContainer}>
						<View style={{flexDirection:"row", alignItems:"center",}}>
							{/* <Button style={styles.profpic_container_mini}>
							<Image source={uri:this.props.} style={styles.profile_img_mini}/>
							</Button>
							<Text>{"  "}</Text> */}
							<View style={{flexDirection:"column",flex:1}}>
							<Text style={styles.allBoldText} onPress={() => this.props.navigation.navigate('UserProfile', {username: this.props.user})}>{this.props.user}</Text>
							{ this.props.location &&
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Location', this.props.location)}>               
                  <Text numberOfLines={1} style={{paddingBottom:5,marginTop:-5, fontFamily:constants.FONT}}>{this.props.location.place_name}</Text>
                </TouchableOpacity>
              }
						</View>
						</View>
						<View style={styles.image_container}>
						<TouchableWithoutFeedback onPress={this.handleshowHash}>
						<Image source={this.props.imageUri} style={styles.image_display} />
                   </TouchableWithoutFeedback>
						
						</View>
						<View style={{flexDirection:"row", justifyContent:"space-between",alignItems:"center"}}>
						<Text style={styles.likeStyle}>{this.props.numLikes + this.state.pressLike - (this.props.like == true)} likes</Text>
						{this.state.showHash && <ScrollView horizontal="true" contentContainerStyle={{flexGrow:1,justifyContent:"flex-end"}} style={{
         maxWidth:width/3 *2}}>
  {this.props.hashtags.split(" ").map(tag => (
 <TouchableOpacity key={tag} onPress={() => {
  // this.setState({search: '', results: []});
  this.props.navigation.navigate('Hashtag', {"hashtag":tag.substr(1)})
}}><Text style={{padding:2,fontFamily:constants.FONT}}>{tag}</Text></TouchableOpacity>
))}
</ScrollView>}</View>
						<View style={styles.postButtonContainer}>
							<Button onPress={() => this.likePicture()} style={styles.postButton}>
		              			<Feather name="heart" size={32} color={this.state.pressLike ? '#ff8080' : constants.IDLE}/>
		            		</Button>
		            		<Button onPress={() => this.props.navigation.navigate('Post', {id: this.props.id})} style={styles.postButton}>
		              			<Feather name="message-circle" size={32} color={constants.IDLE}/>
		            		</Button>
	            		</View>
						<View style={{flexDirection:"row", alignItems:"baseline",}}>
          <Text style={styles.allBoldText}>{this.props.user}</Text><Text>{"  "}</Text><Text style={styles.allText}>{this.props.caption}</Text>
          </View>
						
					</View>
		)
	}
}

HomePostComponent.propTypes = {
	imageUri: PropTypes.object,
	caption: PropTypes.string,
	numLikes: PropTypes.number,
	user: PropTypes.string,
	id: PropTypes.number,
	like: PropTypes.bool,
	hashtags:PropTypes.string,
	location:PropTypes.object
}
