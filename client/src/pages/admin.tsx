import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { User, ProjectWithUser } from "@shared/schema";

export default function Admin() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user?.isAdmin)) {
      toast({
        title: "Unauthorized",
        description: "Admin access required",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: isAuthenticated && user?.isAdmin,
  });

  const { data: users = [] } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: isAuthenticated && user?.isAdmin,
  });

  const { data: allProjects = [] } = useQuery({
    queryKey: ["/api/admin/projects"],
    enabled: isAuthenticated && user?.isAdmin,
  });

  if (isLoading || !user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center animate-pulse">
          <i className="fas fa-shield-alt text-white text-2xl"></i>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-shield-alt text-white text-sm"></i>
              </div>
              <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <a
                href="/"
                data-testid="link-user-dashboard"
                className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                User Dashboard
              </a>
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">Admin</span>
              <div className="flex items-center space-x-2">
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
                    <span className="text-slate-600 text-sm font-medium" data-testid="text-admin-initials">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </span>
                  </div>
                )}
                <span className="text-slate-700 font-medium" data-testid="text-admin-name">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <button
                onClick={() => window.location.href = "/api/logout"}
                data-testid="button-admin-logout"
                className="text-slate-500 hover:text-slate-700 p-2"
              >
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Dashboard Overview</h2>
          <p className="mt-2 text-slate-600">Monitor user activity and project statistics</p>
        </div>

        {/* Admin Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <i className="fas fa-users text-blue-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Users</p>
                <p className="text-2xl font-bold text-slate-900" data-testid="text-total-users">
                  {stats?.totalUsers || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <i className="fas fa-user-check text-green-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Active Users</p>
                <p className="text-2xl font-bold text-slate-900" data-testid="text-active-users">
                  {stats?.activeUsers || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <i className="fas fa-project-diagram text-purple-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Projects</p>
                <p className="text-2xl font-bold text-slate-900" data-testid="text-admin-total-projects">
                  {stats?.totalProjects || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <i className="fas fa-calendar-check text-yellow-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">This Month</p>
                <p className="text-2xl font-bold text-slate-900" data-testid="text-monthly-projects">
                  {stats?.monthlyProjects || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-8">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">All Users</h3>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Projects</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {users.map((userData: User) => {
                  const userProjectCount = allProjects.filter((p: ProjectWithUser) => p.userId === userData.id).length;
                  
                  return (
                    <tr key={userData.id} className="hover:bg-slate-50" data-testid={`row-user-${userData.id}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {userData.profileImageUrl ? (
                            <img
                              src={userData.profileImageUrl}
                              alt="Profile"
                              className="w-8 h-8 rounded-full object-cover mr-3"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                              <span className="text-white text-sm font-medium">
                                {userData.firstName?.[0]}{userData.lastName?.[0]}
                              </span>
                            </div>
                          )}
                          <span className="font-medium text-slate-900" data-testid={`text-user-name-${userData.id}`}>
                            {userData.firstName} {userData.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600" data-testid={`text-user-email-${userData.id}`}>
                        {userData.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-slate-100 text-slate-800 text-sm font-medium px-2 py-1 rounded-full" data-testid={`text-user-project-count-${userData.id}`}>
                          {userProjectCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`text-sm font-medium px-2 py-1 rounded-full ${
                            userData.isActive 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                          data-testid={`text-user-status-${userData.id}`}
                        >
                          {userData.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600" data-testid={`text-user-joined-${userData.id}`}>
                        {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
