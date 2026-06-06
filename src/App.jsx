import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import DashboardLayout from './pages/DashboardLayout/DashboardLayout';
import Overview from './pages/Overview/Overview';
import Generator from './pages/Generator/Generator';
import QuestionBank from './pages/QuestionBank/QuestionBank';
import MyQuestions from './pages/MyQuestions/MyQuestions';
import AddQuestion from './pages/AddQuestion/AddQuestion';
import Exams from './pages/Exams/Exams';
import OMREvaluation from './pages/OMREvaluation/OMREvaluation';
import Institution from './pages/Institution/Institution';
import Subscription from './pages/Subscription/Subscription';
import Support from './pages/Support/Support';
import StaffManagement from './pages/Staff/StaffManagement';
import SyllabusManagement from './pages/Syllabus/SyllabusManagement';
import RoleRouteGuard from './components/RoleRouteGuard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/*" element={<Login />} />
        <Route path="/signup/*" element={<Signup />} />
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          
          <Route path="staff" element={
            <RoleRouteGuard allowedRoles={['Super Admin', 'Admin']}>
              <StaffManagement />
            </RoleRouteGuard>
          } />
          
          <Route path="syllabus" element={
            <RoleRouteGuard allowedRoles={['Super Admin', 'Admin', 'Content Manager']}>
              <SyllabusManagement />
            </RoleRouteGuard>
          } />
          
          <Route path="generate" element={
            <RoleRouteGuard allowedRoles={['Subscriber']}>
              <Generator />
            </RoleRouteGuard>
          } />
          
          <Route path="bank" element={
            <RoleRouteGuard allowedRoles={['Subscriber', 'Super Admin', 'Admin', 'Content Manager']}>
              <QuestionBank />
            </RoleRouteGuard>
          } />
          
          <Route path="my-questions" element={
            <RoleRouteGuard allowedRoles={['Subscriber', 'Question Creator']}>
              <MyQuestions />
            </RoleRouteGuard>
          } />
          
          <Route path="add-question" element={
            <RoleRouteGuard allowedRoles={['Question Creator']}>
              <AddQuestion />
            </RoleRouteGuard>
          } />
          
          <Route path="exams" element={
            <RoleRouteGuard allowedRoles={['Subscriber']}>
              <Exams />
            </RoleRouteGuard>
          } />
          
          <Route path="omr" element={
            <RoleRouteGuard allowedRoles={['Subscriber']}>
              <OMREvaluation />
            </RoleRouteGuard>
          } />
          
          <Route path="institution" element={
            <RoleRouteGuard allowedRoles={['Subscriber']}>
              <Institution />
            </RoleRouteGuard>
          } />
          
          <Route path="subscription" element={
            <RoleRouteGuard allowedRoles={['Subscriber']}>
              <Subscription />
            </RoleRouteGuard>
          } />
          
          <Route path="support" element={
            <RoleRouteGuard allowedRoles={['Subscriber', 'Support Team']}>
              <Support />
            </RoleRouteGuard>
          } />
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
