import { KeyboardProvider } from 'react-native-keyboard-controller'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import * as SecureStore from 'expo-secure-store'

import { ConvexAuthProvider } from '@convex-dev/auth/react'
import { StringsProvider } from '@providers/strings'
import { ThemeProvider } from '@providers/theme'
import Router from '@router/router'

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
})

const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
}

export default function App(): React.ReactElement {
  return (
    <StringsProvider>
      <KeyboardProvider>
        <ThemeProvider>
          <SafeAreaProvider>
            <ConvexAuthProvider
              client={convex}
              storage={secureStorage}
            >
              <ConvexProvider client={convex}>
                <Router />
              </ConvexProvider>
            </ConvexAuthProvider>
          </SafeAreaProvider>
        </ThemeProvider>
      </KeyboardProvider>
    </StringsProvider>
  )
}
