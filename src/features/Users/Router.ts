import { FastifyInstance } from "fastify";
import { UsersController } from "./Controller";
import { checkSessionIdExists } from "../../middleware/check-session-id-exists";

const usersController = new UsersController()

const ensureUser = {
    preHandler: [ checkSessionIdExists ]
}

export async function usersRoutes(app:FastifyInstance) {
    app.post('/',usersController.create)
    app.post('/log-in', ensureUser, usersController.login)
}