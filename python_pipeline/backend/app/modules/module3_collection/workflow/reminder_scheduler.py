import datetime
from app.modules.module3_collection.schemas.scheduler_schema import ReminderSchedule

class ReminderScheduler:
    """
    Computes upcoming communication dates, ensures working-day constraints, 
    and checks reminder attempt limits.
    """

    def calculate_schedule(
        self,
        reminder_count: int,
        last_reminder_date_str: str = None,
        max_attempts: int = 4,
        min_interval_days: int = 7,
        today: datetime.date = None
    ) -> ReminderSchedule:
        
        if today is None:
            today = datetime.date.today()

        remaining = max(0, max_attempts - reminder_count)

        if remaining <= 0:
            return ReminderSchedule(
                next_reminder_date="",
                status="OVERLIMIT",
                reminder_count=reminder_count,
                remaining_attempts=0,
                minimum_interval_days=min_interval_days
            )

        # Calculate next reminder date based on last reminder date or today
        if last_reminder_date_str:
            last_date = datetime.date.fromisoformat(last_reminder_date_str)
            next_date = last_date + datetime.timedelta(days=min_interval_days)
            # If last reminder was sent recently, next_date might be in the future
            if next_date < today:
                next_date = today
        else:
            # First reminder can be scheduled today
            next_date = today

        # Working days check: adjust Saturday/Sunday to Monday
        weekday = next_date.weekday()  # 0=Monday, 5=Saturday, 6=Sunday
        if weekday == 5:  # Saturday
            next_date += datetime.timedelta(days=2)
        elif weekday == 6:  # Sunday
            next_date += datetime.timedelta(days=1)

        # Status check
        if last_reminder_date_str:
            last_dt = datetime.date.fromisoformat(last_reminder_date_str)
            if (today - last_dt).days < min_interval_days:
                status = "COOLING_DOWN"
            else:
                status = "SCHEDULED"
        else:
            status = "SCHEDULED"

        return ReminderSchedule(
            next_reminder_date=next_date.isoformat(),
            status=status,
            reminder_count=reminder_count,
            remaining_attempts=remaining,
            minimum_interval_days=min_interval_days
        )
