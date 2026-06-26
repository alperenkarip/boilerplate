// Shared port primitives — SDK-free (ADR-020 Section 14).
// Platform-agnostic types with no Firebase SDK dependency.

/**
 * Teardown handle returned by subscription/listener methods.
 * Calling it detaches the underlying realtime listener (e.g. Firestore onSnapshot)
 * or auth-state listener. Adapters MUST make this idempotent.
 */
export type Unsubscribe = () => void;
