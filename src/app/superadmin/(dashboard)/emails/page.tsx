import CampaignComposer from '@/components/superadmin/CampaignComposer';
import ResendPanel from '@/components/superadmin/ResendPanel';
import { PageHeader, Panel, compact, stamp } from '@/components/superadmin/ui';
import {
  countPromoAudiences,
  countResendAudiences,
  countUnsubscribed,
  getCampaigns,
} from '@/lib/superadmin/outreach';

export const dynamic = 'force-dynamic';

export default async function EmailsPage() {
  const [resendCounts, promoCounts, campaigns, unsubscribed] = await Promise.all([
    countResendAudiences(),
    countPromoAudiences(),
    getCampaigns(10),
    countUnsubscribed(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Emails"
        subtitle={
          unsubscribed > 0
            ? `${compact(unsubscribed)} ${unsubscribed === 1 ? 'person has' : 'people have'} unsubscribed and are excluded from every send below.`
            : 'Re-send download links, or write to the list.'
        }
      />

      {/* items-start so a short panel keeps its own height instead of stretching. */}
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Panel
          title="Re-send a download link"
          hint="For people whose link failed, expired, or was never opened."
        >
          <ResendPanel counts={resendCounts} />
        </Panel>

        <Panel title="Promotional email" hint="Written once, sent to the audience you pick.">
          <CampaignComposer counts={promoCounts} />
        </Panel>
      </div>

      <Panel title="Sent campaigns" hint="Promotions only — re-sent download links are not campaigns.">
        {campaigns.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">Nothing sent yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs text-[var(--muted)]">
                <tr>
                  <th className="pb-2 pr-4 font-medium">Subject</th>
                  <th className="pb-2 pr-4 font-medium">Audience</th>
                  <th className="pb-2 pr-4 text-right font-medium">Sent</th>
                  <th className="pb-2 pr-4 text-right font-medium">Failed</th>
                  <th className="pb-2 font-medium">When (UTC)</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-t border-[var(--line)] align-top">
                    <td className="py-2.5 pr-4">
                      <details>
                        <summary className="cursor-pointer">{campaign.subject}</summary>
                        <pre className="mt-2 max-w-lg whitespace-pre-wrap text-xs text-[var(--muted)]">
                          {campaign.body}
                        </pre>
                      </details>
                    </td>
                    <td className="py-2.5 pr-4 text-[var(--muted)]">
                      {campaign.audience.replace('_', ' ')}
                    </td>
                    <td className="py-2.5 pr-4 text-right tabular-nums">{campaign.sent}</td>
                    <td className="py-2.5 pr-4 text-right tabular-nums text-[var(--muted)]">
                      {campaign.failed || '—'}
                    </td>
                    <td className="py-2.5 tabular-nums text-[var(--muted)]">
                      {stamp(campaign.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
