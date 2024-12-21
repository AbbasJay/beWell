import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ErrorMessageProps {
  error: Error | null;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => (
  <View style={styles.container}>
    <Text style={styles.text}>Error: {error?.message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    color: 'red',
    textAlign: 'center',
  },
}); 