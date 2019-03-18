import React, {Component} from 'react';
import {Alert, Text, TextInput, View, KeyboardAvoidingView, TouchableHighlight, AsyncStorage} from 'react-native';
import {SecureStore} from 'expo';
import constants from './constants'
import t from 'tcomb-form-native';

import styles from './styles'

const Form = t.form.Form;

var User = t.struct({
    email: t.String,
    username: t.String,
    password: t.String,
  });
  
  const formStyles = {
    ...Form.stylesheet,
    textboxView: {
      normal: {
        alignItems: 'center',
        justifyContent: 'center', 
        width:200,
        borderWidth: 0,
        borderRadius:0,
        marginBottom:20,
        borderBottomWidth:1,
       },
      error: {
        alignItems: 'center',
        justifyContent: 'center', 
        width:200,
        borderWidth: 0,
        borderRadius:0,
        marginBottom:20,
        borderBottomWidth:1,
        borderColor: '#ff3333',
      },
    },
    textbox: {
      normal: {
        width:200,
        borderWidth: 0,
        marginBottom: 8,
      },
      // the style applied when a validation error occours
      error: {
        width:200,
        borderWidth: 0,
        marginBottom: 8,
        borderColor: '#ff3333',
      },
    }
  }
  
  const options = {
    auto: 'placeholders',
    // fields: {
    //   email: {
    //     error: 'We need your email to reset your password, forgetful goose!',
    //   },
    //   username: {
    //     error: 'Think of a catchy codename for your followers'
    //   },
    //   password: {
    //     error: 'You need a secret key to unlock your account'
    //   },
    // },
    stylesheet: formStyles,
  }
  
  export default class RegisterScreen extends Component{
  
    state = {
      first_name: '',
      last_name: '',
      username: '',
      password: '',
      email: ''
    };
    
    async handleSubmit() {
  
      const {navigate} = this.props.navigation;
      try{
        let response = await fetch(constants.link + '/api/User/register', {
                                  method: 'POST',
                                  headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                        first_name: this.state.first_name,
                                        last_name: this.state.last_name,
                                        username: this.state.username,
                                        password: this.state.password,
                                        email: this.state.email
                                  })
        });
        console.log(response);
        if (response.status >= 200 && response.status < 300) {
          let res = await response.json();
          let jsonObj = res;
          let accessToken = jsonObj.auth_token;
          console.log("res token: " + accessToken);
          global.auth_token = accessToken;
          global.curr_username = this.state.username;
          SecureStore.setItemAsync('auth_token', auth_token);
          AsyncStorage.setItem('curr_username', this.state.username);
          AsyncStorage.setItem('curr_first_name', this.state.first_name);
          AsyncStorage.setItem('curr_last_name', this.state.last_name);
          global.curr_first_name = this.state.first_name;
          global.curr_last_name = this.state.last_name;
          global.email = this.state.email;
          AsyncStorage.setItem('curr_email', this.state.email);
          Alert.alert('You are now a beanstalker. Congrats!');
          navigate('App');
        } else {
          let message = await response.text();
          let error = Error(message);

          Alert.alert('Credentials', `${message}`);
          throw error;
        }
      } catch(error) {
        console.error(error);
      }
    }
    /*handleSubmit = () => {
      const value = this.refs.form.getValue();
      console.log('value: ', value);
    }*/
    render() {
    const {navigate} = this.props.navigation;
    return (
  
      <KeyboardAvoidingView style={styles.container} behavior="padding">

          <View>
          <Text style={styles.welcome}>beanstalk</Text>
          </View>
          <View style={{paddingBottom:15}}>
          <TextInput
            value={this.state.first_name}
            onChangeText={(first_name) => this.setState({ first_name })}
            placeholder='First Name'
            placeholderTextColor = "#bfbfbf"
            style={styles.input}
            autoCapitalize = 'words'
          />
          <TextInput
            value={this.state.last_name}
            onChangeText={(last_name) => this.setState({ last_name})}
            placeholder='Last Name'
            placeholderTextColor = "#bfbfbf"
            style={styles.input}
            autoCapitalize = 'words'
          />
          <TextInput
            value={this.state.email}
            onChangeText={(email) => this.setState({ email })}
            placeholder={'Email'}
            placeholderTextColor = "#bfbfbf"
            style={styles.input}
            autoCapitalize = 'none'
            keyboardType = "email-address"
          />
          <TextInput
            value={this.state.username}
            onChangeText={(username) => this.setState({ username })}
            placeholder='Username'
            placeholderTextColor = "#bfbfbf"
            style={styles.input}
            autoCapitalize = "none"
          />
          <TextInput
            value={this.state.password}
            onChangeText={(password) => this.setState({ password })}
            placeholder={'Password'}
            secureTextEntry={true}
            placeholderTextColor = "#bfbfbf"
            style={styles.input}
            autoCapitalize = 'none'
          />
          </View>
          <TouchableHighlight style={styles.button} onPress={this.handleSubmit.bind(this)} underlayColor='#40bf80'>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableHighlight>
        </KeyboardAvoidingView>
  
    );
    }
  }