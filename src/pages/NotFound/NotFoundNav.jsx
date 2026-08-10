import { BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";

export default function NotFoundNav() {
  const { openAuthDrawer } = useUserContext();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="border-b border-white/10 bg-black/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2.5 sm:gap-3 text-white/90 hover:text-white transition-colors"
          onClick={closeMenu}
        >
          <div className="p-2 bg-white/10 border border-white/15 text-white rounded-xl">
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <span className="text-base sm:text-lg font-extrabold tracking-tight font-sans">
            স্মার্ট প্রশ্নব্যাংক
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            Home
          </Link>
          <button
            type="button"
            onClick={() => openAuthDrawer("login")}
            className="text-sm font-bold text-white/90 hover:text-white transition-colors font-bengali cursor-pointer"
          >
            লগইন
          </button>
          <button
            type="button"
            onClick={() => openAuthDrawer("register")}
            className="text-sm font-bold px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-all font-bengali cursor-pointer"
          >
            নতুন একাউন্ট
          </button>
        </nav>

        <button
          type="button"
          className="lg:hidden p-2 rounded-lg text-white/90 hover:bg-white/10 transition-colors cursor-pointer"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-black/40 backdrop-blur-md px-4 py-4 flex flex-col gap-3">
          <Link
            to="/"
            className="text-sm font-medium text-white/90 py-2"
            onClick={closeMenu}
          >
            Home
          </Link>
          <button
            type="button"
            className="text-left text-sm font-bold text-white/90 py-2 font-bengali cursor-pointer"
            onClick={() => {
              closeMenu();
              openAuthDrawer("login");
            }}
          >
            লগইন
          </button>
          <button
            type="button"
            className="text-left text-sm font-bold text-white py-2 font-bengali cursor-pointer"
            onClick={() => {
              closeMenu();
              openAuthDrawer("register");
            }}
          >
            নতুন একাউন্ট
          </button>
        </div>
      )}
    </header>
  );
}
