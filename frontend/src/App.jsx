
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

import {
  LayoutDashboard,
  Users,
  Building2,
  LogOut,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  RefreshCw,
  ShieldCheck,
  BriefcaseBusiness,
  LockKeyhole,
  Mail,
  UserRound,
  ArrowUpRight,
  AlertCircle,
  Menu,
  CheckCircle2,
} from 'lucide-react';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ems_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const unwrap = (response) => {
  const body = response?.data;
  return body?.data ?? body?.value ?? body ?? [];
};

const getError = (error) => {
  const message = error.response?.data?.message;

  return Array.isArray(message)
    ? message.join(', ')
    : message || 'Something went wrong. Please try again.';
};

// AUTHENTICATION SCREEN
function AuthScreen({ onNotice }) {
  const [mode, setMode] = useState('login');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const update = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);

    try {
      if (mode === 'register') {
        await api.post('/auth/register', form);

        onNotice('Account created successfully. Please sign in.');

        setMode('login');
      } else {
        const response = await api.post('/auth/login', {
          email: form.email,
          password: form.password,
        });

        localStorage.setItem(
          'ems_token',
          response.data.access_token,
        );

        window.location.reload();
      }
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <div className="brand-icon">
          <BriefcaseBusiness size={25} />
        </div>

        <span>
          Work<span className="brand-accent">Space</span>
        </span>
      </div>

      <div className="auth-card">
        <div className="auth-icon">
          <ShieldCheck size={27} />
        </div>

        <p className="eyebrow">EMPLOYEE MANAGEMENT SYSTEM</p>

        <h1>
          {mode === 'login'
            ? 'Welcome back'
            : 'Create your account'}
        </h1>

        <p className="muted">
          {mode === 'login'
            ? 'Sign in to access your workspace.'
            : 'Register to get started with your workspace.'}
        </p>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={17} />
            {error}
          </div>
        )}

        <form onSubmit={submit} className="form-stack">
          {mode === 'register' && (
            <label>
              Full name

              <div className="input-wrap">
                <UserRound size={17} />

                <input
                  name="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={update}
                  required
                />
              </div>
            </label>
          )}

          <label>
            Email address

            <div className="input-wrap">
              <Mail size={17} />

              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={update}
                required
              />
            </div>
          </label>

          <label>
            Password

            <div className="input-wrap">
              <LockKeyhole size={17} />

              <input
                name="password"
                type="password"
                placeholder="Enter password"
                value={form.password}
                onChange={update}
                required
                minLength={8}
              />
            </div>
          </label>

          <button
            className="btn btn-primary full-width"
            disabled={busy}
          >
            {busy
              ? 'Please wait...'
              : mode === 'login'
                ? 'Sign in'
                : 'Create account'}

            <ArrowUpRight size={17} />
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'login'
            ? "Don't have an account?"
            : 'Already registered?'}

          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
          >
            {mode === 'login' ? 'Create account' : 'Sign in'}
          </button>
        </p>
      </div>

      <p className="auth-footer">
        Employee Management System · Powered by NestJS
      </p>
    </div>
  );
}

// EMPLOYEE FORM
function EmployeeForm({
  initial,
  departments,
  onCancel,
  onSave,
  busy,
}) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    email: initial?.email || '',
    role: initial?.role || '',
    departmentId:
      initial?.department?.id ||
      initial?.departmentId ||
      departments[0]?.id ||
      '',
  });

  const update = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = (e) => {
    e.preventDefault();

    onSave({
      ...form,
      departmentId: Number(form.departmentId),
    });
  };

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">EMPLOYEE DETAILS</p>

            <h2>
              {initial ? 'Edit employee' : 'Add employee'}
            </h2>
          </div>

          <button className="icon-btn" onClick={onCancel}>
            <X />
          </button>
        </div>

        <form onSubmit={submit} className="form-stack">
          <label>
            Full name

            <input
              className="text-input"
              name="name"
              value={form.name}
              onChange={update}
              placeholder="Employee name"
              minLength={3}
              required
            />
          </label>

          <label>
            Email address

            <input
              className="text-input"
              name="email"
              type="email"
              value={form.email}
              onChange={update}
              placeholder="employee@example.com"
              required
            />
          </label>

          <label>
            Job role

            <input
              className="text-input"
              name="role"
              value={form.role}
              onChange={update}
              placeholder="e.g. Backend Developer"
              minLength={2}
              required
            />
          </label>

          <label>
            Department

            <select
              className="text-input"
              name="departmentId"
              value={form.departmentId}
              onChange={update}
              required
            >
              <option value="">Select department</option>

              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>

          {departments.length === 0 && (
            <div className="alert alert-error">
              Create a department before adding employees.
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-light"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary"
              disabled={busy || departments.length === 0}
            >
              {busy
                ? 'Saving...'
                : initial
                  ? 'Save changes'
                  : 'Create employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// MAIN APPLICATION
export default function App() {
  const [token, setToken] = useState(
    () => localStorage.getItem('ems_token'),
  );

  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const [view, setView] = useState('dashboard');

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [search, setSearch] = useState('');

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [busy, setBusy] = useState(false);

  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const [mobileMenu, setMobileMenu] = useState(false);

  const notify = (message) => {
    setNotice(message);

    setTimeout(() => setNotice(''), 3500);
  };

  // LOAD EMPLOYEES AND DEPARTMENTS
  const loadData = async () => {
    const [employeeResponse, departmentResponse] =
      await Promise.all([
        api.get('/employees'),
        api.get('/departments'),
      ]);

    setEmployees(unwrap(employeeResponse));
    setDepartments(unwrap(departmentResponse));
  };

  // CHECK JWT AND LOAD PROFILE
  useEffect(() => {
    let active = true;

    if (!token) {
      setChecking(false);
      return;
    }

    async function initialize() {
      try {
        const profile = await api.get('/auth/profile');

        if (!active) return;

        setUser(profile.data.user);

        await loadData();
      } catch {
        localStorage.removeItem('ems_token');

        if (active) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (active) {
          setChecking(false);
        }
      }
    }

    initialize();

    return () => {
      active = false;
    };
  }, [token]);

  // DISPLAY NAME FALLBACK
  const displayName =
    user?.name ||
    user?.email?.split('@')[0] ||
    'User';

  const firstName = displayName.split(/[._-]/)[0];

  const initials = displayName
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const admin = user?.role === 'admin';

  // SEARCH EMPLOYEES
  const filteredEmployees = useMemo(() => {
    const term = search.toLowerCase();

    return employees.filter((employee) =>
      [
        employee.name,
        employee.email,
        employee.role,
        employee.department?.name,
      ].some((value) =>
        String(value || '').toLowerCase().includes(term),
      ),
    );
  }, [employees, search]);

  // CREATE OR UPDATE EMPLOYEE
  const saveEmployee = async (data) => {
    setBusy(true);
    setError('');

    try {
      if (editing) {
        await api.put(`/employees/${editing.id}`, data);

        notify('Employee updated successfully.');
      } else {
        await api.post('/employees', data);

        notify('Employee created successfully.');
      }

      setModal(false);
      setEditing(null);

      await loadData();
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusy(false);
    }
  };

  // DELETE EMPLOYEE
  const deleteEmployee = async (employee) => {
    if (!admin) {
      notify('Only administrators can delete employees.');
      return;
    }

    if (!window.confirm(`Delete ${employee.name}?`)) {
      return;
    }

    try {
      await api.delete(`/employees/${employee.id}`);

      notify('Employee deleted successfully.');

      await loadData();
    } catch (err) {
      setError(getError(err));
      notify(getError(err));
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem('ems_token');

    setToken(null);
    setUser(null);
    setEmployees([]);
    setDepartments([]);
  };

  if (checking) {
    return (
      <div className="loading-screen">
        Loading your workspace...
      </div>
    );
  }

  if (!token || !user) {
    return <AuthScreen onNotice={notify} />;
  }

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'employees',
      label: 'Employees',
      icon: Users,
    },
    {
      id: 'departments',
      label: 'Departments',
      icon: Building2,
    },
  ];

  return (
    <div className="app-shell">
      {/* SIDEBAR */}
     
{/* SIDEBAR */}
<aside
  className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}
>
  {/* CLICKABLE BRAND - GO TO DASHBOARD */}
  <button
    type="button"
    className="sidebar-brand brand-home"
    onClick={() => {
      setView('dashboard');
      setMobileMenu(false);
      setError('');
    }}
    aria-label="Go to Dashboard"
  >
    <div className="brand-icon">
      <BriefcaseBusiness size={22} />
    </div>

    <span>
      Work<span className="brand-accent">Space</span>
    </span>
  </button>

  <p className="side-label">WORKSPACE</p>

  <nav>
    {navItems.map(({ id, label, icon: Icon }) => (
      <button
        key={id}
        className={`nav-item ${view === id ? 'active' : ''}`}
        onClick={() => {
          setView(id);
          setMobileMenu(false);
          setError('');
        }}
      >
        <Icon size={19} />
        {label}
      </button>
    ))}
  </nav>

  <div className="sidebar-bottom">
    <div className="profile-mini">
      <div className="avatar">{initials}</div>

      <div className="profile-text">
        <strong>{displayName}</strong>
        <span>{user.role}</span>
      </div>
    </div>

    <button className="nav-item logout" onClick={logout}>
      <LogOut size={18} />
      Sign out
    </button>
  </div>
</aside>


      {/* MAIN CONTENT */}
      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-toggle icon-btn"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            <Menu />
          </button>

          <div>
            <p className="eyebrow">EMPLOYEE MANAGEMENT</p>

            <h2>
              {navItems.find((n) => n.id === view)?.label}
            </h2>
          </div>

          <div className="topbar-right">
            <button
              className="icon-btn"
              title="Refresh data"
              onClick={() =>
                loadData().catch((e) =>
                  setError(getError(e)),
                )
              }
            >
              <RefreshCw size={18} />
            </button>

            <div className="avatar">{initials}</div>
          </div>
        </header>

        <section className="content">
          {notice && (
            <div className="alert alert-success">
              <CheckCircle2 size={18} />
              {notice}
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              {error}

              <button onClick={() => setError('')}>
                <X size={16} />
              </button>
            </div>
          )}

          {/* DASHBOARD */}
          {view === 'dashboard' && (
            <>
              <div className="welcome-row">
                <div>
                  <p className="eyebrow">OVERVIEW</p>

                  <h1>Welcome, {firstName} 👋</h1>

                  <p className="muted">
                    Here's what's happening in your workspace.
                  </p>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setEditing(null);
                    setModal(true);
                  }}
                >
                  <Plus size={18} />
                  Add employee
                </button>
              </div>

              <div className="stats-grid">
                <StatCard
                  icon={Users}
                  label="Total employees"
                  value={employees.length}
                  tone="blue"
                />

                <StatCard
                  icon={Building2}
                  label="Departments"
                  value={departments.length}
                  tone="purple"
                />

                <StatCard
                  icon={ShieldCheck}
                  label="Your role"
                  value={user.role}
                  tone="green"
                />
              </div>

              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <h3>Recent employees</h3>
                    <p className="muted">
                      Latest members in your workspace
                    </p>
                  </div>

                  <button
                    className="btn btn-light"
                    onClick={() => setView('employees')}
                  >
                    View all <ArrowUpRight size={16} />
                  </button>
                </div>

                <EmployeeTable
                  employees={employees.slice(0, 5)}
                  onEdit={(employee) => {
                    setEditing(employee);
                    setModal(true);
                  }}
                  onDelete={deleteEmployee}
                  admin={admin}
                />
              </div>

              <div className="departments-preview">
                <h3>Departments</h3>

                <div className="department-grid">
                  {departments.map((d) => (
                    <div
                      className="department-card"
                      key={d.id}
                    >
                      <div className="department-icon">
                        <Building2 />
                      </div>

                      <div>
                        <strong>{d.name}</strong>

                        <p className="muted">
                          {d.employees?.length ??
                            employees.filter(
                              (e) => e.department?.id === d.id,
                            ).length}{' '}
                          employees
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* EMPLOYEES PAGE */}
          {view === 'employees' && (
            <>
              <div className="page-heading">
                <div>
                  <h1>Employee directory</h1>

                  <p className="muted">
                    Manage your team members and their details.
                  </p>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setEditing(null);
                    setModal(true);
                  }}
                >
                  <Plus size={18} />
                  Add employee
                </button>
              </div>

              <div className="panel">
                <div className="table-toolbar">
                  <h3>
                    All employees{' '}
                    <span className="count-pill">
                      {employees.length}
                    </span>
                  </h3>

                  <div className="search-box">
                    <Search size={17} />

                    <input
                      placeholder="Search employees..."
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                    />
                  </div>
                </div>

                <EmployeeTable
                  employees={filteredEmployees}
                  onEdit={(employee) => {
                    setEditing(employee);
                    setModal(true);
                  }}
                  onDelete={deleteEmployee}
                  admin={admin}
                />
              </div>
            </>
          )}

          {/* DEPARTMENTS PAGE */}
          {view === 'departments' && (
            <>
              <div className="page-heading">
                <div>
                  <h1>Departments</h1>

                  <p className="muted">
                    Explore departments and their team members.
                  </p>
                </div>

                <span className="count-pill">
                  {departments.length} departments
                </span>
              </div>

              <div className="department-grid department-grid-large">
                {departments.map((department) => {
                  const members = department.employees?.length
                    ? department.employees
                    : employees.filter(
                        (e) =>
                          e.department?.id === department.id,
                      );

                  return (
                    <div
                      className="panel dept-panel"
                      key={department.id}
                    >
                      <div className="department-icon">
                        <Building2 />
                      </div>

                      <h3>{department.name}</h3>

                      <p className="muted">
                        {members.length} team members
                      </p>

                      <div className="member-list">
                        {members.map((member) => (
                          <div
                            className="member-row"
                            key={member.id}
                          >
                            <div className="avatar avatar-small">
                              {member.name?.[0]?.toUpperCase()}
                            </div>

                            <div>
                              <strong>{member.name}</strong>
                              <span>{member.role}</span>
                            </div>
                          </div>
                        ))}

                        {members.length === 0 && (
                          <p className="muted">
                            No employees assigned yet.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </main>

      {/* ADD / EDIT MODAL */}
      {modal && (
        <EmployeeForm
          initial={editing}
          departments={departments}
          onCancel={() => {
            setModal(false);
            setEditing(null);
          }}
          onSave={saveEmployee}
          busy={busy}
        />
      )}
    </div>
  );
}

// DASHBOARD STATISTICS CARD
function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon size={22} />
      </div>

      <p className="muted">{label}</p>

      <h2>{value}</h2>
    </div>
  );
}

// EMPLOYEE TABLE
function EmployeeTable({
  employees,
  onEdit,
  onDelete,
  admin,
}) {
  if (!employees.length) {
    return (
      <div className="empty-state">
        <Users size={32} />
        <h3>No employees found</h3>
        <p>Try another search or add a new employee.</p>
      </div>
    );
  }

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>EMPLOYEE</th>
            <th>ROLE</th>
            <th>DEPARTMENT</th>
            <th>EMAIL</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>
                <div className="employee-cell">
                  <div className="avatar avatar-small">
                    {employee.name?.[0]?.toUpperCase()}
                  </div>

                  <strong>{employee.name}</strong>
                </div>
              </td>

              <td>
                <span className="role-pill">
                  {employee.role}
                </span>
              </td>

              <td>
                {employee.department?.name || 'Unassigned'}
              </td>

              <td>{employee.email}</td>

              <td>
                <div className="actions">
                  <button
                    className="icon-btn action-edit"
                    title="Edit"
                    onClick={() => onEdit(employee)}
                  >
                    <Pencil size={16} />
                  </button>

                  {admin && (
                    <button
                      className="icon-btn action-delete"
                      title="Delete"
                      onClick={() => onDelete(employee)}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
