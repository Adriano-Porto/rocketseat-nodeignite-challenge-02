import { app } from './app'

app.listen({
    port: Number(process.env.PORT)
}).then(() => {
    console.log(`Running on ${process.env.PORT}`)
})