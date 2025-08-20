import { Dimensions, Image, ScrollView, View } from 'react-native'
import RadialGradient from 'react-native-radial-gradient'

import useStyles from './styles'
import Bar from '@components/bar'
import DottedText from '@components/dotted_text'
import { IconArrow, IconChevron } from '@components/icon'
import Typography from '@components/typography'
import { ScreenType } from '@router'

const Home: ScreenType<'home'> = ({ navigation, route }) => {
  const styles = useStyles()

  const { width } = Dimensions.get('window')

  return (
    <ScrollView style={styles.root}>
      <View style={styles.gradientContainer}>
        <RadialGradient
          style={styles.gradient}
          colors={['#481010', '#000000']}
          radius={300}
          center={[width / 2, width]}
        />
      </View>
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
        </View>

        <View style={styles.content}>
          <Bar.Root>
            <Bar.Item icon={<IconChevron />}>2025</Bar.Item>
            <Bar.Item icon={<IconChevron />}>watched</Bar.Item>
            <Bar.Item icon={<IconArrow />}>by date</Bar.Item>
          </Bar.Root>

          <DottedText>no movies yet</DottedText>
        </View>
      </View>
    </ScrollView>
  )
}

export default Home
