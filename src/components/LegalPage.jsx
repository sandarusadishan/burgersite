import React from 'react';
import { Card } from './ui/card';
import { ShieldCheck } from 'lucide-react';

const LegalPage = ({ title, lastUpdated, content }) => {
  return (
    <main className="flex-grow py-24 bg-[#050505] min-h-screen relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#FFB800]/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-[#FFB800]/10 border border-[#FFB800]/20">
                <ShieldCheck className="w-8 h-8 text-[#FFB800]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-white mb-4">
            {title}
            </h1>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-500">
            Last Updated: <span className="text-[#FFB800]">{lastUpdated}</span>
            </p>
        </div>

        <Card className="p-8 md:p-12 bg-[#09090b]/60 border border-white/5 backdrop-blur-md rounded-3xl shadow-2xl relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          
          <div className="space-y-10 relative z-10">
            {content.map((section, index) => (
                <div key={index} className="space-y-4 border-b border-white/5 pb-8 last:border-b-0 last:pb-0">
                <h2 className="text-xl font-bold text-white uppercase tracking-wide flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-[#FFB800] rounded-full shadow-[0_0_10px_#FFB800]" />
                    {section.title}
                </h2>
                <ul className="space-y-3">
                    {section.sections.map((item, i) => (
                    <li key={i} className="text-sm text-gray-400 font-light leading-relaxed pl-4 border-l border-white/10 hover:border-[#FFB800]/50 hover:text-gray-300 transition-colors">
                        {item}
                    </li>
                    ))}
                </ul>
                </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                For any questions regarding this policy, please <span className="text-[#FFB800] cursor-pointer hover:underline">contact us</span>.
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default LegalPage;