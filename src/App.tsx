import { useMemo, useState } from 'react';
import { Search, Download, MessageCircle, MapPin, Ship, Package, Sparkles, X, Menu } from 'lucide-react';
import { products, categories, type Category } from '@/data/products';
import { buildWhatsAppUrl, buildDirectWhatsAppUrl } from '@/lib/whatsapp';

type FilterKey = Category | 'all';

function App() {
  const [activeCategory, setActiveCategory] = useState<FilterKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        p.code.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleDownloadLineSheet = () => {
    const header = 'Product Code,Collection Title,Category,MOQ,Material/Technique,Image URL\n';
    const rows = products
      .map(
        (p) =>
          `${p.code},"${p.title}",${p.category},"${p.moq}","${p.material}",${p.image}`
      )
      .join('\n');
    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Purnima-Exports-Line-Sheet-2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-cream-50 text-charcoal-800 font-sans">
      {/* Top Bar */}
      <div className="bg-charcoal-900 text-cream-100 text-[11px] tracking-ultra-wide uppercase">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between py-2">
          <span className="hidden sm:flex items-center gap-2">
            <MapPin className="w-3 h-3 text-gold-400" />
            Okhla Industrial Area, New Delhi, India
          </span>
          <span className="flex items-center gap-2">
            <Ship className="w-3 h-3 text-gold-400" />
            Global Shipping — USA · UK · Europe
          </span>
          <span className="hidden sm:flex items-center gap-2">
            <Package className="w-3 h-3 text-gold-400" />
            Private Label Manufacturing
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-cream-50/95 backdrop-blur-md border-b border-cream-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 py-6 lg:py-8">
            {/* Brand */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-1">
                <Sparkles className="w-5 h-5 text-gold-500" />
                <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl tracking-mega-wide text-charcoal-900 font-medium">
                  PURNIMA EXPORTS
                </h1>
              </div>
              <p className="font-serif italic text-sm sm:text-base text-charcoal-700/70 tracking-wide">
                Private Label Luxury Evening Wear &amp; Hand-Embroidered Collections
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href={buildDirectWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 text-xs tracking-ultra-wide uppercase font-medium rounded-sm transition-all hover:bg-[#1DA851] hover:shadow-lg w-full sm:w-auto"
              >
                <MessageCircle className="w-4 h-4" />
                Direct B2B WhatsApp
              </a>
              <button
                onClick={handleDownloadLineSheet}
                className="inline-flex items-center justify-center gap-2 border border-charcoal-900 text-charcoal-900 px-6 py-3 text-xs tracking-ultra-wide uppercase font-medium rounded-sm transition-all hover:bg-charcoal-900 hover:text-cream-50 w-full sm:w-auto"
              >
                <Download className="w-4 h-4" />
                Download Line Sheet
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="pb-5">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-700/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by SKU (e.g. PE-2026-01) or keyword…"
                className="w-full bg-cream-100 border border-cream-200 rounded-sm py-3 pl-11 pr-10 text-sm text-charcoal-800 placeholder:text-charcoal-700/40 focus:outline-none focus:border-gold-500 focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-700/40 hover:text-charcoal-900 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Category Filter Bar */}
      <nav className="border-b border-cream-200 bg-white/60 sticky top-[var(--filter-top,0)] z-40">
        {/* Mobile toggle */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center gap-2 px-4 py-4 w-full text-xs tracking-ultra-wide uppercase text-charcoal-800"
          >
            <Menu className="w-4 h-4" />
            {categories.find((c) => c.key === activeCategory)?.label ?? 'Collections'}
          </button>
          {mobileMenuOpen && (
            <div className="flex flex-col border-t border-cream-200 animate-fade-in">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => {
                    setActiveCategory(cat.key);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-4 py-3 text-xs tracking-ultra-wide uppercase border-b border-cream-100 transition-colors ${
                    activeCategory === cat.key
                      ? 'bg-cream-100 text-gold-600 font-medium'
                      : 'text-charcoal-700 hover:bg-cream-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop tabs */}
        <div className="hidden lg:flex mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 items-center gap-1 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`whitespace-nowrap px-5 py-4 text-xs tracking-ultra-wide uppercase font-medium border-b-2 transition-all ${
                activeCategory === cat.key
                  ? 'border-gold-500 text-charcoal-900'
                  : 'border-transparent text-charcoal-700/60 hover:text-charcoal-900 hover:border-cream-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Product Grid */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Section heading */}
        <div className="text-center mb-10 lg:mb-14">
          <p className="font-display text-xs tracking-mega-wide uppercase text-gold-500 mb-3">
            The 2026 Collection
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal-900 italic">
            Curated for the Discerning Buyer
          </h2>
          <div className="mt-4 w-16 h-px bg-gold-400 mx-auto" />
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-10 h-10 text-cream-300 mx-auto mb-4" />
            <p className="font-serif text-xl text-charcoal-700/60 italic">
              No pieces match your search.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="mt-4 text-xs tracking-ultra-wide uppercase text-gold-600 hover:text-gold-500 transition-colors"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProducts.map((product, index) => (
              <article
                key={product.id}
                className="group bg-white border border-cream-200 rounded-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:border-gold-400 animate-fade-up"
                style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-[3/4] bg-cream-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] tracking-ultra-wide uppercase font-medium text-charcoal-900 rounded-sm">
                    {product.code}
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-5 lg:p-6">
                  <h3 className="font-serif text-lg lg:text-xl text-charcoal-900 leading-snug mb-3">
                    {product.title}
                  </h3>

                  <div className="space-y-2 mb-5">
                    <div className="flex items-start gap-2">
                      <span className="inline-block bg-cream-100 text-charcoal-700 text-[10px] tracking-wide uppercase px-2.5 py-1 rounded-sm">
                        {product.moq}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-700/60 leading-relaxed">
                      {product.material}
                    </p>
                  </div>

                  <a
                    href={buildWhatsAppUrl(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center justify-center gap-2 bg-charcoal-900 text-cream-50 px-4 py-3 text-[11px] tracking-ultra-wide uppercase font-medium rounded-sm transition-all hover:bg-[#25D366] group/btn"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Inquire Sample via WhatsApp
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-charcoal-900 text-cream-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
            {/* Brand */}
            <div>
              <h3 className="font-display text-lg tracking-mega-wide text-cream-50 mb-3">
                PURNIMA EXPORTS
              </h3>
              <p className="font-serif italic text-sm text-cream-200/60 leading-relaxed">
                Private label manufacturer of luxury evening wear and hand-embroidered
                garments, serving boutiques and retailers worldwide.
              </p>
            </div>

            {/* Credentials */}
            <div>
              <h4 className="font-sans text-xs tracking-ultra-wide uppercase text-gold-400 mb-4">
                Export Credentials
              </h4>
              <ul className="space-y-3 text-sm text-cream-200/70">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                  Okhla Industrial Area, Phase II, New Delhi — 110020, India
                </li>
                <li className="flex items-start gap-2">
                  <Ship className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                  Global Shipping to USA, UK &amp; Europe — DDP &amp; FOB available
                </li>
                <li className="flex items-start gap-2">
                  <Package className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                  Low MOQ from 40 pcs · Private label &amp; white-label options
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-sans text-xs tracking-ultra-wide uppercase text-gold-400 mb-4">
                B2B Inquiries
              </h4>
              <p className="text-sm text-cream-200/70 mb-4 leading-relaxed">
                Click below to start a direct WhatsApp conversation with our export desk
                — no forms, no waiting.
              </p>
              <a
                href={buildDirectWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 text-xs tracking-ultra-wide uppercase font-medium rounded-sm transition-all hover:bg-[#1DA851]"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-charcoal-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] tracking-wide text-cream-200/40">
              © 2026 Purnima Exports. All designs are proprietary. Unauthorized
              reproduction is prohibited.
            </p>
            <p className="text-[11px] tracking-wide text-cream-200/40">
              Crafted in New Delhi, India
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
