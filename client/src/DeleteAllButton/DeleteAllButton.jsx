import { useTab } from "../store/pageStore";
import { useEvents } from "../store/eventsStore";
import { useRegistrations } from "../store/registrationsStore";
import { deleteEvent, updateEvent } from "../api/eventsAPI";
import { deleteRegistration } from "../api/registrationsAPI";

export function DeleteAllButton({
  currentEvents,
  className,
  setEventsLoading,
  setRegistrationsLoading,
  setEventsError,
  setRegistrationsError,
}) {
  const activeTab = useTab((state) => state.activeTab);
  const { events, loadEvents } = useEvents();
  const { registrations, loadRegistrations } = useRegistrations();

  async function deleteAllEvents() {
    const confirmed = confirm(
      "Вы действительно хотите очистить список мероприятий?",
    );
    if (confirmed) {
      setEventsLoading(true);
      try {
        await Promise.all(events.map((event) => deleteEvent(event.id)));
        await loadEvents();
      } catch (e) {
        setEventsError(e.message);
      } finally {
        setEventsLoading(false);
      }
    }
  }

  async function deleteAllRegistrations() {
    const confirmed = confirm("Вы действительно хотите отменить все записи?");
    if (confirmed) {
      setRegistrationsLoading(true);
      try {
        await Promise.all(
          registrations.map((registration) =>
            deleteRegistration(registration.id),
          ),
        );
        await Promise.all(
          currentEvents.map((event) =>
            updateEvent({ ...event, capacity: event.capacity + 1 }),
          ),
        );
        await Promise.all([loadRegistrations(), loadEvents()]);
      } catch (e) {
        setRegistrationsError(e.message);
      } finally {
        setRegistrationsLoading(false);
      }
    }
  }

  return (
    <button
      className={className}
      onClick={
        activeTab === "events" ? deleteAllEvents : deleteAllRegistrations
      }
    >
      Очистить все
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="20"
        viewBox="0 0 18 20"
        fill="none"
      >
        <path
          d="M15.4245 7.59003C15.4245 15.6091 16.5788 19.2338 8.81495 19.2338C1.05018 19.2338 2.22828 15.6091 2.22828 7.59003"
          stroke="black"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.9005 4.51574H0.75"
          stroke="black"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.2502 4.51571C12.2502 4.51571 12.7788 0.75 8.82451 0.75C4.87118 0.75 5.39975 4.51571 5.39975 4.51571"
          stroke="black"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
