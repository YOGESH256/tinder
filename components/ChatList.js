import React  , {useState , useEffect} from 'react'
import {StyleSheet, View, Text ,Button,SafeAreaView, TouchableOpacity , Image , FlatList} from 'react-native'
import { Foundation , Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/core'
import tw from 'tailwind-rn';
import {doc , setDoc , collection, onSnapshot , getDocs , query , where , serverTimestamp, getDoc} from 'firebase/firestore'
import {db} from "../firebase"
import useAuth from '../hooks/useAuth'
import ChatRow from '../components/ChatRow'

const ChatList = () => {


 const navigation = useNavigation();
  const [matches , setMatches] = useState([])
  const {user} = useAuth()

  useEffect(() =>

    onSnapshot(
      query(
        collection(db , "matches") ,
        where("usersMatched" , "array-contains" , user.uid)) ,
    (snapshot) =>setMatches(snapshot.docs.map(doc => ({
      id:doc.id,
      ...doc.data()
    })
  )

  )) ,
  [user]

  )


  console.log(matches);


    return matches.length > 0 ?  (
        <FlatList
        style = {tw("h-full")}
        data =  {matches}
        keyExtractor = {item => item.id}
        renderItem = {({item}) => <ChatRow matchDetails = {item} />}
        />
    ):(
      <View style = {tw("p-5")}>
       <Text style = {tw("text-center text-lg")}> No more Profiles  </Text>


      </View>
    )
}

export default ChatList
