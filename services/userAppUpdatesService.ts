
import { supabase } from './supabaseClient';
import { Json } from './supabase';

interface UserAction {
  type: string;
  payload: any;
  timestamp: string;
}

// In-memory log for the current session's actions
let actionsLog: UserAction[] = [];

/**
 * Logs a user action to the in-memory store.
 * @param type A string identifier for the action (e.g., 'FOLLOW_USER').
 * @param payload The data associated with the action.
 */
const logAction = (type: string, payload: any): void => {
  const action: UserAction = {
    type,
    payload,
    timestamp: new Date().toISOString(),
  };
  actionsLog.push(action);
  // console.log('Action Logged:', action);
};

/**
 * Retrieves a copy of the current actions log.
 * @returns An array of UserAction objects.
 */
const getActions = (): UserAction[] => {
  return [...actionsLog];
};

/**
 * Clears the in-memory actions log.
 */
const clearActions = (): void => {
  actionsLog = [];
};

/**
 * Syncs the accumulated actions to the 'user_actions_log' table in the database.
 * This should be called before the user logs out.
 * @param userId The ID of the user whose actions are being synced.
 */
const syncActions = async (userId: string): Promise<void> => {
  if (actionsLog.length === 0) {
    return;
  }

  const actionsToSync = getActions().map(action => ({
    user_id: userId,
    action_type: action.type,
    payload: action.payload as Json,
    timestamp: action.timestamp,
  }));
  
  // console.log(`Syncing ${actionsToSync.length} actions for user ${userId}...`);

  // Using a 'background service' approach as requested, by performing this on logout.
  // In a real-world scenario with service workers, this could be more robust.
  const { error } = await supabase.from('app_e255c3cdb5_user_actions_log').insert(actionsToSync);

  if (error) {
    console.error('Failed to sync user actions as a background service on logout:', error);
    // If sync fails, actions are not cleared and will be present for a potential next sync attempt.
  } else {
    // console.log('Successfully synced user actions.');
    clearActions();
  }
};

export const userAppUpdatesService = {
  logAction,
  syncActions,
};
