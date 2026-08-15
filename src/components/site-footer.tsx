import Link from "next/link";
import { Container } from "@/components/ui";

const footerSections = [
  {
    title: "Navigate",
    links: [
      { href: "/", label: "Home" },
      { href: "/opportunities", label: "Opportunities" },
      { href: "/saved", label: "Saved" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    title: "Opportunities",
    links: [
      { href: "/opportunities", label: "Browse opportunities" },
      { href: "/add-opportunity", label: "Add opportunity" },
    ],
  },
  {
    title: "Project",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <Container className="grid gap-8 py-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <p className="text-base font-semibold text-primary">
            KaarYab Afghanistan
          </p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
            A capstone opportunity finder foundation for Afghan youth,
            scholarship applicants, job seekers, and organizations.
          </p>
          <p className="mt-4 rounded-md border border-warning/30 bg-warning-soft px-3 py-2 text-sm font-medium text-warning">
            Current opportunity records are fictional demonstration data.
          </p>
        </div>
        {footerSections.map((section) => (
          <div key={section.title}>
            <h2 className="text-sm font-semibold text-primary">{section.title}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted transition hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <div className="border-t border-border">
        <Container className="flex flex-col gap-2 py-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} KaarYab Afghanistan.</p>
          <p>No authentication, external API, or real listings in this phase.</p>
        </Container>
      </div>
    </footer>
  );
}
