
import React,{ Component } from 'react';
import {
  StyleSheet,
  View, 
  ImageBackground,TextInput,
  Image,Modal,TouchableNativeFeedback,ToastAndroid,BackHandler
} from 'react-native';
import {Button,Text, Container,Textarea,Form,Icon,Right,Left,ListItem,Content,Radio,Root,Toast,Body} from 'native-base'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DeviceInfo from 'react-native-device-info';
import Geolocation from 'react-native-geolocation-service';
import firebase from 'react-native-firebase'

const DB = firebase.database()
const authentication = [
  {stationName:'Mando Police Station',password:'mando',id:1},
  {stationName:'Gabasawa Police Station',password:'gabasawa',id:2},
  {stationName:'Tudun Wada Police Station',password:'tudunWada',id:3}
]

const errorMessage = 'Invalide station credential make sure your credentials are correct'
const imgUrl = '../../assets/appBg.png'
const imgUrl2 = '../../assets/police-1.png'
const btnText = 'Login'
const headerText = 'Station Login'
const Toaster = Toast

export default class Login extends React.Component{
  componentDidMount(){
  }
 

      
  state = {
      stationName:"",
      password:"",
  }


  showErrorMessage(message){
     ToastAndroid.showWithGravityAndOffset(message, ToastAndroid.LONG, ToastAndroid.TOP, 25, 50);
  }

  handleBackPress(){
    BackHandler.exitApp()
  }

  componentWillMount(){
    BackHandler.addEventListener('hardwareBackPress',this.handleBackPress)
  }

  
componentWillUnmount(){
  BackHandler.removeEventListener('hardwareBackPress',this.handleBackPress)
}
  
  validateInput(location){
    let stationName = this.state.stationName.split(' ').join('');
    let password = this.state.password.split(' ').join('');
    
    if(!stationName || !password){
      this.showErrorMessage(errorMessage)
    }else{
        this.login()
    }
    

  }

  login(){
    let auth = authentication;
    let isUserLoggedIn = false
    let trimName = this.state.stationName.trim();
    let createTopic = trimName.split(' ').join('_')
    for(var i = 0;i<auth.length;i++){
       if(authentication[i].stationName.toLowerCase() == trimName.toLowerCase() && authentication[i].password == this.state.password){
         firebase.messaging().subscribeToTopic(createTopic)
         this.props.navigation.navigate('MainPage',{loginDetailes:authentication[i]})
         isUserLoggedIn = true
         break;
       }
    }
    if(isUserLoggedIn){
      this.setState({stationName:'',password:''})
      return false
    }else{
      this.showErrorMessage(errorMessage)
    }
  }


  
  

 

  render() {
    return (
      <KeyboardAwareScrollView>
      <Container style ={styles.container}>
        <ImageBackground
         style={styles.img}
         resizeMethod='resize'
         resizeMode={'contain'}
         source={require(imgUrl)}>
         
         
          <View style={styles.subContainer}>
          <Text style={styles.headerText}>{headerText}</Text>

             <View style={styles.logoContainer}>
                <Image 
                    resizeMethod='resize'
                    resizeMode='contain'
                    style={styles.logo}
                    source={require(imgUrl2)}
                />
             </View>
             
             <View style={styles.form}>
             <TextInput
                        value={this.state.stationName}
                        style={styles.input}
                        placeholder="Station ID"
                        onChangeText={(text) => this.setState({stationName:text})}
                        underlineColorAndroid='transparent'
                        placeholderTextColor='#dddddd'
                        autoFocus
                        
                    />
                   
                    <TextInput
                        value={this.state.password}
                        style={styles.input}
                        placeholder="Password"
                        onChangeText={(text) => this.setState({password:text})}
                        placeholderTextColor='#dddddd'
                        underlineColorAndroid='transparent'
                        autoCapitalize='none'
                        secureTextEntry
                    />
                     <Button
                        large 
                        block
                        iconRight
                        style={styles.btn}
                        onPress={()=> this.validateInput()}
                        style={styles.btn}>
                            <Text note style={styles.btnText} uppercase={false}>{btnText}</Text>
                            <Icon name='log-in' style={styles.iconColor}/>

                       </Button>             
             </View>         
          </View>
        </ImageBackground>
      </Container>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  headerText:{
    fontWeight:'bold',fontSize:22
  },
  iconColor:{
    color:'#ffffff'
  },
  btnText:{
    color:'#ffffff',
    fontSize:18,
    letterSpacing:3
  },
  logo:{
    width:100,
    height:100,
    backgroundColor:'transparent',
    alignSelf:'center'
  },
  form:{
    backgroundColor:'transparent',
    marginLeft:10,marginRight:10,
    width:'100%'
  },
  btn:{
    borderRadius:7,
    marginBottom:10,
    marginTop:15,
    marginLeft:10,marginRight:10,
    backgroundColor:'#333333'
  },
  note:{
    textAlign:'center',
    width:'90%',
    marginBottom:10
  },
  img:{
    flex:1,
    justifyContent:'center',
    alignContent:'center'
  },
  subContainer:{
    backgroundColor:'rgba(255,255,255,0.9)',
    flex:1,
    justifyContent:'center',
    alignContent:'center',
    alignItems:'center'
  },
  logoContainer:{
    padding:10,
    borderRadius:100,
    backgroundColor:'#ffffff',
    width:130,height:130,
    alignSelf:'center',
    marginTop:20
  },
  input: {
    height: 60,
    fontSize:18,
    backgroundColor: 'rgba(50,50,50,0.6)', 
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    color:'#ffffff',
    marginLeft:10,
    marginRight:10,
  },
  inputTextArea: {
    fontSize:18,
    backgroundColor: 'rgba(50,50,50,0.6)', 
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    color:'#ffffff'
  },
  
});