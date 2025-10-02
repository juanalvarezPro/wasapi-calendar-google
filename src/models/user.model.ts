import prisma from '../config/db';
import { encrypt, decrypt } from '../utils/crypto';
import { v4 as uuidv4 } from 'uuid';


export async function createOrUpdateUser(googleProfile: any, tokens: any) {
    const apiKey = uuidv4();
    const encryptedAccess = tokens.access_token ? encrypt(tokens.access_token) : undefined;
    const encryptedRefresh = tokens.refresh_token ? encrypt(tokens.refresh_token) : undefined;


    const user = await prisma.user.upsert({
        where: { googleId: googleProfile.id },
        update: {
            email: googleProfile.email,
            name: googleProfile.name,
            accessToken: encryptedAccess || undefined,
            refreshToken: encryptedRefresh || undefined,
            apiKey,
        },
        create: {
            googleId: googleProfile.id,
            email: googleProfile.email,
            name: googleProfile.name,
            accessToken: encryptedAccess || undefined,
            refreshToken: encryptedRefresh || undefined,
            apiKey,
        }
    });


    return user;
}


export async function findUserByApiKey(apiKey: string) {
    return prisma.user.findUnique({ where: { apiKey } });
}


export async function getDecryptedAccessToken(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.accessToken) return null;
    return decrypt(user.accessToken);
}

export async function getDecryptedRefreshToken(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.refreshToken) return null;
    return decrypt(user.refreshToken);
}