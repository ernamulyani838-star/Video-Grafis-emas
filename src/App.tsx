import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { FileJson, Sparkles, Copy, CheckCircle2, Video, AlertCircle, Lightbulb, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const DEFAULT_TOPIC = `The Gold Cycle: From Discovery to Processing. 
1. Scene 1: Ultra-modern 3D isometric view of a mountain fracture revealing glowing golden veins. Sleek UI overlays point to 'Discovery Zone' with clean kinetic typography.
2. Scene 2: High-speed dynamic camera swoops down a digital stream simulation. Gold nuggets are highlighted with glowing outlines as they settle. Glassmorphism data panels show transport velocity.
3. Scene 3: Clean, high-tech industrial processing facility. A futuristic 3D infographic breaks down the smelting process with neon-lit progress bars and holographic gold purity statistics.`;

export default function App() {
  const [idea, setIdea] = useState("Konten edukasi tentang pertambangan emas, mulai dari penemuannya, proses pengambilan hingga pengolahan");
  const [isGeneratingConcept, setIsGeneratingConcept] = useState(false);
  const [topic, setTopic] = useState(DEFAULT_TOPIC);
  const [jsonOutput, setJsonOutput] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateConcept = async () => {
    setIsGeneratingConcept(true);
    setError(null);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an expert director for viral short-form educational videos (TikTok/Reels/Shorts).
        Based on the following idea, create a detailed, highly visual video concept structured exactly into 3 scenes. Each scene is 8 seconds long.
        Write the descriptions in English so it works best for AI video generators. Focus on ultra-modern infographic storytelling, sleek UI/HUD overlays, dynamic camera movements, and trendy kinetic typography. Also, include a brief voice-over script for each scene.

        CRITICAL VIRALITY RULES:
        - Scene 1 MUST start with a strong "Curiosity Hook" (e.g., "The hidden secret of...", "What they don't tell you about...").
        - Scene 3 MUST end with a visual/audio setup that seamlessly loops back to the start of Scene 1.

        Idea: ${idea}
        
        Format the output strictly as:
        [Title of the Video]
        
        1. Scene 1 (The Hook):
           - Visuals: [Detailed visual description emphasizing modern 3D motion graphics...]
           - Voice Over: [Spoken hook script that fits an 8-second duration...]
        2. Scene 2 (The Core):
           - Visuals: [Detailed visual description emphasizing modern 3D motion graphics...]
           - Voice Over: [Spoken script that fits an 8-second duration...]
        3. Scene 3 (The Loop):
           - Visuals: [Detailed visual description emphasizing modern 3D motion graphics...]
           - Voice Over: [Spoken script that fits an 8-second duration...]`,
      });

      if (response.text) {
        setTopic(response.text);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate concept. Please try again.');
    } finally {
      setIsGeneratingConcept(false);
    }
  };

  const generatePrompt = async () => {
    setIsGenerating(true);
    setError(null);
    setJsonOutput(null);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an expert AI video generation prompt engineer. 
        Create a detailed JSON prompt for an AI video generator based on the following topic.
        
        Topic: ${topic}
        
        Requirements:
        - The video MUST be exactly 3 scenes.
        - Each scene MUST have a duration of exactly 8 seconds.
        - The visual style MUST be "Ultra-modern 3D motion graphics, sleek HUD infographic overlays, glowing neon accents, clean kinetic typography, smooth camera tracking, trendy glassmorphism elements, high-end digital aesthetic".
        - Include on-screen text labels that should appear smoothly in the scenes to explain the process.
        - Include a voice-over script for each scene that is precisely paced to fit the 8-second duration.
        - Suggest modern, impactful sound effects (SFX) to enhance the visual transitions and info-graphics.
        
        Respond ONLY with a valid JSON object matching exactly this structure:
        {
          "video_title": "...",
          "style_reference": "Ultra-modern 3D motion graphics, sleek HUD elements, glowing accents, clean kinetic typography, trendy glassmorphism",
          "scenes": [
            {
              "scene_number": 1,
              "duration": "8s",
              "visual_description": "Detailed prompt describing the 3D visuals, lighting, and tech-inspired environment. Include strong hook mechanics.",
              "camera_movement": "Specific dynamic camera animation instructions.",
              "on_screen_text_labels": ["Label 1", "Label 2"],
              "sound_effects": ["Digital whoosh", "Deep bass drop", "Futuristic UI ping"],
              "voice_over_script": "The spoken script that will visually match this 8-second scene."
            }
          ]
        }`,
      });

      let text = response.text || '';
      // Clean up markdown formatting if present
      if (text.startsWith('\`\`\`json')) {
        text = text.replace(/\`\`\`json\n?/, '').replace(/\`\`\`$/, '');
      } else if (text.startsWith('\`\`\`')) {
        text = text.replace(/\`\`\`\n?/, '').replace(/\`\`\`$/, '');
      }
      
      // Validate JSON formatting implicitly
      const parsed = JSON.parse(text); 
      setJsonOutput(JSON.stringify(parsed, null, 2));
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate JSON prompt. Please check your API key or try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (jsonOutput) {
      navigator.clipboard.writeText(jsonOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#030305] text-neutral-200 font-sans p-6 md:p-12 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-6xl mx-auto space-y-8 relative z-10"
      >
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-5 border-b border-white/5 pb-8 mb-8">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-16 h-16 shrink-0 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)] border border-amber-300/20"
          >
            <Video className="w-8 h-8" />
          </motion.div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-white to-neutral-400 tracking-tight">
              Modern Infographic Prompts
            </h1>
            <p className="text-neutral-400 text-sm md:text-base mt-2 font-medium max-w-2xl">
              Turn your ideas into ultra-modern, trendy 3D motion graphics prompts structured exactly as JSON for AI video models.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            
            {/* 1. Idea Generator */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-neutral-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl"
            >
              <div className="flex items-center space-x-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/20">
                  <span className="font-bold text-sm">1</span>
                </div>
                <label className="text-sm font-bold text-neutral-300 tracking-widest uppercase">
                  Initial Idea
                </label>
              </div>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                className="w-full h-24 bg-black/40 border border-white/5 rounded-2xl p-4 text-sm text-neutral-200 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all outline-none resize-none mb-3 placeholder:text-neutral-700 font-medium"
                placeholder="What is your video about?"
              />
              
              <div className="flex flex-wrap gap-2 mb-5">
                {[
                  "Evolusi teknologi tambang emas: dari manual hingga AI",
                  "Proses kimiawi pemisahan emas dari bebatuan",
                  "Bagaimana aktivitas vulkanik membentuk urat emas",
                  "Dampak ekonomi vs lingkungan dari tambang emas modern"
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => setIdea(preset)}
                    className="text-[11px] px-3 py-1.5 bg-neutral-800/50 hover:bg-blue-500/20 text-neutral-400 hover:text-blue-300 rounded-full border border-white/5 hover:border-blue-500/30 transition-all text-left"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <button
                onClick={generateConcept}
                disabled={isGeneratingConcept || !idea.trim()}
                className="w-full py-3.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50 text-white font-medium rounded-2xl flex items-center justify-center space-x-2 transition-all hover:shadow-lg active:scale-[0.98]"
              >
                {isGeneratingConcept ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                    <span className="text-sm text-blue-300">Drafting Concept...</span>
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">Generate Concept Outline</span>
                  </>
                )}
              </button>
            </motion.div>

            {/* 2. Topic Editor */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-neutral-900/40 backdrop-blur-2xl border border-amber-500/20 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full" />
              
              <div className="flex items-center space-x-3 mb-2 relative z-10">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 border border-amber-500/20">
                  <span className="font-bold text-sm">2</span>
                </div>
                <label className="text-sm font-bold text-neutral-300 tracking-widest uppercase">
                  Video Concept & Structure
                </label>
              </div>
              <p className="text-xs text-neutral-500 mb-5 ml-11 relative z-10 font-medium">
                Refine the scene instructions. The AI will strictly format this into 3 scenes of 8 seconds each.
              </p>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full h-48 bg-black/40 border border-white/5 rounded-2xl p-5 text-sm leading-relaxed text-neutral-200 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all outline-none resize-none placeholder:text-neutral-700 font-medium relative z-10 custom-scrollbar"
                placeholder="Describe your highly detailed video concept here..."
              />
              
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={generatePrompt}
                disabled={isGenerating || !topic.trim()}
                className="mt-6 w-full py-4 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-neutral-500 text-white font-bold rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-[0_4px_20px_rgba(245,158,11,0.25)] relative z-10"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating JSON...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    <span>Generate 3-Scene JSON Prompt</span>
                  </>
                )}
              </motion.button>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-start space-x-3 backdrop-blur-md"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Output Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-neutral-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl overflow-hidden flex flex-col shadow-2xl h-[calc(100vh-12rem)] min-h-[600px] lg:h-auto lg:min-h-full"
          >
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-black/20">
              <div className="flex items-center space-x-3 text-neutral-300">
                <div className="p-1.5 bg-emerald-500/20 rounded-lg border border-emerald-500/20">
                  <FileJson className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-xs font-bold tracking-widest text-neutral-400">PROMPT_OUTPUT.JSON</span>
              </div>
              <button
                onClick={copyToClipboard}
                disabled={!jsonOutput}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white disabled:opacity-50 transition-all active:scale-95 border border-white/5"
                title="Copy JSON"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="p-6 md:p-8 bg-[#050508]/80 flex-1 overflow-auto custom-scrollbar relative">
              <AnimatePresence mode="wait">
                {jsonOutput ? (
                  <motion.pre 
                    key="code"
                    initial={{ opacity: 0, filter: 'blur(8px)', y: 10 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-[13px] leading-relaxed font-mono text-emerald-400/90 whitespace-pre-wrap break-words"
                  >
                    {jsonOutput}
                  </motion.pre>
                ) : (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-neutral-600 space-y-5 min-h-[300px]"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
                      <FileJson className="w-16 h-16 opacity-30 relative z-10 text-blue-300" />
                    </div>
                    <p className="text-sm font-semibold tracking-widest uppercase text-neutral-500">Waiting for generation...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
