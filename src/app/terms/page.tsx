export default function TermsPage() {
  const pdfUrl = "https://theprobability.site/docs/Terms-Of-Use.pdf";
  const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`;

  return (
    <main className="min-h-screen bg-zinc-900 flex justify-center py-10">
      <div className="w-full max-w-6xl h-[95vh] rounded-2xl overflow-hidden border border-white/10 bg-black">
        <iframe
          src={googleViewerUrl}
          className="w-full h-full"
          frameBorder="0"
        >
          <div className="flex flex-col items-center justify-center h-full text-white">
            <p className="mb-4">Your browser can't display PDFs.</p>
            <a
              href="/docs/Terms-Of-Use.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 text-black px-6 py-3 rounded-xl font-bold"
            >
              Open Terms of Use
            </a>
          </div>
        </iframe}
      </div>
    </main>
  );
}
