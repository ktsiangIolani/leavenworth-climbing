import { Participant } from '../types'
import { getAvatarColor, getInitials } from '../utils/helpers'

const NAMES = ['Aris', 'Kim', 'Star', 'Jules', 'Billy']

export const PARTICIPANTS: Participant[] = NAMES.map(name => ({
  name,
  initials: getInitials(name),
  avatarColor: getAvatarColor(name),
  notes: '',
}))
