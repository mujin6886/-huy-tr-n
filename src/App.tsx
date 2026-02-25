/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Send, RefreshCw, Volume2, VolumeX } from 'lucide-react';

const PREDICTIONS = [
  // 1. Túi tiền & Sự nghiệp
  { text: "2026: Ví dày thêm, nỗi buồn mất tích không dấu vết.", lucky: true, category: 'money' },
  { text: "Bạn sẽ đau đầu vì giàu, mệt mỏi vì đếm tiền mỏi tay.", lucky: true, category: 'money' },
  { text: "Sếp sẽ tăng lương cho bạn ngay trong năm nay!", lucky: true, category: 'money' },
  { text: "Deadline năm nay sẽ tự biết sợ mà chạy mất tích.", lucky: true, category: 'money' },
  { text: "Tài khoản 'ting ting', giúp bạn quên luôn người cũ.", lucky: true, category: 'money' },

  // 2. Tình duyên & Mối quan hệ
  { text: "Hết kiếp độc thân, chuẩn bị tinh thần thoát ế thành công!", lucky: true, category: 'love' },
  { text: "Tin nhắn người cũ: Đừng mở, đó là thử thách lòng kiên nhẫn.", lucky: false, category: 'love' },
  { text: "Bạn sẽ gặp chân ái khi đang xếp hàng mua trà sữa.", lucky: true, category: 'love' },
  { text: "Hãy yêu bản thân mình trước khi bắt đầu yêu một ai đó.", lucky: false, category: 'love' },
  { text: "Crush sẽ lỡ tay 'like' ảnh cũ: Tín hiệu xanh lè cho bạn!", lucky: true, category: 'love' },

  // 3. Lối sống & Chữa lành
  { text: "2026: Một năm đầy vibe chữa lành, thảnh thơi, không drama.", lucky: true, category: 'healing' },
  { text: "Ăn Tết thả ga, bạn vẫn luôn đẹp theo cách riêng của mình.", lucky: false, category: 'healing' },
  { text: "Năm nay bạn sẽ đi du lịch đến mức hộ chiếu hết chỗ đóng dấu.", lucky: true, category: 'healing' },
  { text: "Bạn sẽ sở hữu khả năng ngủ không cần báo thức mà vẫn giàu.", lucky: true, category: 'healing' },
  { text: "Việc ít lương ổn, quan trọng nhất là bạn luôn thấy vui vẻ.", lucky: false, category: 'healing' },

  // 4. Hài hước & Độc lạ
  { text: "2026: Bạn sẽ thành idol Tóp Tóp nhờ một video vô tri nhất.", lucky: false, category: 'funny' },
  { text: "Cầm tấm thẻ trên tay: Căn cước hay Thẻ đen quyền lực đây?", lucky: false, category: 'funny' },
  { text: "Bạn sẽ trúng số... nhưng là trúng số lượt bị gọi lên bảng.", lucky: false, category: 'funny' },
  { text: "Đừng hỏi bao giờ cưới, hãy hỏi bao giờ được nhận lì xì.", lucky: false, category: 'funny' },
  { text: "Năm nay bạn sẽ khỏe như voi nhưng lại ăn ít như mèo.", lucky: false, category: 'funny' },

  // 5. Hệ Tâm Linh & Đu Idol
  { text: "Bạn sẽ săn được vé VVIP của idol mà không cần nhân phẩm cao.", lucky: true, category: 'mystical' },
  { text: "Những gì bạn mong cầu bấy lâu nay sẽ tự tìm đến gõ cửa.", lucky: true, category: 'mystical' },
  { text: "Idol sẽ có tin vui, và bạn cũng sẽ trúng thưởng lightstick.", lucky: true, category: 'mystical' },
  { text: "Bạn sẽ đón 'vợ/chồng' quốc tế về diễn ngay tại sân bay.", lucky: true, category: 'mystical' },

  // 6. Năng lượng Gen Z
  { text: "Sáng hướng nội, tối hướng ngoại, lương chảy thẳng vào túi.", lucky: true, category: 'genz' },
  { text: "Tìm thấy quán cafe chân ái: Wi-Fi mạnh và không ai hỏi cưới.", lucky: true, category: 'genz' },
  { text: "Bạn sẽ nhìn thấu 'red flag' và né tránh drama chuyên nghiệp.", lucky: true, category: 'genz' },
  { text: "Năm nay không overthinking, chỉ over-earning vượt mong đợi.", lucky: true, category: 'genz' },

  // 7. Sức khỏe & Sắc đẹp
  { text: "Chỉ số nhan sắc 2026: Tăng vọt, đứng đâu cũng là tâm điểm.", lucky: true, category: 'beauty' },
  { text: "Tập gym được 2 buổi đầu năm, nhưng vibe vẫn chuẩn người mẫu.", lucky: false, category: 'beauty' },
  { text: "Năm nay: Da sạch mụn, bụng không mỡ, chỉ có ví là phình to.", lucky: true, category: 'beauty' },
  { text: "Bạn sẽ tìm thấy bộ outfit đỉnh nhất, chiếm trọn spotlight.", lucky: true, category: 'beauty' },

  // 8. Công nghệ & AI
  { text: "Bạn sẽ có một con AI làm hộ mọi deadline khó nhằn nhất.", lucky: true, category: 'tech' },
  { text: "Mạng luôn căng đét vào những lúc quan trọng nhất cuộc đời.", lucky: true, category: 'tech' },
  { text: "Lên xu hướng TikTok nhờ một khoảnh khắc vô tri cực đáng yêu.", lucky: true, category: 'tech' },
  { text: "Pin điện thoại của bạn sẽ bền như ý chí kiếm tiền của bạn.", lucky: true, category: 'tech' },
];

const SOUNDS = {
  loading: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Mystical shimmer
  money: 'https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3', // Coins
  love: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3', // Success/Ding
  funny: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3', // Pop/Funny
  tech: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Digital/Tech
  mystical: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Shimmer
  genz: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3', // Pop
  healing: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3', // Ding
  beauty: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3', // Ding
};

export default function App() {
  const [name, setName] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [stars, setStars] = useState<{ id: number; top: string; left: string; size: string; delay: string; duration: string }[]>([]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loadingAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const newStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 1}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 3 + 2}s`,
    }));
    setStars(newStars);
  }, []);

  const playSound = (url: string, loop = false) => {
    if (isMuted) return;
    const audio = new Audio(url);
    audio.loop = loop;
    audio.play().catch(e => console.log("Audio play blocked", e));
    return audio;
  };

  const handlePredict = () => {
    if (!name.trim()) return;

    setIsCalculating(true);
    setPrediction(null);

    // Play loading sound
    loadingAudioRef.current = playSound(SOUNDS.loading, true) || null;

    // Simulate calculation time
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * PREDICTIONS.length);
      const result = PREDICTIONS[randomIndex];
      
      setPrediction(result.text);
      setIsCalculating(false);

      // Stop loading sound
      if (loadingAudioRef.current) {
        loadingAudioRef.current.pause();
        loadingAudioRef.current = null;
      }

      // Play category sound
      const categorySound = SOUNDS[result.category as keyof typeof SOUNDS] || SOUNDS.mystical;
      playSound(categorySound);

      if (result.lucky) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#8A2BE2', '#4B0082', '#FFFFFF']
        });
      }
    }, 2000);
  };

  const handleReset = () => {
    setPrediction(null);
    setName('');
    if (loadingAudioRef.current) {
      loadingAudioRef.current.pause();
      loadingAudioRef.current = null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 relative overflow-hidden font-sans">
      {/* Background Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              '--delay': star.delay,
              '--duration': star.duration,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Mute Toggle */}
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-6 right-6 z-50 p-3 rounded-full glass text-purple-200 hover:text-yellow-400 transition-colors"
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>

      {/* Header */}
      <header className="mt-8 text-center z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-serif font-bold text-yellow-500 glow-text tracking-widest"
        >
          TIÊN TRI NĂM MỚI 2026
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.5 }}
          className="text-sm md:text-base text-purple-200 mt-2 uppercase tracking-[0.3em]"
        >
          Khám phá vận mệnh của bạn qua quả cầu pha lê
        </motion.p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl z-10 gap-12">
        
        {/* Crystal Ball Section */}
        <div className="crystal-ball-container relative">
          <motion.div 
            className={`crystal-ball ${isCalculating ? 'calculating' : ''}`}
            animate={isCalculating ? { scale: [1, 1.1, 1] } : {}}
          >
            <div className="smoke">
              <div className="smoke-particle" style={{ animationDelay: '0s' }}></div>
              <div className="smoke-particle" style={{ animationDelay: '2s' }}></div>
              <div className="smoke-particle" style={{ animationDelay: '4s' }}></div>
            </div>
            
            {/* Inner Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/20 to-transparent pointer-events-none"></div>
          </motion.div>

          {/* Prediction Overlay */}
          <AnimatePresence>
            {prediction && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed inset-0 flex items-center justify-center z-[100] p-4 bg-black/60 backdrop-blur-sm"
              >
                <motion.div 
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  className="glass p-8 rounded-3xl border-yellow-500/30 max-w-lg w-full text-center relative"
                >
                  <p className="text-purple-200 text-sm mb-4 italic tracking-wider">Lời tiên tri cho {name}:</p>
                  <h2 className="text-2xl md:text-3xl font-serif text-yellow-400 leading-relaxed mb-8 glow-text">
                    "{prediction}"
                  </h2>
                  <button 
                    onClick={handleReset}
                    className="group bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-yellow-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto"
                  >
                    <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" /> 
                    Thử lại lần nữa
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Calculating Text */}
          <AnimatePresence>
            {isCalculating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <span className="text-yellow-200 font-serif animate-pulse tracking-widest text-lg text-center px-4">
                  ĐANG KẾT NỐI VỚI VŨ TRỤ...
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Section */}
        {!prediction && !isCalculating && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md flex flex-col gap-4 px-4"
          >
            <div className="relative group">
              <input
                type="text"
                placeholder="Nhập tên của bạn..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePredict()}
                className="w-full bg-white/5 border border-purple-500/30 rounded-full py-4 px-6 text-white placeholder-purple-300/50 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all text-center text-lg"
              />
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400/50 group-focus-within:text-yellow-500/50 transition-colors" size={20} />
            </div>
            
            <button
              onClick={handlePredict}
              disabled={!name.trim()}
              className="group relative overflow-hidden bg-gradient-to-r from-yellow-600 to-yellow-400 disabled:from-gray-600 disabled:to-gray-500 text-black font-bold py-4 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="relative z-10">XEM TƯƠNG LAI CỦA TÔI</span>
              <Send size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
            </button>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="mb-8 text-center z-10">
        <p className="text-purple-400/60 text-xs tracking-wider">
          CHỈ MANG TÍNH CHẤT GIẢI TRÍ, CHÚC BẠN MỘT NĂM MỚI HẠNH PHÚC!
        </p>
        <p className="text-purple-500/40 text-[10px] mt-1">
          © 2026 CRYSTAL BALL PREDICTION
        </p>
      </footer>
    </div>
  );
}
