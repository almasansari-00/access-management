# New Age — Access Management

A full-stack Access Management application that enables employees to discover available resources, submit access requests, track request status, and allows administrators to review and manage access provisioning workflows.

Built as part of the Intern Full-Stack Developer Demo Task.

## Live Demo

https://access-management-rust.vercel.app/

## Repository

https://github.com/almasansari-00/access-management

## Overview

New Age Access Management provides a centralized workflow for managing access to internal applications, tools, boards, and collaboration resources.

The application supports:

- Employee authentication
- Access discovery and search
- Access detail views
- Access requests for self or another employee
- Request tracking
- Administrative approval and rejection
- Automated provisioning simulation
- Manual provisioning simulation
- Persistent application data

## Core Workflow

### Employee Flow

1. Create an account
2. Sign in
3. Browse the Access Directory
4. Search for an application or resource
5. Open access details
6. Submit an access request
7. Track request status

### Admin Flow

1. Open the Admin Console
2. Review pending requests
3. Approve or reject requests
4. Handle provisioning
5. Complete manual provisioning when required

### Provisioning

Automated access:

Pending Approval
→ Completed

Manual access:

Pending Approval
→ Pending Manual Provisioning
→ Completed

## Features

### Authentication

- Sign up
- Login
- Logout
- Persistent Supabase authentication session
- Email confirmation support
- Profile creation

### Access Directory

- Available applications and resources
- Search functionality
- Categories
- Automated/manual provisioning labels
- Approver information
- Access detail pages

### Access Requests

Users can request access:

- For themselves
- On behalf of another employee

Each request stores:

- Requester
- Requested employee
- Access resource
- Business reason
- Request status
- Provisioning status
- Creation timestamp
- Updated timestamp

### Administration

Administrators can:

- View access requests
- Approve requests
- Reject requests
- Complete manual provisioning
- Monitor request status

### Data Persistence

Application data is persisted using Supabase PostgreSQL.

Supabase Authentication is used for user identity and sessions.

## Technology Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- Lucide React
- Vercel

## Project Structure

```text
access-management/
├── app/
│   ├── admin/
│   ├── access/
│   ├── dashboard/
│   ├── login/
│   ├── requests/
│   ├── signup/
│   └── page.tsx
│
├── lib/
│   └── supabase-browser.ts
│
├── public/
│
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json