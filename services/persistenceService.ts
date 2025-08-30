// services/persistenceService.ts
type Listener = (isDirty: boolean) => void;

class PersistenceService {
  private _isDirty = false;
  private _isSeeded = false;
  private listeners: Set<Listener> = new Set();
  
  /**
   * isDirty is true only if changes have been made in-memory AND the database
   * has not yet been seeded. This is used to warn the user about losing data.
   */
  get isDirty() {
    return this._isDirty && !this._isSeeded;
  }
  
  /**
   * A simple getter to check if the database has been seeded.
   */
  get isSeeded() {
      return this._isSeeded;
  }

  /**
   * Marks that an in-memory write has occurred.
   */
  markDirty() {
    if (!this._isDirty) {
      this._isDirty = true;
      this.notify();
    }
  }
  
  /**
   * Marks that the database has been successfully seeded.
   * This means any subsequent changes will be hitting a real DB, or if not,
   * the user has at least acknowledged the persistence step, so we can stop warning them.
   */
  markSeeded() {
    if (!this._isSeeded) {
        this._isSeeded = true;
        this.notify();
    }
  }

  /**
   * Subscribes a listener to state changes.
   * @param listener The callback to execute when state changes.
   * @returns An unsubscribe function.
   */
  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.isDirty));
  }
}

export const persistenceService = new PersistenceService();
