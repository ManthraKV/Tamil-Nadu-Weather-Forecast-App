import React, { useState } from 'react';
import { X, Share2, Copy, Check, Github, Globe, ExternalLink, Terminal, Sparkles } from 'lucide-react';

interface DeployShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const DeployShareModal: React.FC<DeployShareModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedGitCmd, setCopiedGitCmd] = useState(false);

  if (!isOpen) return null;

  const publicAppUrl = window.location.href.includes('localhost')
    ? 'https://ais-pre-k7nkkab6ep43fvxovathj4-687869885295.asia-southeast1.run.app'
    : window.location.origin;

  const gitCommands = `git init
git add .
git commit -m "Deploy Tamil Nadu Weather Forecast App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tamil-nadu-weather.git
git push -u origin main`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publicAppUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyGit = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopiedGitCmd(true);
    setTimeout(() => setCopiedGitCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div
        className={`relative w-full max-w-xl rounded-3xl border shadow-2xl transition-all my-8 p-6 ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-500 border border-sky-500/20">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Public Share & Deployment Gateway</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Access the live hosted URL or deploy seamlessly to GitHub & Vercel.
            </p>
          </div>
        </div>

        {/* Section 1: Public Live URL */}
        <div className="mb-6 p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-700 dark:text-sky-300">
              Live Hosted Shareable Applet Link:
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500 text-white font-bold">
              Active Cloud Run URL
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={publicAppUrl}
              className={`flex-1 px-3 py-2 rounded-xl text-xs font-mono border ${
                isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
              }`}
            />
            <button
              onClick={handleCopyUrl}
              className="px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-xs"
            >
              {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
            </button>
            <a
              href={publicAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Section 2: Deploy to GitHub & Vercel Instructions */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm flex items-center gap-2 text-slate-800 dark:text-slate-200">
            <Github className="w-4 h-4 text-sky-500" />
            <span>Deploy via GitHub & Vercel (3 Quick Steps)</span>
          </h3>

          <div className="space-y-3 text-xs">
            {/* Step 1 */}
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-sky-600 dark:text-sky-400 block mb-1">
                Step 1: Push Code to your GitHub Repository
              </span>
              <p className="text-slate-500 dark:text-slate-400 mb-2">
                Export or copy project files, then run the following in your terminal:
              </p>
              <div className="relative">
                <pre className="p-2.5 rounded-lg bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto">
                  {gitCommands}
                </pre>
                <button
                  onClick={handleCopyGit}
                  className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Copy Git Commands"
                >
                  {copiedGitCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-sky-600 dark:text-sky-400 block mb-1">
                Step 2: Connect GitHub Repository to Vercel
              </span>
              <p className="text-slate-500 dark:text-slate-400">
                Go to <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer" className="text-sky-500 underline font-semibold">vercel.com/new</a>, select your GitHub repository, set <code>Build Command: npm run build</code> and <code>Output Directory: dist</code>, then click <strong>Deploy</strong>.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-sky-600 dark:text-sky-400 block mb-1">
                Step 3: Free Custom Domain & Live SSL
              </span>
              <p className="text-slate-500 dark:text-slate-400">
                Vercel automatically provisions a production-ready HTTPS domain (e.g. <code>tamil-nadu-weather.vercel.app</code>) accessible worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
