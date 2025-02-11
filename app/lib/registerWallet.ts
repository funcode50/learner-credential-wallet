import {Linking} from 'react-native';

export function registerWallet(): void {
  Linking.canOpenURL('https://lcw.app/register-wallet.html').then(supported => {
    if (supported) {
      Linking.openURL('https://lcw.app/register-wallet.html');
    } else {
      console.log('Unable to register wallet! Failed URL');
    }
  });
}