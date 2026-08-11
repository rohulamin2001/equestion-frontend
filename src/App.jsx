import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import RoleRouteGuard from "./components/RoleRouteGuard";
import AcademicSetup from "./pages/AcademicSetup/AcademicSetup";
import AddQuestion from "./pages/AddQuestion/AddQuestion";
import DashboardLayout from "./pages/DashboardLayout/DashboardLayout";
import Exams from "./pages/Exams/Exams";
import Generator from "./pages/Generator/Generator";
import Home from "./pages/Home/Home";
import Institution from "./pages/Institution/Institution";
//login file
import AuthDrawer from "./pages/Login/AuthDrawer";
import CreatedQuestions from "./pages/CreatedQuestions/CreatedQuestions";
import Login from "./pages/Login/Login";
import MetadataSetup from "./pages/MetadataSetup/MetadataSetup";
import MyQuestions from "./pages/MyQuestions/MyQuestions";
import NotFound from "./pages/NotFound/NotFound";
import OMREvaluation from "./pages/OMREvaluation/OMREvaluation";
import Overview from "./pages/Overview/Overview";
import PricingManagement from "./pages/PricingManagement/PricingManagement";
import Profile from "./pages/Profile/Profile";
import QuestionApproval from "./pages/QuestionApproval/QuestionApproval";
import QuestionBank from "./pages/QuestionBank/QuestionBank";
import QuestionPreview from "./pages/Questions/QuestionPreview";
import Questions from "./pages/Questions/Questions";
import QuestionSelect from "./pages/Questions/QuestionSelect";
import Signup from "./pages/Signup/Signup";
import StaffManagement from "./pages/Staff/StaffManagement";
import SubjectSetup from "./pages/SubjectSetup/SubjectSetup";
import Subscription from "./pages/Subscription/Subscription";
import AdminSupportCenter from "./pages/Support/AdminSupportCenter";
import SupportDesk from "./pages/Support/SupportDesk";
import SyllabusManagement from "./pages/Syllabus/SyllabusManagement";
import Terms from "./pages/Legal/Terms";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-center" />
      <AuthDrawer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/login/*" element={<Login />} />
        <Route path="/signup/*" element={<Signup />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />

          <Route
            path="metadata-setup"
            element={
              <RoleRouteGuard
                allowedRoles={["Super Admin", "Admin", "Content Manager"]}
              >
                <MetadataSetup />
              </RoleRouteGuard>
            }
          />

          <Route
            path="staff"
            element={
              <RoleRouteGuard allowedRoles={["Super Admin", "Admin"]}>
                <StaffManagement />
              </RoleRouteGuard>
            }
          />

          <Route
            path="syllabus"
            element={
              <RoleRouteGuard
                allowedRoles={["Super Admin", "Admin", "Content Manager"]}
              >
                <SyllabusManagement />
              </RoleRouteGuard>
            }
          />

          <Route
            path="academic-setup"
            element={
              <RoleRouteGuard allowedRoles={["Super Admin"]}>
                <AcademicSetup />
              </RoleRouteGuard>
            }
          />

          <Route
            path="subject-setup"
            element={
              <RoleRouteGuard allowedRoles={["Super Admin", "Admin"]}>
                <SubjectSetup />
              </RoleRouteGuard>
            }
          />

          <Route
            path="generate"
            element={
              <RoleRouteGuard allowedRoles={["Subscriber"]}>
                <Generator />
              </RoleRouteGuard>
            }
          />

          <Route
            path="created-questions"
            element={
              <RoleRouteGuard
                allowedRoles={["Super Admin", "Admin", "Subscriber"]}
              >
                <CreatedQuestions />
              </RoleRouteGuard>
            }
          />

          <Route
            path="bank"
            element={
              <RoleRouteGuard
                allowedRoles={["Super Admin", "Admin", "Content Manager"]}
              >
                <QuestionBank />
              </RoleRouteGuard>
            }
          />

          <Route
            path="question-approval"
            element={
              <RoleRouteGuard
                allowedRoles={["Super Admin", "Admin", "Content Manager"]}
              >
                <QuestionApproval />
              </RoleRouteGuard>
            }
          />

          <Route
            path="my-questions"
            element={
              <RoleRouteGuard allowedRoles={["Question Creator"]}>
                <MyQuestions />
              </RoleRouteGuard>
            }
          />

          <Route
            path="add-question"
            element={
              <RoleRouteGuard allowedRoles={["Question Creator"]}>
                <AddQuestion />
              </RoleRouteGuard>
            }
          />

          <Route
            path="exams"
            element={
              <RoleRouteGuard allowedRoles={["Subscriber"]}>
                <Exams />
              </RoleRouteGuard>
            }
          />

          <Route
            path="omr"
            element={
              <RoleRouteGuard allowedRoles={["Subscriber"]}>
                <OMREvaluation />
              </RoleRouteGuard>
            }
          />

          <Route
            path="institution"
            element={
              <RoleRouteGuard allowedRoles={["Subscriber"]}>
                <Institution />
              </RoleRouteGuard>
            }
          />

          <Route
            path="subscription"
            element={
              <RoleRouteGuard allowedRoles={["Subscriber"]}>
                <Subscription />
              </RoleRouteGuard>
            }
          />

          <Route
            path="admin/pricing"
            element={
              <RoleRouteGuard allowedRoles={["Super Admin", "Admin"]}>
                <PricingManagement />
              </RoleRouteGuard>
            }
          />

          <Route
            path="questions"
            element={
              <RoleRouteGuard allowedRoles={["Subscriber"]}>
                <Questions />
              </RoleRouteGuard>
            }
          />

          <Route
            path="questions/select"
            element={
              <RoleRouteGuard allowedRoles={["Subscriber"]}>
                <QuestionSelect />
              </RoleRouteGuard>
            }
          />

          <Route
            path="questions/preview"
            element={
              <RoleRouteGuard allowedRoles={["Subscriber"]}>
                <QuestionPreview />
              </RoleRouteGuard>
            }
          />

          <Route
            path="support"
            element={
              <RoleRouteGuard
                allowedRoles={[
                  "Super Admin",
                  "Admin",
                  "Content Manager",
                  "Question Creator",
                  "Support Team",
                  "Subscriber",
                ]}
              >
                <SupportDesk />
              </RoleRouteGuard>
            }
          />

          <Route
            path="support-management"
            element={
              <RoleRouteGuard
                allowedRoles={["Super Admin", "Admin", "Support Team"]}
              >
                <AdminSupportCenter />
              </RoleRouteGuard>
            }
          />

          <Route path="profile" element={<Profile />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
