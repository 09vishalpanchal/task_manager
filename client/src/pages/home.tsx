import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { ProjectModal } from "@/components/project-modal";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
    enabled: isAuthenticated,
  });

  const filteredProjects = projects.filter((project: Project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getProjectStats = () => {
    const stats = {
      total: projects.length,
      completed: projects.filter((p: Project) => p.status === "completed").length,
      active: projects.filter((p: Project) => p.status === "active").length,
      onHold: projects.filter((p: Project) => p.status === "on-hold").length,
    };
    return stats;
  };

  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      await apiRequest("DELETE", `/api/projects/${projectId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    },
  });

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProjectMutation.mutate(projectId);
    }
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const stats = getProjectStats();

  if (isLoading || projectsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center animate-pulse">
          <i className="fas fa-project-diagram text-white text-2xl"></i>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-project-diagram text-white text-sm"></i>
              </div>
              <h1 className="text-xl font-bold text-slate-900">Project Manager</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user?.isAdmin && (
                <a
                  href="/admin"
                  data-testid="link-admin-dashboard"
                  className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Admin Dashboard
                </a>
              )}
              <div className="flex items-center space-x-2">
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
                    <span className="text-slate-600 text-sm font-medium" data-testid="text-user-initials">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </span>
                  </div>
                )}
                <span className="text-slate-700 font-medium" data-testid="text-user-name">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <button
                onClick={() => window.location.href = "/api/logout"}
                data-testid="button-logout"
                className="text-slate-500 hover:text-slate-700 p-2"
              >
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">My Projects</h2>
              <p className="mt-2 text-slate-600">Manage and track your project progress</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button
                onClick={handleAddProject}
                data-testid="button-add-project"
                className="bg-primary text-white hover:bg-primary-600"
              >
                <i className="fas fa-plus mr-2"></i>
                Add Project
              </Button>
            </div>
          </div>
        </div>

        {/* Project Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <i className="fas fa-folder text-blue-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Projects</p>
                <p className="text-2xl font-bold text-slate-900" data-testid="text-total-projects">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <i className="fas fa-check-circle text-green-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Completed</p>
                <p className="text-2xl font-bold text-slate-900" data-testid="text-completed-projects">{stats.completed}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <i className="fas fa-clock text-yellow-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Active</p>
                <p className="text-2xl font-bold text-slate-900" data-testid="text-active-projects">{stats.active}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <i className="fas fa-pause-circle text-orange-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">On Hold</p>
                <p className="text-2xl font-bold text-slate-900" data-testid="text-onhold-projects">{stats.onHold}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Projects</h3>
              <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="input-search-projects"
                    className="pl-10"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <i className="fas fa-search text-slate-400"></i>
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger data-testid="select-status-filter" className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-folder-open text-slate-400 text-2xl"></i>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No projects found</h3>
                <p className="text-slate-600 mb-4">
                  {projects.length === 0 
                    ? "Get started by creating your first project" 
                    : "Try adjusting your search or filter criteria"
                  }
                </p>
                {projects.length === 0 && (
                  <Button onClick={handleAddProject} data-testid="button-create-first-project">
                    Create Your First Project
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project: Project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onEdit={handleEditProject}
                    onDelete={handleDeleteProject}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={editingProject}
      />
    </div>
  );
}
