# AST Studio — System Architecture Overview

This document provides a high-level reference for Copilot inside VS Code.  
It describes the major domains, boundaries, and data flows in AST Studio.

---

## Core Domains

### 1. Studio (Artist Tools)
- Supplies
- Projects
- Artwork
- Clients
- Sessions
- Inventory logs
- Exhibitions
- Media uploads

### 2. Main Social (Adults / General Users)
- Social rooms
- Posts
- Comments
- Likes
- Image-only media
- Reports
- Trends

### 3. Minors’ Social (Protected Space)
- Minor profiles
- Skill-based rooms
- Posts
- Safe uploads
- Showcase entries
- Parent approvals
- Parent dashboard settings

### 4. AI Moderation
- Moderator events
- Decisions
- Redirects
- Trend filtering

### 5. Safety & Compliance
- Safety rules
- Violations
- Actions
- Audits

---

## Architectural Principles

- **Image-only social** for all users  
- **Strict safety** for minors  
- **Parent-controlled access**  
- **AI moderation** before content is visible  
- **Append-only logs** for compliance  
- **Soft deletes** for user-generated content  
- **Future-split ready** (Studio, Social, Minors, Moderation)

---

## Amplify Gen 2 Integration

- GraphQL models with `@model`, `@auth`, `@index`
- S3 storage for media
- Lambda functions for moderation + parent digests
- Owner-based access control
- Admin override group

---

## Folder Structure (Recommended)


This file is intentionally short so Copilot can load it quickly.