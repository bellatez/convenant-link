
export interface Contribution {
  id: string;
  coupleName: string;
  amount: number;
  date: Date;
}

export interface Project {
  id: string;
  name: string;
  targetAmount: number;
  deadline: Date;
  contributions: Contribution[];
}
