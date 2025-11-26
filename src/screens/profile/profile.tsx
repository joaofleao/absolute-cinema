import { useState } from 'react'
import { Alert, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import useStyles from './styles'
import Button from '@components/button'
import { IconDoor, IconLanguages } from '@components/icon'
import { useAuthActions } from '@convex-dev/auth/react'
import { ScreenType } from '@router'

const Profile: ScreenType<'profile'> = ({ navigation, route }) => {
  const styles = useStyles()
  const { t, i18n } = useTranslation()

  const { signOut } = useAuthActions()

  const [loading, setLoading] = useState<boolean>(false)

  const handleSignOut = async (): Promise<void> => {
    setLoading(true)
    void signOut()
      .catch((error) => Alert.alert(error.message))
      .then(() => {
        navigation.pop()
      })
      .finally(() => setLoading(false))
  }
  const handleSwitchLanguage = async (): Promise<void> => {
    i18n.changeLanguage(i18n.language === 'en-US' ? 'pt-BR' : 'en-US')
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Button
          loading={loading}
          onPress={handleSwitchLanguage}
          title={
            i18n.language === 'en-US' ? t('profile:switch_to_ptbr') : t('profile:switch_to_enus')
          }
          icon={<IconLanguages />}
        />
        <Button
          variant="negative"
          loading={loading}
          onPress={handleSignOut}
          title={t('profile:sign_out')}
          icon={<IconDoor />}
        />
      </View>
    </View>
  )
}

export default Profile
