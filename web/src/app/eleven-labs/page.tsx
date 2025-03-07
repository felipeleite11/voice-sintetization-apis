'use client'

import { useQuery } from "@tanstack/react-query"
import { FormEventHandler, useState } from "react"
import Image from "next/image"
import classNames from "classnames"
import { elevenLabsAPI } from "@/config/eleven-labs"
import { ElevenLabsVoice } from "@/types/eleven-labs-voice"

export default function ElevenLabs() {
	const [selectedVoice, setSelectedVoice] = useState<ElevenLabsVoice | null>(null)
	const [text, setText] = useState('Este é um teste de sintetização de voz.')
	const [allowGenerate, setAllowGenetate] = useState(false)

	const { data: availableVoices, isLoading, error } = useQuery<ElevenLabsVoice[]>({
		queryKey: ['eleven-labs-voice-list'],
		queryFn: async () => {
			const { data } = await elevenLabsAPI.get<{ voices: ElevenLabsVoice[] }>('/voices')

			return data.voices
		},
		initialData: []
	})

	const { data: generatedVoice, isFetching: isGeneratingAudio, refetch: regenerateAudio } = useQuery({
		queryKey: ['eleven-labs-voice-generation'],
		queryFn: async () => {
			const { data } = await elevenLabsAPI.post('/', {
				text,
				voice_id: selectedVoice?.voice_id
			}, {
				responseType: 'blob'
			})

			return URL.createObjectURL(data)
		},
		enabled: allowGenerate
	})

	const handleGenerateAudio: FormEventHandler<HTMLFormElement> = e => {
		e.preventDefault()

		if(generatedVoice) {
			regenerateAudio()
		} else {
			setAllowGenetate(true)
		}
	}

	if (isLoading) return <p>Carregando vozes disponíveis...</p>

	if (error) return <p>Erro ao carregar a lista de vozes!.</p>

	return (
		<div>
			<h1 className="mb-8 font-semibold text-xl pb-3 border-b border-white">Available voices</h1>

			{availableVoices.length === 0 ? (
				<span>Loading available voices...</span>
			) : (
				<ul className="max-h-96 overflow-y-auto w-[300px] border border-gray-400">
					{availableVoices?.map((voice: ElevenLabsVoice) => (
						<li
							key={voice.voice_id}
							onClick={() => {
								setSelectedVoice(voice)
							}}
							className={classNames('p-2 cursor-pointer hover:border hover:border-white', {
								'bg-gray-700': selectedVoice?.voice_id === voice.voice_id
							})}
						>
							{`${voice.name} (${voice.labels.gender})`}
						</li>
					))}
				</ul>
			)}

			<div className="flex gap-8">
				{selectedVoice && (
					<form 
						className="flex flex-col gap-2 w-full" 
						onSubmit={handleGenerateAudio}
					>
						<div className="mt-6 flex flex-col gap-2">
							<label htmlFor="text"></label>
							<textarea id="text" value={text} onChange={e => { setText(e.target.value) }} className="h-44 w-full bg-gray-800 text-white outline-0 rounded-md py-2 px-3" />
						</div>

						<button
							type="submit"
							className="flex items-center gap-3 w-fit self-end border border-white/60 hover:border-white px-3 py-2 rounded-md cursor-pointer"
						>
							{isGeneratingAudio ? (
								<>
									<Image
										src="/images/soundwaves.svg"
										width={20}
										height={20}
										alt="audio waves"
									/>

									Generating
								</>
							) : (
								<>
									<Image
										src="/images/waves.png"
										width={20}
										height={20}
										alt="audio waves"
									/>

									Generate
								</>
							)}
						</button>
					</form>
				)}

				{generatedVoice && (
					<div className="w-[300px] flex flex-col justify-end">
						<audio src={generatedVoice} autoPlay controls />
					</div>
				)}
			</div>
		</div>
	)
}