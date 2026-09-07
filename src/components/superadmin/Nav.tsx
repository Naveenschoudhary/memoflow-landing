'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChartBar, Envelope, PaperPlaneTilt, Package } from '@phosphor-icons/react';

/**
 * The sidebar's navigation.
 *
 * A client component only because the active tab depends on the current path;
 * everything it renders is otherwise static. `orientation` lets the same list
 * serve the desktop sidebar and the narrow-screen bar without a second copy
 * of the routes drifting out of sync with this one.
 */

export const TABS = [
  { href: '/superadmin', label: 'Overview', icon: ChartBar },
  { href: '/superadmin/signups', label: 'Signups', icon: Envelope },
  { href: '/superadmin/releases', label: 'Releases', icon: Package },
  { href: '/superadmin/emails', label: 'Emails', icon: PaperPlaneTilt },
];

export default function Nav({
  orientation = 'vertical',
}: {
  orientation?: 'vertical' | 'horizontal';
}) {
  const pathname = usePathname();
  const vertical = orientation === 'vertical';

  return (
    <nav className={vertical ? 'space-y-1' : 'flex items-center gap-1'}>
      {TABS.map((tab) => {
        // Exact match for the index route, prefix match for the rest, so
        // Overview does not stay lit while a sub-page is open.
        const active =
          tab.href === '/superadmin' ? pathname === tab.href : pathname.startsWith(tab.href);
        const Icon = tab.icon;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? 'page' : undefined}
            className={`flex items-center gap-2.5 rounded-lg text-sm transition-colors ${
              vertical ? 'px-3 py-2' : 'px-3 py-1.5'
            } ${
              active
                ? 'bg-[var(--panel-2)] text-[var(--text)]'
                : 'text-[var(--muted)] hover:bg-white/[0.03] hover:text-[var(--text)]'
            }`}
          >
            <Icon
              size={17}
              weight={active ? 'fill' : 'regular'}
              className={active ? 'text-[var(--accent)]' : ''}
            />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
