export default function ProductCard({ name, price, image }) {
  return (
    <div className="border p-4 rounded-lg hover:shadow-lg transition">
      <img src={image} alt={name} className="w-full h-48 object-cover rounded" />
      <h3 className="font-semibold mt-2">{name}</h3>
      <p className="text-gray-600">{price}</p>
    </div>
  );
}
