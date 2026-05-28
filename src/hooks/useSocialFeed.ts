import { useCallback } from 'react'
import { FeedPost, FeedComment } from '../types'
import { useLocalStorage } from './useLocalStorage'
import { getAvatarColor, getInitials } from '../utils/helpers'

// Seed data so the feed feels alive on first visit
const SEED_POSTS: FeedPost[] = [
  {
    id: 'seed-1',
    authorName: 'Kim',
    authorInitials: 'KI',
    avatarColor: 'bg-emerald-500',
    routeName: 'Batman',
    grade: '5.8',
    comment: "What a day on Castle Rock! The exposure on pitch 3 had my heart racing but the views were absolutely worth it. Classic Pacific Northwest adventure climbing at its finest 🧗‍♀️",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes: 7,
    likedByMe: false,
    comments: [
      {
        id: 'seed-1-c1',
        authorName: 'Aris',
        authorInitials: 'AR',
        avatarColor: 'bg-orange-500',
        text: 'So stoked for you!! Can\'t wait to get on it tomorrow.',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
      }
    ],
  },
  {
    id: 'seed-2',
    authorName: 'Star',
    authorInitials: 'ST',
    avatarColor: 'bg-violet-500',
    routeName: 'Infinite Bliss',
    grade: '5.9',
    comment: "SENT!! First redpoint of the trip!! This route is a 5-star gem. The rock quality at Peshastin is next level. Thank you Billy for the beta on the crux sequence 🙌",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likes: 12,
    likedByMe: false,
    comments: [
      {
        id: 'seed-2-c1',
        authorName: 'Jules',
        authorInitials: 'JU',
        avatarColor: 'bg-pink-500',
        text: 'YESSS!! High five!! 🙌 Your footwork on that slab section was dialed.',
        timestamp: new Date(Date.now() - 4.5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'seed-2-c2',
        authorName: 'Billy',
        authorInitials: 'BI',
        avatarColor: 'bg-cyan-500',
        text: 'Knew you had it! The beta works every time once you trust the smear.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      }
    ],
  },
  {
    id: 'seed-3',
    authorName: 'Jules',
    authorInitials: 'JU',
    avatarColor: 'bg-pink-500',
    routeName: 'The Prow',
    grade: 'V2',
    comment: "Warmed up on boulders this morning before heading to the crag. Leavenworth granite is so different from what we have at home — rougher, grippier, just incredible. The crash pad pickup was totally worth it.",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    likes: 5,
    likedByMe: false,
    comments: [],
  },
  {
    id: 'seed-4',
    authorName: 'Billy',
    authorInitials: 'BI',
    avatarColor: 'bg-cyan-500',
    routeName: 'Outer Space',
    grade: '5.9',
    comment: "7 pitches, 800ft, and worth every breath of the 2-hour approach. The Snow Creek Wall is everything everyone said it would be. Descended right at golden hour — absolutely magical. This is why we climb.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    likes: 18,
    likedByMe: false,
    comments: [
      {
        id: 'seed-4-c1',
        authorName: 'Aris',
        authorInitials: 'AR',
        avatarColor: 'bg-orange-500',
        text: 'Goals!! Adding this to the tick list for sure.',
        timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
      }
    ],
  },
  {
    id: 'seed-5',
    authorName: 'Aris',
    authorInitials: 'AR',
    avatarColor: 'bg-orange-500',
    routeName: 'Highball Heaven',
    grade: 'V4',
    comment: "Fell off the top-out three times before finally committing. That last move with nothing but air below you is a completely different mental game. So pumped to have this one in the books ✅",
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    likes: 9,
    likedByMe: false,
    comments: [
      {
        id: 'seed-5-c1',
        authorName: 'Star',
        authorInitials: 'ST',
        avatarColor: 'bg-violet-500',
        text: 'That top-out is SCARY. Mad respect for committing to it.',
        timestamp: new Date(Date.now() - 35 * 60 * 60 * 1000).toISOString(),
      }
    ],
  },
]

export function useSocialFeed() {
  const [posts, setPosts] = useLocalStorage<FeedPost[]>('leavenworth-feed', SEED_POSTS)

  const addPost = useCallback((data: {
    authorName: string
    routeName: string
    grade: string
    comment: string
    imageDataUrl?: string
  }) => {
    const newPost: FeedPost = {
      id: `post-${Date.now()}`,
      authorName: data.authorName,
      authorInitials: getInitials(data.authorName),
      avatarColor: getAvatarColor(data.authorName),
      routeName: data.routeName,
      grade: data.grade,
      comment: data.comment,
      timestamp: new Date().toISOString(),
      imageDataUrl: data.imageDataUrl,
      likes: 0,
      likedByMe: false,
      comments: [],
    }
    setPosts(prev => [newPost, ...prev])
  }, [setPosts])

  const toggleLike = useCallback((postId: string) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, likes: p.likedByMe ? p.likes - 1 : p.likes + 1, likedByMe: !p.likedByMe }
          : p
      )
    )
  }, [setPosts])

  const addComment = useCallback((postId: string, authorName: string, text: string) => {
    const comment: FeedComment = {
      id: `comment-${Date.now()}`,
      authorName,
      authorInitials: getInitials(authorName),
      avatarColor: getAvatarColor(authorName),
      text,
      timestamp: new Date().toISOString(),
    }
    setPosts(prev =>
      prev.map(p =>
        p.id === postId ? { ...p, comments: [...p.comments, comment] } : p
      )
    )
  }, [setPosts])

  return { posts, addPost, toggleLike, addComment }
}
