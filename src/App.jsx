import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react' // ضيفنا دول
import './index.css'

// ─── Loading Component ─────────────────────────────────────────
// ده اللي هيظهر للمستخدم وهو بينتقل بين الصفحات
const PageLoader = () => (
  <div className="flex h-screen items-center justify-center bg-white">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-main border-t-transparent"></div>
  </div>
);

// ─── Layouts (يفضل تحميلهم عادي لأنهم الهيكل الأساسي) ──────────
import AdminLayout from './features/admin/components/AdminLayout/AdminLayout'
import PatientMainLayout from './features/patient/components/PatientLayout/PatientMainLayout'
import DoctorLayout from './features/doctor/components/DoctorLayout/DoctorLayout'
import Layout from './components/Layout/Layout'
// ─── Lazy Loading Pages (نحمل الصفحات بالطلب) ──────────────────
// Home & Auth
const Home = lazy(() => import('./features/home/pages/Home/Home'))
const Login = lazy(() => import('./features/auth/pages/Login/Login'))
const Register = lazy(() => import('./features/auth/pages/Register/Register'))
const ForgotPassword = lazy(() => import('./features/auth/pages/ForgotPassword/ForgotPassword'))
const NotFound = lazy(() => import('./features/admin/components/NotFound/NotFound'))

// Admin Pages
const AdminDashboard = lazy(() => import('./features/admin/components/AdminDashboard/AdminDashboard'))
const DoctorManagement = lazy(() => import('./features/admin/components/DoctorManagement/DoctorManagement'))
const PatientManagement = lazy(() => import('./features/admin/components/PatientManagement/PatientManagement'))
const StoriesManagement = lazy(() => import('./features/admin/components/StoriesManagement/StoriesManagement'))
const ActivityLogs = lazy(() => import('./features/admin/components/ActivityLogs/ActivityLogs'))
const SettingsProfile = lazy(() => import('./features/admin/components/SettingsProfile/SettingsProfile'))
const AddDoctorBtn = lazy(() => import('./features/admin/components/AddDoctorBtn/AddDoctorBtn'))
const AddPatientBtn = lazy(() => import('./features/admin/components/AddPatientBtn/AddPatientBtn'))
const EditPatient = lazy(() => import('./features/admin/components/EditPatient/EditPatient'))
const EditDoctor = lazy(() => import('./features/admin/components/EditDoctor/EditDoctor'))
const AdminReports = lazy(() => import('./features/admin/components/AdminReports/AdminReports'))
const StoryDetails = lazy(() => import('./features/admin/components/StoryDetails/StoryDetails'))
const StoryAllComments = lazy(() => import('./features/admin/components/StoryAllComments/StoryAllComments'))

// Patient Pages
const PatientDashboard = lazy(() => import('./features/patient/pages/PatientDashboard/PatientDashboard'))
const PatientLifestyleSurvey = lazy(() => import('./features/patient/components/PatientLifestyleSurvey/PatientLifestyleSurvey'))
const PatientHeartRisk = lazy(() => import('./features/patient/components/HeartRisk/PatientHeartRisk'))
const PatientDoctorList = lazy(() => import('./features/patient/components/PatientDoctorList/PatientDoctorList'))
const PatientDoctorProfile = lazy(() => import('./features/patient/components/PatientDoctorProfile/PatientDoctorProfile'))
const PatientBooking = lazy(() => import('./features/patient/components/PatientBooking/PatientBooking'))
const PatientPayment = lazy(() => import('./features/patient/components/PatientPayment/PatientPayment'))
const PatientAppointments = lazy(() => import('./features/patient/components/PatientAppointments/PatientAppointments'))
const PatientQRCode = lazy(() => import('./features/patient/components/PatientQRCode/PatientQRCode'))
const PatientMessages = lazy(() => import('./features/patient/components/PatientMessages/PatientMessages'))
const PatientMedicalRecords = lazy(() => import('./features/patient/components/PatientMedicalRecords/PatientMedicalRecords'))
const PatientStories = lazy(() => import('./features/patient/components/PatientStories/PatientStories'))
const PatientStoryDetails = lazy(() => import('./features/patient/components/PatientStoryDetails/PatientStoryDetails'))
const PatientAllComments = lazy(() => import('./features/patient/components/PatientAllComments/PatientAllComments'))
const WriteStory = lazy(() => import('./features/patient/components/WriteStory/WriteStory'))
const PatientPrescriptions = lazy(() => import('./features/patient/components/PatientPrescriptions/PatientPrescriptions'))
const PrescriptionDetail = lazy(() => import('./features/patient/components/PrescriptionDetail/PrescriptionDetail'))
const PatientSettingsProfile = lazy(() => import('./features/patient/components/PatientSettingsProfile/PatientSettingsProfile'))
const PatientUpdateHealth = lazy(() => import('./features/patient/components/PatientUpdateHealth/PatientUpdateHealth'))
const NotFoundpataint = lazy(() => import('./features/patient/components/NotFound/NotFound'))

// Doctor Pages
const DoctorDashboard = lazy(() => import('./features/doctor/pages/DoctorDashboard/DoctorDashboard'))
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
function App() {
  const routing = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [{ index: true, element: <Home /> }]
    },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/forgot-password", element: <ForgotPassword /> },

    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        { index: true, element: <AdminDashboard /> },
        { path: "dashboard", element: <AdminDashboard /> },
        { path: "doctor-management", element: <DoctorManagement /> },
        { path: "patient-management", element: <PatientManagement /> },
        { path: "stories-management", element: <StoriesManagement /> },
        { path: "activity-logs", element: <ActivityLogs /> },
        { path: "settings", element: <SettingsProfile /> },
        // تم تصليح المسارات هنا (شيلنا /admin/ وخليناها Path نضيق)
        { path: "AddDoctorBtn", element: <AddDoctorBtn /> },
        { path: "AddPatientBtn", element: <AddPatientBtn /> },
        { path: "edit-doctor/:id", element: <EditDoctor /> },
        { path: "edit-patient/:id", element: <EditPatient /> },
        { path: "reports", element: <AdminReports /> },
        { path: "stories/:id", element: <StoryDetails /> },
        { path: "stories/:id/comments", element: <StoryAllComments /> },
       { path: "*", element: <NotFound /> }
      ]
    },

    {
      path: "/patient",
      element: <PatientMainLayout />,
      children: [
        { index: true, element: <PatientDashboard /> },
        { path: "dashboard", element: <PatientDashboard /> },
        { path: "survey", element: <PatientLifestyleSurvey /> },
        { path: "heart-risk", element: <PatientHeartRisk /> },
        { path: "doctors", element: <PatientDoctorList /> },
        { path: "doctor-profile/:id", element: <PatientDoctorProfile /> },
        { path: "booking/:id", element: <PatientBooking /> },
        { path: "payment/:id", element: <PatientPayment /> },
        { path: "appointments", element: <PatientAppointments /> },
        { path: "qr", element: <PatientQRCode /> },
        { path: "settings", element: <PatientSettingsProfile /> },
        { path: "update-health", element: <PatientUpdateHealth /> },
        { path: "messages", element: <PatientMessages /> },
        { path: "records", element: <PatientMedicalRecords /> },
        { path: "stories", element: <PatientStories /> },
        { path: "stories/:id", element: <PatientStoryDetails /> },
        { path: "stories/:id/comments", element: <PatientAllComments /> },
        { path: "write-story", element: <WriteStory /> },
        { path: "prescription", element: <PatientPrescriptions /> },
        { path: "prescription/:id", element: <PrescriptionDetail /> },
       { path: "*", element: <NotFoundpataint /> },
      
      ]
    },

    {
      path: "/doctor",
      element: <DoctorLayout />,
      children: [
        { index: true, element: <DoctorDashboard /> },
        { path: "dashboard", element: <DoctorDashboard /> },
      ]
    },

    { path: "*", element: <NotFound /> }
  ]);

  return (
 <ErrorBoundary> 
      <Suspense fallback={<PageLoader />}>
        <RouterProvider router={routing} />
      </Suspense>
    </ErrorBoundary>
  )
}

export default App;