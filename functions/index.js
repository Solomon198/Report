
const functions  = require('firebase-functions');
const firebase = require('firebase-admin')
//initializing app
firebase.initializeApp();


exports.sendPushNotification = functions.https.onRequest((req,resp)=>{
    //extract notification information from http request
    let  notification = {
        notification: {
        title: 'New crime reported',
        body:  `See the crime reported by ......`,
        sound: 'default',
       },
       data:JSON.stringify(req.body.payLoad)
      }
    const topic = req.body.station
        return firebase.messaging().sendToTopic(topic,notification,{
            timeToLive:1209600 //time for the notification to live in seconds two weeks
        }).then((val)=>{
             return  resp.status(200).end()
        })
})

// https://us-central1-report-8599e.cloudfunctions.net/sendPushNotification
//Notification service url processor