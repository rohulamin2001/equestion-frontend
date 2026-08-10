import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black/25 backdrop-blur-md mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-4 text-white/80 text-xs sm:text-sm">
          <div className="col-span-2 md:col-span-1 flex items-start gap-2">
            <BookOpen className="h-4 w-4 mt-0.5 shrink-0 text-white/60" />
            <div>
              <p className="font-bold text-white/95 font-sans">স্মার্ট প্রশ্নব্যাংক</p>
              <p className="text-white/50 mt-1 font-bengali leading-relaxed">
                ক্লাস ৩–১২ প্রশ্ন জেনারেটর
              </p>
            </div>
          </div>

          <div>
            <p className="font-semibold text-white/90 mb-2 uppercase tracking-wider text-[10px] sm:text-xs">
              Quick links
            </p>
            <ul className="space-y-1.5">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-white transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="hover:text-white transition-colors"
                >
                  Sign up
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-white/90 mb-2 uppercase tracking-wider text-[10px] sm:text-xs">
              Contact
            </p>
            <p className="text-white/50 leading-relaxed">
              Support available via the app help desk after login.
            </p>
          </div>

          <div className="col-span-2 md:col-span-1 md:text-right lg:text-right">
            <p className="text-white/50 font-bengali">
              © {year} স্মার্ট প্রশ্নব্যাংক — সর্বস্বত্ব সংরক্ষিত।
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
