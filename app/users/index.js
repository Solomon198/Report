
import React,{ Component } from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  Image
} from 'react-native';

import {Button,Text} from 'native-base'



const headingText = ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias temporibus ea ex aliquam iste, similique labore laboriosam commodi necessitatibus, fuga maxime ut quam dolorem itaque numquam asperiores'

const imgUrl = '../../assets/appBg.png'
const imgUrl2 = '../../assets/police-1.png'
const btnText = 'Report a Crime'

export default class IntroPage extends React.Component{
  constructor(props){
    super(props)
  }
  
  render() { 
    return (

      <View style ={styles.container}>

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

             <Text note style={styles.note} uppercase={false}>
                {headingText}
             </Text>

                <Button
                  large 
                  bordered 
                  dark 
                  onPress={()=>this.props.navigation.navigate('ReportPage')}
                  style={styles.btn}>
                      <Text uppercase={false}>{btnText}</Text>
                </Button>

          </View>


        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  logo:{
    width:100,
    height:100,
    backgroundColor:'transparent'
  },
  btn:{
    borderRadius:7,
    alignSelf:'center'
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
    flex:1,justifyContent:'center',
    alignContent:'center',
    alignItems:'center'
  },
  logoContainer:{
    padding:10,
    borderRadius:100,
    backgroundColor:'#ffffff'
  }
});