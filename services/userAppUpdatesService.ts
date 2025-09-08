// services/userAppUpdatesService.ts

/**
 * User action logging functionality has been removed as per user request.
 * The functions are now no-ops to prevent breaking any remaining calls.
 */
const logAction = (type: string, payload: any): void => {
  // This function is intentionally empty.
};

const syncActions = async (userId: string): Promise<void> => {
  // This function is intentionally empty.
  return Promise.resolve();
};

export const userAppUpdatesService = {
  logAction,
  syncActions,
};
