// app/(tabs)/core.tsx
import { useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { apolloApi, ApolloStatus, AudioCommandResponse } from '../../lib/apolloCoreApi';
import {
  useThemeColors,
  ThemeColors,
  spacing,
  radii,
  typography,
} from '../../constants/theme';
import { PulsingCard } from '../../components/ui/pulsing-card';
import { HapticButton } from '../../components/ui/haptic-button';
import { ShimmerText } from '../../components/ui/shimmer-text';
import { AnimatedGradient } from '../../components/ui/animated-gradient';
import { VoiceWave } from '../../components/ui/voice-wave';

export default function CoreScreen() {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [status, setStatus] = useState<ApolloStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const [lastTranscription, setLastTranscription] = useState<string | null>(null);
  const recordingRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  async function refresh() {
    try {
      setError(null);
      setLoading(true);
      const s = await apolloApi.getApolloStatus();
      setStatus(s);
    } catch (err: any) {
      setError(err.message ?? 'Failed to load status.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function startAudioRecording(): Promise<string | null> {
    try {
      // For web platform
      if (Platform.OS === 'web') {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus',
        });
        
        audioChunksRef.current = [];
        recordingRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        return new Promise((resolve, reject) => {
          mediaRecorder.onstop = async () => {
            stream.getTracks().forEach(track => track.stop());
            
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            
            // Convert to WAV format (simplified - in production, use a proper converter)
            // For now, we'll send as webm and let the server handle it
            const audioUrl = URL.createObjectURL(audioBlob);
            resolve(audioUrl);
          };

          mediaRecorder.onerror = (event) => {
            reject(new Error('Recording error'));
          };

          mediaRecorder.start();
        });
      } else {
        // For native platforms (iOS/Android), we'd use expo-av
        // For now, show an alert that native recording needs expo-av
        Alert.alert(
          'Audio Recording',
          'Native audio recording requires expo-av. Please install it: npx expo install expo-av'
        );
        return null;
      }
    } catch (err: any) {
      throw new Error(`Failed to start recording: ${err.message}`);
    }
  }

  async function convertWebMToWAV(webmBlob: Blob): Promise<Blob> {
    // Convert WebM to WAV using Web Audio API
    const arrayBuffer = await webmBlob.arrayBuffer();
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    // Resample to 16kHz and convert to mono
    const targetSampleRate = 16000;
    const sourceSampleRate = audioBuffer.sampleRate;
    const ratio = sourceSampleRate / targetSampleRate;
    const length = Math.floor(audioBuffer.length / ratio);
    
    // Create mono channel
    const monoData = new Float32Array(length);
    for (let i = 0; i < length; i++) {
      const srcIndex = Math.floor(i * ratio);
      // Mix all channels to mono
      let sum = 0;
      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        sum += audioBuffer.getChannelData(channel)[srcIndex];
      }
      monoData[i] = sum / audioBuffer.numberOfChannels;
    }
    
    // Convert to 16-bit PCM
    const pcmData = new Int16Array(length);
    for (let i = 0; i < length; i++) {
      const s = Math.max(-1, Math.min(1, monoData[i]));
      pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    
    // Create WAV file
    const wavBuffer = new ArrayBuffer(44 + pcmData.length * 2);
    const view = new DataView(wavBuffer);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + pcmData.length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true); // fmt chunk size
    view.setUint16(20, 1, true); // audio format (PCM)
    view.setUint16(22, 1, true); // channels (mono)
    view.setUint32(24, targetSampleRate, true); // sample rate
    view.setUint32(28, targetSampleRate * 2, true); // byte rate
    view.setUint16(32, 2, true); // block align
    view.setUint16(34, 16, true); // bits per sample
    writeString(36, 'data');
    view.setUint32(40, pcmData.length * 2, true);
    
    // Write PCM data
    const pcmView = new Int16Array(wavBuffer, 44);
    pcmView.set(pcmData);
    
    return new Blob([wavBuffer], { type: 'audio/wav' });
  }

  async function stopAudioRecording(): Promise<string | null> {
    if (Platform.OS === 'web' && recordingRef.current) {
      recordingRef.current.stop();
      recordingRef.current = null;
      
      // Wait a bit for the blob to be created
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const webmBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Convert WebM to WAV
      try {
        const wavBlob = await convertWebMToWAV(webmBlob);
        const audioUrl = URL.createObjectURL(wavBlob);
        return audioUrl;
      } catch (err: any) {
        console.error('Error converting audio:', err);
        // Fallback: try sending WebM anyway
        const audioUrl = URL.createObjectURL(webmBlob);
        return audioUrl;
      }
    }
    return null;
  }

  async function onSpeak() {
    // If already recording, stop and send
    if (isRecording) {
      await stopRecordingAndSend();
      return;
    }

    // If listening but not recording yet, start recording
    if (isListening && !isRecording) {
      try {
        setIsRecording(true);
        await startAudioRecording();
      } catch (err: any) {
        setError(err.message ?? 'Failed to start recording.');
        setIsListening(false);
        setIsRecording(false);
        setIsProcessing(false);
        setMutating(false);
      }
      return;
    }

    // Start new voice interaction
    try {
      setMutating(true);
      setError(null);
      setIsListening(true);
      setIsRecording(false);
      setLastResponse(null);
      setLastTranscription(null);

      // First, trigger the "How can I help you" acknowledgment
      await apolloApi.speakAcknowledgment();

      // Wait a moment for TTS to start, then start recording
      await new Promise(resolve => setTimeout(resolve, 500));

      setIsRecording(true);
      await startAudioRecording();

    } catch (err: any) {
      setError(err.message ?? 'Failed to activate voice input.');
      setIsListening(false);
      setIsRecording(false);
      setIsProcessing(false);
      setMutating(false);
    }
  }

  async function stopRecordingAndSend() {
    try {
      setIsRecording(false);
      setIsProcessing(true);
      setMutating(true);
      setError(null);
      
      const audioUri = await stopAudioRecording();
      
      if (!audioUri) {
        throw new Error('No audio recorded');
      }

      // Send audio to Apollo Core
      const response: AudioCommandResponse = await apolloApi.sendAudioCommand(audioUri, true);
      
      setLastTranscription(response.transcription);
      setLastResponse(response.response);
      
      // Clean up
      if (Platform.OS === 'web' && audioUri.startsWith('blob:')) {
        URL.revokeObjectURL(audioUri);
      }

      // Refresh status
      await refresh();
      
    } catch (err: any) {
      setError(err.message ?? 'Failed to process audio.');
    } finally {
      setIsListening(false);
      setIsRecording(false);
      setIsProcessing(false);
      setMutating(false);
    }
  }

  return (
    <AnimatedGradient>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.root}>
          <Pressable onPress={() => router.push('/')} style={styles.homeButton}>
            <Ionicons name="home" size={24} color={colors.accent} />
          </Pressable>
          <ShimmerText style={styles.heading}>Apollo Core</ShimmerText>
          <Text style={styles.subheading}>
            Jetson Nano voice assistant, powered by local Apollo AI.
          </Text>

          {/* Voice Wave Visualization */}
          <View style={styles.waveContainer}>
            <VoiceWave isActive={!loading && (isListening || isRecording || isProcessing)} size={100} />
          </View>

          <PulsingCard 
            style={styles.card}
            pulseOnMount={!loading && (isListening || isRecording || isProcessing)}
            intensity={1.02}
          >
            <Text style={styles.cardTitle}>Voice Capture</Text>
            <Text style={styles.cardSubtitle}>
              Toggle whether Apollo Core is listening.
            </Text>

            {loading ? (
              <View style={styles.centerRow}>
                <ActivityIndicator color={colors.accentSoft} />
                <Text style={styles.loadingText}>Connecting…</Text>
              </View>
            ) : (
              <>
                <View style={styles.statusRow}>
                  <View
                    style={[
                      styles.statusPill,
                      isListening ? styles.statusActive : styles.statusMuted,
                    ]}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        isListening ? styles.dotActive : styles.dotMuted,
                      ]}
                    />
                    <Text style={styles.statusText}>
                      {isProcessing ? 'Processing' : isRecording ? 'Recording' : isListening ? 'Listening' : 'Ready'}
                    </Text>
                  </View>
                  <Text style={styles.statusHint}>
                    {isProcessing
                      ? 'Processing your command...'
                      : isRecording
                      ? 'Recording your voice... Click Stop when done.'
                      : isListening
                      ? 'Press Start Recording to begin, or click Speak again to cancel.'
                      : 'Press Speak to activate voice input.'}
                  </Text>
                </View>

                <HapticButton
                  onPress={onSpeak}
                  variant="primary"
                  disabled={isProcessing || (mutating && !isRecording)}
                  style={styles.toggleButton}
                  hapticStyle="medium"
                >
                  <View style={styles.buttonContent}>
                    {isProcessing ? (
                      <ActivityIndicator 
                        size="small" 
                        color={colors.background} 
                        style={styles.buttonIcon}
                      />
                    ) : (
                      <Ionicons
                        name={isRecording ? "stop-outline" : "mic-outline"}
                        size={24}
                        color={colors.background}
                        style={styles.buttonIcon}
                      />
                    )}
                    <Text
                      style={[
                        styles.toggleButtonText,
                        { color: colors.background },
                      ]}
                    >
                      {isProcessing 
                        ? 'Processing...' 
                        : isRecording 
                        ? 'Stop Recording' 
                        : isListening 
                        ? 'Start Recording' 
                        : 'Speak'}
                    </Text>
                  </View>
                </HapticButton>

                {mutating && !isRecording && !isProcessing && (
                  <Text style={styles.mutatingText}>Activating voice input…</Text>
                )}

                {lastTranscription && (
                  <View style={styles.responseCard}>
                    <Text style={styles.responseLabel}>You said:</Text>
                    <Text style={styles.responseText}>{lastTranscription}</Text>
                  </View>
                )}

                {lastResponse && (
                  <View style={styles.responseCard}>
                    <Text style={styles.responseLabel}>Apollo:</Text>
                    <Text style={styles.responseText}>{lastResponse}</Text>
                  </View>
                )}
              </>
            )}
          </PulsingCard>

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      </ScrollView>
    </AnimatedGradient>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      backgroundColor: colors.background,
    },
    root: {
      flex: 1,
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.xl,
      paddingBottom: spacing.xxl,
    },
    homeButton: {
      alignSelf: 'flex-start',
      padding: spacing.sm,
      marginBottom: spacing.md,
      borderRadius: radii.md,
      backgroundColor: colors.surfaceCard,
      borderWidth: 1,
      borderColor: colors.borderSubtle,
    },
    heading: {
      fontSize: typography.displayM.fontSize,
      fontWeight: '700',
      marginBottom: spacing.xs,
      textAlign: 'center',
    },
    subheading: {
      color: colors.textSecondary,
      fontSize: typography.bodyBase.fontSize,
      marginBottom: spacing.xl,
      textAlign: 'center',
    },
    waveContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.xl,
      paddingVertical: spacing.lg,
    },
    card: {
      marginBottom: spacing.lg,
    },
    cardTitle: {
      color: colors.textPrimary,
      fontSize: typography.bodyL.fontSize,
      fontWeight: '600',
      marginBottom: spacing.xs,
    },
    cardSubtitle: {
      color: colors.textSecondary,
      fontSize: typography.bodyS.fontSize,
      marginBottom: spacing.lg,
    },
    centerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      columnGap: spacing.sm,
    },
    loadingText: {
      color: colors.textSecondary,
      fontSize: typography.bodyBase.fontSize,
      marginLeft: spacing.sm,
    },
    statusRow: {
      marginBottom: spacing.lg,
    },
    statusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      borderRadius: radii.pill,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.sm,
    },
    statusMuted: {
      backgroundColor: 'rgba(248,113,113,0.12)',
    },
    statusActive: {
      backgroundColor: colors.accentMuted,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 999,
      marginRight: spacing.sm,
    },
    dotMuted: {
      backgroundColor: colors.danger,
    },
    dotActive: {
      backgroundColor: colors.accentSoft,
    },
    statusText: {
      color: colors.textPrimary,
      fontSize: typography.bodyS.fontSize,
      fontWeight: '600',
    },
    statusHint: {
      color: colors.textSecondary,
      fontSize: typography.meta.fontSize,
    },
    toggleButton: {
      width: '100%',
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonIcon: {
      marginRight: spacing.sm,
    },
    toggleButtonText: {
      fontSize: typography.button.fontSize,
      fontWeight: '600',
    },
    mutatingText: {
      color: colors.textSecondary,
      fontSize: typography.bodyS.fontSize,
      textAlign: 'center',
      marginTop: spacing.md,
    },
    errorText: {
      color: colors.danger,
      fontSize: typography.bodyBase.fontSize,
      marginTop: spacing.lg,
      textAlign: 'center',
    },
    responseCard: {
      marginTop: spacing.md,
      padding: spacing.md,
      borderRadius: radii.md,
      backgroundColor: colors.surfaceCard,
      borderWidth: 1,
      borderColor: colors.borderSubtle,
    },
    responseLabel: {
      color: colors.textSecondary,
      fontSize: typography.bodyS.fontSize,
      fontWeight: '600',
      marginBottom: spacing.xs,
    },
    responseText: {
      color: colors.textPrimary,
      fontSize: typography.bodyBase.fontSize,
    },
  });
