# Wasteland Chronicles

A Jeopardy-style trivia game built with Phaser — a class project.

This guide walks you through getting the game running on your own
computer so you can edit it. You'll install a few free programs,
download a copy of this code, and start the game in your browser. It
takes about 15 minutes.

## What you need

- A Mac or Windows PC
- An internet connection
- About 1 GB of free space

## Step 1: Install Visual Studio Code

VS Code is the text editor you'll use to edit the game's code.

1. Go to [code.visualstudio.com](https://code.visualstudio.com).
2. Click the big blue **Download** button. The site detects whether
   you're on Mac or Windows automatically.

   <!-- ![The VS Code download page with the blue Download button](docs/screenshots/01-vscode-download.png) -->

3. When the download finishes, open your **Downloads** folder.
   - **Mac:** double-click the `.zip` file, then drag the
     **Visual Studio Code** app into your **Applications** folder.
   - **Windows:** double-click the `.exe` file and click **Next**
     through the installer. The default options are fine.
4. Open **Visual Studio Code**. On Mac, the first launch may warn that
   it was downloaded from the internet — click **Open**.

## Step 2: Install Node.js

Node.js is a tool that runs JavaScript outside the browser. You need it
because `yarn` (next step) is installed through Node.

1. Go to [nodejs.org](https://nodejs.org).
2. Click the green **LTS** download button (LTS means "Long Term
   Support" — the stable version).

   <!-- ![The Node.js home page with the LTS download button](docs/screenshots/02-node-download.png) -->

3. Open the downloaded file (`.pkg` on Mac, `.msi` on Windows) and
   click through the installer. The default options are fine.

## Step 3: Install yarn

yarn downloads the libraries this project depends on.

1. Open **Visual Studio Code**.
2. In the menu bar at the top of the screen, click **Terminal**, then
   **New Terminal**. A panel opens at the bottom of the window — this is
   where you type commands. (On Windows it may say **PowerShell** —
   that's fine.)

   Note: when these steps say press **Enter**, Mac keyboards label that
   key **Return**.
3. Type this and press **Enter**:

   ```
   npm install --global yarn
   ```

4. Check that it worked — type this and press **Enter**:

   ```
   yarn --version
   ```

   You should see a version number like `1.22.22`. If you see
   "command not found" (Mac) or "is not recognized" (Windows) instead,
   quit VS Code completely and reopen it, then try again.

## Step 4: Install git

git is the tool that downloads code from GitHub.

- **Mac:** git is usually built in. In the VS Code terminal, type
  `git --version` and press **Enter**. If you see a version number,
  you're done. If a window pops up asking to install "command line
  developer tools," click **Install** and wait for it to finish.
- **Windows:** go to
  [git-scm.com/download/win](https://git-scm.com/download/win) — the
  download starts automatically. Run the installer and click **Next**
  through every page; the defaults are all fine. Then open a **new**
  VS Code terminal and check with `git --version`.

  <!-- ![The Git for Windows download page](docs/screenshots/03-git-windows-download.png) -->

## Step 5: Copy the project address

You're reading this on the project's GitHub page — perfect, stay here.

1. Near the top of this page, click the green **<> Code** button.
2. In the box that opens, make sure the **HTTPS** tab is selected.
3. Click the **copy button** to the right of the URL — it looks like
   two overlapping squares. The address is now copied.

   <!-- ![The green Code button open to the HTTPS tab, with the copy button highlighted](docs/screenshots/04-github-code-button.png) -->

## Step 6: Download the code (clone)

1. Switch to **Visual Studio Code**.
2. On the Welcome tab, click **Clone Git Repository…**
   (If you don't see it: press **Ctrl+Shift+P** — **Cmd+Shift+P** on
   Mac — type `Git: Clone`, and press **Enter**.)

   <!-- ![VS Code's Clone Git Repository option](docs/screenshots/05-vscode-clone.png) -->

3. A box appears at the top of the window. **Paste** the address you
   copied (**Ctrl+V**, or **Cmd+V** on Mac) and press **Enter**.
4. VS Code asks where to save the project. Pick your **Documents**
   folder and click **Select Repository Location**.
5. When it finishes, click **Open** in the popup at the bottom right.

   <!-- ![The Open button after cloning finishes](docs/screenshots/06-vscode-open.png) -->

You now have your own copy of the game code.

## Step 7: Install the project's libraries

1. In VS Code, open a terminal again: **Terminal** menu →
   **New Terminal**.
2. Type this and press **Enter**:

   ```
   yarn install
   ```

3. Wait until it says `Done`. This only needs to happen once (and again
   if the project's library list ever changes).

## Step 8: Run the game

1. In the terminal, type this and press **Enter**:

   ```
   yarn dev
   ```

2. Wait a few seconds, then open your browser and go to:

   **http://localhost:8080**

   <!-- ![The game running in a browser at localhost:8080](docs/screenshots/07-game-running.png) -->

3. You should see the game menu. Click to start playing!
4. To stop the server later, click in the terminal and press
   **Ctrl+C**.

## Step 9: Start editing

All the game code lives in the **`src`** folder (see it in VS Code's
left sidebar):

- **`src/00_libraries/00_ui/`** — reusable UI pieces (labels, buttons, inputs)
- **`src/01_global/`** — shared helpers and settings everything else uses
- **`src/02_config/`** — colors, fonts, sizes, and game settings
- **`src/03_data/data.js`** — the trivia questions and answers
- **`src/10_scenes/`** — the code that draws each screen
- **`src/main.js`** — the entry file that starts the game

The folders are numbered because the files load in alphabetical order —
numbers control which code runs first. The one exception is `main.js`,
the entry file, which the runner always loads last.

Try it: open `src/03_data/data.js`, change the text of one question, save
the file (**Ctrl+S**, or **Cmd+S** on Mac), and refresh your browser. Your
change is live.

## Something went wrong?

- **"command not found" or "is not recognized"** — quit and reopen
  VS Code, then retry. Newly installed tools aren't visible to
  terminals that were already open.
- **"Port 8080 is in use"** — the game is already running in another
  terminal. Find it and press **Ctrl+C**, or just use the one that's
  running.
- **Stuck anywhere else** — take a screenshot of the error and ask for
  help. Errors are normal; everyone hits them.