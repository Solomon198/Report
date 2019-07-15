
import React,{ Component } from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,TextInput,
  Image,Modal,TouchableNativeFeedback,ToastAndroid
} from 'react-native';
import {Button,Text, Container,Textarea,Form,Icon,Right,Left,ListItem,Content,Radio,Root,Toast,Body} from 'native-base'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DeviceInfo from 'react-native-device-info';
import Geolocation from 'react-native-geolocation-service';
import firebase from 'react-native-firebase'

const DB = firebase.database()
const policeStations = [
  {station:'Mando Police Station',password:'mando',id:1},
  {station:'Gabasawa Police Station',password:'Gabasawa',id:2},
  {station:'Tudun Wada Police Station',password:'TudunWada',id:3}
]

const headingText = ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias temporibus ea ex aliquam iste, similique labore laboriosam commodi necessitatibus, fuga maxime ut quam dolorem itaque numquam asperiores'

const imgUrl = '../../assets/appBg.png'
const imgUrl2 = '../../assets/police-1.png'
const btnText = 'Report'

export default class ReportPage extends React.Component{
  componentDidMount(){
  }
  deviceInfo = {
    phoneManufacturer:DeviceInfo.getManufacturer(),
    getCarrier:DeviceInfo.getCarrier(),
    getDeviceId:DeviceInfo.getDeviceId(),
    phoneName:DeviceInfo.getDeviceName(),
    country:DeviceInfo.getDeviceCountry(),
    deviceLocale:DeviceInfo.getDeviceLocale(),
    phoneNumber:DeviceInfo.getPhoneNumber(),
    ipAdress:DeviceInfo.getIPAddress(),
    serialNumber:DeviceInfo.getSerialNumber(),
  }

  state = {
      radio:{
          gender:'',
          male:false,
      female:false
      },
      firstName:'',
      lastName:'',
      statement:'',
      location:'',
      deviceInfo:'',
      simCardInfo:'',
        latitude: null,
        longitude: null,
        error: null,
      showStations:false
  }

  setMale(){
    this.setState({radio:{
        male:true,
        female:false,
        gender:'male'
    }})
  }

  setFemale(){
    this.setState({radio:{
        male:false,
        female:true,
        gender:'female'
    }})
  }


  showErrorMessage(message){
    ToastAndroid.showWithGravityAndOffset(message, ToastAndroid.LONG, ToastAndroid.TOP, 25, 50);
  }

  getUserCurrentPostion(){
    Geolocation.getCurrentPosition(
      (position) => {
       this.validateInput(position)
      },
      (error) => {
        if(error.code == 1){
         this.showErrorMessage(error.message)
        }else if(error.code == 2){
          this.showErrorMessage(error.message)
        }else if(error.code == 3){
          this.showErrorMessage(error.message)
        }else if(error.code == 4){
          this.showErrorMessage(error.message)
        }else if(error.code == 5){
          this.showErrorMessage(error.message)
        }else if(error.code == -1){
          this.showErrorMessage(error.message)
        }         
      },
      { enableHighAccuracy:false, timeout: 5000, maximumAge: 10000 }
  );
  }

  validateInput(location){
    let firstName = this.state.firstName.split(' ').join('');
    let lastName = this.state.lastName.split(' ').join('');
    let gender = this.state.radio.gender.split(' ').join('');
    let statement = this.state.statement.split(' ').join('');
    
    if(!firstName || !lastName || !gender || !statement){
      let errMessage = 'Please make sure you fill all the information required in all input fields'
      this.showErrorMessage(errMessage)
    }else{
         this.setState({location:location,showStations:true});
    }
    

  }


  sendNotification(payLoad,station){
    fetch('https://us-central1-report-8599e.cloudfunctions.net/sendPushNotification',
    {
     method: 'POST',
     headers: {
       Accept: 'application/json',
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
        station:station,
        payLoad:payLoad
     })
    }).then((response)=>{
     console.log(response)
    }).catch(err=>{
      console.log(err)
      //dont show anything
    })
  }


  locationRenderer(){
    const renderStations = policeStations.map((val,index)=>
    <ListItem onPress={()=> this.setState({showStations:false},()=>this.reportCrime(this.state.location,val))}>
         <Icon name='flag'/>
      <Body>
        <Text >{val.station}</Text>
      </Body>
      <Right></Right>
</ListItem>
    )
     return(
       <Modal 
         visible={this.state.showStations}
         animationType='slide'
         transparent 
         onRequestClose={()=> this.setState({showStations:false})}>
           <View style={{flex:1}}>
           <TouchableNativeFeedback onPress={()=>this.setState({showStations:false})}>
             <View style={{flex:1,backgroundColor:'transparent'}}>

             </View>
           </TouchableNativeFeedback>
             <View style={{flex:3,backgroundColor:'#ffffff'}}>
             <Text style={{fontWeight:'bold',fontSize:20,color:'#000000',margin:10}} note>Please select the nearest police station</Text>
                 {renderStations}
              </View>

           </View>
       </Modal>
     )
  }

  reportCrime(location,policeStation){
     this.showErrorMessage('Report sent Thank you for your co-operation we will attend to the situation with immediate effect');
      let parameters = {
        deviceInformation:this.deviceInfo,
        location:location,
        userFirstName:this.state.firstName,
        userSecondName:this.state.lastName,
        userGender:this.state.radio.gender,
        crimeReported:this.state.statement
      }
      
      const {getDeviceId,deviceLocale,country,ipAdress,getCarrier,serialNumber,phoneManufacturer,phoneName,
      phoneNumber} = this.deviceInfo
      const {latitude,longitude,altitude,accuracy,speed,heading} = location.coords;
      const timestamp = location.timestamp

      let notificationPayload = {
        userFirstName:this.state.firstName,
        userSecondName:this.state.lastName,
        userGender:this.state.radio.gender,
        crimeReported:this.state.statement,
        getDeviceId:getDeviceId,
        deviceLocale:deviceLocale,
        country:country,
        ipAdress:String(ipAdress),
        getCarrier:getCarrier,
        serialNumber:String(serialNumber),
        phoneManufacturer:phoneManufacturer,
        phoneName:phoneName,
        phoneNumber:String(phoneNumber),
        latitude:String(latitude),
        longitude:String(longitude),
        altitude:String(altitude),
        accuracy:String(accuracy),
        speed:String(speed),
        heading:String(heading),
        timestamp:String(timestamp)
        
      }
      const ref = DB.ref(`policeStations/${policeStation.id}/reports`)
      let trim = policeStation.station;
      let createTopic = trim.split(' ').join('_');
      ref.push(parameters).then((val)=>{
        this.sendNotification(notificationPayload,createTopic)
      })
      this.setState({firstName:'',lastName:'',statement:'',radio:{
        female:false,
        male:false,
        gender:''
      }})
      // //ready to send information to firebase for saving and to cloud function for device notification.
  }


 

  render() {
    return (
      <Root>
      <KeyboardAwareScrollView>
      <Container style ={styles.container}>
         {this.locationRenderer()}
        <ImageBackground
         style={styles.img}
         resizeMethod='resize'
         resizeMode={'contain'}
         source={require(imgUrl)}>
         
         
          <View style={styles.subContainer}>
             
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
                        value={this.state.firstName}
                        style={styles.input}
                        placeholder="First Name"
                        onChangeText={(text) => this.setState({firstName:text})}
                        underlineColorAndroid='transparent'
                        placeholderTextColor='#dddddd'
                        autoFocus
                        
                    />
                   
                    <TextInput
                        value={this.state.lastName}
                        style={styles.input}
                        placeholder="Last name"
                        onChangeText={(text) => this.setState({lastName:text})}
                        placeholderTextColor='#dddddd'
                        underlineColorAndroid='transparent'
                        autoCapitalize='none'
                    />

                    <Form>
                        <Textarea 
                            value={this.state.statement}
                            placeholder="Write a statement about the crime..."
                            onChangeText={(text) => this.setState({statement:text})}
                            placeholderTextColor='#dddddd'
                            multiline={true}
                            autoGrow = {true}
                            rowSpan={5} 
                            style={styles.inputTextArea} 
                            />
                   </Form>
                    <Content>
                        <ListItem onPress={()=> this.setMale()}>
                            <Left>
                            <Text>Male</Text>
                            </Left>
                            <Right>
                                <Radio onPress={()=> this.setMale()} color={'#000000'} selectedColor={'#000000'} selected={this.state.radio.male} />
                            </Right>
                        </ListItem>
                        <ListItem onPress={()=> this.setFemale()}>
                            <Left>
                            <Text>Female</Text>
                            </Left>
                            <Right>
                               <Radio onPress={()=>this.setFemale()} color={'#000000'} selectedColor={'#000000'} selected={this.state.radio.female} />
                            </Right>
                        </ListItem>
                  </Content>
                    
             </View>

                    <Button
                        large 
                        block
                        style={styles.btn}
                        onPress={()=> this.getUserCurrentPostion()}
                        style={styles.btn}>
                            <Text note style={styles.btnText} uppercase={false}>{btnText}</Text>
                        </Button>

          </View>
           

        </ImageBackground>
      </Container>
      </KeyboardAwareScrollView>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1
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
    flex:1,
    alignSelf:'center'
  },
  form:{
    backgroundColor:'transparent',
    flex:2,
    marginLeft:10,marginRight:10
  },
  btn:{
    borderRadius:7,
    marginBottom:10,
    marginTop:5,
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
    flex:1
  },
  logoContainer:{
    padding:10,
    borderRadius:100,
    backgroundColor:'#ffffff',
    width:100,height:100,
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
    color:'#ffffff'
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