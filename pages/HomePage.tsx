
import React from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../constants';

const HomePage: React.FC = () => {
  const bestsellers = PRODUCTS.slice(0, 4);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full overflow-hidden bg-stone-900 -mt-[112px]">
        <div className="absolute inset-0 opacity-70">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB1jlPDb4FA-fR4iZ0yo4S5qGqPDLDMmFWX2y--_T_CxsmKYit-y12S0oS20JdL-EIAqxhqI9lrTd9NI3Fgqo-Tvv0yJVBcEAT1DgRWDiX6MsHrV6bFzZ9tWyYOZhppHkEQGd4DfOf0pub8oBDO5YUXJOIG7Od1Kb3zLCUj4tyGAoQ8tN0Zw4QaRl0-6AUeE69KO9wK2cIiZ9L4yO1pXcONKDGi7L-4ej8-Ut7ROy2_lIpIPTvYbtvt7bWoXfMNfBoVOvoAk7LPfOc')" }}
          ></div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 pt-20">
          <span className="text-accent-gold text-sm tracking-[0.3em] uppercase mb-4 font-bold">Pure Origin • Peerless Quality</span>
          <h2 className="font-display text-5xl md:text-7xl text-white max-w-4xl mb-8 leading-[1.1]">The Essence of the Harvest</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/shop?grade=Reserve" className="bg-primary text-white px-8 py-4 text-xs tracking-widest uppercase font-bold hover:bg-opacity-90 transition-all rounded-sm text-center">Shop The Reserve</Link>
            <button onClick={() => document.getElementById('legacy')?.scrollIntoView({ behavior: 'smooth' })} className="border border-white text-white px-8 py-4 text-xs tracking-widest uppercase font-bold hover:bg-white hover:text-stone-900 transition-all rounded-sm">Discover Heritage</button>
          </div>
        </div>
      </section>

      {/* Categories Bento Grid */}
      <section className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-xl">
            <span className="text-accent-gold text-xs tracking-[0.2em] uppercase font-bold block mb-2">Categories</span>
            <h2 className="font-display text-4xl text-primary dark:text-white leading-tight">World-Class Selection</h2>
          </div>
          <Link to="/shop" className="text-xs tracking-widest uppercase font-bold border-b border-accent-gold pb-1 hover:text-accent-gold transition-colors">View All Collections</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[700px]">
          {/* Main Large Card */}
          <div className="md:col-span-7 relative group overflow-hidden rounded-lg bg-stone-200">
            <div
              className="absolute inset-0 transition-transform duration-700 group-hover:scale-105 bg-cover bg-center"
              style={{ backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBw8TaovxE1k6m315z3YOh5aE07jVpzldH9Nrqio85Kaf43pMwl7UYuTzhNtDn7i68fCh79s0nGZlx6AlrD5v1jExOuuGBCMnBDPA8Pu851PR-OHztIHbiUV6ikeE9QdDkPGkUC9Cp2bs8DvHunWtjRiY_VmngmlAoiXibfGc_xpWFNU2BONmmva-ivqrLcsmpFUwCbUCSQwy8q-5jpWpHgNzYiXP6QlwufZ1hQXfIR_wmpIesBV_qQTleuJCrKKqyyWYwROJsMLfI')" }}
            ></div>
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="font-display text-3xl mb-2">The California Selection</h3>
              <p className="text-stone-200 text-sm max-w-sm mb-4">Direct from our sun-drenched orchards, the gold standard of raw nonpareil almonds.</p>
              <Link to="/shop?origin=USA%20(California)" className="text-[10px] tracking-widest uppercase font-bold border-b border-white pb-1 group-hover:text-accent-gold group-hover:border-accent-gold transition-all">Explore Series</Link>
            </div>
          </div>

          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="h-1/2 relative group overflow-hidden rounded-lg bg-stone-200">
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-105 bg-cover bg-center"
                style={{ backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCg2Sll2uXFfqR7tiYwxN_5wi0SbHWuxtBANymAzXgnEniAsQnbCXdYk4_OnMWC8aFoNVCoxfs4l_SnJ19gk4JqMrv___A5VsOZC7K8-HZYREIxkDExEdcignRCLUdimrlywafrDttbUMNIl66K5W-gD5iRVnX1BG4lozK928ve884hEkwPZ4lnlnxhJ3xKlL2gaFffM0JZfT_owOOLl3EFc65-E0NWK6639cvCW-jT5Pf39gnBCRG0eBnvW8tbnzqtCt3zQgZaXn4')" }}
              ></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="font-display text-xl mb-1">Artisan Roasted</h3>
                <Link to="/shop?category=Roasted" className="text-[9px] tracking-widest uppercase font-bold opacity-80 hover:opacity-100 hover:text-accent-gold transition-all">Shop Roast</Link>
              </div>
            </div>
            <div className="h-1/2 relative group overflow-hidden rounded-lg bg-stone-200">
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-105 bg-cover bg-center"
                style={{ backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuD5JkkXfJ_VYH_Q3IbZKROSx_GwmcnQ292s7eO4tRlq0PkBAtF6rw1BtU5fitF8cuF5RwRci3bQAKNFnM3i5Pj3PDywS7twQfzUmz1y81Mh_vkbHBm_f25GYbPBvjXX_BgeVVDLRvOc69Jqhvbp5yJpufpxBzPs3KnZ7ENyPeZnB3XBS4IDfUJUWVPdn8iZlEeD-xmaGzPrBIHygQBTZaSs6A7NWbmRx44jsemD3Ibpt6hVUqGvaHl_ABiJRvayFZv_mcAfUQoGanI')" }}
              ></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="font-display text-xl mb-1">Bulk Exports</h3>
                <Link to="/shop?grade=Reserve" className="text-[9px] tracking-widest uppercase font-bold opacity-80 hover:opacity-100 hover:text-accent-gold transition-all">Export Inquiry</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers Slider */}
      <section className="bg-stone-100 dark:bg-stone-900/50 py-24">
        <div className="px-6 md:px-12 max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <span className="text-accent-gold text-xs tracking-[0.4em] uppercase font-bold block mb-4">Curated Favorites</span>
            <h2 className="font-display text-4xl text-primary dark:text-white">The Bestsellers</h2>
          </div>
          <div className="flex overflow-x-auto gap-8 pb-12 scrollbar-hide snap-x">
            {bestsellers.map(product => (
              <div key={product.id} className="min-w-[300px] md:min-w-[340px] flex-shrink-0 group snap-start">
                <Link to={`/product/${product.id}`}>
                  <div className="aspect-[4/5] bg-white dark:bg-stone-800 relative mb-6 overflow-hidden rounded shadow-sm border border-border-soft dark:border-stone-700">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('${product.image}')` }}></div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-end justify-center pb-8 opacity-0 group-hover:opacity-100">
                      <button className="bg-primary text-white px-8 py-3 text-[10px] tracking-widest uppercase font-bold rounded-sm shadow-xl hover:bg-accent-gold transition-colors">View Details</button>
                    </div>
                  </div>
                </Link>
                <div className="text-center px-4">
                  <p className="text-[10px] tracking-widest text-stone-400 uppercase font-semibold mb-1">{product.category}</p>
                  <h3 className="font-display text-xl text-stone-800 dark:text-white mb-2">{product.name}</h3>
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-accent-gold font-bold">${product.price.toFixed(2)}</span>
                    <span className="text-stone-400 text-xs italic">{product.weight}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legacy Section */}
      <section id="legacy" className="py-24 grid md:grid-cols-2 gap-0 overflow-hidden">
        <div className="bg-primary text-white flex flex-col justify-center px-12 md:px-24 py-20 order-2 md:order-1">
          <span className="text-accent-gold text-xs tracking-[0.4em] uppercase font-bold mb-6">Our Legacy</span>
          <h2 className="font-display text-4xl md:text-5xl leading-tight mb-8">Four Decades of Cultivating Perfection.</h2>
          <p className="text-stone-300 font-light leading-relaxed mb-10 text-lg italic">
            "From the dusty trails of Central California to the high-demand markets of Dubai and Tokyo, our almonds have traveled the globe, carrying with them the standard of uncompromising quality."
          </p>
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-accent-gold">verified</span>
              <div>
                <h4 className="font-semibold text-sm uppercase tracking-widest">Certified Excellence</h4>
                <p className="text-stone-400 text-sm mt-1">Full traceability from tree to table, meeting international ISO and GFSI standards.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-accent-gold">public</span>
              <div>
                <h4 className="font-semibold text-sm uppercase tracking-widest">Global Logistics</h4>
                <p className="text-stone-400 text-sm mt-1">Dedicated export wing handling customs and cold-chain shipping for bulk partners.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="min-h-[400px] relative order-1 md:order-2">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDfldM7_-Md3QJXm2cJcHHjltA-cyAl6VyV2mGtsPIjvT5UcI1TenemrOUvP8mHoTh8AjgffDO1wOeBPJiYdz1hifLTEE4A-otCMHYVSNAXwtwicTjbAkbg0Iiej1tJSvAe2ZqLk-IsTr-pUP_z1vT-oeixagQe64ZjIoLEQpi8pKKSLncyYb4Shej9Pn_l04OZ-6WakqQGVhoc04mLuX66_cDaM1ZcW_f2ARQxOgk4S9YcPS_FPCB4HPj7busehjdKP2GkK8_i9xk')" }}></div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-[#213e2b] dark:bg-[#0a0f0a] py-20 border-y border-stone-800/20">
        <div className="px-6 md:px-12 max-w-[1200px] mx-auto text-center">
          <h2 className="font-display text-3xl text-white mb-4">The Harvest Journal</h2>
          <p className="text-stone-400 mb-10 max-w-xl mx-auto">Join our inner circle for seasonal harvest updates, limited-batch releases, and international culinary insights.</p>
          <form className="flex flex-col md:flex-row gap-0 max-w-md mx-auto overflow-hidden rounded shadow-2xl">
            <input className="flex-1 bg-stone-100/10 border-none text-white px-6 py-4 focus:ring-0 placeholder:text-stone-500 font-medium" placeholder="Your email address" type="email" />
            <button type="button" onClick={() => alert("Thank you for subscribing to our harvest journal.")} className="bg-accent-gold text-white px-8 py-4 text-xs tracking-widest uppercase font-bold hover:bg-white hover:text-primary transition-all">Subscribe</button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
