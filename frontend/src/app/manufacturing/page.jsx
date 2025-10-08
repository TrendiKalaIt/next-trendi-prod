import {
  Settings,
  CheckCircle,
  Leaf,
  Users,
  Package,
  Sparkles,
  Palette,
  Truck,
} from "lucide-react";

export default function ManufacturingPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-inter text-gray-800">
      <section
        className="relative h-96 md:h-[500px] bg-cover bg-[#c9e3bb] bg-center flex items-center justify-center text-center p-4"
        style={{ backgroundImage: "url()" }}
      >
        <div className="absolute inset-0"></div>
        <div className="relative z-8 text-black max-w-3xl mx-auto">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4 font-playfair-display">
            Where Quality Meets Craftsmanship
          </h1>
          <p className="font-body text-lg md:text-xl font-light">
            A transparent look into the meticulous process behind every TRENDI
            KALA creation.
          </p>
        </div>
      </section>

      <section className="container mx-auto py-16 px-4 md:px-8 bg-white rounded-xl shadow-lg  relative z-8 text-center">
        <h2 className="font-home text-3xl md:text-4xl font-bold mb-6 font-playfair-display text-[#9CAF88]">
          Our Philosophy: Built to Last
        </h2>
        <p className="font-body text-lg leading-relaxed max-w-3xl mx-auto">
          At{" "}
          <span className="font-semibold italic text-[#9CAF88]">
            ' TRENDI KALA '
          </span>
          , we believe that true quality is woven into every fiber and forged
          in every process. Our manufacturing journey is driven by a commitment
          to excellence, sustainability, and the well-being of our artisans. We
          invite you to explore the steps that bring our products to life.
        </p>
      </section>

      <section className="bg-green-50 py-16 px-4 md:px-8 mt-16">
        <div className="container mx-auto text-center">
          <h2 className="font-home text-3xl md:text-4xl font-bold mb-12 font-playfair-display text-[#9CAF88]">
            Our Unwavering Commitment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <CheckCircle size={60} className="text-[#9CAF88] mx-auto mb-4" />
              <h3 className="font-home text-2xl font-semibold mb-3">
                Superior Quality
              </h3>
              <p className="font-body text-gray-600">
                We use only the finest materials and employ rigorous quality
                checks at every stage to ensure durability and excellence.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <Leaf size={60} className="text-[#9CAF88] mx-auto mb-4" />
              <h3 className="font-home text-2xl font-semibold mb-3">
                Sustainable Practices
              </h3>
              <p className="font-body text-gray-600">
                From eco-friendly materials to responsible waste management, we
                strive for a minimal environmental footprint.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <Users size={60} className="text-[#9CAF88] mx-auto mb-4" />
              <h3 className="font-home text-2xl font-semibold mb-3">
                Ethical Production
              </h3>
              <p className="font-body text-gray-600">
                We ensure fair wages, safe working conditions, and respect for
                all individuals involved in our production process.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <Sparkles size={60} className="text-[#9CAF88] mx-auto mb-4" />
              <h3 className="font-home text-2xl font-semibold mb-3">
                Continuous Improvement
              </h3>
              <p className="font-body text-gray-600">
                We are always seeking new technologies and methods to enhance
                our products and processes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
