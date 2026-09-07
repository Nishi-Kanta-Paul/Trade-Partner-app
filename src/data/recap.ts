export type RecapValues = {
  date: string;
  projectName: string;
  projectNumber: string;
  projectCity: string;
  projectState: string;
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  email: string;
  startDate: string;
  completedDate: string;
  daysWorked: string;
  description: string;
  issues: string;
  totalValue: string;
  comments: string;
};

export const EMPTY_RECAP: RecapValues = {
  date: "",
  projectName: "",
  projectNumber: "",
  projectCity: "",
  projectState: "",
  firstName: "",
  lastName: "",
  company: "",
  phone: "",
  email: "",
  startDate: "",
  completedDate: "",
  daysWorked: "",
  description: "",
  issues: "",
  totalValue: "",
  comments: "",
};
