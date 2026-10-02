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

export function saveLocalContent(content: SiteContent): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content, null, 2));
    // Dispatch a custom event so other open tabs/components can re-render immediately
    window.dispatchEvent(new Event('contentUpdated'));
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
 * Pushes updated content to GitHub repository using GitHub REST API
 */
export async function pushContentToGitHub(
  content: SiteContent,
  config: GitHubConfig,
  commitMessage = 'Update site content via Admin Dashboard'
): Promise<{ success: boolean; sha?: string; message: string; commitUrl?: string }> {
  const { token, repo, branch = 'main' } = config;
  const cleanRepo = repo.replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '').trim();
  const filePath = 'src/data/content.json';
  const apiUrl = `https://api.github.com/repos/${cleanRepo}/contents/${filePath}?ref=${encodeURIComponent(branch)}`;

  try {
    // 1. Fetch current file SHA
    let currentSha: string | undefined;
    const getRes = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (getRes.ok) {
      const data = await getRes.json();
      currentSha = data.sha;
    } else if (getRes.status === 401) {
      return { success: false, message: 'Invalid GitHub Token. Please verify token permissions (repo scope).' };
    } else if (getRes.status === 404) {
      // File does not exist yet; will be created
      currentSha = undefined;
    } else {
      const err = await getRes.json().catch(() => ({}));
      return { success: false, message: err.message || `Failed to fetch repository (${getRes.status})` };
    }

    // 2. Prepare payload
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

    // 3. Commit to GitHub
    const putRes = await fetch(`https://api.github.com/repos/${cleanRepo}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify(putBody),
    });

    if (!putRes.ok) {
      const err = await putRes.json().catch(() => ({}));
      return {
        success: false,
        message: err.message || `GitHub commit failed (${putRes.status}): ${putRes.statusText}`,
      };
    }

    const commitData = await putRes.json();
    
    // Also update local cache so dashboard and landing page are in sync
    saveLocalContent(content);

    return {
      success: true,
      sha: commitData.content?.sha || commitData.commit?.sha,
      commitUrl: commitData.commit?.html_url,
      message: 'Successfully committed to GitHub! Deployment typically updates within ~30 seconds.',
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: `Network or API error: ${msg}` };
  }
}
