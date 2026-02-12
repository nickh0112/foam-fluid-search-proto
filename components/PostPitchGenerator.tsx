import React, { useState } from 'react';
import { PostDockItem } from '../types';
import { generatePostPitchText } from '../services/gemini';
import { X, Mail, FileText, Sparkles, ArrowLeft, Copy, Check, Film, Image, BookOpen, Clapperboard, Megaphone } from 'lucide-react';

interface PostPitchGeneratorProps {
  items: PostDockItem[];
  onClose: () => void;
}

type Step = 'select' | 'input' | 'generating' | 'result';
type PitchType = 'email' | 'mediakit';

const CONTENT_TYPE_ICON: Record<string, typeof Film> = {
  Reel: Film,
  Story: BookOpen,
  Post: Image,
  Video: Clapperboard,
  Paid: Megaphone,
};

const PostPitchGenerator: React.FC<PostPitchGeneratorProps> = ({ items, onClose }) => {
  const [step, setStep] = useState<Step>('select');
  const [pitchType, setPitchType] = useState<PitchType>('email');
  const [context, setContext] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSelectType = (type: PitchType) => {
    setPitchType(type);
    setStep('input');
  };

  const handleGenerate = async () => {
    setStep('generating');
    const text = await generatePostPitchText(items, pitchType, context);
    setGeneratedText(text);
    setStep('result');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute inset-0 z-50 bg-zinc-950 flex font-sans animate-fade-in">

      {/* LEFT SIDEBAR: Selected Posts */}
      <div className="w-1/4 h-full border-r border-zinc-800 bg-zinc-950 p-6 flex flex-col">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 flex items-center">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
            Selected Posts ({items.length})
        </h3>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10">
          {items.map((item) => {
            const ContentIcon = CONTENT_TYPE_ICON[item.post.contentType] || Film;
            return (
              <div key={item.post.id} className="mb-4 relative group">
                <div className="relative flex items-start space-x-3 p-2.5 bg-zinc-900/40 rounded-lg border border-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-900 transition-all group-hover:border-zinc-700">
                    {/* Thumbnail */}
                    <div className="relative w-9 h-12 bg-black rounded overflow-hidden flex-shrink-0 border border-zinc-800 shadow-sm">
                        <img src={item.post.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity" alt="thumb" />
                    </div>

                    {/* Details */}
                    <div className="min-w-0 py-0.5">
                        <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-bold mb-0.5 flex items-center">
                            <ContentIcon size={9} className="mr-1" />
                            {item.post.contentType}
                        </div>
                        <div className="text-xs text-zinc-400 line-clamp-2 leading-tight group-hover:text-zinc-200 transition-colors">
                            {item.post.caption.slice(0, 80)}{item.post.caption.length > 80 ? '...' : ''}
                        </div>
                        {item.note && (
                            <div className="text-[9px] text-blue-400/80 mt-1 truncate italic border-l-2 border-blue-500/20 pl-1.5">
                                {item.note}
                            </div>
                        )}
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CENTER: Main Workflow */}
      <div className="w-3/4 h-full relative flex flex-col bg-zinc-950">

        {/* Header */}
        <div className="h-16 flex items-center justify-between px-8 border-b border-zinc-800/50">
           <div className="flex items-center space-x-2">
              <Sparkles size={14} className="text-blue-500" />
              <span className="font-mono text-xs text-blue-400 uppercase tracking-widest">Pitch Generator Active</span>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-full text-zinc-500 hover:text-white transition-colors">
              <X size={20} />
           </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-10 relative overflow-hidden">

           {/* Background Decor */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

           {/* STEP 1: SELECT TYPE */}
           {step === 'select' && (
             <div className="w-full max-w-4xl grid grid-cols-2 gap-6 animate-fade-in-up">
                <button
                  onClick={() => handleSelectType('email')}
                  className="group relative h-72 bg-zinc-900/30 border border-zinc-800 hover:border-blue-500/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all hover:bg-zinc-900/60 hover:shadow-2xl hover:shadow-blue-900/10"
                >
                   <div className="w-14 h-14 bg-zinc-800/80 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-zinc-400 group-hover:text-blue-400 border border-zinc-700 group-hover:border-blue-500/30">
                      <Mail size={28} />
                   </div>
                   <h2 className="text-xl font-bold text-white mb-2">Draft Email</h2>
                   <p className="text-xs text-zinc-500 px-8 leading-relaxed">Generate a personalized outreach email pitching these specific posts and their performance.</p>
                </button>

                <button
                  onClick={() => handleSelectType('mediakit')}
                  className="group relative h-72 bg-zinc-900/30 border border-zinc-800 hover:border-purple-500/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all hover:bg-zinc-900/60 hover:shadow-2xl hover:shadow-purple-900/10"
                >
                   <div className="w-14 h-14 bg-zinc-800/80 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-zinc-400 group-hover:text-purple-400 border border-zinc-700 group-hover:border-purple-500/30">
                      <FileText size={28} />
                   </div>
                   <h2 className="text-xl font-bold text-white mb-2">Mediakit Summary</h2>
                   <p className="text-xs text-zinc-500 px-8 leading-relaxed">Create a structured overview of the selected posts, their stats, and why they stand out.</p>
                </button>
             </div>
           )}

           {/* STEP 2: INPUT CONTEXT */}
           {step === 'input' && (
             <div className="w-full max-w-2xl animate-fade-in">
                <button onClick={() => setStep('select')} className="mb-6 flex items-center text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-mono uppercase tracking-wide">
                   <ArrowLeft size={12} className="mr-2" /> Back to selection
                </button>

                <h1 className="text-2xl font-bold text-white mb-2">Add Context</h1>
                <p className="text-zinc-400 mb-8 text-sm">Who are you writing to? Any specific campaign details?</p>

                <div className="bg-zinc-900/50 p-1 rounded-xl border border-zinc-800 focus-within:border-blue-500/50 transition-colors shadow-lg">
                   <textarea
                     value={context}
                     onChange={(e) => setContext(e.target.value)}
                     placeholder="E.g. Pitching to Nike for their Summer Run campaign. Highlighting these posts that show authentic brand usage..."
                     className="w-full h-40 bg-transparent text-white p-4 resize-none outline-none placeholder-zinc-600 font-sans text-base"
                     autoFocus
                   />
                </div>

                <div className="mt-8 flex justify-end">
                   <button
                     onClick={handleGenerate}
                     className="px-6 py-3 bg-white text-black rounded-lg font-bold flex items-center hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] text-sm"
                   >
                     <Sparkles size={16} className="mr-2" />
                     Generate {pitchType === 'email' ? 'Email' : 'Summary'}
                   </button>
                </div>
             </div>
           )}

           {/* STEP 3: GENERATING */}
           {step === 'generating' && (
             <div className="flex flex-col items-center justify-center animate-fade-in">
                <div className="relative w-20 h-20 mb-8">
                   <div className="absolute inset-0 border-2 border-zinc-800 rounded-full" />
                   <div className="absolute inset-0 border-2 border-blue-500 rounded-full border-t-transparent animate-spin" />
                   <Sparkles className="absolute inset-0 m-auto text-blue-400 animate-pulse" size={24} />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Crafting your pitch...</h2>
                <p className="text-zinc-500 font-mono text-xs">Analyzing {items.length} selected posts</p>
             </div>
           )}

           {/* STEP 4: RESULT */}
           {step === 'result' && (
             <div className="w-full max-w-3xl h-full flex flex-col py-4 animate-fade-in">
                 <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white flex items-center">
                       <Check size={18} className="text-green-500 mr-2" /> Generated {pitchType === 'email' ? 'Email' : 'Summary'}
                    </h2>
                    <div className="flex space-x-3">
                       <button
                         onClick={handleCopy}
                         className={`px-3 py-1.5 rounded-lg border flex items-center text-xs font-medium transition-colors ${copied ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'border-zinc-700 hover:bg-zinc-800 text-zinc-300'}`}
                       >
                          {copied ? <Check size={14} className="mr-2" /> : <Copy size={14} className="mr-2" />}
                          {copied ? 'Copied' : 'Copy Text'}
                       </button>
                       <button onClick={onClose} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors">
                          Done
                       </button>
                    </div>
                 </div>

                 <div className="flex-1 bg-zinc-900 rounded-xl border border-zinc-800 p-8 overflow-y-auto custom-scrollbar shadow-inner">
                    <pre className="font-sans text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                       {generatedText}
                    </pre>
                 </div>
             </div>
           )}

        </div>
      </div>

    </div>
  );
};

export default PostPitchGenerator;
