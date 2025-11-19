const { z, nullable } = require('zod');

const articleSchema = z.object({
    title: z.string().min(5),
    content: z.string().min(255),
    tags: z.array(z.string()),
    authorId: z.string(),
    author: z.string().min(2).max(255).trim()
})

const commentSchema = z.object({
    username: z.string(),
    content: z.string().min(2).max(255).trim()
})

const employeeSchema = z.object({
    firstname: z.string().min(2).max(255).trim(),
    lastname: z.string().min(2).max(255).trim(),
    email: z.email().max(255).trim(),
    position: z.string().optional().default(null)
})

module.exports = { articleSchema, commentSchema, employeeSchema };