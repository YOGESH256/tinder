import React , {useState , useEffect} from 'react'

import {StyleSheet, View, Text ,Button,SafeAreaView, TouchableOpacity , Image , FlatList} from 'react-native'
import {useNavigation} from '@react-navigation/core'
import useAuth from '../hooks/useAuth'
import getMatchedUserinfo from '../lib/getMatchedUserinfo.js'
import tw from 'tailwind-rn';
import {db} from "../firebase"
import {doc , setDoc , collection, onSnapshot , getDocs , query , orderBy,where , serverTimestamp, getDoc} from 'firebase/firestore'


const ChatRow = ({matchDetails}) => {


   const navigation = useNavigation();
    const [matchedUserInfo , setMatchedUserInfo] = useState(null)
    const [lastMessage , setLastMessage] = useState("")

    useEffect(() => {

      setMatchedUserInfo(getMatchedUserinfo(matchDetails.users , user.uid))

    } , [matchDetails , user])


    useEffect(() => onSnapshot(
      query(
        collection(db , "matches" , matchDetails.id , "messages")) ,
        orderBy('timestamp' , 'desc') , snapshot => setLastMessage(snapshot.docs[0]?.data()?.message)
      ) , [matchDetails , db])

   const {user} = useAuth()
    return (
        <TouchableOpacity
        onPress = {() => navigation.navigate('Message' ,  {
          matchDetails
        })}
         style = {[tw("flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg") , styles.cardShadow]}>
            <Image
            style = {tw("rounded-full h-16 w-16 mr-4")}
            source = {{uri :matchedUserInfo?.photoURL}}
            />
            <View>
            <Text style = {tw("text-lg font-semibold")}>
            {matchedUserInfo?.displayName}
            </Text>
            <Text>
            {lastMessage || "Say Hi"}
            </Text>
            </View>
        </TouchableOpacity>
    )
}

export default ChatRow


const styles = StyleSheet.create({

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
