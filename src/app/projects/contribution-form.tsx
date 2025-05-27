
"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { Project, Contribution } from "./types";
import type { Family } from "../families/types"; // Import Family type
import { useToast } from "@/hooks/use-toast";

const contributionFormSchema = z.object({
  coupleName: z.string().min(1, "Please select a family."), // Will store the family name
  amount: z.coerce.number().positive("Contribution amount must be a positive number."),
});

type ContributionFormValues = z.infer<typeof contributionFormSchema>;

interface ContributionFormProps {
  project: Project;
  setProjects: Dispatch<SetStateAction<Project[]>>;
  onFormSubmit: () => void; // Callback to close dialog
  availableFamilies: Family[]; // New prop
}

export function ContributionForm({ project, setProjects, onFormSubmit, availableFamilies }: ContributionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContributionFormValues>({
    resolver: zodResolver(contributionFormSchema),
    defaultValues: {
      coupleName: "",
      amount: undefined, // Use undefined for number inputs for better placeholder behavior
    },
  });

  const onSubmit: SubmitHandler<ContributionFormValues> = async (data) => {
    setIsLoading(true);
    try {
      const newContribution: Contribution = {
        id: crypto.randomUUID(),
        coupleName: data.coupleName, // This is the selected family name
        amount: data.amount,
        date: new Date(),
      };

      setProjects((prevProjects) =>
        prevProjects.map((p) =>
          p.id === project.id
            ? { ...p, contributions: [...p.contributions, newContribution].sort((a,b) => b.date.getTime() - a.date.getTime()) }
            : p
        )
      );

      toast({
        title: "Contribution Added",
        description: `XAF ${data.amount.toLocaleString()} from ${data.coupleName} family added to "${project.name}".`,
      });
      
      form.reset();
      onFormSubmit();
    } catch (error) {
      console.error("Error adding contribution:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not add contribution. Please try again.",
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
          name="coupleName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contributing Family</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={availableFamilies.length === 0}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={availableFamilies.length === 0 ? "No families registered" : "Select a family"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableFamilies.map((family) => (
                    <SelectItem key={family.id} value={family.name}>
                      {family.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableFamilies.length === 0 && (
                <FormDescription className="text-destructive">
                  Please add families in the 'Families' section first.
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (XAF)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 10000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading || availableFamilies.length === 0}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Contribution
          </Button>
        </div>
      </form>
    </Form>
  );
}

    