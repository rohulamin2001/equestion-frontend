import { useEffect, useState } from "react";

export const useAffiliateLanding = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const faqs = [
    {
      q: "স্মার্ট প্রশ্নব্যাংক অ্যাফিলিয়েট প্রোগ্রাম কী?",
      a: "এটি একটি প্রাতিষ্ঠানিক পার্টনারশিপ প্রোগ্রাম যেখানে আপনি আপনার নিজস্ব স্পেশাল কুপন কোড ব্যবহার করে শিক্ষক, কোচিং বা শিক্ষা প্রতিষ্ঠানকে স্মার্ট প্রশ্নব্যাংকে রেফার করবেন। আপনার কুপন ব্যবহার করে তারা সাবস্ক্রিপশন কিনলে আপনি পাবেন ২০% পর্যন্ত নগদ কমিশন এবং ক্রেতা পাবেন ১০% বিশেষ ছাড়।",
    },
    {
      q: "কমিশন কখন এবং কীভাবে পাওয়া যায়?",
      a: "গ্রাহক সফলভাবে সাবস্ক্রিপশন কেনার পর কমিশন আপনার অ্যাকাউন্টের পেন্ডিং ব্যালেন্সে যোগ হবে। গ্রাহকের ১৪ দিনের রিফান্ড সুরক্ষা সময়সীমা অতিক্রমের পর কমিশন স্বয়ংক্রিয়ভাবে 'Available' ব্যালেন্সে স্থানান্তরিত হবে।",
    },
    {
      q: "টাকা তোলার (উইথড্রয়াল) নিয়ম ও নূন্যতম শর্ত কী?",
      a: "টাকা উইথড্র করার জন্য আপনার অন্তত ৩টি সফল কোয়ালিফাইং সেল সম্পন্ন হতে হবে এবং এভেইলেবল ব্যালেন্স নূন্যতম ৫,০০০ টাকা (৳৫,০০০) হতে হবে। বিকাশ, নগদ, রকেট অথবা সরাসরি ব্যাংক একাউন্টে টাকা ট্রান্সফার করা যাবে।",
    },
    {
      q: "রিনিউয়াল বা পরবর্তী ক্রয়ে কি কমিশন পাওয়া যাবে?",
      a: "না, অ্যাফিলিয়েট কুপন ও কমিশন শুধুমাত্র নতুন গ্রাহকের প্রথম সফল ক্রয়ের জন্য প্রযোজ্য। রিনিউয়াল বা পূর্ববর্তী সাবস্ক্রাইবারদের ক্ষেত্রে এটি প্রযোজ্য নয়।",
    },
    {
      q: "আমি কি শিক্ষক অ্যাকাউন্ট থেকে স্বয়ংক্রিয়ভাবে অ্যাফিলিয়েট হতে পারি?",
      a: "না, নিরাপত্তা ও অ্যাকাউন্ট পৃথকীকরণের জন্য অ্যাফিলিয়েট পার্টনারদের আলাদাভাবে এই পোর্টাল থেকে সেলফ-রেজিস্ট্রেশন করতে হবে। অ্যাডমিন পর্যালোচনা করে অনুমোদন দিলে আপনি ইউনিক কুপন ও ড্যাশবোর্ড পাবেন।",
    },
  ];

  return {
    mobileMenuOpen,
    setMobileMenuOpen,
    scrolled,
    openFaq,
    toggleFaq,
    scrollToSection,
    faqs,
  };
};
