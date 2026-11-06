import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export interface ContactMessageInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessageDocument {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: unknown;
  read: boolean;
}

export interface ContactSubmissionResult {
  success: boolean;
  id?: string;
  error?: string;
}

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const NOT_BLANK_REGEX = /\S/;

/**
 * Validates contact message inputs against deployed Firestore rules schema.
 */
export function validateContactInput(input: ContactMessageInput): { valid: boolean; error?: string } {
  const name = (input.name || '').trim();
  const email = (input.email || '').trim();
  const subject = (input.subject || '').trim();
  const message = (input.message || '').trim();

  if (!name || name.length < 1 || name.length > 100 || !NOT_BLANK_REGEX.test(name)) {
    return { valid: false, error: 'Name must be between 1 and 100 characters.' };
  }

  if (!email || email.length < 5 || email.length > 150 || !EMAIL_REGEX.test(email)) {
    return { valid: false, error: 'Please provide a valid email address.' };
  }

  if (!subject || subject.length < 1 || subject.length > 200 || !NOT_BLANK_REGEX.test(subject)) {
    return { valid: false, error: 'Subject must be between 1 and 200 characters.' };
  }

  if (!message || message.length < 1 || message.length > 3000 || !NOT_BLANK_REGEX.test(message)) {
    return { valid: false, error: 'Message must be between 1 and 3,000 characters.' };
  }

  return { valid: true };
}

/**
 * Submits a contact message directly to Cloud Firestore (/contactMessages collection).
 * Strictly contains only the 6 keys permitted by firestore.rules:
 * name, email, subject, message, createdAt, read.
 */
export async function submitContactMessage(input: ContactMessageInput): Promise<{ id: string }> {
  // Check online status before initiating network request
  if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined' && !window.navigator.onLine) {
    throw new Error('You appear to be offline. Please check your internet connection and try again.');
  }

  // Validate inputs
  const validation = validateContactInput(input);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid form input.');
  }

  // Prepare exact 6 fields matching ruleset
  const docPayload: ContactMessageDocument = {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    subject: input.subject.trim(),
    message: input.message.trim(),
    createdAt: serverTimestamp(),
    read: false,
  };

  const collectionRef = collection(db, 'contactMessages');
  const docRef = await addDoc(collectionRef, docPayload);

  return { id: docRef.id };
}
