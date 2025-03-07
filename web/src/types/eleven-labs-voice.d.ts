export interface ElevenLabsVoice {
	voice_id: string
	name: string
	fine_tuning: {
		language: string
	}
	labels: {
		accent: string
		description: string
		age: string
		gender: string
	}
	preview_url: string
}