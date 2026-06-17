 App.js – SPQR: Империя (без шаблонов паспортов)
// ============================================================

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  View, Text, TouchableOpacity, TextInput, ImageBackground,
  StyleSheet, ActivityIndicator, Alert, Modal, Image, ScrollView,
  FlatList, KeyboardAvoidingView, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ---------- FIREBASE (Web SDK) ----------
// Import the functions you need from the SDKs you need
// ---------- FIREBASE (Web SDK) ----------
import { initializeApp } from 'firebase/app';
import {
  getDatabase, ref, push, onChildAdded,
  query, orderByChild, limitToLast, off
} from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDqk5AhJ6UYk0JStBhziex96dye4DOlVnM",
  authDomain: "spqr-19fdb.firebaseapp.com",
  databaseURL: "https://spqr-19fdb-default-rtdb.firebaseio.com",
  projectId: "spqr-19fdb",
  storageBucket: "spqr-19fdb.firebasestorage.app",
  messagingSenderId: "394775804388",
  appId: "1:394775804388:web:e7b72603a9b8765092aff1",
  measurementId: "G-4N7Z4PH5KD"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// ---------- КОНТЕКСТ ЯЗЫКА ----------
const LanguageContext = createContext();
export const useLanguage = () => useContext(LanguageContext);

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ru');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLang = async () => {
      try {
        const saved = await AsyncStorage.getItem('appLanguage');
        if (saved) setLanguage(saved);
      } catch (e) {}
      setIsLoading(false);
    };
    loadLang();
  }, []);

  const changeLanguage = async (lang) => {
    setLanguage(lang);
    await AsyncStorage.setItem('appLanguage', lang);
  };

  if (isLoading) {
    return (
      <View style={styles.containerCentered}>
        <ActivityIndicator color={colors.gold} />
      </View>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// ---------- ТЕКСТЫ ----------
const texts = {
  ru: {
    chooseLanguage: 'Выберите язык',
    loginWithPassport: 'Войти по Паспорту',
    getPassport: 'Получить NFT Паспорт',
    paymentTitle: 'Оплата паспорта',
    paymentDesc: 'Для получения паспорта необходимо оплатить сбор',
    payNow: 'Оплатить',
    back: 'Назад',
    success: 'Оплата прошла успешно!',
    error: 'Ошибка оплаты',
    passportId: 'ID паспорта',
    loading: 'Загрузка...',
    taxNote: 'Доступ к Чату Сената после уплаты квартального налога',
    settings: 'Настройки',
    bankDetails: 'Реквизиты банковского счета',
    save: 'Сохранить',
    passportNFT: 'Паспорт (NFT)',
    chatBlocked: 'Чат заблокирован до уплаты налога',
    taxPaid: 'Налог уплачен, статус "SOLVIT" подтвержден. Добро пожаловать!',
    treasury: 'Перейти в Казначейство',
    enterSenateChat: 'Войти в чат Совета',
    logout: 'Выйти',
    fullName: 'Полное имя (имя, фамилия, когномен)',
    quote: 'Цитата (необязательно)',
    alreadyHasPassport: 'У вас уже есть паспорт. Получить новый невозможно.',
    noPassport: 'Паспорт не найден. Получите новый.',
    nftId: 'NFT ID',
    contractAddress: 'Адрес смарт-контракта',
    changeQuote: 'Изменить цитату',
    newQuote: 'Новая цитата',
    quoteChanged: 'Цитата успешно обновлена',
    languageSettings: 'Язык интерфейса',
    appearance: 'Внешний вид',
    notifications: 'Уведомления',
    about: 'О приложении',
    version: 'Версия 1.0.0',
    chatAutoTranslate: 'Автоперевод чата (вкл.)',
  },
  en: {
    chooseLanguage: 'Choose language',
    loginWithPassport: 'Login with Passport',
    getPassport: 'Get NFT Passport',
    paymentTitle: 'Passport payment',
    paymentDesc: 'To get a passport, you need to pay a fee',
    payNow: 'Pay Now',
    back: 'Back',
    success: 'Payment successful!',
    error: 'Payment error',
    passportId: 'Passport ID',
    loading: 'Loading...',
    taxNote: 'Access to Senate Chat after quarterly tax payment',
    settings: 'Settings',
    bankDetails: 'Bank account details',
    save: 'Save',
    passportNFT: 'Passport (NFT)',
    chatBlocked: 'Chat is blocked until tax payment',
    taxPaid: 'Tax paid, status "SOLVIT" confirmed. Welcome!',
    treasury: 'Go to Treasury',
    enterSenateChat: 'Enter Senate Chat',
    logout: 'Logout',
    fullName: 'Full name (first, last, cognomen)',
    quote: 'Quote (optional)',
    alreadyHasPassport: 'You already have a passport. Cannot get a new one.',
    noPassport: 'Passport not found. Get a new one.',
    nftId: 'NFT ID',
    contractAddress: 'Smart contract address',
    changeQuote: 'Change quote',
    newQuote: 'New quote',
    quoteChanged: 'Quote updated successfully',
    languageSettings: 'Interface language',
    appearance: 'Appearance',
    notifications: 'Notifications',
    about: 'About',
    version: 'Version 1.0.0',
    currentDesign: 'Current design',
    passportType: 'Passport type',
    chatAutoTranslate: 'Chat auto-translate (on)',
  },
};

// ---------- ЦВЕТА И СТИЛИ ----------
const colors = {
  background: '#1A0B2E',
  gold: '#D4AF37',
  goldLight: '#F3E5AB',
  goldDark: '#B8860B',
  textWhite: '#F5F5F5',
  statusValid: '#2E7D32',
  statusDebet: '#C62828',
  glassDark: 'rgba(26,11,46,0.85)',
  borderGold: 'rgba(212,175,55,0.5)',
};

const typography = {
  title: { fontSize: 28, fontWeight: 'bold', letterSpacing: 1.5, color: colors.gold },
  body: { fontSize: 14, color: colors.textWhite },
  spqr: { fontSize: 48, fontWeight: 'bold', color: colors.gold },
};

// ---------- ЯНДЕКС TRANSLATE API ----------
const YANDEX_API_KEY = 'AQVN1NyRQCV3O45WNrSBUrEgCe-xFPCzGzXgRBUm'; // Замените на реальный

const translateWithYandex = async (text, targetLang) => {
  if (!text || !targetLang) return text;
  const lang = targetLang.toLowerCase();
  try {
    const response = await fetch(
      `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${YANDEX_API_KEY}&text=${encodeURIComponent(text)}&lang=${lang}`
    );
    const data = await response.json();
    if (data.code === 200 && data.text && data.text.length > 0) {
      return data.text[0];
    } else {
      console.warn('Яндекс ошибка:', data);
      return text;
    }
  } catch (error) {
    console.error('Яндекс ошибка:', error);
    return text;
  }
};

// ---------- КОМПОНЕНТ CHATSCREEN ----------
const ChatScreen = ({ navigation }) => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const json = await AsyncStorage.getItem('user');
        if (json) {
          const u = JSON.parse(json);
          setUser(u);
        }
      } catch (e) {}
      setLoading(false);
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (!user || user.taxStatus !== 'SOLVIT') return;

    const chatRef = ref(database, 'chats/main');
    const messagesQuery = query(chatRef, orderByChild('timestamp'), limitToLast(50));

    const handleChildAdded = async (snapshot) => {
      const newMsg = snapshot.val();
      if (newMsg) {
        setMessages(prev => {
          const exists = prev.some(m => m.id === snapshot.key);
          if (exists) return prev;
          return [...prev, { id: snapshot.key, ...newMsg }];
        });
        if (newMsg.language && newMsg.language !== language) {
          const translated = await translateWithYandex(newMsg.text, language);
          setMessages(prev => prev.map(m => {
            if (m.id === snapshot.key) {
              return { ...m, translatedText: translated };
            }
            return m;
          }));
        }
        flatListRef.current?.scrollToEnd();
      }
    };

    const unsubscribe = onChildAdded(messagesQuery, handleChildAdded);

    return () => {
      off(messagesQuery, 'child_added', handleChildAdded);
    };
  }, [user, language]);

  const handleSend = async () => {
    if (!inputText.trim() || !user || sending) return;
    setSending(true);

    const chatRef = ref(database, 'chats/main');
    const newMessage = {
      text: inputText.trim(),
      sender: user.name || 'Сенатор',
      senderId: user.id || 'unknown',
      timestamp: Date.now(),
      language: language,
    };

    try {
      await push(chatRef, newMessage);
      setInputText('');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось отправить сообщение');
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isOwn = item.senderId === user?.id;
    const isSystem = item.sender === 'Система';
    const displayText = (item.language && item.language !== language && item.translatedText)
      ? item.translatedText
      : item.text;

    return (
      <View style={[
        styles.messageContainer,
        isOwn ? styles.ownMessage : null,
        isSystem && styles.systemMessage,
      ]}>
        <Text style={styles.senderName}>{item.sender}</Text>
        <Text style={styles.messageText}>{displayText}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.containerCentered}>
        <ActivityIndicator color={colors.gold} />
      </View>
    );
  }

  if (!user || user.taxStatus !== 'SOLVIT') {
    return (
      <ImageBackground source={{ uri: 'https://www.transparenttextures.com/patterns/marble.png' }} style={styles.bg}>
        <View style={[styles.overlay, { paddingTop: 40 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Назад</Text>
          </TouchableOpacity>
          <View style={styles.accessDenied}>
            <Text style={styles.accessDeniedText}>⛔ Доступ запрещён</Text>
            <Text style={styles.accessDeniedSub}>
              Чат Совета доступен только гражданам со статусом SOLVIT.
            </Text>
            <Text style={[styles.accessDeniedSub, { marginTop: 10, color: colors.gold }]}>
              Оплатите налог для получения доступа.
            </Text>
          </View>
        </View>
      </ImageBackground>
    );
  }

  const canWrite = user.isSenator === true;

  return (
    <ImageBackground source={{ uri: 'https://www.transparenttextures.com/patterns/marble.png' }} style={styles.bg}>
      <View style={[styles.overlay, { paddingTop: 40, flex: 1 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Назад</Text>
        </TouchableOpacity>
        <Text style={[typography.title, { textAlign: 'center', marginBottom: 6 }]}>Чат Сената</Text>
        <Text style={[typography.body, { textAlign: 'center', marginBottom: 10, opacity: 0.7 }]}>
          Автоперевод на {language === 'ru' ? 'русский' : 'английский'} (Яндекс)
        </Text>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.chatList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          showsVerticalScrollIndicator={false}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[styles.inputContainer, !canWrite && styles.inputDisabled]}
        >
          <TextInput
            style={[styles.input, !canWrite && styles.inputDisabled]}
            placeholder="Введите сообщение..."
            placeholderTextColor={colors.textWhite + '80'}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={canWrite ? handleSend : undefined}
            editable={canWrite}
          />
          <TouchableOpacity
            style={[styles.sendButton, !canWrite && styles.sendDisabled]}
            onPress={handleSend}
            disabled={!canWrite || sending}
          >
            {sending ? <ActivityIndicator color={colors.gold} /> : <Text style={styles.sendText}>➤</Text>}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

// ---------- КОМПОНЕНТ GoldButton ----------
const GoldButton = ({ title, onPress, variant = 'primary', loading, disabled }) => {
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      style={[
        styles.goldButton,
        isPrimary ? styles.goldButtonPrimary : styles.goldButtonSecondary,
        isDisabled && styles.goldButtonDisabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? <ActivityIndicator color={isPrimary ? colors.background : colors.gold} /> :
        <Text style={[styles.goldButtonText, isPrimary ? styles.goldButtonTextPrimary : styles.goldButtonTextSecondary]}>
          {title}
        </Text>
      }
    </TouchableOpacity>
  );
};

// ---------- КОМПОНЕНТ ПРОФИЛЯ (без шаблонов) ----------
const ProfileHeader = ({ user }) => {
  const isSolvit = user?.taxStatus === 'SOLVIT';

  return (
    <View style={[styles.profileContainer, { borderColor: colors.gold, backgroundColor: colors.glassDark }]}>
      <View style={styles.avatarWrapper}>
        <Image
          source={{ uri: user?.passportImageUrl || 'https://randomuser.me/api/portraits/lego/1.jpg' }}
          style={[styles.avatar, { borderColor: colors.gold }]}
        />
      </View>
      <Text style={styles.profileName}>{user?.name || 'Гражданин'}</Text>
      <Text style={styles.profileId}>{user?.passportId || 'SPQR-0000'}</Text>
      {user?.quote && <Text style={styles.profileQuote}>«{user.quote}»</Text>}
      <View style={styles.taxRow}>
        <Text style={styles.taxLabel}>Налог</Text>
        <Text style={styles.taxDate}>{user?.expiryDate || '01.01.2025'}</Text>
        <View style={[styles.statusBadge, { backgroundColor: isSolvit ? colors.statusValid : colors.statusDebet }]}>
          <Text style={styles.statusText}>{isSolvit ? 'SOLVIT' : 'DEBET'}</Text>
        </View>
      </View>
    </View>
  );
};

// ---------- БАЗА ПАСПОРТОВ (заглушка) ----------
const initPassportDatabase = async () => {
  try {
    const existing = await AsyncStorage.getItem('passports');
    if (!existing) {
      const initial = [
        { id: 'SPQR-0421', name: 'Гай Юлий Цезарь', image: 'https://randomuser.me/api/portraits/men/1.jpg', expiry: '01.01.2026' },
        { id: 'SPQR-9999', name: 'Тестовый гражданин', image: 'https://randomuser.me/api/portraits/men/2.jpg', expiry: '01.01.2027' },
      ];
      await AsyncStorage.setItem('passports', JSON.stringify(initial));
    }
  } catch (e) {}
};
const findPassportById = async (id) => {
  const json = await AsyncStorage.getItem('passports');
  const db = json ? JSON.parse(json) : [];
  return db.find(p => p.id.toUpperCase() === id.toUpperCase());
};

// ---------- ЭКРАН ВЫБОРА ЯЗЫКА ----------
const LanguageScreen = ({ navigation }) => {
  const { language, changeLanguage } = useLanguage();
  const t = texts[language];
  const onSelect = async (lang) => {
    await changeLanguage(lang);
    const userJson = await AsyncStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      if (user.taxStatus === 'SOLVIT') navigation.replace('DashboardSolvit');
      else navigation.replace('DashboardDebet');
    } else {
      navigation.replace('Auth');
    }
  };

  return (
    <ImageBackground source={{ uri: 'https://www.transparenttextures.com/patterns/marble.png' }} style={styles.bg}>
      <View style={styles.overlay}>
        <Text style={[typography.spqr, { textAlign: 'center', marginBottom: 40 }]}>SPQR</Text>
        <Text style={[typography.body, { textAlign: 'center', fontSize: 18, marginBottom: 30 }]}>{t.chooseLanguage}</Text>
        <GoldButton title="Русский" onPress={() => onSelect('ru')} variant="primary" />
        <GoldButton title="English" onPress={() => onSelect('en')} variant="secondary" />
      </View>
    </ImageBackground>
  );
};

// ---------- ЭКРАН ВХОДА ----------
const AuthScreen = ({ navigation }) => {
  const { language } = useLanguage();
  const t = texts[language];
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [passportId, setPassportId] = useState('');
  const [tapCount, setTapCount] = useState(0);

  useEffect(() => { initPassportDatabase(); }, []);

  const handleSpqrTap = () => {
    setTapCount(prev => {
      const newCount = prev + 1;
      if (newCount === 10) {
        const creator = {
          id: 'creator-001',
          name: 'Создатель Империи',
          passportId: 'CREATOR-0000',
          passportImageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
          expiryDate: '01.01.2099',
          language: language,
          taxStatus: 'SOLVIT',
          autoDonate: false,
          autoDonateMethod: null,
          balance: 999999,
          role: 'creator',
          quote: 'Imperium tuum verbum',
          nftId: 'NFT-0001',
          contractAddress: '0x0000000000000000000000000000000000000000',
          isSenator: true,
        };
        AsyncStorage.setItem('user', JSON.stringify(creator));
        navigation.replace('DashboardSolvit');
        setTapCount(0);
        return 0;
      }
      return newCount;
    });
  };

  const handleLoginWithPassport = async () => {
    setLoading(true);
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        if (user.taxStatus === 'SOLVIT') navigation.replace('DashboardSolvit');
        else navigation.replace('DashboardDebet');
      } else {
        Alert.alert(t.error, t.noPassport);
        setModalVisible(true);
      }
    } catch (e) {
      Alert.alert(t.error, 'Техническая ошибка.');
    }
    setLoading(false);
  };

  const handlePassportUpload = async () => {
    if (!passportId.trim()) { Alert.alert(t.error, 'Введите ID паспорта'); return; }
    setLoading(true);
    try {
      const found = await findPassportById(passportId.trim());
      if (found) {
        const user = {
          id: `citizen-${Date.now()}`,
          name: found.name,
          passportId: found.id,
          passportImageUrl: found.image,
          expiryDate: found.expiry,
          language: language,
          taxStatus: 'DEBET',
          autoDonate: false,
          autoDonateMethod: null,
          balance: 1000,
          role: 'citizen',
          quote: '',
          nftId: `NFT-${Math.floor(Math.random()*10000)}`,
          contractAddress: '0x' + '0'.repeat(40),
          isSenator: false,
        };
        await AsyncStorage.setItem('user', JSON.stringify(user));
        setModalVisible(false);
        setPassportId('');
        navigation.replace('DashboardDebet');
      } else {
        Alert.alert(t.error, 'Паспорт с таким ID не найден.');
      }
    } catch (e) {
      Alert.alert(t.error, 'Ошибка загрузки паспорта.');
    }
    setLoading(false);
  };

  const handleGetPassport = async () => {
    const userJson = await AsyncStorage.getItem('user');
    if (userJson) {
      Alert.alert('Ошибка', t.alreadyHasPassport);
      return;
    }
    navigation.navigate('RegisterPassport');
  };

  return (
    <ImageBackground source={{ uri: 'https://www.transparenttextures.com/patterns/marble.png' }
