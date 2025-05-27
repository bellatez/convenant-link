
"use client";

import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import type { User, Family } from "./types";
import { useToast } from "@/hooks/use-toast";

const familyFormSchema = z.object({
  name: z.string().min(2, "Family name must be at least 2 characters long."),
  memberIds: z.array(z.string()).optional(), // Store array of selected user IDs
});

type FamilyFormValues = z.infer<typeof familyFormSchema>;

interface FamilyFormProps {
  users: User[];
  setFamilies: Dispatch<SetStateAction<Family[]>>;
  onFormSubmit: () => void; // Callback to close dialog
  // familyToEdit?: Family | null; // For future edit functionality
}

export function FamilyForm({ users, setFamilies, onFormSubmit }: FamilyFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  // const formMode = familyToEdit ? "edit" : "create"; // For future edit

  const form = useForm<FamilyFormValues>({
    resolver: zodResolver(familyFormSchema),
    defaultValues: {
      name: "",
      memberIds: [],
    },
  });

  // useEffect(() => { // For future edit functionality
  //   if (familyToEdit) {
  //     form.reset({ 
  //       name: familyToEdit.name,
  //       memberIds: familyToEdit.members.map(member => member.id) 
  //     });
  //   } else {
  //     form.reset({ name: "", memberIds: [] });
  //   }
  // }, [familyToEdit, form]);

  const onSubmit: SubmitHandler<FamilyFormValues> = async (data) => {
    setIsLoading(true);
    try {
      const selectedMembers = users.filter(user => data.memberIds?.includes(user.id));
      
      // if (formMode === "create") { // Future edit
        const newFamily: Family = {
          id: crypto.randomUUID(),
          name: data.name,
          members: selectedMembers,
        };
        setFamilies((prevFamilies) => [...prevFamilies, newFamily].sort((a,b) => a.name.localeCompare(b.name)));
        toast({
          title: "Family Created",
          description: `The "${data.name}" family has been created.`,
        });
      // } else if (familyToEdit) {
        // Update logic for editing family
      // }
      
      form.reset({ name: "", memberIds: [] });
      onFormSubmit();
    } catch (error) {
      console.error("Error saving family:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save family. Please try again.",
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
              <FormLabel>Family Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., The Smiths" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="memberIds"
          render={() => (
            <FormItem>
              <div className="mb-2">
                <FormLabel>Select Family Members</FormLabel>
                <FormDescription>
                  Choose users to include in this family.
                </FormDescription>
              </div>
              {users.length === 0 ? (
                <p className="text-sm text-muted-foreground">No users available to add to families. Please add users first.</p>
              ) : (
                <ScrollArea className="h-40 rounded-md border p-3">
                  {users.map((user) => (
                    <FormField
                      key={user.id}
                      control={form.control}
                      name="memberIds"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={user.id}
                            className="flex flex-row items-start space-x-3 space-y-0 py-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(user.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), user.id])
                                    : field.onChange(
                                        (field.value || []).filter(
                                          (value) => value !== user.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {user.name}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </ScrollArea>
              )}
              <FormMessage />
            </FormItem>
          )}
        />


        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading || users.length === 0}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Family
            {/* {formMode === "create" ? "Create Family" : "Update Family"} */}
          </Button>
        </div>
      </form>
    </Form>
  );
}
