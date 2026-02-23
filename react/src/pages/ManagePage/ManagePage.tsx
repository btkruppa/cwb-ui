import { useAuthenticator } from "@aws-amplify/ui-react";
import { Pencil } from "lucide-react";
import { useGetActivities } from "../../api/client/apiHooks";
import type { Activity } from "../../api/model/Activity";
import { DAY_ABBR, WEEK_DAYS } from "../../api/model/Time";
import "./ManagePage.scss";

function cadenceSummary(activity: Activity): string {
  const { cadence } = activity;
  if (cadence.type === "Weekly") {
    return WEEK_DAYS
      .filter((d) => cadence.daysOfWeek[d] !== "Skip")
      .map((d) => DAY_ABBR[d])
      .join(" · ");
  }
  return `Day ${cadence.dayOfMonth}`;
}

export function ManagePage() {
  const { user } = useAuthenticator();
  const { data: activities, isLoading } = useGetActivities(user?.username);

  if (isLoading) {
    return <div className="manage"><p>Loading...</p></div>;
  }

  return (
    <div className="manage">
      {!activities || activities.length === 0 ? (
        <p>No activities yet</p>
      ) : (
        <ul className="manage__list">
          {activities.map((activity) => (
            <li key={activity.uid} className="manage__card">
              <div className="manage__card-info">
                <span className="manage__card-title">{activity.title}</span>
                <span className="manage__card-cadence">{cadenceSummary(activity)}</span>
              </div>
              <button className="manage__card-edit" type="button" aria-label="Edit">
                <Pencil size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
