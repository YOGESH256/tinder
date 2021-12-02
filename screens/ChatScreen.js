import React from 'react'
import {StyleSheet, View, Text ,Button,SafeAreaView, TouchableOpacity , Image} from 'react-native'
import Header from "../components/Header.js"
import ChatList from "../components/ChatList.js"



const ChatScreen = () => {
    return (
        <View style={styles.container} >
            <Header title = "Chat"  />
            <ChatList   />
        </View>
    )
}

export default ChatScreen

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
