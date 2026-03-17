import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, User, Phone, AlertCircle, Check } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOW } from '../utils/theme';
import { useAuth } from '../context/AuthContext';

const SignupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async () => {
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.acceptTerms) {
      setError('You must accept the terms and conditions');
      return;
    }

    setLoading(true);
    try {
      const res = await register(formData.name, formData.email, formData.password, formData.phone);
      if (res.success) {
        navigation.navigate('OTPVerification', { email: formData.email });
      } else {
        setError(res.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, icon, name, placeholder, isPassword = false, keyboardType = 'default') => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry={isPassword}
          keyboardType={keyboardType}
          value={formData[name]}
          onChangeText={(text) => handleChange(name, text)}
          autoCapitalize="none"
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.glassCard}>
            <Text style={styles.title}>
              Create <Text style={{ color: COLORS.accent }}>Account</Text>
            </Text>
            <Text style={styles.subtitle}>Join the Grand Hotel family</Text>

            {error ? (
              <View style={styles.errorBox}>
                <AlertCircle color={COLORS.error} size={18} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {renderInput('Full Name', <User color={COLORS.textMuted} size={20} />, 'name', 'John Doe')}
            {renderInput('Email Address', <Mail color={COLORS.textMuted} size={20} />, 'email', 'you@example.com', false, 'email-address')}
            {renderInput('Phone Number', <Phone color={COLORS.textMuted} size={20} />, 'phone', '+1 234 567 890', false, 'phone-pad')}
            {renderInput('Password', <Lock color={COLORS.textMuted} size={20} />, 'password', '••••••••', true)}
            {renderInput('Confirm Password', <Lock color={COLORS.textMuted} size={20} />, 'confirmPassword', '••••••••', true)}

            <TouchableOpacity 
              style={styles.checkboxContainer} 
              onPress={() => handleChange('acceptTerms', !formData.acceptTerms)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, formData.acceptTerms && styles.checkboxActive]}>
                {formData.acceptTerms && <Check color={COLORS.primary} size={14} strokeWidth={3} />}
              </View>
              <Text style={styles.checkboxLabel}>
                I accept the <Text style={{ color: COLORS.accent }}>Terms and Conditions</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.premiumBtn, loading && styles.btnDisabled]} 
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.primary} />
              ) : (
                <Text style={styles.premiumBtnText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgMain },
  scrollContent: { padding: SPACING.lg, justifyContent: 'center', minHeight: '100%' },
  glassCard: {
    backgroundColor: 'rgba(26, 28, 61, 0.4)', // Slightly transparent
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    ...SHADOW,
  },
  title: { fontSize: 32, fontWeight: '800', color: COLORS.textMain, textAlign: 'center', marginBottom: SPACING.xs },
  subtitle: { fontSize: 16, color: COLORS.textMuted, textAlign: 'center', marginBottom: SPACING.xl },
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
  inputGroup: { marginBottom: SPACING.md },
  label: { color: COLORS.textMuted, marginBottom: SPACING.sm, fontSize: 14 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: RADIUS.md,
    height: 52,
  },
  iconContainer: { paddingLeft: 12, paddingRight: 8 },
  input: { flex: 1, color: COLORS.white, fontSize: 16, paddingRight: 12 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xl, marginTop: SPACING.sm },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    backgroundColor: COLORS.glass,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  checkboxLabel: { color: COLORS.textMuted, fontSize: 14 },
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
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.xl },
  footerText: { color: COLORS.textMuted, fontSize: 14 },
  footerLink: { color: COLORS.accent, fontSize: 14, fontWeight: '700' },
});

export default SignupScreen;
