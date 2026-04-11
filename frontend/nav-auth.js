/* nav-auth.js — include on every page, call applyNavAuth() after DOM loads */

function applyNavAuth() {

  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;

  // ✅ NOW safe to use navLinks
  const oldUser = navLinks.querySelector('.nav-user');
  if (oldUser) oldUser.remove();

  const oldApprove = navLinks.querySelector('a[href="approve-events.html"]');
  if (oldApprove) oldApprove.remove();

  const role = sessionStorage.getItem('cemsRole');
  const user = sessionStorage.getItem('cemsUser');

  const signInLink  = navLinks.querySelector('a[href="login.html"]');
  const getStarted  = navLinks.querySelector('a[href="register.html"].nav-cta');
  const createEvent = navLinks.querySelector('a[href="create-event.html"]');

  if (role && user) {
    // ── Logged in ──────────────────────────────────────────────────────────
    // Hide sign-in and get-started
    if (signInLink) signInLink.style.display = 'none';
    if (getStarted) getStarted.style.display = 'none';

    // Show/hide Create Event based on role
    if (createEvent) {
      createEvent.style.display = (role === 'coordinator') ? '' : 'none';
    }

    // Show/hide Approve Events link for faculty
    let approveLink = navLinks.querySelector('a[href="approve-events.html"]');
    if (role === 'faculty') {
      if (!approveLink) {
        approveLink = document.createElement('a');
        approveLink.href = 'approve-events.html';
        approveLink.textContent = '✅ Approve Events';
        approveLink.style.cssText = 'color:rgba(245,243,238,0.65);font-size:0.9rem;font-weight:500;text-decoration:none;transition:color 0.2s;';
        approveLink.onmouseover = () => approveLink.style.color = 'var(--paper)';
        approveLink.onmouseout  = () => approveLink.style.color = 'rgba(245,243,238,0.65)';
        // Insert before any existing .nav-user
        const existing = navLinks.querySelector('.nav-user');
        navLinks.insertBefore(approveLink, existing || null);
      }
    } else if (approveLink) {
      approveLink.style.display = 'none';
    }

    // Inject welcome + sign out if not already there
    if (!navLinks.querySelector('.nav-user')) {
      const welcomeEl = document.createElement('span');
      welcomeEl.className = 'nav-user';
      welcomeEl.style.cssText = `
        font-size: 0.88rem; font-weight: 600; color: var(--paper);
        display: flex; align-items: center; gap: 0.8rem;
      `;

      // Capitalise first letter of name
      const displayName = user.charAt(0).toUpperCase() + user.slice(1);

      welcomeEl.innerHTML = `
        <span style="color:rgba(245,243,238,0.55);font-weight:400">👋 Hi,</span>
        <strong style="color:var(--paper)">${displayName}</strong>
        <a href="#" onclick="signOut(event)"
          style="font-size:0.8rem;color:rgba(245,243,238,0.6);font-weight:500;
                 text-decoration:none;border:1.5px solid rgba(255,255,255,0.18);
                 padding:0.3rem 0.8rem;border-radius:100px;
                 transition:color 0.2s,border-color 0.2s;"
          onmouseover="this.style.color='var(--accent)';this.style.borderColor='var(--accent)'"
          onmouseout="this.style.color='rgba(245,243,238,0.6)';this.style.borderColor='rgba(255,255,255,0.18)'">
          Sign Out
        </a>
      `;
      navLinks.appendChild(welcomeEl);
    }

  } else {
    // ── Guest ──────────────────────────────────────────────────────────────
    if (signInLink) signInLink.style.display = '';
    if (getStarted) getStarted.style.display = '';
    if (createEvent) createEvent.style.display = 'none';
  }
}

function signOut(e) {
  if (e) e.preventDefault();
  sessionStorage.removeItem('cemsRole');
  sessionStorage.removeItem('cemsUser');
  sessionStorage.removeItem('cemsRedirect');
  sessionStorage.removeItem('cemsApprovalState');
  window.location.href = 'index.html';
}

// Auto-run when script loads
document.addEventListener('DOMContentLoaded', applyNavAuth);