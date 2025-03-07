import Image from "next/image"

export default function Home() {
	return (
		<main className="flex min-h-screen justify-center items-center flex-col">
			<h1 className="mb-8 font-semibold text-xl pb-3 border-b border-white">Voice Sintetization APIs</h1>

			<ul className="flex flex-col gap-6">
				<li className="self-center">
					<a href="/eleven-labs" className="hover:opacity-80 flex items-center">
						<Image
							src="/images/elevenlabs.svg"
							alt="Eleven Labs"
							width={200}
							height={50}
							className="h-3.5"
						/>
					</a>
				</li>
			</ul>
		</main>
	)
}
