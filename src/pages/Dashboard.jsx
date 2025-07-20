import { useAuth } from "../context/useAuth";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-md">
              <h2 className="text-lg font-medium text-blue-800">Welcome, {user.email}</h2>
              <p className="text-blue-600">You can manage your portfolio content here.</p>
            </div>
            
            {/* Add your dashboard content here */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-md">
                <h3 className="font-medium text-gray-700">Edit Publications</h3>
                <p className="text-gray-500 mt-1">Manage your research papers and articles</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-md">
                <h3 className="font-medium text-gray-700">Update Experience</h3>
                <p className="text-gray-500 mt-1">Edit your professional experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;