import { v4 as uuidv4 } from 'uuid';
import { encrypt, decrypt } from '../utils/crypto';
import { upsertUser, findUserByApiKey, findUserById, updateUser } from '../models/user.model';

export class UserService {
    static async createOrUpdateUser(googleProfile: any, tokens: any) {
        // generar API key y encriptar tokens
        const apiKey = uuidv4();
        const encryptedAccess = tokens.access_token ? encrypt(tokens.access_token) : undefined;
        const encryptedRefresh = tokens.refresh_token ? encrypt(tokens.refresh_token) : undefined;

        // Preparar datos para el modelo
        const userData = {
            googleId: googleProfile.id,
            email: googleProfile.email,
            name: googleProfile.name,
            accessToken: encryptedAccess,
            refreshToken: encryptedRefresh,
            apiKey,
        };

        // Usar el modelo para operaciones de base de datos (upsert)
        return await upsertUser(
            { googleId: googleProfile.id },
            userData,
            userData
        );
    }

    static async getDecryptedAccessToken(userId: string) {
        const user = await findUserById(userId);
        if (!user?.accessToken) return null;
        return decrypt(user.accessToken);
    }

    static async getDecryptedRefreshToken(userId: string) {
        const user = await findUserById(userId);
        if (!user?.refreshToken) return null;
        return decrypt(user.refreshToken);
    }

    static async getUserByApiKey(apiKey: string) {
        return await findUserByApiKey(apiKey);
    }

    static async updateUserTokens(userId: string, accessToken: string, refreshToken?: string) {
        const encryptedAccess = encrypt(accessToken);
        const encryptedRefresh = refreshToken ? encrypt(refreshToken) : undefined;

        return await updateUser(
            { id: userId },
            {
                accessToken: encryptedAccess,
                refreshToken: encryptedRefresh,
            }
        );
    }
}
