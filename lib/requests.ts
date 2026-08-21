export type AccessRequest = {
  id: string;
  access: string;
  status:
    | "Pending Approval"
    | "Completed"
    | "Pending Manual Provisioning"
    | "Provisioned";
  type: "Automated" | "Manual";
};

export const initialRequests: AccessRequest[] = [
  {
    id: "NAR-1005",
    access: "Salesforce – Sales Operations",
    status: "Pending Approval",
    type: "Automated",
  },
  {
    id: "NAR-1004",
    access: "Monday.com – Marketing Operations",
    status: "Completed",
    type: "Automated",
  },
  {
    id: "NAR-1003",
    access: "Zendesk – Customer Support Queue",
    status: "Pending Manual Provisioning",
    type: "Manual",
  },
];