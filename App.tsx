import { ConvexProvider, ConvexReactClient } from 'convex/react';
import Router from '@routes/Router';
import { ThemeProvider } from '@providers/theme';

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function App() {
  return (
    <ConvexProvider client={convex}>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </ConvexProvider>
  );
}
