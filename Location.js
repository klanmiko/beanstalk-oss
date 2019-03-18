import React, {Component} from 'react';
import {Alert, Image, TouchableOpacity, Dimensions, ScrollView, View} from 'react-native';
import { Container } from 'native-base';
import MapView, {Marker} from 'react-native-maps';
import constants from './constants'


export default class LocationPageComponent extends Component {
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
        title: navigation.getParam('place_name'),
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
			
	    let response = await fetch(constants.link + "/api/Location?id=" + this.props.navigation.getParam('id'), {
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
			<Container style={{flex: 1}}>
        <View style={{flex: 1, flexDirection: 'column', justifyContent: "space-between"}}>
				
      <MapView
        region={{
          latitude: Number(this.props.navigation.getParam('latitude')),
          longitude: Number(this.props.navigation.getParam('longitude')),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        style={{flex: 1, flexGrow: 1}}
      >
        <Marker
          coordinate={{
            latitude: Number(this.props.navigation.getParam('latitude')),
            longitude: Number(this.props.navigation.getParam('longitude')),
          }}
        ></Marker>
      </MapView>
      <View style={{flex: 1, flexGrow: 0, minHeight: width}}>
			<ScrollView > 
              {this.state.posts && 
               <View style={{flexWrap:'wrap', flexDirection:"row", justifyContent:"space-between",flex:1}}> 
                  {this.state.posts.map(el => (<TouchableOpacity key={el.pid.toString()} onPress={() => this.props.navigation.push('Post',{id:el.pid})}><Image style={{width:width / 2 , height:width /2}} source={el.photo} /></TouchableOpacity>))}
              </View>
							}
            </ScrollView>
      </View>
      </View>
        	</Container>
		)
	}
}

