import prisma from '../config/db';

// Modelo puro: solo acceso a datos, sin lógica de negocio

export async function createUser(userData: any) {
    return await prisma.user.create({
        data: userData
    });
}

export async function updateUser(where: any, data: any) {
    return await prisma.user.update({
        where,
        data
    });
}

export async function upsertUser(where: any, updateData: any, createData: any) {
    return await prisma.user.upsert({
        where,
        update: updateData,
        create: createData
    });
}

export async function findUserByApiKey(apiKey: string) {
    return await prisma.user.findUnique({ where: { apiKey } });
}

export async function findUserById(id: string) {
    return await prisma.user.findUnique({ where: { id } });
}

export async function findUserByGoogleId(googleId: string) {
    return await prisma.user.findUnique({ where: { googleId } });
}

export async function findUserByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
}