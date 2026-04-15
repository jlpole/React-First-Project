import HomePage from './Pages/LandingPage';
import { Routes, Route } from 'react-router-dom';
import Register from './Pages/RegistrationPage';
import Login from './Pages/LoginPage';
import AdminDashboard from './Pages/Admin/DashboardPage';
import OwnerDashboard from './Pages/Owner/DashboardPage';
import MarketerDashboard from './Pages/Marketer/DashboardPage';
import BusinessPage from './Pages/Admin/Business';
import { AuthProvider } from './AuthContext';
import { ProtectedRoute, PublicRoute } from './ProtectedRoute';
import TeamTable from './Pages/Admin/Members'
import OwnerBusinessPage from './Pages/Owner/Business'
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import { Toaster } from 'react-hot-toast';
import OwnerProducts from './Pages/Owner/OwnerProducts';
import LandingPage from './Pages/Landing';
import MarketerRegister from './Pages/MarketerRegister';
import OwnerPotentialBuyer from './Pages/Owner/Potential';
function App() {
  return (
    <div>
      <AuthProvider>
    <Toaster 
  position="top-right"
  toastOptions={{
    success: {
      duration: 4000,
      style: {
        background: '#15803d',
        color: '#ffffff',
        fontSize: '20px',
        padding: '20px 28px', 
         minWidth: '380px',  
        borderRadius: '12px',
        minWidth: '300px',
           maxWidth: '600px',  
      },
      iconTheme: {
      primary: '#ffffff',  
   secondary: '#15803d',   
      },
    },
  }}
/>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
       
           <Route path="/MarketerRegister" element={<MarketerRegister/>} />
          <Route 
            path="/Register" 
            element={
              <PublicRoute>
                <Register/>
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login/>
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/Admin/Dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
                  <Route 
                  path="/Admin/Business" 
                element={
                   <ProtectedRoute allowedRoles={['Admin']}>
                    <BusinessPage />
                   </ProtectedRoute>
          } 
        />
              <Route 
                  path="/Admin/Members" 
                element={
                   <ProtectedRoute allowedRoles={['Admin']}>
                    <TeamTable />
                   </ProtectedRoute>
          } 
        />


          <Route 
            path="/Owner/Dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Owner']}>
                <OwnerDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/Owner/Business" 
            element={
              <ProtectedRoute allowedRoles={['Owner']}>
                <OwnerBusinessPage />
              </ProtectedRoute>
            } 
          />

           <Route 
            path="/Owner/Products" 
            element={
              <ProtectedRoute allowedRoles={['Owner']}>
                <OwnerProducts/>
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/Owner/PotentialBuyer" 
            element={
              <ProtectedRoute allowedRoles={['Owner']}>
                <OwnerPotentialBuyer />
              </ProtectedRoute>
            } 
          />

           <Route 
            path="/Marketer/Dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Marketer']}>
                <MarketerDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;