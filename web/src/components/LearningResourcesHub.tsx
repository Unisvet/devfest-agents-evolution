import React, { useState } from 'react';
import { BookOpen, ExternalLink, PlayCircle, Sparkles } from 'lucide-react';
import { LEARNING_RESOURCES } from '../data/resourcesData';
import { LearningResource } from '../types/presentation';
import { FormattedText } from './FormattedText';

type CategoryFilter = 'All' | LearningResource['category'];

export const LearningResourcesHub: React.FC = () => {
  const [filter, setFilter] = useState<CategoryFilter>('All');

  const categories: CategoryFilter[] = [
    'All',
    'Keynote & Silicon',
    'Antigravity & Agents',
    'AlphaEvolve & AGI',
    'Philosophy & Research',
  ];

  const filtered =
    filter === 'All' ? LEARNING_RESOURCES : LEARNING_RESOURCES.filter((r) => r.category === filter);

  return (
    <div className="w-full px-6 sm:px-10 lg:px-14 xl:px-20 py-8 space-y-8">
      {/* Featured Video Banner: Google Cloud Tech - The Future of AI Infrastructure */}
      <div className="rounded-3xl bg-slate-900/75 border border-purple-500/35 p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center shadow-2xl">
        <div className="lg:col-span-6 space-y-3.5">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-sm font-mono font-semibold bg-purple-500/20 text-purple-200 border border-purple-400/40">
            <PlayCircle className="w-4 h-4" /> Featured Infrastructure Keynote
          </span>
          <h2 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-white leading-tight">
            The Future of AI Infrastructure — Google Cloud Tech
          </h2>
          <p className="text-base xl:text-lg text-slate-200 leading-relaxed">
            Watch the official architectural deep-dive behind Pillar 3 of our session: how Google Cloud’s{' '}
            <strong>AI Hypercomputer</strong>, <strong>Ironwood (TPU v7)</strong>, and bifurcated 8th-Generation{' '}
            <strong>TPU-8t</strong> (134k-chip Virgo training) &amp; <strong>TPU-8i</strong> (+80% perf/$ agentic inference)
            power continuous multi-agent reasoning loops.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href="https://www.youtube.com/live/pabDkNR7jIs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-purple-500 hover:bg-purple-400 text-slate-950 transition"
            >
              Watch on YouTube Live <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/Unisvet/devfest-agents-evolution"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-cyan-500/35 transition"
            >
              Explore Companion GitHub Repo <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-lg">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/pabDkNR7jIs"
              title="The Future of AI Infrastructure — Google Cloud Tech"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-100 font-bold text-xl">
          <BookOpen className="w-5 h-5 text-cyan-400" /> Curated Learning &amp; Research Links
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition border ${
                filter === cat
                  ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/50'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/45 p-5 transition flex flex-col justify-between gap-3 shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs sm:text-sm font-mono px-3 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {item.badge}
                </span>
                <span className="text-xs sm:text-sm font-mono text-slate-300">{item.category}</span>
              </div>
              <h3 className="text-lg xl:text-xl font-bold text-slate-100 group-hover:text-cyan-300 transition flex items-start justify-between gap-2">
                <span>
                  <FormattedText text={item.title} />
                </span>
                <ExternalLink className="w-4 h-4 shrink-0 mt-1 opacity-75 group-hover:opacity-100" />
              </h3>
              <p className="text-sm sm:text-base text-slate-200 mt-2 leading-relaxed">
                <FormattedText text={item.description} />
              </p>
            </div>

            <div className="text-xs sm:text-sm font-mono text-emerald-300/95 flex items-center gap-1.5 pt-2.5 border-t border-slate-800/80">
              <Sparkles className="w-4 h-4" /> {item.provider}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
