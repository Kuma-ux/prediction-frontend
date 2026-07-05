export default function TermsPage() {
  return (
    <main className="min-h-screen bg-zinc-900 flex justify-center py-10">
      <div
        className="
          w-full
          max-w-6xl
          h-[95vh]
          rounded-2xl
          overflow-hidden
          border
          border-white/10
          bg-black
        "
      >
        <object
          data="/docs/Terms-of-Use.pdf"
          type="application/pdf"
          className="w-full h-full"
        >
          <div className="flex flex-col items-center justify-center h-full text-white">
            <p className="mb-4">
              Your browser can't display PDFs.
            </p>

            <a
              href="/docs/Terms-of-Use.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="
                bg-emerald-500
                text-black
                px-6
                py-3
                rounded-xl
                font-bold
              "
            >
              Open Terms of Use
            </a>
          </div>
        </object>
      </div>
    </main>
  );
}