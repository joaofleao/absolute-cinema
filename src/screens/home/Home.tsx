import { Button, Image, ScrollView, View } from 'react-native'

import useStyles from './styles'
import DottedText from '@components/dotted_text'
import Row from '@components/row'
import Typography from '@components/typography'
import { useTheme } from '@providers/theme'
import { routes, ScreenType } from '@router'

const Home: ScreenType<'home'> = ({ navigation, route }) => {
  const styles = useStyles()
  const theme = useTheme()

  return (
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
              absolute
            </Typography>
            <Typography display>CINEMA</Typography>
          </View>

          <Row>
            <Button
              color={theme.colors.foreground.light}
              title="2025"
              onPress={() => {
                return navigation.navigate(routes.movie)
              }}
            />
            <Button
              color={theme.colors.foreground.light}
              title="Watched"
              onPress={() => {
                return navigation.navigate(routes.movie)
              }}
            />
            <Button
              color={theme.colors.foreground.light}
              title="By Date"
              onPress={() => {
                return navigation.navigate(routes.movie)
              }}
            />
          </Row>
        </View>

        <View style={styles.content}>
          <DottedText>no movies yet</DottedText>
        </View>
      </View>
    </ScrollView>
  )
}

export default Home
