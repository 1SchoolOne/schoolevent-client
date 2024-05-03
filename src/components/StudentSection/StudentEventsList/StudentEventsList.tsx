import { useEffect, useState } from "react"
import { useSupabase } from "../../../utils/useSupabase"
import { IEventFormFields } from "../../Events/type"
import { Link, useNavigate } from "react-router-dom"
import { Card, List } from "antd"
import { TEventTypeValue } from "../../Events/EventForm/EventForm-types"

export function StudentEventList() {
  const supabase = useSupabase()
  const [events, setEvents] = useState<IEventFormFields[]>([])
  const navigate = useNavigate()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchEvents = async () => {
    const { data, error } = await supabase.from('events').select('*')
    if (error) {
      console.error('Error fetching events:', error)
      return []
    }
    setEvents(data as IEventFormFields[])
  }

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const handleEventClick = (studentEventId: number) => {
    navigate(`/studentEvent/${studentEventId}`)
  }

  return(
    <Card>
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            console.log(page)
          },
          pageSize: 3,
        }}
      >
        {events.map((event) => (
          <List.Item
            key={event.id}
            onClick={() => handleEventClick(event.id)}
          >
            <Link to={`/studentEvent/${event.id}`} key={event.id}></Link>
            <List.Item.Meta
              title={event.event_title}
							description={`${
								event.event_type === ('open_day' as TEventTypeValue)
									? 'Porte ouverte'
									: event.event_type === 'presentation'
									? 'Présentation'
									: 'Conférence'
							} - ${event.event_school_name} - ${event.event_address}`}
            />
            <h4>
							{`${new Date(event.event_date).toLocaleDateString('fr-FR', {
								weekday: 'long',
								day: 'numeric',
								month: 'long',
							})} -  ${event.event_duration / 3600}h`}
						</h4>
          </List.Item>
        ))}
      </List>
    </Card>
  )
}