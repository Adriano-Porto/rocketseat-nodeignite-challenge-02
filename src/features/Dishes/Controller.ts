import { randomUUID } from "crypto";
import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError, z } from "zod";
import { knex } from "../../database";


class DishesController {
    async create(req: FastifyRequest, reply: FastifyReply) {
        const createDisheSchema = z.object( {
            name: z.string(),
            description: z.string(),
            time: z.string().datetime(),
            in_diet: z.boolean()
        })

        const { name, description, time, in_diet} = createDisheSchema.parse(req.body)

        const sessionId = req.cookies.session_id

        const dishObject = {
            id: randomUUID(),
            user_id: sessionId,
            name,
            description,
            time,
            in_diet
        }

        await knex('dishes')
            .insert(dishObject)

        return reply.status(201).send(dishObject)
    }

    async listAll(req: FastifyRequest, reply: FastifyReply) {
        const sessionId = req.cookies.session_id

        const dishes = await knex('dishes')
            .select()
            .where({user_id: sessionId})

        reply.status(200).send(dishes)
    }

    async listDish(req: FastifyRequest, reply: FastifyReply) {
        const idSchema = z.object({
            id: z.string().uuid()
        })
        const { id } = idSchema.parse(req.params)
    
        const dish = await knex('dishes')
            .select()
            .where({ id })
            
        reply.status(200).send({'dish': dish[0]})
    }

    async updateDish(req: FastifyRequest, reply: FastifyReply) {
        const updateDishSchema = z.object({
            name: z.string().optional(),
            description: z.string().optional(),
            time: z.string().datetime().optional(),
            in_diet: z.boolean().optional()
        })
        const requestedUpdate = updateDishSchema.parse(req.body)
        
        const idSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = idSchema.parse(req.params)


        const updatedObject = await knex('dishes')
            .where({id})
            .update(requestedUpdate, ['id', 'name', 'description', 'time', 'in_diet'])
    
        return reply.status(200).send(updatedObject)
    }

    async getUserMetrics(req: FastifyRequest, reply: FastifyReply) {
        const sessionId = req.cookies.session_id

        const dishes = await knex('dishes')
        .select('in_diet')
        .where({user_id: sessionId})

        const totalDishes = dishes.length
        const dietDishes = dishes.filter(({in_diet}) => {return in_diet === 1}).length
        console.log(dietDishes)
        const outDietDishes = totalDishes - dietDishes
        let bestStreak = 0
        let currentStreak = 0
        dishes.forEach(({in_diet}) => {
            if (in_diet == 1) {
                currentStreak += 1
            } else {
                bestStreak = Math.max(currentStreak, bestStreak)
            }
        })

        return reply.status(200).send({
            totalDishes,
            dietDishes,
            outDietDishes,
            bestStreak
        })
        

    }
}

export { DishesController }