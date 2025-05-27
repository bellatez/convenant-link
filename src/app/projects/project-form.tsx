
"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { Project } from "./types";
import { useToast } from "@/hooks/use-toast";

const projectFormSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters long."),
  targetAmount: z.coerce.number().positive("Target amount must be a positive number."),
  deadline: z.date({ required_error: "Please select a deadline for the project." }),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  setProjects: Dispatch<SetStateAction<Project[]>>;
  onFormSubmit: () => void; // Callback to close dialog
  projectToEdit?: Project | null;
}

export function ProjectForm({ setProjects, onFormSubmit, projectToEdit }: ProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const formMode = projectToEdit ? "edit" : "create";

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: projectToEdit?.name || "",
      targetAmount: projectToEdit?.targetAmount || 0,
      deadline: projectToEdit?.deadline || new Date(new Date().setMonth(new Date().getMonth() + 1)), // Default to one month from now
    },
  });

  const onSubmit: SubmitHandler<ProjectFormValues> = async (data) => {
    setIsLoading(true);
    try {
      if (formMode === "create") {
        const newProject: Project = {
          id: crypto.randomUUID(),
          ...data,
          contributions: [],
        };
        setProjects((prevProjects) => [...prevProjects, newProject].sort((a,b) => a.deadline.getTime() - b.deadline.getTime()));
        toast({
          title: "Project Created",
          description: `"${data.name}" has been added.`,
        });
      } else if (projectToEdit) {
        const updatedProject: Project = {
          ...projectToEdit,
          ...data,
        };
        setProjects((prevProjects) =>
          prevProjects.map(project => project.id === projectToEdit.id ? updatedProject : project)
          .sort((a,b) => a.deadline.getTime() - b.deadline.getTime())
        );
        toast({
          title: "Project Updated",
          description: `"${data.name}" has been updated.`,
        });
      }
      form.reset({ name: "", targetAmount: 0, deadline: new Date(new Date().setMonth(new Date().getMonth() + 1)) });
      onFormSubmit();
    } catch (error) {
      console.error("Error saving project:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save project. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., End-of-year food purchase" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Amount ($)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Deadline</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {formMode === "create" ? "Create Project" : "Update Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
