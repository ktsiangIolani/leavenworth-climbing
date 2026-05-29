import { useCallback } from 'react'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import type { FeedPost } from '../types'
import { getAvatarColor, getInitials } from '../utils/helpers'

const API = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
const PAGE_SIZE = 8

interface PostsPage {
  posts: FeedPost[]
  total: number
  hasMore: boolean
}

async function fetchPage(offset: number): Promise<PostsPage> {
  const res = await fetch(`${API}/api/posts?limit=${PAGE_SIZE}&offset=${offset}`)
  if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`)
  return res.json()
}

export function useSocialFeed() {
  const queryClient = useQueryClient()

  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }: { pageParam: number }) => fetchPage(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage: PostsPage, allPages: PostsPage[]) =>
      lastPage.hasMore ? allPages.length * PAGE_SIZE : undefined,
    staleTime: 0,
    retry: 3,
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 8000),
  })

  const posts: FeedPost[] = data?.pages.flatMap(p => p.posts) ?? []

  const addPost = useCallback(async (postData: {
    authorName: string
    routeName: string
    grade: string
    comment: string
    imageDataUrl?: string
  }) => {
    const body = {
      id: `post-${Date.now()}`,
      authorName: postData.authorName,
      authorInitials: getInitials(postData.authorName),
      avatarColor: getAvatarColor(postData.authorName),
      routeName: postData.routeName,
      grade: postData.grade,
      comment: postData.comment,
      timestamp: new Date().toISOString(),
      imageDataUrl: postData.imageDataUrl,
    }
    await fetch(`${API}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    // Refetch all loaded pages so the new post appears at the top
    await queryClient.refetchQueries({ queryKey: ['posts'] })
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
    await queryClient.refetchQueries({ queryKey: ['posts'] })
  }, [queryClient])

  return {
    posts,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
    addPost,
    addComment,
  }
}
