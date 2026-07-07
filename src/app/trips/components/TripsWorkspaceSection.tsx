import { CreateTripDialog } from '@/app/trips/components/CreateTripDialog';

interface TripsWorkspaceSectionProps {
  userName: string;
  activeTripCount: number;
  itineraryItemCount: number;
  noteCount: number;
}

export const TripsWorkspaceSection = ({
  userName,
  activeTripCount,
  itineraryItemCount,
  noteCount,
}: TripsWorkspaceSectionProps) => {
  const activeTripLabel = activeTripCount === 1 ? 'active trip' : 'active trips';
  const plannedItemLabel = itineraryItemCount === 1 ? 'planned item' : 'planned items';
  const noteLabel = noteCount === 1 ? 'note' : 'notes';

  return (
    <section className="grid gap-6 rounded-4xl border border-border/80 bg-card/80 p-6 shadow-elevationLow backdrop-blur-xl md:grid-cols-[1fr_auto] md:items-end md:p-8">
      <div>
        <p className="text-xs font-black tracking-[0.2em] text-secondary uppercase">Trip workspace</p>
        <h1 className="mt-3 text-4xl leading-tight font-black tracking-normal text-card-foreground md:text-5xl">
          {userName}&apos;s trips
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
          Plan upcoming travel, keep your itinerary organized, and publish a read-only trip page when it is ready to
          share.
        </p>
        <div className="mt-6 grid max-w-2xl gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-card/70 p-4">
            <b className="block text-3xl leading-none font-black tracking-normal text-card-foreground">
              {activeTripCount}
            </b>
            <span className="mt-1 block text-sm font-bold text-muted-foreground">{activeTripLabel}</span>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card/70 p-4">
            <b className="block text-3xl leading-none font-black tracking-normal text-card-foreground">
              {itineraryItemCount}
            </b>
            <span className="mt-1 block text-sm font-bold text-muted-foreground">{plannedItemLabel}</span>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card/70 p-4">
            <b className="block text-3xl leading-none font-black tracking-normal text-card-foreground">{noteCount}</b>
            <span className="mt-1 block text-sm font-bold text-muted-foreground">{noteLabel}</span>
          </div>
        </div>
      </div>
      <CreateTripDialog />
    </section>
  );
};
