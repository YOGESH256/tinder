import React , {createContext , useContext , useState , useEffect , useMemo} from 'react'
import { View, Text } from 'react-native'
import {GoogleAuthProvider , onAuthStateChanged , signInWithCredential , signOut} from '@firebase/auth'
import * as Google from 'expo-google-app-auth';
import {auth} from '../firebase'

const AuthContext = createContext({})


const config = {
  androidClientId: '688642601723-pit9gsav16eqakiuou2go3b2idijtfr4.apps.googleusercontent.com',
  iosClientId: '688642601723-frb5vn3ivfub3u64gpmh0u56jger1ggi.apps.googleusercontent.com',
  scopes: ["profile" , "email"],
  permissions: ["public_profile" , "email" , "gender" , "location"]
}

export const AuthProvider = ({children}) => {
  const [error , setError] = useState(null)
  const [user , setUser] = useState(null)
  const [loadingIntial , setLoadingIntial] = useState(true)
  const [loading ,setLoading] = useState(true)


  useEffect(() =>
    onAuthStateChanged(auth , (user) => {
      if(user){
        setUser(user)

      }
      else {
        setUser(null)
      }
      setLoadingIntial(false)
    })

  , [])


  const logout = () => {

    setLoading(true)

    signOut(auth).catch(error => setError(error)).finally(() => setLoading(false))


  }

  const  signInWithGoogle = async() => {

    setLoading(true)
    await Google.logInAsync(config).then(async(logInResult) => {
        if(logInResult.type === 'success')
        {
          const {idToken , accessToken} = logInResult
          const credential = GoogleAuthProvider.credential(idToken , accessToken)
          await signInWithCredential(auth ,credential)


        }

        return Promise.reject()


    }).catch(error => setError(error))
    .finally(() => setLoading(false))
  }

  const memoedValue = useMemo(() => ({
    user,
    signInWithGoogle,
    loading,
    error,
    logout
  }), [user , loading ,error])

    return (
        <AuthContext.Provider value= {memoedValue}>
          {!loadingIntial && children}
        </AuthContext.Provider>
    )
}

export default  function useAuth()
{
  return useContext(AuthContext)

}
