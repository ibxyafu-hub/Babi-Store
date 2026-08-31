import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ExternalLink, Sparkles, Filter } from 'lucide-react';
import { PROJECTS_DATA } from '../data/portfolioData';
import { ProjectCategory, ProjectItem } from '../types';
import { useTheme } from '../context/ThemeContext';

interface ProjectsProps {
  onSelectProject: (project: ProjectItem) => void;
  activeFilter?: ProjectCategory;
}

export const Projects: React.FC<ProjectsProps> = ({ onSelectProject, activeFilter = 'ALL' }) => {
  const [currentFilter, setCurrentFilter] = useState<ProjectCategory>(activeFilter);
  const { isDark } = useTheme();

  const categories: ProjectCategory[] = [
    'ALL',
    'WEBSITES',
    'GRAPHIC DESIGN',
    'VIDEO EDITING',
    'SOCIAL MEDIA',
    'DIGITAL PROJECTS',
  ];

  const filteredProjects =
    currentFilter === 'ALL'
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category === currentFilter);

  return (
    <section 
      id="work" 
      className={`py-16 sm:py-20 md:py-24 relative overflow-hidden transition-colors duration-300 border-t ${
        isDark ? 'bg-[#0A0A0A] border-white/5' : 'bg-[#F7F7F7] border-[#E5E5E5]'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-[#FF2B2B]/5 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4 sm:gap-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FF2B2B]"></span>
              <span className={`font-mono-tech text-[11px] sm:text-xs uppercase tracking-[0.25em] font-bold ${
                isDark ? 'text-[#FF2B2B]' : 'text-[#E50914]'
              }`}>
                SELECTED WORK
              </span>
            </div>

            <h2 className={`font-display font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] transition-colors ${
              isDark ? 'text-white' : 'text-[#111111]'
            }`}>
              SOME OF MY<br />
              <span className="text-gradient-red">CREATIVE PROJECTS</span>
            </h2>
          </div>

          <p className={`text-xs sm:text-sm max-w-md leading-relaxed transition-colors ${
            isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
          }`}>
            A curated showcase of bespoke websites, branding collateral, video edits, and digital service architectures.
          </p>
        </motion.div>

        {/* Horizontal Scrollable Category Filter Pills for Mobile & Desktop */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 sm:pb-4 mb-8 sm:mb-10 no-scrollbar touch-pan-x" id="project-filters">
          {categories.map((category) => {
            const isActive = currentFilter === category;
            return (
              <button
                key={category}
                onClick={() => setCurrentFilter(category)}
                className={`px-3.5 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-bold font-mono-tech tracking-wider uppercase whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-[0.97] ${
                  isActive
                    ? 'bg-[#FF2B2B] text-white shadow-md'
                    : isDark
                      ? 'bg-[#141414] text-[#A8A8A8] hover:text-white hover:bg-[#1C1C1C] border border-white/10'
                      : 'bg-white text-[#666666] hover:text-[#111111] hover:bg-neutral-100 border border-[#E5E5E5] shadow-xs'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Project Grid: 1 col on mobile, 2-3 col on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.28, delay: Math.min(index * 0.03, 0.15), ease: [0.16, 1, 0.3, 1] }}
                onClick={() => onSelectProject(project)}
                className={`group rounded-2xl overflow-hidden border transition-all duration-200 flex flex-col justify-between cursor-pointer active:scale-[0.99] active:border-[#FF2B2B] hover:-translate-y-1 ${
                  isDark
                    ? 'bg-[#111111] border-white/10 hover:border-[#FF2B2B]/60 shadow-lg'
                    : 'bg-white border-[#E5E5E5] hover:border-[#E50914]/60 shadow-sm'
                }`}
                id={`project-card-${project.id}`}
              >
                {/* Image Container with Zoom & Overlay */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#181818]">
                  <img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-400 ease-out"
                    loading="lazy"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Category Pill on Image */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                    <span className="px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-mono-tech font-extrabold tracking-widest uppercase bg-[#080808]/90 text-white border border-white/15 backdrop-blur-md">
                      {project.categoryLabel}
                    </span>
                  </div>

                  {/* Hover/Tap Quick Action Badge */}
                  <div className="absolute bottom-3 right-3 sm:right-4 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 text-[10px] sm:text-[11px] font-mono-tech font-bold text-[#FF2B2B] bg-[#0A0A0A]/90 px-2.5 sm:px-3 py-1 rounded-full border border-[#FF2B2B]/40">
                    <span>EXPLORE</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 sm:p-6 md:p-7 flex flex-col justify-between flex-1">
                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2.5 sm:mb-3">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className={`text-[9px] sm:text-[10px] font-mono-tech px-2 py-0.5 rounded border ${
                            isDark
                              ? 'text-[#A8A8A8] bg-[#161616] border-white/5'
                              : 'text-[#666666] bg-neutral-100 border-[#E5E5E5]'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <h3 className={`font-display font-black text-lg sm:text-xl transition-colors mb-1.5 sm:mb-2 tracking-tight ${
                      isDark ? 'text-white group-hover:text-[#FF2B2B]' : 'text-[#111111] group-hover:text-[#E50914]'
                    }`}>
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className={`text-xs leading-relaxed line-clamp-2 mb-4 sm:mb-6 ${
                      isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
                    }`}>
                      {project.shortDescription}
                    </p>
                  </div>

                  {/* Bottom Action */}
                  <div className={`pt-3 sm:pt-4 border-t flex items-center justify-between text-[11px] sm:text-xs font-extrabold uppercase tracking-wider transition-colors ${
                    isDark
                      ? 'border-white/10 text-white group-hover:text-[#FF2B2B]'
                      : 'border-[#E5E5E5] text-[#111111] group-hover:text-[#E50914]'
                  }`}>
                    <span>VIEW PROJECT</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1.5 duration-200" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
