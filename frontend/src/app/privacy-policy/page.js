export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto mt-10 p-6">
      <div className="max-w-4xl mx-auto text-gray-800">
        {/* Title & Effective Date */}
        <h1 className="font-heading text-3xl font-bold text-[#9CAF88] mb-2">Privacy Policy</h1>
        <p className="font-body text-sm text-gray-600 mb-6">
          Effective Date: <span className="font-medium">27-Aug-2025</span>
        </p>

        {/* Intro */}
        <p className="font-body mb-4 leading-relaxed">
          At <span className="font-semibold">Trendikala</span>, your trust matters to us. We know how important your personal
          information is, and we're committed to protecting it. This Privacy Policy explains, in plain language, how we
          handle the information you share with us when you shop on our website{" "}
          <a href="https://www.trendikala.com" className="text-[#9CAF88] underline">
            www.trendikala.com
          </a>.
        </p>
        <p className="font-body mb-6 leading-relaxed">
          By using our website, you agree to the practices described below.
        </p>

        <div className="space-y-8">
          {/* 1. What Information We Collect */}
          <section>
            <h2 className="font-home text-lg text-[#9CAF88]">1. What Information We Collect</h2>
            <p className="font-body leading-relaxed">
              When you interact with us, we may collect:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-body">
              <li>
                <strong>Personal details:</strong> like your name, email address, phone number, billing/shipping address,
                and payment details (to process your orders).
              </li>
              <li>
                <strong>Technical details:</strong> such as your IP address, browser type, and device information (to help
                us improve our site).
              </li>
              <li>
                <strong>Cookies:</strong> small files stored on your device to make your shopping experience smoother.
              </li>
            </ul>
          </section>

          {/* 2. How We Use Your Information */}
          <section>
            <h2 className="font-home text-lg text-[#9CAF88]">2. How We Use Your Information</h2>
            <p className="font-body leading-relaxed">
              We collect and use your information only for legitimate purposes, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-body">
              <li>To process and deliver your orders securely.</li>
              <li>To provide customer support and respond to your queries.</li>
              <li>To improve our website, products, and services.</li>
              <li>
                To send you offers, updates, or newsletters (only if you've opted in — and you can unsubscribe anytime).
              </li>
              <li>To protect our platform and prevent fraud.</li>
            </ul>
            <p className="font-body mt-3 leading-relaxed">
              We do not sell or rent your information to anyone.
            </p>
          </section>

          {/* 3. When We Share Information */}
          <section>
            <h2 className="font-home text-lg text-[#9CAF88]">3. When We Share Information</h2>
            <p className="font-body leading-relaxed">
              We only share your data in the following limited circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-body">
              <li>
                <strong>Service providers:</strong> such as trusted payment gateways, shipping/courier services, and IT
                support — but only what's necessary.
              </li>
              <li>
                <strong>Legal reasons:</strong> if required by law, regulation, or a government request.
              </li>
              <li>
                <strong>Business transfers:</strong> if Trendikala is ever involved in a merger, acquisition, or sale, your
                data may be transferred as part of that process — but your privacy rights will remain protected.
              </li>
            </ul>
          </section>

          {/* 4. How We Protect Your Data */}
          <section>
            <h2 className="font-home text-lg text-[#9CAF88]">4. How We Protect Your Data</h2>
            <p className="font-body leading-relaxed">
              We use security measures (like encryption, firewalls, and secure servers) to safeguard your personal
              details. While no online system is 100% secure, we do everything reasonably possible to keep your
              information safe.
            </p>
          </section>

          {/* 5. Your Privacy Choices */}
          <section>
            <h2 className="font-home text-lg text-[#9CAF88]">5. Your Privacy Choices</h2>
            <p className="font-body leading-relaxed">
              You are always in control of your personal information. You can:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-body">
              <li>Access or update your account details.</li>
              <li>Request that we delete your personal data (subject to legal obligations).</li>
              <li>Opt out of marketing emails by clicking “unsubscribe.”</li>
            </ul>
          </section>

          {/* 6. Cookies & Tracking */}
          <section>
            <h2 className="font-home text-lg text-[#9CAF88]">6. Cookies & Tracking</h2>
            <p className="font-body leading-relaxed">
              Cookies help us personalize your experience (like remembering what's in your cart). You can disable cookies
              in your browser, but some parts of the site may not work properly without them.
            </p>
          </section>

          {/* 7. Third-Party Links */}
          <section>
            <h2 className="font-home text-lg text-[#9CAF88]">7. Third-Party Links</h2>
            <p className="font-body leading-relaxed">
              Sometimes, our site may link to other websites. Please note that we are not responsible for their privacy
              practices, so we encourage you to read their policies.
            </p>
          </section>

          {/* 8. Children’s Privacy */}
          <section>
            <h2 className="font-home text-lg text-[#9CAF88]">8. Children's Privacy</h2>
            <p className="font-body leading-relaxed">
              Our website is intended for users above 18 years. We do not knowingly collect data from children. If we
              discover that we've collected information from a minor, we will delete it immediately.
            </p>
          </section>

          {/* 9. Policy Updates */}
          <section>
            <h2 className="font-home text-lg text-[#9CAF88]">9. Policy Updates</h2>
            <p className="font-body leading-relaxed">
              We may update this Privacy Policy occasionally to reflect changes in law or our practices. Any updates will
              be posted here, with a new effective date.
            </p>
          </section>

          {/* 10. Contact Us */}
          <section>
            <h2 className="font-home text-lg text-[#9CAF88]">10. Contact Us</h2>
            <p className="font-body leading-relaxed">
              If you have any questions, concerns, or requests about your personal data or this Privacy Policy, please
              reach out:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-body mt-2">
              <li>Email: support@trendikala.com</li>
              <li>Phone: +91 9220440585</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
