import React, { useState, useRef } from 'react';
import { Alert, Text, Linking } from 'react-native';
import { View, useWindowDimensions } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { BarCodeReadEvent, RNCameraProps } from 'react-native-camera';

import { ConfirmModal } from '../../components';
import { NavHeader } from '../../components';
import { QRScreenProps } from './QRScreen.d';
import dynamicStyleSheet from './QRScreen.styles';
import { errorMessageFrom } from '../../lib/error';
import { useDynamicStyles } from '../../hooks';

export default function QRScreen({ navigation, route }: QRScreenProps): JSX.Element {
  const { styles } = useDynamicStyles(dynamicStyleSheet);
  const { onReadQRCode, instructionText } = route.params;

  const [errorMessage, setErrorMessage] = useState('');
  const { width } = useWindowDimensions();
  const scannerRef = useRef<QRCodeScanner>(null);

  const errorModalOpen = errorMessage !== '';

  function Instructions(): JSX.Element {
    return (
      <Text style={styles.instructionText}>
        {instructionText}
      </Text>
    );
  }

  async function onRead({ data: text }: BarCodeReadEvent) {
    try {
      await onReadQRCode(text);
    } catch (err) {
      setErrorMessage(errorMessageFrom(err));
    }

  }

  function onRequestModalClose() {
    setErrorMessage('');
    setTimeout(() => scannerRef.current?.reactivate(), 1000);
  }

  function goToSettings() {
    Linking.openSettings();
  }

  function navGoBack() {
    navigation.goBack();
  }

  function NoCameraPermission(): JSX.Element {
    return (
      <View>
        { 
          Alert.alert(
            'Camera Access is Off', 
            'Please go into your camera settings and enable access for this app',
            [
              {
                text: 'Go Back',
                onPress: navGoBack
              },
              {
                text: 'Settings',
                onPress: goToSettings
              }
            ])
        }
      </View>
    );
  }

  return (
    <View style={styles.scannerBody}>
      <NavHeader title="QR Code Scanner" goBack={navigation.goBack} />
      <QRCodeScanner
        ref={scannerRef}
        onRead={onRead}
        topContent={<Instructions />}
        topViewStyle={styles.instructionContainer}
        bottomViewStyle={styles.emptyContainer}
        cameraStyle={styles.cameraStyle}
        markerStyle={[styles.markerStyle, {
          width: width * 0.8,
          height: width * 0.8,
        }]}
        notAuthorizedView={<NoCameraPermission />}
        cameraProps={{
          accessibilityLabel: 'QR Code Scanner, Camera Active',
          accessible: true,
          notAuthorizedView: <NoCameraPermission />
        } as RNCameraProps}
        showMarker
      />
      <ConfirmModal
        open={errorModalOpen}
        onRequestClose={onRequestModalClose}
        confirmText="Okay"
        cancelButton={false}
        cancelOnBackgroundPress
        title={errorMessage}
      />
    </View>
  );
}
