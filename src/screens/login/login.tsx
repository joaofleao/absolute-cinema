import { Image, ScrollView, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import useStyles from './styles'
import Typography from '@components/typography'
import { routes, ScreenType } from '@router'

const Login: ScreenType<'login'> = ({ navigation, route }) => {
  const styles = useStyles()
  const { t, i18n } = useTranslation()

  return (
    <>
      <ScrollView style={styles.root}>
        <View>
          <View style={styles.header}>
            <Image
              style={styles.logo}
              source={require('@assets/mascot.png')}
            />

            <View style={styles.title}>
              <Typography
                title
                light
              >
                ABSOLUTE CINEMA
              </Typography>
            </View>
          </View>

          <View style={styles.content}></View>
        </View>
      </ScrollView>

      <View style={styles.footer}></View>

      <View style={styles.head}></View>
    </>
  )
}

export default Login
