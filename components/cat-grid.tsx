'use client'

import { useEffect, useRef, useCallback } from 'react'
import { Cat } from '@/types/cat'
import { HeartButton } from './heart-button'
import Image from 'next/image'

interface CatGridProps {
  cats: Cat[]
  onToggleFavorite: (id: string) => void
  onLoadMore?: () => void
  loading?: boolean
}

export function CatGrid({ cats, onToggleFavorite, onLoadMore, loading }: CatGridProps) {
  const observer = useRef<IntersectionObserver>()
  const lastCatRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && onLoadMore) {
          onLoadMore()
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, onLoadMore],
  )

  // Сортируем котиков так, чтобы любимые были в начале списка
  const sortedCats = [...cats].sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0))

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {sortedCats.map((cat, index) => (
        <div
          key={`${cat.id}-${index}`} // Используем комбинацию id и индекса для уникального ключа
          ref={sortedCats.length === index + 1 ? lastCatRef : undefined}
          className="relative aspect-square rounded-lg overflow-hidden group"
        >
          <Image
            src={cat.url}
            alt="Котик"
            fill
            className="object-cover transition-transform group-hover:scale-110"
          />
          <HeartButton isFavorite={cat.isFavorite} onClick={() => onToggleFavorite(cat.id)} />
        </div>
      ))}
      {loading && <div className="col-span-full text-center py-4">Загрузка котиков...</div>}
    </div>
  )
}