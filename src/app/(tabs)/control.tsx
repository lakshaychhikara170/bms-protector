import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar, ScrollView, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useRickshaw } from '../../context/RickshawContext';

export default function ControlScreen() {
  const { t } = useLanguage();
  const { theme, isDarkMode } = useTheme();
  const { myRickshaw } = useRickshaw();
  const [isDischarging, setIsDischarging] = useState(true);
  const [isCharging, setIsCharging] = useState(true);
  
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [infoContent, setInfoContent] = useState({ title: '', description: '' });

  const showInfo = (title, description) => {
    setInfoContent({ title, description });
    setInfoModalVisible(true);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          <MaterialCommunityIcons name="car-battery" size={28} color={theme.primary} />
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>{t('ctrlHeader')}</Text>
        </View>

        {myRickshaw ? (
          <>
            <View style={styles.statsContainer}>
              <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{t('ctrlVoltage')}</Text>
                <Text style={[styles.statValue, { color: theme.textPrimary }]}>52.4 V</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{t('ctrlCurrent')}</Text>
                <Text style={[styles.statValue, { color: theme.textPrimary }]}>12.1 A</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{t('ctrlSOC')}</Text>
                <Text style={[styles.statValue, { color: theme.textPrimary }]}>84 %</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{t('ctrlTemp')}</Text>
                <Text style={[styles.statValue, { color: theme.textPrimary }]}>32 °C</Text>
              </View>
            </View>

            <View style={styles.controlsSection}>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{t('ctrlMainControls')}</Text>
              
              <View style={[styles.controlCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.controlInfo}>
                  <MaterialCommunityIcons 
                    name={isDischarging ? "lightning-bolt" : "lightning-bolt-outline"} 
                    size={32} 
                    color={isDischarging ? theme.success : theme.danger} 
                  />
                  <View style={styles.controlText}>
                    <View style={styles.titleRow}>
                      <Text style={[styles.controlTitle, { color: theme.textPrimary }]}>{t('ctrlDischargeTitle')}</Text>
                      <TouchableOpacity onPress={() => showInfo(
                        t('ctrlDischargeTitle'), 
                        "Controls the power going OUT to the rickshaw's motor. Disabling this acts as a secure anti-theft kill switch, completely cutting off the motor's power supply so the rickshaw cannot be driven."
                      )}>
                        <MaterialCommunityIcons name="information" size={20} color={theme.primary} style={styles.infoIcon} />
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.controlDesc, { color: theme.textSecondary }]}>
                      {isDischarging ? t('ctrlDischargeOn') : t('ctrlDischargeOff')}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: isDischarging ? theme.danger : theme.success }]}
                  onPress={() => setIsDischarging(!isDischarging)}
                >
                  <Text style={styles.actionButtonText}>
                    {isDischarging ? t('ctrlBtnCut') : t('ctrlBtnRestore')}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.controlCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.controlInfo}>
                  <MaterialCommunityIcons 
                    name={isCharging ? "power-plug" : "power-plug-off"} 
                    size={32} 
                    color={isCharging ? theme.primary : theme.textSecondary} 
                  />
                  <View style={styles.controlText}>
                    <View style={styles.titleRow}>
                      <Text style={[styles.controlTitle, { color: theme.textPrimary }]}>{t('ctrlChargeTitle')}</Text>
                      <TouchableOpacity onPress={() => showInfo(
                        t('ctrlChargeTitle'), 
                        "Controls the power coming IN from a wall charger. Disable this to stop the battery from accepting electricity. Useful for preventing overcharging, extending battery lifespan, or for safety if a public charger seems faulty."
                      )}>
                        <MaterialCommunityIcons name="information" size={20} color={theme.primary} style={styles.infoIcon} />
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.controlDesc, { color: theme.textSecondary }]}>
                      {isCharging ? t('ctrlChargeOn') : t('ctrlChargeOff')}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: isCharging ? theme.warning : theme.primary }]}
                  onPress={() => setIsCharging(!isCharging)}
                >
                  <Text style={styles.actionButtonText}>
                    {isCharging ? t('ctrlBtnDisable') : t('ctrlBtnEnable')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="car-battery" size={80} color={theme.textSecondary} style={{ marginBottom: 20 }} />
            <Text style={[styles.statusText, { color: theme.textPrimary, textAlign: 'center' }]}>No Device Connected</Text>
            <Text style={[styles.statusDescription, { color: theme.textSecondary, marginBottom: 40 }]}>
              Battery controls are unavailable. Please go to the Audit tab to scan and secure a device first.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Information Modal */}
      <Modal
        visible={infoModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <MaterialCommunityIcons name="information" size={26} color={theme.primary} />
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>{infoContent.title}</Text>
            </View>
            <Text style={[styles.modalDesc, { color: theme.textSecondary }]}>{infoContent.description}</Text>
            
            <TouchableOpacity 
              style={[styles.closeButton, { backgroundColor: isDarkMode ? theme.primary : '#091E42' }]}
              onPress={() => setInfoModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>{t('ctrlGotIt')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    justifyContent: 'space-between',
  },
  statBox: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    alignItems: 'center',
    elevation: 2,
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  controlsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  controlCard: {
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    elevation: 2,
  },
  controlInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  controlText: {
    marginLeft: 16,
    flex: 1,
    marginRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  controlTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  infoIcon: {
    marginLeft: 6,
    padding: 2,
  },
  controlDesc: {
    fontSize: 13,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 350,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
  modalDesc: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  closeButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 40,
  },
  statusText: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  statusDescription: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  }
});
