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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/*" element={<Login />} />
        <Route path="/signup/*" element={<Signup />} />
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="generate" element={<Generator />} />
          <Route path="bank" element={<QuestionBank />} />
          <Route path="my-questions" element={<MyQuestions />} />
          <Route path="add-question" element={<AddQuestion />} />
          <Route path="exams" element={<Exams />} />
          <Route path="omr" element={<OMREvaluation />} />
          <Route path="institution" element={<Institution />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="support" element={<Support />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
