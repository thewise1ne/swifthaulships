// swifthaul_guard.js
// Protects every page. Works with file://, localhost, and hosted URLs.
// DO NOT include this in: index.html, swifthaul_admin.html, swifthaul_privacy.html, swifthaul_terms.html

(async function () {
  // Get just the filename regardless of protocol (file://, http://, etc.)
  const path = window.location.pathname;
  const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

  // Pages that do NOT need the guard
  const unguarded = ['index.html', 'swifthaul_privacy.html', 'swifthaul_terms.html'];
  if (unguarded.some(p => filename === p || filename === '')) return;

  // Hide page until auth check completes — prevents flash of content
  document.documentElement.style.visibility = 'hidden';

  // Skip guard if Supabase not configured yet
  if (typeof SUPABASE_URL === 'undefined' || SUPABASE_URL.includes('YOUR_PROJECT')) {
    document.documentElement.style.visibility = 'visible';
    return;
  }

  const _sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Check for active session
  const { data: { session } } = await _sb.auth.getSession();

  if (!session) {
    // Not logged in — send to login page
    window.location.replace('index.html');
  } else {
    // Logged in — expose globals for the page to use
    window.__sb  = _sb;
    window.__session = session;
    window.__user    = session.user;
    document.documentElement.style.visibility = 'visible';
  }
})();
