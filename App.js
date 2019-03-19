import React, {Component} from 'react';
import {Text, View, TouchableHighlight, AsyncStorage, Image, TouchableOpacity,RefreshControl, ScrollView, Dimensions, StatusBar} from 'react-native';
import { Container, Footer, FooterTab, Button, Badge} from 'native-base';
import {createBottomTabNavigator, createSwitchNavigator, createStackNavigator, createAppContainer,StackActions, NavigationActions} from 'react-navigation';
import {SecureStore, Font, AppLoading} from 'expo';
import { Feather } from '@expo/vector-icons';
import HomeScreen from './HomeScreen.js'
import RegisterScreen from './RegisterScreen.js'
import ActivityFeedComponent from './ActivityFeed'
import EditInfoScreen from './EditInfo'
import AddPostComponent from './AddPost'
import SearchComponent from './Search'
import styles from './styles'
import constants from './constants'
import { EventEmitter } from 'fbemitter';
import PostComponent from './Post.js';
import Map from './Map.js';
import NotificationComponent from './Notification.js';
import HashtagPageComponent from './Hashtag.js';
import LocationPageComponent from './Location.js';
import UserLocationPageComponent from './UserLocation.js';
import UnreadContext from './UnreadContext'


global.auth_token = "";
global.curr_username = "";
global.curr_profile_pic=null;
global.curr_first_name = "";
global.events = new EventEmitter();
global.curr_email = "";
global.curr_profile_pic=null;

class ProfileComponent extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'profile',
      headerTitleStyle: {
        fontFamily: constants.FONT,
        fontSize:14
      },
      headerRight: (<Button transparent onPress={navigation.getParam('logout')}>
        <Text style={styles.logoutStyle}>logout</Text>
      </Button>)
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      refreshEnabled: true,
      user: {
        first_name: '',
        profile_pic:null,
        username:''
      
      },
      followers: {
        followers: 0,
        following: 0,
      },
      num_posts:0,
      isFollowing: false,
      locations: [],
      index: 0
    }
    this.username = props.navigation.getParam('username', global.curr_username)
  }
  async _onRefresh() {
    this.setState({refreshing: true});
    await this.loadProfile()
    this.setState({refreshing: false})
  }
  async logout() {
    let result = await SecureStore.deleteItemAsync('auth_token');
    global.curr_email = '';
    global.curr_first_name = '';
    global.curr_profile_pic = '';
    global.curr_username = '';
    AsyncStorage.removeItem('curr_username');
    AsyncStorage.removeItem('curr_email');
    AsyncStorage.removeItem('curr_first_name');
    AsyncStorage.removeItem('curr_last_name');
    global.events.emit('userDataChanged');
    this.props.navigation.navigate('AuthLoading');
  }

  async loadProfile() {
    let response = await fetch(constants.link + '/api/User/profile/' + this.username, {
      headers: {
        'Authorization': global.auth_token
      }
    });

    let {data} = await response.json()

    if(data.posts) {
      data.posts = data.posts.map(el => ({
        ...el,
        photo: {
          uri: el.photo.length <= 64 ? constants.link + "/api/photos/" + el.photo : el.photo
        }
      }))
    }
    if(data.user.profile_pic){
      data.user.profile_pic = {
        uri: data.user.profile_pic
      }
      if(data.user.username == global.curr_username){
        global.curr_profile_pic = data.user.profile_pic
      }
    }
    if(data.locations && data.locations.length > 0) {
      data.locations = data.locations.map(el => ({
        ...el,
        latitude: Number(el.latitude),
        longitude: Number(el.longitude)
      }))
    }
    this.setState({
      user: data.user,
      followers: data.followers || this.state.followers,
      isFollowing: data.isFollowing,
      posts: data.posts || [],
      num_posts:data.num_posts || 0,
      locations: data.locations || [],
      markers:[],
    })
  }

  async componentDidMount() {
    this.props.navigation.setParams({ logout: this.logout.bind(this) });
    if(this.username == global.curr_username) {
      this.subscription = global.events.addListener('userDataChanged', (e) => {
        this.setState(prevState => ({
          ...prevState,
          user: {
            ...prevState.user,
            first_name: global.curr_first_name,
            profile_pic: global.curr_profile_pic,
          }
        }));
      });
    }

    this.loadProfile()
  }
  componentWillUnmount() {
    this.subscription && this.subscription.remove();
  }
  
  editInfo = () => {
    const { navigate } = this.props.navigation;
    navigate('EditInfo');
  }

  switchProfileTab(index) {
    this.setState({index: index})
  }

  async follow() {
    let method = "POST"
    if(this.state.isFollowing) {
      method = "DELETE"
    }
    let response = await fetch(constants.link + '/api/User/follow/' + this.username, {
      method: method,
      headers: {
        'Authorization': global.auth_token
      }
    });
    if(response.status == 200) {
      if(method === "DELETE") {
        this.setState({isFollowing: false});
      }
      else {
        this.setState({isFollowing: {
          request: 1
        }});
      }
    }
  }


  render() {
    let {width} = Dimensions.get('window')
    const { navigate } = this.props.navigation;
    let AppComponent = null;

    if (this.state.index == 0) {
      //AppComponent = ProfileComponent;
    } else {
      // AppComponent = Map;
    }

    function getFollowingText(followState) {
      if(!followState) {
        return "Follow"
      }
      else {
        switch(followState.request) {
          case 0: return "Request Sent";
          case 1: return "Following";
        }
      }
    }

    return (

      <Container>
        <StatusBar barStyle="dark-content"></StatusBar>
        <ScrollView contentContainerStyle={{flex: 1}} refreshControl={<RefreshControl enabled={this.state.refreshEnabled} refreshing={this.state.refreshing} onRefresh={() => this._onRefresh()}/>}>
        <View style={{flex: 1, flexDirection: 'column'}}>
          <View style={{flexDirection:'row',justifyContent: 'space-between',paddingLeft:30}}>
            <View style={{flexDirection:'column',marginTop:-5,justifyContent:"flex-start", alignItems:"center",paddingTop:20}}>
            <Button style={styles.profpic_container}>
              <Image source={this.state.user.profile_pic == null ? require('./sprout2.png') : this.state.user.profile_pic} style={styles.profile_img}/>
            </Button>
            <Text style={styles.firstNameProfile}>{this.state.user.first_name}</Text>
            </View>
            <View style={{flexDirection:'column',padding:20,alignItems:"flex-end",paddingTop:35}}>
              <Text style={styles.allText}>{this.state.num_posts} photos</Text>
              <Text style={styles.allText}>{this.state.followers.followers} followers</Text>
              <Text style={styles.allText}>{this.state.followers.following} following</Text>
              {this.username == global.curr_username ? <TouchableHighlight style={styles.button} onPress={this.editInfo.bind(this)} underlayColor='#40bf80'>
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableHighlight> : <TouchableHighlight style={styles.button} onPress={this.follow.bind(this)} underlayColor='#40bf80'>
                <Text style={styles.buttonText}>{getFollowingText(this.state.isFollowing)}</Text>
              </TouchableHighlight>
            }
            </View>
          </View>
          <FooterTab style={{flex: 1, flexGrow: 0, flexShrink: 0, minHeight:54, borderWidth:1, borderColor:"#cccccc", backgroundColor: 'transparent'}}>
            <Button style={{borderRightWidth:1, borderTopRightRadius:0,borderBottomRightRadius:0, borderColor:"#cccccc"}} onPress={() => this.switchProfileTab(0)}>
              <Feather name="grid" size={26} color={this.state.index == 0 ? constants.ACCENT : constants.IDLE}/>
            </Button>
            <Button onPress={() => this.switchProfileTab(1)}>
              <Feather name="map-pin" size={26} color={this.state.index == 1 ? constants.ACCENT : constants.IDLE}/>
            </Button>
            

          </FooterTab>
              {this.state.index == 0 && this.state.posts && 
                          <ScrollView scrollEventThrottle={30} onScroll={(e) => {
                            if(e.nativeEvent.contentOffset.y > 0) {
                              this.setState({refreshEnabled: false})
                            }
                            else {
                              this.setState({refreshEnabled: true})
                            }
                          }} nestedScrollEnabled={true} style={{flex:1, backgroundColor: 'white'}} contentContainerStyle={{flexWrap: 'wrap', flexDirection: 'row'}}> 

                  {this.state.posts.map(el => (<TouchableOpacity key={el.pid.toString()} onPress={() => this.props.navigation.push('Post',{id:el.pid})}><Image style={{width:width / 2 - 0.3, height:185}} source={el.photo} /></TouchableOpacity>))}
                  </ScrollView>
              }
        {this.state.index == 1 && 
          /*<MapView
          style={{
            flex: 1,
          }}
          showsUserLocation={true}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        />*/
        <Map user={this.state.user.username} locations={this.state.locations} navigation={this.props.navigation}></Map>
        
        }
            
            </View>
        </ScrollView>
      
     
      </Container>
    );
  }
}


const BeanstalkHomeScreen = createBottomTabNavigator(
      {
        Search: createStackNavigator({
          Home: SearchComponent,
          AddPost: AddPostComponent,
          Post: PostComponent,
          UserProfile: ProfileComponent,
          Hashtag: HashtagPageComponent,
          Location: LocationPageComponent,
          Map:Map,
          UserLocation: UserLocationPageComponent,
        },
        {
          initialRouteName: 'Home'
        }),
        ActivityFeed: createStackNavigator({
          Home: ActivityFeedComponent,
          Post: PostComponent,
          UserProfile: ProfileComponent,
          Hashtag: HashtagPageComponent,
          Location: LocationPageComponent,
          UserLocation: UserLocationPageComponent,
        },{
          initialRouteName: "Home"
        }),
        Post: createStackNavigator({
          Home: PostComponent,
          UserProfile: ProfileComponent,
          Hashtag: HashtagPageComponent,
          Location: LocationPageComponent,
          UserLocation: UserLocationPageComponent,
        },{
          initialRouteName: "Home"
        }),
        Location: createStackNavigator({
          Home: LocationPageComponent,
          Post: PostComponent,
          UserProfile: ProfileComponent,
          Hashtag: HashtagPageComponent,
          Location: LocationPageComponent,
          UserLocation: UserLocationPageComponent,
          Map:Map,
        },{
          initialRouteName: "Home"
        }),
        Notification: createStackNavigator({
          Home: NotificationComponent,
          Post: PostComponent,
          UserProfile: ProfileComponent,
          Hashtag: HashtagPageComponent,
          Location: LocationPageComponent,
          UserLocation: UserLocationPageComponent,
        },{
          initialRouteName: "Home"
        }),
        UserLocation: createStackNavigator({
          Home: UserLocationPageComponent,
          Post: PostComponent,
          UserProfile: ProfileComponent,
          Hashtag: HashtagPageComponent,
          Location: LocationPageComponent,
          UserLocation: UserLocationPageComponent,
        },{
          initialRouteName: "Home"
        }),
        Hashtag: createStackNavigator({
          Home: HashtagPageComponent,
          Post: PostComponent,
          UserProfile: ProfileComponent,
          Hashtag: HashtagPageComponent,
          Location: LocationPageComponent,
          UserLocation: UserLocationPageComponent,
        },{
          initialRouteName: "Home"
        }),
        Map: createStackNavigator({
          Home: Map,
          Post: PostComponent,
          UserProfile: ProfileComponent,
          Hashtag: HashtagPageComponent,
          Location: LocationPageComponent,
          UserLocation: UserLocationPageComponent,
        },{
          initialRouteName: "Home"
        }),
        Profile: createStackNavigator({
          Home: ProfileComponent,
          EditInfo: EditInfoScreen,
          Post: PostComponent,
          UserProfile: ProfileComponent,
          Hashtag: HashtagPageComponent,
          Location: LocationPageComponent,
          UserLocation: UserLocationPageComponent,
        },{
          initialRouteName: 'Home',
        })
      },
      {
        initialRouteName: "Search",
        tabBarOptions: {
          safeAreaInset: {
            bottom: 'always',
            top: 'always'
          }
        },
        

        tabBarComponent: props => {
          let navigate = props.navigation.navigate;

          const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Home' })],
          });
          return (
            
            <Footer style={{backgroundColor: 'transparent'}}>
          <FooterTab style={{backgroundColor: 'transparent'}}>
            <Button active={props.navigation.state.index == 0}
            style={{backgroundColor: 'transparent'}}
             onPress={() => props.navigation.state.index == 0 && props.navigation.state.routes[0].index>0? props.navigation.dispatch(resetAction) : navigate('Search') }>
              <Feather name="home" size={26} color={props.navigation.state.index == 0 ? constants.ACCENT : constants.IDLE}/>
            </Button>
            <UnreadContext.Consumer>
              {value => (<Button badge={value.unread > 0} style={{backgroundColor: 'transparent'}} active={props.navigation.state.index == 1}
              onPress={() => props.navigation.state.index == 1&& props.navigation.state.routes[1].index>0 ? props.navigation.dispatch(resetAction) : navigate('ActivityFeed')}>
                <View>
                <Feather name="heart" size={26} color={props.navigation.state.index == 1 ? constants.ACCENT : constants.IDLE}/>
                {value.unread > 0 && <Badge style={{width:20, height:20, position: 'absolute', left:20,bottom:25,backgroundColor:"#199888",}}><Text style={{textAlign:"center",color:"white",fontSize:10,fontWeight:"bold",
                }}>{value.unread}</Text></Badge>}</View>
          </Button>)}
              
            </UnreadContext.Consumer>
            
            <Button style={{backgroundColor: 'transparent'}} active={props.navigation.state.index == 8}
            onPress={() => props.navigation.state.index == 8 && props.navigation.state.routes[8].index>0? props.navigation.dispatch(resetAction) : navigate('Profile')}>
              <Feather name="user" size={26} color={props.navigation.state.index == 8 ? constants.ACCENT : constants.IDLE}/>
            </Button>
          </FooterTab>
        </Footer>
          );
        }
      }
);

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await SecureStore.getItemAsync('auth_token');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
      </View>
    );
  }
}

const BeanstalkStack = BeanstalkHomeScreen;
const AuthStack = createStackNavigator({
  Home: HomeScreen,
  Register: RegisterScreen,
})

const RootStack = createSwitchNavigator({
  Auth: AuthStack,
  App: BeanstalkStack,
  AuthLoading: AuthLoadingScreen
},
{
  initialRouteName: 'AuthLoading'
});

const AppContainer = createAppContainer(RootStack);
type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      unread: {
        unread: 0,
        set: this.set.bind(this)
      }
    }
  }
  set(newVal) {
    this.setState(state => ({
      ...state,
      unread: {
        ...state.unread,
        unread: newVal
      }
    }))
  }
  async componentDidMount() {
    await Font.loadAsync({
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
    })
    try{
      global.auth_token = await SecureStore.getItemAsync('auth_token');
      global.curr_username = await AsyncStorage.getItem('curr_username');
      global.curr_first_name = await AsyncStorage.getItem('curr_first_name');
      global.curr_last_name = await AsyncStorage.getItem('curr_last_name');
      global.curr_email = await AsyncStorage.getItem('curr_email');
      global.events.emit('userDataChanged');
      await this.getNotifications()
    }
    catch(error) {
      console.error(error);
    }
    this.setState({loading: false});
    this.subscription = global.events.addListener('userDataChanged', (e) => {
      this.getNotifications()
    });
  }

  async getNotifications() {
    let response = await fetch(constants.link + "/api/User/Notification", {
      headers: {
        Authorization: global.auth_token
      }
    });
    let responseJson = await response.json();
    let stringData = JSON.stringify(responseJson.data);
    if (response.status == 200) {
      let unread = responseJson.data.filter(el => el.read==false).length;
      this.set(unread)
    }
  }
  render() {
    return (this.state.loading ? <AppLoading /> : <UnreadContext.Provider value={this.state.unread}><AppContainer /></UnreadContext.Provider>);
  }
}