import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Spacing, BorderRadius } from '../../constants/theme';
import { addWordToSet } from '../../store/customVocab';

export default function AddWordScreen() {
  const { setId } = useLocalSearchParams<{ setId: string }>();
  const router = useRouter();
  const [german, setGerman] = useState('');
  const [english, setEnglish] = useState('');
  const [example, setExample] = useState('');
  const [phonetic, setPhonetic] = useState('');
  const [addedCount, setAddedCount] = useState(0);

  const handleAdd = async () => {
    if (!german.trim() || !english.trim()) {
      Alert.alert('Missing fields', 'German word and English translation are required.');
      return;
    }

    if (!setId) return;

    await addWordToSet(setId, {
      german: german.trim(),
      english: english.trim(),
      example: example.trim(),
      phonetic: phonetic.trim() || undefined,
    });

    setAddedCount((c) => c + 1);
    setGerman('');
    setEnglish('');
    setExample('');
    setPhonetic('');
  };

  const handleDone = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {addedCount > 0 && (
          <View style={styles.addedBanner}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
            <Text style={styles.addedText}>
              {addedCount} word{addedCount !== 1 ? 's' : ''} added
            </Text>
          </View>
        )}

        <Text style={styles.label}>German Word / Phrase *</Text>
        <TextInput
          style={styles.input}
          value={german}
          onChangeText={setGerman}
          placeholder="e.g. der Tisch"
          placeholderTextColor={Colors.textMuted}
          autoFocus
        />

        <Text style={styles.label}>English Translation *</Text>
        <TextInput
          style={styles.input}
          value={english}
          onChangeText={setEnglish}
          placeholder="e.g. the table"
          placeholderTextColor={Colors.textMuted}
        />

        <Text style={styles.label}>Example Sentence</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={example}
          onChangeText={setExample}
          placeholder="e.g. Der Tisch ist groß."
          placeholderTextColor={Colors.textMuted}
          multiline
          numberOfLines={2}
        />

        <Text style={styles.label}>Pronunciation Hint</Text>
        <TextInput
          style={styles.input}
          value={phonetic}
          onChangeText={setPhonetic}
          placeholder="e.g. dare TISH"
          placeholderTextColor={Colors.textMuted}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.addButton, (!german.trim() || !english.trim()) && styles.buttonDisabled]}
            onPress={handleAdd}
            disabled={!german.trim() || !english.trim()}
          >
            <Ionicons name="add" size={22} color={Colors.text} />
            <Text style={styles.buttonText}>Add Word</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  addedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.success + '15',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  addedText: {
    fontSize: FontSize.sm,
    color: Colors.success,
    fontWeight: '600',
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  multiline: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  addButton: {
    flex: 1,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  doneButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
  },
  doneText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
