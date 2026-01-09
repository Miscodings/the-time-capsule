"use client";
import { useRouter } from "next/navigation";
import FooterSection from "@/components/FooterSection";

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      {/* Hero Section */}
      <section className="w-screen bg-desktop text-black py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            The Future Moves Fast.<br />
            <span className="text-blue">We Cherish What Lasts.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-black-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            In a world obsessed with what's next, we celebrate what was. 
            Rediscover the iconic technology that defined generations—where every click, 
            whir, and beep tells a story.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => router.push("/search")}
              className="win95-button px-8 py-4 text-lg bg-blue-600 border-blue-700 hover:bg-blue-700"
            >
              Explore Retro Tech
            </button>
          </div>

          {/* Featured Tech Icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            <div className="text-center">
              <div className="text-5xl mb-4">💾</div>
              <h3 className="font-bold text-lg">Analog Audio</h3>
              <p className="text-blue text-sm">Warm, authentic sound</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">📼</div>
              <h3 className="font-bold text-lg">Classic Video</h3>
              <p className="text-blue text-sm">CRTs & VHS</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🕹️</div>
              <h3 className="font-bold text-lg">Retro Computing</h3>
              <p className="text-blue text-sm">80s & 90s hardware</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🎙️</div>
              <h3 className="font-bold text-lg">Recording Gear</h3>
              <p className="text-blue text-sm">Studio classics</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nostalgia Story Section */}
      <section className="w-screen bg-panel py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
                Why Retro Tech Still Matters
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="text-lg">
                  Remember the satisfying <span className="font-bold text-blue-600">click</span> of a mechanical keyboard? 
                  The <span className="font-bold text-blue-600">warm hum</span> of a tube amplifier? 
                  The <span className="font-bold text-blue-600">tactile feedback</span> of physical controls?
                </p>
                <p className="text-lg">
                  Modern technology is sleek and efficient, but something was lost along the way: 
                  <span className="italic"> character, craftsmanship, and connection</span>.
                </p>
                <p className="text-lg">
                  At The Time Capsule, we preserve the technology that didn't just function—it 
                  <span className="font-bold"> felt alive</span>.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=600&q=80" 
                alt="Vintage stereo system" 
                className="rounded-lg win95-card"
              />
              <img 
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80" 
                alt="Classic film camera" 
                className="rounded-lg win95-card mt-8"
              />
              <img 
                src="https://images.unsplash.com/photo-1620046311691-5d93d65f69e9?auto=format&fit=crop&w=600&q=80" 
                alt="Floppy disks" 
                className="rounded-lg win95-card"
              />
              <img 
                src="https://images.unsplash.com/photo-1609753833670-9c6e07b52084?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="VHS collection" 
                className="rounded-lg win95-card mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="w-screen bg-blue">
        <div className="max-w-7xl mx-auto px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-white">Why Shop With The Time Capsule?</h2>
            <p className="text-gray-200 max-w-3xl mx-auto text-lg">
              We're more than just a store—we're custodians of technological heritage.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-4xl mb-6">🔧</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-300">Expertly Restored</h3>
              <p className="text-gray-400">
                Every item is thoroughly tested, cleaned, and restored to working condition by our technicians.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-6">✅</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-300">Authenticity Guaranteed</h3>
              <p className="text-gray-400">
                We verify the provenance and authenticity of every piece in our collection.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-6">🚚</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-300">Safe Shipping</h3>
              <p className="text-gray-400">
                Specialized packaging ensures your vintage tech arrives in perfect condition.
              </p>
            </div>
          </div>
        </div>
      </section>
      <FooterSection />
    </>
  );
}