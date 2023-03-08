import express from 'express'
import UserRouter from './api/user.controller'
import http, {Server} from 'http'

const app = express()
app.use(express.json())
const PORT = process.env.PORT || 3000
app.use('/api', UserRouter)



export class ServerRunner {
    server:Server | null = null
    connect() {
        this.server = http.createServer(app)
        this.server.listen(PORT)
        return this.server
    }

    disconnect() {
        this.server?.close()
    }

}

export default app