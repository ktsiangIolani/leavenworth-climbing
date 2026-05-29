import { useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { FeedPost } from '../types'
import { getAvatarColor, getInitials } from '../utils/helpers'

const API = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

async function fetchPosts(): Promise<FeedPost[]> {
  const res = await fetch(`${API}/api/posts`)
  if (!res.ok) throw new Error('Failed to fetch posts')
  return res.json()
}

export function useSocialFeed() {
  const queryClient = useQueryClient()

  const { data: posts = [] } = useQuery<FeedPost[]>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 30_000,
  })

  const addPost = useCallback(async (data: {
    authorName: string
    routeName: string
    grade: string
    comment: string
    imageDataUrl?: string
  }) => {
    const body = {
      id: `post-${Date.now()}`,
      authorName: data.authorName,
      authorInitials: getInitials(data.authorName),
      avatarColor: getAvatarColor(data.authorName),
      routeName: data.routeName,
      grade: data.grade,
      comment: data.comment,
      timestamp: new Date().toISOString(),
      imageDataUrl: data.imageDataUrl,
    }
    await fetch(`${API}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    queryClient.invalidateQueries({ queryKey: ['posts'] })
  }, [queryClient])

  const addComment = useCallback(async (postId: string, authorName: string, text: string) => {
    const body = {
      id: `comment-${Date.now()}`,
      authorName,
      authorInitials: getInitials(authorName),
      avatarColor: getAvatarColor(authorName),
      text,
      timestamp: new Date().toISOString(),
    }
    await fetch(`${API}/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    queryClient.invalidateQueries({ queryKey: ['posts'] })
  }, [queryClient])

  return { posts, addPost, addComment }
}
