import { categories } from "@/data/projects";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/80 backdrop-blur">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-semibold tracking-tight">
          Riley Byers
        </a>
        <ul className="hidden gap-6 text-sm sm:flex">
          {categories.map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`} className="hover:text-accent">
                {c.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#contact" className="hover:text-accent">
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
