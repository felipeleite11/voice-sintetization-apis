import axios from "axios"

export const elevenLabsAPI = axios.create({
	baseURL: 'http://localhost:3000/eleven-labs/'
})
