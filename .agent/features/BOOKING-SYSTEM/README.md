# 📅 Booking System - Feature Documentation

**Feature ID:** `booking-system`  
**Status:** 🔲 Not Started  
**Created:** 2026-01-10  
**Last Updated:** 2026-01-10 11:15 SGT  
**Owner:** Stephen Ten

---

## 📋 Overview

Custom booking system for scheduling consultations, demos, and meetings without relying on third-party services like Calendly.

---

## 🗂️ Documentation Structure

```
.agent/features/BOOKING-SYSTEM/
├── README.md                    ← You are here
├── SETUP.md                     ← Installation & configuration
├── CURRENT-STATE.md             ← What's working now
├── ERROR-LOG.md                 ← Bugs fixed with timestamps
├── FUTURE-IMPROVEMENTS.md       ← Roadmap & ideas
└── prompts/                     ← AI prompts (if applicable)
```

---

## 🔧 Planned Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Calendar | Supabase | Availability storage |
| Email | Resend | Confirmations |
| Video | Daily.co / Zoom | Meeting links |
| Reminders | Cron Jobs | Email reminders |

---

## 📊 Planned Features

- [ ] Public booking page
- [ ] Calendar availability management
- [ ] Timezone handling
- [ ] Buffer times between meetings
- [ ] Confirmation emails
- [ ] Reminder emails (24h, 1h)
- [ ] Rescheduling
- [ ] Cancellation with reason
- [ ] Integration with Google Calendar
- [ ] Team availability (multiple hosts)
- [ ] Meeting types (15min, 30min, 60min)

---

## 📆 Meeting Types

1. **Discovery Call** - 15 min, free
2. **Consultation** - 30 min, paid
3. **Strategy Session** - 60 min, paid
4. **Technical Demo** - 30 min, free

---

## 📚 Related Docs

- [Main Project Docs](../../docs/)
- [SEO Engine](../SEO-ENGINE/) (for reference)
- [Client Portal](../CLIENT-PORTAL/)

---

*This feature is not yet started. Documentation will be added as development begins.*
