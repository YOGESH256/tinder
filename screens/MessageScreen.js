import React , {useState , useEffect} from 'react'
import {StyleSheet, View, Text ,Button,SafeAreaView, TouchableOpacity ,FlatList,TouchableWithoutFeedback, Keyboard,Image , TextInput ,KeyboardAvoidingView} from 'react-native'
import Header from "../components/Header.js"
import useAuth from '../hooks/useAuth'
import {useNavigation , useRoute} from '@react-navigation/core'
import ReceiverMessage from "../components/ReceiverMessage.js"
import SenderMessage from "../components/SenderMessage.js"
import {doc , setDoc , collection, onSnapshot , getDocs , query , where , serverTimestamp, orderBy, getDoc , addDoc} from 'firebase/firestore'
import {db} from "../firebase"
import tw from 'tailwind-rn';
import getMatchedUserinfo from '../lib/getMatchedUserinfo.js'

const MessageScreen = () => {

  const {user} = useAuth()
  const {params} = useRoute()
const [input , setInput] = useState("")
const [messages , setMessages] = useState([])
  const {matchDetails} = params


  useEffect(() => {
    onSnapshot(query(collection(db , "matches" ,matchDetails.id , "messages"),
    orderBy('timestamp' , 'desc')
  ) ,
  snapshot => setMessages(snapshot.docs.map(doc => ({

    id: doc.id,
    ...doc.data()

  })))
)
} , [matchDetails , user])

  const sendMessage = () => {
   addDoc(collection(db , "matches" , matchDetails.id, 'messages') , {
     timestamp: serverTimestamp(),
     userId : user.uid,
     displayName:user.displayName,
     photoURL: matchDetails.users[user.uid].photoURL,
     message: input
   })

   setInput("")

  }
    return (
        <View style={styles.container}>
        <Header title = {getMatchedUserinfo(matchDetails.users , user).displayName} callEnabled />

        <KeyboardAvoidingView
        behaviour = {Platform.OS === "ios" ? "padding" : "height"}
        style = {tw("flex-1")}
        keyboardVerticalOffset = {10}
        >

        <TouchableWithoutFeedback onPress = {Keyboard.dismiss}>

     <FlatList
     data = {messages}
     style = {tw("pl-4")}
     keyExtractor = {item => item.id}
     renderItem = {({item : message}) =>
     message.userId === user.uid ? (
       <SenderMessage key = {message.id} message = {message} />
     ):(
        <ReceiverMessage key = {message.id} message = {message} />
     )
   }

      />

        </TouchableWithoutFeedback>



        <View style = {tw("flex-row justify-between   items-center border-t border-gray-200 px-5 py-2")}>

            <TextInput
            style = {tw("h-10 text-lg")}
            placeholder = "Send Message..."
            onChangeText = {setInput}
            onSubmitEditing = {sendMessage}
            value = {input}
            />

            <Button onPress = {sendMessage} title = 'Send' color = "#FF5864"/>

            </View>
</KeyboardAvoidingView>

        </View>
    )
}

export default MessageScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 0

},
cardShadow : {
  shadowColor:"#000",
  shadowOffset:{
    height:1,
    width:0
  },
  shadowOpacity:0.2,
  shadowRadius:1.41
}
});
