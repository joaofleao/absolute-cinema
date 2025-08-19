import { Button, Image, ScrollView, View } from 'react-native'

import useStyle from './styles'
import DottedText from '@components/dotted_text'
import Row from '@components/row'
import Typography from '@components/typography'
import { routes, ScreenType } from '@router'

const Home: ScreenType<'home'> = ({ navigation, route }) => {
  const style = useStyle()

  return (
    <ScrollView style={style.root}>
      <View style={style.header}>
        <Image
          style={style.logo}
          // source={require('../../assets/mascot.png')}
        />

        <View style={style.title}>
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
            title="2025"
            onPress={() => {
              return navigation.navigate(routes.movie)
            }}
          />
          <Button
            title="Watched"
            onPress={() => {
              return navigation.navigate(routes.movie)
            }}
          />
          <Button
            title="By Date"
            onPress={() => {
              return navigation.navigate(routes.movie)
            }}
          />
        </Row>
      </View>

      <View style={style.content}>
        <DottedText>No Movies yet</DottedText>
      </View>
    </ScrollView>
  )
}

export default Home
