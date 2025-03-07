import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { router as elevenLabsRouter } from './routes/eleven-labs-routes'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
	res.json({
		status: true
	})
})

app.use('/eleven-labs', elevenLabsRouter)

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000')
})