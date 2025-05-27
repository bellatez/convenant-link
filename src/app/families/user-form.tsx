
"use client";

import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
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
import { Loader2 } from "lucide-react";
import type { User } from "./types";
import { useToast } from "@/hooks/use-toast";

const userFormSchema = z.object({
  name: z.string().min(2, "User's name must be at least 2 characters long."),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  setUsers: Dispatch<SetStateAction<User[]>>;
  onFormSubmit: () => void; // Callback to close dialog
  userToEdit?: User | null;
}

export function UserForm({ setUsers, onFormSubmit, userToEdit }: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const formMode = userToEdit ? "edit" : "create";

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: userToEdit?.name || "",
    },
  });

  useEffect(() => {
    if (userToEdit) {
      form.reset({ name: userToEdit.name });
    } else {
      form.reset({ name: "" });
    }
  }, [userToEdit, form]);

  const onSubmit: SubmitHandler<UserFormValues> = async (data) => {
    setIsLoading(true);
    try {
      if (formMode === "create") {
        const newUser: User = {
          id: crypto.randomUUID(),
          name: data.name,
        };
        setUsers((prevUsers) => [...prevUsers, newUser].sort((a,b) => a.name.localeCompare(b.name)));
        toast({
          title: "User Added",
          description: `User "${data.name}" has been added.`,
        });
      } else if (userToEdit) {
        const updatedUser: User = {
          ...userToEdit,
          name: data.name,
        };
        setUsers((prevUsers) =>
          prevUsers.map(user => user.id === userToEdit.id ? updatedUser : user)
          .sort((a,b) => a.name.localeCompare(b.name))
        );
        toast({
          title: "User Updated",
          description: `User "${data.name}" has been updated.`,
        });
      }
      
      onFormSubmit(); // Calls form.reset() via useEffect in parent and closes dialog
    } catch (error) {
      console.error(`Error ${formMode === 'create' ? 'adding' : 'updating'} user:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Could not ${formMode === 'create' ? 'add' : 'update'} user. Please try again.`,
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
              <FormLabel>User's Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {formMode === "create" ? "Add User" : "Update User"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
