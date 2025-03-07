import { Router } from 'express'
import { ElevenLabsClient } from 'elevenlabs'
// @ts-ignore
// import ElevenLabsNode from 'elevenlabs-node'

export const router = Router()

const client = new ElevenLabsClient({ apiKey: process.env.ELEVEN_LABS_API_KEY! })

// const voice = new ElevenLabsNode({
// 	apiKey: process.env.ELEVEN_LABS_API_KEY!,
// 	voiceId: process.env.ELEVEN_LABS_VOICE_ID
// })

router.get('/voices', async (req, res) => {
	const voices = await client.voices.getAll()

	res.json(voices)
})

router.post('/', async (req, res) => {
	try {
		const voiceId = req.body.voice_id || process.env.ELEVEN_LABS_VOICE_ID!

		res.setHeader('Content-Type', 'audio/mpeg')
		res.setHeader('Content-Disposition', 'attachment; filename="audio.mp3"')

		const resultStream = await client.textToSpeech.convert(voiceId, {
			output_format: 'mp3_44100_128',
			text: req.body.text,
			// language_code: 'pt',
			model_id: 'eleven_multilingual_v2' // ou 'eleven_turbo_v2_5'
		})

		// Método alternativo
		// const resultStream = await client.generate({
		// 	voice: voiceId, //'Roger',
		// 	text: req.body.text,
		// 	model_id: 'eleven_multilingual_v2',
		// 	language_code: 'pt',
		// 	output_format: 'mp3_44100_128'
		// })

		// Usando a lib elevenlabs-node
		// const resultStream = await voice.textToSpeechStream({
		// 	textInput: req.body.text,
		// 	// voiceId:         "21m00Tcm4TlvDq8ikWAM",         // A different Voice ID from the default
		// 	// stability:       0.5,                            // The stability for the converted speech
		// 	// similarityBoost: 0.5,                            // The similarity boost for the converted speech
		// 	// modelId:         "eleven_multilingual_v2",       // The ElevenLabs Model ID
		// 	// style:           1,                              // The style exaggeration for the converted speech
		// 	// speakerBoost:    true                            // The speaker boost for the converted speech
		// })

		resultStream.pipe(res)

		resultStream.on('error', err => {
			console.error('Erro ao ler o arquivo:', err)

			res.status(500).send('Erro ao processar o arquivo')
		})
	} catch(e) {
		console.log(e)

		res.status(400).end()
	}
})
