import {useState, useEffect} from 'react'
import Image from 'next/legacy/image'

import events from '../events.json'

import {sortEventsByDate} from '@/lib/date-utils.js'

import Page from '@/layouts/main.js'

import EventCard from '@/components/event-card.js'

const Evenements = () => {
  const [nextEvents, setNextEvents] = useState([])
  const [pastEvents, setPastEvents] = useState([])

  useEffect(() => {
    const today = new Date()
    const filteredFuturEvents = sortEventsByDate(events.filter(event => new Date(event.date).setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0)))
    const filteredPassedEvents = sortEventsByDate(events.filter(event => new Date(event.date).setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)))

    setNextEvents(filteredFuturEvents)
    setPastEvents(filteredPassedEvents)
  }, [])

  return (
    <Page title='Événements autour du PCRS' description='Consultez les événements à venir.'>
      <div className='events-header fr-my-5w'>
        <Image
          src='/images/illustrations/calendar_illustration-colored.svg'
          height={200}
          width={200}
          alt=''
          aria-hidden='true'
        />
        <h2 className='fr-my-5w'>Événements autour du PCRS</h2>
      </div>

      <div className='fr-p-5w'>
        <div>
          <h3 className='fr-h6'>Les événements à venir</h3>
          {nextEvents.length > 0 ? (
            <div className='events-container'>
              {nextEvents.map(event => <EventCard key={`${event.date}-${event.start}-${event.end}`} {...event} />)}
            </div>
          ) : (
            <div className='empty'>Aucun événement prévu</div>
          )}
        </div>

        <div className='fr-mt-8w'>
          <h3 className='fr-h6'>Événements passés</h3>
          {pastEvents.length > 0 ? (
            <div className='events-container'>
              {pastEvents.map(event => <EventCard key={`${event.date}-${event.start}-${event.end}`} {...event} />)}
            </div>
          ) : (
            <div className='empty'>Aucun événement passés</div>
          )}
        </div>

      </div>

      <style jsx>{`
      .events-header {
        text-align: center;
      }

      .events-container {
        display: flex;
        flex-wrap: wrap;
        gap: 2em;
      }

      .empty {
        font-style: italic;
      }
    `}</style>
    </Page>
  )
}

export default Evenements
