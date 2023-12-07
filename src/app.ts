import 'dotenv/config'
import fastify from "fastify"
import { dishesRoutes } from './features/Dishes/Router'
import fastifyCookie from '@fastify/cookie'
import { handleValidationErrors } from './middleware/handle-validation-errors'
import { usersRoutes } from './features/Users/Router'



const app = fastify()

app.register(fastifyCookie)

app.setErrorHandler(handleValidationErrors)

app.addHook('preHandler', async (req, reply) => {
    console.log(`[${req.method}] ${req.url}`)
})

app.register(dishesRoutes, {
    prefix: '/dishes'
})

app.register(usersRoutes, {
    prefix: '/user'
})
export { app }