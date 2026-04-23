import ProjectItem from "./ProjectItem";

function ProjectList({ projects, onDelete, onUpdateStatus }) {
  return (
    <div className="grid gap-4">
      {projects.map((project) => (
        <ProjectItem
          key={project.projectId}
          project={project}
          onDelete={onDelete}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </div>
  );
}

export default ProjectList;