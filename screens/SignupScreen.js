import { useContext, useState } from 'react'
import AuthContent from '../components/Auth/AuthContent'
import { createUser } from '../util/auth'
import LoadingOverlay from '../components/ui/LoadingOverlay'
import { AuthContext } from '../store/auth-context'
import { Alert } from 'react-native'

function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const authCtx = useContext(AuthContext)

  async function signUpHandler({ email, password }) {
    setIsAuthenticating(true)
    try {
      const tokens = await createUser(email, password)
      authCtx.authenticate(tokens)
    } catch (error) {
      Alert.alert(
        'Authentication failed!',
        'Could not create account. Please check your credentials or try again later!'
      )
      setIsAuthenticating(false)
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="creating account..." />
  }

  return <AuthContent onAuthenticate={signUpHandler} />
}

export default SignupScreen
