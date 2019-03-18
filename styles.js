import {StyleSheet, Dimensions} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import constants from './constants'

export default StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
    },
    form_container: {
      alignItems: 'center', 
      justifyContent: 'center',
      marginTop: 50,
      backgroundColor: '#FFFFFF',
    },
    buttonText: {
      textAlign: 'center',
      fontSize: 15,
      color: 'white',
      fontFamily: constants.FONT
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
      fontFamily: constants.FONT,
      fontWeight: 'bold',
      letterSpacing: 1
    },
    commentContainer: {
      flexDirection: 'row',
      alignItems:"baseline"
    },
    signUp: {
      color: constants.ACCENT,
      fontFamily: constants.FONT
    },
    header: {
      paddingTop: getStatusBarHeight(),
      height: 54 + getStatusBarHeight()
    },
    error: {
      color: 'red',
      paddingTop: 10
    },
  
    button: {
      alignItems: 'center',
      justifyContent: 'center', 
      backgroundColor: constants.ACCENT,
      width: 150,
      height: 35,
      padding: 10,
      borderRadius: 20,
      marginVertical:5,
    },
    input: {
      width: 200,
      fontSize: 14,
      height: 44,
      padding: 5,
      paddingBottom:-10,
      borderWidth: 0,
      borderBottomWidth: 1,
      borderColor: "#cccccc",
      fontFamily: constants.FONT
    },
    image_container:{
      justifyContent:"center",
      alignItems:"center",
    },
    image_display: {
      height: Dimensions.get('window').width,
      width: Dimensions.get('window').width,
    },
    image_input: {
      padding:10,
      borderColor:"#cccccc",
      borderRadius:2
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    postContainer: {
      padding:15,
      alignItems:"stretch",
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
    },
    postButton: {
      backgroundColor: 'transparent',
      padding:2,
      elevation: 0
    },
    postButtonContainer: {
      flex: 1,
      flexDirection: 'row',
      
    },
    profpic_container:{
      borderWidth:1,
       borderColor:'#CCCCCC',
       alignItems:'center',
       justifyContent:'center',
       width:100,
       height:100,
       backgroundColor:'#fff',
       borderRadius:100,
       overflow:"hidden",
    },
    profile_img: {
      width:100,
      height:100,
      
    },
    profpic_container_mini:{
      borderWidth:1,
       borderColor:'#CCCCCC',
       alignItems:'center',
       justifyContent:'center',
       width:30,
       height:30,
       backgroundColor:'#fff',
       borderRadius:100,
       overflow:"hidden",
    },
    profile_img_mini: {
      width:30,
      height:30,
      
    },
    searchResult: {
      alignSelf: 'stretch',
      backgroundColor: '#CCCCCC',
      borderRadius:0,
    },
    allText: {
      fontFamily: constants.FONT
    },
    allBoldText: {
      fontFamily: constants.FONT,
      fontWeight: "bold"
    },
    likeStyle: {
      fontFamily: constants.FONT,
      fontWeight: 'bold',
      paddingTop: 10
    },
    searchResult: {
      // paddingLeft: 10,
      fontFamily: constants.FONT,
      color: constants.ACCENT,
      fontWeight: 'bold',
      paddingTop:8

    },
    searchResultButton: {
      borderColor: constants.IDLE,
      borderWidth: 1,
      backgroundColor: 'transparent',
      width: Dimensions.get('window').width,
      borderRadius: 0,
      borderTopWidth: 0
    },
    logoutStyle: {
      padding: 10,
      fontFamily: constants.FONT,
      fontWeight: 'bold',
      fontSize:12
    },
    firstNameProfile: {
      fontWeight: 'bold',
      paddingTop: 10,
      fontFamily: constants.FONT
    },
    addCommentContainer: {
      //alignItems:"center"
      paddingTop: 5,
      flexDirection:"row",
      alignItems:"center",
      backgroundColor: '#EEEEEE'
    },
    commentInput: {
      width: Dimensions.get('window').width - 40,
      fontSize: 14,
      borderWidth: 1,
      borderColor: "#cccccc",
      fontFamily: constants.FONT,
      borderRadius:10,
      height: 40,
      paddingLeft: 20,
      backgroundColor: 'white'
    },
    notif: {
      paddingLeft: 5,
      fontFamily: constants.FONT,
      fontSize: 15,
    
    },
    notifContainer: {
      borderColor: constants.IDLE,
      borderWidth: 1,
      width: Dimensions.get('window').width,
      borderTopWidth: 0,
      height: 50,
      flex:1,
      flexDirection:'row',
      paddingLeft: 5,
      alignItems:"center",
      paddingTop: 7
    },
    notif_profpic_container_mini:{
      borderWidth:1,
       borderColor:'#CCCCCC',
       alignItems:'center',
       justifyContent:'center',
       width:60,
       height:60,
       backgroundColor:'#fff',
       overflow:"hidden",
       borderRadius: 100
    },
    notif_profile_img_mini: {
      width:60,
      height:60
      
    },
    notifFollowButton: {
      alignItems: 'center',
      justifyContent: 'center', 
      backgroundColor: constants.ACCENT,
      width: 100,
      height: 35,
      borderRadius: 20,
    },
    notifButtonText: {
      textAlign: 'center',
      fontSize: 15,
      color: 'white',
      fontFamily: constants.FONT,
    },
    notif_pic_container: {
       alignItems:'center',
       flexDirection:"row",
       justifyContent:'center',
       width:30,
       height:30,
      // backgroundColor:'#fff',
       overflow:"hidden",
       paddingBottom:5,
     },
     notif_pic: {
      width:30,
      height:30
     },
     notif_button: {
      backgroundColor: 'transparent'
     },
     searchIcon: {
      paddingRight: 10
     }
  });