import Papa from 'papaparse'
import { ScheduleEvent, DayGroup } from '../types'
import { detectActivityType, parseSheetDate } from './helpers'

// Fallback schedule data derived directly from the spreadsheet
// (used when the live fetch fails or while loading)
export const FALLBACK_CSV = `
,Day,Date,Start Time,End Time,Duration,Activity,Notes
,Tuesday,6/2/2026,15:02,23:59,8:57,Depart HNL-SEA,
,Wednesday,6/3/2026,0:00,0:30,0:30,Pick-up checked bags and Turo rental car,
,,,1:00,1:30,0:30,Drive to lodging,
,,,  ,1:30,,Check in to DoubleTree Suites by Hilton Seattle Airport - Southcenter,Itinerary: 73458599867445
,,,2:00,9:00,7:00,Sleep,Kim arrives 7:36am on 6/3 DL440
,,,9:00,10:00,1:00,"Wake-up, brekky, review sched, depart lodging by 10AM","Kim to pick up car and climbing gear from sister. Will probably catch up with sis for a bit."
,,,  ,10:00,,Check out from DoubleTree Suites by Hilton Seattle Airport - Southcenter,
,,,10:00,10:30,0:30,"Pick-up bouldering crash pad from Nick's friend (addy?)",
,,,10:30,11:30,1:00,Drive to REI and shop,
,,,11:30,12:30,1:00,"Drive to Trader Joe's and shop for lunch/snacks","Kim will do a big grocery pick up in Seattle before driving to Leavenworth cabin"
,,,12:30,19:00,6:30,"Option 1: Drive to climb spot and climb, then head to airbnb. Option 2: Drive to Leavenworth cabin (Check-in after 4PM), chill/nap, visit Leavenworth town.","Kim will go straight to cabin and chill/cook dinner for everyone"
,,,16:00,,,Check in: 190 Dos Brothers Lane Leavenworth WA 98826 (Confirmation #15727779),
,Thursday,6/4/2026,6:00,,,Breakfast get ready pack gear for climbing,
,,,7:00,,,Depart for crag,
,,,9:00,10:00,,Later wake up/departure for those that want to sleep a bit more (jetlag will be a thing),
,,,20:00,22:00,,cabin potluck dinner - Mom's spaghetti after our palms been sweaty,
,Friday,6/5/2026,17:00,19:30,,cabin potluck din or eat in town - Andreas Keller restaurant?,
,,,20:00,,,Pick up Kirsten at Leavenworth Amtrak Station (8PM),
,Saturday,6/6/2026,,,,,Depart Airbnb cabin by 11AM,
,,,,,,Aris - Jess driving from Oregon to Seattle to meet for 1 day/not staying the night,
,,,,,,Aris and Kim drive to Seattle - will stay with Kim's friends Michael and Pablo,
,,,19:30,,,Rufus Du Sol Concert,
,Sunday,6/7/2026,,,,Aris departs 4:15PM,
,,,,,,Star & Jules depart later?,
,,,,,,"Kim staying in Seattle, heading up to Whistler to meet aunties",
`.trim()

export function parseCsv(csvText: string): ScheduleEvent[] {
  const result = Papa.parse<string[]>(csvText, {
    skipEmptyLines: false,
    header: false,
  })

  const rows: string[][] = result.data as string[][]
  const events: ScheduleEvent[] = []
  let currentDay = ''
  let currentDate = ''
  let currentDateObj = new Date(NaN)
  let eventIndex = 0

  // Skip the header row (row 0)
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    if (!row || row.length < 7) continue

    // Carry forward day/date
    const rawDay = (row[1] || '').trim()
    const rawDate = (row[2] || '').trim()
    if (rawDay) currentDay = rawDay
    if (rawDate) {
      currentDate = rawDate
      currentDateObj = parseSheetDate(rawDate)
    }

    const startTime = (row[3] || '').trim()
    const endTime = (row[4] || '').trim()
    const duration = (row[5] || '').trim()
    const title = (row[6] || '').trim()
    const notes = (row[7] || '').trim()

    // Skip rows with no activity
    if (!title) continue

    const type = detectActivityType(title, notes)

    events.push({
      id: `${currentDate}-${eventIndex++}`,
      day: currentDay,
      date: currentDate,
      dateObj: currentDateObj,
      startTime,
      endTime,
      duration,
      title,
      notes,
      type,
      completed: false,
    })
  }

  return events
}

export function groupByDay(events: ScheduleEvent[]): DayGroup[] {
  const map = new Map<string, DayGroup>()

  for (const event of events) {
    const key = event.date
    if (!map.has(key)) {
      map.set(key, {
        day: event.day,
        date: event.date,
        dateObj: event.dateObj,
        events: [],
      })
    }
    map.get(key)!.events.push(event)
  }

  return Array.from(map.values()).sort(
    (a, b) => a.dateObj.getTime() - b.dateObj.getTime()
  )
}
