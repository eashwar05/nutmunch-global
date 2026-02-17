import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import { Product } from '../types';
import { subscribeToNewsletter } from '../lib/api';
import { useState } from 'react';

interface HomePageProps {
  onQuickLook?: (product: Product) => void;
}

const HomePage: React.FC<HomePageProps> = () => { // Removed onQuickLook for now if not used in this specific layout directly or I can re-add it if needed for buttons
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    mouseX.set((clientX - left) / width - 0.5);
    mouseY.set((clientY - top) / height - 0.5);
  };

  const heroX = useTransform(mouseX, [-0.5, 0.5], ["2%", "-2%"]);
  const heroY = useTransform(mouseY, [-0.5, 0.5], ["2%", "-2%"]);

  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubscribe = async () => {
    if (!email) return;
    try {
      await subscribeToNewsletter(email);
      alert("Subscribed successfully!");
      setEmail('');
    } catch (err) {
      alert("Failed to subscribe.");
    }
  };

  return (
    <main className="bg-background-cream overflow-hidden">

      {/* 1. The Nutmunch Narrative (Hero) */}
      {/* Matching Screenshot 1: Dark overlay, bowl of nuts, text on left */}
      <section
        className="relative min-h-[90vh] w-full overflow-hidden bg-primary flex items-center px-6 md:px-24 py-20"
        onMouseMove={handleMouseMove}
      >
        <motion.div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDMCRFr-5R_RF7o_22OLV1pMDke8WF4GR6QcY-DqLYW9LwxDhzftoxH4rxaMA9pLR7jvligJu73--EfIfMza5uC2dry0m4Jl7MTMFHgGuX5fwP3X73MbE7yUYQzE4FD5z4xY5C6OZQwQEjxVo5vZqvYmfr3sA57Lxkd-HiqOyHc9dMr_o9clCKNzhHOt8mS-FnzhIhgB1sGNB5fHHvdJx25qPGYazaLAgHAnsMXhtfgoEwGJAnphTSnWGCo9yVyWJHXlCLurSOX7mY')", // Gourmet Nutmunch assortment
            scale: 1.1,
            x: heroX,
            y: heroY
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/70 via-stone-900/40 to-transparent z-10" />

        <div className="relative z-20 max-w-2xl text-white mt-12">
          <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-[10px] tracking-widest uppercase font-bold mb-6 border border-white/10">
            Category
          </span>
          <h1 className="font-display text-5xl md:text-7xl mb-6 leading-[1.1]">
            The Nutmunch <br /> Narrative
          </h1>
          <p className="text-lg md:text-xl font-light text-stone-200 mb-10 max-w-lg leading-relaxed">
            From orchard floors to your pantry door—experience the craft of gourmet snacking redefined by Nutmunch.
          </p>
          <button onClick={() => navigate('/shop')} className="bg-white text-primary px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-accent-terra hover:text-white transition-all transform hover:scale-105 shadow-xl">
            Explore Our Roots
          </button>
        </div>

        {/* Floating Side Card ("24 Years") */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute top-1/2 right-12 md:right-24 transform -translate-y-1/2 z-20 hidden lg:block"
        >
          <div className="bg-background-cream p-12 max-w-sm text-center shadow-2xl relative">
            <h3 className="font-display text-5xl text-secondary mb-2">24 Years</h3>
            <p className="text-xs uppercase tracking-widest text-primary/60 mb-6">Crafting the Perfect Crunch</p>
            <div className="flex justify-center gap-1 text-accent-terra text-xs mb-8">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <div className="bg-white border border-stone-200 p-4 text-[10px] tracking-widest uppercase font-bold text-primary">
              The Nutmunch Standard
            </div>
            {/* Abstract overlapping image effect */}
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0v2mwo6dDmVvGLGEBsc1-uuJ_m0QGrHBP4TAlbiHj0cnAY58dHqIaWRzQJkKvSTl3kww2JZ_cLRpxwa1rPSWd9YBM7qdBMoVRMVAfTo8aJfKFLg0raHyWm9dRaOFv5153_xVYwq8guO7JBfmvxQ0mty5f5m94AAf5vjHha0QCUEykn9dokQJgbVJoEccD5A33CNFIPpK5gBkfD10X6VhOnRz8eBvo7k1ypqRNJLu2ATpkixJMqKxnWWYiZRepxw_C5bGoFRi0nuQ" alt="Decorative" className="absolute -bottom-10 -right-10 w-24 h-24 opacity-10 z-[-1]" />
          </div>
        </motion.div>
      </section>

      {/* 2. Four Pillars of Perfection */}
      <section className="py-32 px-6 md:px-12 max-w-[1440px] mx-auto text-center">
        <h2 className="font-display text-4xl md:text-5xl text-primary mb-6">Four Pillars of Perfection</h2>
        <p className="max-w-2xl mx-auto text-stone-500 font-light mb-20 leading-relaxed">
          At Nutmunch, every nut tells a story of meticulous selection and expert roasting. We specialize in categories that cater to the connoisseur.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "The Classics",
              category: "Roasted",
              subtitle: "Pillar 01",
              image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmnqTlGWom6DoyuqHZq7diD9VcG6VNcikGj9k1BQ0bwrOSjlvYvfgZR6WbD47naIq-xWa09HIh37vkMbHYvG3reshauIMgwVQMkr3pqSSCVaS4Qk85oymZq5tpawV3sMP5R9phZrjdhW2I5_GBXEYzqqg5u42U_fXWb-S5nCpsTrdVvS2Zctzi3NbSNg34DiddqQAVuD6A4olA3qyTOvcAt7VIX8Fmr80n6uDn6dwPhSZjKSCORHIDjdYX0gg0pSHvkIX1ALQZ7ZY", // Smoked Himalayan Almonds
              btn: "View Classics"

            },
            {
              title: "Gourmet Fusion",
              category: "Confection",
              subtitle: "Pillar 02",
              image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDZ9W09AOhWQtkUwP_lDMIv0G6JD30ozv7Fby13xC5ibs0GzTwq-lmqYU2zb9JsAckOhfybq9hsWp9xWu73eHF8qDf3_heXqodOmBRjeOi0cPnbdasQdqKC9hvZ1by-YF_NecEuaLjXWFRMCVS4UFaPp9izJLWGgZgnK6ZDFDWnmKDLOdEC0pzJK8LnpO7uuS3LtkKbBzmkW6t_uE-oVV-A0H4GnyhsB9U3wouk5zgxpkHJUEDzZzYt1-HDzf90nn7Ja1jh8-S1uQ", // Gourmet Fusion
              btn: "Explore Fusion"
            },
            {
              title: "Vitality Mixes",
              category: "Raw",
              subtitle: "Pillar 03",
              image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB20-ata1YD0niP7CPwtKZJjeMga949fFRPoc6r0dCg3rCdC8yr9rNbrkd1wvBKj3cmXvTvppLjcBzMWXIpFYJExSsCwwMke8e--lLPNT6cPpL_5L1asF-Sz0noAAk2bysf4XOa89Cq2bffzBOnaRPdLRjZs-_c0fPn9j_duQbVG9h6kgYHiVWFb2haYxpU5yE63vagTpmrKB5xMZ7yvHW9aUMsJh8xeAR5kSw4u93ev2zh8T5mWeYBrugYpwqo706aO06mvSg1I9Q", // Vitality Mixes
              btn: "Shop Mixes"
            },
            {
              title: "Artisanal Herbs",
              category: "Reserve",
              subtitle: "Pillar 04",
              image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIOftFj7gMAPGuja3WQT4RmbFHRQTQ0XST20wtqyI9q41cKaTsWh4ApaPVawOpDe04nuV-Q3CcTJ2Z7d7b97v9ZWc9Q2YHUXIx_-PbheUucm5ofyjqy9eqaaiJoibDAMnInSS4YnBT_96YVHJ49FzS5YEmqtOIXfZJ_PM_DcbSwqV3bPqrV3greq-Z2g5tVC3iA6WlNS7tDiFvTsn-pDF3hVqdQ7d4wkPHV84lV_gEYzH7h_-E85Vm-huRNWkf6uJCgJkQm4O7rx4", // Premium nuts
              btn: "Discover Herbs"
            }
          ].map((pillar, idx) => (
            <div key={idx} className="group relative h-[450px] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-stone-200">
                <img src={pillar.image} alt={pillar.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-8 w-full text-center px-6">
                <span className="text-[9px] tracking-[0.3em] font-bold text-white/70 uppercase mb-2 block">{pillar.subtitle}</span>
                <h3 className="text-white font-display text-2xl mb-6">{pillar.title}</h3>
                <button onClick={() => navigate(`/shop?category=${pillar.category}`)} className="bg-white text-primary px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-accent-terra hover:text-white transition-colors w-full max-w-[140px] mx-auto">
                  {pillar.btn}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. The Nutmunch 2024 Innovations */}
      <section className="py-24 px-6 md:px-12 bg-[#F5F2EA]">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-12">
            <span className="text-accent-terra text-xs font-bold tracking-widest uppercase block mb-4">What's Next</span>
            <h2 className="font-display text-4xl text-primary">The Nutmunch 2024 <br /> Innovations</h2>
            <p className="mt-6 max-w-xl text-stone-500 font-light leading-relaxed">
              Nutmunch continues to push boundaries. This year, we've focused on smoked Himalayan textures and sun-dried organic harvests that preserve every ounce of nutrient-rich oils.
            </p>
            <div className="flex gap-6 mt-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent-terra/10 flex items-center justify-center">
                  <span className="material-symbols-outlined !text-sm text-accent-terra">check</span>
                </div>
                <span className="text-xs uppercase font-bold tracking-wide text-primary">Small Batch Roasting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent-terra/10 flex items-center justify-center">
                  <span className="material-symbols-outlined !text-sm text-accent-terra">check</span>
                </div>
                <span className="text-xs uppercase font-bold tracking-wide text-primary">Zero Preservatives</span>
              </div>
            </div>
            <button onClick={() => navigate('/shop?sort_by=newest')} className="mt-10 bg-secondary text-white px-8 py-4 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-primary transition-colors shadow-lg shadow-secondary/20">
              Taste the Innovation
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Card 1 */}
            <div className="bg-white rounded-3xl p-8 md:p-12 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-shadow">
              <div className="w-56 h-56 mb-8 relative">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmnqTlGWom6DoyuqHZq7diD9VcG6VNcikGj9k1BQ0bwrOSjlvYvfgZR6WbD47naIq-xWa09HIh37vkMbHYvG3reshauIMgwVQMkr3pqSSCVaS4Qk85oymZq5tpawV3sMP5R9phZrjdhW2I5_GBXEYzqqg5u42U_fXWb-S5nCpsTrdVvS2Zctzi3NbSNg34DiddqQAVuD6A4olA3qyTOvcAt7VIX8Fmr80n6uDn6dwPhSZjKSCORHIDjdYX0gg0pSHvkIX1ALQZ7ZY" className="w-full h-full object-contain drop-shadow-2xl" alt="Smoked Almonds" />
              </div>
              <h3 className="font-display text-2xl text-primary mb-2">Smoked Himalayan Almonds</h3>
              <div className="flex justify-between w-full max-w-xs items-center px-4 mt-2">
                <span className="text-accent-terra font-bold text-lg">$12.00</span>
                <span className="text-[10px] text-stone-400 uppercase tracking-wider">Nutmunch Original</span>
              </div>
            </div>
            {/* Product Card 2 */}
            <div className="bg-white rounded-3xl p-8 md:p-12 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-shadow">
              <div className="w-56 h-56 mb-8 relative">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCf-b27JL9A8Fk4nxv2DY82M8Y_5ZpeLMayoIKKjQPsDg4sPiSskeJq0AiIezpqBaqMSArw3ZUsEtO1XvEFcHuARkl8o__CxAaNVfxjdS4E9zZ2HYRhu95uHhaJdU0Au37VZnB-UJT9l8_BPBNh6XoDKmzmKio-xk2S-DIX9PVKNP5hvvD1-Kqto4aSbnexSUCGmZfA6nlc9RD0RWrlLc44-1fxEcpwY8TC4kU4i0QtzTqSNmcCn4ACDGzBF--LYdHgMrka37sgnQA" className="w-full h-full object-contain drop-shadow-2xl" alt="Trail Mix" />
              </div>
              <h3 className="font-display text-2xl text-primary mb-2">Morning Ritual Trail Mix</h3>
              <div className="flex justify-between w-full max-w-xs items-center px-4 mt-2">
                <span className="text-accent-terra font-bold text-lg">$18.50</span>
                <span className="text-[10px] text-stone-400 uppercase tracking-wider">Nutmunch Best-Seller</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Elevate Inbox Newsletter */}
      <section className="py-20 px-6 max-w-[1440px] mx-auto">
        <div className="bg-[#EADDC7] rounded-[2rem] py-24 px-6 md:px-20 text-center relative overflow-hidden">
          {/* Decorative bg element */}
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary/60 mb-4 block">Join the Nutmunch Circle</span>
            <h2 className="font-display text-4xl md:text-5xl text-primary mb-10 leading-tight">Elevate your inbox with <br /> exclusive Nutmunch updates.</h2>

            <div className="bg-white rounded-full p-2 flex flex-col sm:flex-row gap-2 shadow-xl max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 border-none bg-transparent px-6 py-3 focus:ring-0 text-primary placeholder:text-stone-400 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="button"
                onClick={handleSubscribe}
                className="bg-secondary text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary transition-colors"
              >
                Join Now
              </button>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default HomePage;
