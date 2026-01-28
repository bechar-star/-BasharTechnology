
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { ContentCategory, PortfolioItem, ChatMessage } from './types';
import { INITIAL_ITEMS } from './constants';
import { gemini, AIResponse } from './services/geminiService';

// --- الروابط المباشرة ---
const WHATSAPP_NUMBER = "22248885937"; 
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=السلام%20عليكم%20بشار%20تكنولوجي%20أود%20الاستفسار%20عن%20أعمالكم`;

// --- المكون الرسومي للشعار ---
const Logo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="basharGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="50%" stopColor="#4F46E5" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <path d="M50 5 L90 50 L50 95 L10 50 Z" fill="url(#basharGradient)" />
    <path d="M50 15 L80 50 L50 85 L20 50 Z" fill="white" fillOpacity="0.15" />
    <path d="M35 30 V70 M35 30 H55 C62 30 65 35 65 40 C65 45 62 50 55 50 H35 M55 50 C65 50 70 55 70 60 C70 65 65 70 55 70 H35" 
      stroke="white" 
      strokeWidth="6" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// --- مكون قائمة التنقل السفلية للهواتف (Bottom Nav) ---
const BottomNav = () => {
  const location = useLocation();
  const navItems = [
    { 
      name: 'الرئيسية', 
      path: '/', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg> 
    },
    { 
      name: 'السيرة الذاتية', 
      path: '/cv', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> 
    },
    { 
      name: 'المشرف', 
      path: '/admin', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg> 
    },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex justify-around items-center p-3 px-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-indigo-600 dark:text-indigo-400 scale-110' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
              <div className={`${isActive ? 'bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-xl' : 'p-2'}`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

// --- مكون قائمة الهاتف المتقدمة (Side Drawer) ---
const MobileMenu = ({ isOpen, onClose, isDark, onToggleTheme }: { isOpen: boolean, onClose: () => void, isDark: boolean, onToggleTheme: () => void }) => {
  const menuLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'السيرة الذاتية', path: '/cv' },
    { name: 'بوابة المشرف', path: '/admin', highlight: true },
  ];

  return (
    <div className={`fixed inset-0 z-[110] transition-all duration-500 ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={onClose}></div>
      <div className={`absolute left-0 top-0 bottom-0 w-[80%] max-w-sm bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col text-right" dir="rtl">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-3">
              <Logo className="w-8 h-8" />
              <span className="font-black text-slate-800 dark:text-white">بشار تكنولوجي</span>
            </div>
            <button onClick={onClose} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <nav className="flex-1 space-y-4">
            {menuLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={onClose} className={`block p-4 rounded-2xl text-lg font-bold transition-all ${link.highlight ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="mt-auto pt-8 border-t dark:border-slate-800 space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-400">الوضع الليلي</span>
              <button onClick={onToggleTheme} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400">
                {isDark ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- صفحة السيرة الذاتية ---
const CVPage = () => {
  const skills = [
    { name: 'الذكاء الاصطناعي و LLMs', level: '95%' },
    { name: 'التحول الرقمي Cloud Solutions', level: '90%' },
    { name: 'الأمن السيبراني ISO 27001', level: '85%' },
    { name: 'تطوير التطبيقات (Flutter & React)', level: '95%' },
    { name: 'إنترنت الأشياء IoT', level: '80%' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="bg-slate-900 dark:bg-black p-10 md:p-16 text-white relative overflow-hidden text-center md:text-right">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 p-1">
              <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden"><Logo className="w-24 h-24" /></div>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-black mb-2">بشار عالي</h1>
              <p className="text-indigo-400 text-xl font-bold mb-4">مهندس برمجيات ومبتكر حلول رقمية</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-300">
                <span>📍 موريتانيا / نواكشوط</span>
                <span>📧 bashar@technology.mr</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-8 md:p-16 grid grid-cols-1 lg:grid-cols-3 gap-12 text-right">
          <div className="space-y-12">
            <section>
              <h3 className="text-xl font-black mb-6 border-r-4 border-indigo-600 pr-3 dark:text-white">المهارات التقنية</h3>
              <div className="space-y-6">
                {skills.map(skill => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2 text-sm font-bold dark:text-slate-300"><span>{skill.level}</span><span>{skill.name}</span></div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: skill.level }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h3 className="text-2xl font-black mb-6 border-r-4 border-indigo-600 pr-3 dark:text-white">الملخص المهني</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-loose text-lg font-medium">
                مهندس برمجيات شغوف بالابتكار التقني، أمتلك خبرة واسعة في قيادة مشاريع التحول الرقمي وتطوير الأنظمة الذكية. مؤسس "بشار تكنولوجي"، وهي منصة تهدف لتمكين المؤسسات من خلال حلول تقنية متقدمة تشمل الذكاء الاصطناعي، إنترنت الأشياء، وتأمين البيانات السيبرانية.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- مساعد الدردشة الذكي ---
const FloatingAIChat = ({ items }: { items: PortfolioItem[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string, sources?: {title: string, uri: string}[] }[]>([
    { role: 'model', text: 'أهلاً بك! أنا مساعد "بشار تكنولوجي" الذكي. كيف يمكنني مساعدتك اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);
    const result: AIResponse = await gemini.askWithSearch(userText, items);
    setMessages(prev => [...prev, { role: 'model', text: result.text, sources: result.sources }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-24 md:bottom-8 left-4 md:left-28 z-[60] dir-rtl">
      {isOpen ? (
        <div className="bg-white dark:bg-slate-900 w-[300px] sm:w-[400px] h-[450px] rounded-[2rem] shadow-2xl flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
            <span className="font-bold text-sm">بشار AI</span>
            <button onClick={() => setIsOpen(false)}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-slate-50 dark:bg-slate-950">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[90%] p-3 rounded-2xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-sm border dark:border-slate-700'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 border-t dark:border-slate-800 flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="اسأل..." className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2 text-xs outline-none dark:text-white"/>
            <button onClick={handleSend} className="bg-indigo-600 text-white p-2 rounded-xl text-xs px-4">ارسال</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="bg-indigo-600 text-white w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 border-4 border-white dark:border-slate-800"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg></button>
      )}
    </div>
  );
};

// --- مكون البطاقة (Card) ---
const Card: React.FC<{ item: PortfolioItem }> = ({ item }) => {
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  
  const targetUrl = useMemo(() => {
    if (item.youtubeId) return `https://www.youtube.com/watch?v=${item.youtubeId}`;
    if (item.pdfUrl && item.pdfUrl !== '#') return item.pdfUrl;
    if (item.url) return item.url;
    return null;
  }, [item]);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `${item.title}\n${item.description}\n${window.location.href}`;
    await navigator.clipboard.writeText(textToCopy);
    setShowCopyFeedback(true);
    setTimeout(() => setShowCopyFeedback(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all duration-500 group flex flex-col h-full shadow-sm">
      <div className="relative h-56 overflow-hidden">
        {targetUrl ? (
          <a href={targetUrl} target="_blank" rel="noopener noreferrer">
            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer" />
          </a>
        ) : (
          <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        )}
        <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur px-4 py-1.5 rounded-2xl text-xs font-bold text-indigo-600 dark:text-indigo-400 shadow-md">{item.category}</div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {targetUrl ? (
          <a href={targetUrl} target="_blank" rel="noopener noreferrer" className="group/title">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 group-hover/title:text-indigo-600 dark:group-hover/title:text-indigo-400 transition-colors cursor-pointer hover:underline decoration-2 underline-offset-4">
              {item.title}
            </h3>
          </a>
        ) : (
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">{item.title}</h3>
        )}

        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed line-clamp-4">{item.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-6 mt-auto">
          {item.tags.map(tag => <span key={tag} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full font-bold">#{tag}</span>)}
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            {targetUrl ? (
              <a href={targetUrl} target="_blank" rel="noopener noreferrer" className={`w-full h-full py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${item.youtubeId ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20 text-white' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20 text-white'}`}>
                {item.youtubeId ? 'فيديو' : item.pdfUrl ? 'مقال' : 'زيارة'}
              </a>
            ) : (
              <button className="w-full h-full bg-slate-800 dark:bg-indigo-600 text-white py-3 rounded-2xl text-sm font-bold opacity-50 cursor-not-allowed">مغلق</button>
            )}
          </div>
          <button onClick={handleShare} className="px-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-indigo-100 transition-all flex items-center justify-center">
            {showCopyFeedback ? '✓' : '🔗'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- الصفحة الرئيسية ---
const HomePage = ({ items }: { items: PortfolioItem[] }) => {
  const [filter, setFilter] = useState<ContentCategory>(ContentCategory.ALL);
  const [search, setSearch] = useState('');
  const filteredItems = useMemo(() => items.filter(item => (filter === ContentCategory.ALL || item.category === filter) && (item.title.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase()))), [filter, search, items]);
  return (
    <div className="min-h-screen pb-24 text-right">
      <section className="bg-slate-900 dark:bg-black text-white py-24 relative overflow-hidden text-center">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Logo className="w-20 h-20 mx-auto mb-8 drop-shadow-2xl" />
          <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight">بشار تكنولوجي</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">الابتكار الرقمي بقيادة المهندس <span className="text-white font-bold">بشار عالي</span></p>
          <div className="flex gap-4 justify-center px-4">
            <a href="#portfolio" className="bg-indigo-600 px-6 md:px-10 py-4 rounded-2xl font-bold shadow-xl hover:bg-indigo-700 transition-all text-sm md:text-base">تصفح الأعمال</a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] px-6 md:px-10 py-4 rounded-2xl font-bold shadow-xl text-sm md:text-base">واتساب</a>
          </div>
        </div>
      </section>
      <div id="portfolio" className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl p-6 md:p-12 border dark:border-slate-800">
          <div className="flex flex-col md:flex-row justify-between gap-6 mb-12">
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
              {Object.values(ContentCategory).map(cat => (
                <button key={cat} onClick={() => setFilter(cat)} className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${filter === cat ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100'}`}>{cat}</button>
              ))}
            </div>
            <input type="text" placeholder="ابحث..." className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl px-6 py-4 w-full md:w-80 outline-none focus:ring-2 focus:ring-indigo-500 border dark:border-slate-700" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map(item => <Card key={item.id} item={item} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- صفحة الإدارة ---
const AdminPage = ({ items, onAddItem, onDeleteItem }: { items: PortfolioItem[], onAddItem: (item: PortfolioItem) => void, onDeleteItem: (id: string) => void }) => {
  const ADMIN_USERNAME = "بشار عالي";
  const ADMIN_PASSWORD = "bashar_admin_2025";
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('bashar_admin_active') === 'true');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [formData, setFormData] = useState({ title: '', description: '', category: ContentCategory.RESEARCH, thumbnail: '', youtubeId: '', pdfUrl: '', url: '', tags: '' });
  const [status, setStatus] = useState('');

  const handleLogin = () => {
    if (usernameInput === ADMIN_USERNAME && passwordInput === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      sessionStorage.setItem('bashar_admin_active', 'true');
    } else {
      alert("⚠️ بيانات الدخول غير صحيحة!");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return alert("يرجى إدخال العنوان");
    const newItem: PortfolioItem = { 
      id: Date.now().toString(), 
      ...formData, 
      date: new Date().toLocaleDateString('ar-EG'), 
      thumbnail: formData.thumbnail || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800', 
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => !!t) 
    };
    onAddItem(newItem);
    setStatus('✅ تم النشر!');
    setFormData({ title: '', description: '', category: ContentCategory.RESEARCH, thumbnail: '', youtubeId: '', pdfUrl: '', url: '', tags: '' });
    setTimeout(() => setStatus(''), 3000);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-4">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-2xl max-w-md w-full border-t-8 border-indigo-600">
          <h2 className="text-2xl font-black text-center mb-6 dark:text-white">بوابة المشرف</h2>
          <input type="text" placeholder="الاسم" className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl mb-4 text-center font-bold outline-none border dark:border-slate-700 dark:text-white" value={usernameInput} onChange={e => setUsernameInput(e.target.value)} />
          <input type="password" placeholder="كلمة المرور" className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl mb-6 text-center outline-none border dark:border-slate-700 dark:text-white" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          <button onClick={handleLogin} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-indigo-700 transition-all">دخول آمن</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 text-right mb-20 md:mb-0">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl p-6 md:p-10 border dark:border-slate-800">
        <h2 className="text-3xl font-bold dark:text-white mb-8">لوحة التحكم</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl outline-none border dark:border-slate-700 dark:text-white" placeholder="عنوان العمل..." />
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as ContentCategory})} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border dark:border-slate-700 dark:text-white">
              <option value={ContentCategory.RESEARCH}>أبحاث</option>
              <option value={ContentCategory.PROJECTS}>مشاريع</option>
              <option value={ContentCategory.VIDEOS}>فيديوهات</option>
            </select>
            <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border dark:border-slate-700 dark:text-white" placeholder="الوصف..."></textarea>
            <input value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border dark:border-slate-700 dark:text-white" placeholder="رابط العمل (URL)..." />
            <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg">نشر الآن</button>
          </form>
          <div className="space-y-3">
            <h3 className="font-bold mb-4 dark:text-white">إدارة الأعمال ({items.length})</h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border dark:border-slate-700">
                  <span className="font-bold text-xs line-clamp-1 dark:text-white">{item.title}</span>
                  <button onClick={() => window.confirm(`حذف ${item.title}؟`) && onDeleteItem(item.id)} className="text-red-400 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                    حذف
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- المكون الرئيسي (App) ---
export default function App() {
  const [items, setItems] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem('bashar_portfolio_items');
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });
  const [isDark, setIsDark] = useState(() => localStorage.getItem('bashar_theme') === 'dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => { localStorage.setItem('bashar_portfolio_items', JSON.stringify(items)); }, [items]);
  useEffect(() => {
    if (isDark) { document.documentElement.classList.add('dark'); localStorage.setItem('bashar_theme', 'dark'); }
    else { document.documentElement.classList.remove('dark'); localStorage.setItem('bashar_theme', 'light'); }
  }, [isDark]);

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-['Tajawal'] text-right transition-colors" dir="rtl">
        {/* Top Navbar */}
        <nav className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-[80] border-b dark:border-slate-800 h-20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
            <Link to="/" className="flex items-center gap-4">
              <Logo className="w-10 h-10" />
              <div className="flex flex-col">
                <span className="text-xl font-black text-slate-800 dark:text-white leading-none">بشار تكنولوجي</span>
                <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">Innovation Hub</span>
              </div>
            </Link>
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-slate-600 dark:text-slate-300 font-bold hover:text-indigo-600">الرئيسية</Link>
              <Link to="/cv" className="text-slate-600 dark:text-slate-300 font-bold hover:text-indigo-600">السيرة الذاتية</Link>
              <Link to="/admin" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-5 py-2 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition-all">بوابة المشرف</Link>
              <button onClick={() => setIsDark(!isDark)} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-yellow-400">{isDark ? '☀️' : '🌙'}</button>
            </div>
            {/* Mobile Sidebar Trigger (Optional but kept for full menu) */}
            <button onClick={() => setIsMenuOpen(true)} className="md:hidden p-3 bg-slate-50 dark:bg-slate-800 text-indigo-600 rounded-2xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h16m-7 6h7M4 6h16"/></svg>
            </button>
          </div>
        </nav>

        {/* Components */}
        <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} />
        
        <main className="flex-1 pb-24 md:pb-0">
          <Routes>
            <Route path="/" element={<HomePage items={items} />} />
            <Route path="/cv" element={<CVPage />} />
            <Route path="/admin" element={<AdminPage items={items} onAddItem={item => setItems([item, ...items])} onDeleteItem={id => setItems(items.filter(i => i.id !== id))} />} />
          </Routes>
        </main>

        {/* Bottom Menu for Mobile */}
        <BottomNav />

        <footer className="hidden md:block bg-slate-900 dark:bg-black text-white py-16 text-center border-t-4 border-indigo-600">
          <div className="max-w-7xl mx-auto px-4">
            <Logo className="w-16 h-16 mx-auto mb-8 opacity-40 grayscale" />
            <h3 className="text-2xl font-bold mb-4 text-white">بشار تكنولوجي - التميز في الحلول الرقمية</h3>
            <p className="text-slate-500 max-w-xl mx-auto font-light">نحن نبتكر، نطور، ونقود التحول الرقمي بأحدث التقنيات العالمية.</p>
          </div>
        </footer>

        {/* Floating WhatsApp */}
        <div className="fixed bottom-32 md:bottom-8 right-6 md:right-8 z-50">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white w-14 h-14 md:w-16 md:h-16 rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 border-4 border-white dark:border-slate-800">
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          </a>
        </div>
        
        {/* AI Chat */}
        <FloatingAIChat items={items} />
      </div>
    </HashRouter>
  );
}
