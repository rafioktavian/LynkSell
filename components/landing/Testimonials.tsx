'use client';

import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useRef, useState, useEffect } from 'react';

const testimonials = [
  {
    name: "Siti Rahma",
    location: "Bandung",
    category: "Fashion",
    rating: 5,
    text: "Semenjak pakai LynkSell, saya nggak pernah mikirin potongan komisi lagi. Link-nya saya taruh di bio IG, pembeli langsung klik dan chat WA. Gampang banget!",
    avatar: "https://i.pravatar.cc/150?u=siti",
  },
  {
    name: "Budi Santoso",
    location: "Semarang",
    category: "Kuliner",
    rating: 5,
    text: "Cuma modal foto risoles, AI-nya buatin kata-kata keren banget. Penjualan naik 30% bulan ini karena kelihatan lebih profesional.",
    avatar: "https://i.pravatar.cc/150?u=budi",
  },
  {
    name: "Maya Sari",
    location: "Surabaya",
    category: "Skincare",
    rating: 5,
    text: "Tadinya repot balasin chat satu-satu buat kasih deskripsi barang. Sekarang kasih aja link LynkSell, semua info lengkap di situ. Praktis!",
    avatar: "https://i.pravatar.cc/150?u=maya",
  },
  {
    name: "Ahmad Rizky",
    location: "Jakarta",
    category: "Gadget",
    rating: 5,
    text: "Setup-nya beneran 30 detik! Nyesel kenapa nggak dari dulu tau tool ini. Lebih hemat waktu daripada bikin website sendiri.",
    avatar: "https://i.pravatar.cc/150?u=rizky",
  },
  {
    name: "Rina Maharani",
    location: "Yogyakarta",
    category: "Craft",
    rating: 5,
    text: "Customer bilang websitenya rapi dan terpercaya. Padahal cuma modal kamera HP dan upload di LynkSell. Keren banget!",
    avatar: "https://i.pravatar.cc/150?u=rina",
  }
];

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Auto scroll effect
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = 0;

    const scroll = (time: number) => {
      if (scrollRef.current && !isHovered) {
        if (!lastTime) lastTime = time;
        const delta = time - lastTime;
        
        // Adjust speed here
        if (delta > 20) {
           scrollRef.current.scrollLeft += 1;
           // Reset scroll to create infinite illusion
           if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 2) {
             scrollRef.current.scrollLeft = 0;
           }
           lastTime = time;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  return (
    <section className="py-24 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Seller yang sudah merasakan manfaatnya
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan UMKM yang sudah lebih dulu meraih penjualan tinggi tanpa potongan komisi.
          </p>
        </motion.div>
      </div>

      <div 
        className="w-full max-w-[100vw] overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing pb-8 pt-4 px-6 md:px-12"
        ref={scrollRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
      >
        {/* We duplicate the array to allow for infinite smooth scrolling visually */}
        <div className="flex gap-6 w-max">
          {[...testimonials, ...testimonials].map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
              className="w-[320px] md:w-[400px] shrink-0 bg-slate-50 border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm md:text-base leading-tight">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">{testimonial.location}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-indigo-100/50 text-indigo-700 hover:bg-indigo-100">
                  {testimonial.category}
                </Badge>
              </div>
              
              <div className="flex gap-1 mb-4 text-amber-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              
              <p className="text-slate-700 leading-relaxed font-medium">
                &quot;{testimonial.text}&quot;
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
