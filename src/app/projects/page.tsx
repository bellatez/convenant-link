
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProjectForm } from "./project-form";
import type { Project, Contribution } from "./types";
import { Target, PlusCircle, CalendarClock, DollarSign, Users, Edit, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  useEffect(() => {
    setIsMounted(true);
    // Load projects from localStorage if available (basic persistence)
    const storedProjects = localStorage.getItem("covenantLinkProjects");
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects, (key, value) => {
        if (key === 'deadline' || key === 'date') return new Date(value);
        return value;
      }));
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("covenantLinkProjects", JSON.stringify(projects));
    }
  }, [projects, isMounted]);

  const handleProjectFormSubmit = useCallback(() => {
    setIsProjectFormOpen(false);
    setProjectToEdit(null);
  }, []);

  const handleAddNewProject = () => {
    setProjectToEdit(null);
    setIsProjectFormOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setProjectToEdit(project);
    setIsProjectFormOpen(true);
  };
  
  const handleDeleteProject = (projectId: string) => {
    // Add confirmation dialog here in a real app
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const calculateCurrentAmount = (contributions: Contribution[]): number => {
    return contributions.reduce((acc, curr) => acc + curr.amount, 0);
  };

  if (!isMounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-6">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="items-center">
            <Target className="h-16 w-16 text-primary mb-4 animate-pulse" />
            <CardTitle className="text-3xl font-bold">Group Projects</CardTitle>
            <CardDescription className="text-lg">Loading project data...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">Group Projects & Contributions</CardTitle>
              <CardDescription>
                Track group projects, their goals, deadlines, and contributions.
              </CardDescription>
            </div>
            <Button onClick={handleAddNewProject} className="shrink-0">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Project
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Separator />

      <Dialog open={isProjectFormOpen} onOpenChange={(isOpen) => {
          setIsProjectFormOpen(isOpen);
          if (!isOpen) setProjectToEdit(null);
        }}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{projectToEdit ? "Edit Project" : "Create a New Project"}</DialogTitle>
            <DialogDescription>
              {projectToEdit ? "Update the details for this project." : "Fill in the details below to start a new group project."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ProjectForm
              setProjects={setProjects}
              onFormSubmit={handleProjectFormSubmit}
              projectToEdit={projectToEdit}
            />
          </div>
        </DialogContent>
      </Dialog>

      {projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const currentAmount = calculateCurrentAmount(project.contributions);
            const progressPercentage = project.targetAmount > 0 ? (currentAmount / project.targetAmount) * 100 : 0;
            return (
              <Card key={project.id} className="flex flex-col shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditProject(project)} className="text-muted-foreground hover:text-primary h-8 w-8">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit Project</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteProject(project.id)} className="text-muted-foreground hover:text-destructive h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete Project</span>
                        </Button>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground pt-1">
                    <CalendarClock className="h-4 w-4 mr-1.5 flex-shrink-0" />
                    <span>Deadline: {format(project.deadline, "PPP")}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold text-primary">
                        ${currentAmount.toFixed(2)} / ${project.targetAmount.toFixed(2)}
                      </span>
                    </div>
                    <Progress value={progressPercentage} aria-label={`${project.name} progress ${progressPercentage.toFixed(0)}%`} />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1 flex items-center gap-1.5 text-foreground">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      Contributions ({project.contributions.length})
                    </h4>
                    {project.contributions.length > 0 ? (
                      <ul className="text-xs text-muted-foreground list-disc list-inside max-h-20 overflow-y-auto">
                        {project.contributions.slice(0,3).map(c => ( // Show first 3
                            <li key={c.id}>{c.coupleName}: ${c.amount.toFixed(2)}</li>
                        ))}
                        {project.contributions.length > 3 && <li>...and {project.contributions.length-3} more</li>}
                      </ul>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No contributions yet.</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => alert(`Adding contribution to ${project.name} - Coming soon!`)}>
                    <DollarSign className="mr-2 h-4 w-4" /> Add Contribution
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center text-center">
            <Target className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-1">No Projects Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Start planning your group's goals by adding a new project.
            </p>
            <Button onClick={handleAddNewProject} className="mt-6">
              <PlusCircle className="mr-2 h-4 w-4" /> Add First Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
