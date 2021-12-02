import React , {useState} from 'react'
import {doc , setDoc , serverTimestamp} from '@firebase/firestore'
import { View, Text , Image , TextInput , TouchableOpacity } from 'react-native'
import tw from 'tailwind-rn';
import {db} from "../firebase"
import useAuth from '../hooks/useAuth'
import {useNavigation} from '@react-navigation/core'



const ModalScreen = () => {
    const {user} = useAuth()

    const [image , setImage] = useState(null)
    const [job , setJob] = useState(null)
    const [age , setAge] = useState(null)

    const incompleteform = !image || !job || !age
    const navigation = useNavigation();

    const updateUserProfile = () =>  {
      setDoc(doc(db , "users" , user.uid) , {
          id: user.uid,
          displayName: user.displayName,
          photoURL:image,
          job: job,
          age:age,
          timestamp:serverTimestamp()
        }).then(() => {
          navigation.navigate("Home")
        }).catch((e) => {
          alert(e.message);
        })



    }

    return (
        <View style = {tw("flex-1 items-center pt-4")}>
            <Image
            style = {tw("h-20 w-full")}
            resizeMode = "contain"
            source = {{uri : "https://links.papareact.com/2pf"}}
            />
            <Text style = {tw("text-xl text-gray-500 p-2 font-bold")}> Welcome {user.displayName}  </Text>

            <Text style = {tw("text-center p-4 font-bold text-red-500 ")}> Step 1 : The Profile Pic  </Text>
            <TextInput
            value = {image}
            onChangeText = {setImage}
             style = {tw("text-center pb-2 text-xl  ")} placeholder = "Enter a Profile Pic"/>

            <Text style = {tw("text-center p-4 font-bold text-red-500 ")}> Step 1 : The Job  </Text>
            <TextInput
            value = {job}
            onChangeText = {setJob}
            style = {tw("text-center pb-2 text-xl  ")} placeholder = "Enter the job"/>

            <Text style = {tw("text-center p-4 font-bold text-red-500 ")}> Step 1 : The Age  </Text>
            <TextInput
            value = {age}
            onChangeText = {setAge}
              style = {tw("text-center pb-2 text-xl  ")}
              maxLength = {2}
              keyboardType = "numeric"
              placeholder = "Enter the age"/>


            <TouchableOpacity
            disabled = {incompleteform}
            onPress = {updateUserProfile}
            style = {[tw("w-64  p-3 rounded-xl   absolute bottom-4 ") , incompleteform ? tw("bg-gray-400"): tw("bg-red-400 ")]} >
            <Text style = {tw("text-center text-white text-xl")} >Update Profile</Text>
            </TouchableOpacity>



        </View>

    )
}

export default ModalScreen
