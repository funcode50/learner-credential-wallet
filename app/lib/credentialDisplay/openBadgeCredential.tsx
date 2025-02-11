import moment from 'moment';
import React from 'react';
import { View, Text } from 'react-native';

import { CredentialStatusBadges } from '../../components';
import { useDynamicStyles } from '../../hooks';
import { DATE_FORMAT } from '../constants';
import type { CredentialCardProps, CredentialDisplayConfig } from '.';
import { CardLink, CardDetail, dynamicStyleSheet, IssuerInfoButton, CardImage, issuerRenderInfoFrom, credentialSubjectRenderInfoFrom } from './shared';

export const openBadgeCredentialDisplayConfig: CredentialDisplayConfig = {
  credentialType: 'OpenBadgeCredential',
  cardComponent: OpenBadgeCredentialCard,
  itemPropsResolver: ({ credentialSubject, issuer, name }) => {
    const { title, achievementImage } = credentialSubjectRenderInfoFrom(credentialSubject);
    const { issuerName, issuerImage } = issuerRenderInfoFrom(issuer);

    return {
      title: name ? name.toString() : title,
      subtitle: issuerName,
      image: achievementImage || issuerImage,
    };
  }
};

function OpenBadgeCredentialCard({ rawCredentialRecord, onPressIssuer }: CredentialCardProps): JSX.Element {
  const { styles, theme } = useDynamicStyles(dynamicStyleSheet);
  const { credential } = rawCredentialRecord;
  const { credentialSubject, issuer, issuanceDate, expirationDate, name } = credential;

  const formattedIssuanceDate = moment(issuanceDate).format(DATE_FORMAT);
  const formattedExpirationDate = expirationDate ? moment(expirationDate).format(DATE_FORMAT) : null;

  const {
    description,
    criteria,
    subjectName,
    numberOfCredits,
    startDateFmt,
    endDateFmt,
    achievementImage,
    achievementType
  } = credentialSubjectRenderInfoFrom(credentialSubject);

  const {
    issuerName,
    issuerUrl,
    issuerId,
    issuerImage,
  } = issuerRenderInfoFrom(issuer);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.dataContainer}>
        <CredentialStatusBadges
          rawCredentialRecord={rawCredentialRecord}
          badgeBackgroundColor={theme.color.backgroundPrimary}
        />
        <View style={[styles.flexRow, styles.dataContainer]}>
          <View>
            {achievementImage && <CardImage source={achievementImage} accessibilityLabel={issuerName} />}
          </View>
          <View style={styles.flexColumn}>
            <View>
              <Text style={styles.headerInRow} accessibilityRole="header">{name}</Text>
            </View>
            <View>
              <CardDetail label="Achievement Type" value={achievementType} inRow={true}/>
            </View>
          </View>
        </View>
        <Text style={styles.dataLabel}>Issuer</Text>
        <View style={styles.flexRow}>
          <CardImage source={issuerImage} accessibilityLabel={issuerName} />
          <View style={styles.spaceBetween}>
            <IssuerInfoButton issuerId={issuerId} issuerName={issuerName} onPress={onPressIssuer} />
            <CardLink url={issuerUrl} />
          </View>
        </View>
      </View>
      <View style={styles.dateStyles}>
        <CardDetail label="Issuance Date" value={formattedIssuanceDate} />
        <CardDetail label="Expiration Date" value={formattedExpirationDate} />
      </View>
      <CardDetail label="Issued To" value={subjectName} />
      <CardDetail label="Number of Credits" value={numberOfCredits} />
      <View style={styles.flexRow}>
        <CardDetail label="Start Date" value={startDateFmt} />
        <CardDetail label="End Date" value={endDateFmt} />
      </View>
      <CardDetail label="Description" value={description} />
      <CardDetail label="Criteria" value={criteria} isMarkdown={true}/>
    </View>
  );
}
