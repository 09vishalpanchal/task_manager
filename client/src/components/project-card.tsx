import type { Project } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "on-hold":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "on-hold":
        return "On Hold";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all" data-testid={`card-project-${project.id}`}>
      {project.imageUrl ? (
        <img
          src={project.imageUrl}
          alt={project.name}
          className="w-full h-32 object-cover rounded-lg mb-4"
          data-testid={`img-project-${project.id}`}
        />
      ) : (
        <div className="w-full h-32 bg-slate-100 rounded-lg mb-4 flex items-center justify-center">
          <i className="fas fa-image text-slate-400 text-2xl"></i>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-slate-900" data-testid={`text-project-name-${project.id}`}>
          {project.name}
        </h4>
        <span 
          className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(project.status)}`}
          data-testid={`text-project-status-${project.id}`}
        >
          {formatStatus(project.status)}
        </span>
      </div>
      
      {project.description && (
        <p className="text-slate-600 text-sm mb-3" data-testid={`text-project-description-${project.id}`}>
          {project.description}
        </p>
      )}
      
      <div className="flex items-center justify-between">
        {project.link ? (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-600 text-sm font-medium flex items-center"
            data-testid={`link-project-${project.id}`}
          >
            <i className="fas fa-external-link-alt mr-1"></i>
            View Project
          </a>
        ) : (
          <div></div>
        )}
        
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(project)}
            className="text-slate-400 hover:text-slate-600 p-1 h-auto"
            data-testid={`button-edit-project-${project.id}`}
          >
            <i className="fas fa-edit"></i>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(project.id)}
            className="text-slate-400 hover:text-red-600 p-1 h-auto"
            data-testid={`button-delete-project-${project.id}`}
          >
            <i className="fas fa-trash"></i>
          </Button>
        </div>
      </div>
    </div>
  );
}
