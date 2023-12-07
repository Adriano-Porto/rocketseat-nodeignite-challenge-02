import { randomUUID } from "crypto";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { knex } from "../../database";

class UsersController {
    async create(req: FastifyRequest, reply: FastifyReply) {
        const createUserSchema = z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string(),
            photo_url: z.string().url()
        })

        const { name, email, password, photo_url } = createUserSchema.parse(req.body)

        const id = randomUUID()

        const userObject = { email, photo_url, id, name}

        await knex('users')
            .insert({...userObject, password})
        
        reply.cookie('session_id', id, {
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000 // Week Time
        })

        return reply.status(200).send(userObject)
    }

    async login(req: FastifyRequest, reply: FastifyReply) {
        const loginSchema = z.object({
            email: z.string().email(),
            password: z.string()
        })

        const { email, password } = loginSchema.parse(req.body)

        const user = await knex('users')
            .select()
            .where({email})
            .first()

        if (!user || user.password !== password) {
            return reply.status(401).send({message: "Email ou senha errado"})
        }
         
        reply.cookie('session_id', user.id, {
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000 // Week Time
        })

        delete user.password

        return reply.status(200).send(user)
    }
}

export { UsersController }