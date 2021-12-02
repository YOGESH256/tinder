import React  , {useRef , useState , useLayoutEffect , useEffect}from 'react'
import {StyleSheet, View, Text ,Button,SafeAreaView, TouchableOpacity , Image} from 'react-native'
import {useNavigation} from '@react-navigation/core'
import useAuth from '../hooks/useAuth'
import tw from 'tailwind-rn';
import {db} from "../firebase"
import {doc , setDoc , collection, onSnapshot , getDocs , query , where , serverTimestamp, getDoc} from 'firebase/firestore'
import { AntDesign , Entypo , Ionicons } from '@expo/vector-icons';
import Swiper from "react-native-deck-swiper"
import generateId from '../lib/generateId.js'


const DUMMY_DATA = [
  {
    firstName: "Yogesh",
    lastName: "Khatri",
    occupation: "Software Developer",
    photoURL: "https://avatars.githubusercontent.com/u/1139226?v=4",
    age: "20",
    id: 123
  },
  {
    firstName: "Yogesh",
    lastName: "Khatri",
    occupation: "Software Developer",
    photoURL: "https://avatars.githubusercontent.com/u/24712956?v=4",
    age: "20",
    id: 124
  },
  {
    firstName: "Yogesh",
    lastName: "Khatri",
    occupation: "Software Developer",
    photoURL: "https://avatars.githubusercontent.com/u/1139226?v=4",
    age: "20",
    id: 125
  },

]

const HomeScreen = () => {

const navigation = useNavigation();
const {user ,logout} = useAuth()
const [profiles , setProfiles] =  useState([])
const swipeRef = useRef(null)

useLayoutEffect(() =>
  onSnapshot(doc(db , "users" , user.uid)  , snapshot => {
    if(!snapshot.exists())
    {
      navigation.navigate("Modal")
    }
  })

 , [])

 useEffect(() => {

   let unsub;





   const fetchCards = async() => {
     const passes = await getDocs(collection(db , "users" , user.uid , "passes")).then(
       (snapshot) => snapshot.docs.map((doc) => doc.id)
     )
     const swipes = await getDocs(collection(db , "users" , user.uid , "swipes")).then(
       (snapshot) => snapshot.docs.map((doc) => doc.id)
     )


     const passedUserIds = passes.length > 0 ? passes : ['test']
      const swipedUserIds = swipes.length > 0 ? swipes : ['test']

     console.log(passedUserIds);

     unsub = onSnapshot(query(collection(db , "users"), where('id' , 'not-in' , [...passedUserIds  , ...swipedUserIds]) ), snapshot => {
       setProfiles(
         snapshot.docs.filter(doc => doc.id !== user.uid).map( doc => ({
           id:doc.id,
           ...doc.data()
         }))
       )
     })

   }

   fetchCards()
 return unsub




 } , [])


const  swipeLeft = async(cardIndex) => {

  if(!profiles[cardIndex]) return;

  const userSwiped = profiles[cardIndex];

  setDoc(doc(db , "users" , user.uid ,"passes" , userSwiped.id) , userSwiped)



}

const  swipeRight = async(cardIndex) => {


console.log(cardIndex);
  if(!profiles[cardIndex]) return;

  const userSwiped = profiles[cardIndex];

  console.log("JI");

  const loggedInProfile = await (
     await getDoc(doc(db , "users" , user.uid))
  ).data()

  console.log(loggedInProfile + "profile" );

  console.log("KO");

  getDoc(doc(db , "users" , userSwiped.id , "swipes" ,  user.uid)).then((documentSnapshot) => {
    if(documentSnapshot.exists())
    {

      console.log("You matched");

      setDoc(doc(db , "users" , user.uid ,"swipes" , userSwiped.id) , userSwiped)

      setDoc(doc(db , "matches" , generateId(user.uid , userSwiped.id)) , {
        users : {
          [user.uid] :loggedInProfile,
          [userSwiped.id]:userSwiped,

        },
        usersMatched: [user.uid , userSwiped.id],
        timestamp: serverTimestamp()
      })


navigation.navigate('Match' , {
  loggedInProfile,
  userSwiped
})


       console.log("You matched");
    }
    else {
      console.log("You swiped");
      setDoc(doc(db , "users" , user.uid ,"swipes" , userSwiped.id) , userSwiped)

    }
  }).catch(e => console.log(e.message))




}




    return (
        <View style={styles.container} >
        <View style = {tw("items-center flex-row justify-between px-5 py-1 mt-2 ")}>
        <TouchableOpacity style = {tw("")} onPress = {logout}>
        <Image   style = {tw("h-10 w-10 rounded-full")} source = {{uri:user.photoURL}} />
        </TouchableOpacity>
        <TouchableOpacity onPress = {() => navigation.navigate("Modal")}>
        <Image  style = {tw("h-14 w-14 rounded-full")} source = {require("../tinder.png")} />
        </TouchableOpacity>
        <TouchableOpacity onPress = {() => navigation.navigate("Chat")} >
        <Ionicons name = "chatbubbles-sharp" size = {30}  color = "#FF5864"/>
        </TouchableOpacity>
        </View>


     <View style = {tw("flex-1 -mt-4")}>
        <Swiper
          ref  = {swipeRef}
           containerStyle = {{backgroundColor:"transparent"}}
           cards = {profiles}
           stackSize = {5}
           cardIndex = {0}
           animateCardOpacity
           verticalSwipe = {false}
           onSwipedLeft = {(cardIndex) => {
             swipeLeft(cardIndex)
             console.log("Swipe PASS");
           }}
           onSwipedRight = {(cardIndex) => {
             swipeRight(cardIndex)
             console.log("Swipe MATCH");
           }}
           overlayLabels = {{
             left: {
               title: "NOPE",
               style: {
                 label:{
                   textAlign: "right",
                   color: "red",

               }
             }
           },
           right: {
             title: "MATCH",
             style: {
               label:{

                 color: "#4DED30",

             }
           }
           }
           }}
           renderCard = {(card) => card ? (
             <View  key = {card.id} style = {tw("relative bg-white h-3/4 rounded-xl")}>

             <Image   style = {tw(" absolute top-0 h-full  w-full rounded-xl ")} source = {{uri: card.photoURL}}/>
             <View style ={[tw(" absolute bg-white w-full h-20 bottom-0 justify-between  items-center flex-row px-6 py-2 rounded-b-xl") , styles.cardShadow]}>
             <View>
             <Text style = {tw("text-xl font-bold")}>{card.displayName} </Text>
             <Text> {card.job}  </Text>

             </View>
             <Text style = {tw("text-2xl font-bold")}> {card.age}  </Text>
             </View>

             </View>
           ):(
             <View style = {[tw("relative bg-white h-3/4 rounded-xl justify-center items-center") , styles.cardShadow ]}>
              <Text style = {tw("pb-5 font-bold")}> No more Profiles  </Text>
              <Image
              style = {tw("h-20 w-20")}
              source = {{uri: "https://links.papareact.com/6gb"}}
              width = {100}
              height = {100}
               />

             </View>
           )}
        />
    </View>



<View style = {tw("flex flex-row justify-evenly py-5")}>
<TouchableOpacity
 onPress = {() => swipeRef.current.swipeLeft()}
 style = {tw("items-center justify-center rounded-full h-16 w-16 bg-red-200")}>
<Entypo name = "cross" size = {24} color = "red" />
</TouchableOpacity>

<TouchableOpacity
 onPress = {() => swipeRef.current.swipeRight()}
 style = {tw("items-center justify-center rounded-full h-16 w-16 bg-green-200")}>
<AntDesign name = "heart" size = {24} color = "green" />
</TouchableOpacity>

</View>

        </View >
    )
}

export default HomeScreen

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
