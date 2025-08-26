import React, { useRef, useState } from 'react'
import { Pressable, TextInput, View } from 'react-native'

import useStyles from './styles'
import { PasswordInputProps } from './types'
import { IconAlert, IconCheckCircle, IconEyeClosed, IconEyeOpen, IconLock } from '@components/icon'
import Typography from '@components/typography'
import { useStrings } from '@providers/strings'
import { useTheme } from '@providers/theme'

const passwordValidation = (
  password: string,
  confirmPassowrd: string,
): {
  oneUpperCase: boolean
  oneDigit: boolean
  passwordValid: boolean
  match: boolean
} => {
  const match = password === confirmPassowrd && password !== ''
  const oneUpperCase = /(?=.*[A-Z])/.test(password)
  const oneDigit = /(?=.*[0-9])/.test(password)
  const passwordValid = oneUpperCase && oneDigit

  return {
    oneUpperCase,
    oneDigit,
    passwordValid,
    match,
  }
}

const PasswordInput = ({
  debounce = 0,
  value,
  passwordConfirmation,
  type = 'password',
  ...props
}: PasswordInputProps): React.ReactElement => {
  const inputRef = useRef<TextInput>(null)
  const styles = useStyles()
  const { colors } = useTheme()
  const { password } = useStrings()
  const [showPassword, setShowPassword] = useState(false)

  const { match, oneDigit, oneUpperCase, passwordValid } = passwordValidation(
    value ?? '',
    passwordConfirmation ?? '',
  )

  const handleShow = (): void => {
    setShowPassword((prev) => !prev)
  }

  const renderConfirmPassword = type === 'confirm_password' && (
    <View style={styles.container}>
      {match ? (
        <IconCheckCircle
          color={colors.positive.base}
          width={16}
          height={16}
        />
      ) : (
        <IconAlert
          width={16}
          height={16}
        />
      )}

      <Typography
        legend
        light
        positive={match}
      >
        Your passwords must match
      </Typography>
    </View>
  )

  const renderRequirements = type === 'new_password' && (
    <>
      <View style={styles.container}>
        {passwordValid ? (
          <IconCheckCircle
            color={colors.positive.base}
            width={16}
            height={16}
          />
        ) : (
          <IconAlert
            width={16}
            height={16}
          />
        )}
        <Typography
          legend
          light
          positive={oneDigit && oneUpperCase}
        >
          Your passwords must include:
          <Typography
            legend
            light
            positive={oneDigit}
          >
            {' '}
            one digit
          </Typography>
          ,
          <Typography
            legend
            light
            positive={oneUpperCase}
          >
            {' '}
            one uppercase letter
          </Typography>
          .
        </Typography>
      </View>
    </>
  )

  return (
    <>
      <View style={styles.root}>
        <Pressable
          onPress={() => inputRef.current?.focus()}
          style={styles.leading}
        >
          <IconLock
            color={colors.foreground.default}
            size={16}
          />
        </Pressable>
        <TextInput
          passwordRules={'minlength: 6;  required: upper; required: digit;'}
          autoComplete={type === 'password' ? 'current-password' : 'new-password'}
          autoCorrect={false}
          secureTextEntry={!showPassword}
          ref={inputRef}
          placeholder={
            type === 'confirm_password' ? password.confirmationPlaceholder : password.placeholder
          }
          placeholderTextColor={colors.foreground.light}
          selectionColor={colors.foreground.light}
          cursorColor={colors.foreground.default}
          style={styles.input}
          value={value}
          {...props}
        />

        <Pressable
          onPress={handleShow}
          style={styles.trailing}
        >
          {showPassword ? (
            <IconEyeClosed
              color={colors.foreground.default}
              size={16}
            />
          ) : (
            <IconEyeOpen
              color={colors.foreground.default}
              size={16}
            />
          )}
        </Pressable>
      </View>
      {renderConfirmPassword}
      {renderRequirements}
    </>
  )
}

export default PasswordInput
