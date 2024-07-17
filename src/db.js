import { PrismaClient } from "@prisma/client";

// Función para crear una nueva instancia de PrismaClient
const prismaClientSingleton = () => {
    return new PrismaClient();
};

// Obtener la instancia de PrismaClient desde el objeto global, o crear una nueva si no existe
const prisma = global.prismaGlobal || prismaClientSingleton();

// Exportar la instancia de PrismaClient
export default prisma;

// En entornos que no sean producción, asignar la instancia de PrismaClient al objeto global
if (process.env.NODE_ENV !== "production") {
    global.prismaGlobal = prisma;
}
