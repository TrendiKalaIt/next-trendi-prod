import HeroSection from "../components/HeroSection";
import ProductCard from "../components/ProductCard";

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <HeroSection />

      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductCard name="Product 1" price="₹999" image="/images/sample1.jpg" />
          <ProductCard name="Product 2" price="₹1299" image="/images/sample2.jpg" />
          <ProductCard name="Product 3" price="₹799" image="/images/sample3.jpg" />
          <ProductCard name="Product 4" price="₹1599" image="/images/sample4.jpg" />
        </div>
      </section>
    </div>
  );
}
