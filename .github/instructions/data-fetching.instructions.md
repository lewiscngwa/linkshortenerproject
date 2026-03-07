---
description: Read this document to understand the data fetching patterns and conventions used in this project. This includes how to fetch data from APIs, databases, and other sources while adhering to the project's guidelines.
---

# Data Fetching Conventions
This document outlines the conventions and best practices for fetching data in this Next.jsproject. It covers how to interact with APIs, databases, and other data sources while following the project's guidelines.

## Use Server Components for Data Fetching
In Next.js, ALWAYS use Server Components for data fetching. NEVER use Client Components for this purpose. This allows you to fetch data on the server side and send only the necessary data to the client, improving performance and reducing the amount of JavaScript sent to the browser.

## Data Fetching Methods
- ALWAYS use helper functions in /data directory for fetching data from APIs or databases. This promotes code reuse and keeps your components clean. NEVER fetch data directly in your components.
- ALL helper functions in the /data directory should use Drizzle ORM for database interactions. This ensures consistency and leverages the benefits of using an ORM.