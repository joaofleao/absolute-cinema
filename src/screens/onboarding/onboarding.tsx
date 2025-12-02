import { useRef, useState } from 'react'
import { Animated, View } from 'react-native'
import { setItem } from 'expo-secure-store'
import { useTranslation } from 'react-i18next'

import useStyles from './styles'
import Button from '@components/button'
import { IconLanguages } from '@components/icon'
import IconButton from '@components/icon_button'
import { TinyCheckmark, TinyChevron } from '@components/tiny_icon'
import { ScreenType } from '@router/types'
import formatString from '@utils/format_string'

const Onboarding: ScreenType<'onboarding'> = ({ navigation, route }) => {
  const styles = useStyles()
  const { t, i18n } = useTranslation()
  const [step, setStep] = useState(0)

  const fadeAnim = useRef(new Animated.Value(1)).current // Animation value for opacity

  const animateStepChange = (nextStep: number): void => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setStep(nextStep)
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    })
  }

  const handleSwitchLanguage = async (): Promise<void> => {
    i18n.changeLanguage(i18n.language === 'en_US' ? 'pt_BR' : 'en_US')
    setItem('language', i18n.language)
  }

  const messages = [
    formatString(t('onboarding:first')),
    formatString(t('onboarding:second')),
    formatString(t('onboarding:third')),
  ]

  const nextStep = (): void => {
    const next = step + 1
    if (next === messages.length) {
      navigation.pop()
      setItem('onboarding', 'done')
      return
    }
    animateStepChange(next)
  }

  const prevStep = (): void => {
    animateStepChange(step - 1)
  }
  return (
    <View style={styles.root}>
      <View style={(styles.header, step !== 0 && styles.hide)}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Button
            onPress={handleSwitchLanguage}
            title={
              i18n.language === 'en_US'
                ? t('onboarding:switch_to_ptbr')
                : t('onboarding:switch_to_enus')
            }
            icon={<IconLanguages />}
          />
        </Animated.View>
      </View>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {messages[step]}
      </Animated.View>
      <View style={styles.footer}>
        <IconButton
          disabled={step === 0}
          onPress={prevStep}
          icon={
            <TinyChevron
              orientation="left"
              size={24}
            />
          }
        />
        <IconButton
          variant="accent"
          onPress={nextStep}
          icon={
            step === messages.length - 1 ? (
              <TinyCheckmark size={20} />
            ) : (
              <TinyChevron
                orientation="right"
                size={24}
              />
            )
          }
        />
      </View>
    </View>
  )
}

export default Onboarding
