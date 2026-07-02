import React, { createContext, useState, useContext, useEffect } from 'react';
import StorageService from '../services/StorageService';

const translations = {
  en: {
    // Tabs
    tabShield: "Shield",
    tabAudit: "Audit Tool",
    tabControl: "Control",
    // Dashboard (Shield)
    shieldHeader: "BMS Protector",
    shieldStatus: "Shield Status",
    shieldActive: "ACTIVE",
    shieldInactive: "INACTIVE",
    shieldActiveDesc: "Your rickshaw is currently protected. No other devices can connect to your battery.",
    shieldInactiveDesc: "Your battery is vulnerable to unauthorized connections. Activate the shield.",
    shieldBtnActivate: "Activate Shield",
    shieldBtnDeactivate: "Deactivate Shield",
    // Scanner (Audit)
    auditHeader: "Security Audit",
    auditDesc: "Scan the area for nearby e-rickshaw batteries that are using default passwords and are vulnerable to pranksters.",
    auditBtnScan: "Start Network Audit",
    auditEmpty: "No batteries found yet. Run an audit to start.",
    auditSecurePrefix: "Secure: ",
    auditVulnPrefix: "Vulnerable: Password is ",
    auditBtnFix: "Fix Now",
    // Modal
    modalHeader: "Secure Battery",
    modalDesc: "Set a new custom password and optionally rename your Rickshaw's Bluetooth broadcast name.",
    modalLabelName: "New Rickshaw Name",
    modalLabelPass: "New Secure Password",
    modalBtnCancel: "Cancel",
    modalBtnUpdate: "Update & Secure",
    // Control
    ctrlHeader: "Battery Control",
    ctrlVoltage: "Voltage",
    ctrlCurrent: "Current",
    ctrlSOC: "SOC",
    ctrlTemp: "Temp",
    ctrlMainControls: "Main Controls",
    ctrlDischargeTitle: "Discharge (Kill Switch)",
    ctrlDischargeOn: "Motor power is ON.",
    ctrlDischargeOff: "Motor power is CUT OFF.",
    ctrlBtnCut: "CUT POWER",
    ctrlBtnRestore: "RESTORE",
    ctrlChargeTitle: "Charge Switch",
    ctrlChargeOn: "Charging enabled.",
    ctrlChargeOff: "Charging disabled.",
    ctrlBtnDisable: "DISABLE",
    ctrlBtnEnable: "ENABLE",
    ctrlGotIt: "Got it!",
    // Onboarding
    onboardWelcome: "Welcome / स्वागत है",
    onboardDesc: "Please select your preferred language to continue.",
    onboardBtnEn: "English",
    onboardBtnHi: "हिंदी (Hindi)"
  },
  hi: {
    // Tabs
    tabShield: "कवच",
    tabAudit: "ऑडिट",
    tabControl: "नियंत्रण",
    // Dashboard (Shield)
    shieldHeader: "बीएमएस रक्षक",
    shieldStatus: "कवच स्थिति",
    shieldActive: "सक्रिय",
    shieldInactive: "निष्क्रिय",
    shieldActiveDesc: "आपका रिक्शा सुरक्षित है। कोई अन्य डिवाइस आपकी बैटरी से नहीं जुड़ सकता।",
    shieldInactiveDesc: "आपकी बैटरी असुरक्षित है। कृपया कवच सक्रिय करें।",
    shieldBtnActivate: "कवच चालू करें",
    shieldBtnDeactivate: "कवच बंद करें",
    // Scanner (Audit)
    auditHeader: "सुरक्षा जांच",
    auditDesc: "आसपास की ई-रिक्शा बैटरियों को स्कैन करें जो डिफ़ॉल्ट पासवर्ड का उपयोग कर रही हैं और शरारतों के प्रति संवेदनशील हैं।",
    auditBtnScan: "नेटवर्क जांच शुरू करें",
    auditEmpty: "अभी तक कोई बैटरी नहीं मिली। शुरू करने के लिए जांच करें।",
    auditSecurePrefix: "सुरक्षित: ",
    auditVulnPrefix: "असुरक्षित: पासवर्ड है ",
    auditBtnFix: "अभी ठीक करें",
    // Modal
    modalHeader: "बैटरी सुरक्षित करें",
    modalDesc: "एक नया पासवर्ड सेट करें और अपने रिक्शा का ब्लूटूथ नाम बदलें।",
    modalLabelName: "नया रिक्शा नाम",
    modalLabelPass: "नया सुरक्षित पासवर्ड",
    modalBtnCancel: "रद्द करें",
    modalBtnUpdate: "अपडेट और सुरक्षित करें",
    // Control
    ctrlHeader: "बैटरी नियंत्रण",
    ctrlVoltage: "वोल्टेज",
    ctrlCurrent: "विद्युत धारा",
    ctrlSOC: "बैटरी (SOC)",
    ctrlTemp: "तापमान",
    ctrlMainControls: "मुख्य नियंत्रण",
    ctrlDischargeTitle: "डिस्चार्ज (किल स्विच)",
    ctrlDischargeOn: "मोटर पावर चालू है।",
    ctrlDischargeOff: "मोटर पावर बंद है।",
    ctrlBtnCut: "पावर बंद करें",
    ctrlBtnRestore: "पावर चालू करें",
    ctrlChargeTitle: "चार्ज स्विच",
    ctrlChargeOn: "चार्जिंग चालू है।",
    ctrlChargeOff: "चार्जिंग बंद है।",
    ctrlBtnDisable: "बंद करें",
    ctrlBtnEnable: "चालू करें",
    ctrlGotIt: "समझ गया!",
    // Onboarding
    onboardWelcome: "Welcome / स्वागत है",
    onboardDesc: "आगे बढ़ने के लिए कृपया अपनी पसंदीदा भाषा चुनें।",
    onboardBtnEn: "English",
    onboardBtnHi: "हिंदी (Hindi)"
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(null); 
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check local storage for saved language on boot
    const loadLang = async () => {
      const savedLang = await StorageService.getLanguage();
      if (savedLang) {
        setLangState(savedLang);
      }
      setIsReady(true);
    };
    loadLang();
  }, []);

  const setLang = async (newLang) => {
    setLangState(newLang);
    await StorageService.saveLanguage(newLang);
  };

  const t = (key) => {
    const currentLang = lang || 'en'; 
    return translations[currentLang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isReady }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
