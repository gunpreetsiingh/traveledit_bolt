import { useParams } from 'react-router-dom';

export default function TripDetailPage() {
  const { id } = useParams();

  return (
    <div className="pt-20">
      <div className="container-spacing section-padding">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Trip Details</h1>
          <p className="text-muted-foreground">
            View and manage your trip details for trip ID: {id}
          </p>
        </div>
      </div>
    </div>
  );
}