import { COLOR } from '@/src/constants/colors';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

interface SidebarHomeViewProps {
  onClose: () => void;
}

export const SidebarHomeView: React.FC<SidebarHomeViewProps> = ({ onClose }) => {
  const router = useRouter();

  const handleGoToHome = () => {
    onClose(); // Cerrar sidebar
    router.push('/(tabs)'); // Navegar al home real
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>REDIRECCIONA AL HOME</Text>
      
      <TouchableOpacity 
        style={styles.homeButton}
        onPress={handleGoToHome}
      >
        <Text style={styles.homeButtonText}>Ir al home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(24),
    backgroundColor: COLOR.background,
  },
  message: {
    color: COLOR.textPrimary,
    fontSize: moderateScale(16),
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: verticalScale(32),
  },
  homeButton: {
    backgroundColor: COLOR.primary,
    paddingHorizontal: moderateScale(32),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(8),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  homeButtonText: {
    color: COLOR.textPrimary,
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});