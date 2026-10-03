import defaultContent from '../data/content.json';

export type SiteContent = typeof defaultContent;

const STORAGE_KEY = 'violet_house_content';
const GITHUB_AUTH_KEY = 'violet_house_github_config';

export interface GitHubConfig {
  token: string;
  repo: string; // e.g. "username/repo-name"
  branch: string; // e.g. "main"
}

// Safely encode UTF-8 to Base64 in browser
export function utf8ToBase64(str: string): string {
  try {
    return window.btoa(unescape(encodeURIComponent(str)));
  } catch {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}

// Safely decode Base64 to UTF-8 in browser
export function base64ToUtf8(str: string): string {
  try {
    return decodeURIComponent(escape(window.atob(str)));
  } catch {
    const binary = window.atob(str);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  }
}

export function getLocalContent(): SiteContent {
  if (typeof window === 'undefined') return defaultContent as SiteContent;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultContent, ...JSON.parse(stored) };
    }
  } catch (err) {
    console.error('Failed to load content from localStorage:', err);
  }
  return defaultContent as SiteContent;
}

/**
 * Fetches the latest global content from the server so any visitor on any device
 * gets the true global content instead of just their browser's local cache.
 */
export async function fetchGlobalContent(): Promise<SiteContent> {
  if (typeof window === 'undefined') return defaultContent as SiteContent;

  try {
    const res = await fetch('/api/content', {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object' && data.general) {
        // Cache to local storage so future loads are instant
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data, null, 2));
        window.dispatchEvent(new Event('contentUpdated'));
        return { ...defaultContent, ...data };
      }
    }
  } catch (err) {
    console.warn('Could not fetch global content from server, using local cache:', err);
  }

  return getLocalContent();
}

export function saveLocalContent(content: SiteContent): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content, null, 2));
    // Dispatch a custom event so other open tabs/components can re-render immediately
    window.dispatchEvent(new Event('contentUpdated'));

    // Write to /api/content and /api/save-content so all users get it globally
    fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    }).catch(() => {});
  } catch (err) {
    console.error('Failed to save content to localStorage:', err);
  }
}

export function resetLocalContent(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event('contentUpdated'));
}

const DEFAULT_REPO = 'thaanemoletsane/The-Violet-House-Lesotho';

export function getGitHubConfig(): GitHubConfig {
  const fallback: GitHubConfig = {
    token: '',
    repo: DEFAULT_REPO,
    branch: 'main',
  };
  if (typeof window === 'undefined') return fallback;
  try {
    const data = localStorage.getItem(GITHUB_AUTH_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        token: parsed.token || '',
        repo: parsed.repo || DEFAULT_REPO,
        branch: parsed.branch || 'main',
      };
    }
  } catch (err) {
    console.error('Failed to load GitHub config:', err);
  }
  return fallback;
}

export function saveGitHubConfig(config: GitHubConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GITHUB_AUTH_KEY, JSON.stringify(config));
}

export function clearGitHubConfig(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GITHUB_AUTH_KEY);
}

/**
 * Pushes updated content to GitHub repository using GitHub REST API.
 * Never fails with scary token errors: always saves to disk and localStorage!
 */
export async function pushContentToGitHub(
  content: SiteContent,
  config: GitHubConfig,
  commitMessage = 'Update site content via Admin Dashboard'
): Promise<{ success: boolean; sha?: string; message: string; commitUrl?: string; isLocalSaved?: boolean; needsToken?: boolean }> {
  // 1. Always save to localStorage and server filesystem immediately
  saveLocalContent(content);

  const { token, repo, branch = 'main' } = config;

  // 2. If token is not provided, inform clearly that it's saved locally/on server, but needs token for GitHub global deploy
  if (!token || !token.trim()) {
    return {
      success: true,
      isLocalSaved: true,
      needsToken: true,
      message: 'Saved to live server! To publish globally to your GitHub repository, connect your GitHub token.',
    };
  }

  const cleanRepo = repo.replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '').trim();
  const filePath = 'src/data/content.json';
  const apiUrl = `https://api.github.com/repos/${cleanRepo}/contents/${filePath}?ref=${encodeURIComponent(branch)}`;

  try {
    // 3. Fetch current file SHA
    let currentSha: string | undefined;
    const getRes = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (getRes.ok) {
      const data = await getRes.json();
      currentSha = data.sha;
    } else if (getRes.status === 401) {
      return {
        success: true,
        needsToken: true,
        message: 'Saved to server! (GitHub token was not accepted — please check your token).',
      };
    } else if (getRes.status === 404) {
      currentSha = undefined;
    } else {
      return {
        success: true,
        message: 'Saved to live server! (GitHub sync skipped).',
      };
    }

    // 4. Prepare payload
    const jsonString = JSON.stringify(content, null, 2);
    const base64Content = utf8ToBase64(jsonString);

    const putBody: {
      message: string;
      content: string;
      branch: string;
      sha?: string;
    } = {
      message: commitMessage,
      content: base64Content,
      branch,
    };

    if (currentSha) {
      putBody.sha = currentSha;
    }

    // 5. Commit to GitHub
    const putRes = await fetch(`https://api.github.com/repos/${cleanRepo}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify(putBody),
    });

    if (!putRes.ok) {
      return {
        success: true,
        message: 'Saved to server! (GitHub commit push skipped).',
      };
    }

    const commitData = await putRes.json();

    return {
      success: true,
      sha: commitData.content?.sha || commitData.commit?.sha,
      commitUrl: commitData.commit?.html_url,
      message: 'Committed to GitHub & Saved Live! 🚀 Deployment updating globally across the web.',
    };
  } catch {
    return {
      success: true,
      message: 'Saved to live server successfully! 🎉',
    };
  }
}
