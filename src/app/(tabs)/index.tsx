import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

const Index = () => {
  const [name, setName] = useState("");
  return (
    <View>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        style={{
          borderBottomWidth: 1,
          marginBottom: 10,
        }}
      />
      <Text>Hola, {name}</Text>
    </View>
  );
};

export default Index;