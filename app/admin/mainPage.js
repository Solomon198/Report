
import React,{ Component } from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,TextInput,AsyncStorage,ListView,NetInfo,
  Image,Modal,TouchableNativeFeedback,BackHandler,ToastAndroid
} from 'react-native';
import {Button,Text, Container,Title,Header,Icon,Right,Left,ListItem,Card,CardItem,H1,Root,Toast,Body} from 'native-base'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DeviceInfo from 'react-native-device-info';
import MapView,{Marker} from 'react-native-maps';
import firebase from 'react-native-firebase'
import moment from 'moment'
const storage = AsyncStorage
const DB = firebase.database()
const FCM = firebase.messaging()

storage.setItem('appDead','true');


const headingText = ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias temporibus ea ex aliquam iste, similique labore laboriosam commodi necessitatibus, fuga maxime ut quam dolorem itaque numquam asperiores'

const imgUrl = '../../assets/appBg.png'
const imgUrl2 = '../../assets/police-1.png'
const btnText = 'Report' 

export default class MainPage extends React.Component{
  data = []
  componentDidMount(){
     this.monitorOfflineStatus();
     BackHandler.addEventListener('hardwareBackPress',this.handleBackPress)
     const {id,stationName} = this.props.navigation.state.params.loginDetailes
     storage.setItem('userData',JSON.stringify(this.props.navigation.state.params.loginDetailes))
    this.setState({isFetching:true,stationName:stationName},()=>{
      const $ref = firebase.database().ref(`policeStations/${id}/reports`);
      $ref.limitToLast(200)
      .on('value',response=>{
        if(response.val()){
          let postData = []
            let collectValue = response.val()
            const keys =  response._childKeys;
            Object.keys(collectValue).forEach((val,index)=>{
              postData.unshift(collectValue[keys[index]])
              this.lastIndex = keys[0]
            })
            this.setState({data:postData,isFetching:false})
        }else{
        }
      },err=>{
   
     })
    })

    NetInfo.isConnected.fetch().then(val=>{
      if(val){  
        this.setState({NetworkFailure:false})
      }else{
        this.setState({NetworkFailure:true})
        this.showErrorMessage('offline')

      }
    })


   

    storage.getItem('appDead').then(val=>{
      if(val == 'true'){
        storage.setItem('appDead','false').then(()=>{
        //  FCM.onMessage((message)=>{
        //   const {getDeviceId,deviceLocale,country,ipAdress,getCarrier,serialNumber,phoneManufacturer,phoneName,
        //     phoneNumber} = message
        //     const {latitude,longitude,altitude,accuracy,speed,heading} = message;
        //     const timestamp = message.timestamp
        //     var lastData = this.state.data
        //    let recievedReport = {
        //      location:{
        //        timestamp:timestamp,
        //        coords:{
        //          speed:speed,
        //          accuracy:accuracy,
        //          heading:heading,
        //          altitude:altitude,
        //          longitude:longitude,
        //          latitude:latitude
        //        },
        //        deviceInformation:{
        //          getDeviceId:getDeviceId,
        //          deviceLocale:deviceLocale,
        //          country:country,
        //          ipAdress:ipAdress,
        //          getCarrier:getCarrier,
        //          serialNumber:serialNumber,
        //          phoneManufacturer:phoneManufacturer,
        //          phoneName:phoneName,
        //          phoneNumber:phoneNumber
        //        },
        //        ...message
        //      }
        //    }
        //    let NewData = [recievedReport].concat(lastData)
        //    this.setState({data:NewData,solex:'solex'},()=>{
        //      console.log(recievedReport)
        //      console.log('added but not reRenderde')
        //      console.log(this.state.data)
        //    });
        //  })
       }
        )
      }else{
       //victory is jesus  
      }
    })
    }
  
  date = Date.now()
  
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
      showStations:false,
      data:[],
      deviceInfo:false,
      deviceToShow:{ serialNumber: '',
      phoneNumber: '',
      phoneName: '',
      phoneManufacturer: '',
      getDeviceId: '',
      getCarrier: '',
      deviceLocale: '',
      country: '' },
      crimeReported: '',
      mapView:false,
      longitude:0,
      latitude:0,
      isFetching:false,
      stationName:'',
      NetworkFailure:false
  }


  fetchingReport(){
      return(
        <View style={{flex:1,justifyContent:'center',alignContent:'center',alignItems:'center'}}>
          <Text note>Fetching reports...</Text>
        </View>
      )
    
  }

  NetworkFailure(){
    return(
      <View style={{flex:1,justifyContent:'center',alignContent:'center',alignItems:'center'}}>
        <Text>Connection failed</Text>
        <Button onPress={()=>this.reFetchData()} dark transparent style={{alignSelf:'center'}}>
          <Icon name='refresh'/>
        </Button>
      </View>
    )
  
}

reFetchData(){
  this.setState({NetworkFailure:false},()=>{
   NetInfo.isConnected.fetch().then(val=>{
     if(val){  
       this.setState({NetworkFailure:false})
       this.showErrorMessage('online')
     }else{
       this.setState({NetworkFailure:true})
       this.showErrorMessage('offline')
     }
   })
  })
}

  monitorOfflineStatus(){
    NetInfo.isConnected.addEventListener('connectionChange',(val)=>{
      if(val){
        //user is online change status to true
        this.setState({NetworkFailure:false})
        this.showErrorMessage('online')
        return;
      }else{
        this.setState({NetworkFailure:true})
        this.showErrorMessage('offline')
       //offline
        return;
      }
    })
  }

  showErrorMessage(message){

    ToastAndroid.showWithGravityAndOffset(message, ToastAndroid.LONG, ToastAndroid.TOP, 25, 50);

  }

  handleBackPress(){
    BackHandler.exitApp()
  }

componentWillUnmount(){
  BackHandler.removeEventListener('hardwareBackPress',this.handleBackPress)
  NetInfo.removeEventListener('connectionChange',()=>{

  })
}

  locationRenderer(){
     let val = this.state.deviceToShow
     return(
       <Modal 
         visible={this.state.deviceInfo}
         animationType='slide'
         onRequestClose={()=> this.setState({deviceInfo:false})}>
      <View style={{flex:1}}>
            <H1 style={{margin:10}}>Device Informations</H1>
             <ListItem noBorder>
                  <Text style={{fontWeight:'bold'}}>Phone Name :</Text>
                  <Body>
                    <Text >{val.phoneManufacturer}</Text>
                  </Body>
              </ListItem>
              <ListItem noBorder>
                  <Text style={{fontWeight:'bold'}}>Network :</Text>
                  <Body>
                    <Text >{val.getCarrier}</Text>
                  </Body>
              </ListItem>
              <ListItem noBorder>
                  <Text style={{fontWeight:'bold'}}>Serial Number :</Text>
                  <Body>
                    <Text >{val.serialNumber}</Text>
                  </Body>
              </ListItem>
              <ListItem noBorder>
                  <Text style={{fontWeight:'bold'}}>Device id :</Text>
                  <Body>
                    <Text >{val.getDeviceId}</Text>
                  </Body>
              </ListItem>
              <ListItem noBorder>
                  <Text style={{fontWeight:'bold'}}>Device locale :</Text>
                  <Body>
                    <Text >{val.deviceLocale}</Text>
                  </Body>
              </ListItem>
              <ListItem noBorder>
                  <Text style={{fontWeight:'bold'}}>Country :</Text>
                  <Body>
                    <Text >{val.country}</Text>
                  </Body>
              </ListItem>
              <ListItem noBorder>
                  <Text style={{fontWeight:'bold'}}>Phone Number :</Text>
                  <Body>
                    <Text >{val.phoneNumber}</Text>
                  </Body>
              </ListItem>
           </View>
       </Modal>
     )
  }


  
  mapRenderer(){
    let val = this.state.deviceToShow
    return(
      <Modal 
        visible={this.state.mapView}
        animationType='slide'
        onRequestClose={()=> this.setState({mapView:false})}>
          <View style={{flex:1}}>
          <View style ={styles.containerz}>
           <MapView
             style={styles.map}
             region={{
               latitude:this.state.latitude,
               longitude:this.state.longitude,
               latitudeDelta: 0.015,
               longitudeDelta: 0.0121,
             }}
           >
                       <Marker
                          coordinate={{
                            latitude:this.state.latitude,
                            longitude: this.state.longitude,
                            latitudeDelta: 0.015,
                            longitudeDelta: 0.0121,
                          }}
                          title={'heading'}
                          description={'description'}
                        />
           </MapView>
         </View>
          </View>
      </Modal>
    )
 }

 logOut(){
  const {id,stationName} = this.props.navigation.state.params.loginDetailes
  let topic = stationName.split(' ').join('_');
  firebase.messaging().unsubscribeFromTopic(topic);
   storage.removeItem('userData').then(()=>{
     this.props.navigation.navigate('LoginNav')
   })
 }
 

  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const data = ds.cloneWithRows(this.state.data)
  
    return (
      <Container style ={styles.container}>
         {this.locationRenderer()}
         {this.mapRenderer()}
        <ImageBackground
         style={styles.img}
         resizeMethod='resize'
         resizeMode={'contain'}
         source={require(imgUrl)}>
         
         
          <View style={styles.subContainer}>
          <Header style={{backgroundColor:'#ffffff'}}>
                <Left style={{maxWidth:50}}>
                <View style={styles.logoContainer}>
              
                 <Image 
                  resizeMethod='resize'
                  resizeMode='contain'
                  style={styles.logo}
                  source={require(imgUrl2)}
              />
           </View>
                </Left>
                <Body>
                  <Title style={{color:'#000000',marginTop:15,fontSize:17}}>{this.state.stationName}</Title>
                  <Text note>Crimes reported</Text>
                </Body>
                <Right style={{maxWidth:50}}>
                  <Button  onPress={()=> this.logOut()} dark transparent>
                         <Icon name='ios-log-out'/>

                  </Button>
                </Right>
              </Header>
              {
                this.state.isFetching?
                 this.state.NetworkFailure && !this.state.data.length > 0?
                    this.NetworkFailure():
                    this.fetchingReport()
                :
              <ListView 
                 dataSource={data}
                 style={{flex:1}}
                 renderRow={(item)=>
                  <Card>
                  <CardItem header>
                     <Left style={{maxWidth:50}}><Icon name='person'/></Left>
                     <Body >
                        <Text>{item.userSecondName + ' ' + item.userFirstName}</Text>
                         <Text note>{item.userGender}</Text>
                         <Text note>Posted:{moment(item.location.timestamp).fromNow() + ' ' + moment(item.location.timestamp).format('LT')}</Text>
                     </Body>
                    </CardItem>
                    <CardItem>
                      <Body>
                        <Text style={{fontSize:14}}>
                          {item.crimeReported}
                        </Text>
                      </Body>
                    </CardItem>
                    <CardItem footer>
                        <TouchableNativeFeedback onPress={()=> this.setState({mapView:true,longitude:item.location.coords.longitude,latitude:item.location.coords.latitude})}>
                        <Left>
                          <Icon style={{color:'red'}} name='pin'/>
                          <Text note>Location</Text>
                        </Left>
                        </TouchableNativeFeedback>
                        <Left></Left>
                        <TouchableNativeFeedback onPress={()=>this.setState({deviceToShow:item.deviceInformation,deviceInfo:true})}>
                            <Left>
                            <Text note>Device Info</Text>
                            <Icon style={{color:'red',marginLeft:4}} name='phone-portrait'/>
                            </Left>
                        </TouchableNativeFeedback>
                    </CardItem>
                 </Card>
                }
              />
              }
          </View>
           

        </ImageBackground>
      </Container>
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
    width:50,
    height:50,
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
    width:50,height:50,
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
  containerz: {
    ...StyleSheet.absoluteFillObject,
    flex:1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    flex:1
  },
});