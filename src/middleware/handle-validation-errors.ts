import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

export function handleValidationErrors(error: any, req: FastifyRequest, reply: FastifyReply) {
    if (error instanceof ZodError)  {
        return reply.status(400).send(error.format())
    }

    console.error(error)

    return reply.status(500).send({ error: "Internal Server Error"})
}