# Part 4 — Improvement Opportunities

## Overview

While implementing the Access Management prototype as a functional full-stack application, I identified two areas where relatively small changes could provide meaningful improvements to usability and operational clarity.

---

## Improvement 1 — Clear Request and Provisioning Status

### What I identified

The access request workflow can contain multiple stages:

- Pending Approval
- Approved
- Pending Manual Provisioning
- Completed
- Rejected

Displaying only a single status can make it difficult for an employee to understand exactly where their request currently sits.

### Why it matters

Access management is a process-oriented workflow. Users need visibility into whether an administrator has reviewed their request or whether the request is waiting for an operational provisioning step.

### What I changed

I separated:

- Request status
- Provisioning status

This allows the UI to communicate states such as:

> Approved — Pending Manual Provisioning

rather than presenting an ambiguous status.

### Result

Users and administrators get a clearer understanding of the current workflow state.

---

## Improvement 2 — More Actionable Admin Console

### What I identified

Administrators need to process requests efficiently and understand the overall request queue without opening every individual request.

### Why it matters

An administrative access workflow can become difficult to manage when there are many pending requests.

### What I changed

The Admin Console now provides:

- Total request count
- Pending request count
- Completed request count
- Rejected request count
- Clear Approve action
- Clear Reject action
- Manual provisioning completion action
- Loading states
- Success feedback
- Error feedback

### Result

The administrator can understand the current queue quickly and perform the most important actions directly from the request list.

---

## What I Intentionally Did Not Change

I intentionally avoided adding real integrations with external systems such as:

- Google Workspace provisioning APIs
- Jira provisioning APIs
- Salesforce APIs
- Enterprise identity providers
- Email notification infrastructure

The demo task focuses on demonstrating a complete access-management workflow rather than implementing production integrations with every external provider.

Manual provisioning is therefore simulated inside the application.

This keeps the implementation reliable, testable, and within the expected delivery scope.

---

## Trade-offs

The main trade-off is that provisioning is simulated rather than connected to real enterprise systems.

This was intentional because real provisioning integrations would require:

- Provider-specific credentials
- OAuth configuration
- External API permissions
- Error/retry handling
- Provider-specific business rules

For this demo, implementing a reliable internal workflow provides more value than introducing partially implemented external integrations.