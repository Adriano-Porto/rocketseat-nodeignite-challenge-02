import { FastifyInstance } from "fastify";
import { DishesController } from "./Controller";
import { checkSessionIdExists } from "../../middleware/check-session-id-exists";

const dishesController = new DishesController()

const ensureUser = {
    preHandler: [ checkSessionIdExists ]
}

export async function dishesRoutes(app:FastifyInstance) {
    app.post('/', ensureUser, dishesController.create)
    app.get('/', ensureUser, dishesController.listAll)
    app.get('/:id', ensureUser, dishesController.listDish)
    app.put('/:id', ensureUser, dishesController.updateDish)
    app.get('/metrics', ensureUser, dishesController.getUserMetrics)

}