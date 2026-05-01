import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { FileJson, Sparkles, Copy, CheckCircle2, Video, AlertCircle, Lightbulb, Wand2, Key, X, Check, Search, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CONTENT_IDEAS } from './ideas';

const DEFAULT_TOPIC = `The Gold Cycle: From Discovery to Processing. 
1. Scene 1: Ultra-modern 3D isometric view of a mountain fracture revealing glowing golden veins. Sleek UI overlays point to 'Discovery Zone' with clean kinetic typography.
2. Scene 2: High-speed dynamic camera swoops down a digital stream simulation. Gold nuggets are highlighted with glowing outlines as they settle. Glassmorphism data panels show transport velocity.
3. Scene 3: Clean, high-tech industrial processing facility. A futuristic 3D infographic breaks down the smelting process with neon-lit progress bars and holographic gold purity statistics.`;

export default function App() {
  const ITEMS_PER_PAGE = 6;
  const [ideaPage, setIdeaPage] = useState(0);
  const [userApiKey, setUserApiKey] = useState(() => localStorage.getItem('user_gemini_api_key') || '');
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [idea, setIdea] = useState("Konten edukasi tentang pertambangan emas, mulai dari penemuannya, proses pengambilan hingga pengolahan");
  const [isGeneratingConcept, setIsGeneratingConcept] = useState(false);
  const [topic, setTopic] = useState(DEFAULT_TOPIC);
  const [jsonOutput, setJsonOutput] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalIdeas = CONTENT_IDEAS.length;
  const startIndex = ideaPage * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalIdeas);
  const currentIdeas = CONTENT_IDEAS.slice(startIndex, endIndex);

  const handleNextIdeas = () => {
    setIdeaPage((prev) => (prev + 1) * ITEMS_PER_PAGE >= totalIdeas ? 0 : prev + 1);
  };

  const handlePrevIdeas = () => {
    setIdeaPage((prev) => prev === 0 ? Math.floor((totalIdeas - 1) / ITEMS_PER_PAGE) : prev - 1);
  };

  const getAiInstance = () => {
    const key = userApiKey.trim() || process.env.GEMINI_API_KEY;
    if (!key) {
      setShowApiSettings(true);
      throw new Error("API Key is missing. Please enter your Gemini API Key in the settings.");
    }
    return new GoogleGenAI({ apiKey: key });
  };

  const saveApiKey = (key: string) => {
    setUserApiKey(key);
    localStorage.setItem('user_gemini_api_key', key);
  };

  const generateConcept = async () => {
    setIsGeneratingConcept(true);
    setError(null);

    try {
      const ai = getAiInstance();
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
      const ai = getAiInstance();
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
        <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-8 mb-8 space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-5">
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
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowApiSettings(!showApiSettings)}
              className={`p-3 rounded-2xl border transition-all ${
                userApiKey 
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20' 
                  : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white'
              }`}
              title="API Key Settings"
            >
              <Key className="w-5 h-5" />
            </button>
            
            <AnimatePresence>
              {showApiSettings && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-3 w-80 bg-neutral-900/90 backdrop-blur-3xl border border-white/10 rounded-2xl p-5 shadow-2xl z-50 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-500" />
                      API Key Settings
                    </h3>
                    <button onClick={() => setShowApiSettings(false)} className="text-neutral-500 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
                    Enter your own Google Gemini API key to override the default system key. Your key is stored securely in your browser's local storage.
                  </p>
                  
                  <input
                    type="password"
                    value={userApiKey}
                    onChange={(e) => saveApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-neutral-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-neutral-700 font-mono"
                  />
                  
                  {userApiKey && (
                    <div className="mt-3 flex items-center space-x-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg text-xs font-medium">
                      <Check className="w-4 h-4" />
                      <span>Custom API key active</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
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
              
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-neutral-400 tracking-wider">
                  QUICK IDEAS <span className="text-neutral-600 font-normal">({startIndex + 1}-{endIndex} of {totalIdeas})</span>
                </p>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={handlePrevIdeas}
                    className="text-xs flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 px-2 py-1 rounded-md"
                  >
                    <ChevronLeft className="w-3 h-3" />
                    <span>Prev</span>
                  </button>
                  <button 
                    onClick={handleNextIdeas}
                    className="text-xs flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 px-2 py-1 rounded-md"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-5 max-h-[140px] overflow-y-auto custom-scrollbar pr-1">
                <AnimatePresence mode="popLayout">
                  {currentIdeas.map((preset, idx) => (
                    <motion.button
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      key={preset}
                      onClick={() => setIdea(preset)}
                      className="text-[11px] px-3 py-1.5 bg-neutral-800/50 hover:bg-blue-500/20 text-neutral-300 hover:text-blue-300 rounded-full border border-white/5 hover:border-blue-500/30 transition-all text-left flex-1 min-w-[200px]"
                    >
                      {preset}
                    </motion.button>
                  ))}
                </AnimatePresence>
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
