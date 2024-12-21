import React from 'react';
import { View } from 'react-native';
import { Chase } from 'react-native-animated-spinkit';
import { Colors } from '@/constants/Colors';

export const LoadingSpinner: React.FC = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Chase size={48} color={Colors.dark.secondary} />
  </View>
); 