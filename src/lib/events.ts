import { useEffect, useRef } from 'react';
import type { VideoData } from './api.types.gen';

// General Event Map type mapping event names to their payload types
export type EventMap = Record<string, any>;
export type EventKey<T extends EventMap> = string & keyof T;
export type EventReceiver<T> = (params: T) => void;

/**
 * A type-safe Event Emitter.
 */
export class EventEmitter<T extends EventMap> {
  private listeners: {
    [K in EventKey<T>]?: Set<EventReceiver<T[K]>>;
  } = {};

  /**
   * Subscribe to an event
   */
  on<K extends EventKey<T>>(eventName: K, listener: EventReceiver<T[K]>): () => void {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = new Set();
    }
    this.listeners[eventName]!.add(listener);

    // Return an unsubscribe function
    return () => this.off(eventName, listener);
  }

  /**
   * Unsubscribe from an event
   */
  off<K extends EventKey<T>>(eventName: K, listener: EventReceiver<T[K]>): void {
    this.listeners[eventName]?.delete(listener);
    if (this.listeners[eventName]?.size === 0) {
      delete this.listeners[eventName];
    }
  }

  /**
   * Emit an event
   */
  emit<K extends EventKey<T>>(
    eventName: K,
    ...args: undefined extends T[K] ? [payload?: T[K]] : [payload: T[K]]
  ): void {
    const payload = args[0] as T[K];
    this.listeners[eventName]?.forEach((listener) => {
      try {
        listener(payload);
      } catch (err) {
        console.error(`Error in event listener for ${eventName}:`, err);
      }
    });
  }

  /**
   * Clear all listeners for a specific event or all events
   */
  clear<K extends EventKey<T>>(eventName?: K): void {
    if (eventName) {
      delete this.listeners[eventName];
    } else {
      this.listeners = {};
    }
  }
}

/**
 * Define your application-wide events here.
 * Example:
 * export type AppEventMap = {
 *   'video:created': { id: string; title: string };
 *   'video:deleted': { id: string };
 *   'sidebar:toggle': undefined;
 * };
 */
export type AppEventMap = {
  // Add your application events here
  'history:update': { history: VideoData[] };
};

// Global application event emitter instance
export const appEvents = new EventEmitter<AppEventMap>();

/**
 * Hook to subscribe to an event on any EventEmitter instance.
 */
export function useEventEmitter<T extends EventMap, K extends EventKey<T>>(
  emitter: EventEmitter<T>,
  eventName: K,
  listener: EventReceiver<T[K]>
): void {
  // Use a ref for the listener to avoid unnecessary re-subscriptions 
  // if the listener is passed as an inline/anonymous function
  const listenerRef = useRef(listener);

  useEffect(() => {
    listenerRef.current = listener;
  }, [listener]);

  useEffect(() => {
    const callback = (params: T[K]) => {
      listenerRef.current(params);
    };

    return emitter.on(eventName, callback);
  }, [emitter, eventName]);
}

/**
 * Hook to subscribe to the global application event emitter.
 */
export function useEvent<K extends EventKey<AppEventMap>>(
  eventName: K,
  listener: EventReceiver<AppEventMap[K]>
): void {
  useEventEmitter(appEvents, eventName, listener);
}
