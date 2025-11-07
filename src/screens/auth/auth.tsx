import { useState } from 'react'
import { Alert, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import useStyles from './styles'
import Button from '@components/button'
import EmailInput from '@components/email_input'
import { IconApple, IconGoogle } from '@components/icon'
import OTPInput from '@components/otp_input'
import PasswordInput from '@components/password_input'
import Row from '@components/row'
import SegmentedControl from '@components/segmented_control'
import Typography from '@components/typography'
import { useAuthActions } from '@convex-dev/auth/react'
import { ScreenType } from '@router'

const Auth: ScreenType<'auth'> = ({ navigation, route }) => {
  const styles = useStyles()
  const { t } = useTranslation()

  const { signIn } = useAuthActions()

  const [loading, setLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [code, setCode] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')

  const flows = {
    signIn: t('auth:sign_in'),
    signUp: t('auth:sign_up'),
  } as const

  const [flow, setFlow] = useState('signIn')

  const handleSignUp = async (): Promise<void> => {
    setLoading(true)
    void signIn('password', {
      flow,
      email,
      password,
    })
      .then(() => {
        setFlow('email-verification')
      })
      .catch((error) => Alert.alert(error.message))
      .finally(() => setLoading(false))
  }

  const handleSignIn = async (): Promise<void> => {
    setLoading(true)
    void signIn('password', {
      flow,
      email,
      password,
    })
      .then(() => {
        navigation.pop()
      })
      .catch((error) => Alert.alert(error.message))
      .finally(() => setLoading(false))
  }

  const handleVerify = async (): Promise<void> => {
    setLoading(true)
    void signIn('password', {
      flow,
      email,
      code,
    })
      .catch((error) => Alert.alert(error.message))
      .then(() => {
        navigation.pop()
      })
      .finally(() => setLoading(false))
  }

  const signInContent = (
    <>
      <View style={styles.content}>
        <EmailInput
          value={email}
          onChangeText={setEmail}
        />

        <PasswordInput
          value={password}
          onChangeText={setPassword}
        />
        <Row wrap>
          <Button
            title={t('auth:forgot_password')}
            onPress={() => {
              Alert.alert(t('overall:not_implemented'), t('overall:feature_not_implemented'))
            }}
          />
        </Row>

        <Row wrap>
          <Button
            loading={loading}
            title={t('auth:sign_in')}
            variant="accent"
            onPress={handleSignIn}
          />
        </Row>
      </View>
      <View style={styles.footer}>
        <Typography>{t('auth:continue_with')}</Typography>
        <Row wrap>
          <Button
            title="apple"
            icon={<IconApple />}
            onPress={() => {
              Alert.alert(t('overall:not_implemented'), t('overall:feature_not_implemented'))
            }}
          />
          <Button
            title="google"
            icon={<IconGoogle />}
            onPress={() => {
              Alert.alert(t('overall:not_implemented'), t('overall:feature_not_implemented'))
            }}
          />
        </Row>
      </View>
    </>
  )

  const verificationContent = (
    <View style={styles.content}>
      <OTPInput
        value={code}
        onChangeText={setCode}
      />

      <Row wrap>
        <Button
          loading={loading}
          title={t('auth:sign_in')}
          variant="accent"
          onPress={handleVerify}
        />
      </Row>
    </View>
  )

  const signUpContent = (
    <View style={styles.content}>
      <EmailInput
        value={email}
        onChangeText={setEmail}
      />
      <PasswordInput
        type="new_password"
        value={password}
        onChangeText={setPassword}
      />
      <PasswordInput
        type="confirm_password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        passwordConfirmation={password}
      />
      <Row wrap>
        <Button
          title={t('auth:sign_up')}
          variant="accent"
          onPress={handleSignUp}
        />
      </Row>
    </View>
  )

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <SegmentedControl
          selected={flow}
          onChange={setFlow}
          options={flows}
        />
      </View>

      {flow === 'signIn' && signInContent}
      {flow === 'signUp' && signUpContent}
      {flow === 'email-verification' && verificationContent}
    </View>
  )
}

export default Auth
