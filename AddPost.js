import React, {Component} from 'react';
import styles from './styles'
import constants from './constants'
import {ImagePicker, Permissions} from 'expo'
import Platform from 'react-native-platforms'
import { Text, ScrollView, Image,TouchableHighlight,Alert } from 'react-native'
import { Button, Form, Item, Input,View} from 'native-base';
import ParsedText from 'react-native-parsed-text';
// import console = require('console');

var default_img = require ('./image_placeholder.png');
const keyboardVerticalOffset = Platform.OS === 'ios' ? 75 : 0
export default class AddPostComponent extends Component {
  static navigationOptions = ({navigation}) => {
    const {params={}}=navigation.state;
    return {
      
      headerRight: navigation.getParam('submitEnable') ? (<Button transparent onPress={navigation.getParam('submit')}>
        <Text style={{padding:10}}>Submit</Text>
      </Button>) : (<Text style={{padding:10, color:"#CCCCCC"}}>Submit</Text>)
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      caption: '',
      hashtag:'',
      placeName:'',
      lat:30,
      long:30,
      image: null,
      uploading: false,
      submitEnable:false,
    }
  }
  
  componentDidMount() {
    this.props.navigation.setParams({submitEnable:this.state.submitEnable,submit: this.submit.bind(this) });
  }
  handleHash(matchingString, matches) {
    // matches => ["[@michel:5455345]", "@michel", "5455345"]
    console.log(matchingString,matches)
  }
  render() {
    let {
      image
    } = this.state;
    
    return (
    
      
        <View style={styles.container}>
    <ScrollView>


        {/* {this.state.image && <Image source={this.state.image} style={styles.maybeRenderImage}></Image>} */}
        
        

    
      <Form style={{backgroundColor:"#FFFFFF"}}>
      <Item><Input style={styles.image_input} onChangeText={(caption) => this.setState({caption})} placeholderTextColor="#C7C7CD" placeholder="Caption"></Input></Item>
      <Item><Input style={styles.image_input} onChangeText={(hashtag) => this.setState({hashtag})} placeholderTextColor="#C7C7CD" placeholder="Hashtag"><ParsedText
          parse={
            [{pattern: /#(\w+)/, style: {color:"#309362"}}]
          }
          childrenProps={{allowFontScaling: false}}
        >{this.state.hashtag}</ParsedText></Input></Item>
      <Item><Input style={styles.image_input} onChangeText={(location) => this.setState({
        placeName: location
      })} placeholderTextColor="#C7C7CD" placeholder="Location" /></Item>
    </Form><View style={{justifyContent:"center", alignItems:"center"}}>
        <TouchableHighlight style={styles.button} onPress={() => this.pickImage()} underlayColor='#40bf80'>
            <Text style={styles.buttonText}>Choose Image</Text>
        </TouchableHighlight>
        </View>
    <Image source={this.state.image==null ? default_img : this.state.image} style={styles.image_display} />
      
    </ScrollView>
    </View>

    
    )
  }
  async pickImage() {
    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // only if user allows permission to camera roll
    if (cameraRollPerm === 'granted') {
      let image = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
      if(!image.cancelled){
      this.setState({image: image});
      if (!this.state.submitEnable){
            this.setState({submitEnable:true})
            this.props.navigation.setParams({submitEnable:this.state.submitEnable, submit: this.submit.bind(this) });
          }


      }
      
    }
    
  }
  async submit() {
    if (this.state.submitEnable){
      this.state.submitEnable=false
      this.props.navigation.setParams({submitEnable:this.state.submitEnable, submit: this.submit.bind(this) });
    }
    const {navigate} = this.props.navigation;
    let form = new FormData();
    form.append("caption", this.state.caption);
    form.append('image', {
      uri: this.state.image.uri,
      type: 'image/jpg',
      name: 'image.jpg'
    });
    if(/#(\w+)/.test(this.state.hashtag)){form.append("hashtags",this.state.hashtag);}
    
    form.append("placeName",this.state.placeName);
    form.append("lat",this.state.lat);
    form.append("long",this.state.long);
    try {
      let response = await fetch(constants.link + "/api/Post", {
        headers: {
          Authorization: global.auth_token,
          'Content-Type': 'multipart/form-data'
        },
        method: "POST",
        body: form
      })
      if(response.status == 201) {
        this.props.navigation.pop();
        Alert.alert('Adventure is out there!');
          navigate('Search');
          this.setState({image: null});
      }
      else {
        response = await response.json()
        // console.error("failed", response.message)
        Alert.alert('Please narrate your adventure','Make sure you have a caption, a valid hashtag ("#___") and location');
        this.setState({submitEnable:true});
        this.props.navigation.setParams({submitEnable:this.state.submitEnable,submit: this.submit.bind(this) });
      }
    } catch (error) {
      // console.error(error);
      Alert.alert('Please narrate your adventure','Make sure you have a caption, a valid hashtag ("#___") and location');
    }
  }
}