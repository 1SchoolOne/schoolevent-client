export interface TEvent {
    event_title: string;
    event_date: string | null;
}

export interface TAppointment {
    school_name: string;
    apt_status: string;
    planned_date: string | null;
}
