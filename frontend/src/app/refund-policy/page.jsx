export default function CancellationReturnRefund() {
  return (
    <div className="md:pt-[110px] max-w-4xl mx-auto p-6 text-gray-800">

      {/* Title & Effective Date */}
      <h1 className="font-heading text-3xl font-bold text-[#9CAF88] mb-2">
        Cancellation, Return & Refund Policy
      </h1>
      <p className="font-body text-sm text-gray-600 mb-6">
        Last Updated: <span className="font-medium">27-Aug-2025</span>
      </p>

      {/* Intro */}
      <p className="font-body mb-6 leading-relaxed">
        At <span className="font-semibold">Trendikala</span>, we value our
        customers and strive to provide a smooth shopping experience. This
        policy explains our guidelines regarding order cancellations, returns,
        and refunds.
      </p>

      {/* Sections */}
      <div className="space-y-8">
        {/* 1. Order Cancellation */}
        <div className="rounded-2xl">
          <h2 className="text-lg font-home text-[#9CAF88] mb-3">
            1. Order Cancellation
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Orders can be cancelled only within 24 hours of placing the order.</li>
            <li>
              After 24 hours, cancellation requests will not be accepted as the
              order will already be processed.
            </li>
            <li>
              To cancel your order, please contact our customer support team at{" "}
              <a href="mailto:support@trendikala.com" className="text-[#9CAF88] underline">
                support@trendikala.com
              </a>{" "}
              or call <strong>+91 9220440585</strong> with your order details.
            </li>
          </ul>
        </div>

        {/* 2. Returns */}
        <div className="rounded-2xl">
          <h2 className="text-lg font-home text-[#9CAF88] mb-3">2. Returns</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>We accept returns only if the product is:</li>
            <ul className="list-disc pl-6 space-y-1">
              <li>Damaged, defective, or incorrect at the time of delivery.</li>
              <li>Unused, unwashed, and in original packaging with all tags intact.</li>
            </ul>
            <li>Customers must raise a return request within 3 days of delivery.</li>
            <li>Products not eligible for return include:</li>
            <ul className="list-disc pl-6 space-y-1">
              <li>Items on clearance sale</li>
              <li>Personal care, innerwear, or hygiene-related products</li>
              <li>Customized or personalized items</li>
            </ul>
          </ul>
        </div>

        {/* 3. Refunds */}
        <div className="rounded-2xl">
          <h2 className="text-lg font-home text-[#9CAF88] mb-3">3. Refunds</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Once the returned product is received and inspected, we will
              notify you of the approval or rejection of your refund.
            </li>
            <li>
              Approved refunds will be processed to your original payment method
              within 7-10 business days.
            </li>
            <li>
              For COD (Cash on Delivery) orders, refunds will be issued via bank
              transfer/UPI (customer will need to provide details).
            </li>
            <li>Shipping charges, if any, are non-refundable.</li>
          </ul>
        </div>

        {/* 4. Exchange */}
        <div className="rounded-2xl">
          <h2 className="text-lg font-home text-[#9CAF88] mb-3">4. Exchange</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              In some cases, we may offer a replacement/exchange instead of a
              refund (e.g., wrong size or defective product).
            </li>
            <li>Exchange is subject to product availability.</li>
          </ul>
        </div>

        {/* 5. Contact Us */}
        <div className="rounded-2xl">
          <h2 className="text-lg font-home text-[#9CAF88] mb-3">5. Contact Us</h2>
          <p className="font-body mb-1">
            If you have any questions regarding our Cancellation, Return & Refund Policy, please contact us:
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:support@trendikala.com" className="text-[#9CAF88] underline">
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
