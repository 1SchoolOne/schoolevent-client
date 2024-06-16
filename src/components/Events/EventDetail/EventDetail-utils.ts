import { Dispatch, SetStateAction, useEffect } from "react"
import { log, useSupabase } from '@utils'
import { User } from "@supabase/supabase-js"


export const useFetchEventData = (
  eventId: string | null, 
  user: User | null, 
  setRegistrationCount: Dispatch<SetStateAction<number>>, 
  setIsRegistered: Dispatch<SetStateAction<boolean>>, 
  setRegistrationMessage: Dispatch<SetStateAction<string>>
) => {
  const supabase = useSupabase()

  useEffect(() => {
    if (eventId) {
      const fetchRegistrationCount = async () => {
        const { count, error } = await supabase
          .from('events_participants')
          .select('*', { count: 'exact' })
          .eq('event_id', Number(eventId))
  
        if (error) {
          log.error('Error fetching registration count:', error)
        } else {
          setRegistrationCount(count ?? 0)
        }
      }
  
      const fetchUserResponse = async () => {
  
        if(!user?.id) return
  
        const { data, error } = await supabase
          .from('events_participants')
          .select('*')
          .eq('event_id', Number(eventId))
          .eq('user_id', user.id)
          .single()
  
        if (error) {
          log.error('Error fetching user response:', error)
        } else if (data) {
          setIsRegistered(true)
          setRegistrationMessage('Merci pour ta participation !')
        }
      }
  
      fetchRegistrationCount()
      if (user?.id) {
        fetchUserResponse()
      }
    }
  }, [eventId, user?.id, supabase, setRegistrationCount, setIsRegistered, setRegistrationMessage])
}

export const preRegisterToEvent = async (
  eventId: string | null, 
  user: User | null, 
  msg: any, 
  setIsRegistered: Dispatch<SetStateAction<boolean>>, 
  setRegistrationMessage: Dispatch<SetStateAction<string>>, 
  setRegistrationCount: Dispatch<SetStateAction<number>>
) => {

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const supabase = useSupabase()

  if (!eventId || !user?.id) {
    msg.error('La pré-inscription a échoué, veuillez réessayer plus tard')
    return
  }

  const { error } = await supabase
    .from('events_participants')
    .insert({ event_id: Number(eventId), user_id: user.id })

  if (error) {
    msg.error("Une erreur est survenue lors de l'inscription.")
    log.error(error)
  } else {
    msg.success('Ta pré-inscription a bien été prise en compte !')
    setIsRegistered(true)
    setRegistrationMessage('Merci pour ta participation !')
    setRegistrationCount((prevCount) => prevCount + 1)
  }
}


