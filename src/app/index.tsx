import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function OnboardingScreen() {
  const router = useRouter();
  const { lang, setLang, t, isReady: langReady } = useLanguage();
  const { theme, isThemeReady } = useTheme();

  useEffect(() => {
    // If language is already loaded and exists, skip onboarding
    if (langReady && isThemeReady && lang) {
      router.replace('/(tabs)');
    }
  }, [lang, langReady, isThemeReady, router]);

  const handleSelectLanguage = (selectedLang) => {
    setLang(selectedLang);
    router.replace('/(tabs)');
  };

  if (!langReady || !isThemeReady) {
    return (
      <View style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#091E42' }]}>
        <ActivityIndicator size="large" color="#4C9AFF" />
      </View>
    );
  }

  // Prevent flashing the screen right before navigation if lang is present
  if (lang) {
    return null;
  }

  // Onboarding always uses a dark aesthetic to look premium
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#091E42' }]}>
      <View style={styles.container}>
        <MaterialCommunityIcons name="shield-check" size={80} color="#4C9AFF" style={styles.icon} />
        
        <Text style={styles.title}>{t('onboardWelcome')}</Text>
        <Text style={styles.subtitle}>{t('onboardDesc')}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.langButton}
            onPress={() => handleSelectLanguage('hi')}
          >
            <Text style={styles.langButtonText}>{t('onboardBtnHi')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.langButtonSecondary}
            onPress={() => handleSelectLanguage('en')}
          >
            <Text style={styles.langButtonTextSecondary}>{t('onboardBtnEn')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#B3BAC5',
    textAlign: 'center',
    marginBottom: 60,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  langButton: {
    backgroundColor: '#4C9AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  langButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  langButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4C9AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  langButtonTextSecondary: {
    color: '#4C9AFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
