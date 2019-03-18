import React, {Component} from 'react';
import {Text, View, TextInput, TouchableHighlight, Alert, Image, AsyncStorage} from 'react-native';
import styles from './styles'
import{Button} from 'native-base'
import constants from './constants'
import {ImagePicker, Permissions} from 'expo'
var yourPicture = require ('./sprout2.png');
const urlProfile = constants.link + "/api/User/profile/"

export default class EditInfoScreen extends Component {

    constructor(props){
       super(props);
       this.state = {
        isLoading: true,
        first_name: global.curr_first_name,
        profile_pic:global.curr_profile_pic,
        // last_name: global.curr_last_name,
        email: global.curr_email
      }
     }
     
     async handleSaveInfo(){
      const { navigate } = this.props.navigation;
      let form = new FormData();
      form.append("first_name", this.state.first_name);
      form.append('image', {
        uri: this.state.profile_pic.uri,
        type: 'image/jpg',
        name: 'image.jpg'
      });
      form.append("email", this.state.email);
      try{
        console.log(urlProfile + global.curr_username);
        let response = await fetch(urlProfile + global.curr_username, {
                                  method: 'PUT',
                                  headers: {
                                    'Accept': 'application/json',
                                    'Content-Type':'multipart/form-data',
                                    'Authorization': global.auth_token
  
                                  },
                                  body: form
                                  // JSON.stringify({
                                  //   profile_pic:this.state.profile_pic.uri,
                                  //   first_name: this.state.first_name,
                                  //   // last_name: this.state.last_name,
                                  //   email: this.state.email
  
                                  // })
        });

        console.log(response);
  
        let res = await response.text(); 
        if (response.status >= 200 && response.status < 300) {
          this.setState({error: "success"});
          global.curr_profile_pic = this.state.profile_pic;
          global.curr_first_name = this.state.first_name;
          // global.curr_last_name = this.state.last_name;
          global.curr_email = this.state.email;
          AsyncStorage.setItem('curr_first_name', this.state.first_name);
          // AsyncStorage.setItem('curr_last_name', this.state.last_name);
          AsyncStorage.setItem('curr_email', this.state.email);

          global.events.emit('userDataChanged');
          Alert.alert('Congrats! You have a new identity. ');
          this.props.navigation.pop()
        } else {
          let error = res;
          Alert.alert(error);
          throw error;
        }
      } catch(error) {
        this.setState({error: error});
        console.error("error " + error);
      }
  
    }
  
    render() {
    const {navigate} = this.props.navigation;
    let {
      profile_pic
    } = this.state;
    if(this.state.profile_pic==null){this.state.profile_pic=yourPicture}
    return (
  
        <View style={styles.form_container}>
          <Text>Edit Your Information{"\n"}{"\n"}</Text>
          <View style={{marginTop:-25,padding:10}}>
            <Button style={styles.profpic_container} onPress={() => this.pickImage()}>
              <Image source={this.state.profile_pic==global.curr_profile_pic ? global.curr_profile_pic : this.state.profile_pic} style={styles.profile_img}/>
            </Button>
          </View>
          <View style={{paddingBottom:15}}>
          <View style={{textAlign: 'left'}}>
            <Text>First Name</Text>
          </View>
          <TextInput
            value={this.state.first_name}
            onChangeText={(first_name) => this.setState({ first_name })}
            placeholder={global.curr_first_name}
            placeholderTextColor = "#bfbfbf"
            style={styles.input}
            autoCapitalize = 'none'
          />
          {/* <View style={{textAlign: 'left'}}>
            <Text>{"\n"}{"\n"}Last Name</Text>
          </View>
          <TextInput
            value={this.state.last_name}
            onChangeText={(last_name) => this.setState({ last_name })}
            placeholder={global.curr_last_name}
            placeholderTextColor = "#bfbfbf"
            style={styles.input}
            autoCapitalize = 'none'
          /> */}
          <View style={{textAlign: 'left'}}>
            <Text>{"\n"}{"\n"}Email</Text>
          </View>
          <TextInput
            value={this.state.email}
            onChangeText={(email) => this.setState({ email })}
            placeholder={global.curr_email}
            placeholderTextColor = "#bfbfbf"
            style={styles.input}
            autoCapitalize = 'none'
          />
          </View>
          <TouchableHighlight style={styles.button} onPress={() => this.handleSaveInfo()} underlayColor='#40bf80'>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableHighlight>
        </View>
  
    );
    
    }
    async pickImage() {
      const {
        status: cameraRollPerm
      } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  
      // only if user allows permission to camera roll
      if (cameraRollPerm === 'granted') {
        let profile_pic = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 3],
        });
  
        this.setState({profile_pic: profile_pic});
      }
    }
  
  }