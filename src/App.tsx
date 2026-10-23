import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Linkedin, 
  Mail, 
  Share2, 
  Check, 
  Copy, 
  ExternalLink, 
  X, 
  Award, 
  GraduationCap, 
  Briefcase, 
  Gauge, 
  Download, 
  ChevronRight, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  QrCode, 
  Volume2, 
  VolumeX, 
  FileCheck2,
  Compass,
  Users,
  Eye
} from 'lucide-react';
import { RESUME_PDF_BASE64 } from './data/resumePdfBase64';

export default function App() {
  // Modal states: 'resume' | 'linkedin' | 'share' | 'contact'
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [resumeTab, setResumeTab] = useState<'experience' | 'education' | 'skills' | 'achievements' | 'document'>('experience');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  // Initialize persistent blob URL from base64 PDF
  useEffect(() => {
    try {
      const base64Data = RESUME_PDF_BASE64.replace(/^data:application\/pdf;base64,/, '');
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const pdfBlob = new Blob([byteNumbers], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdfBlob);
      setPdfBlobUrl(url);
      return () => {
        window.URL.revokeObjectURL(url);
      };
    } catch (e) {
      console.error("Error creating PDF blob URL", e);
    }
  }, []);

  // Audio synthesizer for subtle champagne clicks
  const playSubtleChime = (freq = 880) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // AudioContext unavailable or restricted
    }
  };

  // Toast Notification helper
  const showToast = (message: string) => {
    playSubtleChime(1046.5); // C6 chime
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Robust, guaranteed-valid PDF download handler using pure binary Blob
  const handleDownloadResumePdf = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    playSubtleChime();

    try {
      // Extract base64 payload
      const base64Data = RESUME_PDF_BASE64.replace(/^data:application\/pdf;base64,/, '');
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      // Explicit application/pdf Blob
      const pdfBlob = new Blob([byteNumbers], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(pdfBlob);

      // Trigger programmatic download on same-origin blob: URL
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = 'Akif_Danish_Resume.pdf';
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      }, 3000);

      showToast("Resume PDF downloaded successfully!");
    } catch (err) {
      console.error("Blob download error, using data URL fallback", err);
      const a = document.createElement('a');
      a.href = RESUME_PDF_BASE64;
      a.download = 'Akif_Danish_Resume.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast("Resume PDF downloaded!");
    }
  };

  // Open PDF directly in a new tab
  const handleViewResumeOnline = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    playSubtleChime();
    if (pdfBlobUrl) {
      window.open(pdfBlobUrl, '_blank');
      return;
    }
    try {
      const base64Data = RESUME_PDF_BASE64.replace(/^data:application\/pdf;base64,/, '');
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const pdfBlob = new Blob([byteNumbers], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(pdfBlob);
      window.open(blobUrl, '_blank');
    } catch {
      window.open('/Akif_Danish_Resume.pdf', '_blank');
    }
  };

  const copyEmailToClipboard = () => {
    const email = "akif.danish@yahoo.com";
    navigator.clipboard.writeText(email).then(() => {
      showToast("Email copied to clipboard!");
    }).catch(() => {
      showToast("Email: akif.danish@yahoo.com");
    });
  };

  const copyPageUrl = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast("Profile link copied to clipboard!");
    }).catch(() => {
      showToast("Link ready to share!");
    });
  };

  // Keyboard escape listener to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Download digital vCard
  const downloadVCard = () => {
    playSubtleChime();
    const vcardContent = `BEGIN:VCARD
VERSION:3.0
FN:Akif Danish Bin Aidi
TITLE:Energy Audit Assistant Engineer | Diploma in FM
EMAIL;TYPE=INTERNET:akif.danish@yahoo.com
TEL;TYPE=CELL:+6587152270
NOTE:Built Environment enthusiast with hands-on experience spanning SCDF experience, M&E data logging, and energy auditing. SP Diploma in Facilities Management (Director's Honour Roll), BSD Energy Audit Intern, SCDF Wall of Fame 2023. Available May 2027.
URL:https://www.linkedin.com/in/akif-danish
END:VCARD`;
    const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Akif_Danish_Bin_Aidi.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Contact vCard downloaded!");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E5E7EB] relative selection:bg-[#D4AF37]/25 selection:text-[#F3E5AB] pb-16 overflow-x-hidden">
      
      {/* Background Architectural Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top champagne amber radial */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-gradient-to-b from-[#D4AF37]/10 via-[#D4AF37]/3 to-transparent blur-[120px] rounded-full" />
        {/* Bottom-right obsidian highlight */}
        <div className="absolute top-[40%] -right-48 w-[400px] h-[400px] bg-[#1A1A22]/50 blur-[100px] rounded-full" />
        {/* Subtle grid texture */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(rgba(212, 175, 55, 0.4) 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* Main Container - Mobile-first width (max-w-xl) */}
      <main className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        
        {/* Top Control Bar: Audio Toggle & Share */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[11px] tracking-[0.2em] uppercase font-mono text-[#D4AF37]/80 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              Executive Profile
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                showToast(soundEnabled ? "Sound muted" : "Audio cues enabled");
              }}
              title={soundEnabled ? "Mute subtle audio" : "Enable audio"}
              className="p-2 rounded-full bg-[#141416]/80 border border-[#D4AF37]/20 text-[#9CA3AF] hover:text-[#F3E5AB] hover:border-[#D4AF37]/40 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                playSubtleChime();
                setActiveModal('share');
              }}
              title="Share Profile"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141416]/80 border border-[#D4AF37]/20 text-xs font-medium text-[#9CA3AF] hover:text-[#F3E5AB] hover:border-[#D4AF37]/40 transition-all hover:shadow-[0_0_15px_-3px_rgba(212,175,55,0.2)]"
            >
              <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            HEADER / PROFILE SECTION
        ======================================================== */}
        <section className="text-center flex flex-col items-center">
          
          {/* Avatar Container: 100px x 100px circular crop, sleek 2px warm gold border & subtle gold glow ring */}
          <div 
            className="relative group cursor-pointer mb-5" 
            onClick={() => setActiveModal('resume')}
            title="Click to view Master Resume"
          >
            <img
              src="/profile-pic.jpg"
              alt="Akif Danish Bin Aidi"
              className="w-[100px] h-[100px] rounded-full object-cover object-[60%_25%] transition-transform duration-500 group-hover:scale-105"
              style={{
                border: '2px solid #D4AF37',
                boxShadow: '0 0 15px rgba(212, 175, 55, 0.3)'
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/aistudio/image_e8eb6859.png';
              }}
            />

            {/* Verification badge */}
            <div className="absolute -bottom-1 right-0 bg-[#141416] p-1.5 rounded-full border border-[#D4AF37]/70 shadow-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            </div>
          </div>

          {/* Name - Playfair Display Luxury Serif */}
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1.5 bg-gradient-to-r from-[#FFFFFF] via-[#F3E5AB] to-[#D4AF37] bg-clip-text text-transparent">
            Akif Danish Bin Aidi
          </h1>

          {/* Subtitle / Tagline */}
          <p className="text-xs sm:text-sm font-medium tracking-wide uppercase text-[#D4AF37] mb-3.5 px-2">
            Energy Audit Assistant Engineer | Diploma in FM
          </p>

          {/* Status Badge: "Available for Executive Roles from Mid-May 2027" */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141416]/95 border border-[#10B981]/30 text-xs text-[#E5E7EB] shadow-[0_0_18px_-4px_rgba(16,185,129,0.2)] mb-5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]" />
            </span>
            <span className="font-medium text-emerald-300">
              Available for Executive Roles from Mid-May 2027
            </span>
          </div>

          {/* Bio Paragraph */}
          <div className="max-w-md px-2 text-xs sm:text-[13px] leading-relaxed text-[#9CA3AF] mb-6">
            <p>
              Built Environment enthusiast with hands-on experience spanning SCDF experience, M&amp;E data logging, and energy auditing.
            </p>
          </div>

          {/* Quick Action Buttons: Email Copy & Direct Contact */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-7">
            <button
              onClick={copyEmailToClipboard}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#141416] hover:bg-[#1A1A1E] border border-[#D4AF37]/30 text-xs font-semibold text-[#F3E5AB] transition-all duration-200 active:scale-[0.98] shadow-[0_4px_16px_rgba(0,0,0,0.5)] group"
            >
              <Copy className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              <span>Copy Email</span>
            </button>

            <button
              onClick={() => {
                playSubtleChime();
                setActiveModal('contact');
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E6CA65] hover:to-[#D4AF37] text-[#0A0A0B] text-xs font-semibold transition-all duration-200 active:scale-[0.98] shadow-[0_0_20px_-3px_rgba(212,175,55,0.4)]"
            >
              <Mail className="w-3.5 h-3.5 text-[#0A0A0B]" />
              <span>Get in Touch</span>
            </button>
          </div>

          {/* Executive Key Credentials Ribbon */}
          <div className="w-full py-2.5 px-3 rounded-xl bg-[#141416]/60 border border-[#D4AF37]/15 mb-7 flex items-center justify-around text-[11px] text-[#A1A1AA]">
            <div className="flex flex-col items-center">
              <span className="font-semibold text-[#F3E5AB]">SP Honour Roll</span>
              <span className="text-[10px] text-[#71717A]">ABE Prize Winner</span>
            </div>
            <div className="h-4 w-[1px] bg-[#D4AF37]/20" />
            <div className="flex flex-col items-center text-center">
              <span className="font-semibold text-[#F3E5AB]">BSD 1 Year Attachment</span>
              <span className="text-[10px] text-[#71717A]">Energy Auditing Department</span>
            </div>
            <div className="h-4 w-[1px] bg-[#D4AF37]/20" />
            <div className="flex flex-col items-center">
              <span className="font-semibold text-[#F3E5AB]">SCDF Logistics</span>
              <span className="text-[10px] text-[#71717A]">Wall of Fame 2023</span>
            </div>
          </div>
        </section>

        {/* ========================================================
            CORE INTERACTIVE LINK CARDS
        ======================================================== */}
        <section className="space-y-3.5">

          {/* Card 1: Master Resume */}
          <div
            onClick={() => {
              playSubtleChime();
              setActiveModal('resume');
            }}
            className="group relative cursor-pointer rounded-2xl glass-gold-card p-4 sm:p-5 flex items-center justify-between text-left transition-all duration-300"
          >
            <div className="flex items-center gap-3.5 sm:gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1A1A1E] border border-[#D4AF37]/30 flex items-center justify-center shrink-0 group-hover:border-[#D4AF37] group-hover:bg-[#222228] transition-colors shadow-inner">
                <FileText className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-semibold text-white group-hover:text-[#F3E5AB] transition-colors">
                    📄 Master Resume
                  </h2>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#D4AF37]/15 text-[#D4AF37] font-mono border border-[#D4AF37]/30">
                    PDF Attached
                  </span>
                </div>
                <p className="text-xs text-[#9CA3AF] mt-0.5 leading-snug">
                  View academic achievements, internship history &amp; technical skills
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#141416] border border-[#D4AF37]/20 flex items-center justify-center shrink-0 text-[#9CA3AF] group-hover:text-[#F3E5AB] group-hover:border-[#D4AF37]/60 group-hover:translate-x-1 transition-all">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: Professional Networking (LinkedIn) */}
          <div
            onClick={() => {
              playSubtleChime();
              setActiveModal('linkedin');
            }}
            className="group relative cursor-pointer rounded-2xl glass-gold-card p-4 sm:p-5 flex items-center justify-between text-left transition-all duration-300"
          >
            <div className="flex items-center gap-3.5 sm:gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1A1A1E] border border-[#D4AF37]/30 flex items-center justify-center shrink-0 group-hover:border-[#D4AF37] group-hover:bg-[#222228] transition-colors shadow-inner">
                <Linkedin className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-semibold text-white group-hover:text-[#F3E5AB] transition-colors">
                    💼 Connect on LinkedIn
                  </h2>
                  <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]/70" />
                </div>
                <p className="text-xs text-[#9CA3AF] mt-0.5 leading-snug">
                  www.linkedin.com/in/akif-danish · Network &amp; industry connections
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#141416] border border-[#D4AF37]/20 flex items-center justify-center shrink-0 text-[#9CA3AF] group-hover:text-[#F3E5AB] group-hover:border-[#D4AF37]/60 group-hover:translate-x-1 transition-all">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

        </section>

        {/* ========================================================
            IN-PAGE FEATURED PRESS & MEDIA SECTION
            (Positioned directly BELOW "Connect on LinkedIn")
        ======================================================== */}
        <section className="mt-8 space-y-4">
          
          {/* Section Header with Subtle Gold Accent Divider */}
          <div className="pt-2">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span>📰</span>
              <span>Media Coverage &amp; Press Features</span>
            </h2>
            <div className="h-[1px] w-full bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/40 to-transparent mt-2" />
          </div>

          {/* Inline Article Cards Grid */}
          <div className="space-y-4 pt-1">
            
            {/* Article 1: Berita Mediacorp */}
            <article className="rounded-2xl overflow-hidden glass-gold-card border border-[#D4AF37]/30 transition-all hover:border-[#D4AF37]/55 shadow-lg group">
              {/* Thumbnail Container */}
              <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-[#141416]">
                <img
                  src="/mediacorp_feature.jpg"
                  alt="Berita Mediacorp Feature"
                  className="w-full h-full object-cover object-[60%_25%] group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/aistudio/img_3296.jpg_26cf397e.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-[#141416]/30 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#ED1C24] text-white shadow-md">
                    Berita Mediacorp
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37]">
                    Overseas Tech Journey
                  </span>
                </div>

                <h3 className="font-serif text-sm sm:text-base font-bold text-white group-hover:text-[#F3E5AB] transition-colors leading-snug">
                  MENDAKI bawa 16 pelajar ke China, beri pendedahan kepada AI, teknologi
                </h3>

                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  Highlighted as one of 16 youth leaders selected for MENDAKI&apos;s overseas learning journey to Shenzhen and Guangzhou, gaining exposure to AI, smart city infrastructure, and deep technology.
                </p>

                <div className="pt-2">
                  <a
                    href="https://berita.mediacorp.sg/singapura/mendaki-bawa-16-pelajar-ke-china-beri-pendedahan-kepada-ai-teknologi-1074881"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playSubtleChime()}
                    className="inline-flex items-center justify-between w-full sm:w-auto gap-2 px-4 py-2 rounded-xl bg-[#1A1A1E] hover:bg-[#222228] border border-[#D4AF37]/35 text-xs font-semibold text-[#F3E5AB] transition-all hover:border-[#D4AF37] group-hover:shadow-[0_0_15px_-3px_rgba(212,175,55,0.2)]"
                  >
                    <span>Read Article on Berita Mediacorp</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </a>
                </div>
              </div>
            </article>

            {/* Article 2: Berita Harian */}
            <article className="rounded-2xl overflow-hidden glass-gold-card border border-[#D4AF37]/30 transition-all hover:border-[#D4AF37]/55 shadow-lg group">
              {/* Thumbnail Container */}
              <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-[#141416]">
                <img
                  src="/berita_harian_feature.webp"
                  alt="Berita Harian Feature"
                  className="w-full h-full object-cover object-[50%_15%] group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/aistudio/berita_harian_084abcca.webp';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-[#141416]/30 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#00529B] text-white shadow-md">
                    Berita Harian
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37]">
                    Youth Leadership &amp; Service
                  </span>
                </div>

                <h3 className="font-serif text-sm sm:text-base font-bold text-white group-hover:text-[#F3E5AB] transition-colors leading-snug">
                  Desmond: Kekalkan nilai murni, sumbang kepada masyarakat
                </h3>

                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  Featured for active involvement in national youth leadership, polytechnic representation, and community engagement.
                </p>

                <div className="pt-2">
                  <a
                    href="https://www.beritaharian.sg/singapura/pendidikan/desmond-kekalkan-nilai-murni-sumbang-kepada-masyarakat"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playSubtleChime()}
                    className="inline-flex items-center justify-between w-full sm:w-auto gap-2 px-4 py-2 rounded-xl bg-[#1A1A1E] hover:bg-[#222228] border border-[#D4AF37]/35 text-xs font-semibold text-[#F3E5AB] transition-all hover:border-[#D4AF37] group-hover:shadow-[0_0_15px_-3px_rgba(212,175,55,0.2)]"
                  >
                    <span>Read Article on Berita Harian</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </a>
                </div>
              </div>
            </article>

          </div>
        </section>

        {/* Quick Contact & Footer Card */}
        <section className="mt-10 pt-6 border-t border-[#D4AF37]/15 text-center">
          <div className="flex items-center justify-center gap-6 mb-4">
            <button
              onClick={copyEmailToClipboard}
              className="text-[#9CA3AF] hover:text-[#F3E5AB] transition-colors text-xs flex items-center gap-1.5"
            >
              <Mail className="w-4 h-4 text-[#D4AF37]" />
              <span>akif.danish@yahoo.com</span>
            </button>
            <span className="text-[#3A3A40]">·</span>
            <button
              onClick={handleDownloadResumePdf}
              className="text-[#9CA3AF] hover:text-[#F3E5AB] transition-colors text-xs flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-[#D4AF37]" />
              <span>Resume PDF</span>
            </button>
          </div>

          <p className="text-[11px] text-[#71717A] tracking-wider uppercase">
            Singapore · Built Environment · Energy Efficiency · Facilities Management
          </p>
        </section>

      </main>

      {/* ========================================================
          TOAST NOTIFICATION POPUP
      ======================================================== */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#1A1A1E] border border-[#D4AF37] text-xs font-medium text-white shadow-[0_0_25px_rgba(212,175,55,0.35)] animate-bounce">
          <Check className="w-4 h-4 text-[#D4AF37]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================
          MODAL 1: MASTER RESUME (With Guaranteed Valid PDF Download)
      ======================================================== */}
      {activeModal === 'resume' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
          <div 
            className="relative w-full max-w-2xl h-[92vh] sm:h-[88vh] flex flex-col bg-[#141416] border border-[#D4AF37]/40 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Prominent Gold Action Buttons */}
            <div className="p-4 sm:p-5 border-b border-[#D4AF37]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#18181C] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#202026] border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-white">Master Resume &amp; Credentials</h2>
                  <p className="text-[11px] text-[#9CA3AF]">Akif Danish Bin Aidi · Energy Audit Assistant Engineer</p>
                </div>
              </div>

              {/* Action Buttons: Direct Download + View In New Tab */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleDownloadResumePdf}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E6CA65] hover:to-[#D4AF37] text-[#0A0A0B] text-xs font-semibold shadow-[0_0_15px_rgba(212,175,55,0.35)] transition-all active:scale-[0.98]"
                >
                  <Download className="w-4 h-4 text-[#0A0A0B]" />
                  <span>📥 Download Full PDF Resume</span>
                </button>
                <button
                  onClick={handleViewResumeOnline}
                  title="Open PDF in new tab"
                  className="p-2 rounded-xl bg-[#202026] border border-[#D4AF37]/30 text-[#F3E5AB] hover:text-white hover:bg-[#282830] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 rounded-xl bg-[#202026] border border-[#D4AF37]/20 text-[#9CA3AF] hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Tabs - Fully visible 5-option segmented control */}
            <div className="w-full border-b border-[#D4AF37]/20 bg-[#121214] p-1.5 sm:p-2 shrink-0">
              <div className="grid grid-cols-5 gap-1 sm:gap-2">
                <button
                  onClick={() => {
                    playSubtleChime();
                    setResumeTab('experience');
                  }}
                  className={`flex flex-col sm:flex-row items-center justify-center py-2 px-1 sm:px-2 rounded-xl text-center transition-all ${
                    resumeTab === 'experience'
                      ? 'bg-[#D4AF37]/20 text-[#F3E5AB] border border-[#D4AF37]/60 shadow-[0_0_12px_rgba(212,175,55,0.2)] font-semibold'
                      : 'bg-[#18181C]/70 text-[#9CA3AF] border border-transparent hover:text-white hover:bg-[#202026] hover:border-[#D4AF37]/20'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37] shrink-0 mb-1 sm:mb-0 sm:mr-1.5" />
                  <span className="text-[10px] sm:text-xs tracking-tight truncate">Experience</span>
                </button>

                <button
                  onClick={() => {
                    playSubtleChime();
                    setResumeTab('education');
                  }}
                  className={`flex flex-col sm:flex-row items-center justify-center py-2 px-1 sm:px-2 rounded-xl text-center transition-all ${
                    resumeTab === 'education'
                      ? 'bg-[#D4AF37]/20 text-[#F3E5AB] border border-[#D4AF37]/60 shadow-[0_0_12px_rgba(212,175,55,0.2)] font-semibold'
                      : 'bg-[#18181C]/70 text-[#9CA3AF] border border-transparent hover:text-white hover:bg-[#202026] hover:border-[#D4AF37]/20'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37] shrink-0 mb-1 sm:mb-0 sm:mr-1.5" />
                  <span className="text-[10px] sm:text-xs tracking-tight truncate">Education</span>
                </button>

                <button
                  onClick={() => {
                    playSubtleChime();
                    setResumeTab('skills');
                  }}
                  className={`flex flex-col sm:flex-row items-center justify-center py-2 px-1 sm:px-2 rounded-xl text-center transition-all ${
                    resumeTab === 'skills'
                      ? 'bg-[#D4AF37]/20 text-[#F3E5AB] border border-[#D4AF37]/60 shadow-[0_0_12px_rgba(212,175,55,0.2)] font-semibold'
                      : 'bg-[#18181C]/70 text-[#9CA3AF] border border-transparent hover:text-white hover:bg-[#202026] hover:border-[#D4AF37]/20'
                  }`}
                >
                  <Gauge className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37] shrink-0 mb-1 sm:mb-0 sm:mr-1.5" />
                  <span className="text-[10px] sm:text-xs tracking-tight truncate">Skills</span>
                </button>

                <button
                  onClick={() => {
                    playSubtleChime();
                    setResumeTab('achievements');
                  }}
                  className={`flex flex-col sm:flex-row items-center justify-center py-2 px-1 sm:px-2 rounded-xl text-center transition-all ${
                    resumeTab === 'achievements'
                      ? 'bg-[#D4AF37]/20 text-[#F3E5AB] border border-[#D4AF37]/60 shadow-[0_0_12px_rgba(212,175,55,0.2)] font-semibold'
                      : 'bg-[#18181C]/70 text-[#9CA3AF] border border-transparent hover:text-white hover:bg-[#202026] hover:border-[#D4AF37]/20'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37] shrink-0 mb-1 sm:mb-0 sm:mr-1.5" />
                  <span className="text-[10px] sm:text-xs tracking-tight truncate">Awards</span>
                </button>

                <button
                  onClick={() => {
                    playSubtleChime();
                    setResumeTab('document');
                  }}
                  className={`flex flex-col sm:flex-row items-center justify-center py-2 px-1 sm:px-2 rounded-xl text-center transition-all ${
                    resumeTab === 'document'
                      ? 'bg-[#D4AF37]/20 text-[#F3E5AB] border border-[#D4AF37]/60 shadow-[0_0_12px_rgba(212,175,55,0.2)] font-semibold'
                      : 'bg-[#18181C]/70 text-[#D4AF37] border border-[#D4AF37]/25 hover:text-white hover:bg-[#202026]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37] shrink-0 mb-1 sm:mb-0 sm:mr-1.5" />
                  <span className="text-[10px] sm:text-xs tracking-tight truncate font-semibold">PDF Doc</span>
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body - Expands to fill available space */}
            <div className="flex-1 min-h-0 p-4 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-[#D1D5DB]">

              {/* Tab 1: Experience */}
              {resumeTab === 'experience' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-[#1A1A1E] border border-[#D4AF37]/25">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <div>
                        <h3 className="font-semibold text-white text-sm sm:text-base flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-[#D4AF37]" />
                          Assistant Energy Auditor (Year-long Internship)
                        </h3>
                        <p className="text-xs text-[#D4AF37]">Building Systems &amp; Diagnostics · 03/2026 – 01/2027</p>
                      </div>
                      <span className="text-[11px] font-mono text-[#9CA3AF] bg-[#141416] px-2 py-0.5 rounded border border-[#D4AF37]/15">
                        Central Chiller Plants
                      </span>
                    </div>

                    <ul className="list-disc list-inside space-y-1.5 text-xs text-[#9CA3AF] pl-1">
                      <li>Collaborated directly with facility teams and contractors to coordinate site surveys, troubleshoot issues, and oversee reinstatement works.</li>
                      <li>Conducted site measurements and data collection for chiller plants, AHUs, PAHUs, and FCUs, including temperature, pressure, airflow, and electrical metrics.</li>
                      <li>Analysed BMS data and metered outputs to evaluate HVAC system performance, energy consumption, and operational efficiency.</li>
                      <li>Installed, retrieved, and validated field logging equipment including power meters, ultrasonic flow meters, and temperature immersion sensors.</li>
                      <li>Prepared and validated Excel-based datasets, heat balance calculations, and technical reports for energy audit and building performance projects.</li>
                      <li>Supported MEI and EEOA-related assessments, including building energy benchmarking and tenant consumption analysis.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-[#1A1A1E] border border-[#D4AF37]/20">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <div>
                        <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                          Operation Logistic Assistant (National Service)
                        </h3>
                        <p className="text-xs text-[#D4AF37]">Singapore Civil Defence Force (SCDF) · 02/2022 – 02/2024</p>
                      </div>
                      <span className="text-[11px] font-mono text-[#9CA3AF] bg-[#141416] px-2 py-0.5 rounded border border-[#D4AF37]/15">
                        Wall of Fame 2023
                      </span>
                    </div>

                    <ul className="list-disc list-inside space-y-1.5 text-xs text-[#9CA3AF] pl-1">
                      <li>Coordinated logistics, venue readiness, and facility setups for large-scale national events (NDP 2023, SCDF Workplan Seminar) and international delegate programs.</li>
                      <li>Conducted routine site checks to maintain safety, cleanliness, and operational readiness standards across accommodation facilities.</li>
                      <li>Supported dormitory preparations for international trainees and delegates, coordinating essential supplies, equipment, and room readiness prior to arrival.</li>
                      <li>Liaised with external vendors and internal teams to streamline site setups and equipment deployment, ensuring adherence to service timelines.</li>
                      <li>Managed asset inventory tracking, equipment allocation, deployment, and return with zero-loss accountability.</li>
                      <li>Awarded SCDF Wall of Fame (2023) for demonstrating exceptional customer-centric service, professionalism, and operational excellence.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab 2: Education */}
              {resumeTab === 'education' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#1A1A1E] border border-[#D4AF37]/30">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <div>
                        <h3 className="font-semibold text-white text-sm sm:text-base flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
                          Diploma in Facilities Management
                        </h3>
                        <p className="text-xs text-[#D4AF37]">Singapore Polytechnic · School of Architecture &amp; the Built Environment (Expected 04/2027)</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                      <div className="p-3 rounded-lg bg-[#141416] border border-[#D4AF37]/20">
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#F3E5AB]">
                          <Award className="w-4 h-4 text-[#D4AF37]" />
                          Director&apos;s Honour Roll (2024/2025)
                        </div>
                        <p className="text-[11px] text-[#9CA3AF] mt-1">
                          Recognized for achieving top academic results across the School of Architecture and the Built Environment cohort.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-[#141416] border border-[#D4AF37]/20">
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#F3E5AB]">
                          <Award className="w-4 h-4 text-[#D4AF37]" />
                          ABE Prize (2024/2025)
                        </div>
                        <p className="text-[11px] text-[#9CA3AF] mt-1">
                          Awarded for outstanding academic performance in specialized built environment and engineering modules.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#D4AF37]/15">
                      <p className="text-xs font-semibold text-white mb-1.5">Foundational Studies:</p>
                      <div className="space-y-1.5 text-xs text-[#9CA3AF]">
                        <p>• <span className="text-white font-medium">Singapore Polytechnic (01/2021):</span> Diploma in Electrical and Electronic Engineering (Completed 5 semesters).</p>
                        <p>• <span className="text-white font-medium">Regent Secondary School (01/2019):</span> GCE O-Level Certificate.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Skills */}
              {resumeTab === 'skills' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    
                    <div className="p-3.5 rounded-xl bg-[#1A1A1E] border border-[#D4AF37]/20">
                      <h4 className="text-xs font-semibold text-[#F3E5AB] flex items-center gap-1.5 mb-2">
                        <Gauge className="w-3.5 h-3.5 text-[#D4AF37]" />
                        Core FM &amp; Operations
                      </h4>
                      <ul className="space-y-1 text-xs text-[#9CA3AF]">
                        <li>• Site &amp; Facility Readiness</li>
                        <li>• Vendor &amp; Contractor Coordination</li>
                        <li>• Defect Inspection &amp; Rectification</li>
                        <li>• Occupant Service Delivery</li>
                        <li>• Asset Inventory Tracking &amp; Staging</li>
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#1A1A1E] border border-[#D4AF37]/20">
                      <h4 className="text-xs font-semibold text-[#F3E5AB] flex items-center gap-1.5 mb-2">
                        <Cpu className="w-3.5 h-3.5 text-[#D4AF37]" />
                        Technical &amp; M&amp;E Auditing
                      </h4>
                      <ul className="space-y-1 text-xs text-[#9CA3AF]">
                        <li>• Building Management Systems (BMS)</li>
                        <li>• Energy Data Analysis &amp; Benchmarking</li>
                        <li>• Chiller Plant / HVAC Diagnostics</li>
                        <li>• Ultrasonic Flow Meters &amp; Power Meters</li>
                        <li>• AutoCAD (M&amp;E layouts &amp; schematics)</li>
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#1A1A1E] border border-[#D4AF37]/20">
                      <h4 className="text-xs font-semibold text-[#F3E5AB] flex items-center gap-1.5 mb-2">
                        <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                        Software &amp; Tools
                      </h4>
                      <ul className="space-y-1 text-xs text-[#9CA3AF]">
                        <li>• Python (Data Analysis &amp; Sensor Cleanups)</li>
                        <li>• Microsoft Power BI (Energy Dashboards)</li>
                        <li>• Microsoft Excel (Complex Heat Balance Models)</li>
                        <li>• BMS Telemetry &amp; Loggers</li>
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#1A1A1E] border border-[#D4AF37]/20">
                      <h4 className="text-xs font-semibold text-[#F3E5AB] flex items-center gap-1.5 mb-2">
                        <FileCheck2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                        Standards &amp; Compliance
                      </h4>
                      <ul className="space-y-1 text-xs text-[#9CA3AF]">
                        <li>• Singapore Standard SS 530</li>
                        <li>• BCA Green Mark Benchmarking &amp; MEI/EEOA</li>
                        <li>• SCDF Fire Safety &amp; Emergency Readiness</li>
                        <li>• Stakeholder &amp; Contractor Communication</li>
                      </ul>
                    </div>

                  </div>
                </div>
              )}

              {/* Tab 4: Achievements */}
              {resumeTab === 'achievements' && (
                <div className="space-y-3.5">
                  <div className="p-4 rounded-xl bg-[#1A1A1E] border border-[#D4AF37]/30 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#2A2A32] text-[#D4AF37] shrink-0 mt-0.5">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">SCDF Wall of Fame Award (2023)</h4>
                      <p className="text-xs text-[#D4AF37] mt-0.5">Singapore Civil Defence Force</p>
                      <p className="text-xs text-[#9CA3AF] mt-1.5 leading-relaxed">
                        Recognized for displaying customer-centric behavior, service excellence, and exceptional performance in logistics support operations.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#1A1A1E] border border-[#D4AF37]/30 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#2A2A32] text-[#D4AF37] shrink-0 mt-0.5">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Singapore Young Leaders Programme (2025)</h4>
                      <p className="text-xs text-[#D4AF37] mt-0.5">Ministry of Education (MOE) Singapore</p>
                      <p className="text-xs text-[#9CA3AF] mt-1.5 leading-relaxed">
                        Awarded Certificate of Achievement by MOE Singapore for engaging in collaborative problem-solving, strategic leadership workshops, and youth-led community engagement.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#1A1A1E] border border-[#D4AF37]/30 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#2A2A32] text-[#D4AF37] shrink-0 mt-0.5">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">ABE Prize &amp; Director&apos;s Honour Roll (2024/2025)</h4>
                      <p className="text-xs text-[#D4AF37] mt-0.5">Singapore Polytechnic · School of Architecture &amp; the Built Environment</p>
                      <p className="text-xs text-[#9CA3AF] mt-1.5 leading-relaxed">
                        Conferred for sustained top-tier academic results and outstanding subject mastery across built environment modules.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Direct PDF Document Viewer */}
              {resumeTab === 'document' && (
                <div className="space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-[#1A1A1E] border border-[#D4AF37]/30 gap-2">
                    <span className="text-xs text-[#F3E5AB] font-medium">
                      Official 2-Page Resume Document
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDownloadResumePdf}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-[#0A0A0B] font-semibold text-xs hover:opacity-95 shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download (.pdf)</span>
                      </button>
                      <button
                        onClick={handleViewResumeOnline}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#222228] text-[#F3E5AB] font-medium text-xs hover:bg-[#2A2A32] border border-[#D4AF37]/30"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Open in New Tab</span>
                      </button>
                    </div>
                  </div>

                  <div className="w-full h-[520px] sm:h-[580px] rounded-xl overflow-hidden border border-[#D4AF37]/25 bg-[#141416] shadow-inner relative">
                    <object
                      data={pdfBlobUrl ? `${pdfBlobUrl}#toolbar=1&navpanes=0` : `${RESUME_PDF_BASE64}#toolbar=1&navpanes=0`}
                      type="application/pdf"
                      className="w-full h-full rounded-xl"
                    >
                      <iframe
                        src={pdfBlobUrl ? `${pdfBlobUrl}#toolbar=1&navpanes=0` : `${RESUME_PDF_BASE64}#toolbar=1&navpanes=0`}
                        title="Akif Danish Resume PDF Viewer"
                        className="w-full h-full rounded-xl border-0"
                      >
                        <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-[#18181C]">
                          <FileText className="w-12 h-12 text-[#D4AF37] mb-3" />
                          <h4 className="text-sm font-semibold text-white mb-1">Akif Danish Bin Aidi · Official Resume</h4>
                          <p className="text-xs text-[#9CA3AF] max-w-sm mb-4">
                            Your device browser requires external viewing. You can download or view the full 2-page document directly:
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleDownloadResumePdf}
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-xs font-semibold text-[#0A0A0B]"
                            >
                              Download Resume PDF
                            </button>
                            <button
                              onClick={handleViewResumeOnline}
                              className="px-4 py-2 rounded-xl bg-[#222228] border border-[#D4AF37]/40 text-xs text-[#F3E5AB]"
                            >
                              Open in New Tab
                            </button>
                          </div>
                        </div>
                      </iframe>
                    </object>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer CTA */}
            <div className="p-4 border-t border-[#D4AF37]/20 bg-[#18181C] flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-[#9CA3AF] text-center sm:text-left">
                Available for Executive Appointments from Mid-May 2027
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={copyEmailToClipboard}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#222228] border border-[#D4AF37]/30 text-xs font-medium text-[#F3E5AB] hover:bg-[#2A2A32] transition-colors"
                >
                  Copy Email
                </button>
                <button
                  onClick={handleDownloadResumePdf}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-xs font-semibold text-[#0A0A0B] hover:opacity-95 transition-opacity text-center flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-[#0A0A0B]" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: LINKEDIN & PROFESSIONAL NETWORKING
      ======================================================== */}
      {activeModal === 'linkedin' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
          <div 
            className="relative w-full max-w-md bg-[#141416] border border-[#D4AF37]/40 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden p-5 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#0077B5]/20 border border-[#0077B5]/40 flex items-center justify-center">
                  <Linkedin className="w-5 h-5 text-[#0077B5]" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-white">Connect on LinkedIn</h3>
                  <p className="text-[11px] text-[#9CA3AF]">Akif Danish Bin Aidi</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg bg-[#202026] text-[#9CA3AF] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#9CA3AF] mb-5 leading-relaxed">
              Connect to discuss energy auditing, BMS operations, facilities management, or professional opportunities.
            </p>

            <div className="space-y-2.5 mb-5">
              <a
                href="https://www.linkedin.com/in/akif-danish"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playSubtleChime()}
                className="flex items-center justify-between p-3 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white text-xs font-semibold transition-all shadow-lg shadow-[#0077B5]/20"
              >
                <span className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  <span>Open LinkedIn Profile</span>
                </span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <div className="p-3 rounded-xl bg-[#1A1A1E] border border-[#D4AF37]/25 flex items-center justify-between">
                <span className="text-xs font-mono text-[#F3E5AB] truncate select-all">
                  www.linkedin.com/in/akif-danish
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("https://www.linkedin.com/in/akif-danish");
                    showToast("LinkedIn link copied!");
                  }}
                  className="p-1 text-[#D4AF37] hover:text-[#F3E5AB] transition-colors ml-2 shrink-0"
                  title="Copy link"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleDownloadResumePdf}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#1A1A1E] hover:bg-[#222228] border border-[#D4AF37]/20 text-xs font-medium text-[#F3E5AB] transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Download Master Resume PDF</span>
              </button>

              <button
                onClick={downloadVCard}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#1A1A1E] hover:bg-[#222228] border border-[#D4AF37]/20 text-xs font-medium text-[#9CA3AF] hover:text-white transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Save Contact Card (.vcf)</span>
              </button>
            </div>

            <div className="pt-3 border-t border-[#D4AF37]/15 text-center">
              <span className="text-[11px] text-[#71717A]">
                Available for professional connections &amp; opportunities
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: SHARE PROFILE (QR Code & Socials)
      ======================================================== */}
      {activeModal === 'share' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
          <div 
            className="relative w-full max-w-sm bg-[#141416] border border-[#D4AF37]/40 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden p-5 sm:p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#D4AF37]" />
                Share Digital Profile
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg bg-[#202026] text-[#9CA3AF] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#9CA3AF] mb-4">
              Scan this QR code with a smartphone camera or copy the profile link.
            </p>

            {/* SVG QR Code */}
            <div className="w-44 h-44 mx-auto p-3 rounded-xl bg-white border-2 border-[#D4AF37] flex items-center justify-center shadow-lg mb-4">
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <QrCode className="w-36 h-36 text-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#141416] border-2 border-[#D4AF37] flex items-center justify-center">
                    <span className="font-serif text-[11px] font-bold text-[#F3E5AB]">AD</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="font-serif text-sm font-semibold text-[#F3E5AB] mb-1">
              Akif Danish Bin Aidi
            </p>
            <p className="text-[11px] text-[#9CA3AF] mb-4">
              Energy Audit Assistant Engineer | Diploma in FM
            </p>

            <div className="space-y-2">
              <button
                onClick={copyPageUrl}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-xs font-semibold text-[#0A0A0B] hover:opacity-95 transition-opacity"
              >
                <Copy className="w-3.5 h-3.5 text-[#0A0A0B]" />
                <span>Copy Page Link</span>
              </button>

              <button
                onClick={handleDownloadResumePdf}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1A1A1E] hover:bg-[#222228] border border-[#D4AF37]/30 text-xs font-medium text-[#F3E5AB] transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Download Resume PDF</span>
              </button>

              <button
                onClick={downloadVCard}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1A1A1E] hover:bg-[#222228] border border-[#D4AF37]/20 text-xs font-medium text-[#9CA3AF] hover:text-white transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Download vCard Contact</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 4: GET IN TOUCH / DIRECT INQUIRY
      ======================================================== */}
      {activeModal === 'contact' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
          <div 
            className="relative w-full max-w-md bg-[#141416] border border-[#D4AF37]/40 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden p-5 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#202026] border border-[#D4AF37]/30 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-white">Direct Executive Contact</h3>
                  <p className="text-[11px] text-[#9CA3AF]">Akif Danish Bin Aidi</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg bg-[#202026] text-[#9CA3AF] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#9CA3AF] mb-4 leading-relaxed">
              Available for built environment engineering discussions, energy audits, and corporate roles commencing mid-May 2027.
            </p>

            <div className="p-3.5 rounded-xl bg-[#1A1A1E] border border-[#D4AF37]/25 mb-4">
              <span className="text-[11px] text-[#71717A] uppercase tracking-wider block mb-1">Direct Email:</span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs sm:text-sm text-[#F3E5AB] font-semibold select-all">
                  akif.danish@yahoo.com
                </span>
                <button
                  onClick={copyEmailToClipboard}
                  className="p-1.5 rounded-lg bg-[#141416] text-[#D4AF37] hover:bg-[#202026] transition-colors"
                  title="Copy email"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <a
                href="mailto:akif.danish@yahoo.com?subject=Inquiry%20-%20Energy%20Audit%20Assistant%20Engineer&body=Dear%20Akif%2C%0A%0AI%20came%20across%20your%20Link-in-Bio%20landing%20page%20and%20would%20like%20to%20connect%20regarding..."
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-xs font-semibold text-[#0A0A0B] hover:opacity-95 transition-opacity"
              >
                <Mail className="w-4 h-4 text-[#0A0A0B]" />
                <span>Compose Email (akif.danish@yahoo.com)</span>
              </a>

              <button
                onClick={handleDownloadResumePdf}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1A1A1E] hover:bg-[#222228] border border-[#D4AF37]/25 text-xs font-medium text-[#F3E5AB] transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Download Master Resume PDF</span>
              </button>

              <button
                onClick={downloadVCard}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1A1A1E] hover:bg-[#222228] border border-[#D4AF37]/20 text-xs font-medium text-[#D1D5DB] transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Save to Phone Contacts (.vcf)</span>
              </button>
            </div>

            <p className="text-[11px] text-[#71717A] text-center">
              Response turnaround within 24–48 hours
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
