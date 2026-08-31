import React from 'react';
import { motion } from 'motion/react';
import { 
  Code2, 
  Palette, 
  Film, 
  TrendingUp, 
  Sparkles, 
  Layers, 
  Globe, 
  Layout, 
  FileCode2, 
  Zap, 
  Share2, 
  Check 
} from 'lucide-react';
import { SKILLS_DATA } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

export const Skills: React.FC = () => {
  const { isDark } = useTheme();

  const getSkillIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileCode2':
        return FileCode2;
      case 'Palette':
        return Palette;
      case 'Code':
        return Code2;
      case 'Layers':
        return Layers;
      case 'Globe':
        return Globe;
      case 'Sparkles':
        return Sparkles;
      case 'Layout':
        return Layout;
      case 'Film':
        return Film;
      case 'Zap':
        return Zap;
      case 'Share2':
        return Share2;
      default:
        return Code2;
    }
  };

  const softwareTools = [
    { name: 'Visual Studio Code', type: 'Development', badge: 'Dev' },
    { name: 'Figma', type: 'UI / UX Design', badge: 'Design' },
    { name: 'Adobe Premiere Pro', type: 'Video Editing', badge: 'Video' },
    { name: 'Adobe Photoshop', type: 'Visual Assets', badge: 'Graphics' },
    { name: 'Adobe After Effects', type: 'Motion Design', badge: 'Motion' },
    { name: 'Tailwind CSS', type: 'Frontend Styling', badge: 'CSS' },
  ];

  return (
    <section 
      id="skills" 
      className={`py-16 sm:py-20 md:py-24 relative overflow-hidden transition-colors duration-300 border-t ${
        isDark ? 'bg-[#080808] border-white/5' : 'bg-[#F7F7F7] border-[#E5E5E5]'
      }`}
    >
      {/* Ambient background glow */}
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#FF2B2B]/5 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 gap-4 sm:gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FF2B2B]"></span>
              <span className={`font-mono-tech text-[11px] sm:text-xs uppercase tracking-[0.25em] font-bold ${
                isDark ? 'text-[#FF2B2B]' : 'text-[#E50914]'
              }`}>
                MY SKILLS
              </span>
            </div>

            <h2 className={`font-display font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] transition-colors ${
              isDark ? 'text-white' : 'text-[#111111]'
            }`}>
              TOOLS & SKILLS<br />
              <span className="text-gradient-red">I WORK WITH</span>
            </h2>
          </div>

          <p className={`text-xs sm:text-sm max-w-md leading-relaxed transition-colors ${
            isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
          }`}>
            Proficient across the full modern creative-tech pipeline — from code syntax to graphic layout and video post-production.
          </p>
        </div>

        {/* Core Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-10 sm:mb-14">
          {SKILLS_DATA.map((skill, index) => {
            const Icon = getSkillIcon(skill.icon);
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.2), ease: [0.16, 1, 0.3, 1] }}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1 ${
                  isDark
                    ? 'bg-[#111111] hover:bg-[#151515] border-white/10 hover:border-[#FF2B2B]/50 shadow-md'
                    : 'bg-white hover:bg-neutral-50 border-[#E5E5E5] hover:border-[#E50914]/50 shadow-xs'
                }`}
              >
                <div>
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center mb-3 sm:mb-4 transition-colors ${
                    isDark 
                      ? 'bg-[#181818] border-white/10 group-hover:border-[#FF2B2B]/40' 
                      : 'bg-neutral-100 border-[#E5E5E5] group-hover:border-[#E50914]/40'
                  }`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF2B2B]" />
                  </div>

                  <span className={`text-[9px] sm:text-[10px] font-mono-tech uppercase tracking-wider block mb-1 font-bold ${
                    isDark ? 'text-[#FF2B2B]' : 'text-[#E50914]'
                  }`}>
                    {skill.category}
                  </span>

                  <h3 className={`font-display font-extrabold text-sm sm:text-base mb-1.5 sm:mb-2 transition-colors ${
                    isDark ? 'text-white' : 'text-[#111111]'
                  }`}>
                    {skill.name}
                  </h3>
                </div>

                <p className={`text-[11px] leading-relaxed font-light pt-2 border-t transition-colors ${
                  isDark ? 'border-white/5 text-[#A8A8A8]' : 'border-[#E5E5E5] text-[#666666]'
                }`}>
                  {skill.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Software & Production Toolchain Banner */}
        <div className={`rounded-2xl p-5 sm:p-7 md:p-8 border transition-colors ${
          isDark ? 'bg-[#111111] border-white/10 shadow-xl' : 'bg-white border-[#E5E5E5] shadow-sm'
        }`}>
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between pb-5 sm:pb-6 mb-5 sm:mb-6 border-b gap-3 ${
            isDark ? 'border-white/10' : 'border-[#E5E5E5]'
          }`}>
            <div>
              <span className={`font-mono-tech text-[10px] sm:text-xs uppercase tracking-widest block font-bold mb-1 ${
                isDark ? 'text-[#FF2B2B]' : 'text-[#E50914]'
              }`}>
                PRODUCTION TOOLCHAIN
              </span>
              <h3 className={`font-display font-black text-lg sm:text-xl transition-colors ${
                isDark ? 'text-white' : 'text-[#111111]'
              }`}>
                Industry-Standard Creative Software & Environments
              </h3>
            </div>
            <span className={`text-[10px] sm:text-xs font-mono-tech px-3 py-1.5 rounded-full border w-fit font-bold ${
              isDark 
                ? 'bg-[#0A0A0A] text-[#A8A8A8] border-white/10' 
                : 'bg-neutral-100 text-[#666666] border-[#E5E5E5]'
            }`}>
              Direct & Optimized Workflow
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
            {softwareTools.map((tool) => (
              <div
                key={tool.name}
                className={`p-3 sm:p-3.5 rounded-xl border transition-all flex flex-col justify-between group ${
                  isDark
                    ? 'bg-[#0A0A0A] border-white/5 hover:border-white/20'
                    : 'bg-neutral-50 border-[#E5E5E5] hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[9px] sm:text-[10px] font-mono-tech px-1.5 py-0.5 rounded font-bold ${
                    isDark ? 'bg-[#181818] text-[#FF2B2B]' : 'bg-neutral-200 text-[#E50914]'
                  }`}>
                    {tool.badge}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </div>
                <span className={`font-bold text-xs block transition-colors ${
                  isDark ? 'text-white' : 'text-[#111111]'
                }`}>{tool.name}</span>
                <span className={`text-[10px] font-mono-tech mt-1 ${
                  isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
                }`}>{tool.type}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
