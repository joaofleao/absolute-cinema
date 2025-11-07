import { Image, ScrollView, View } from 'react-native'

import useStyles from './styles'
import Typography from '@components/typography'
import { ScreenType } from '@router'

const PasswordRecovery: ScreenType<'password_recovery'> = ({ navigation, route }) => {
  const styles = useStyles()

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
              <Typography title>ABSOLUTE CINEMA</Typography>
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

export default PasswordRecovery
