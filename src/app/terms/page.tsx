import React from "react";

export default function TermsPage() {
  // 1. Change this to your live production domain once deployed
  const SITE_URL: string = "https://theprobability.site"; 
  
  // 2. Construct the absolute path to your file (ensuring exact casing match)
  const pdfRelativePath: string = "/docs/Terms-Of-Use.pdf";
  const absolutePdfUrl: string = `${SITE_URL}${pdfRelativePath}`;
  
  // 3. Embed it into Google's Viewer URL
  const googleViewerUrl: string = `https://docs.google.com/gview?url=${encodeURIComponent(absolutePdfUrl)}&embedded=true`;

  return (
    <main className="min-h-screen bg-zinc-900 flex justify-center py-10">
      <div className="w-full max-w-6xl h-[95vh] rounded-2xl overflow-hidden border border-white/10 bg-black">
        
        {/* Using an <iframe> for cross-platform mobile compatibility */}
        <iframe
          src={googleViewerUrl}
          className="w-full h-full border-none"
          title="Terms of Use"
        >
          {/* Fallback UI if the iframe fails or when testing on localhost */}
          <div className="flex flex-col items-center justify-center h-full text-white p-6 text-center">
            <p className="mb-4 text-zinc-400">
              Taking too long to load? You can view the document directly.
            </p>

            <a
              href={pdfRelativePath}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-xl font-bold transition-colors"
            >
              Open Terms of Use
            </a>
          </div>
        </iframe>

      </div>
    </main>
  );
}
