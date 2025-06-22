import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Home, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  User, 
  LogOut,
  Heart,
  Activity,
  Utensils,
  Stethoscope
} from 'lucide-react'

const Layout = ({ children }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-800">Captivity & Care</h1>
        </div>
        
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            <Link
              to="/dashboard"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
            >
              <Home className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            
            <div className="pt-4">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Animals
              </p>
              <Link
                to="/animals"
                className="flex items-center px-4 py-2 mt-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
              >
                <Users className="mr-3 h-5 w-5" />
                Animal List
              </Link>
              <Link
                to="/animals/add"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
              >
                <Users className="mr-3 h-5 w-5" />
                Add Animal
              </Link>
            </div>

            <div className="pt-4">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Care Management
              </p>
              <Link
                to="/care/schedule"
                className="flex items-center px-4 py-2 mt-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
              >
                <Calendar className="mr-3 h-5 w-5" />
                Schedule
              </Link>
              <Link
                to="/care/medical"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
              >
                <Stethoscope className="mr-3 h-5 w-5" />
                Medical Records
              </Link>
              <Link
                to="/care/feeding"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
              >
                <Utensils className="mr-3 h-5 w-5" />
                Feeding Log
              </Link>
              <Link
                to="/care/health"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
              >
                <Heart className="mr-3 h-5 w-5" />
                Health Check
              </Link>
            </div>

            <div className="pt-4">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Reports
              </p>
              <Link
                to="/reports"
                className="flex items-center px-4 py-2 mt-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
              >
                <FileText className="mr-3 h-5 w-5" />
                Reports
              </Link>
              <Link
                to="/reports/generate"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
              >
                <Activity className="mr-3 h-5 w-5" />
                Generate Report
              </Link>
            </div>
          </div>
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/profile"
                className="flex items-center text-gray-700 hover:text-green-600 transition-colors"
              >
                <User className="mr-2 h-5 w-5" />
                Profile
              </Link>
            </div>
            <div className="flex space-x-2">
              <Link
                to="/settings"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Settings className="h-5 w-5" />
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Welcome to Captivity & Care
            </h2>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout