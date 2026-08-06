# OM Value Sales Hub

📄 Product Requirements Document (PRD)

OM Value Homes CRM (Internal Use)

Version: 1.0 (MVP)
Product Type: Mobile-First Web App (PWA)
Prepared For: OM Value Homes

1. Product Overview

Purpose

OM Value Homes CRM is an internal, mobile-first CRM designed to manage real estate leads, follow-ups, site visits, bookings, and daily sales activities from one place.

The goal is to eliminate Excel sheets, reduce missed follow-ups, and give every sales executive a fast, simple tool that works perfectly on mobile.

2. Goals

Store every lead in one place

Never miss a follow-up

Track complete customer history

Schedule site visits

Track bookings

Generate daily reports

Mobile-first experience

Fast & simple interface

3. Target Users

Admin

Complete access.

Sales Manager

Manage employees and reports.

Sales Executive

Manage leads, follow-ups, visits and bookings.

4. Platform

Mobile First

Desktop Responsive

Progressive Web App (PWA)

5. Technology

Frontend

Next.js 16

React

TypeScript

UI

TailwindCSS

shadcn/ui

Backend

Supabase

Database

PostgreSQL

Authentication

Supabase Auth

Hosting

Vercel

Storage

Supabase Storage

6. Modules

Module 1 — Login

Features

Email Login

Password Login

Forgot Password

Secure Authentication

Session Management

Module 2 — Dashboard

Widgets

Today's Leads

Today's Follow-ups

Missed Follow-ups

Today's Site Visits

Bookings

Recent Activity

Quick Add Lead

Module 3 — Lead Management

Create Lead

Fields

Customer Name

Mobile Number

Alternate Number

Email

Budget

Configuration

Lead Source

Priority

Status

Assigned Executive

Notes

Features

Add Lead

Edit Lead

Delete Lead

Duplicate Number Detection

Search

Filter

Sort

Lead Timeline

Quick Call

Quick WhatsApp

Google Maps

Lead Status

New

Contacted

Interested

Follow-up

Site Visit Scheduled

Visited

Negotiation

Booked

Lost

Hold

Lead Source

Facebook

Instagram

Google

WhatsApp

Walk-in

Reference

Property Portal

Others

Priority

High

Medium

Low

Module 4 — Follow-up

Features

Today's Follow-up

Upcoming

Overdue

Completed

Reschedule

Call Outcome

Notes

Reminder

History

Follow-up Status

Pending

Completed

Missed

Rescheduled

Module 5 — Site Visit

Features

Schedule Visit

Visit Date

Visit Time

Executive

Maps Navigation

Feedback

Interested Unit

Next Action

Visit Status

Visit Status

Scheduled

Completed

Cancelled

No Show

Module 6 — Booking

Features

Booking Date

Customer

Unit Number

Booking Amount

Payment Status

Agreement Status

Document Upload

Booking Timeline

Payment Status

Pending

Partial

Completed

Cancelled

Module 7 — Reports

Reports

Daily Leads

Daily Follow-up

Site Visit Report

Booking Report

Executive Performance

Lead Source Report

Conversion Report

Monthly Summary

Export

Excel

PDF

Module 8 — Settings

Masters

Lead Sources

Lead Status

Priority

Configurations

Employees

Company Details

Backup

7. Mobile Navigation

Bottom Navigation

Dashboard

Leads

Follow-up

Settings

8. Lead Detail Screen

Customer Information

↓

Timeline

↓

Notes

↓

Follow-up History

↓

Site Visit History

↓

Booking Information

↓

Quick Actions

Call

WhatsApp

Edit

Maps

9. Search

Global Search

By Name

By Mobile

By Status

By Source

By Executive

10. Notifications

Follow-up Reminder

Overdue Reminder

Site Visit Reminder

Booking Reminder

11. User Roles

Admin

Everything

Sales Manager

Manage Team

Reports

Leads

Bookings

Sales Executive

Own Leads

Follow-up

Visits

Bookings

12. Dashboard KPIs

Total Leads

Today's Leads

Active Leads

Today's Follow-ups

Missed Follow-ups

Today's Visits

Bookings

Conversion Rate

13. Database Tables

Users

Leads

Lead Notes

Follow-ups

Site Visits

Bookings

Projects

Units

Settings

Activity Logs

14. Security

Authentication

Role Based Access

Encrypted Passwords

Daily Backup

Audit Logs

15. Performance

Page Load < 2 Seconds

Mobile Optimized

Responsive Design

Fast Search

Offline Draft Support

16. UI Guidelines

Theme

Blue

White

Light Grey

Rounded Cards

Large Buttons

One Hand Usage

Touch Friendly

Material Design

Dark Mode

17. Future Scope (Version 2)

Inventory Management

Flat Availability

Document Management

Push Notifications

Calendar View

Lead Import (Excel)

Customer Document Storage

Employee Attendance

18. Future Scope (Version 3)

AI Lead Summary

Voice Notes

Speech-to-Text

Advanced Analytics

Automatic Daily Reports

Predictive Lead Scoring

✅ MVP Scope (Version 1)

Login & Authentication

Dashboard

Lead Management

Follow-up Management

Site Visit Management

Booking Management

Reports (Excel/PDF)

Settings

Mobile-First PWA

One-tap Call, WhatsApp & Google Maps

Duplicate Lead Detection

Activity Timeline

🎯 Success Metrics

100% of new leads entered into the CRM.

0 missed follow-ups due to reminder tracking.

Every site visit and booking recorded digitally.

Daily reports generated in under 30 seconds.

Mobile workflow optimized so common actions (Call, WhatsApp, Add Follow-up) take no more than 2 taps.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c51c75f6-98d6-48a9-ae41-7b394c42a847).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
