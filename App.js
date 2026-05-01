import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Members from './pages/Members';
import Issues from './pages/Issues';
import './App.css';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
  { id: 'books', label: 'Books', icon: '⊟' },
  { id: 'members', label: 'Members', icon: '◎' },
  { id: 'issues', label: 'Issue / Return', icon: '⇄' },
];

export default function App() {
  const [page, setPage] = useState('dashboard');

  const pages = { dashboard: Dashboard, books: Books, members: Members, issues: Issues };
  const Page = pages[page];

  return (
    <div className="app">
      <Toaster position="top-right" />
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">◈</span>
          <span className="brand-name">LibraryMS</span>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(n => (
            <button
              key={n.id}
              className={`nav-item ${page === n.id ? 'active' : ''}`}
              onClick={() => setPage(n.id)}
            >
              <span className="nav-icon">{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        <Page />
      </main>
    </div>
  );
}
