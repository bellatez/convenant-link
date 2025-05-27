
"use client";

import type { Project, Contribution } from "./types";
import type { Family } from "../families/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Target, CalendarClock, Users2, TrendingUp, HandCoins, Percent } from "lucide-react";
import { format } from "date-fns";

interface ProjectDetailsDialogProps {
  project: Project | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  allRegisteredFamilies: Family[];
}

const formatXAF = (amount: number): string => {
  return amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

export function ProjectDetailsDialog({ project, isOpen, onOpenChange, allRegisteredFamilies }: ProjectDetailsDialogProps) {
  if (!project) return null;

  const totalContributed = project.contributions.reduce((sum, contrib) => sum + contrib.amount, 0);
  const overallProgressPercentage = project.targetAmount > 0 ? Math.min((totalContributed / project.targetAmount) * 100, 100) : 0;
  const targetPerFamily = project.numberOfFamilies > 0 ? project.targetAmount / project.numberOfFamilies : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">{project.name}</DialogTitle>
          <DialogDescription>
            Detailed overview and contribution status for this project.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow pr-2 -mr-2">
          <div className="space-y-6 py-4 pr-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Family Contribution Status</CardTitle>
                <CardDescription>
                  Below is a breakdown of contributions from each registered family towards their calculated share of this project's target (approx. XAF {formatXAF(Math.ceil(targetPerFamily))} per family).
                </CardDescription>
              </CardHeader>
              <CardContent>
                {allRegisteredFamilies.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Family Name</TableHead>
                        <TableHead className="text-right">Contributed (XAF)</TableHead>
                        <TableHead className="text-right">Individual Target (XAF)</TableHead>
                        <TableHead className="text-center w-[150px]">Progress (%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allRegisteredFamilies.map((family) => {
                        const familyContributionsToThisProject = project.contributions
                          .filter(c => c.coupleName === family.name)
                          .reduce((sum, c) => sum + c.amount, 0);
                        
                        const familyProgressPercentage = targetPerFamily > 0 
                          ? Math.min((familyContributionsToThisProject / targetPerFamily) * 100, 100) 
                          : 0;

                        return (
                          <TableRow key={family.id}>
                            <TableCell className="font-medium">{family.name}</TableCell>
                            <TableCell className="text-right">
                              {formatXAF(familyContributionsToThisProject)}
                            </TableCell>
                            <TableCell className="text-right">
                              {targetPerFamily > 0 ? formatXAF(Math.ceil(targetPerFamily)) : "N/A"}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex flex-col items-center gap-1">
                                <span className="text-xs font-semibold">
                                  {familyProgressPercentage.toFixed(0)}%
                                </span>
                                <Progress value={familyProgressPercentage} className="h-2 w-24" aria-label={`${family.name} contribution progress ${familyProgressPercentage.toFixed(0)}%`} />
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No families are registered in the system yet. Add families in the 'Families' section.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Overall Project Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {project.description && (
                  <p className="text-muted-foreground italic">{project.description}</p>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center"><CalendarClock className="h-4 w-4 mr-2"/>Deadline:</span>
                  <span>{format(project.deadline, "PPP")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center"><Target className="h-4 w-4 mr-2"/>Overall Target Amount:</span>
                  <span className="font-semibold">XAF {formatXAF(project.targetAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center"><TrendingUp className="h-4 w-4 mr-2"/>Total Raised So Far:</span>
                  <span className="font-semibold text-primary">XAF {formatXAF(totalContributed)}</span>
                </div>
                 <Progress value={overallProgressPercentage} className="h-3" aria-label={`Overall project progress ${overallProgressPercentage.toFixed(0)}%`} />
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center"><Users2 className="h-4 w-4 mr-2"/>Target No. of Families:</span>
                  <span>{project.numberOfFamilies}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center"><HandCoins className="h-4 w-4 mr-2"/>Calculated Target per Family:</span>
                  <span className="font-semibold">
                    {targetPerFamily > 0 ? `XAF ${formatXAF(Math.ceil(targetPerFamily))}` : "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>

          </div>
        </ScrollArea>
        <div className="pt-4 border-t">
            <DialogClose asChild>
                <Button variant="outline" className="w-full">Close</Button>
            </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
