import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
    config({path:'env.test', override: true})
} else {
    config()
}

const envSchema = z.object({
    NODE_ENV: z.enum(['dev', 'test', 'prod']).default('prod'),
    DATABASE_CLIENT: z.string(),
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3333)
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
    console.log("Invalid Environment Variables: ", _env.error.format())
}

export const env = _env.data