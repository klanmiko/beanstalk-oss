import React, {Component} from 'react';
import styles from './styles'
import constants from './constants'
import {Text,Image, ScrollView, FlatList, Dimensions, View, Alert, TextInput,KeyboardAvoidingView,TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity,StatusBar} from 'react-native'
import { Container, Content, Button, Footer, Form, Item,Input } from 'native-base';
import { Feather } from '@expo/vector-icons';
import ActionSheet from 'react-native-actionsheet';
import Platform from 'react-native-platforms';



var yourPicture = require ('./sprout2.png');
export default class PostComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      caption: '',
      comments: [],
      like: false,
      new_like: false,
      user: {
        username: '',
        profile_pic:null
      },
      likes: 0,
      id: props.navigation.getParam('id'),
      comment: '',
      edit:false,
      new_caption:'',
      showHash:false,
    }
  }
  async componentDidMount() {
    let id = this.props.navigation.getParam('id')
    let response = await fetch(constants.link + "/api/Post/" + id, {
      headers: {
        Authorization: global.auth_token
      }
    });
    let data = await response.json();
    let image = {
      uri: data.photo.length <= 64 ? constants.link + "/api/photos/" + data.photo : data.photo
    }
    if(data.user.profile_pic){
      data.user.profile_pic = {
        uri: data.user.profile_pic
      }
    }

    if(data.location) {
      data.location = {
        ...data.location,
        longitude: Number(data.location.longitude),
        latitude: Number(data.location.latitude)
      }
    }

    this.setState({
      location: data.location,
      caption: data.caption,
      comments: data.comments || [],
      hashtags:data.hashtags && data.hashtags.split(" "),
      image: image,
      user: data.user,
      like: data.like || false,
      new_like: data.like || false,
      likes: data.num_likes || 0
    })
    
  }

  async likePicture() { // do some stuff on the backend
    if (!this.state.new_like) {
      response = await fetch(constants.link + "/api/Post/" + this.state.id + "/like", {
        method: "POST",
        headers: {
          Authorization: global.auth_token
        }
      });
      if(response.status == 200) {
        this.setState({new_like: true});
      }
    } else {
      response = await fetch(constants.link + "/api/Post/" + this.state.id + "/like", {
        method: "DELETE",
        headers: {
          Authorization: global.auth_token
        }
      });
      if(response.status == 200) {
        this.setState({new_like: false});
      }
    }
  }
  showActionSheet = () => {
    //To show the Bottom ActionSheet
    this.ActionSheet.show();
  };

  async addComment() {
    if(this.state.comment.trim() == ""){return}
    try {
      let response = await fetch(constants.link + "/api/Post/" + this.state.id + '/comment', {
        method: 'POST',
        headers: {
          Authorization: global.auth_token
        },
        body: JSON.stringify({
          comment: this.state.comment
        })
      });
      let res = await response.json()
      if (response.status >= 200 && response.status < 300) {
        this.setState({
          comments: [...this.state.comments, res.data],
          comment: ''
        })
      }
    } catch(error) {
      console.error(error);
    }
  }
  async deletePost() {
    try {
      let response = await fetch(constants.link + "/api/Post/" + this.state.id, {
      headers: {
          Authorization: global.auth_token,
        },
      method: "DELETE",
      })
      
      if(response.status >= 200 && response.status < 300) {
        Alert.alert('No trace left of your post anymore!');
        this.props.navigation.pop();
      }
      else {
        throw Error('Failed');
      }
    } catch (error) {
      console.error(error);
    }
  }
  async editPost() {
    if(this.state.new_caption==''){
      this.setState({edit:false});
      return
    }
    try {
      let response = await fetch(constants.link + "/api/Post/" + this.state.id, {
      
      method: "PUT",
      headers: {
        'Accept': 'application/json',
        'Content-Type':'application/json',
        'Authorization': global.auth_token

      },
      body: JSON.stringify({caption:this.state.new_caption})
      })
      
      if(response.status >= 200 && response.status < 300) {
        Alert.alert('Narration Updated!');
        this.setState({caption:this.state.new_caption});
        this.setState({new_caption:""})
        this.setState({edit:false});
      }
      else {
        throw Error('Failed');
      }
    } catch (error) {
      console.error(error);
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
    if(!this.state.edit){
      let {width} = Dimensions.get('window')
      var optionArray = [
              'Delete',
              'Edit',
              'Cancel',
            ];
      return (
        <Container>
          <StatusBar barStyle="dark-content"></StatusBar>
          <Content>
          <View style={styles.postContainer}>

              <View style={{flexDirection:"row",}}>
              <Button style={styles.profpic_container_mini}>
                <Image source={this.state.user.profile_pic} style={styles.profile_img_mini}/>
              </Button>
              <Text>{"  "}</Text>
                <View style={{flexDirection:"column",flex:1,}}>
                <View style={{flexDirection:"row", justifyContent:"space-between",}}>
                <Text style={styles.allBoldText} onPress={() => this.props.navigation.push('UserProfile', {username: this.state.user.username})}>{this.state.user.username}</Text>
                {this.state.user.username == global.curr_username ?          
                <Feather name="more-horizontal" size={20} color={"#CCCCCC"} onPress={this.showActionSheet} style={{backgroundColor:"transparent" , paddingBottom:0, paddingTop:0}} />
              : null }
              </View>
              { this.state.location &&
                <TouchableOpacity onPress={() => this.props.navigation.push('Location', this.state.location)}>               
                  <Text numberOfLines={1} style={{paddingBottom:5,marginTop:-5,fontFamily:constants.FONT}}>{this.state.location.place_name}</Text>
                </TouchableOpacity>
              }
                </View>
              </View>
              

          <ActionSheet
            ref={o => (this.ActionSheet = o)}
            //Title of the Bottom Sheet
            title={'What would you like to do with your post?'}
            //Options Array to show in bottom sheet
            options={optionArray}
            //Define cancel button index in the option array
            //this will take the cancel option in bottom and will highlight it
            cancelButtonIndex={2}
            //If you want to highlight any specific option you can use below prop
            destructiveButtonIndex={0}
            onPress={index => {
              //Clicking on the option will give you the index of the option clicked
              switch(index) {
                case 0: 
                  this.deletePost()
                  break;
                case 1: 
                  this.setState({edit:true});
                  break;
                case 2: return;
              }
            }}
          />
              
              <View style={styles.image_container}>
                <TouchableWithoutFeedback onPress={this.handleshowHash}>
                  <Image style={{width: width, height: width}}  source={this.state.image}/> 
                </TouchableWithoutFeedback>
                   
                
              </View>
              <View style={{flexDirection:"row", justifyContent:"space-between",alignItems:"center"}}>
                <Text style={styles.likeStyle}>{this.state.likes - this.state.like + this.state.new_like} likes</Text>
                {this.state.showHash && (<ScrollView  horizontal="true" contentContainerStyle={{justifyContent:"flex-end",
    flexGrow:1,}} style={{maxWidth:width/3 *2}}>
  {this.state.hashtags && this.state.hashtags.map(tag => (
 <TouchableOpacity key={tag} onPress={() => {
  // this.setState({search: '', results: []});
  this.props.navigation.navigate('Hashtag', {"hashtag":tag.substr(1)})
}}><Text style={{padding:2,fontFamily:constants.FONT}}>{tag}</Text></TouchableOpacity>
))}
                </ScrollView>)}</View>
                <View style={styles.postButtonContainer}>
                  <Button onPress={() => this.likePicture()} style={styles.postButton}>
                    <Feather name="heart" size={32} color={this.state.new_like ? '#ff8080' : constants.IDLE}/>
                  </Button>
                  <Button  style={styles.postButton}>
                    <Feather name="message-circle" size={32} color={constants.IDLE}/>
                  </Button>
                </View>
            <View style={{flexDirection:"row", alignItems:"baseline",}}>
            <Text style={styles.allBoldText}>{this.state.user.username}</Text><Text>{"  "}</Text><Text style={styles.allText}>{this.state.caption}</Text>
            </View>
            <FlatList 
              data={this.state.comments}
              keyExtractor={(item) => (item.comment_id.toString())}
              renderItem={({item}) => (
                
                <View style={styles.commentContainer}>
                
                <Text style={styles.allBoldText} onPress={() => this.props.navigation.push('UserProfile', {username: item.user})}>{item.user}</Text><Text>{" "}</Text><Text style={styles.allText}> {item.comment}</Text>
              
                  
                </View>
              )}
            />
          </View>
          
            
          </Content>
          <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={Platform.OS === 'ios' ? 65 : 0}>
          <Footer style={styles.addCommentContainer}>
            <View styles={{paddingBottom:5}}>

            <TextInput
              value={this.state.comment}
              onChangeText={(comment) => this.setState({ comment })}
              placeholder='Add a comment...'
              placeholderTextColor = "#bfbfbf"
              style={styles.commentInput}
              autoCapitalize = 'none'
            /> 
  </View><Button style={{paddingLeft:5,paddingRight:5,backgroundColor:"transparent", elevation: 0}} onPress={this.addComment.bind(this)}><Feather name="send" size={20} /></Button>
          </Footer></KeyboardAvoidingView>
        </Container>
      )
    }
    else{
      let {width} = Dimensions.get('window')
      var optionArray = [
              'Delete',
              'Edit',
              'Cancel',
            ];
      return (
        <Container>
          <Content>
          <View style={styles.postContainer}>
          <View style={{flexDirection:"row", justifyContent:"space-between"}}> 
              <View style={{flexDirection:"row", alignItems:"center", paddingBottom:8,}}>
              <Button style={styles.profpic_container_mini}>
                <Image source={this.state.user.profile_pic} style={styles.profile_img_mini}/>
              </Button>
              <Text>{"  "}</Text>
                <Text style={styles.allBoldText} onPress={() => this.props.navigation.navigate('UserProfile', {username: this.state.user.username})}>{this.state.user.username}</Text>
    
              </View>
              {this.state.user.username == global.curr_username ?          
                <Feather name="more-horizontal" size={20} color={"#CCCCCC"} onPress={this.showActionSheet} style={{backgroundColor:"transparent" , paddingBottom:0, paddingTop:0}} />
              : null }
          </View>
          <ActionSheet
            ref={o => (this.ActionSheet = o)}
            //Title of the Bottom Sheet
            title={'What would you like to do with your post?'}
            //Options Array to show in bottom sheet
            options={optionArray}
            //Define cancel button index in the option array
            //this will take the cancel option in bottom and will highlight it
            cancelButtonIndex={2}
            //If you want to highlight any specific option you can use below prop
            destructiveButtonIndex={0}
            onPress={index => {
              //Clicking on the option will give you the index of the option clicked
              switch(index) {
                case 0: 
                  this.deletePost()
                  break;
                case 1: 
                  alert(optionArray[index]);
                  break;
                case 2: return;
              }
            }}
          />
              
                <View style={styles.image_container}>
                  <Image style={{width: width, height: width}} source={this.state.image}/>

                </View>
                <Form style={{backgroundColor:"#FFFFFF"}}>
                <Item><Input style={styles.image_input} onChangeText={(new_caption) => this.setState({new_caption})} defaultValue={this.state.caption}></Input></Item>
                </Form>
                <View style={{justifyContent:"center", alignItems:"center"}}>
                <TouchableHighlight style={styles.button} onPress={() => this.editPost()} underlayColor='#40bf80'>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableHighlight>
              </View>
            {/* <View style={{flexDirection:"row", alignItems:"baseline",}}>
            <Text style={styles.allBoldText}>{this.state.user.username}</Text><Text>{"  "}</Text><Text style={styles.allText}>{this.state.caption}</Text>
            </View> */}
          </View>
          </Content>
          <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={Platform.OS === 'ios' ? 65 : 0}>
          </KeyboardAvoidingView>
        </Container>
      )
    }
  }
}