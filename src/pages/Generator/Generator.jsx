import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Lock, 
  ChevronDown, 
  Loader2,
  X,
  CreditCard
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@clerk/react";
import { motion, AnimatePresence } from "motion/react";
import apiClient from "../../lib/apiClient";
import { useUserContext } from "../../context/UserContext";

export default function Generator() {
  const { userProfile } = useUserContext();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  
  // Form states
  const [examName, setExamName] = useState("");
  const [selectedClass, setSelectedClass] = useState("Class 7");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [questionType, setQuestionType] = useState("MCQ");
  const [totalMarks, setTotalMarks] = useState("100");
  
  // Data loading states
  const [userSubs, setUserSubs] = useState([]);
  const [syllabusList, setSyllabusList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSyllabus, setFetchingSyllabus] = useState(false);
  
  // Modal states
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState("all"); // 'all', 'bangla', 'english'

  const classes = [
    { value: "Class 3", label: "৩য় শ্রেণী" },
    { value: "Class 4", label: "৪র্থ শ্রেণী" },
    { value: "Class 5", label: "৫ম শ্রেণী" },
    { value: "Class 6", label: "৬ষ্ঠ শ্রেণী" },
    { value: "Class 7", label: "৭ম শ্রেণী" },
    { value: "Class 8", label: "৮ম শ্রেণী" },
    { value: "Class 9", label: "৯ম শ্রেণী" },
    { value: "Class 10", label: "১০ম শ্রেণী" },
    { value: "Class 11", label: "একাদশ শ্রেণী" },
    { value: "Class 12", label: "দ্বাদশ শ্রেণী" }
  ];

  // Fetch active subscriptions on load
  const fetchSubscriptions = async () => {
    try {
      const token = await getToken();
      const res = await apiClient.get("/subscriptions/my-subscriptions", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserSubs(res.data.subscriptions || []);
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
    }
  };

  // Fetch syllabus details for selected class
  const fetchSyllabus = async (className) => {
    try {
      setFetchingSyllabus(true);
      const token = await getToken();
      const res = await apiClient.get(`/syllabus?className=${className}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSyllabusList(res.data.syllabus || []);
      
      // Reset selected subject & chapters on class change
      setSelectedSubject(null);
      setSelectedChapters([]);
    } catch (err) {
      console.error("Error fetching syllabus:", err);
      toast.error("সিলেবাস লোড করতে ব্যর্থ হয়েছে");
    } finally {
      setFetchingSyllabus(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchSubscriptions();
    });
  }, []);

  useEffect(() => {
    if (selectedClass) {
      Promise.resolve().then(() => {
        fetchSyllabus(selectedClass);
      });
    }
  }, [selectedClass]);

  // Handle auto prepopulating total marks when subject changes
  useEffect(() => {
    Promise.resolve().then(() => {
      if (selectedSubject) {
        const defaultMarks = selectedSubject.subjectId?.totalMarks || "100";
        setTotalMarks(defaultMarks);
      } else {
        setTotalMarks("100");
      }
    });
  }, [selectedSubject]);

  // Verify access helper for a subject
  const hasSubjectAccess = (subject) => {
    if (!subject) return false;
    if (["Super Admin", "Admin"].includes(userProfile?.role)) return true;
    
    const subId = subject.subjectId?._id || subject.subjectId;
    const subjectName = subject.subjectName || subject.subjectId?.subjectName || "";
    const now = new Date();
    
    return userSubs.some(sub => {
      if (!sub.isActive || new Date(sub.endDate) < now) return false;

      // Fallback check for teacher package
      if (sub.packageId && sub.packageId.startsWith("teacher-")) {
        const pkgKey = sub.packageId;
        const classes = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
        if (classes.includes(selectedClass)) {
          if (pkgKey === "teacher-bangla-6-10" && /বাংলা|Bangla/i.test(subjectName)) return true;
          if (pkgKey === "teacher-math-6-10" && /গণিত|Math/i.test(subjectName)) return true;
          if (pkgKey === "teacher-science-6-10" && /বিজ্ঞান|Science/i.test(subjectName)) return true;
          if (pkgKey === "teacher-english-6-10" && /English|ইংরেজি/i.test(subjectName)) return true;
          if (pkgKey === "teacher-ict-6-10" && /আইসিটি|ICT/i.test(subjectName)) return true;
          if (pkgKey === "teacher-bgs-6-10" && /বাংলাদেশ ও বিশ্বপরিচয়|BGS|Bangladesh/i.test(subjectName)) return true;
          if (pkgKey === "teacher-islam-6-10" && /ইসলাম শিক্ষা|Islam/i.test(subjectName)) return true;
          if (pkgKey === "teacher-agriculture-6-10" && /কৃষি শিক্ষা|Agri/i.test(subjectName)) return true;
        }
      }

      if (sub.purchaseType === "Package" || sub.purchaseType === "Class") {
        return sub.classNames?.includes(selectedClass);
      }
      if (sub.purchaseType === "Subject") {
        return sub.subjectIds?.some(s => (s._id || s) === subId);
      }
      return false;
    });
  };

  const isSubscribedToActiveSubject = selectedSubject ? hasSubjectAccess(selectedSubject) : false;

  // Filter subjects based on version select tab
  const filteredSyllabusList = syllabusList.filter((item) => {
    if (subjectFilter === "bangla") return item.version === "Bangla";
    if (subjectFilter === "english") return item.version === "English";
    return true;
  });

  // Handle Generate Question Submit
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!examName.trim()) {
      toast.error("দয়া করে পরীক্ষার নাম লিখুন!");
      return;
    }
    if (!selectedSubject) {
      toast.error("দয়া করে একটি বিষয় সিলেক্ট করুন!");
      return;
    }
    if (selectedChapters.length === 0) {
      toast.error("দয়া করে অন্তত একটি অধ্যায় সিলেক্ট করুন!");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const res = await apiClient.post("/question-sets", {
        examName,
        className: selectedClass,
        subjectId: selectedSubject.subjectId?._id || selectedSubject.subjectId,
        chapters: selectedChapters,
        category: questionType,
        totalMarks: parseInt(totalMarks, 10) || 100
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success("প্রশ্ন সেট সফলভাবে তৈরি করা হয়েছে!");
      // Redirect to AddQuestion interface with newly created set ID
      navigate(`/dashboard/questions?setId=${res.data.questionSet._id}`);
    } catch (err) {
      console.error("Error generating question set:", err);
      toast.error(err.response?.data?.error || "প্রশ্ন সেট তৈরি করতে ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12 font-bengali relative">
      {/* Header Banner */}
      <div className="bg-indigo-900 text-white rounded-3xl p-8 text-center relative overflow-hidden shadow-lg shadow-indigo-900/10">
        <div className="absolute top-2 right-4 text-xs font-sans opacity-40 font-bold">৪.৩.৩</div>
        <h1 className="text-2xl font-bold tracking-tight">১ ক্লিকে প্রশ্ন তৈরির সফটওয়্যার !</h1>
        <p className="text-xs text-indigo-200 mt-2 flex items-center justify-center gap-1">
          শিক্ষা এবং সফটওয়্যার, একসাথে এগিয়ে চলা! 🌱
        </p>

        {/* Subscribe Banner if current subject is locked or no subs exist */}
        {(!isSubscribedToActiveSubject && selectedSubject) && (
          <div className="mt-5 flex justify-center">
            <button
              onClick={() => navigate("/dashboard/subscription")}
              className="bg-red-500 hover:bg-red-650 transition text-white px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-red-500/20 font-sans"
            >
              <CreditCard className="h-4 w-4" />
              Subscribe Now!
            </button>
          </div>
        )}
      </div>

      {/* Main Generator Form Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
        <form onSubmit={handleGenerate} className="space-y-5">
          
          {/* Exam Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              প্রোগ্রাম/পরীক্ষার নাম লিখুন <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              placeholder="প্রোগ্রাম/পরীক্ষার নাম লিখুন *"
              className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-sans"
            />
            {examName === "" && (
              <p className="text-[10px] text-red-500 font-semibold font-sans">প্রোগ্রাম/পরীক্ষার নাম লিখুন</p>
            )}
          </div>

          {/* Class Select Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">শ্রেণি</label>
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full h-11 px-4 pr-10 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm appearance-none bg-white font-sans font-medium"
              >
                {classes.map((cls) => (
                  <option key={cls.value} value={cls.value}>{cls.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Subject Trigger Button */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">বিষয়</label>
            <button
              type="button"
              onClick={() => setShowSubjectModal(true)}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 text-left text-sm flex items-center justify-between hover:border-slate-350 transition bg-white"
            >
              <span className={selectedSubject ? "text-slate-800 font-semibold" : "text-slate-400"}>
                {selectedSubject ? `${selectedSubject.subjectName} (${selectedSubject.version === "Bangla" ? "বাংলা" : "ইংরেজি"})` : "বিষয় সিলেক্ট করুন"}
              </span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          </div>

          {/* Chapter Trigger Button */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">অধ্যায়</label>
            <button
              type="button"
              disabled={!selectedSubject}
              onClick={() => setShowChapterModal(true)}
              className={`w-full h-11 px-4 rounded-xl border border-slate-200 text-left text-sm flex items-center justify-between transition bg-white ${
                !selectedSubject ? "bg-slate-50 text-slate-300 cursor-not-allowed border-slate-100" : "hover:border-slate-350"
              }`}
            >
              <span className={selectedChapters.length > 0 ? "text-slate-800 font-semibold" : "text-slate-400"}>
                {selectedChapters.length > 0 ? `${selectedChapters.length} টি অধ্যায় সিলেক্ট করা হয়েছে` : "অধ্যায় সিলেক্ট করুন"}
              </span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          </div>

          {/* Type Select & Total Marks inline inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">টাইপ</label>
              <div className="relative">
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="w-full h-11 px-4 pr-10 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm appearance-none bg-white font-sans font-medium"
                >
                  <option value="MCQ">বহুনির্বাচনী</option>
                  <option value="Creative">সৃজনশীল</option>
                  <option value="Combined">সমন্বিত</option>
                </select>
                <ChevronDown className="absolute right-4 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">মোট নম্বর</label>
              <input
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                placeholder="100"
                className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-sans"
              />
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="submit"
            disabled={loading || fetchingSyllabus}
            className="w-full h-12 bg-[#059669] hover:bg-[#047857] disabled:bg-slate-300 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow shadow-emerald-500/10"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "প্রশ্ন তৈরি করুন"
            )}
          </button>
        </form>
      </div>

      {/* Modal 1: Subject Selection Popup */}
      <AnimatePresence>
        {showSubjectModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">বিষয় সিলেক্ট করুন</span>
                <button onClick={() => setShowSubjectModal(false)} className="p-1 hover:bg-slate-50 rounded-lg">
                  <X className="h-4 w-4 text-slate-400" />
                </button>
              </div>

              {/* Filters */}
              <div className="p-4 bg-slate-50/50 flex gap-2 border-b border-slate-100">
                <button
                  onClick={() => setSubjectFilter("all")}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                    subjectFilter === "all" ? "bg-[#10B981] text-white" : "bg-white text-slate-600 border border-slate-100"
                  }`}
                >
                  সবগুলো
                </button>
                <button
                  onClick={() => setSubjectFilter("bangla")}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                    subjectFilter === "bangla" ? "bg-[#10B981] text-white" : "bg-white text-slate-600 border border-slate-100"
                  }`}
                >
                  বাংলা ভার্শন
                </button>
                <button
                  onClick={() => setSubjectFilter("english")}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                    subjectFilter === "english" ? "bg-[#10B981] text-white" : "bg-white text-slate-600 border border-slate-100"
                  }`}
                >
                  English Version
                </button>
              </div>

              {/* List */}
              <div className="max-h-[300px] overflow-y-auto p-4 space-y-1">
                {fetchingSyllabus ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-[#10B981]" />
                  </div>
                ) : filteredSyllabusList.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">কোনো বিষয় পাওয়া যায়নি।</p>
                ) : (
                  filteredSyllabusList.map((item) => {
                    const isSelected = selectedSubject?.subjectId?._id === item.subjectId?._id;
                    return (
                      <div
                        key={item._id}
                        onClick={() => {
                          setSelectedSubject(item);
                          setSelectedChapters([]); // Reset chapters on subject change
                          setShowSubjectModal(false);
                        }}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition select-none ${
                          isSelected ? "border-emerald-400 bg-emerald-50/10" : "border-slate-100 hover:border-emerald-350"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="h-4 w-4 rounded text-emerald-600 border-slate-350 focus:ring-emerald-500/20"
                          />
                          <span className="text-xs font-bold text-slate-700">{item.subjectName}</span>
                        </div>
                        <span className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wide px-2 py-0.5 bg-slate-50 border rounded-md">
                          {item.version}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 2: Chapter Selection Popup */}
      <AnimatePresence>
        {showChapterModal && selectedSubject && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">অধ্যায় সিলেক্ট করুন</span>
                <button onClick={() => setShowChapterModal(false)} className="p-1 hover:bg-slate-50 rounded-lg">
                  <X className="h-4 w-4 text-slate-400" />
                </button>
              </div>

              {/* List */}
              <div className="max-h-[350px] overflow-y-auto p-4 space-y-2">
                {(!selectedSubject.chapters || selectedSubject.chapters.length === 0) ? (
                  <p className="text-xs text-slate-400 text-center py-6">কোনো অধ্যায় সিলেক্ট করার সিলেবাস পাওয়া যায়নি।</p>
                ) : (
                  selectedSubject.chapters.map((ch, idx) => {
                    // Check if current chapter index is locked (preview model: index 0 / chapter 1 is free, index > 0 requires active subscription)
                    const isLocked = !isSubscribedToActiveSubject && idx > 0;
                    const isChecked = selectedChapters.includes(ch.chapterNumber);
                    
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          if (isLocked) {
                            toast.error("বাকি অধ্যায়সমূহ আনলক করতে অনুগ্রহ করে সাবস্ক্রাইব করুন।");
                            return;
                          }
                          setSelectedChapters(prev =>
                            prev.includes(ch.chapterNumber)
                              ? prev.filter(n => n !== ch.chapterNumber)
                              : [...prev, ch.chapterNumber]
                          );
                        }}
                        className={`p-3.5 border rounded-xl flex items-center justify-between transition select-none ${
                          isLocked
                            ? "border-slate-100 bg-slate-50/50 cursor-not-allowed opacity-60"
                            : isChecked
                            ? "border-indigo-400 bg-indigo-50/10 cursor-pointer"
                            : "border-slate-100 hover:border-indigo-300 cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isLocked ? (
                            <Lock className="h-4 w-4 text-slate-400 shrink-0" />
                          ) : (
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="h-4 w-4 rounded text-indigo-600 border-slate-350 focus:ring-indigo-500/20 shrink-0"
                            />
                          )}
                          <span className={`text-xs font-bold ${isLocked ? "text-slate-400" : "text-slate-700"}`}>
                            {ch.chapterName}
                          </span>
                        </div>
                        {isLocked && (
                          <span className="text-[9px] font-bold text-slate-400 flex items-center gap-0.5 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                            Locked
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
