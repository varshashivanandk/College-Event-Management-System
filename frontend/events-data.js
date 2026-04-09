/* ============================================================
   events-data.js  — Single source of truth for all CEMS events
   
   TO ADD AN EVENT: add an object to the CEMS_EVENTS array below.
   TO CONNECT TO BACKEND: replace the array assignment with a fetch,
   then call renderEvents(data) with the response.
   ============================================================ */

const CEMS_EVENTS = [
  {
    id:          'hackathon2026',
    title:       'National Level Hackathon 2026',
    category:    'Technical',
    categoryKey: 'tech',
    date:        'March 15, 2026',
    time:        '9:00 AM – 9:00 PM',
    venue:       'Innovation Lab, Block C',
    desc:        'Build, innovate, and compete in a 12-hour hackathon. Open to all CSE, ISE, and ECE students. Form teams of 2–4 and create solutions for real-world problems.',
    spots:       34,
    featured:    true,
    full:        false,
  },
  {
    id:          'cultural-fest-2026',
    title:       'Rhythm & Roots — Annual Cultural Fest',
    category:    'Cultural',
    categoryKey: 'cultural',
    date:        'Mar 22, 2026',
    time:        '',
    venue:       'Open Amphitheatre',
    desc:        'Celebrate diversity through music, dance, art, and food at our biggest cultural event of the year.',
    featured:    false,
    full:        false,
  },
  {
    id:          'webdev-bootcamp-2026',
    title:       'Web Dev Bootcamp — Full Stack Crash Course',
    category:    'Technical',
    categoryKey: 'tech',
    date:        'Mar 18, 2026',
    time:        '',
    venue:       'Computer Lab 3',
    desc:        'A hands-on 2-day bootcamp covering React, Node.js, and deployment. Beginner-friendly.',
    featured:    false,
    full:        false,
  },
  {
    id:          'cricket-2026',
    title:       'Inter-Department Cricket Tournament',
    category:    'Sports',
    categoryKey: 'sports',
    date:        'Apr 5, 2026',
    time:        '',
    venue:       'Sports Ground',
    desc:        'The annual cricket showdown between departments. Register your team and compete for the trophy.',
    featured:    false,
    full:        false,
  },
  {
    id:          'ml-workshop-2026',
    title:       'Machine Learning with Python — Workshop',
    category:    'Workshop',
    categoryKey: 'workshop',
    date:        'Mar 25, 2026',
    time:        '',
    venue:       'Seminar Hall B',
    desc:        'Learn the fundamentals of ML, build your first model, and understand data pipelines in one session.',
    featured:    false,
    full:        true,
  },
  {
    id:          'devops-seminar-2026',
    title:       'Cloud Computing & DevOps Seminar',
    category:    'Technical',
    categoryKey: 'tech',
    date:        'Apr 2, 2026',
    time:        '',
    venue:       'Auditorium A',
    desc:        "Industry experts talk CI/CD pipelines, Docker, Kubernetes, and cloud careers. Don't miss it.",
    featured:    false,
    full:        false,
  },
  {
    id:          'photo-exhibition-2026',
    title:       'Photography Exhibition — "Frames of Campus Life"',
    category:    'Cultural',
    categoryKey: 'cultural',
    date:        'Apr 10, 2026',
    time:        '',
    venue:       'Gallery Hall',
    desc:        'Submit your best photographs and have them displayed in the college gallery for a week.',
    featured:    false,
    full:        false,
  },
  {
    id:          'linkedin-masterclass-2026',
    title:       'Resume & LinkedIn Masterclass',
    category:    'Workshop',
    categoryKey: 'workshop',
    date:        'Apr 8, 2026',
    time:        '',
    venue:       'Seminar Hall A',
    desc:        'Placement cell hosts a session on crafting standout resumes and optimizing LinkedIn profiles for recruiters.',
    featured:    false,
    full:        false,
  },
  {
    id:          'tabletennis-2026',
    title:       'Table Tennis Open Championship',
    category:    'Sports',
    categoryKey: 'sports',
    date:        'Apr 12, 2026',
    time:        '',
    venue:       'Indoor Sports Complex',
    desc:        'Singles and doubles table tennis competition open to all students. Prizes for top 3 in each category.',
    featured:    false,
    full:        false,
  },
];

/* ── Helpers ──────────────────────────────────────────────────────────────── */

/** Build the query string for event-register.html */
function buildRegisterUrl(ev) {
  const p = new URLSearchParams({
    id:    ev.id,
    title: ev.title,
    date:  ev.date,
    time:  ev.time  || '',
    venue: ev.venue,
    cat:   ev.category,
  });
  return 'event-register.html?' + p.toString();
}

/** Category label → CSS class suffix */
const CAT_CLASS = {
  Technical: 'tech',
  Cultural:  'cultural',
  Sports:    'sports',
  Workshop:  'workshop',
  Seminar:   'tech',
  Other:     'tech',
};

/** Emoji icon per category */
const CAT_ICON = {
  Technical: '💻',
  Cultural:  '🎭',
  Sports:    '🏅',
  Workshop:  '🛠️',
  Seminar:   '🎤',
  Other:     '📌',
};