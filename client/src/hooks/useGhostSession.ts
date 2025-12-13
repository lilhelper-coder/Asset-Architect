import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseAvailable } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface GhostSession {
  id: string;
  senior_id: string | null;
  status: string;
  last_transcript: string | null;
  current_view: string | null;
}

interface UseGhostSessionOptions {
  roomId: string;
  role: 'senior' | 'helper';
  onTranscriptUpdate?: (transcript: string) => void;
  onViewChange?: (view: string) => void;
}

interface UseGhostSessionReturn {
  session: GhostSession | null;
  isConnected: boolean;
  error: string | null;
  updateTranscript: (transcript: string) => Promise<void>;
  updateView: (view: string) => Promise<void>;
}

/**
 * useGhostSession - Realtime synchronization between Senior and Helper
 * 
 * The "Senior" uses the app normally, and a "Helper" (family member)
 * can watch in real-time what they're saying and which page they're on.
 * 
 * Usage:
 * ```tsx
 * const { session, updateTranscript } = useGhostSession({ 
 *   roomId: 'unique-session-id',
 *   role: 'senior' 
 * });
 * ```
 */
export function useGhostSession({
  roomId,
  role,
  onTranscriptUpdate,
  onViewChange,
}: UseGhostSessionOptions): UseGhostSessionReturn {
  const [session, setSession] = useState<GhostSession | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  // Initialize session and subscribe to changes
  useEffect(() => {
    if (!isSupabaseAvailable()) {
      setError('Supabase is not configured. Ghost Mode unavailable.');
      return;
    }

    if (!supabase) return;

    // Fetch existing session or create new one
    const initSession = async () => {
      try {
        if (!supabase) {
          throw new Error('Supabase client not initialized');
        }

        const { data, error: fetchError } = await supabase
          .from('sessions')
          .select('*')
          .eq('id', roomId)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          // PGRST116 = not found, which is okay (we'll create)
          throw fetchError;
        }

        if (data) {
          setSession(data);
        } else if (role === 'senior') {
          // Only senior creates the session
          const { data: newSession, error: insertError } = await supabase
            .from('sessions')
            .insert({
              id: roomId,
              status: 'active',
              last_transcript: null,
              current_view: '/',
            })
            .select()
            .single();

          if (insertError) throw insertError;
          setSession(newSession);
        }

        setIsConnected(true);
      } catch (err) {
        console.error('Ghost session init error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize session');
      }
    };

    initSession();

    // Subscribe to realtime changes
    if (!supabase) return;

    const realtimeChannel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          const updatedSession = payload.new as GhostSession;
          setSession(updatedSession);

          // Trigger callbacks based on what changed
          if (role === 'helper') {
            if (updatedSession.last_transcript && onTranscriptUpdate) {
              onTranscriptUpdate(updatedSession.last_transcript);
            }
            if (updatedSession.current_view && onViewChange) {
              onViewChange(updatedSession.current_view);
            }
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setIsConnected(false);
          setError('Realtime connection failed');
        }
      });

    setChannel(realtimeChannel);

    return () => {
      realtimeChannel.unsubscribe();
    };
  }, [roomId, role, onTranscriptUpdate, onViewChange]);

  // Update transcript (called by Senior)
  const updateTranscript = useCallback(
    async (transcript: string) => {
      if (!supabase || !session) return;

      try {
        const { error: updateError } = await supabase
          .from('sessions')
          .update({ last_transcript: transcript, updated_at: new Date().toISOString() })
          .eq('id', roomId);

        if (updateError) throw updateError;
      } catch (err) {
        console.error('Failed to update transcript:', err);
        setError(err instanceof Error ? err.message : 'Update failed');
      }
    },
    [roomId, session]
  );

  // Update current view (called by Senior)
  const updateView = useCallback(
    async (view: string) => {
      if (!supabase || !session) return;

      try {
        const { error: updateError } = await supabase
          .from('sessions')
          .update({ current_view: view, updated_at: new Date().toISOString() })
          .eq('id', roomId);

        if (updateError) throw updateError;
      } catch (err) {
        console.error('Failed to update view:', err);
        setError(err instanceof Error ? err.message : 'Update failed');
      }
    },
    [roomId, session]
  );

  return {
    session,
    isConnected,
    error,
    updateTranscript,
    updateView,
  };
}

