
export interface User {
  id: string;
  name: string;
}

export interface Family {
  id: string;
  name: string;
  members: User[];
}
