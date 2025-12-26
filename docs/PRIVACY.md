# FocusShield Privacy & Data Policy

## Core Principle
**Your personal data stays personal.** FocusShield is designed to extract *insights*, not *content*. We do not store meeting subjects, bodies, or attendee lists in a readable format.

## Data Stored
We store minimal metadata required to generate insights.

| Data Point | Storage Format | Reason |
| :--- | :--- | :--- |
| **User ID** | Plaintext (Microsoft ID) | Account identification. |
| **Event IDs** | **Hashed** (SHA-256) | Deduplication & updates. |
| **Organizer** | **Hashed** (SHA-256) | Grouping recurring meetings without storing emails. |
| **Start/End** | Timestamp | Duration calculation. |
| **Attendee Count**| Integer | "Meeting Cost" calculation. |
| **Recurring?** | Boolean | Recurring meeting identification. |

## Data NOT Stored
- ❌ **Meeting Subject**: We never store the title of your meetings.
- ❌ **Meeting Body/Description**: We never read or store the content.
- ❌ **Attendee Emails/Names**: We only store the *count* of attendees, not who they are.

## Data Retention
- **Policy**: Data is retained for **8 weeks** by default to allow for "Recent Trends" analysis.
- **Cleanup**: A background job automatically deletes data older than the retention period.
- **User Control**: You can delete all your stored data instantly via the `/privacy` page.

## Export
You have the right to access your data. The `/privacy` page allows you to download a JSON export of all data stored against your user ID.
