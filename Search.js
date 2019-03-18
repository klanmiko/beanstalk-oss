import React from 'react'
import {Button, Container} from 'native-base'
import { Feather } from '@expo/vector-icons'

import {View, Alert, StatusBar} from 'react-native';
import { SearchBar } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import HomePostComponent from './HomePost.js';
import constants from './constants'
import styles from './styles'

const urlUser = constants.link + '/api/User/search';


import { FlatList } from 'react-native';
// import console = require('console');



export default class SearchComponent extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      refreshing: false,
      loading: false,
      search: '',
      userName: '',
      results: [],
      showProfile: false,
      posts: []
    }
  }
  async _onRefresh() {
    this.setState({refreshing: true});
    await this.refresh()
    this.setState({refreshing: false})
  }

  updateSearch = search => {
    this.setState({ search, showProfile: search !== '', loading: search !== ''});
    if(search !== '') {
      return fetch(urlUser + "?query=" + search, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': auth_token
        },
      })
      .then((response) => {

        if(response.status == 200) return response.json();
        else {
          this.setState({
            loading:false
          });
          Alert.alert('no users found');
          throw Error("no users found")
        }
      })
      .then((responseJson) => {
        this.setState({
          results: responseJson.data,
          loading:false
        });
      })
      .catch((error) => {
        // error handling
      });
    }

  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'beanstalk',
      headerTitleStyle: {
        fontFamily: constants.FONT,
        paddingTop:5,
        fontSize:14,

      },
      headerRight: (<Button transparent onPress={() => navigation.navigate('AddPost')}>
        <Feather name="plus-square" size={20} style={{padding:10}}/>
      </Button>),
    }
  }
  async refresh() {
    let response = await fetch(constants.link + "/api/User/Home", {
      headers: {
        Authorization: global.auth_token
      }
    });
    if(response.status == 200) {
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
  }

  async componentDidMount() {
    await this._onRefresh(); 
  }
  render() {
    return (
    <Container>
        <StatusBar barStyle="dark-content"></StatusBar>
        <View style={{flex: 1, flexDirection: 'column'}}>
        <SearchBar style={{flexGrow: 0, flex: 1}}
          round
          lightTheme
          placeholder="Search"
          onChangeText={this.updateSearch}
          value={this.state.search}
          autoCapitalize = 'none'
          showLoading={this.state.loading}
        />

        <View style={{flex: 1}}>
        {this.state.showProfile &&
        <View style={{position: "absolute", top: 0, left: 0, bottom: 0, right: 0, zIndex: 2, opacity: 1, backgroundColor: 'white'}}>
          <FlatList 
            data={this.state.results}
            keyExtractor={(item,index) => (index.toString())}
            // keyExtractor={(item) => (item)}
            renderItem={({item}) => {
              let text = "";
              let icon="";
              let route = "";
              let args = {}
              if(item.username) {
                text = item.username;
                args.username = text;
                icon="user"
                route = 'UserProfile';
              }

              else if(item.hashtag) {
                text = item.hashtag.substr(1);
                args.hashtag = text
                icon="hash"
                route = 'Hashtag'
              }
              else {
                text = item.place_name;
                args=item;
                icon="map-pin"
                route = 'Location';
                
              }
              
              return (
                
                
              <Button style={styles.searchResultButton} onPress={() => {
                  // this.setState({search: '', results: []});
                  this.props.navigation.navigate(route, args)
                }}><View style={{flexDirection:"row",alignItems:"center",paddingLeft:30}}>

                  {icon != "hash" ?
                  <Feather name={icon} size={15} style={styles.searchIcon} color={'#000000'} /> :
                  <Feather name={icon} size={15} style={{backgroundColor: "transparent"}} color={'#000000'} />
                  }
                  <Animatable.Text style={styles.searchResult} animation="fadeIn" iterationCount={1} direction="alternate">{text}</Animatable.Text>
                </View></Button>
              
            )}}
          />
        </View>
        }
        
        <FlatList
          data={this.state.posts}
          refreshing={this.state.refreshing}
          onRefresh={() => this._onRefresh()}
          keyExtractor={(item) =>(item.pid.toString() + item.like.toString())}
          renderItem={({item}) => (
            <HomePostComponent 
              navigation={this.props.navigation}
              location={item.location} 
              caption={item.caption}
              numLikes={item.num_likes}
              imageUri={item.photo}
              user={item.user}
              id={item.pid}
              like={item.like}
              hashtags={item.hashtags}
              styles={styles.homeContainer}/>
          )}
        ></FlatList>
        </View>
        </View>
    </Container>)
  }
}
