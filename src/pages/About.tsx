export default function About() {
  return (
    <div className="pt-[72px]">
      <section className="relative h-[45vh] sm:h-[50vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&w=1920')` }}
        >
          <div className="absolute inset-0 bg-stone-950/60" />
        </div>
        <div className="relative z-10 text-center animate-fade-in">
          <p className="section-label text-stone-300 mb-3">Our Story</p>
          <h1 className="text-4xl sm:text-5xl font-display font-medium text-white tracking-tight">About Eclection</h1>
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="section-label mb-5">Founded 2018</p>
              <h2 className="section-title">
                A vision born
                <br />
                <span className="italic font-display font-normal">from passion</span>
              </h2>
              <p className="mt-7 text-stone-500 font-light leading-[1.8] text-[15px]">
                Eclection was born from a simple belief: that exceptional fashion should be accessible to those who
                appreciate the finer things. Our founder, inspired by the artisan traditions of Europe and the bold
                creativity of contemporary design, set out to create a space where every piece tells a story.
              </p>
              <p className="mt-4 text-stone-500 font-light leading-[1.8] text-[15px]">
                Today, we work with the most talented designers and craftspeople across the globe, curating collections
                that blend heritage techniques with modern sensibility. Each item in our store is chosen not just for
                its beauty, but for its integrity — the quality of its materials, the skill of its making, and the
                timelessness of its design.
              </p>
            </div>
            <div className="overflow-hidden">
              <img
                src="https://images.pexels.com/photos/291762/pexels-photo-291762.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Fashion atelier"
                className="w-full object-cover aspect-[4/5] hover:scale-[1.03] transition-transform duration-700"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-stone-50">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <p className="section-label mb-3">What Drives Us</p>
            <h2 className="section-title">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
            {[
              { title: 'Craftsmanship', description: 'We partner exclusively with artisans and ateliers who share our commitment to excellence. Every stitch, every seam, every detail reflects generations of skill and dedication.' },
              { title: 'Sustainability', description: 'Luxury and responsibility go hand in hand. We prioritize sustainable materials, ethical production, and timeless design that transcends disposable fashion.' },
              { title: 'Individuality', description: 'We curate for the individual, not the masses. Our collections are designed for those who define their own style rather than follow the crowd.' },
            ].map((value) => (
              <div key={value.title} className="bg-white p-8 sm:p-10 card-hover">
                <div className="w-10 h-10 bg-stone-50 flex items-center justify-center mb-5">
                  <span className="text-brand-600 text-lg font-display">{value.title[0]}</span>
                </div>
                <h3 className="text-lg font-medium text-stone-900 tracking-tight mb-4">{value.title}</h3>
                <p className="text-stone-500 font-light leading-[1.8] text-[15px]">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <p className="section-label mb-3">The People</p>
            <h2 className="section-title">Our Team</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
            {[
              { name: 'Alessandra Vitti', role: 'Founder & Creative Director', img: 'https://images.pexels.com/photos/769110/pexels-photo-769110.jpeg?auto=compress&cs=tinysrgb&w=400' },
              { name: 'Marcus Chen', role: 'Head of Curation', img: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400' },
              { name: 'Sophie Laurent', role: 'Client Experience', img: 'https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=400' },
            ].map((person) => (
              <div key={person.name} className="text-center group">
                <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto overflow-hidden bg-stone-50">
                  <img src={person.img} alt={person.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                </div>
                <h3 className="mt-6 text-sm font-medium text-stone-900">{person.name}</h3>
                <p className="text-[11px] text-stone-400 mt-1.5 tracking-[0.1em] uppercase">{person.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
