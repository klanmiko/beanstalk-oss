import React, {Component} from 'react';
import {Text, TextInput, View, TouchableHighlight, Image, TouchableOpacity, AsyncStorage,KeyboardAvoidingView} from 'react-native';
import {SecureStore} from 'expo';

import styles from './styles'
import constants from './constants'



export default class HomeScreen extends Component{
    state = {
      username: '',
      password: '',
    };
  
    async onLogin() {
        const {navigate} = this.props.navigation;
      try{
        let response = await fetch(constants.link + '/api/User/login', {
                                  method: 'POST',
                                  headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                  },
                                  body: JSON.stringify({
                                    username: this.state.username,
                                    password: this.state.password,  
                                  })
        });
        let res = await response.json();
        if (response.status >= 200 && response.status < 300) {
          this.setState({error: "success"});
          let accessToken = res.auth_token;
          console.log("res token: " + accessToken);
          SecureStore.setItemAsync('auth_token', accessToken);
          AsyncStorage.setItem('curr_username', this.state.username);
          global.auth_token = accessToken;
          global.curr_username = this.state.username;
          global.curr_first_name = res.data.first_name
          AsyncStorage.setItem('curr_first_name', res.data.first_name);
          AsyncStorage.setItem('curr_last_name', res.data.last_name);
          global.curr_last_name = res.data.last_name;
          global.curr_email = res.data.email;
          AsyncStorage.setItem('curr_email', res.data.email)
          global.events.emit('userDataChanged');
          //Alert.alert('Credentials', `Frist anem ${curr_first_name} + token: ${auth_token}`);
          navigate('App');
        } else {
          let error = res;
          throw error;
        }
      } catch(error) {
        this.setState({error: JSON.stringify(error)});
        console.log("error " + error);
      }
    }
    /*onLogin() {
      const { username, password } = this.state;
  
      Alert.alert('Credentials', `Username: ${username} + password: ${password}`);
    }*/
    render() {
    const {navigate} = this.props.navigation;
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Image source={require ('./bean.png')} style={{width: 100, height: 100}}/>
        <View>
        <Text style={styles.welcome}>beanstalk</Text>
        </View>
        <View style={{paddingBottom:10}}>
        <TextInput
            value={this.state.username}
            onChangeText={(username) => this.setState({ username })}
            placeholder='Username'
            placeholderTextColor = "#bfbfbf"
            style={styles.input}
            autoCapitalize = 'none'
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
          <TouchableHighlight
            style={styles.button} underlayColor='#40bf80'
            onPress={this.onLogin.bind(this)}
         >
           <Text style={styles.buttonText}> Log In </Text>
         </TouchableHighlight>
  
         <Text style={styles.error}> {this.state.error}</Text>
  
        <View style={{marginVertical: 2, flexDirection: 'row'}}>
          <Text style={styles.allText}>No Account? </Text>
          <TouchableOpacity onPress={() => navigate('Register')}>
              <View style = {{alignItems: 'center', justifyContent: 'center'}}>
                  <Text style = {styles.signUp}>Sign Up</Text>
              </View>
          </TouchableOpacity>
          {/* <Button type="clear" onPress={() => navigate('Register')} title="Sign Up" /> */}
        </View>
  
  
      </KeyboardAvoidingView>
  
    );
  }
  }