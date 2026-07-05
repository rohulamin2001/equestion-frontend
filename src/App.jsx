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
import Login from "./pages/Login/Login";
import MetadataSetup from "./pages/MetadataSetup/MetadataSetup";
import MyQuestions from "./pages/MyQuestions/MyQuestions";
import OMREvaluation from "./pages/OMREvaluation/OMREvaluation";
import Overview from "./pages/Overview/Overview";
import QuestionApproval from "./pages/QuestionApproval/QuestionApproval";
import QuestionBank from "./pages/QuestionBank/QuestionBank";
import Signup from "./pages/Signup/Signup";
import StaffManagement from "./pages/Staff/StaffManagement";
import SubjectSetup from "./pages/SubjectSetup/SubjectSetup";
import Subscription from "./pages/Subscription/Subscription";
import Support from "./pages/Support/Support";
import SyllabusManagement from "./pages/Syllabus/SyllabusManagement";
import Profile from "./pages/Profile/Profile";
import PricingManagement from "./pages/PricingManagement/PricingManagement";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-center" />
      <Routes>
        <Route path="/" element={<Home />} />
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
            path="bank"
            element={
              <RoleRouteGuard
                allowedRoles={[
                  "Subscriber",
                  "Super Admin",
                  "Admin",
                  "Content Manager",
                ]}
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
              <RoleRouteGuard allowedRoles={["Subscriber", "Question Creator"]}>
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
            path="support"
            element={
              <RoleRouteGuard allowedRoles={["Subscriber", "Support Team"]}>
                <Support />
              </RoleRouteGuard>
            }
          />

          <Route
            path="profile"
            element={
              <Profile />
            }
          />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
