import { useState } from 'react'
import { Alert, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import useStyles from './styles'
import Button from '@components/button'
import EmailInput from '@components/email_input'
import { IconApple, IconGoogle } from '@components/icon'
import PasswordInput from '@components/password_input'
import Row from '@components/row'
import SegmentedControl from '@components/segmented_control'
import Typography from '@components/typography'
import { useAuthActions } from '@convex-dev/auth/react'
import { routes, ScreenType } from '@router'

const Auth: ScreenType<'auth'> = ({ navigation, route }) => {
  const styles = useStyles()
  const { t } = useTranslation()

  const { signIn } = useAuthActions()

  const [loading, setLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')

  const flows = {
    signIn: t('auth:sign_in'),
    signUp: t('auth:sign_up'),
  }

  const [flow, setFlow] = useState('signIn')

  const handleSubmit = async (): Promise<void> => {
    setLoading(true)

    void signIn('password', { email, password, flow }).catch((error) => {
      let toastTitle = ''
      if (error.message.includes('Invalid password')) {
        toastTitle = 'Invalid password. Please try again.'
      } else {
        toastTitle =
          flow === 'sign_in'
            ? 'Could not sign in, did you mean to sign up?'
            : 'Could not sign up, did you mean to sign in?'
      }
      Alert.alert(toastTitle)
      setLoading(false)
    })
  }

  const content = (): React.ReactElement => {
    if (flow === 'signIn')
      return (
        <>
          <View style={styles.content}>
            <EmailInput
              value={email}
              onChangeText={setEmail}
            />

            <View style={styles.passwordWithForget}>
              <PasswordInput
                value={password}
                onChangeText={setPassword}
              />
              <Button
                title={'forgot Password?'}
                variant="tertiary"
                onPress={() => {
                  Alert.alert(t('overall:not_implemented'), t('overall:feature_not_implemented'))
                }}
              />
            </View>

            <Row wrap>
              <Button
                title={t('auth:sign_in')}
                variant="primary"
                onPress={() => {
                  // navigation.popTo(routes.home)
                  handleSubmit()
                }}
              />
            </Row>
          </View>
          <View style={styles.footer}>
            <Typography
              custom
              light
            >
              {t('auth:continue_with')}
            </Typography>
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

    return (
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
            title={t('auth:register')}
            variant="primary"
            onPress={() => {
              // navigation.popTo(routes.home)
              handleSubmit()
            }}
          />
        </Row>
      </View>
    )
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <SegmentedControl
          selected={flow}
          onChange={setFlow}
          options={flows}
        />
      </View>
      {content()}
    </View>
  )
}

export default Auth
