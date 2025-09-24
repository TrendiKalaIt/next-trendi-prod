'use client'; // Next.js client component

import { useState, useEffect, useRef } from 'react';
import { Heart, ShoppingCart, Search, User, Menu, X } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { selectCartCount, clearLocalCart } from '../store/cartSlice';
import { selectWishlistCount, fetchWishlist } from '../store/wishlistSlice';
import { persistor } from '../store/store';

export default function Navbar({ links = [] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchInputOpen, setIsSearchInputOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [searchText, setSearchText] = useState('');
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector(selectWishlistCount);

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

   useEffect(() => {
    if (pathname === '/') {
      const handleScroll = () => setIsScrolled(window.scrollY > 400);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      // Other pages: navbar always fixed
      setIsScrolled(true);
    }
  }, [pathname]);

  useEffect(() => {
    if (!showUserDropdown) return;
    function handleClick(e) {
      if (!e.target.closest('.user-dropdown')) setShowUserDropdown(false);
    }
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [showUserDropdown]);

  const getNavLinkClass = (isActive) => {
    if (pathname === '/') {
      return isScrolled
        ? isActive
          ? 'text-green-700 border-green-500'
          : 'text-[#9CAF88] hover:text-green-700 border-transparent hover:border-[#9CAF88]'
        : isActive
        ? 'text-green-500 border-green-200'
        : 'lg:text-white text-green-500 hover:text-white border-transparent hover:border-green-200';
    } else {
      return isActive
        ? 'text-green-700 border-green-500'
        : 'text-[#9CAF88] hover:text-green-700 border-transparent hover:border-[#9CAF88]';
    }
  };


  const mobileNavItemClass = (isActive) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      isActive ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:text-green-700 hover:bg-gray-50'
    }`;

  const handleAuth = () => {
    if (user) {
      setShowUserDropdown((prev) => !prev);
    } else {
      router.push('/signin');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    persistor.purge();
    localStorage.removeItem('cart');
    localStorage.removeItem('user');
    localStorage.removeItem('persist:root');
    setShowUserDropdown(false);
    setIsMenuOpen(false);
    router.push('/');
  };

  const getProfileImageUrl = () => {
    if (!user?.profileImage) return null;
    if (
      user.profileImage.startsWith('http://') ||
      user.profileImage.startsWith('https://')
    ) {
      return user.profileImage;
    }
    return `${process.env.NEXT_PUBLIC_API_URL}/${user.profileImage}`;
  };

  const profileImageUrl = getProfileImageUrl();

  return (
    <nav
      className={`px-4 lg:fixed left-0 right-0 z-10 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md top-0' : 'bg-transparent lg:mt-0'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center py-2 ">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push('/')}
        >
          <div className="w-[120px]">
            <img
              src="/trendikala_logo_bg.webp"
              alt="Trendi Kala Logo"
              className="w-full h-full object-contain "
            />
          </div>
          <div className="hidden md:block border-l-2 border-green-700 h-12 mx-3" />
          <div className="hidden md:block">
            <span className={`font-heading block font-bold text-sm tracking-[.6rem] ${getNavLinkClass(false)}`}>
              TRENDI <br /> KALA
            </span>
            <span className={`font-body block text-[10px] mt-1 ${getNavLinkClass(false)}`}>
              TRENDS & KALA IN <br /> EVERY STICH
            </span>
          </div>
        </div>

        <div className="font-home lg:flex lg:space-x-10 md:space-y-3 lg:space-y-0">
          {/* Desktop Links */}
          <ul className="hidden  md:ps-20 md:flex space-x-10 lg:space-x-5 text-base font-medium">
            {links.map((link) => (
              <li key={link.name}>
                <a
                  href={link.path}
                  className={`font-home transition-colors border-b-2 ${getNavLinkClass(false)}`}
                >
                  {link.name.charAt(0).toUpperCase() + link.name.slice(1)}
                </a>
              </li>
            ))}
          </ul>

          {/* Icons */}
          <div
            className={`flex items-center space-x-4 transition-colors duration-300 md:justify-end ${
              isScrolled ? 'text-green-700' : 'lg:text-white text-[#9CAF88]'
            }`}
          >
            {user && (
              <a href="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 hover:text-green-500 transition" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#9CAF88] text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </a>
            )}
            <a href="/wishlist" className="relative">
              <Heart className="w-6 h-6 cursor-pointer hover:text-green-500 transition" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#9CAF88] text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </a>
            {/* User/Login Button with Dropdown */}
            <div className="relative user-dropdown hidden md:block">
              {user ? (
                <button
                  onClick={handleAuth}
                  className="flex items-center hover:text-[#9CAF88] focus:outline-none"
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={showUserDropdown}
                >
                  <div className="w-8 h-8 rounded-full bg-[#9CAF88] text-white flex items-center justify-center text-sm font-semibold shadow-md overflow-hidden">
                    {profileImageUrl ? (
                      <img
                        src={profileImageUrl || "https://res.cloudinary.com/dq70cmqwb/image/upload/v1751035700/samples/smile.jpg"}
                        alt="Profile"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      user.name
                        ?.split(' ')
                        .map((w) => w[0])
                        .join('')
                        .toUpperCase()
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-home ${getNavLinkClass(false)}`}>
                    {user.name}
                  </span>
                  <svg
                    className="w-4 h-4 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleAuth}
                  className="flex items-center hover:text-green-500"
                  type="button"
                >
                  <User className="w-6 h-6 cursor-pointer transition" />
                  <span className="ml-1 text-sm font-home">Login</span>
                </button>
              )}
              {/* Dropdown menu */}
              {user && showUserDropdown && (
                <div className="absolute font-home right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                  <button
                    onClick={() => {
                      router.push('/my-orders');
                      setShowUserDropdown(false);
                    }}
                    className="block text-[#9CAF88] w-full px-4 py-2 text-left hover:bg-gray-100"
                    type="button"
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => {
                      router.push('/profile');
                      setShowUserDropdown(false);
                    }}
                    className="block text-[#9CAF88] w-full px-4 py-2 text-left hover:bg-gray-100"
                    type="button"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block text-[#9CAF88] w-full px-4 py-2 text-left hover:bg-gray-100"
                    type="button"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            {/* Mobile Menu Button */}
            <button
              className="md:hidden transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className={`w-6 h-6 ${isScrolled ? 'text-green-700' : 'lg:text-white,text-green-700'}`} />
              ) : (
                <Menu className={`w-6 h-6 ${isScrolled ? 'text-green-700' : 'lg:text-white,text-green-700'}`} />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 bg-white border-t text-[#9CAF88] border-gray-200 shadow-sm ">
          <ul className="flex flex-col space-y-2 px-4 py-3">
            {links.map((link) => (
              <li key={link.name} >
                <a
                  href={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={mobileNavItemClass(false)}
                >
                  {link.name.charAt(0).toUpperCase() + link.name.slice(1)}
                </a>
              </li>
            ))}

            {/* User/Login for mobile */}
            <li>
              {user ? (
                <div className="relative user-dropdown">
                  <button
                    onClick={() => setShowUserDropdown((prev) => !prev)}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-green-700 cursor-pointer w-full"
                  >
                    {/* Profile Image or Initials */}
                    <div className=" font-home w-8 h-8 rounded-full bg-[#9CAF88] text-white flex items-center justify-center text-sm font-semibold shadow-md overflow-hidden mr-2">
                      {profileImageUrl ? (
                        <img
                          src={profileImageUrl}
                          alt="Profile"
                          className="h-8 w-8 rounded-full object-cover "
                        />
                      ) : (
                        user.name
                          ?.split(' ')
                          .map((w) => w[0])
                          .join('')
                          .toUpperCase()
                      )}
                    </div>
                    <span className='text-[#9CAF88] font-home'>{user.name}</span>
                    <svg
                      className="w-4 h-4 ml-auto"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {showUserDropdown && (
                    <div className="font-home bg-white border rounded shadow-lg mt-1 absolute right-0 left-0 w-full z-50">
                      <button
                        onClick={() => {
                          router.push('/my-orders');
                          setShowUserDropdown(false);
                          setIsMenuOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                      >
                        My Orders
                      </button>
                      <button
                        onClick={() => {
                          router.push('/profile');
                          setShowUserDropdown(false);
                          setIsMenuOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowUserDropdown(false);
                          setIsMenuOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push('/signin');
                  }}
                  className="flex font-home items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-green-700 cursor-pointer"
                >
                  <User className="w-6 h-6 mr-2" />
                  Login
                </button>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
