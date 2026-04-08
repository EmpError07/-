/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { restaurantService } from './services/restaurantService';
import { 
  Home, 
  UtensilsCrossed, 
  RotateCw, 
  Database, 
  ChevronRight, 
  Settings, 
  ArrowLeft,
  Search,
  Heart,
  Flame,
  Plus,
  History,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type View = 'HOME' | 'MENU' | 'WHEEL' | 'DATABASE';

interface Restaurant {
  id: string;
  name: string;
  category: string;
  location: string;
  image: string;
  isNew?: boolean;
  isFavorite?: boolean;
}

// --- Mock Data ---
const CATEGORIES = [
  { id: 'ramen', name: '拉麵麵食', count: 12, icon: '🍜', color: 'bg-amber-100 text-amber-600' },
  { id: 'stir-fry', name: '熱炒快炒', count: 8, icon: '🥘', color: 'bg-orange-100 text-orange-600' },
  { id: 'fast-food', name: '美式速食', count: 15, icon: '🍔', color: 'bg-yellow-100 text-yellow-600', popular: '漢堡、薯條、披薩' },
  { id: 'dessert', name: '甜點零食', count: 24, icon: '🍦', color: 'bg-blue-100 text-blue-600' },
  { id: 'healthy', name: '健康輕食', count: 5, icon: '🥗', color: 'bg-green-100 text-green-600' },
];

const RECENT_RESTAURANTS: Restaurant[] = [
  { id: '1', name: '深夜拉麵屋', category: '拉麵麵食', location: '台北市信義區', image: 'https://picsum.photos/seed/ramen/200/200', isNew: true },
  { id: '2', name: '街角漢堡坊', category: '美式速食', location: '台中市西區', image: 'https://picsum.photos/seed/burger/200/200', isFavorite: true },
];

const WHEEL_OPTIONS = ['拉麵', '熱炒', '披薩', '火鍋', '壽司', '漢堡'];

// --- Components ---

const Header = ({ title, onBack }: { title: string; onBack?: () => void }) => (
  <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50">
    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
      <ArrowLeft size={20} className="text-amber-900" />
    </button>
    <h1 className="text-lg font-bold text-amber-900">{title}</h1>
    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
      <Settings size={20} className="text-amber-900" />
    </button>
  </header>
);

const BottomNav = ({ activeView, setView }: { activeView: View; setView: (v: View) => void }) => {
  const navItems: { id: View; label: string; icon: React.ElementType }[] = [
    { id: 'HOME', label: 'HOME', icon: Home },
    { id: 'MENU', label: 'MENU', icon: UtensilsCrossed },
    { id: 'WHEEL', label: 'WHEEL', icon: RotateCw },
    { id: 'DATABASE', label: 'DATABASE', icon: Database },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 flex justify-around items-center z-50">
      {navItems.map((item) => {
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
              isActive ? 'bg-amber-600 text-white shadow-lg shadow-amber-200' : 'text-gray-400 hover:text-amber-600'
            }`}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-bold tracking-wider">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

// --- Views ---

const HomeView = ({ onNavigate }: { onNavigate: (v: View) => void }) => (
  <div className="pb-24 animate-in fade-in duration-500">
    <div className="px-6 py-8 flex flex-col items-center">
      {/* Main Circle */}
      <div className="relative w-64 h-64 bg-amber-50 rounded-full flex items-center justify-center shadow-inner border-4 border-white mb-8">
        <div className="absolute -top-2 -right-2 bg-white p-3 rounded-2xl shadow-md animate-bounce" style={{ animationDelay: '0.2s' }}>
          <span className="text-2xl">🍜</span>
        </div>
        <div className="absolute -bottom-2 -left-2 bg-white p-3 rounded-2xl shadow-md animate-bounce" style={{ animationDelay: '0.5s' }}>
          <span className="text-2xl">🥐</span>
        </div>
        <div className="absolute top-1/4 -left-6 bg-white p-2 rounded-xl shadow-sm animate-pulse">
          <span className="text-xl">🍕</span>
        </div>
        <div className="absolute bottom-1/4 -right-6 bg-white p-2 rounded-xl shadow-sm animate-pulse" style={{ animationDelay: '0.8s' }}>
          <span className="text-xl">🍣</span>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-amber-900 mb-1">今天吃什麼？</h2>
          <div className="w-12 h-1 bg-amber-200 mx-auto rounded-full"></div>
        </div>
      </div>

      <button 
        onClick={() => onNavigate('WHEEL')}
        className="w-full max-w-xs bg-gradient-to-r from-amber-500 to-orange-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-amber-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
      >
        出餐！ <UtensilsCrossed size={20} />
      </button>
      <p className="mt-4 text-gray-400 text-sm">點擊按鈕，由美食策展人為您決定</p>
    </div>

    {/* Curated Section */}
    <div className="px-6 mb-8">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-amber-900">今日推薦風味</h3>
          <span className="text-[10px] font-bold tracking-widest text-gray-300 uppercase">CURATED</span>
        </div>
        <div className="relative rounded-2xl overflow-hidden aspect-[16/9] mb-4 group cursor-pointer">
          <img 
            src="https://picsum.photos/seed/salad/800/450" 
            alt="Salad" 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4">
            <h4 className="text-white font-bold text-xl">清爽和風沙拉</h4>
            <p className="text-white/80 text-xs">低卡路里 · 15分鐘送達</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-amber-50 p-4 rounded-2xl flex flex-col items-center gap-2 group hover:bg-amber-100 transition-colors">
            <div className="bg-white p-2 rounded-full shadow-sm group-hover:scale-110 transition-transform">
              <Flame size={20} className="text-orange-500" />
            </div>
            <span className="text-xs font-bold text-amber-900">人氣排行</span>
          </button>
          <button className="bg-amber-50 p-4 rounded-2xl flex flex-col items-center gap-2 group hover:bg-amber-100 transition-colors">
            <div className="bg-white p-2 rounded-full shadow-sm group-hover:scale-110 transition-transform">
              <Heart size={20} className="text-red-500" />
            </div>
            <span className="text-xs font-bold text-amber-900">我的最愛</span>
          </button>
        </div>
      </div>
    </div>

    {/* Explore Section */}
    <div className="px-6">
      <h3 className="font-bold text-amber-900 mb-4">探索更多選擇</h3>
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {['義式料理', '日式料理', '美式料理', '中式料理'].map((cat, i) => (
          <div key={cat} className="flex-shrink-0 w-32">
            <div className="aspect-square rounded-2xl overflow-hidden mb-2 shadow-sm">
              <img 
                src={`https://picsum.photos/seed/food${i}/300/300`} 
                alt={cat} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-center text-xs font-bold text-amber-900">{cat}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MenuView = ({ onNavigate }: { onNavigate: (v: View) => void }) => (
  <div className="pb-24 animate-in slide-in-from-bottom-4 duration-500">
    <div className="px-6 py-8 text-center">
      <span className="inline-block bg-amber-100 text-amber-800 text-[10px] font-bold px-3 py-1 rounded-full mb-4 tracking-widest">CULINARY CURATOR</span>
      <h2 className="text-2xl font-bold text-amber-900 mb-2">探索您的 <span className="text-orange-600">美味之旅</span></h2>
      <p className="text-gray-500 text-sm max-w-[280px] mx-auto leading-relaxed">
        別再為午餐煩惱，讓精選的餐廳引領您的味蕾。
      </p>
    </div>

    <div className="px-6 space-y-4">
      {[
        { id: 'WHEEL', title: '輪盤 (Spinning Wheel)', desc: '交給運氣，隨機挑選今日驚喜餐廳。', icon: '🎡' },
        { id: 'DATABASE', title: '餐廳資料庫 (Database)', desc: '瀏覽您收藏的所有美味清單與評分。', icon: '🍱' },
        { id: 'MODIFY', title: '修改資料庫 (Modify)', desc: '新增或編輯您的個人化餐廳名單。', icon: '📝' },
      ].map((item) => (
        <button 
          key={item.id}
          onClick={() => item.id !== 'MODIFY' && onNavigate(item.id as View)}
          className="w-full bg-white p-5 rounded-3xl flex items-center gap-4 shadow-sm border border-gray-50 hover:shadow-md transition-all group"
        >
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
            {item.icon}
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-bold text-amber-900 mb-1">{item.title}</h4>
            <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded-xl text-gray-400">
            <ChevronRight size={16} />
          </div>
        </button>
      ))}
    </div>

    {/* Special Card */}
    <div className="px-6 mt-8">
      <div className="relative rounded-3xl overflow-hidden aspect-[16/10] shadow-xl">
        <img 
          src="https://picsum.photos/seed/special/800/500" 
          alt="Special" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
          <span className="text-white/80 text-[10px] font-bold mb-1">今日推薦</span>
          <h4 className="text-white font-bold text-xl mb-4">香草烤雞與當季蔬菜</h4>
          <button className="absolute bottom-6 right-6 w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <Plus size={24} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

const WheelView = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);
    const spinAmount = 1440 + Math.random() * 360;
    const newRotation = rotation + spinAmount;
    setRotation(newRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      // Calculate result based on rotation
      const finalAngle = (newRotation % 360);
      const segmentAngle = 360 / WHEEL_OPTIONS.length;
      const index = Math.floor(((360 - finalAngle + segmentAngle / 2) % 360) / segmentAngle);
      setResult(WHEEL_OPTIONS[index]);
    }, 3000);
  };

  return (
    <div className="pb-24 animate-in zoom-in-95 duration-500">
      <div className="px-6 py-8 text-center">
        <h2 className="text-2xl font-bold text-amber-900 mb-2">糾結中？</h2>
        <p className="text-gray-500 text-sm">讓命運為您挑選下一頓佳餚</p>
      </div>

      <div className="relative flex justify-center py-8">
        {/* Wheel Indicator */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-amber-900 drop-shadow-md"></div>
        </div>

        {/* The Wheel */}
        <div className="relative w-72 h-72 rounded-full border-[12px] border-white shadow-2xl overflow-hidden bg-white">
          <motion.div 
            animate={{ rotate: rotation }}
            transition={{ duration: 3, ease: [0.15, 0, 0.15, 1] }}
            className="w-full h-full relative"
          >
            {WHEEL_OPTIONS.map((option, i) => {
              const angle = 360 / WHEEL_OPTIONS.length;
              const colors = ['#D97706', '#F97316', '#FBBF24', '#FEF3C7', '#FFEDD5', '#FEF9C3'];
              return (
                <div 
                  key={option}
                  className="absolute top-0 left-0 w-full h-full origin-center flex items-start justify-center pt-8"
                  style={{ 
                    transform: `rotate(${i * angle}deg)`,
                    backgroundColor: colors[i % colors.length],
                    clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((270 - angle/2) * Math.PI/180)}% 0%, ${50 + 50 * Math.cos((270 + angle/2) * Math.PI/180)}% 0%)`
                  }}
                >
                  <span 
                    className={`font-bold text-sm mt-4 origin-center whitespace-nowrap ${i % 3 === 0 ? 'text-white' : 'text-amber-900'}`} 
                    style={{ transform: `rotate(0deg)` }}
                  >
                    {option}
                  </span>
                </div>
              );
            })}
          </motion.div>
          {/* Center Pin */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center z-20">
            <div className="w-3 h-3 bg-amber-900 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="px-6 mt-8 flex flex-col items-center gap-4">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center mb-4"
            >
              <span className="text-gray-400 text-xs uppercase tracking-widest font-bold">命運的選擇</span>
              <h3 className="text-3xl font-black text-orange-600 mt-1">{result}！</h3>
            </motion.div>
          ) : (
            <div className="h-[60px]"></div>
          )}
        </AnimatePresence>

        <button 
          onClick={spin}
          disabled={isSpinning}
          className="w-full max-w-xs bg-gradient-to-r from-amber-500 to-orange-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-amber-200 disabled:opacity-50 active:scale-95 transition-all"
        >
          {isSpinning ? '挑選中...' : '立即旋轉！'}
        </button>
        
        <div className="flex gap-3 w-full max-w-xs">
          <button className="flex-1 bg-white py-3 rounded-xl text-xs font-bold text-gray-500 border border-gray-100 flex items-center justify-center gap-2 hover:bg-gray-50">
            <Edit2 size={14} /> 編輯清單
          </button>
          <button className="flex-1 bg-white py-3 rounded-xl text-xs font-bold text-gray-500 border border-gray-100 flex items-center justify-center gap-2 hover:bg-gray-50">
            <History size={14} /> 歷史紀錄
          </button>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="px-6 mt-12 grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-50 shadow-sm">
          <span className="text-[10px] font-bold text-gray-300 uppercase block mb-1">熱門首選</span>
          <p className="text-sm font-bold text-amber-900">日式厚切拉麵</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-50 shadow-sm">
          <span className="text-[10px] font-bold text-gray-300 uppercase block mb-1">目前狀態</span>
          <p className="text-sm font-bold text-green-600">全數營業中</p>
        </div>
      </div>
    </div>
  );
};

const DatabaseView = () => (
  <div className="pb-24 animate-in slide-in-from-right-4 duration-500">
    <div className="px-6 py-8">
      <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1 block">THE DATABASE</span>
      <h2 className="text-3xl font-bold text-amber-900 mb-2">美食資料庫</h2>
      <p className="text-gray-500 text-sm leading-relaxed">
        探索您收藏的所有餐廳分類，快速決定下一餐的驚喜。
      </p>
    </div>

    {/* Search */}
    <div className="px-6 mb-8">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="搜尋餐廳或類別..." 
          className="w-full bg-gray-100 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-amber-500 transition-all"
        />
      </div>
    </div>

    {/* Categories Grid */}
    <div className="px-6 grid grid-cols-2 gap-4 mb-12">
      {CATEGORIES.map((cat) => (
        <div key={cat.id} className={`p-5 rounded-3xl bg-white border border-gray-50 shadow-sm hover:shadow-md transition-all ${cat.popular ? 'col-span-2 flex items-center justify-between overflow-hidden' : ''}`}>
          <div className="flex flex-col gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${cat.color}`}>
              {cat.icon}
            </div>
            <div>
              <h4 className="font-bold text-amber-900">{cat.name}</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {cat.popular ? `熱門：${cat.popular}` : `${cat.count} 間已儲存`}
              </p>
            </div>
          </div>
          {cat.popular && (
            <div className="w-24 h-24 -mr-4 -mb-4 opacity-20">
              <img src="https://picsum.photos/seed/burger/200/200" alt="burger" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
          )}
        </div>
      ))}
    </div>

    {/* Recently Added */}
    <div className="px-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-amber-900">最近新增</h3>
        <button className="text-xs font-bold text-orange-600 flex items-center gap-1">
          查看全部 <ChevronRight size={14} />
        </button>
      </div>
      <div className="space-y-4">
        {RECENT_RESTAURANTS.map((res) => (
          <div key={res.id} className="bg-white p-4 rounded-3xl flex items-center gap-4 border border-gray-50 shadow-sm">
            <img 
              src={res.image} 
              alt={res.name} 
              className="w-16 h-16 rounded-2xl object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1">
              <h4 className="font-bold text-amber-900">{res.name}</h4>
              <p className="text-[10px] text-gray-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span> {res.location}
              </p>
            </div>
            {res.isNew ? (
              <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-1 rounded-lg">NEW</span>
            ) : (
              <Heart size={18} className="text-gray-200" />
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState<View>('HOME');

  useEffect(() => {
    // 測試連線並印出剛剛建立的餐廳資料
    restaurantService.getAllRestaurants().then(data => {
      console.log('來自 Supabase 雲端資料庫的餐廳:', data);
    }).catch(err => {
      console.error(err);
    });
  }, []);

  const renderView = () => {
    switch (view) {
      case 'HOME': return <HomeView onNavigate={setView} />;
      case 'MENU': return <MenuView onNavigate={setView} />;
      case 'WHEEL': return <WheelView />;
      case 'DATABASE': return <DatabaseView />;
      default: return <HomeView onNavigate={setView} />;
    }
  };

  const getTitle = () => {
    switch (view) {
      case 'HOME': return '今天吃什麼';
      case 'MENU': return '今天吃什麼';
      case 'WHEEL': return '今天吃什麼';
      case 'DATABASE': return '今天吃什麼';
      default: return '今天吃什麼';
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] font-sans text-gray-900 selection:bg-amber-100">
      <Header title={getTitle()} onBack={() => setView('HOME')} />
      
      <main className="max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>
      </main>

      <BottomNav activeView={view} setView={setView} />
    </div>
  );
}
