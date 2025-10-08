export default function ShippingDeliveryPage() {
  return (
    <div className="max-w-4xl mx-auto md:mt-12 p-6 text-gray-800">
      {/* Title & Effective Date */}
      <h1 className="font-heading text-3xl font-bold text-[#9CAF88] mb-2">
        Shipping & Delivery Policy
      </h1>
      <p className=" font-body text-sm text-gray-600 mb-6">
        Last Updated: <span className="font-medium">27-Aug-2025</span>
      </p>

      {/* Intro */}
      <p className=" font-body mb-6 leading-relaxed">
        At <span className="font-semibold">Trendikala</span>, we are committed
        to delivering your products quickly, safely, and affordably. This
        policy outlines the terms and conditions regarding shipping and delivery
        of orders placed on our platform.
      </p>

      {/* Sections */}
      <div className="space-y-8">
        {/* 1 */}
        <div className=" rounded-2xl">
          <h2 className="text-lg font-home text-[#9CAF88] mb-3">
            1. Shipping Coverage
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>We currently ship orders across India.</li>
            <li>
              International shipping may be available on selected products
              (charges and timelines will vary).
            </li>
          </ul>
        </div>

        {/* 2 */}
        <div className=" rounded-2xl">
          <h2 className="text-lg font-home text-[#9CAF88] mb-3">
            2. Shipping Charges
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Standard shipping charges (if applicable) will be displayed at
              checkout.
            </li>
            <li>
              We may offer free shipping on orders above{" "}
              <span className="font-medium">₹5000</span> (as per promotional
              offers).
            </li>
          </ul>
        </div>

        {/* 3 */}
        <div className=" rounded-2xl">
          <h2 className="text-lg font-home text-[#9CAF88] mb-3">
            3. Order Processing Time
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Orders are usually processed within 1-2 business days.</li>
            <li>
              Orders placed on weekends or public holidays will be processed on
              the next working day.
            </li>
          </ul>
        </div>

        {/* 4 */}
        <div className=" rounded-2xl">
          <h2 className="text-lg font-home text-[#9CAF88] mb-3">
            4. Delivery Timelines
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Standard delivery within India: 5-7 business days (depending on
              location).
            </li>
            <li>Metro cities may receive faster delivery (4-7 business days). </li>
            <li>
              Remote/rural areas may take longer than the standard timeline.
            </li>
            <li>International delivery (if applicable): 7-15 business days.</li>
          </ul>
        </div>

        {/* 5 */}
        <div className=" rounded-2xl">
          <h2 className="text-lg font-home text-[#9CAF88] mb-3">
            5. Order Tracking
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Once your order has been shipped, you will receive a tracking ID
              and link via email/SMS.
            </li>
            <li>
              Customers can track shipments on the courier partner's
              website/app.
            </li>
          </ul>
        </div>

        {/* 6 */}
        <div className=" rounded-2xl">
          <h2 className="text-lg font-home text-[#9CAF88] mb-3">
            6. Delays in Delivery
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Delivery timelines are estimates; delays may occur due to unforeseen circumstances such as weather, logistics, strikes, or government restrictions.
            </li>
            <li>
              In case of significant delays, our support team will keep you updated. 
            </li>
          </ul>
        </div>

        {/* 7 */}
        <div className=" rounded-2xl">
          <h2 className="text-lg font-home text-[#9CAF88] mb-3">
            7. Delivery Attempts
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Our courier partner will attempt delivery up to 3 times.</li>
            <li>
              If unsuccessful, the package will be returned to us, and
              additional re-shipping charges may apply.
            </li>
          </ul>
        </div>

        {/* 8 */}
        <div className=" rounded-2xl">
          <h2 className="text-lg font-home text-[#9CAF88] mb-3">
            8. Damaged or Tampered Packages
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              If you receive a damaged or tampered package, please do not accept
              delivery and immediately inform our support team.
            </li>
            <li>
              If already accepted, raise a complaint within 24 hours of delivery
              with clear photos of the package and product.
            </li>
          </ul>
        </div>

        {/* 9 */}
        <div className=" rounded-2xl">
          <h2 className="text-lg font-home text-[#9CAF88] mb-3">9. Contact Us</h2>
          <p className=" font-body mb-1">
            For questions about shipping & delivery, please reach out:
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:support@trendikala.com"
              className="text-[#9CAF88] underline"
            >
              support@trendikala.com
            </a>
          </p>
          <p>
            <strong>Phone:</strong> +91 9220440585
          </p>
        </div>
      </div>
    </div>
  );
}
