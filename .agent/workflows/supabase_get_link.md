---
description: How to obtain Supabase project URL and anon public API key (link code) step‑by‑step
---

## Supabase Link Code Retrieval – Step by Step

1. **Sign‑in to Supabase**
   - Open your browser and go to **https://app.supabase.com**.
   - Log in with your email/password or GitHub account.

2. **Select (or create) your project**
   - On the dashboard you will see a list of projects.
   - Click the project you want to use for *My Art Web*.
   - If you don’t have a project yet, click **"New project"**, fill in the required fields (project name, password, region) and wait for the provisioning to finish.

3. **Navigate to Project Settings**
   - In the left‑hand navigation pane, click **"Settings"** → **"API"**.

4. **Copy the **`Project URL`**
   - Under the **"Project URL"** section you will see a URL that looks like:
     ```
     https://your-project-id.supabase.co
     ```
   - Click the **copy** icon next to it. This is the **Supabase link** you will use in your front‑end code.

5. **Copy the **`anon public`** API key**
   - Still on the **API** page, scroll down to **"API Keys"**.
   - Locate the **"anon public"** key (it is a long alphanumeric string).
   - Click the **copy** icon next to it. This is the **public API key** (sometimes called the “link code”).

6. **Add them to your project’s environment**
   - Open the file `server/.env` in your project.
   - Add the following lines (replace the placeholders with the values you just copied):
     ```
     VITE_SUPABASE_URL=https://your-project-id.supabase.co
     VITE_SUPABASE_ANON_KEY=your‑anon‑public‑key‑here
     ```
   - Save the file.

7. **Install Supabase client (if not already installed)**
   ```bash
   npm install @supabase/supabase-js
   ```

8. **Create a client wrapper (optional but recommended)**
   - Create a file `src/lib/supabaseClient.js` with:
     ```javascript
     import { createClient } from '@supabase/supabase-js';

     const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
     const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

     export const supabase = createClient(supabaseUrl, supabaseAnonKey);
     ```
   - Now you can import `supabase` anywhere in your React code.

9. **Test the connection**
   - In a component or a temporary script, run a simple query:
     ```javascript
     const { data, error } = await supabase.from('your_table').select('*');
     console.log(data, error);
     ```
   - If you see data (or an empty array) and no error, the link code is working!

---

**Tip:** Keep the `.env` file out of version control (add it to `.gitignore`). If you need to share the keys with teammates, use Supabase’s **Project Settings → API → Service Role** key for server‑side usage, but never expose the service role key in the front‑end.
