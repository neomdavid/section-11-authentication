import { useContext, useState } from 'react'
import AuthContent from '../components/Auth/AuthContent'
import { createUser } from '../util/auth'
import LoadingOverlay from '../components/ui/LoadingOverlay'
import { AuthContext } from '../store/auth-context'
function SignupScreen() {
  const [isAuthenticating, setIsAuthentication] = useState(false)
  const authCtx = useContext(AuthContext)

  async function signUpHandler({ email, password }) {
    setIsAuthentication(true)
    try {
      const token = await createUser(email, password)
      authCtx.authenticate(token)
    } catch (error) {
      Alert.alert(
        'Authentication failed!',
        'Could not create account. Please check your credentials or try again later!'
      )
    }
    setIsAuthentication(false)
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="creating account..." />
  }

  return <AuthContent onAuthenticate={signUpHandler} />
}

export default SignupScreen
