# Deploying to GitHub Pages

The app is a static export (`output: 'export'` in `next.config.mjs`) served from
the root of the custom domain `https://viskar.org`. There is no server: the
browser talks to Firebase directly, and `firestore.rules` is what enforces
access.

`next.config.mjs` deliberately sets **no `basePath`**. A basePath is only right
when the site lives under a project path such as `user.github.io/Viskar`; on a
custom apex domain the site is the root, and a basePath makes every asset URL
404 — which renders the page as unstyled HTML.

## One-time setup

1. **Enable anonymous sign-in.** Firebase console → Authentication → Sign-in
   method → Anonymous → Enable. Students have no password; their identity is an
   anonymous account whose uid is recorded on their student document.
   Email/Password must stay enabled for teachers.

2. **Deploy the security rules.** Nothing else guards the database — the
   privileged service account the API routes used is gone, so until the rules
   are published Firestore denies every read and write with
   `PERMISSION_DENIED`.

   The `Deploy Firestore rules` workflow does this on any push that touches
   `firestore.rules`, and can be run by hand from the Actions tab. It needs one
   secret:

   - `FIREBASE_SERVICE_ACCOUNT` — the full JSON key for a service account with
     the **Firebase Rules Admin** role (`roles/firebaserules.admin`). That one
     role is enough.

   To mint it: Firebase console → Project settings → Service accounts →
   Generate new private key, then grant the role to that account in the Google
   Cloud IAM console and paste the whole JSON file into the secret.

   The workflow runs `scripts/deploy-firestore-rules.mjs`, which calls the
   Firebase Rules API directly rather than going through `firebase-tools`. The
   CLI insists on checking that `firestore.googleapis.com` is enabled before it
   will deploy anything, and that check needs Service Usage permissions that
   have nothing to do with rules — an easy source of 403s that look like rules
   problems but are not.

   The same script runs locally:

   ```
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json node scripts/deploy-firestore-rules.mjs
   ```

3. **Add the build variables.** GitHub → Settings → Secrets and variables →
   Actions → Variables:

   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

   Both ship inside the JavaScript bundle. That is normal for Firebase web
   apps: the API key identifies the project, it does not authorise anything.

4. **Point Pages at Actions.** GitHub → Settings → Pages → Source: GitHub
   Actions.

## Data layout

```
teachers/{uid}                      → { id, email, classCodes[], createdAt }
classes/{CODE}                      → { code, teacherId, createdAt }
classes/{CODE}/students/{studentId} → StudentRecord + authUids[]
content/lessons                     → published curriculum
```

Students live under the class they belong to, so reading a roster requires
knowing the class code — it is part of the document path. `authUids` lists the
anonymous accounts allowed to write that student's progress, capped at five
devices.

Records written before this change sat in a top-level `students` collection
keyed by `classCode`, and used hashed session tokens. They are not readable
under the new rules and will not appear in any class. Delete the old collection
once you have confirmed nothing you care about is in it.

## Leftover credentials

`.env` still holds `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY`. Nothing
reads them anymore. Revoke that service-account key in the Google Cloud console
and drop both lines.
