
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { ProjectForm } from "./project-form";
import { ContributionForm } from "./contribution-form";
import type { Project, Contribution } from "./types";
import type { Family } from "../families/types"; // Import Family type
import { Target, PlusCircle, CalendarClock, Edit, Trash2, Users2, Info, TrendingUp, HandCoins, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

// Helper to format XAF amounts with comma separators
const formatXAF = (amount: number): string => {
  return amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [families, setFamilies] = useState<Family[]>([]); // State for families
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isProjectDeleteDialogOpen, setIsProjectDeleteDialogOpen] = useState(false);


  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [selectedProjectForContribution, setSelectedProjectForContribution] = useState<Project | null>(null);


  useEffect(() => {
    setIsMounted(true);
    const storedProjects = localStorage.getItem("covenantLinkProjects");
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects, (key, value) => {
        if (key === 'deadline' || key === 'date') return new Date(value);
        return value;
      }));
    }
    const storedFamilies = localStorage.getItem("covenantLinkFamilies"); // Load families
    if (storedFamilies) {
      setFamilies(JSON.parse(storedFamilies));
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
  
  const confirmDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setIsProjectDeleteDialogOpen(true);
  };

  const handleDeleteProject = () => {
    if (!projectToDelete) return;
    setProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
    toast({
      title: "Project Deleted",
      description: `Project "${projectToDelete.name}" and its contributions have been removed.`,
    });
    setIsProjectDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const handleOpenContributionModal = (project: Project) => {
    setSelectedProjectForContribution(project);
    setIsContributionModalOpen(true);
  };

  const handleContributionFormSubmit = useCallback(() => {
    setIsContributionModalOpen(false);
    setSelectedProjectForContribution(null);
  }, []);

  const calculateCurrentAmount = (contributions: Contribution[]): number => {
    return contributions.reduce((acc, curr) => acc + curr.amount, 0);
  };

  if (!isMounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-6">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="items-center">
            <Loader2 className="h-16 w-16 text-primary mb-4 animate-spin" />
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
                Track group projects, their goals, deadlines, participating families, and contributions.
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

      {/* Project Form Dialog */}
      <Dialog open={isProjectFormOpen} onOpenChange={(isOpen) => {
          setIsProjectFormOpen(isOpen);
          if (!isOpen) setProjectToEdit(null);
        }}>
        <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
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
              registeredFamilyCount={families.length} // Pass family count
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Contribution Form Dialog */}
      {selectedProjectForContribution && (
        <Dialog open={isContributionModalOpen} onOpenChange={(isOpen) => {
            setIsContributionModalOpen(isOpen);
            if (!isOpen) setSelectedProjectForContribution(null);
          }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Contribution to "{selectedProjectForContribution.name}"</DialogTitle>
              <DialogDescription>
                Select the contributing family and enter the amount.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <ContributionForm
                project={selectedProjectForContribution}
                setProjects={setProjects}
                onFormSubmit={handleContributionFormSubmit}
                availableFamilies={families} // Pass available families
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Project Confirmation Dialog */}
      <AlertDialog open={isProjectDeleteDialogOpen} onOpenChange={setIsProjectDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will remove "{projectToDelete?.name}" and all its contributions. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProjectToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className={buttonVariants({variant: "destructive"})}>
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      {projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()).map((project) => {
            const currentAmount = calculateCurrentAmount(project.contributions);
            const progressPercentage = project.targetAmount > 0 ? Math.min((currentAmount / project.targetAmount) * 100, 100) : 0;
            const amountPerFamily = project.numberOfFamilies > 0 ? project.targetAmount / project.numberOfFamilies : 0;

            return (
              <Card key={project.id} className="flex flex-col shadow-lg break-inside-avoid-column">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditProject(project)} className="text-muted-foreground hover:text-primary h-8 w-8">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit Project</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => confirmDeleteProject(project)} className="text-muted-foreground hover:text-destructive h-8 w-8">
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
                <CardContent className="flex-grow space-y-4">
                  {project.description && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-sky-600"/>
                        <p className="italic">{project.description}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between items-baseline text-sm mb-0.5">
                        <span className="text-muted-foreground flex items-center"><TrendingUp className="h-4 w-4 mr-1.5"/>Overall Progress</span>
                        <span className="font-semibold text-primary">
                          XAF {formatXAF(currentAmount)} / {formatXAF(project.targetAmount)}
                        </span>
                      </div>
                      <Progress value={progressPercentage} aria-label={`${project.name} progress ${progressPercentage.toFixed(0)}%`} />
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground flex items-center"><Users2 className="h-4 w-4 mr-1.5"/>Families</span>
                        <span className="font-medium">{project.numberOfFamilies}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground flex items-center"><Target className="h-4 w-4 mr-1.5"/>Target / Family (XAF)</span>
                        <span className="font-medium">{amountPerFamily > 0 ? formatXAF(Math.ceil(amountPerFamily)) : "N/A"}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1 flex items-center gap-1.5 text-foreground">
                      <HandCoins className="h-4 w-4 text-muted-foreground" />
                      Contributions ({project.contributions.length})
                    </h4>
                    {project.contributions.length > 0 ? (
                      <ul className="text-xs text-muted-foreground list-disc list-inside max-h-24 overflow-y-auto space-y-0.5 pr-2">
                        {project.contributions.slice(0,5).map(c => ( 
                            <li key={c.id} className="truncate">{c.coupleName}: XAF {formatXAF(c.amount)} on {format(c.date, "PP")}</li>
                        ))}
                        {project.contributions.length > 5 && <li className="italic">...and {project.contributions.length-5} more</li>}
                      </ul>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No contributions yet.</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" className="w-full" onClick={() => handleOpenContributionModal(project)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Contribution (XAF)
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

    