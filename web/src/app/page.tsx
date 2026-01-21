import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const cards = [
  {
    title: "Get Started",
    href: "/start",
    desc: "Connect, create your profile, and jump into your dashboard.",
    icon: "🚀",
  },
  {
    title: "KYC + Proof",
    href: "/kyc",
    desc: "Upload ID, selfie, and liveness; off-chain checks + mock ZK proof.",
    icon: "✅",
  },
  {
    title: "Mint zkPassport",
    href: "/mint",
    desc: "Mint the soulbound zkPassport on Polygon Amoy after proof.",
    icon: "🎫",
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    desc: "View your passport status, attributes, and verification details.",
    icon: "📊",
  },
];

const features = [
  {
    title: "Zero-Knowledge Proofs",
    desc: "Prove your identity attributes without revealing personal data",
    icon: "🔐",
  },
  {
    title: "Soulbound NFT",
    desc: "Non-transferable passport tied to your wallet address",
    icon: "🎫",
  },
  {
    title: "Stealth Identity",
    desc: "Link your passport to a stealth address for complete privacy",
    icon: "👤",
  },
  {
    title: "AI Verification",
    desc: "Advanced AI checks for document authenticity and liveness",
    icon: "🤖",
  },
];

const useCases = [
  "DeFi lending protocols",
  "Age-restricted gaming",
  "DAO governance voting",
  "Token launchpads",
  "RWA marketplaces",
  "Airdrop protection",
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-cyan-300 uppercase text-sm tracking-[0.3em] mb-4 animate-slide-in-left">
            Polygon Amoy · zk-SBT · ERC-5564
          </p>
          <h1 className="text-6xl md:text-7xl font-bold gradient-text mb-6 leading-tight animate-scale-in">
            OblivionID
          </h1>
          <p className="text-2xl text-slate-200/90 max-w-3xl mx-auto mb-8 animate-fade-in" style={{animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards'}}>
            Private identity, public compliance. Verify once, prove everywhere.
          </p>
          <p className="text-lg text-slate-300/80 max-w-2xl mx-auto mb-10 animate-fade-in" style={{animationDelay: '0.4s', opacity: 0, animationFillMode: 'forwards'}}>
            Off-chain AI/KYC validation → ZK proof → Soulbound zkPassport on Polygon →
            Stealth-ready identity. No raw PII leaves the backend; only flags and commitments hit chain.
          </p>
          <div className="flex gap-4 justify-center flex-wrap animate-fade-in" style={{animationDelay: '0.6s', opacity: 0, animationFillMode: 'forwards'}}>
            <Link href="/start" className="btn-primary text-lg px-8 py-4 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300">
              Get Started
            </Link>
            <Link href="/docs" className="btn-secondary text-lg px-8 py-4">
              Learn More
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="card-3d p-6 hover:scale-105 transition-all duration-300 hover:border-cyan-500/30 animate-fade-in"
              style={{animationDelay: `${0.8 + idx * 0.1}s`, opacity: 0, animationFillMode: 'forwards'}}
            >
              <div className="text-4xl mb-4 transition-transform hover:scale-110">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">{feature.title}</h3>
              <p className="text-sm text-slate-300/80">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 mb-20">
          <div className="glass p-8">
            <h2 className="text-3xl font-bold mb-6 gradient-text">How It Works</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300 font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Complete KYC Verification</h3>
                  <p className="text-slate-300/80">
                    Upload your ID, selfie, and liveness video. Our AI verifies authenticity, checks for deepfakes,
                    and validates your documents off-chain.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Generate ZK Proof</h3>
                  <p className="text-slate-300/80">
                    Zero-knowledge circuit generates a proof confirming your attributes (age ≥18, verified, not sanctioned)
                    without revealing any personal information.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-300 font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Mint zkPassport</h3>
                  <p className="text-slate-300/80">
                    Mint your soulbound NFT on Polygon. Only verification flags and identity hash are stored on-chain.
                    All personal data is deleted.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Use Privately</h3>
                  <p className="text-slate-300/80">
                    Connect to dApps with your stealth identity. Prove compliance without revealing who you are.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card-3d p-6">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {cards.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="block p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{c.icon}</span>
                      <div>
                        <p className="font-semibold">{c.title}</p>
                        <p className="text-sm text-slate-200/70">{c.desc}</p>
                      </div>
                    </div>
                    <span className="text-xl">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="glass p-8 mb-20">
          <h2 className="text-3xl font-bold mb-6 gradient-text text-center">Use Cases</h2>
          <p className="text-center text-slate-300/80 mb-8 max-w-2xl mx-auto">
            OblivionID enables privacy-preserving compliance across multiple DeFi and Web3 applications
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {useCases.map((useCase, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition"
              >
                <p className="font-medium">{useCase}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Flags */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          <div className="card-3d p-6 text-center">
            <span className="text-4xl mb-3 block">🧑‍💻</span>
            <p className="font-semibold">Age ≥18</p>
            <p className="text-xs text-slate-300/70 mt-1">Verified</p>
          </div>
          <div className="card-3d p-6 text-center">
            <span className="text-4xl mb-3 block">🛡️</span>
            <p className="font-semibold">Not Sanctioned</p>
            <p className="text-xs text-slate-300/70 mt-1">PEP Check</p>
          </div>
          <div className="card-3d p-6 text-center">
            <span className="text-4xl mb-3 block">🤖</span>
            <p className="font-semibold">Human Verified</p>
            <p className="text-xs text-slate-300/70 mt-1">Liveness Check</p>
          </div>
          <div className="card-3d p-6 text-center">
            <span className="text-4xl mb-3 block">🔒</span>
            <p className="font-semibold">Unique Identity</p>
            <p className="text-xs text-slate-300/70 mt-1">Hash Commitment</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="glass p-12 text-center">
          <h2 className="text-4xl font-bold gradient-text mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-slate-300/80 mb-8 max-w-2xl mx-auto">
            Join the future of private, compliant identity verification. Your data stays private, your compliance is public.
          </p>
          <Link href="/start" className="btn-primary text-lg px-10 py-4 inline-block">
            Create Your Profile
          </Link>
        </div>
      </section>
    </main>
  );
}
