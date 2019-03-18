import React, {Component} from 'react';
import {View, Alert, Image, TouchableOpacity, Dimensions} from 'react-native';
import { Container } from 'native-base';
import constants from './constants'


export default class HashtagPageComponent extends Component {
	constructor(props) {
    super(props);
    	this.state = {
    		refreshing: false,
    		posts: []
    	}
    	// this.username = props.navigation.getParam('username', global.curr_username)
  	}
  	static navigationOptions = ({navigation}) => {
      return {
        title: '#' + navigation.getParam('hashtag'),
        headerTitleStyle: {
          fontFamily: constants.FONT,
          paddingTop:5

        },
      
      }
    }

    async _onRefresh() {
    	this.setState({refreshing: true});
    	await this.refresh()
    	this.setState({refreshing: false})
  	}

  	async refresh() {
	    let response = await fetch(constants.link + "/api/Hashtag?hashtag=" + this.props.navigation.getParam('hashtag'), {
	      headers: {
	        Authorization: global.auth_token
	      }
	    });
	    if(response.status == 200) {
				try {
					let posts = await response.json()
					this.setState({
						posts: posts.data.map(el => ({
							...el,
							photo: {
								uri: el.photo.length <= 64 ? constants.link + "/api/photos/" + el.photo : el.photo
							}
						}))
					});
				}
				catch(e) {
					console.error(e)
				}
	    } else {
	    	Alert.alert(`fail`);
	    }
  	}

  	async componentDidMount() {
    	await this._onRefresh()
  	}

	render() {
		let {width} = Dimensions.get('window')
		return (
			<Container>
			<View style={{flexWrap:'wrap', flexDirection:"row", justifyContent:"space-between",flex:1}}> 
              {this.state.posts && 
              
                  this.state.posts.map(el => (<TouchableOpacity key={el.pid.toString()} onPress={() => this.props.navigation.push('Post',{id:el.pid})}><Image style={{width:width / 2 , height:185}} source={el.photo} /></TouchableOpacity>))
              }
            </View>

        	</Container>
		)
	}
}

