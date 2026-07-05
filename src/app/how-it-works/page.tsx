export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">

        <div className="inline-block px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6">
          Learn Before You Trade
        </div>

        <h1 className="text-6xl font-black mb-6">
          How Prediction Markets Work
        </h1>

        <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
          Prediction markets allow people to trade on the likelihood
          of future events. The more accurate your information and
          reasoning, the more you can potentially earn.
        </p>

      </section>

      {/* SECTION 1 */}

      <section className="max-w-5xl mx-auto px-6 py-16">

        <h2 className="text-4xl font-black mb-6">
          What Is A Prediction Market?
        </h2>

        <p className="text-zinc-300 text-lg leading-relaxed">
          A prediction market is a marketplace where people buy and
          sell outcomes based on what they believe will happen in
          the future.
        </p>

        <p className="text-zinc-300 text-lg leading-relaxed mt-6">
          Instead of betting against a sportsbook, you're trading
          against other participants. Prices move based on what the
          crowd believes is most likely to happen.
        </p>

      </section>

      {/* SECTION 2 */}

      <section className="max-w-5xl mx-auto px-6 py-16">

        <h2 className="text-4xl font-black mb-6">
          Example
        </h2>

        <div className="bg-zinc-900 rounded-3xl p-8 border border-white/10">

          <div className="text-2xl font-bold mb-4">
            "Will Bitcoin reach $250,000 before 2028?"
          </div>

          <p className="text-zinc-400 mb-4">
            If the market believes there's a 30% chance,
            YES shares may trade around 0.30.
          </p>

          <p className="text-zinc-400 mb-4">
            If new information arrives and confidence increases,
            the price may rise to 0.60.
          </p>

          <p className="text-zinc-400">
            Traders who bought early can sell later at a profit.
          </p>

        </div>

      </section>

      {/* SECTION 3 */}

      <section className="max-w-5xl mx-auto px-6 py-16">

        <h2 className="text-4xl font-black mb-6">
          Why People Use Prediction Markets
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
            <div className="text-2xl mb-3">📈</div>
            <div className="font-bold mb-2">
              Profit From Information
            </div>
            <p className="text-zinc-400">
              If you identify trends before others,
              you can potentially earn from being right.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
            <div className="text-2xl mb-3">🧠</div>
            <div className="font-bold mb-2">
              Test Your Knowledge
            </div>
            <p className="text-zinc-400">
              Politics, sports, crypto, technology,
              economics and more.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
            <div className="text-2xl mb-3">🌍</div>
            <div className="font-bold mb-2">
              Discover What The Crowd Thinks
            </div>
            <p className="text-zinc-400">
              Market prices reveal collective beliefs
              about future events.
            </p>
          </div>

        </div>

      </section>

      {/* SECTION 4 */}

      <section className="max-w-5xl mx-auto px-6 py-16">

        <h2 className="text-4xl font-black mb-6">
          Can You Build Significant Wealth?
        </h2>

        <p className="text-zinc-300 text-lg leading-relaxed">
          Some traders have earned substantial returns by consistently
          spotting opportunities before the market does.
        </p>

        <p className="text-zinc-300 text-lg leading-relaxed mt-6">
          The best traders treat prediction markets like investing:
          they research deeply, manage risk carefully, and think
          long-term rather than chasing quick wins.
        </p>

        <p className="text-zinc-300 text-lg leading-relaxed mt-6">
          Success is never guaranteed. Markets can be wrong,
          information can change, and losses are possible.
        </p>

      </section>

      {/* SECTION 5 */}

      <section className="max-w-5xl mx-auto px-6 py-16">

        <div className="bg-emerald-500 text-black rounded-3xl p-10">

          <h2 className="text-4xl font-black mb-4">
            Start Small. Learn Fast.
          </h2>

          <p className="text-lg">
            The most successful traders aren't gamblers.
            They're information hunters.
          </p>

          <p className="text-lg mt-4">
            Find opportunities others miss.
            Think independently.
            Let the market reward accuracy.
          </p>

        </div>

      </section>

    </main>
  );
}