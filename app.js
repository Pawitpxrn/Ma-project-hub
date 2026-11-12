'use strict';

/* ==========================================================================
   Modern Web Guidance Compliance Utilities
   ========================================================================== */

function initDialogFallbacks() {
  if ('closedBy' in HTMLDialogElement.prototype) return;
  document.querySelectorAll('dialog[closedby="any"]').forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      const inside =
        r.top <= event.clientY && event.clientY <= r.top + r.height &&
        r.left <= event.clientX && event.clientX <= r.left + r.width;
      if (!inside) dialog.close();
    });
  });
}

const UserInvalidFallback = (() => {
  const dirty = new WeakMap();
  const update = (input) => {
    const ok = input.checkValidity();
    input.classList.toggle('user-invalid-fallback', !ok);
    if (ok) input.removeAttribute('aria-invalid');
    else input.setAttribute('aria-invalid', 'true');
  };
  const handle = (event) => {
    const input = event.target;
    if (event.type === 'reset') {
      for (const control of input.elements || []) {
        dirty.delete(control);
        control.classList.remove('user-invalid-fallback');
        control.removeAttribute('aria-invalid');
      }
      return;
    }
    if (!input || typeof input.checkValidity !== 'function' || !input.required) return;
    const s = dirty.get(input) || { interacted: false, blurred: false };
    if (event.type === 'blur') s.blurred = true;
    else s.interacted = true;
    dirty.set(input, s);
    if (s.interacted && s.blurred) update(input);
  };
  return {
    init(root = document) {
      if (CSS.supports('selector(:user-invalid)')) return;
      root.addEventListener('blur', handle, true);
      root.addEventListener('input', handle);
      root.addEventListener('change', handle);
      root.addEventListener('reset', handle, true);
    }
  };
})();

function initAriaInvalidSync() {
  document.addEventListener('blur', (e) => {
    const el = e.target;
    if (el?.matches?.('[required]')) {
      if (el.checkValidity()) el.removeAttribute('aria-invalid');
      else el.setAttribute('aria-invalid', 'true');
    }
  }, true);
  document.addEventListener('input', (e) => {
    const el = e.target;
    if (el?.matches?.('[required]') && el.checkValidity()) el.removeAttribute('aria-invalid');
  });
}

/* ==========================================================================
   State & Data Models (CuteFlow Workspace: Projects, Boards, Phases & Timeline)
   ========================================================================== */

const STORAGE_KEY = 'cuteflow_workspace_projects_v11';

const AUTOSMART_RECON_PROJECT = {
  id: 'proj_autosmart_recon',
  key: 'RECON',
  name: 'Autosmart Recondition',
  icon: '🚗',
  desc: 'แผนงานพัฒนาและ Go-Live ระบบ RECON (1 Nov – 1 Dec 2026) Baseline schedule โดยทีม MSD & i24',
  phases: [
    {
      id: 'ph_recon_1',
      name: 'Program Development',
      owner: 'MSD',
      start: '2026-11-01',
      end: '2026-11-11',
      color: '#00818A',
      goal: 'พัฒนาโปรแกรมและฟังก์ชันหลักของระบบ RECON โดยทีม MSD'
    },
    {
      id: 'ph_recon_2',
      name: 'Unit Testing',
      owner: 'MSD',
      start: '2026-11-12',
      end: '2026-11-16',
      color: '#00ADB5',
      goal: 'ทดสอบ Unit Testing ภายในทีมพัฒนา MSD ก่อนส่งมอบเข้า UAT'
    },
    {
      id: 'ph_recon_3',
      name: 'UAT Configuration and Setup',
      owner: 'MSD',
      start: '2026-11-17',
      end: '2026-11-17',
      color: '#2EC4B6',
      goal: 'ติดตั้ง Configuration และเตรียมสภาพแวดล้อม UAT Environment'
    },
    {
      id: 'ph_recon_4',
      name: 'UAT Readiness Review',
      owner: 'MSD',
      start: '2026-11-18',
      end: '2026-11-18',
      color: '#FF9F45',
      goal: 'ประชุมรีวิวเกณฑ์ความพร้อมก่อนเริ่มเปิดให้ผู้ใช้งานทดสอบ UAT'
    },
    {
      id: 'ph_recon_5',
      name: 'User Acceptance Testing (UAT)',
      owner: 'i24',
      start: '2026-11-19',
      end: '2026-11-25',
      color: '#7C83FD',
      goal: 'ทีม i24 ดำเนินการทดสอบระบบ RECON ตาม Test Cases และบันทึกผล'
    },
    {
      id: 'ph_recon_6',
      name: 'User Training (UAT Environment)',
      owner: 'MSD & i24',
      start: '2026-11-26',
      end: '2026-11-26',
      color: '#FF87B2',
      goal: 'จัดอบรมการใช้งานระบบจริงให้กับผู้ใช้งานบน UAT Environment'
    },
    {
      id: 'ph_recon_7',
      name: 'Production Configuration and Setup',
      owner: 'MSD',
      start: '2026-11-27',
      end: '2026-11-27',
      color: '#A66CFF',
      goal: 'จัดเตรียม Configuration และระบบบน Production Environment'
    },
    {
      id: 'ph_recon_8',
      name: 'Go-Live',
      owner: 'MSD & i24',
      start: '2026-12-01',
      end: '2026-12-01',
      color: '#E53E3E',
      goal: 'วันเปิดใช้งานระบบจริงอย่างเป็นทางการ (Go-Live Milestone ◆)'
    }
  ],
  tasks: [
    {
      id: 'task_recon_1',
      code: 'RECON-1',
      title: 'Program Development',
      type: 'story',
      status: 'done',
      priority: 'high',
      phaseId: 'ph_recon_1',
      assignee: 'MSD',
      dueDate: '2026-11-11',
      desc: 'พัฒนาโปรแกรมและฟังก์ชันหลักของระบบ RECON (01 Nov – 11 Nov 2026)'
    },
    {
      id: 'task_recon_2',
      code: 'RECON-2',
      title: 'Unit Testing',
      type: 'task',
      status: 'in_progress',
      priority: 'highest',
      phaseId: 'ph_recon_2',
      assignee: 'MSD',
      dueDate: '2026-11-16',
      desc: 'ทดสอบ Unit Testing ภายในทีม MSD (12 Nov – 16 Nov 2026)'
    },
    {
      id: 'task_recon_3',
      code: 'RECON-3',
      title: 'UAT Configuration and Setup',
      type: 'task',
      status: 'todo',
      priority: 'high',
      phaseId: 'ph_recon_3',
      assignee: 'MSD',
      dueDate: '2026-11-17',
      desc: 'ติดตั้งและตั้งค่าระบบบน UAT Environment (17 Nov 2026)'
    },
    {
      id: 'task_recon_4',
      code: 'RECON-4',
      title: 'UAT Readiness Review',
      type: 'task',
      status: 'todo',
      priority: 'medium',
      phaseId: 'ph_recon_4',
      assignee: 'MSD',
      dueDate: '2026-11-18',
      desc: 'ประชุมประเมินความพร้อมก่อนเริ่มเปิดให้ผู้ใช้งานทดสอบ (18 Nov 2026)'
    },
    {
      id: 'task_recon_5',
      code: 'RECON-5',
      title: 'User Acceptance Testing (UAT)',
      type: 'story',
      status: 'todo',
      priority: 'highest',
      phaseId: 'ph_recon_5',
      assignee: 'i24',
      dueDate: '2026-11-25',
      desc: 'ทีม i24 ทำการทดสอบระบบ RECON ตาม Test Cases (19 Nov – 25 Nov 2026)'
    },
    {
      id: 'task_recon_6',
      code: 'RECON-6',
      title: 'User Training (UAT Environment)',
      type: 'task',
      status: 'todo',
      priority: 'high',
      phaseId: 'ph_recon_6',
      assignee: 'MSD & i24',
      dueDate: '2026-11-26',
      desc: 'จัดอบรมผู้ใช้งานบนสภาพแวดล้อม UAT (26 Nov 2026)'
    },
    {
      id: 'task_recon_7',
      code: 'RECON-7',
      title: 'Production Configuration and Setup',
      type: 'task',
      status: 'todo',
      priority: 'highest',
      phaseId: 'ph_recon_7',
      assignee: 'MSD',
      dueDate: '2026-11-27',
      desc: 'เตรียมความพร้อม Production Environment สำหรับการเปิดจริง (27 Nov 2026)'
    },
    {
      id: 'task_recon_8',
      code: 'RECON-8',
      title: 'Go-Live Milestone ◆',
      type: 'story',
      status: 'todo',
      priority: 'highest',
      phaseId: 'ph_recon_8',
      assignee: 'MSD & i24',
      dueDate: '2026-12-01',
      desc: 'เปิดระบบใช้งานจริงอย่างเป็นทางการ (01 Dec 2026)'
    }
  ]
};

const DEFAULT_SAMPLE_STATE = {
  activeProjectId: 'proj_autosmart_recon',
  projects: [
    AUTOSMART_RECON_PROJECT,
    {
      id: 'proj_booking',
      key: 'BKG',
      name: 'ระบบจองห้องประชุม Next-Gen',
      icon: '🌷',
      desc: 'ระบบจองห้องประชุมพร้อมเชื่อมต่อปฏิทิน Google และระบบแอร์ดิจิทัล',
      phases: [
        { id: 'ph_1', name: 'Phase 1: DB & Auth Engine', owner: 'Dev A', start: '2026-11-01', end: '2026-11-12', color: '#7C83FD', goal: 'วางโครงสร้าง Database และระบบสิทธิ์เข้าใช้งาน' },
        { id: 'ph_2', name: 'Phase 2: Booking UI & Calendar', owner: 'Dev B', start: '2026-11-13', end: '2026-11-25', color: '#FF9F45', goal: 'หน้าเลือกห้อง ตารางปฏิทิน และเช็คเวลาชนกัน' },
        { id: 'ph_3', name: 'Phase 3: Hardware Sync & Launch', owner: 'Dev A', start: '2026-11-26', end: '2026-12-10', color: '#6BCB77', goal: 'ต่อคำสั่งเปิดปิดแอร์ผ่าน IoT และขึ้นระบบจริง' }
      ],
      tasks: [
        { id: 'task_1', code: 'BKG-1', title: 'ออกแบบ ER-Diagram สำหรับการจองซ้ำรายสัปดาห์', type: 'story', status: 'done', priority: 'high', phaseId: 'ph_1', assignee: 'Dev A', dueDate: '2026-11-05', desc: 'รองรับการจองแบบ Recurring ทุกวันจันทร์' },
        { id: 'task_2', code: 'BKG-2', title: 'เขียน API ตรวจสอบห้องว่าง (Check Availability)', type: 'task', status: 'in_progress', priority: 'highest', phaseId: 'ph_1', assignee: 'Pawitporn', dueDate: '2026-11-11', desc: 'ต้องป้องกัน Race Condition เวลาจองพร้อมกัน' },
        { id: 'task_3', code: 'BKG-3', title: 'บั๊ก: กดเปลี่ยนเดือนในปฏิทินแล้วเวลาค้าง', type: 'bug', status: 'todo', priority: 'high', phaseId: 'ph_2', assignee: 'Dev B', dueDate: '2026-11-16', desc: 'เกิดเฉพาะตอนเลือก Timezone นอกประเทศไทย' },
        { id: 'task_4', code: 'BKG-4', title: 'ทำหน้า UI สรุปรายการจองของฉัน (My Bookings)', type: 'task', status: 'todo', priority: 'medium', phaseId: 'ph_2', assignee: 'Dev B', dueDate: '2026-11-20', desc: 'มีปุ่มกดยกเลิกและแจ้งเตือนเข้าเมล' },
        { id: 'task_5', code: 'BKG-5', title: 'ติดรอทีม Network เปิดพอร์ต MQTT สำหรับกล่อง IoT', type: 'blocker', status: 'review', priority: 'highest', phaseId: 'ph_3', assignee: 'Dev A', dueDate: '2026-11-28', desc: 'ส่งใบคำขอไปแล้ว รอตอบกลับ' }
      ]
    }
  ]
};

let appState = {
  currentView: 'project', // 'hub' | 'project'
  activeProjectId: 'proj_autosmart_recon',
  activeSubView: 'timeline', // 'board' | 'timeline' | 'phases' | 'settings'
  searchQuery: '',
  selectedPhaseFilter: 'all',
  sidebarCollapsed: false,
  projects: []
};

const SIDEBAR_TOGGLE_BTN = `<button type="button" class="mobile-menu-btn" data-action="toggle-sidebar" title="ซ่อน / แสดงแถบเมนูซ้าย" aria-label="Toggle Navigation Sidebar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="9" y1="3" x2="9" y2="21"/></svg></button>`;

const $ = (id) => document.getElementById(id);
const uid = (prefix = 'id') => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      projects: appState.projects,
      activeProjectId: appState.activeProjectId,
      currentView: appState.currentView,
      activeSubView: appState.activeSubView,
      sidebarCollapsed: !!appState.sidebarCollapsed
    }));
  } catch (err) {
    console.warn('Persist failed', err);
  }
}

function loadState() {
  let loaded = false;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed.projects) && parsed.projects.length > 0) {
        appState.projects = parsed.projects;
        appState.activeProjectId = parsed.activeProjectId || parsed.projects[0].id;
        appState.currentView = parsed.currentView || 'project';
        appState.activeSubView = parsed.activeSubView || 'timeline';
        appState.sidebarCollapsed = !!parsed.sidebarCollapsed;
        loaded = true;
      }
    } catch { /* fallback */ }
  }

  if (!loaded) {
    // Try migrating from v5 or older
    const legacyV5 = localStorage.getItem('cuteflow_workspace_projects_v5');
    if (legacyV5) {
      try {
        const parsed = JSON.parse(legacyV5);
        if (Array.isArray(parsed.projects)) {
          appState.projects = parsed.projects;
          loaded = true;
        }
      } catch { /* fallback */ }
    }
  }

  if (!loaded || !appState.projects.length) {
    appState.projects = structuredClone(DEFAULT_SAMPLE_STATE.projects);
  }

  // Ensure Autosmart Recondition is present and up to date
  const reconIdx = appState.projects.findIndex((p) => p.id === 'proj_autosmart_recon' || p.key === 'RECON' || (p.name && p.name.includes('Autosmart')));
  if (reconIdx === -1) {
    appState.projects.unshift(structuredClone(AUTOSMART_RECON_PROJECT));
  } else {
    // Update existing one with the latest plan
    appState.projects[reconIdx] = structuredClone(AUTOSMART_RECON_PROJECT);
  }

  appState.activeProjectId = 'proj_autosmart_recon';
  appState.currentView = 'project';
  appState.activeSubView = 'timeline';

  persistState();
}

function getActiveProject() {
  return appState.projects.find((p) => p.id === appState.activeProjectId) || appState.projects[0];
}

const TYPE_CONFIG = {
  task: { label: 'TASK', icon: '📝', badgeClass: 'badge-blue' },
  bug: { label: 'BUG', icon: '🍓', badgeClass: 'badge-red' },
  story: { label: 'STORY', icon: '✨', badgeClass: 'badge-green' },
  blocker: { label: 'BLOCKER', icon: '🚧', badgeClass: 'badge-yellow' }
};

const PRIORITY_ICONS = {
  highest: '🔴',
  high: '🟠',
  medium: '🟡',
  low: '🟢'
};

/* ==========================================================================
   Render Orchestration
   ========================================================================== */

function renderApp() {
  const p = getActiveProject();
  const projSidebar = $('projectSidebar');
  const allProjBtn = $('navAllProjectsBtn');

  $('appLayout')?.classList.toggle('sidebar-collapsed', !!appState.sidebarCollapsed);

  if (appState.currentView === 'hub' || !p) {
    projSidebar.style.display = 'none';
    allProjBtn.classList.add('active');
    renderHubView();
    return;
  }

  // Inside Project Context View
  projSidebar.style.display = 'flex';
  allProjBtn.classList.remove('active');

  $('sidebarProjAvatar').textContent = p.icon || '🚗';
  $('sidebarProjTitle').textContent = p.name;
  $('sidebarProjKey').textContent = `${p.key || 'PROJ'} Workspace`;

  // Update active sub-nav item
  document.querySelectorAll('.side-nav-item').forEach((item) => {
    item.classList.toggle('active', item.dataset.subview === appState.activeSubView);
  });

  if (appState.activeSubView === 'board') {
    renderBoardView(p);
  } else if (appState.activeSubView === 'timeline') {
    renderTimelineView(p);
  } else if (appState.activeSubView === 'phases') {
    renderPhasesView(p);
  } else if (appState.activeSubView === 'settings') {
    renderSettingsView(p);
  }
}

/* ==========================================================================
   VIEW 1: Hub (หน้ารวมโปรเจกต์)
   ========================================================================== */

function renderHubView() {
  const container = $('mainWorkspace');
  container.innerHTML = `
    <div class="workspace-top-bar">
      <div style="display: flex; align-items: center; gap: 12px;">
        ${SIDEBAR_TOGGLE_BTN}
        <div>
          <div class="breadcrumbs">Home / All Projects</div>
          <h1 class="workspace-title">Projects</h1>
        </div>
      </div>
      <div class="workspace-actions">
        <button type="button" class="btn btn-primary" data-action="new-project">+ Create Project</button>
      </div>
    </div>

    <div class="hub-container">
      <div style="font-size: 14px; color: var(--text-muted); margin-bottom: 12px;">
        Total: <strong>${appState.projects.length}</strong> active projects. Click any project to open Board and Timeline:
      </div>

      <div class="hub-grid">
        ${appState.projects.map((p) => {
          const totalTasks = p.tasks.length;
          const doneTasks = p.tasks.filter((t) => t.status === 'done').length;
          const activePhases = p.phases.length;
          return `
            <div class="hub-project-card" data-action="open-project" data-id="${esc(p.id)}">
              <div class="hub-card-header">
                <div class="hub-card-icon">${esc(p.icon || '🚗')}</div>
                <div class="hub-card-title-group">
                  <h3 class="hub-card-title">${esc(p.name)}</h3>
                  <span class="hub-card-key">${esc(p.key || 'PROJ')}</span>
                </div>
              </div>
              <p class="hub-card-desc">${esc(p.desc || 'No description provided')}</p>
              <div class="hub-card-stats">
                <span>🗓️ ${activePhases} Phases</span>
                <span>✨ Done ${doneTasks}/${totalTasks}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

/* ==========================================================================
   VIEW 2: Jira Board View (บอร์ดการ์ดน่ารัก มินิมอล ละมุนตา)
   ========================================================================== */

function renderBoardView(p) {
  const container = $('mainWorkspace');

  // Filter tasks by search and phase filter
  const q = appState.searchQuery.toLowerCase();
  const tasks = p.tasks.filter((t) => {
    if (appState.selectedPhaseFilter !== 'all' && t.phaseId !== appState.selectedPhaseFilter) return false;
    if (!q) return true;
    return t.title.toLowerCase().includes(q) || (t.code || '').toLowerCase().includes(q) || (t.assignee || '').toLowerCase().includes(q);
  });

  const columns = [
    { key: 'todo', label: 'TO DO', emoji: '📋', items: tasks.filter((t) => t.status === 'todo') },
    { key: 'in_progress', label: 'IN PROGRESS', emoji: '☕', items: tasks.filter((t) => t.status === 'in_progress') },
    { key: 'review', label: 'CODE REVIEW / TEST', emoji: '👀', items: tasks.filter((t) => t.status === 'review') },
    { key: 'done', label: 'DONE', emoji: '🎉', items: tasks.filter((t) => t.status === 'done') }
  ];

  const phaseOptions = p.phases.map((ph) => `<option value="${esc(ph.id)}" ${appState.selectedPhaseFilter === ph.id ? 'selected' : ''}>${esc(ph.name)}</option>`).join('');

  container.innerHTML = `
    <div class="workspace-top-bar">
      <div style="display: flex; align-items: center; gap: 12px;">
        ${SIDEBAR_TOGGLE_BTN}
        <div>
          <div class="breadcrumbs">
            <span style="cursor:pointer;" data-action="go-hub">Projects</span> / <strong>${esc(p.name)}</strong>
          </div>
          <h1 class="workspace-title">Board</h1>
        </div>
      </div>
      <div class="workspace-actions">
        <button type="button" class="btn btn-secondary" data-action="switch-subview" data-subview="timeline">🗓️ Timeline</button>
        <button type="button" class="btn btn-primary" data-action="new-issue">+ Create Issue</button>
      </div>
    </div>

    <div class="workspace-filter-bar">
      <input type="text" class="jira-search-input" id="boardSearchInput" value="${esc(appState.searchQuery)}" placeholder="🔍 Search tasks, bugs, assignees...">
      
      <select id="boardPhaseFilterSelect" style="max-width: 230px; font-size: 13px; padding: 7px 14px; border-radius: 999px;">
        <option value="all">All Phases (${p.phases.length})</option>
        ${phaseOptions}
      </select>

      <div style="margin-left: auto; font-size: 12px; color: var(--text-muted); display: inline-flex; align-items: center; gap: 6px;">
        <span>🖐️</span>
        <span>Drag cards to reorder priority, or across columns to move status</span>
      </div>
    </div>

    <div class="jira-board-canvas">
      ${columns.map((col) => `
        <div class="jira-column">
          <div class="jira-column-header">
            <span>${col.emoji} ${col.label}</span>
            <span class="jira-column-counter">${col.items.length}</span>
          </div>

          <div class="jira-card-list" data-column="${col.key}">
            ${col.items.map((t) => {
              const phase = p.phases.find((ph) => ph.id === t.phaseId);
              const typeMeta = TYPE_CONFIG[t.type] || TYPE_CONFIG.task;
              const assigneeInitial = (t.assignee || 'P').trim().charAt(0).toUpperCase();

              return `
                <div class="jira-card" draggable="true" data-action="edit-issue" data-id="${esc(t.id)}" data-status="${col.key}">
                  ${phase ? `
                    <div class="jira-card-tags">
                      <span class="phase-tag" style="background: ${phase.color}18; color: ${phase.color}; border: 1px solid ${phase.color}44;">
                        ${esc(phase.name)}
                      </span>
                    </div>
                  ` : ''}
                  
                  <h4 class="jira-card-title">${esc(t.title)}</h4>

                  <div class="jira-card-bottom">
                    <div class="card-left-meta">
                      <span class="drag-grip" title="Drag to reorder priority">⋮⋮</span>
                      <span class="type-indicator" title="${typeMeta.label}">${typeMeta.icon}</span>
                      <span title="Priority">${PRIORITY_ICONS[t.priority] || '🟡'}</span>
                      <span style="font-weight: 700; color: var(--cozy-primary);">${esc(t.code || 'RECON-0')}</span>
                    </div>
                    <div class="card-assignee-avatar" title="${esc(t.assignee || 'Unassigned')}">
                      ${assigneeInitial}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <button type="button" class="quick-add-task-btn" data-action="quick-add-column" data-status="${col.key}">
            + Create Issue
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

/* ==========================================================================
   VIEW 3: Timeline & Stages View (กำหนดไทม์ไลน์ สเตท วันที่ ปรับได้อิสระ)
   ========================================================================== */

function buildTimelineCalendar(phases) {
  const parseDate = (dStr) => {
    if (!dStr) return null;
    const parts = dStr.split('-').map(Number);
    if (parts.length < 3 || isNaN(parts[0])) return null;
    return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
  };

  const dates = [];
  phases.forEach((ph) => {
    const s = parseDate(ph.start);
    const e = parseDate(ph.end);
    if (s) dates.push(s);
    if (e) dates.push(e);
  });

  const now = new Date();
  let minDate = dates.length ? new Date(Math.min(...dates)) : new Date(now.getFullYear(), now.getMonth(), 1, 12);
  let maxDate = dates.length ? new Date(Math.max(...dates)) : new Date(now.getFullYear(), now.getMonth() + 1, 0, 12);

  // Round minDate back to preceding Monday
  const dayOfWeek = minDate.getDay();
  const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const startCal = new Date(minDate);
  startCal.setDate(minDate.getDate() + diffToMon);

  // Round maxDate forward to next Sunday
  const maxDayOfWeek = maxDate.getDay();
  const diffToSun = maxDayOfWeek === 0 ? 0 : 7 - maxDayOfWeek;
  const endCal = new Date(maxDate);
  endCal.setDate(maxDate.getDate() + diffToSun);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const days = [];
  const curr = new Date(startCal);
  const todayStr = new Date().toISOString().slice(0, 10);

  while (curr <= endCal) {
    const y = curr.getFullYear();
    const m = curr.getMonth();
    const d = curr.getDate();
    const dow = curr.getDay();
    const dateStr = [y, String(m + 1).padStart(2, '0'), String(d).padStart(2, '0')].join('-');

    days.push({
      dateStr,
      year: y,
      month: m,
      monthLabel: `${monthNames[m]} ${y}`,
      dayNum: d,
      dow,
      dayName: dayNames[dow],
      isWeekend: dow === 0 || dow === 6,
      isToday: dateStr === todayStr
    });

    curr.setDate(curr.getDate() + 1);
  }

  // Group consecutive days into months
  const months = [];
  let currMonth = null;
  days.forEach((day, index) => {
    if (!currMonth || currMonth.key !== `${day.year}-${day.month}`) {
      currMonth = {
        key: `${day.year}-${day.month}`,
        label: day.monthLabel,
        startIndex: index,
        count: 0
      };
      months.push(currMonth);
    }
    currMonth.count++;
  });

  return { days, months };
}

function renderTimelineView(p) {
  const container = $('mainWorkspace');
  const cal = buildTimelineCalendar(p.phases);
  const dayWidth = appState.ganttZoom || 34;
  const totalChartWidth = Math.max(cal.days.length * dayWidth, 600);

  const getDayIdx = (dStr) => {
    if (!dStr) return -1;
    return cal.days.findIndex((d) => d.dateStr === dStr);
  };

  container.innerHTML = `
    <div class="workspace-top-bar">
      <div style="display: flex; align-items: center; gap: 12px;">
        ${SIDEBAR_TOGGLE_BTN}
        <div>
          <div class="breadcrumbs">
            <span style="cursor:pointer;" data-action="go-hub">Projects</span> / <strong>${esc(p.name)}</strong>
          </div>
          <h1 class="workspace-title">Timeline</h1>
        </div>
      </div>
      <div class="workspace-actions">
        <button type="button" class="btn btn-secondary" data-action="switch-subview" data-subview="board">📋 Board</button>
        <button type="button" class="btn btn-primary" data-action="new-phase">+ Add Phase</button>
      </div>
    </div>

    <div class="jira-timeline-canvas">
      <div class="timeline-table-card">
        <!-- Top Toolbar -->
        <div class="timeline-toolbar">
          <div class="timeline-legend">
            <span>📅 Baseline: <strong style="color: var(--text-main);">${cal.months.map((m) => m.label).join(' – ')}</strong></span>
            <span>•</span>
            <span class="milestone-legend-tag">◆ Go-Live milestone</span>
          </div>
          <div class="timeline-controls">
            <div class="gantt-scroll-nav">
              <button type="button" class="btn btn-ghost btn-sm" data-action="scroll-gantt" data-direction="-220" title="Scroll Left">◀</button>
              <button type="button" class="btn btn-ghost btn-sm" data-action="scroll-to-first-task" title="Jump to First Active Task">📍 First Task</button>
              <button type="button" class="btn btn-ghost btn-sm" data-action="scroll-to-milestone" title="Jump to Go-Live Milestone">🏁 Milestone</button>
              <button type="button" class="btn btn-ghost btn-sm" data-action="scroll-gantt" data-direction="220" title="Scroll Right">▶</button>
            </div>
            <div class="gantt-zoom-group">
              <span style="font-size: 11.5px; color: var(--text-muted); margin-left: 4px;">Scale:</span>
              <button type="button" class="btn btn-ghost btn-sm ${dayWidth === 26 ? 'active' : ''}" data-action="set-gantt-zoom" data-zoom="26">Compact</button>
              <button type="button" class="btn btn-ghost btn-sm ${dayWidth === 34 ? 'active' : ''}" data-action="set-gantt-zoom" data-zoom="34">Normal</button>
              <button type="button" class="btn btn-ghost btn-sm ${dayWidth === 44 ? 'active' : ''}" data-action="set-gantt-zoom" data-zoom="44">Wide</button>
            </div>
          </div>
        </div>

        <!-- Dual Split: Left Task Table + Right Scrollable Gantt Chart -->
        <div class="gantt-split-container">
          <!-- Left Task Table Pane -->
          <div class="gantt-left-pane">
            <div class="gantt-left-header">
              <div>Task</div>
              <div>Owner</div>
              <div>Start Date</div>
              <div>End Date</div>
            </div>
            <div class="gantt-left-body">
              ${p.phases.length === 0 ? `
                <div style="padding: 24px 14px; text-align: center; color: var(--text-muted);">
                  No phases created yet.
                </div>
              ` : p.phases.map((ph) => {
                const isMilestone = ph.start && ph.end && ph.start === ph.end;
                const linkedTask = p.tasks.find((t) => t.phaseId === ph.id);
                const status = linkedTask?.status || null;
                const checkSvg = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

                let checkClass = '';
                let checkTitle = 'ติ๊กเพื่อแปลงเป็นงาน To Do บน Board';
                let checkIcon = '';

                if (status === 'todo') {
                  checkClass = 'is-todo';
                  checkTitle = 'อยู่ในบอร์ด TO DO แล้ว (คลิกเพื่อนำออกจาก TO DO)';
                  checkIcon = checkSvg;
                } else if (status) {
                  checkClass = status === 'done' ? 'is-done' : 'is-active';
                  checkTitle = `อยู่บน Board แล้ว (${status.toUpperCase()}) — คลิกเพื่อดูการ์ด`;
                  checkIcon = checkSvg;
                }

                return `
                  <div class="gantt-left-row">
                    <div class="task-cell-inner" data-action="edit-phase" data-id="${esc(ph.id)}" style="cursor: pointer;" title="Click to edit: ${esc(ph.name)}">
                      <button type="button" class="timeline-todo-check ${checkClass}" data-action="toggle-timeline-todo" data-id="${esc(ph.id)}" title="${esc(checkTitle)}" aria-label="${esc(checkTitle)}">
                        ${checkIcon}
                      </button>
                      <span class="phase-color-dot" style="background: ${ph.color || '#7C83FD'};"></span>
                      <span class="task-title-text">
                        ${isMilestone ? '◆ ' : ''}${esc(ph.name)}
                      </span>
                    </div>
                    <div>
                      <span class="owner-pill" title="${esc(ph.owner || '—')}">👤 ${esc(ph.owner || '—')}</span>
                    </div>
                    <div>
                      <input type="date" class="phase-date-input" data-update-date="start" data-id="${esc(ph.id)}" value="${esc(ph.start || '')}">
                    </div>
                    <div>
                      <input type="date" class="phase-date-input" data-update-date="end" data-id="${esc(ph.id)}" value="${esc(ph.end || '')}">
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Right Scrollable Gantt Pane -->
          <div class="gantt-right-pane" id="ganttScrollContainer">
            <div class="gantt-chart-inner" style="width: ${totalChartWidth}px;">
              <!-- Header: Month Tier + Day Tier -->
              <div class="gantt-chart-header">
                <!-- Month Tier -->
                <div class="gantt-month-track">
                  ${cal.months.map((m) => `
                    <div class="gantt-month-block" style="width: ${m.count * dayWidth}px;">
                      <span class="gantt-month-badge">📅 ${esc(m.label)}</span>
                    </div>
                  `).join('')}
                </div>
                <!-- Day Tier -->
                <div class="gantt-day-track">
                  ${cal.days.map((d) => `
                    <div class="gantt-day-header-cell ${d.isWeekend ? 'weekend' : ''} ${d.isToday ? 'today' : ''}" style="width: ${dayWidth}px;">
                      <span class="d-num">${d.dayNum}</span>
                      <span class="d-dow">${d.dayName}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Body: Background Day Gridlines + Tracks Layer -->
              <div class="gantt-chart-body">
                <!-- Background day gridlines -->
                <div class="gantt-bg-grid" style="width: ${totalChartWidth}px;">
                  ${cal.days.map((d) => `
                    <div class="gantt-grid-column ${d.isWeekend ? 'weekend' : ''} ${d.isToday ? 'today' : ''}" style="width: ${dayWidth}px;"></div>
                  `).join('')}
                </div>

                <!-- Phase Track Rows -->
                <div class="gantt-tracks-layer">
                  ${p.phases.map((ph) => {
                    let sIdx = getDayIdx(ph.start);
                    let eIdx = getDayIdx(ph.end);

                    if (sIdx === -1 && eIdx === -1) {
                      sIdx = 0;
                      eIdx = 0;
                    } else if (sIdx === -1) {
                      sIdx = eIdx;
                    } else if (eIdx === -1) {
                      eIdx = sIdx;
                    }

                    if (eIdx < sIdx) {
                      const temp = sIdx;
                      sIdx = eIdx;
                      eIdx = temp;
                    }

                    const spanDays = Math.max(1, eIdx - sIdx + 1);
                    const isMilestone = ph.start && ph.end && ph.start === ph.end;

                    let barLeft = 0;
                    let barWidth = 0;

                    if (isMilestone) {
                      barLeft = sIdx * dayWidth + (dayWidth - 18) / 2;
                      barWidth = 18;
                    } else {
                      barLeft = sIdx * dayWidth + 2;
                      barWidth = Math.max(dayWidth - 4, spanDays * dayWidth - 4);
                    }

                    return `
                      <div class="gantt-track-row">
                        <div class="gantt-bar-item ${isMilestone ? 'milestone-diamond' : ''}"
                             style="left: ${barLeft}px; width: ${barWidth}px; background: ${ph.color || '#7C83FD'};"
                             data-action="edit-phase" data-id="${esc(ph.id)}"
                             title="${esc(ph.name)} (${esc(ph.start || '')} → ${esc(ph.end || '')})">
                          ${!isMilestone ? `<span class="gantt-bar-text">${esc(ph.name)}</span>` : ''}
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Auto-scroll timeline to first active task if not scrolled yet
  setTimeout(() => {
    const pane = $('ganttScrollContainer');
    if (pane && !appState.hasManuallyScrolledGantt) {
      const firstActiveIdx = cal.days.findIndex((d) => p.phases.some((ph) => ph.start === d.dateStr));
      if (firstActiveIdx > 0) {
        pane.scrollLeft = Math.max(0, firstActiveIdx * dayWidth - 40);
      }
    }
  }, 20);
}

/* ==========================================================================
   VIEW 4: Phases Details & Deliverables
   ========================================================================== */

function renderPhasesView(p) {
  const container = $('mainWorkspace');
  container.innerHTML = `
    <div class="workspace-top-bar">
      <div style="display: flex; align-items: center; gap: 12px;">
        ${SIDEBAR_TOGGLE_BTN}
        <div>
          <div class="breadcrumbs">
            <span style="cursor:pointer;" data-action="go-hub">Projects</span> / <strong>${esc(p.name)}</strong>
          </div>
          <h1 class="workspace-title">Phases</h1>
        </div>
      </div>
      <div class="workspace-actions">
        <button type="button" class="btn btn-primary" data-action="new-phase">+ Add Phase</button>
      </div>
    </div>

    <div style="padding: 20px 28px; max-width: 900px;">
      <div class="phases-detail-list">
        ${p.phases.map((ph, idx) => {
          const tasksInPhase = p.tasks.filter((t) => t.phaseId === ph.id);
          const doneCount = tasksInPhase.filter((t) => t.status === 'done').length;
          return `
            <div class="phase-detail-card" style="border-left-color: ${ph.color || '#7C83FD'};">
              <div class="phase-card-top">
                <div>
                  <h3 class="phase-card-title">${esc(ph.name)}</h3>
                  <div class="phase-card-dates">
                    📅 Schedule: <strong>${esc(ph.start || 'TBD')}</strong> to <strong>${esc(ph.end || 'TBD')}</strong>
                  </div>
                </div>
                <div>
                  <button type="button" class="btn btn-secondary btn-sm" data-action="edit-phase" data-id="${esc(ph.id)}">Edit</button>
                </div>
              </div>
              <p class="phase-card-goal">🎯 <strong>Goal:</strong> ${esc(ph.goal || 'No specific goal specified')}</p>
              
              <div style="margin-top: 14px; font-size: 13px; color: var(--text-muted); display: flex; gap: 16px;">
                <span>Total Tasks: <strong>${tasksInPhase.length}</strong></span>
                <span>Completed: <strong>${doneCount}</strong></span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

/* ==========================================================================
   VIEW 5: Project Settings View
   ========================================================================== */

function renderSettingsView(p) {
  const container = $('mainWorkspace');
  container.innerHTML = `
    <div class="workspace-top-bar">
      <div style="display: flex; align-items: center; gap: 12px;">
        ${SIDEBAR_TOGGLE_BTN}
        <div>
          <div class="breadcrumbs">
            <span style="cursor:pointer;" data-action="go-hub">Projects</span> / <strong>${esc(p.name)}</strong>
          </div>
          <h1 class="workspace-title">Settings</h1>
        </div>
      </div>
    </div>

    <div style="padding: 24px 28px; max-width: 600px;">
      <form id="projectEditSettingsForm">
        <div class="field" style="margin-bottom: 16px;">
          <label>Project Name</label>
          <input type="text" id="settingProjName" value="${esc(p.name)}" required>
        </div>
        <div class="field-row" style="margin-bottom: 16px;">
          <div class="field" style="max-width: 140px;">
            <label>Key</label>
            <input type="text" id="settingProjKey" value="${esc(p.key || 'PROJ')}" maxlength="6">
          </div>
          <div class="field">
            <label>Icon</label>
            <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
              <input type="text" id="settingProjIcon" value="${esc(p.icon || '🚗')}" style="width: 50px; text-align: center; font-size: 18px; padding: 4px;">
              <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                ${['🚗', '🚘', '🛞', '💻', '📱', '🚀', '✨', '🌷', '🌿', '☕'].map((ic) => `
                  <button type="button" class="btn btn-ghost btn-sm" style="font-size: 15px; padding: 3px 7px; border: 1px solid var(--jira-border);" onclick="document.getElementById('settingProjIcon').value='${ic}'">${ic}</button>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
        <div class="field" style="margin-bottom: 24px;">
          <label>Description</label>
          <textarea id="settingProjDesc" rows="3">${esc(p.desc || '')}</textarea>
        </div>

        <button type="submit" class="btn btn-primary">Save Changes</button>
        <button type="button" class="btn btn-danger" style="margin-left: 12px;" data-action="delete-current-project">Delete Project</button>
      </form>
    </div>
  `;
}

/* ==========================================================================
   Modal Operations
   ========================================================================== */

function openProjectModal(isEdit = false) {
  const p = getActiveProject();
  const form = $('projectForm');
  form.reset();
  if (isEdit && p) {
    $('projModalTitle').textContent = 'Edit Project';
    $('pFormId').value = p.id;
    $('pFormName').value = p.name;
    $('pFormKey').value = p.key;
    $('pFormIcon').value = p.icon;
    $('pFormDesc').value = p.desc;
  } else {
    $('projModalTitle').textContent = 'Create Project';
    $('pFormId').value = '';
    $('pFormKey').value = 'PRJ';
  }
  $('projectModal').showModal();
}

function openIssueModal(task = null, defaultStatus = 'todo') {
  const p = getActiveProject();
  if (!p) return;
  const form = $('issueForm');
  form.reset();

  // Populate phases dropdown
  $('taskFormPhase').innerHTML = `<option value="">None (No Phase)</option>` +
    p.phases.map((ph) => `<option value="${esc(ph.id)}">${esc(ph.name)}</option>`).join('');

  if (task) {
    $('issueModalTitle').textContent = `Edit Issue: ${task.code || ''}`;
    $('taskFormId').value = task.id;
    $('taskFormTitle').value = task.title;
    $('taskFormType').value = task.type || 'task';
    $('taskFormStatus').value = task.status || 'todo';
    $('taskFormPhase').value = task.phaseId || '';
    $('taskFormPriority').value = task.priority || 'medium';
    $('taskFormAssignee').value = task.assignee || '';
    $('taskFormDueDate').value = task.dueDate || '';
    $('taskFormDesc').value = task.desc || '';
    $('deleteTaskBtn').style.display = 'inline-flex';
  } else {
    $('issueModalTitle').textContent = 'Create Issue';
    $('taskFormId').value = '';
    $('taskFormStatus').value = defaultStatus;
    $('taskFormPriority').value = 'medium';
    $('deleteTaskBtn').style.display = 'none';
  }

  $('issueModal').showModal();
}

function openPhaseModal(phase = null) {
  const form = $('phaseForm');
  form.reset();
  if (phase) {
    $('phaseModalTitle').textContent = 'Edit Phase';
    $('phaseFormId').value = phase.id;
    $('phaseFormName').value = phase.name;
    $('phaseFormStart').value = phase.start || '';
    $('phaseFormEnd').value = phase.end || '';
    $('phaseFormOwner').value = phase.owner || '';
    $('phaseFormColor').value = phase.color || '#00818A';
    $('phaseFormGoal').value = phase.goal || '';
    $('deletePhaseBtn').style.display = 'inline-flex';
  } else {
    const p = getActiveProject();
    const nextNum = (p?.phases?.length || 0) + 1;
    $('phaseModalTitle').textContent = 'Add Phase';
    $('phaseFormId').value = '';
    $('phaseFormName').value = `Phase ${nextNum}: `;
    $('phaseFormStart').value = '';
    $('phaseFormEnd').value = '';
    $('phaseFormOwner').value = '';
    $('phaseFormColor').value = '#00818A';
    $('phaseFormGoal').value = '';
    $('deletePhaseBtn').style.display = 'none';
  }
  $('phaseModal').showModal();
}

function showToast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

/* ==========================================================================
   Event Listeners
   ========================================================================== */

function setupEventListeners() {
  let draggedTaskId = null;
  let isDraggingCard = false;

  // Drag and Drop for Board Cards (Reorder & Move status)
  document.addEventListener('dragstart', (e) => {
    const card = e.target.closest('.jira-card');
    if (!card) return;
    draggedTaskId = card.dataset.id;
    isDraggingCard = true;
    card.classList.add('dragging');
    e.dataTransfer.setData('text/plain', draggedTaskId);
    e.dataTransfer.effectAllowed = 'move';
  });

  document.addEventListener('dragend', (e) => {
    const card = e.target.closest('.jira-card');
    if (card) card.classList.remove('dragging');
    document.querySelectorAll('.drop-above, .drop-below').forEach((el) => {
      el.classList.remove('drop-above', 'drop-below');
    });
    document.querySelectorAll('.column-drag-over').forEach((el) => {
      el.classList.remove('column-drag-over');
    });
    setTimeout(() => {
      isDraggingCard = false;
      draggedTaskId = null;
    }, 80);
  });

  document.addEventListener('dragover', (e) => {
    if (!draggedTaskId) return;
    const targetCard = e.target.closest('.jira-card');
    const targetList = e.target.closest('.jira-card-list');
    const targetCol = e.target.closest('.jira-column');

    if (!targetList && !targetCard && !targetCol) return;

    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    // Highlight target column list
    const activeList = targetList || targetCol?.querySelector('.jira-card-list');
    document.querySelectorAll('.column-drag-over').forEach((el) => {
      if (el !== activeList) el.classList.remove('column-drag-over');
    });
    if (activeList) activeList.classList.add('column-drag-over');

    // Drop indicator on card for precise reordering
    document.querySelectorAll('.drop-above, .drop-below').forEach((el) => {
      if (el !== targetCard) el.classList.remove('drop-above', 'drop-below');
    });

    if (targetCard && targetCard.dataset.id !== draggedTaskId) {
      const rect = targetCard.getBoundingClientRect();
      const relY = e.clientY - rect.top;
      const isTop = relY < rect.height / 2;
      targetCard.classList.toggle('drop-above', isTop);
      targetCard.classList.toggle('drop-below', !isTop);
    }
  });

  document.addEventListener('dragleave', (e) => {
    const card = e.target.closest('.jira-card');
    if (card && (!e.relatedTarget || !card.contains(e.relatedTarget))) {
      card.classList.remove('drop-above', 'drop-below');
    }
    const list = e.target.closest('.jira-card-list');
    if (list && (!e.relatedTarget || !list.contains(e.relatedTarget))) {
      list.classList.remove('column-drag-over');
    }
  });

  document.addEventListener('drop', (e) => {
    if (!draggedTaskId) return;
    const targetCard = e.target.closest('.jira-card');
    const targetList = e.target.closest('.jira-card-list') || e.target.closest('.jira-column')?.querySelector('.jira-card-list');

    if (!targetList && !targetCard) return;

    e.preventDefault();
    const p = getActiveProject();
    if (!p) return;

    const targetColumnKey = targetList ? targetList.dataset.column : targetCard?.closest('.jira-card-list')?.dataset.column;
    if (!targetColumnKey) return;

    const currentIdx = p.tasks.findIndex((t) => t.id === draggedTaskId);
    if (currentIdx === -1) return;

    const [movedTask] = p.tasks.splice(currentIdx, 1);
    const oldStatus = movedTask.status;
    movedTask.status = targetColumnKey;

    if (targetCard && targetCard.dataset.id !== draggedTaskId) {
      const isTop = targetCard.classList.contains('drop-above');
      const targetId = targetCard.dataset.id;
      const targetIdx = p.tasks.findIndex((t) => t.id === targetId);

      if (targetIdx !== -1) {
        const insertIdx = isTop ? targetIdx : targetIdx + 1;
        p.tasks.splice(insertIdx, 0, movedTask);
      } else {
        p.tasks.push(movedTask);
      }
    } else {
      // Dropped into empty column area or bottom of column
      let lastIndexInTargetCol = -1;
      for (let i = p.tasks.length - 1; i >= 0; i--) {
        if (p.tasks[i].status === targetColumnKey) {
          lastIndexInTargetCol = i;
          break;
        }
      }
      if (lastIndexInTargetCol !== -1) {
        p.tasks.splice(lastIndexInTargetCol + 1, 0, movedTask);
      } else {
        p.tasks.push(movedTask);
      }
    }

    persistState();
    renderBoardView(p);

    if (oldStatus !== targetColumnKey) {
      showToast(`ย้ายการ์ด "${movedTask.title}" สำเร็จ 🚀`);
    } else {
      showToast(`ปรับลำดับความสำคัญของ "${movedTask.title}" สำเร็จ ✨`);
    }
  });

  const closeMobileSidebar = () => {
    $('appLayout')?.classList.remove('mobile-sidebar-open');
  };

  // Global sidebar clicks
  $('navAllProjectsBtn').addEventListener('click', () => {
    closeMobileSidebar();
    appState.currentView = 'hub';
    renderApp();
  });

  $('backToHubBtn').addEventListener('click', () => {
    closeMobileSidebar();
    appState.currentView = 'hub';
    renderApp();
  });

  $('quickNewProjBtn').addEventListener('click', () => {
    closeMobileSidebar();
    openProjectModal(false);
  });

  $('dataBackupBtn').addEventListener('click', () => {
    closeMobileSidebar();
    $('dataDialog').showModal();
  });

  // Project sub-nav sidebar clicks
  document.querySelectorAll('.side-nav-item').forEach((item) => {
    item.addEventListener('click', () => {
      closeMobileSidebar();
      appState.activeSubView = item.dataset.subview;
      renderApp();
    });
  });

  // Modal close buttons
  document.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('[data-close]');
    if (closeBtn) {
      closeBtn.closest('dialog')?.close();
      return;
    }

    const actionBtn = e.target.closest('[data-action]');
    if (!actionBtn) return;
    const action = actionBtn.dataset.action;

    if (action === 'toggle-mobile-menu' || action === 'toggle-sidebar') {
      if (window.innerWidth <= 860) {
        $('appLayout')?.classList.toggle('mobile-sidebar-open');
      } else {
        appState.sidebarCollapsed = !appState.sidebarCollapsed;
        $('appLayout')?.classList.toggle('sidebar-collapsed', appState.sidebarCollapsed);
        persistState();
      }
      return;
    } else if (action === 'close-mobile-menu') {
      closeMobileSidebar();
      return;
    } else if (action === 'open-project') {
      closeMobileSidebar();
      appState.activeProjectId = actionBtn.dataset.id;
      appState.currentView = 'project';
      appState.activeSubView = 'board';
      renderApp();
    } else if (action === 'go-hub') {
      closeMobileSidebar();
      appState.currentView = 'hub';
      renderApp();
    } else if (action === 'switch-subview') {
      closeMobileSidebar();
      appState.activeSubView = actionBtn.dataset.subview;
      renderApp();
    } else if (action === 'new-project') {
      openProjectModal(false);
    } else if (action === 'new-issue') {
      openIssueModal(null, 'todo');
    } else if (action === 'quick-add-column') {
      openIssueModal(null, actionBtn.dataset.status);
    } else if (action === 'edit-issue') {
      if (isDraggingCard) return;
      const p = getActiveProject();
      const task = p?.tasks.find((t) => t.id === actionBtn.dataset.id);
      if (task) openIssueModal(task);
    } else if (action === 'new-phase') {
      openPhaseModal(null);
    } else if (action === 'edit-phase') {
      const p = getActiveProject();
      const phase = p?.phases.find((ph) => ph.id === actionBtn.dataset.id);
      if (phase) openPhaseModal(phase);
    } else if (action === 'toggle-timeline-todo') {
      const p = getActiveProject();
      const ph = p?.phases.find((x) => x.id === actionBtn.dataset.id);
      if (!p || !ph) return;

      const existingIdx = p.tasks.findIndex((t) => t.phaseId === ph.id);
      if (existingIdx !== -1) {
        const existingTask = p.tasks[existingIdx];
        if (existingTask.status === 'todo') {
          p.tasks.splice(existingIdx, 1);
          persistState();
          renderTimelineView(p);
          showToast(`นำ "${ph.name}" ออกจาก Board (TO DO) แล้ว`);
        } else {
          openIssueModal(existingTask);
        }
      } else {
        const maxNum = p.tasks.reduce((max, t) => {
          const m = String(t.code || '').match(/-(\d+)$/);
          return m ? Math.max(max, parseInt(m[1], 10)) : max;
        }, 0);
        p.tasks.push({
          id: uid('task'),
          code: `${p.key || 'PRJ'}-${maxNum + 1}`,
          title: ph.name,
          type: 'task',
          status: 'todo',
          priority: 'high',
          phaseId: ph.id,
          assignee: ph.owner || '',
          dueDate: ph.end || ph.start || '',
          desc: ph.goal || ''
        });
        persistState();
        renderTimelineView(p);
        showToast(`แปลง "${ph.name}" เป็นการ์ด TO DO บน Board แล้ว 📋✨`);
      }
    } else if (action === 'scroll-gantt') {
      const pane = $('ganttScrollContainer');
      if (pane) {
        const delta = parseInt(actionBtn.dataset.direction, 10) || 220;
        pane.scrollBy({ left: delta, behavior: 'smooth' });
        appState.hasManuallyScrolledGantt = true;
      }
    } else if (action === 'scroll-to-first-task') {
      const pane = $('ganttScrollContainer');
      const p = getActiveProject();
      if (pane && p) {
        const cal = buildTimelineCalendar(p.phases);
        const dayWidth = appState.ganttZoom || 34;
        const firstActiveIdx = cal.days.findIndex((d) => p.phases.some((ph) => ph.start === d.dateStr));
        const target = Math.max(0, (firstActiveIdx >= 0 ? firstActiveIdx : 0) * dayWidth - 40);
        pane.scrollTo({ left: target, behavior: 'smooth' });
        appState.hasManuallyScrolledGantt = true;
      }
    } else if (action === 'scroll-to-milestone') {
      const pane = $('ganttScrollContainer');
      const p = getActiveProject();
      if (pane && p) {
        const cal = buildTimelineCalendar(p.phases);
        const dayWidth = appState.ganttZoom || 34;
        const mIdx = cal.days.findIndex((d) => p.phases.some((ph) => ph.start === d.dateStr && ph.start === ph.end));
        const target = Math.max(0, (mIdx >= 0 ? mIdx : 0) * dayWidth - 100);
        pane.scrollTo({ left: target, behavior: 'smooth' });
        appState.hasManuallyScrolledGantt = true;
      }
    } else if (action === 'set-gantt-zoom') {
      appState.ganttZoom = parseInt(actionBtn.dataset.zoom, 10) || 34;
      const p = getActiveProject();
      if (p) renderTimelineView(p);
    } else if (action === 'delete-current-project') {
      const p = getActiveProject();
      if (p && confirm(`ยืนยันลบโปรเจกต์ "${p.name}"?`)) {
        appState.projects = appState.projects.filter((x) => x.id !== p.id);
        appState.activeProjectId = appState.projects[0]?.id || null;
        appState.currentView = 'hub';
        persistState();
        renderApp();
        showToast('ลบโปรเจกต์เรียบร้อย ✨');
      }
    }
  });

  // Search input & filter changes
  document.addEventListener('input', (e) => {
    if (e.target.id === 'boardSearchInput') {
      appState.searchQuery = e.target.value;
      const p = getActiveProject();
      if (p) renderBoardView(p);
    }
  });

  document.addEventListener('change', (e) => {
    if (e.target.id === 'boardPhaseFilterSelect') {
      appState.selectedPhaseFilter = e.target.value;
      const p = getActiveProject();
      if (p) renderBoardView(p);
    }

    // Direct date change in timeline table
    if (e.target.dataset.updateDate) {
      const field = e.target.dataset.updateDate; // 'start' | 'end'
      const phaseId = e.target.dataset.id;
      const p = getActiveProject();
      const ph = p?.phases.find((x) => x.id === phaseId);
      if (ph) {
        ph[field] = e.target.value;
        persistState();
        renderTimelineView(p);
        showToast(`อัปเดตวันของ ${ph.name} แล้ว ✨`);
      }
    }
  });

  // Project Form Submit
  $('projectForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = $('pFormName');
    if (!nameInput.checkValidity()) {
      nameInput.setAttribute('aria-invalid', 'true');
      nameInput.focus();
      return;
    }

    const editId = $('pFormId').value;
    const name = nameInput.value.trim();
    const key = ($('pFormKey').value.trim() || 'PRJ').toUpperCase();
    const icon = $('pFormIcon').value || '🚗';
    const desc = $('pFormDesc').value.trim();

    if (editId) {
      const p = appState.projects.find((x) => x.id === editId);
      if (p) {
        p.name = name;
        p.key = key;
        p.icon = icon;
        p.desc = desc;
      }
    } else {
      const newProj = {
        id: uid('proj'),
        name,
        key,
        icon,
        desc,
        phases: [
          { id: uid('ph'), name: 'Phase 1: Discovery & Planning', start: new Date().toISOString().slice(0, 10), end: '', color: '#7C83FD', goal: 'สรุปขอบเขตงาน' }
        ],
        tasks: []
      };
      appState.projects.unshift(newProj);
      appState.activeProjectId = newProj.id;
      appState.currentView = 'project';
      appState.activeSubView = 'board';
    }

    persistState();
    $('projectModal').close();
    renderApp();
    showToast('บันทึกโปรเจกต์เรียบร้อย 🌷');
  });

  // Issue Form Submit
  $('issueForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const titleInput = $('taskFormTitle');
    if (!titleInput.checkValidity()) {
      titleInput.setAttribute('aria-invalid', 'true');
      titleInput.focus();
      return;
    }

    const p = getActiveProject();
    if (!p) return;

    const taskId = $('taskFormId').value;
    const title = titleInput.value.trim();
    const type = $('taskFormType').value;
    const status = $('taskFormStatus').value;
    const phaseId = $('taskFormPhase').value;
    const priority = $('taskFormPriority').value;
    const assignee = $('taskFormAssignee').value.trim();
    const dueDate = $('taskFormDueDate').value;
    const desc = $('taskFormDesc').value.trim();

    if (taskId) {
      const task = p.tasks.find((t) => t.id === taskId);
      if (task) {
        task.title = title;
        task.type = type;
        task.status = status;
        task.phaseId = phaseId;
        task.priority = priority;
        task.assignee = assignee;
        task.dueDate = dueDate;
        task.desc = desc;
      }
    } else {
      const nextNum = p.tasks.length + 1;
      p.tasks.unshift({
        id: uid('task'),
        code: `${p.key || 'PRJ'}-${nextNum}`,
        title,
        type,
        status,
        phaseId,
        priority,
        assignee,
        dueDate,
        desc
      });
    }

    persistState();
    $('issueModal').close();
    renderApp();
    showToast('บันทึกการ์ดงานแล้ว ✨');
  });

  // Delete Task Button
  $('deleteTaskBtn').addEventListener('click', () => {
    const p = getActiveProject();
    const taskId = $('taskFormId').value;
    if (p && taskId && confirm('ยืนยันลบการ์ดนี้?')) {
      p.tasks = p.tasks.filter((t) => t.id !== taskId);
      persistState();
      $('issueModal').close();
      renderApp();
      showToast('ลบการ์ดงานแล้ว 🗑️');
    }
  });

  // Phase Form Submit
  $('phaseForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = $('phaseFormName');
    if (!nameInput.checkValidity()) {
      nameInput.setAttribute('aria-invalid', 'true');
      nameInput.focus();
      return;
    }

    const p = getActiveProject();
    if (!p) return;

    const phaseId = $('phaseFormId').value;
    const name = nameInput.value.trim();
    const start = $('phaseFormStart').value;
    const end = $('phaseFormEnd').value;
    const owner = ($('phaseFormOwner')?.value || '').trim();
    const color = $('phaseFormColor').value;
    const goal = $('phaseFormGoal').value.trim();

    if (phaseId) {
      const ph = p.phases.find((x) => x.id === phaseId);
      if (ph) {
        ph.name = name;
        ph.start = start;
        ph.end = end;
        ph.owner = owner;
        ph.color = color;
        ph.goal = goal;
      }
    } else {
      p.phases.push({
        id: uid('ph'),
        name,
        start,
        end,
        owner,
        color,
        goal
      });
    }

    persistState();
    $('phaseModal').close();
    renderApp();
    showToast('บันทึกสเตทไทม์ไลน์แล้ว 🌱');
  });

  // Delete Phase Button
  $('deletePhaseBtn').addEventListener('click', () => {
    const p = getActiveProject();
    const phaseId = $('phaseFormId').value;
    if (p && phaseId && confirm('ยืนยันลบเฟสนี้?')) {
      p.phases = p.phases.filter((x) => x.id !== phaseId);
      persistState();
      $('phaseModal').close();
      renderApp();
      showToast('ลบเฟสแล้ว 🗑️');
    }
  });

  // Settings Form Submit
  document.addEventListener('submit', (e) => {
    if (e.target.id === 'projectEditSettingsForm') {
      e.preventDefault();
      const p = getActiveProject();
      if (p) {
        p.name = $('settingProjName').value.trim() || p.name;
        p.key = ($('settingProjKey').value.trim() || 'PRJ').toUpperCase();
        p.icon = $('settingProjIcon').value.trim() || '🚗';
        p.desc = $('settingProjDesc').value.trim();
        persistState();
        renderApp();
        showToast('อัปเดตการตั้งค่าโปรเจกต์แล้ว ✨');
      }
    }
  });

  // Export / Import JSON
  $('exportJsonBtn').addEventListener('click', () => {
    const payload = JSON.stringify(appState.projects, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `projects-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('ดาวน์โหลดไฟล์เรียบร้อย 💾');
  });

  $('importJsonBtn').addEventListener('click', () => {
    $('importJsonInput').click();
  });

  $('importJsonInput').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (Array.isArray(data)) {
        appState.projects = data;
        appState.activeProjectId = data[0]?.id || null;
        persistState();
        $('dataDialog').close();
        renderApp();
        showToast('นำเข้าข้อมูลสำเร็จ ✨');
      }
    } catch (err) {
      alert('ไฟล์ไม่ถูกต้อง: ' + err.message);
    }
  });

  $('copyShareUrlBtn').addEventListener('click', () => {
    const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(appState.projects)))));
    const url = `${location.origin}${location.pathname}#state=${encoded}`;
    navigator.clipboard?.writeText(url);
    showToast('คัดลอกลิงก์แชร์แล้ว 🔗');
  });
}

/* ==========================================================================
   Initialization
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initDialogFallbacks();
  UserInvalidFallback.init(document);
  initAriaInvalidSync();

  loadState();
  setupEventListeners();
  renderApp();
});
