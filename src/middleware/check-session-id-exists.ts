import { FastifyReply, FastifyRequest } from "fastify";

export async function checkSessionIdExists(req: FastifyRequest, reply: FastifyReply) {
    const sessionId = req.cookies.session_id
    if (!sessionId) return reply.status(401).send({'my-man': 'you need to log in'})
}