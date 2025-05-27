
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button, buttonVariants } from "@/components/ui/button"; // Corrected import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserForm } from "./user-form";
import { FamilyForm } from "./family-form";
import type { User, Family } from "./types";
import { PlusCircle, Users, UserPlus, Edit, Trash2, UserCog, Home, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function FamiliesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [isFamilyFormOpen, setIsFamilyFormOpen] = useState(false);
  // const [editingFamily, setEditingFamily] = useState<Family | null>(null); // For future edit family

  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isUserDeleteDialogOpen, setIsUserDeleteDialogOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    const storedUsers = localStorage.getItem("covenantLinkUsers");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers).sort((a: User, b: User) => a.name.localeCompare(b.name)));
    }
    const storedFamilies = localStorage.getItem("covenantLinkFamilies");
    if (storedFamilies) {
      setFamilies(JSON.parse(storedFamilies).sort((a: Family, b: Family) => a.name.localeCompare(b.name)));
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("covenantLinkUsers", JSON.stringify(users));
    }
  }, [users, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("covenantLinkFamilies", JSON.stringify(families));
    }
  }, [families, isMounted]);

  const handleUserFormSubmit = useCallback(() => {
    setIsUserFormOpen(false);
    setEditingUser(null); // Reset editing state
  }, []);
  
  const handleOpenUserForm = (user?: User) => {
    setEditingUser(user || null);
    setIsUserFormOpen(true);
  };

  const handleFamilyFormSubmit = useCallback(() => {
    setIsFamilyFormOpen(false);
    // setEditingFamily(null); // Reset editing state
  }, []);

  const handleOpenFamilyForm = (family?: Family) => {
    // setEditingFamily(family || null); // For future edit
    setIsFamilyFormOpen(true);
  };
  
  const confirmDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsUserDeleteDialogOpen(true);
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;

    // Remove user from users list
    setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));

    // Remove user from all families
    setFamilies(prevFamilies => 
      prevFamilies.map(family => ({
        ...family,
        members: family.members.filter(member => member.id !== userToDelete.id)
      }))
    );

    toast({
      title: "User Deleted",
      description: `User "${userToDelete.name}" and their associations with families have been removed.`,
    });
    
    setIsUserDeleteDialogOpen(false);
    setUserToDelete(null);
  };


  if (!isMounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-6">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="items-center">
            <Loader2 className="h-16 w-16 text-primary mb-4 animate-spin" />
            <CardTitle className="text-3xl font-bold">Family & User Management</CardTitle>
            <CardDescription className="text-lg">Loading data...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Family & User Management</CardTitle>
          <CardDescription>
            Manage users and group them into families for better organization.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex mb-4">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" /> Manage Users
          </TabsTrigger>
          <TabsTrigger value="families" className="flex items-center gap-2">
            <Home className="h-4 w-4" /> Manage Families
          </TabsTrigger>
        </TabsList>

        {/* User Management Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Users List</CardTitle>
                    <CardDescription>Add, edit, or remove users.</CardDescription>
                </div>
                <Button onClick={() => handleOpenUserForm()}><UserPlus className="mr-2 h-4 w-4" /> Add New User</Button>
              </div>
            </CardHeader>
            <CardContent>
              {users.length > 0 ? (
                <ul className="space-y-3">
                  {users.map((user) => (
                    <li key={user.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-md shadow-sm">
                      <span className="font-medium text-foreground/90">{user.name}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenUserForm(user)}>
                          <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => confirmDeleteUser(user)}>
                          <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                 <div className="text-center py-10 text-muted-foreground">
                    <UserPlus className="mx-auto h-12 w-12 mb-3" />
                    <p className="font-medium">No users added yet.</p>
                    <p className="text-sm">Click "Add New User" to get started.</p>
                 </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Family Management Tab */}
        <TabsContent value="families">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Families List</CardTitle>
                    <CardDescription>Create families and assign users to them.</CardDescription>
                </div>
                <Button onClick={() => handleOpenFamilyForm()} disabled={users.length === 0}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Family
                </Button>
              </div>
               {users.length === 0 && <p className="text-sm text-destructive mt-2">Please add users first before creating families.</p>}
            </CardHeader>
            <CardContent>
              {families.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {families.map((family) => (
                    <Card key={family.id} className="flex flex-col">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Home className="h-5 w-5 text-primary" /> {family.name} Family
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <h4 className="text-sm font-medium mb-1 text-muted-foreground">Members:</h4>
                        {family.members.length > 0 ? (
                          <ul className="list-disc list-inside text-sm space-y-0.5 text-foreground/80">
                            {family.members.map((member) => (
                              <li key={member.id}>{member.name}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">No members assigned.</p>
                        )}
                      </CardContent>
                      {/* <CardFooter className="border-t pt-3">
                        <div className="flex gap-2 w-full">
                             <Button variant="outline" size="sm" className="w-full" onClick={() => {}}>
                                <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit
                            </Button>
                            <Button variant="destructive" size="sm" className="w-full" onClick={() => {}}>
                                <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                            </Button>
                        </div>
                      </CardFooter> */}
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                    <Home className="mx-auto h-12 w-12 mb-3" />
                    <p className="font-medium">No families created yet.</p>
                    <p className="text-sm">
                        {users.length > 0 ? "Click 'Add New Family' to group users." : "Add some users first, then you can create families."}
                    </p>
                 </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Form Dialog */}
      <Dialog open={isUserFormOpen} onOpenChange={(isOpen) => {
          setIsUserFormOpen(isOpen);
          if (!isOpen) setEditingUser(null);
        }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add a New User"}</DialogTitle>
            <DialogDescription>
              {editingUser ? "Update the user's name." : "Enter the name of the new user."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <UserForm
              setUsers={setUsers}
              onFormSubmit={handleUserFormSubmit}
              userToEdit={editingUser}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Family Form Dialog */}
      <Dialog open={isFamilyFormOpen} onOpenChange={(isOpen) => {
          setIsFamilyFormOpen(isOpen);
          // if (!isOpen) setEditingFamily(null); // For future edit
        }}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Create a New Family</DialogTitle>
            <DialogDescription>
              Give the family a name and select members from the list of users.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <FamilyForm
              users={users}
              setFamilies={setFamilies}
              onFormSubmit={handleFamilyFormSubmit}
              // familyToEdit={editingFamily} // For future edit
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* User Delete Confirmation Dialog */}
      <AlertDialog open={isUserDeleteDialogOpen} onOpenChange={setIsUserDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will remove "{userToDelete?.name}" from the system and from any families they are a member of. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className={buttonVariants({variant: "destructive"})}>
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
