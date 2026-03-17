import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldCheck, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOW } from '../utils/theme';
import { useAuth } from '../context/AuthContext';

const OTPVerificationScreen = ({ navigation, route }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  
  const { email } = route.params || {};
  const { verifyOtp, sendOtp } = useAuth();

  useEffect(() => {
    if (!email) {
      navigation.navigate('Login');
    }
  }, [email]);

  const handleChange = (text, index) => {
    if (isNaN(text)) return;
    
    const newOtp = [...otp];
    newOtp[index] = text.substring(text.length - 1);
    setOtp(newOtp);

    // Auto focus next or previous
    if (text && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = async () => {
    const otpValue = otp.join('');
    if (otpValue.length < 4) {
      setError('Please enter all 4 digits');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await verifyOtp(email, otpValue);
      if (res.success) {
        navigation.navigate('Login', { verified: true });
      } else {
        setError(res.error || 'Verification failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      const res = await sendOtp(email);
      if (res.success) {
        setOtp(['', '', '', '']);
        inputRefs[0].current.focus();
      } else {
        setError(res.error || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.glassCard}>
          <View style={styles.iconWrapper}>
            <ShieldCheck color={COLORS.accent} size={32} />
          </View>

          <Text style={styles.title}>Verify <Text style={{ color: COLORS.accent }}>Email</Text></Text>
          <Text style={styles.subtitle}>
            Enter the 4-digit code sent to {'\n'}
            <Text style={styles.emailText}>{email}</Text>
          </Text>

          {error ? (
            <View style={styles.errorBox}>
              <AlertCircle color={COLORS.error} size={18} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputRefs[index]}
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                autoFocus={index === 0}
              />
            ))}
          </View>

          <TouchableOpacity 
            style={[styles.premiumBtn, loading && styles.btnDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.primary} />
            ) : (
              <View style={styles.btnRow}>
                <Text style={styles.premiumBtnText}>Verify Account</Text>
                <ArrowRight color={COLORS.primary} size={18} />
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Didn't receive the code? </Text>
            <TouchableOpacity onPress={handleResend} disabled={resending}>
              <View style={styles.resendRow}>
                <RefreshCw color={COLORS.accent} size={14} style={{ marginRight: 4 }} />
                <Text style={styles.resendText}>{resending ? 'Resending...' : 'Resend OTP'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgMain, justifyContent: 'center' },
  content: { padding: SPACING.lg },
  glassCard: {
    backgroundColor: 'rgba(26, 28, 61, 0.4)',
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    alignItems: 'center',
    ...SHADOW,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: { fontSize: 32, fontWeight: '800', color: COLORS.textMain, textAlign: 'center', marginBottom: SPACING.xs },
  subtitle: { fontSize: 16, color: COLORS.textMuted, textAlign: 'center', marginBottom: SPACING.xl, lineHeight: 22 },
  emailText: { color: COLORS.white, fontWeight: '700' },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.error,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.xl,
    width: '100%',
  },
  errorText: { color: COLORS.error, marginLeft: SPACING.sm, fontSize: 14 },
  otpContainer: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: SPACING.xl },
  otpInput: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: RADIUS.md,
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
  },
  premiumBtn: {
    backgroundColor: COLORS.accent,
    height: 56,
    width: '100%',
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW,
  },
  btnDisabled: { opacity: 0.7 },
  btnRow: { flexDirection: 'row', alignItems: 'center' },
  premiumBtnText: { color: COLORS.primary, fontSize: 16, fontWeight: '700', marginRight: 8 },
  footer: { marginTop: SPACING.xl },
  footerText: { color: COLORS.textMuted, fontSize: 14, textAlign: 'center' },
  resendRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  resendText: { color: COLORS.accent, fontSize: 14, fontWeight: '700' },
});

export default OTPVerificationScreen;
