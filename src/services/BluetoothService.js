import { Platform, PermissionsAndroid } from 'react-native';

class BluetoothService {
  constructor() {
    this.connectedDevice = null;
  }

  async requestPermissions() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        return (
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === 'granted' &&
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === 'granted'
        );
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; 
  }

  // Returns a promise containing the real device selected by the user
  async scanForRealDevice() {
    if (Platform.OS === 'web') {
      try {
        if (!navigator || !navigator.bluetooth) {
          throw new Error("Web Bluetooth is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
        }
        
        // This triggers the native browser dialog showing real Bluetooth devices in the room
        const device = await navigator.bluetooth.requestDevice({
          acceptAllDevices: true
        });
        
        if (device) {
          return {
            id: device.id || 'real-device-' + Math.random().toString(36).substr(2, 9),
            name: device.name || 'Unknown Bluetooth Device',
            unsecured: true, // We assume it's vulnerable for the sake of the app flow
            password: 'Default (000000)'
          };
        }
      } catch (error) {
        console.error("Web Bluetooth Error: ", error);
        throw error;
      }
    } else {
      // Fallback for native testing without ble-plx installed
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: 'mock-1', name: 'NATIVE-MOCK-BMS', unsecured: true, password: 'None'
          });
        }, 1500);
      });
    }
  }
}

export default new BluetoothService();
