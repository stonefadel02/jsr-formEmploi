import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
} from '@react-email/components';
import React from 'react';

interface VerificationEmailProps {
  userName: string;
  verificationLink: string;
}

export default function VerificationEmail({ userName, verificationLink }: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Validez votre adresse e-mail</Heading>
          <Text style={paragraph}>Bonjour {userName},</Text>
          <Text style={paragraph}>
            Merci de vous être inscrit sur Jsr-alternance. Veuillez cliquer sur le bouton
            ci-dessous pour vérifier votre adresse e-mail et continuer vers le paiement.
          </Text>
          <Button style={button} href={verificationLink}>
            Valider mon E-mail
          </Button>
          <Text style={paragraph}>
            Ce lien est valide pendant 1 heure.
          </Text>
          <Text style={paragraph}>
            Cordialement,<br />L`équipe Jsr-alternance
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = { backgroundColor: '#f6f6f6', fontFamily: 'Arial, sans-serif' };
const container = { margin: '0 auto', padding: '20px 0 48px', width: '580px', backgroundColor: '#ffffff' };
const heading = { fontSize: '24px', lineHeight: '1.3', fontWeight: '700', color: '#484848', textAlign: 'center' as const };
const paragraph = { fontSize: '16px', lineHeight: '1.4', color: '#484848', padding: '0 40px' };
const button = { backgroundColor: '#7A20DA', borderRadius: '5px', color: '#fff', fontSize: '16px', textDecoration: 'none', textAlign: 'center' as const, display: 'block', width: '200px', padding: '12px', margin: '20px auto' };