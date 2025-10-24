import { Outlet, Link, useLocation } from "react-router-dom";

export default function App() {
    const loc = useLocation()
    const showNav = !loc.pathname.startsWith('/play')
    return (
        <div className="h-full flex flex-col">
      {showNav && (
        <header className="p-3 flex justify-between items-center bg-slate-950/50 backdrop-blur border-b border-white/10">
          <Link to="/" className="font-extrabold text-xl">HeadsUp+</Link>
          <nav className="flex gap-2 text-sm">
            <Nav to="/" active={loc.pathname === '/'}>Home</Nav>
            <Nav to="/new-pack" active={loc.pathname === '/new-pack'}>New Pack</Nav>
            <Nav to="/settings" active={loc.pathname === '/settings'}>Settings</Nav>
          </nav>
        </header>
      )}
      <main className="flex-1 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
    )
}

function Nav({to, active, children}: any) {
  return (
    <Link to={to} className={`px-3 py-1.5 rounded-2xl ${active ? 'bg-brand-600' : 'hover:bg-white/10'}`}>
      {children}
    </Link>
  )
}