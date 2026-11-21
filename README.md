# FileHub — HTML / CSS Animation Template Update

This update adds a simple title-and-code animation library to the existing FileHub project.

## Admin: publish an animation
1. Open the Admin Panel (`FILEHUB.html`) and sign in with an authorized Firebase admin account.
2. Open **HTML Templates** → **Add Template**.
3. Enter only the animation/template title and paste the HTML or CSS animation code in the single code editor.
4. Click **Live Preview** to test it before publishing.
5. Set **Required Ad Steps** to the number of ad steps users must complete.
6. Set the required number of ad steps. Users must complete every configured ad step before downloading or copying the template.
7. Set status to **Published** and save.

No thumbnail or description is required or shown for these animation templates.

## User: preview first, unlock to download
- Published items appear on the User Panel's **HTML Templates** page as title-only cards.
- The live animation preview appears automatically on the page without requiring a Preview button or unlocking.
- The preview remains available while the download is locked.
- **Download HTML** and **Copy Code** appear only after all required ad steps are completed.
- Downloaded output is a standalone HTML document. HTML fragments and full HTML documents are supported. CSS-only input is previewed with a sample animation element; CSS can target `.animation-preview-item` or the preview stage.
- Signed-in ad-step progress uses `user_file_status/{uid}_{templateId}`; guest progress uses local browser storage.

## Firebase data paths
- `html_templates/{templateId}` — title, required ad-step count and publication status.
- `html_template_sources/{templateId}` — `code` (new single-field source), with legacy `html_code` / `css_code` fields still readable for existing templates.

## Important security notes
- The preview is rendered in a sandboxed iframe. Treat HTML/CSS/JavaScript as untrusted content.
- A browser preview necessarily sends source code to the user's browser. This gates the normal download/copy buttons but cannot prevent a technically capable visitor from inspecting source delivered for preview.
- The current ad-step mechanism is the existing FileHub direct-link + timer flow. A timer alone is not independent proof that an ad network counted a valid view. Strong verification and private source protection require trusted backend validation and restrictive Firebase Realtime Database Security Rules.

## Deploy
Deploy the updated project files using your existing Vercel/GitHub setup. No new npm package is required.

## Automatic animation previews
Published HTML/CSS animation templates now render their live preview directly on the User Panel `/templates` page. Users do not need to press a Preview button. The preview iframe is sandboxed and lazy-loaded; the separate Unlock / Download action still enforces the configured ad-step requirement before enabling download/copy.
