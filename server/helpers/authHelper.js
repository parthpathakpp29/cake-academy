import bcrypt from "bcryptjs";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('authHelper');

export const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        logger.error('Error hashing password:', error);
        throw new Error('Password hashing failed');
    }
};

export const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        logger.error('Error comparing passwords:', error);
        throw new Error('Password comparison failed');
    }
};