import * as Effect from 'effect/Effect';

/**
 * Type representing an Either result for IPC responses
 */
export type EitherResult<T> = {
  _tag: 'Right' | 'Left';
  left?: {
    message: string;
    name?: string;
    stack?: string;
  };
  right?: T;
};

/**
 * Makes objects safe for IPC serialization by removing non-serializable properties
 * @param obj - Object to sanitize
 * @returns A serialization-safe version of the object
 */
function makeSerializable(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  // Handle primitive types
  if (typeof obj !== 'object' && typeof obj !== 'function') {
    return obj;
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => makeSerializable(item));
  }
  
  // Handle array-like objects that need to be converted to arrays
  if (obj && typeof obj === 'object' && obj.length !== undefined && typeof obj.length === 'number') {
    console.log('Converting array-like object to array', obj);
    return Array.from(obj).map(item => makeSerializable(item));
  }
  
  // Handle Error objects
  if (obj instanceof Error) {
    return {
      message: obj.message,
      name: obj.name,
      stack: obj.stack
    };
  }
  
  // Handle Date objects
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  
  // For regular objects, create a safe copy
  const result: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      try {
        // Skip functions and complex non-serializable objects
        const value = obj[key];
        if (typeof value !== 'function') {
          result[key] = makeSerializable(value);
        }
      } catch (err) {
        console.warn(`Failed to serialize property ${key}`, err);
        // Skip this property if it can't be serialized
      }
    }
  }
  return result;
}

/**
 * Convert an Effect result to an EitherResult for IPC communication
 * 
 * @param effect - The Effect to run
 * @returns Promise with Either-like structure that can be safely serialized
 */
export async function effectToEither<T, E extends Error, R>(
  effect: Effect.Effect<T, E, R>
): Promise<EitherResult<T>> {
  try {
    const result = await Effect.runPromise(Effect.either(effect));
    
    if (result._tag === 'Right') {
      return {
        _tag: 'Right',
        right: makeSerializable(result.right)
      };
    } else {
      const error = result.left;
      const errorMessage = error instanceof Error ? error.message : String(error);
        
      return {
        _tag: 'Left',
        left: {
          message: errorMessage,
          name: error instanceof Error ? error.name : 'Error',
          stack: error instanceof Error ? error.stack : undefined
        }
      };
    }
  } catch (err) {
    return {
      _tag: 'Left',
      left: makeSerializable(err instanceof Error ? err : new Error(String(err)))
    };
  }
}

/**
 * Type-safe IPC handler wrapper
 */
export function createIpcHandler<T, P extends any[], R = never>(
  handler: (...args: P) => Effect.Effect<T, Error, R>
): (...args: P) => Promise<EitherResult<T>> {
  return async (...args: P) => {
    return effectToEither(handler(...args));
  };
} 