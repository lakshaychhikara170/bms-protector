export const getDeviceTypeInfo = (deviceName = '') => {
  const name = deviceName.toLowerCase();
  
  if (name.includes('airpod') || name.includes('buds') || name.includes('headphone') || name.includes('earbud') || name.includes('bose') || name.includes('jbl') || name.includes('sony') || name.includes('audio')) {
    return { type: 'Audio Device', icon: 'headphones' };
  }
  
  if (name.includes('watch') || name.includes('fitbit') || name.includes('garmin') || name.includes('band') || name.includes('wear')) {
    return { type: 'Wearable / Watch', icon: 'watch' };
  }
  
  if (name.includes('tv') || name.includes('television') || name.includes('samsung') || name.includes('lg') || name.includes('bravia')) {
    return { type: 'Smart TV', icon: 'television' };
  }
  
  if (name.includes('mac') || name.includes('pc') || name.includes('desktop') || name.includes('laptop') || name.includes('iphone') || name.includes('ipad') || name.includes('phone')) {
    return { type: 'Computer / Phone', icon: 'laptop' };
  }
  
  if (name.includes('bms') || name.includes('bat') || name.includes('jbd') || name.includes('daly') || name.includes('rickshaw') || name.includes('ev ')) {
    return { type: 'Rickshaw Battery', icon: 'car-electric' };
  }

  // Default generic bluetooth device
  return { type: 'Bluetooth Device', icon: 'bluetooth' };
};
