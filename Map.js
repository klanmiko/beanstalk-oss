import React, {Component} from 'react';
import {Permissions, Location} from 'expo';
import {View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import constants from './constants'
export default class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            latitude: 37.78825,
            longitude: -122.4324,
        }
    }
    async fetchPics(loc_id) {
        let response = await fetch(constants.link + '/api/Location?id=' + loc_id + '&username=' +this.props.user , {
          headers: {
            'Authorization': global.auth_token
          }
        });
        if(response.status == 200) {
            try {
                let posts = await response.json()
                this.setState({
                    posts: posts.data.map(el => ({
                        ...el,
                        photo: {
                            uri: constants.link + "/api/photos/" + el.photo
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
  
    render() {
        
        return (
            <View style={{flex:1}}>
            <MapView style={{flex: 1}}
                region={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
                }}
                showsUserLocation={true}
            >
            
            {this.props.locations.filter(function (a) {return !this[a.id] && (this[a.id] = true);}, Object.create(null)).map(el => (
                <Marker key={el.id} coordinate={{latitude: el.latitude, longitude: el.longitude}}
                // onPress={() => this.props.navigation.navigate('UserLocation', {user:this.props.user,location:el.id})}
                onPress={() => this.props.navigation.navigate('UserLocation', {user:this.props.user,location:el.id,longitude:el.longitude,latitude:el.latitude,place_name:el.place_name})}
                // onPress={() => {this.fetchPics(el.id)}}

                 />
            ))}
           
            </MapView>
            </View>
        );
    }
    async componentDidMount() {
        // Instead of navigator.geolocation, just use Geolocation.
        let hasLocationPermission = await Permissions.getAsync(Permissions.LOCATION);
        if (hasLocationPermission.status !== 'granted') {
            try {
                const granted = await Permissions.askAsync(Permissions.LOCATION);
                if (granted.status !== 'granted') {
                    console.log("could not get location permissions")
                    return;
                }
            } catch (err) {
                console.error(err);
            }
        }
        let location = await Location.getCurrentPositionAsync({});
        this.setState({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        })
        
    }

}
