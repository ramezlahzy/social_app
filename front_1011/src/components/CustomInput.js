import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

export default ({
  label,
  placeholder,
  onChange,
  defvalue,
  multi = false,
  lineCount = 4,
  disabled = false
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={{
          ...styles.input,
        }}
        defaultValue={defvalue}
        placeholder={placeholder}
        multiline={multi}
        numberOfLines={multi ? lineCount : 1}
        onChangeText={text => onChange(text)}
        editable={!disabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between'
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18.4,
    color: '#4388CC',
    fontFamily: 'ArialBold',
    height: 20,
    width: 125,
    textAlign: 'right',
    paddingRight: 30,
  },
  input: {
    fontFamily: 'ArialBold',
    borderWidth: 2,
    paddingHorizontal: 8,
    fontWeight: '700',
    lineHeight: 18.4,
    borderColor: "#4388CC",
    color: '#4388CC',
    width: 220,
    fontSize: 16,
    height: 20,
  },
});
