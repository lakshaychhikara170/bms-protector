import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { TouchableOpacity, Text, View, Platform, Linking } from 'react-native';

export default function TabLayout() {
  const { t, lang, setLang } = useLanguage();
  const { theme, isDarkMode, toggleTheme } = useTheme();

  const handleDownloadAPK = () => {
    // This links directly to the GitHub repository where the APK will be hosted
    Linking.openURL('https://github.com/lakshaychhikara170/bms-protector/releases');
  };

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'hi' : 'en');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Global Header Toggles */}
      <View style={{ 
        position: 'absolute', top: 40, right: 20, zIndex: 100, 
        flexDirection: 'row', alignItems: 'center'
      }}>
        {/* Permanent APK Download Button */}
        <TouchableOpacity 
          onPress={handleDownloadAPK} 
          style={{ 
            backgroundColor: theme.success, borderRadius: 20, elevation: 5, paddingHorizontal: 12, paddingVertical: 6,
            marginRight: 10, flexDirection: 'row', alignItems: 'center'
          }}
        >
          <MaterialCommunityIcons name="android" size={18} color="#FFF" />
          <Text style={{ marginLeft: 6, fontWeight: 'bold', color: '#FFF', fontSize: 13 }}>
            Download APK
          </Text>
        </TouchableOpacity>

        {/* Theme Toggle */}
        <TouchableOpacity 
          onPress={toggleTheme} 
          style={{ 
            backgroundColor: theme.card, borderRadius: 20, elevation: 5, padding: 8,
            borderWidth: 1, borderColor: theme.border, marginRight: 10
          }}
        >
          <MaterialCommunityIcons name={isDarkMode ? "weather-night" : "weather-sunny"} size={20} color={theme.primary} />
        </TouchableOpacity>

        {/* Language Toggle */}
        <TouchableOpacity 
          onPress={toggleLanguage} 
          style={{ 
            flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6,
            backgroundColor: theme.card, borderRadius: 20, elevation: 5, padding: 4,
            borderWidth: 1, borderColor: theme.primary
          }}
        >
          <MaterialCommunityIcons name="translate" size={18} color={theme.primary} />
          <Text style={{ marginLeft: 8, fontWeight: 'bold', color: theme.primary, fontSize: 14 }}>
            {lang === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
          </Text>
        </TouchableOpacity>
      </View>

      <Tabs screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.tabBarInactive,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDarkMode ? 0.3 : 0.1,
          shadowRadius: 4,
          borderTopWidth: 1,
          borderTopColor: theme.border,
        }
      }}>
        <Tabs.Screen
          name="index"
          options={{
            title: t('tabShield'),
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="shield-check" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="scanner"
          options={{
            title: t('tabAudit'),
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="radar" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="control"
          options={{
            title: t('tabControl'),
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="car-battery" size={28} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}
