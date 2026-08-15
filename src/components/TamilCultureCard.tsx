import React, { useState } from 'react';
import { Landmark, Sparkles, BookOpen, Shirt, Image as ImageIcon, Heart, ChevronRight, Scroll, Sun, Moon } from 'lucide-react';
import tnAttireImg from '../assets/images/tn_attire_culture_1786511333724.jpg';
import tnLightBg from '../assets/images/tn_light_heritage_1786511292372.jpg';
import tnDarkBg from '../assets/images/tn_dark_nightlife_1786511313620.jpg';

interface TamilCultureCardProps {
  isDarkMode: boolean;
}

const CULTURAL_ATTIRE = [
  {
    title: 'Kanjivaram Silk Saree',
    tamilTitle: 'காஞ்சிபுரம் பட்டுப்புடவை',
    category: 'Women\'s Heritage Wear',
    description: 'Woven with pure mulberry silk and golden zari thread, representing rich Tamil elegance, bridal grace, and royal South Indian heritage.',
    colors: 'Royal Crimson, Turmeric Gold, Peacock Blue',
  },
  {
    title: 'Silk Veshti & Sattai',
    tamilTitle: 'பட்டு வேஷ்டி & வெள்ளை சட்டை',
    category: 'Men\'s Heritage Wear',
    description: 'Pure white cotton or silk Veshti with golden border (Angavastram), worn during traditional festivals, temple worship, and celebrations.',
  },
  {
    title: 'Pavadai Thavani (Half Saree)',
    tamilTitle: 'பாவாடை தாவணி',
    category: 'Young Women\'s Tradition',
    description: 'Traditional three-piece attire with pleated skirt, blouse, and draped shawl worn during festivals like Pongal and Margazhi.',
  },
];

const HISTORIC_LANDMARKS = [
  {
    name: 'Brihadeeswarar Temple',
    tamilName: 'தஞ்சாவூர் பெரிய கோவில்',
    location: 'Thanjavur',
    highlight: 'Dravidian monolithic architectural masterpiece constructed by King Raja Raja Chola I with Tanjore oil painting art style.',
  },
  {
    name: 'Meenakshi Amman Temple',
    tamilName: 'மதுரை மீனாட்சி அம்மன் கோவில்',
    location: 'Madurai',
    highlight: '14 towering colorful Gopurams with thousands of hand-sculpted mythological figures, glowing magnificently under city night lights.',
  },
  {
    name: 'Shore Temple & Pancha Rathas',
    tamilName: 'மாமல்லபுரம் கடற்கரை கோவில்',
    location: 'Mamallapuram (Mahabalipuram)',
    highlight: '7th-century UNESCO World Heritage rock-cut coastal architectural gems overlooking the Bay of Bengal ocean waves.',
  },
  {
    name: 'Chettinad Mansions & Art',
    tamilName: 'செட்டிநாடு அரண்மனை & கைவினை',
    location: 'Karaikudi / Sivagangai',
    highlight: 'Palatial heritage homes with Italian marble, teak pillars, Athangudi handmade tiles, and traditional Tanjore art.',
  },
];

const WEATHER_KURAL_PROVERBS = [
  {
    kuralNo: 'குறள் 55',
    kuralTamil: 'துப்பார்க்குத் துப்பாய துப்பாக்கித் துப்பார்க்குத் துப்புஉாஉம் மழை',
    meaning: 'Rain creates wholesome food for all living beings and itself serves as sustaining nourishment.',
    category: 'திருக்குறள் • Rain & Nature',
  },
  {
    kuralNo: 'பழமொழி',
    kuralTamil: 'ஆடிப் பட்டத் தேடி விதை',
    meaning: 'Sow your crops during the monsoon month of Aadi to reap a bountiful harvest with seasonal rain.',
    category: 'விவசாய பழமொழி • Farming Wisdom',
  },
  {
    kuralNo: 'பழமொழி',
    kuralTamil: 'கார்த்திகை மழை கரைகாணாது',
    meaning: 'The heavy torrential monsoon downpours of Karthigai month fill lakes and rivers to their brims.',
    category: 'பருவமழை • Monsoon Wisdom',
  },
];

export const TamilCultureCard: React.FC<TamilCultureCardProps> = ({ isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'attire' | 'landmarks' | 'poetry'>('attire');

  return (
    <div
      id="tamil-culture-heritage-card"
      className={`relative overflow-hidden rounded-3xl border transition-all p-6 sm:p-8 shadow-xl ${
        isDarkMode
          ? 'bg-slate-900/90 border-slate-800 text-slate-100'
          : 'bg-white/90 border-amber-200 text-slate-800'
      }`}
    >
      {/* Background Texture Art Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 dark:opacity-20 overflow-hidden">
        <img
          src={isDarkMode ? tnDarkBg : tnLightBg}
          alt="Tamil Nadu Cultural Backdrop"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Header Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-amber-200/50 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-md">
              <Landmark className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  தமிழ் பாரம்பரியம் & கலாச்சாரம்
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                  Heritage
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                Tamil Nadu Cultural Heritage, Traditional Attire, Historic Landmarks & Weather Wisdom
              </p>
            </div>
          </div>

          {/* Tab Selection */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('attire')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'attire'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              <span>Attire (ஆடைகள்)</span>
            </button>
            <button
              onClick={() => setActiveTab('landmarks')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'landmarks'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Landmarks (நினைவிடங்கள்)</span>
            </button>
            <button
              onClick={() => setActiveTab('poetry')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'poetry'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Poetry (கவிதைகள்)</span>
            </button>
          </div>
        </div>

        {/* TAB 1: TRADITIONAL ATTIRE & CLOTHING */}
        {activeTab === 'attire' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Culture Illustration Artwork */}
            <div className="lg:col-span-5 relative group overflow-hidden rounded-2xl border border-amber-200 dark:border-slate-800 shadow-md">
              <img
                src={tnAttireImg}
                alt="Tamil Traditional Attire Kanjivaram Saree and Veshti"
                className="w-full h-72 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-4 flex flex-col justify-end text-white">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black tracking-wider uppercase w-fit mb-1">
                  Kanjivaram & Silk Heritage
                </span>
                <h4 className="text-lg font-bold">தமிழ் பாரம்பரிய உடைகளின் பெருமை</h4>
                <p className="text-xs text-amber-200/90 font-medium">
                  Silk Veshti, Kanjivaram Saree, brass oil lamps, and jasmine floral traditions.
                </p>
              </div>
            </div>

            {/* Traditional Dress Cards */}
            <div className="lg:col-span-7 space-y-3">
              {CULTURAL_ATTIRE.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition hover:border-amber-400 ${
                    isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-amber-50/60 border-amber-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {item.title} <span className="text-amber-700 dark:text-amber-300 font-medium">({item.tamilTitle})</span>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: HISTORIC LANDMARKS & ARCHITECTURE */}
        {activeTab === 'landmarks' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HISTORIC_LANDMARKS.map((landmark, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition hover:shadow-md ${
                  isDarkMode
                    ? 'bg-slate-800/90 border-slate-700 text-slate-100'
                    : 'bg-amber-50/80 border-amber-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                    📍 {landmark.location}
                  </span>
                  <Landmark className="w-4 h-4 text-amber-500" />
                </div>
                <h4 className="text-lg font-extrabold mt-2 text-slate-900 dark:text-white">
                  {landmark.name}
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-300 font-bold mt-0.5">
                  {landmark.tamilName}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {landmark.highlight}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: POETRY & WEATHER PROVERBS */}
        {activeTab === 'poetry' && (
          <div className="space-y-4">
            {WEATHER_KURAL_PROVERBS.map((kural, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border relative overflow-hidden transition ${
                  isDarkMode
                    ? 'bg-slate-800/90 border-slate-700 text-slate-100'
                    : 'bg-amber-50/90 border-amber-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Scroll className="w-3.5 h-3.5" />
                    {kural.category}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black">
                    {kural.kuralNo}
                  </span>
                </div>
                <p className="text-lg sm:text-xl font-bold font-serif text-slate-900 dark:text-amber-200 leading-snug tracking-wide italic my-2">
                  "{kural.kuralTamil}"
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {kural.meaning}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
