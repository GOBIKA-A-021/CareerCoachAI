import Navbar from '../Navbar/NavbarNew'

/**
 * Wraps every public / guest page.
 * Renders the public navbar above the page content.
 */
export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      {children}
    </div>
  )
}
