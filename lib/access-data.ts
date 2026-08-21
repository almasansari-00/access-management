export type AccessItem = {
  id: string;
  tool: string;
  name: string;
  category: string;
  description: string;
  automation: "Automated" | "Manual";
  approver: string;
  group: string;
};

export const accessItems: AccessItem[] = [
  {
    id: "ACC-001",
    tool: "Salesforce",
    name: "Sales Operations",
    category: "CRM",
    description:
      "Access to Salesforce Sales Operations resources for managing customer and sales workflows.",
    automation: "Automated",
    approver: "Sales Operations Board",
    group: "Sales",
  },
  {
    id: "ACC-002",
    tool: "Monday.com",
    name: "Marketing Operations",
    category: "Project Management",
    description:
      "Access to the Marketing Operations board for campaigns, tasks, and team collaboration.",
    automation: "Automated",
    approver: "Marketing Board",
    group: "Marketing",
  },
  {
    id: "ACC-003",
    tool: "Zendesk",
    name: "Customer Support Queue",
    category: "Customer Support",
    description:
      "Access to customer support tickets, queues, and support workflows.",
    automation: "Manual",
    approver: "Customer Support Board",
    group: "Customer Support",
  },
  {
    id: "ACC-004",
    tool: "Monday.com",
    name: "Product Roadmap Board",
    category: "Product",
    description:
      "Access to the Product Roadmap board for product planning and delivery tracking.",
    automation: "Manual",
    approver: "Product Board",
    group: "Product",
  },
  {
    id: "ACC-005",
    tool: "Google Workspace",
    name: "Shared Drive",
    category: "Collaboration",
    description:
      "Access to shared team documents and company collaboration resources.",
    automation: "Automated",
    approver: "IT Board",
    group: "All Employees",
  },
  {
    id: "ACC-006",
    tool: "Jira",
    name: "Engineering Projects",
    category: "Development",
    description:
      "Access to engineering projects, issues, sprint boards, and development workflows.",
    automation: "Manual",
    approver: "Engineering Board",
    group: "Engineering",
  },
];