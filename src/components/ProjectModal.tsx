import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { ProjectItem } from '../types';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onInquireProject: (projectName: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onInquireProject }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 6 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-[#111111] rounded-3xl border border-white/15 shadow-2xl overflow-hidden z-10 my-auto max-h-[90vh] flex flex-col"
        >
          {/* Top Bar with Close Button */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0D0D0D]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF2B2B]"></span>
              <span className="font-mono-tech text-xs uppercase tracking-widest text-[#FF2B2B] font-bold">
                {project.categoryLabel}
              </span>
            </div>

            <button
              onClick={onClose}
              aria-label="Close project modal"
              className="w-9 h-9 rounded-full bg-[#181818] border border-white/10 flex items-center justify-center text-[#A8A8A8] hover:text-white hover:border-[#FF2B2B] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Modal Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            {/* Project Image */}
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-[#181818] border border-white/10">
              <img
                src={project.image}
                alt={project.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-60"></div>
            </div>

            {/* Title & Tags */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono-tech text-[#A8A8A8] bg-[#181818] px-3 py-1 rounded-full border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
                {project.title}
              </h3>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#C0C0C0] leading-relaxed">
              {project.fullDescription}
            </p>

            {/* Deliverables / Features List */}
            {project.features && (
              <div className="bg-[#0A0A0A] p-5 rounded-2xl border border-white/10 space-y-3">
                <span className="font-mono-tech text-xs uppercase tracking-wider text-white font-bold block">
                  Key Project Highlights:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {project.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs text-[#A8A8A8] font-mono-tech">
                      <CheckCircle2 className="w-4 h-4 text-[#FF2B2B] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer CTA */}
          <div className="p-6 border-t border-white/10 bg-[#0D0D0D] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="font-mono-tech text-xs text-[#A8A8A8]">
              Ready to create something similar for your brand?
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  onClose();
                  onInquireProject(project.title);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#FF2B2B] text-white hover:bg-[#E50914] flex items-center justify-center gap-2 transition-all apex-glow-sm cursor-pointer"
              >
                <span>REQUEST SIMILAR WORK</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
