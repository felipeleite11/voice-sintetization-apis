'use client'

import { useRouter } from 'next/navigation'
import {
	QueryClient,
	QueryClientProvider
} from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false
		}
	}
})

export default function ElevenLabsLayout({ children }: Readonly<{children: React.ReactNode}>) {
	const { push } = useRouter()

	return (
		<QueryClientProvider client={queryClient}>
			<main className="flex flex-col p-12 gap-8">
				<div className="flex gap-4">
					<ArrowLeft 
						size={24} 
						onClick={() => {
							push('/')
						}} 
						className="hover:opacity-80 cursor-pointer" />

					<Image
						src="/images/elevenlabs.svg"
						width={180}
						height={60}
						alt="Eleven Labs"
					/>
				</div>

				{children}
			</main>
		</QueryClientProvider>
	)
}
