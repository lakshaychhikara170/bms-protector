import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView, Platform, StatusBar, Animated } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import BluetoothService from '../services/BluetoothService';
import StorageService from '../services/StorageService';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useRickshaw } from '../context/RickshawContext';
import { getDeviceTypeInfo } from '../utils/DeviceClassifier';

export default function HomeScreen() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { myRickshaw } = useRickshaw();
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const deviceInfo = myRickshaw ? getDeviceTypeInfo(myRickshaw.name) : null;

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Automatically activate the shield if a device is saved
    if (myRickshaw) {
      toggleShield(true);
    }
  }, [myRickshaw]);

  useEffect(() => {
    let animation;
    if (isShieldActive) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          })
        ])
      );
      animation.start();
    } else {
      pulseAnim.setValue(1);
    }

    return () => {
      if (animation) animation.stop();
    };
  }, [isShieldActive]);

  const toggleShield = async (autoConnect = false) => {
    if (isShieldActive && !autoConnect) {
      setIsShieldActive(false);
      return;
    }
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsShieldActive(true);
    }, 2000);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          <MaterialCommunityIcons name="shield-lock" size={32} color={theme.primary} />
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>{t('shieldHeader')}</Text>
        </View>

        {myRickshaw ? (
          <>
            <View style={[styles.profileBadge, { backgroundColor: theme.card, borderColor: theme.primary }]}>
              <MaterialCommunityIcons name={deviceInfo.icon} size={20} color={theme.primary} />
              <Text style={[styles.profileText, { color: theme.textPrimary }]}>
                {deviceInfo.type}: <Text style={{ fontWeight: 'bold', color: theme.primary }}>{myRickshaw.name}</Text>
              </Text>
            </View>

            <View style={styles.statusContainer}>
              <View style={[
                styles.statusCard, 
                { backgroundColor: theme.card, borderColor: isShieldActive ? theme.success : theme.danger }
              ]}>
                
                <View style={styles.statusIconContainer}>
                  <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <FontAwesome5 
                      name="shield-alt" 
                      size={80} 
                      color={isShieldActive ? theme.success : theme.danger} 
                      style={!isShieldActive && { opacity: 0.5 }}
                    />
                  </Animated.View>

                  {!isShieldActive && (
                    <MaterialCommunityIcons 
                      name="close-circle" 
                      size={40} 
                      color={theme.danger} 
                      style={[styles.crossIcon, { backgroundColor: theme.card }]} 
                    />
                  )}
                </View>

                <Text style={[styles.statusLabel, { color: theme.textSecondary }]}>{t('shieldStatus')}</Text>
                <Text style={[styles.statusText, { color: isShieldActive ? theme.success : theme.danger }]}>
                  {isShieldActive ? t('shieldActive') : t('shieldInactive')}
                </Text>
                <Text style={[styles.statusDescription, { color: theme.textSecondary }]}>
                  {isShieldActive 
                    ? t('shieldActiveDesc')
                    : t('shieldInactiveDesc')
                  }
                </Text>
              </View>
            </View>

            <View style={styles.actionContainer}>
              <TouchableOpacity 
                style={[
                  styles.actionButton, 
                  { backgroundColor: isShieldActive ? theme.card : theme.primary, borderColor: isShieldActive ? theme.border : theme.primary, borderWidth: isShieldActive ? 2 : 0 }
                ]}
                onPress={() => toggleShield(false)}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <ActivityIndicator color={theme.textPrimary} size="large" />
                ) : (
                  <Text style={[styles.buttonText, { color: isShieldActive ? theme.textPrimary : '#FFFFFF' }]}>
                    {isShieldActive ? t('shieldBtnDeactivate') : t('shieldBtnActivate')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="bluetooth-off" size={80} color={theme.textSecondary} style={{ marginBottom: 20 }} />
            <Text style={[styles.statusText, { color: theme.textPrimary, textAlign: 'center' }]}>No Device Connected</Text>
            <Text style={[styles.statusDescription, { color: theme.textSecondary, marginBottom: 40 }]}>
              You are not currently connected to any device. Please go to the Audit tab to scan and secure a device first.
            </Text>
          </View>
        )}
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
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 8,
    borderWidth: 1,
  },
  profileText: {
    marginLeft: 10,
    fontSize: 15,
  },
  statusContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  statusCard: {
    width: '100%',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 2,
  },
  statusIconContainer: {
    position: 'relative',
    marginBottom: 20,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossIcon: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    borderRadius: 20,
  },
  statusLabel: {
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statusDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  actionContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    paddingBottom: 40,
  },
  actionButton: {
    width: '100%',
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  }
});
