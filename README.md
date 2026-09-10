# Yacht Match Product Review

Interactive trilingual product-review page for Yacht Match.

## Languages
- English
- Italian
- Persian (RTL)

## Current comments behavior
Comments are intentionally local/demo-only and are stored in the viewer's browser with `localStorage`. They are not shared between users yet.

## Deployment
The project is a static site and can be deployed directly to Vercel. The entry point is `index.html`.

## Future Firebase integration
The current comment UI is designed so the storage layer can later be replaced with Firebase Firestore for shared team comments. Firebase Authentication can also be added later for user identity, edit/delete permissions, replies, and other collaboration features.
