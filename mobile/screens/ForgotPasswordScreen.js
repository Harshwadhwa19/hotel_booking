import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, ChevronLeft, AlertCircle } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOW } from '../utils/theme';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }
    setLoading(true);
    setError('');
    // Mocking success as the user only asked for strict UI and functional flow for main auth
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color={COLORS.textMain} size={24} />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.glassCard}>
            <Text style={styles.title}>Forgot <Text style={{ color: COLORS.accent }}>Password?</Text></Text>
            <Text style={styles.subtitle}>Enter your email to receive a password reset link.</Text>

            {success ? (
              <View style={styles.successBox}>
                <Text style={styles.successText}>Reset link sent! Please check your email.</Text>
                <TouchableOpacity style={styles.premiumBtn} onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.premiumBtnText}>Back to Login</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {error ? (
                  <View style={styles.errorBox}>
                    <AlertCircle color={COLORS.error} size={18} />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email Address</Text>
                  <View style={styles.inputWrapper}>
                    <Mail color={COLORS.textMuted} size={20} style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      placeholder="you@example.com"
                      placeholderTextColor={COLORS.textMuted}
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </View>
                </View>

                <TouchableOpacity 
                  style={[styles.premiumBtn, loading && styles.btnDisabled]} 
                  onPress={handleReset}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={COLORS.primary} />
                  ) : (
                    <Text style={styles.premiumBtnText}>Send Reset Link</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgMain },
  backBtn: { marginTop: 20, marginLeft: 20, padding: 10 },
  content: { flex: 1, justifyContent: 'center', padding: SPACING.lg },
  glassCard: {
    backgroundColor: 'rgba(26, 28, 61, 0.4)',
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    ...SHADOW,
  },
  title: { fontSize: 32, fontWeight: '800', color: COLORS.textMain, textAlign: 'center', marginBottom: SPACING.xs },
  subtitle: { fontSize: 16, color: COLORS.textMuted, textAlign: 'center', marginBottom: SPACING.xl, lineHeight: 22 },
  inputGroup: { marginBottom: SPACING.xl },
  label: { color: COLORS.textMuted, marginBottom: SPACING.sm, fontSize: 14 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: RADIUS.md,
    height: 52,
    paddingHorizontal: 12,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, color: COLORS.white, fontSize: 16 },
  premiumBtn: {
    backgroundColor: COLORS.accent,
    height: 56,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW,
  },
  btnDisabled: { opacity: 0.7 },
  premiumBtnText: { color: COLORS.primary, fontSize: 16, fontWeight: '700' },
  successBox: { alignItems: 'center' },
  successText: { color: COLORS.success, fontSize: 16, textAlign: 'center', marginBottom: SPACING.xl, fontWeight: '600' },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.error,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.md,
  },
  errorText: { color: COLORS.error, marginLeft: SPACING.sm, fontSize: 14, flex: 1 },
});

export default ForgotPasswordScreen;
