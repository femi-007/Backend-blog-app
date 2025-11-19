const { z } = require('zod');

const registerSchema = z.object({
    username: z.string().min(2).max(255).trim(),
    email: z.email().max(255).toLowerCase().trim(),
    password: z.string().min(6).max(128)
})

const loginSchema = z.object({
    username: z.string(),
    password: z.string().min(2)
})

module.exports = { registerSchema, loginSchema };