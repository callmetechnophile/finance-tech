from dataclasses import dataclass

@dataclass
class ReminderSchedule:
    """
    Schema managing communication schedules, attempts count, and timestamps.
    """
    next_reminder_date: str
    status: str            # SCHEDULED, SENT, OVERLIMIT, COOLING_DOWN
    reminder_count: int
    remaining_attempts: int
    minimum_interval_days: int
