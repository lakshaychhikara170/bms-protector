import { Stack } from 'expo-router';
import { LanguageProvider } from '../context/LanguageContext';
import { ThemeProvider } from '../context/ThemeContext';
import { RickshawProvider } from '../context/RickshawContext';

export default function Layout() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <RickshawProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </RickshawProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
