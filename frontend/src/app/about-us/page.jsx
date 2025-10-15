'use client';
import {
  Sparkles,
  Users,
  Leaf,
  Heart,
  Lightbulb,
  Handshake
} from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50 font-inter text-gray-800">

      {/* Hero Section */}
      <section
        className="relative h-80 md:h-[500px] bg-cover bg-[#c9e3bb] bg-center flex items-center justify-center text-center p-4"
        style={{ backgroundImage: 'url()' }} 
      >
        <div className="absolute inset-0 "></div>
        <div className="relative z-5 text-black max-w-3xl mx-auto">
          <h1 className="font-home text-4xl md:text-6xl font-bold mb-4 font-playfair-display">
            Crafting Experiences, One Product at a Time
          </h1>
          <p className="font-body text-lg md:text-xl font-light">
            Discover the passion, purpose, and people behind TRENDIKALA.
          </p>
        </div>
      </section>

      {/* Our Journey Section */}
      <section className="container mx-auto py-16 px-4 md:px-8 bg-white rounded-xl shadow-sm  relative z-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-2/3 text-center md:text-left">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 font-playfair-display text-[#9CAF88]">Our Journey</h2>
            <p className="font-body text-lg mb-4 leading-relaxed text-justify">
              We're two friends who turned our shared dream into reality. ✨
              One of us is a designer with an eye for detail and timeless style, while the other comes from a journalism & marketing background, passionate about storytelling and connecting with people. Together, we decided to create more than just a clothing brand — we wanted to build a space where fashion feels personal, aesthetic, and accessible.
              At Trendikala, we believe that great style doesn't have to come with a hefty price tag. Our vision is to bring you Pinterest-inspired vibes with the best quality fabrics, unique designs, and a touch of craftsmanship — all at prices that feel good.
              Every piece is thoughtfully designed, carefully produced, and made with love, because we don’t just want to sell clothes, we want you to feel confident, comfortable, and effortlessly stylish every day.
              From custom pieces to everyday outfits, we are here to make your wardrobe truly you. 💌
              ✨ Two friends. One dream. Your story, in style.
            </p>
          </div>

          <div className='lg:w-1/3 flex justify-center gap-1'>
            {[
              { src: '/Founder.webp', name: 'Manshi Agrawal', role: 'Founder' },
              { src: '/Co-Founder.webp', name: 'Raj Laxmi', role: 'Co-Founder' }
            ].map((person, i) => (
              <div key={i} className="w-full">
                <img
                  src={person.src}
                  alt={person.name}
                  className="rounded-2xl w-[170px] h-[260px] object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/600x400/E5E7EB/6B7280?text=Image+Not+Found`;
                  }}
                />
                <p className='font-semobold font-home text-[#9CAF88] pt-2 lg:text-left text-center'>{person.name}</p>
                <p className='lg:text-left text-center text-sm text-gray-400 font-body'>{person.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-green-50 py-16 px-4 md:px-8 mt-16">
        <div className="container mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12 font-playfair-display text-[#9CAF88]">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { icon: Sparkles, title: 'Uncompromising Quality', desc: 'We are dedicated to offering products crafted with superior materials and meticulous attention to detail.', color: 'text-yellow-500' },
              { icon: Heart, title: 'Customer Happiness', desc: 'Your satisfaction is our priority. We strive to provide an exceptional shopping experience and support.', color: 'text-red-500' },
              { icon: Lightbulb, title: 'Constant Innovation', desc: 'We continuously seek new ideas and trends to bring you fresh, exciting, and relevant products.', color: 'text-blue-500' },
              { icon: Leaf, title: 'Conscious Sourcing', desc: 'Committed to responsible practices, we prioritize ethical sourcing and sustainable production where possible.', color: 'text-green-600' },
              { icon: Users, title: 'Building Community', desc: 'We believe in fostering connections and building a vibrant community around our shared passions.', color: 'text-emerald-600' },
              { icon: Handshake, title: 'Trust & Transparency', desc: 'We operate with integrity, ensuring clear communication and honest practices in all our dealings.', color: 'text-teal-500' },
            ].map((val, i) => (
              <div key={i} className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <val.icon size={48} className={`${val.color} mx-auto mb-4`} />
                <h3 className="font-heading text-2xl font-semibold mb-3">{val.title}</h3>
                <p className="font-body text-gray-600">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 md:px-8 text-center mt-16">
        <div className="container mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl text-[#9CAF88] font-bold mb-6 font-playfair-display">
            Ready to Explore Our Collections?
          </h2>
          <p className="font-body text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Dive into our curated selection and find something truly special.
          </p>
          <a
            href="/categories"
            className="font-heading inline-block bg-[#9CAF88] text-white px-8 py-2 rounded-full font-semibold text-lg hover:bg-gray-500 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Shop Now
          </a>
        </div>
      </section>

    </div>
  );
}
