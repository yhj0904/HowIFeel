import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default function Diary({ date }) {
  const [diaryText, setDiaryText] = useState('');

  const handleSavePress = () => {
    console.log(`Saved diary entry for ${date}: ${diaryText}`);
    setDiaryText('');
  };

  return (
    <View>
      <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold' }}>
        Diary Entry for {date}
      </Text>
      <TextInput
        value={diaryText}
        onChangeText={setDiaryText}
        placeholder="Write about your day..."
        style={{ margin: 10, padding: 10, borderColor: 'gray', borderWidth: 1 }}
        multiline
      />
      <Button title="Save" onPress={handleSavePress} />
    </View>
  );
}