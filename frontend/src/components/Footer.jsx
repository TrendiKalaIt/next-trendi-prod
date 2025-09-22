export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800 py-8 mt-10">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} TrendiKala. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="/policies/privacy-policy">Privacy Policy</a>
          <a href="/policies/terms-conditions">Terms & Conditions</a>
          <a href="/contact">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}
