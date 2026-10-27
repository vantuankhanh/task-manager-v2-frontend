export interface IEmployeeModel {
  no?: number;
  id?: string;
  email: string;
  name: string;
  phoneNumber: string;
  address?: string;
  role?: number;
  password?: string;
  status?: boolean;
  // Signed in at least once through VTK IAM: the email then comes from the
  // IAM and the owner can no longer change it.
  isLinkedToIam?: boolean;
}
