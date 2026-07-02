
import { Platform, PermissionsAndroid } from 'react-native';

// Complete mock for all platforms so the app runs without native modules installed
const BleManager = class MockBleManager {
  startDeviceScan(uuids, options, listener) {
    setTimeout(() => {
      listener(null, { id: 'mock-1', name: 'MOCK-BMS-BATTERY' });
    }, 2000);
  }
  stopDeviceScan() {}
  async connectToDevice(id) {
    return {
      id,
      name: 'MOCK-BMS-BATTERY',
      discoverAllServicesAndCharacteristics: async () => {},
    };
  }
  async cancelDeviceConnection(id) {}
};

class BluetoothService {
  constructor() {
    this.manager = new BleManager();
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
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === 'granted' &&
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === 'granted'
        );
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS and Web permissions
  }

  startScanning(onDeviceFound) {
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error(error);
        return;
      }
      if (device && device.name) {
        onDeviceFound(device);
      }
    });
  }

  stopScanning() {
    this.manager.stopDeviceScan();
  }

  async connectToDevice(device) {
    try {
      this.stopScanning();
      console.log(`Connecting to ${device.name}...`);
      const connectedDevice = await this.manager.connectToDevice(device.id);
      
      console.log(`Discovering services and characteristics...`);
      await connectedDevice.discoverAllServicesAndCharacteristics();
      
      this.connectedDevice = connectedDevice;
      console.log('Connected successfully!');
      
      return true;
    } catch (e) {
      console.error('Connection error', e);
      return false;
    }
  }

  async disconnect() {
    if (this.connectedDevice) {
      await this.manager.cancelDeviceConnection(this.connectedDevice.id);
      this.connectedDevice = null;
      console.log('Disconnected');
    }
  }
}

export default BluetoothService;
