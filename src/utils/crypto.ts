import crypto from 'crypto';
import { ENCRYPTION_KEY } from '../config/env';
const ALGORITHM = 'aes-256-gcm';

// Encripta el texto usando el algoritmo AES-256-GCM
export function encrypt(text: string) {
    if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
        throw new Error('Invalid encryption key. Must be 32 bytes in hex.');
    }
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `${iv.toString('hex')}.${tag.toString('hex')}.${encrypted.toString('hex')}`;
}

// Desencripta el texto usando el algoritmo AES-256-GCM
export function decrypt(payload: string) {
    if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
        throw new Error('Invalid encryption key. Must be 32 bytes in hex.');
    }
    const [ivHex, tagHex, encryptedHex] = payload.split('.');
    if (!ivHex || !tagHex || !encryptedHex) {
        throw new Error('Invalid payload');
    }
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
}