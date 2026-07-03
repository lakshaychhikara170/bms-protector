// @ts-nocheck
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, SafeAreaView, Platform, StatusBar, TextInput, Modal, RefreshControl, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BluetoothService from '../../services/BluetoothService';
import StorageService from '../../services/StorageService';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useRickshaw } from '../../context/RickshawContext';

import { getDeviceTypeInfo } from '../../utils/DeviceClassifier';

export default function ScannerScreen() {
  const { t } = useLanguage();
  const { theme, isDarkMode } = useTheme();
  const { setMyRickshaw } = useRickshaw();
  const [isScanning, setIsScanning] = useState(false);
  const [foundDevices, setFoundDevices] = useState([]);
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDevModalVisible, setIsDevModalVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');

  React.useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const h = await StorageService.getHistory();
    setHistory(h);
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (Platform.OS === 'web') {
      window.location.reload();
    } else {
      setTimeout(() => {
        loadHistory();
        setRefreshing(false);
      }, 1000);
    }
  };

  const startAudit = async () => {
    setFoundDevices([]);
    setIsScanning(true);
    
    try {
      // Call the physical Web Bluetooth antenna
      const realDevice = await BluetoothService.scanForRealDevice();
      if (realDevice) {
        setFoundDevices([realDevice]);
      }
    } catch (error) {
      if (error.name === 'NotFoundError') {
        alert("You cancelled the scan or no devices were found nearby.");
      } else {
        alert(error.message || "Failed to access Bluetooth hardware.");
      }
    } finally {
      setIsScanning(false);
    }
  };

  const openFixModal = (device) => {
    setSelectedDevice(device);
    setNewName(device.name);
    setNewPassword('');
    setIsModalVisible(true);
  };

  const saveSecurityChanges = async () => {
    if (!newPassword || newPassword.length < 6) {
      alert("Please enter a secure password (at least 6 characters).");
      return;
    }
    
    const updatedName = newName || selectedDevice.name;

    // Use Context instead of StorageService directly to trigger global re-renders
    await setMyRickshaw({
      id: selectedDevice.id,
      name: updatedName,
      secured: true
    });
    
    loadHistory();

    setFoundDevices(prevDevices => 
      prevDevices.map(dev => {
        if (dev.id === selectedDevice.id) {
          return { ...dev, unsecured: false, password: 'Secure', name: updatedName };
        }
        return dev;
      })
    );
    
    setIsModalVisible(false);
  };

  const connectToHistoryDevice = async (device) => {
    await setMyRickshaw({
      id: device.id,
      name: device.name,
      secured: true
    });
    alert(`Connected to ${device.name}`);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border, justifyContent: 'space-between' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="radar" size={28} color={theme.danger} />
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>{t('auditHeader')}</Text>
          </View>
          <TouchableOpacity onPress={() => setIsDevModalVisible(true)} style={{ padding: 4, opacity: 0.3 }}>
            <MaterialCommunityIcons name="bug" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            {t('auditDesc')}
          </Text>

          <TouchableOpacity 
            style={[styles.scanButton, { backgroundColor: theme.danger }, isScanning && styles.scanButtonDisabled]}
            onPress={startAudit}
            disabled={isScanning}
          >
            {isScanning ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <MaterialCommunityIcons name="magnify" size={20} color="#FFF" style={{marginRight: 8}} />
                <Text style={styles.scanButtonText}>{t('auditBtnScan')}</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.listContainer}>
            {foundDevices.length === 0 && !isScanning ? (
              <ScrollView 
                contentContainerStyle={history.length === 0 ? styles.emptyState : {}}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />
                }
              >
                {history.length > 0 ? (
                  <View style={styles.historySection}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <Text style={[styles.historyTitle, { color: theme.textSecondary, marginBottom: 0 }]}>PREVIOUSLY CONNECTED</Text>
                      <TouchableOpacity onPress={async () => {
                        await StorageService.clearHistory();
                        setHistory([]);
                      }}>
                        <Text style={{ color: theme.danger, fontSize: 12, fontWeight: '600' }}>Clear All</Text>
                      </TouchableOpacity>
                    </View>
                    {history.map((item, index) => {
                      const deviceInfo = getDeviceTypeInfo(item.name);
                      return (
                        <TouchableOpacity 
                          key={index} 
                          style={[styles.deviceCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                          onPress={() => connectToHistoryDevice(item)}
                        >
                          <View style={styles.deviceInfo}>
                            <MaterialCommunityIcons 
                              name={deviceInfo.icon} 
                              size={32} 
                              color={theme.success} 
                            />
                            <View style={styles.deviceTextContainer}>
                              <Text style={[styles.deviceName, { color: theme.textPrimary }]}>{item.name}</Text>
                              <Text style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 2 }}>{deviceInfo.type}</Text>
                              <Text style={[styles.deviceSecure, { color: theme.success }]}>
                                {t('auditSecurePrefix')}Saved Device
                              </Text>
                            </View>
                          </View>
                          <MaterialCommunityIcons name="chevron-right" size={24} color={theme.textSecondary} />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : (
                  <>
                    <MaterialCommunityIcons name="shield-search" size={48} color={theme.textSecondary} />
                    <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>{t('auditEmpty')}</Text>
                  </>
                )}
                
              </ScrollView>
            ) : (
              <FlatList
                data={foundDevices}
                keyExtractor={(item) => item.id}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />
                }
                renderItem={({ item }) => {
                  const deviceInfo = getDeviceTypeInfo(item.name);
                  return (
                    <View style={[styles.deviceCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                      <View style={styles.deviceInfo}>
                        <MaterialCommunityIcons 
                          name={deviceInfo.icon} 
                          size={32} 
                          color={item.unsecured ? theme.danger : theme.success} 
                        />
                        <View style={styles.deviceTextContainer}>
                          <Text style={[styles.deviceName, { color: theme.textPrimary }]}>{item.name}</Text>
                          <Text style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 2 }}>{deviceInfo.type}</Text>
                          <Text style={[item.unsecured ? styles.deviceVuln : styles.deviceSecure, { color: item.unsecured ? theme.danger : theme.success }]}>
                            {item.unsecured ? `${t('auditVulnPrefix')}${item.password}` : `${t('auditSecurePrefix')}Secure`}
                          </Text>
                        </View>
                      </View>
                    
                    {item.unsecured && (
                      <TouchableOpacity 
                        style={[styles.fixButton, { backgroundColor: isDarkMode ? theme.primary : '#172B4D' }]}
                        onPress={() => openFixModal(item)}
                      >
                        <Text style={styles.fixButtonText}>{t('auditBtnFix')}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              }}
              />
            )}
          </View>
        </View>
      </View>

      <Modal visible={isModalVisible} transparent={true} animationType="slide" onRequestClose={() => setIsModalVisible(false)}>
        <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <MaterialCommunityIcons name="shield-lock" size={24} color={theme.primary} />
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>{t('modalHeader')}</Text>
            </View>
            
            <Text style={[styles.modalDesc, { color: theme.textSecondary }]}>
              {t('modalDesc')}
            </Text>
            
            <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>{t('modalLabelName')}</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.border, color: theme.textPrimary, backgroundColor: theme.background }]}
              value={newName}
              onChangeText={setNewName}
              placeholder="e.g. Ajay Rickshaw 01"
              placeholderTextColor={theme.textSecondary}
            />
            
            <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>{t('modalLabelPass')}</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.border, color: theme.textPrimary, backgroundColor: theme.background }]}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="******"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry={true}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
                <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>{t('modalBtnCancel')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.primary }]} onPress={saveSecurityChanges}>
                <Text style={styles.saveButtonText}>{t('modalBtnUpdate')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={isDevModalVisible} transparent={true} animationType="fade" onRequestClose={() => setIsDevModalVisible(false)}>
        <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <MaterialCommunityIcons name="xml" size={24} color={theme.textSecondary} />
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Developer Tools</Text>
            </View>
            
            <Text style={[styles.modalDesc, { color: theme.textSecondary, marginBottom: 24 }]}>
              Instantly connect to mock devices to test dynamic UI layouts.
            </Text>
            
            <View style={{ gap: 12 }}>
              <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, alignItems: 'center' }]} 
                onPress={() => { setIsDevModalVisible(false); connectToHistoryDevice({ id: 'test-audio', name: 'JBL Headphones' }); }}>
                <Text style={{ color: theme.textPrimary, fontSize: 15, fontWeight: '600' }}>Test Audio Controls</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, alignItems: 'center' }]} 
                onPress={() => { setIsDevModalVisible(false); connectToHistoryDevice({ id: 'test-watch', name: 'Garmin Watch' }); }}>
                <Text style={{ color: theme.textPrimary, fontSize: 15, fontWeight: '600' }}>Test Watch Controls</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, alignItems: 'center' }]} 
                onPress={() => { setIsDevModalVisible(false); connectToHistoryDevice({ id: 'test-tv', name: 'LG Smart TV' }); }}>
                <Text style={{ color: theme.textPrimary, fontSize: 15, fontWeight: '600' }}>Test TV Controls</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, alignItems: 'center' }]} 
                onPress={() => { setIsDevModalVisible(false); connectToHistoryDevice({ id: 'test-bms', name: 'Daly BMS 48V' }); }}>
                <Text style={{ color: theme.textPrimary, fontSize: 15, fontWeight: '600' }}>Test Rickshaw Controls</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: theme.danger, alignItems: 'center', marginTop: 12 }]} 
                onPress={() => { setIsDevModalVisible(false); setMyRickshaw(null); }}>
                <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '600' }}>Disconnect Current Device</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.modalActions, { marginTop: 24 }]}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsDevModalVisible(false)}>
                <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 20, fontWeight: '700', marginLeft: 12 },
  content: { flex: 1, padding: 20 },
  description: { fontSize: 15, lineHeight: 22, marginBottom: 20 },
  scanButton: { flexDirection: 'row', paddingVertical: 14, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 24, elevation: 2 },
  scanButtonDisabled: { opacity: 0.7 },
  scanButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  listContainer: { flex: 1 },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyStateText: { marginTop: 16, fontSize: 15 },
  deviceCard: { padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1 },
  deviceInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  deviceTextContainer: { marginLeft: 12, flex: 1, marginRight: 8 },
  deviceName: { fontSize: 16, fontWeight: '600' },
  deviceVuln: { fontSize: 13, marginTop: 4 },
  deviceSecure: { fontSize: 13, marginTop: 4 },
  fixButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  fixButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { borderRadius: 12, padding: 24, width: '100%', maxWidth: 400, elevation: 5 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '700', marginLeft: 8 },
  modalDesc: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 2, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, marginBottom: 20 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  cancelButton: { paddingHorizontal: 16, paddingVertical: 10, marginRight: 12 },
  cancelButtonText: { fontSize: 15, fontWeight: '600' },
  saveButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 6 },
  saveButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  historySection: {
    paddingTop: 10,
  },
  historyTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  }
});
