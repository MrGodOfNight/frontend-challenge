'use client'

import { useEffect, useRef, useCallback } from 'react'
import { Cat } from '@/types/cat'
import { HeartButton } from './heart-button'
import Image from 'next/image'

// Интерфейс пропсов для сетки котиков
interface CatGridProps {
  cats: Cat[]                           // Массив котиков для отображения
  favorites: Set<string>                // Множество ID избранных котиков
  onToggleFavorite: (id: string) => void// Функция для добавления/удаления из избранного
  onLoadMore?: () => void              // Функция загрузки дополнительных котиков
  loading?: boolean                     // Флаг загрузки
}

export function CatGrid({
                          cats,
                          favorites,
                          onToggleFavorite,
                          onLoadMore,
                          loading
                        }: CatGridProps) {
  // Создаем наблюдатель за последним элементом для бесконечной прокрутки
  const observer = useRef<IntersectionObserver>()
  const lastCatRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && onLoadMore) {
          onLoadMore()
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, onLoadMore]
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {cats.map((cat, index) => (
        <div
          key={cat.id}
          ref={cats.length === index + 1 ? lastCatRef : undefined}
          className="relative aspect-square rounded-lg overflow-hidden group"
        >
          <Image
            src={cat.url || "/placeholder.svg"}
            alt="Котик"
            fill
            className="object-cover transition-transform group-hover:scale-110"
          />
          <HeartButton
            isFavorite={favorites.has(cat.id)}
            onClick={() => onToggleFavorite(cat.id)}
          />
        </div>
      ))}
      {loading && (
        <div className="col-span-full text-center py-4">
          Загрузка котиков...
        </div>
      )}
    </div>
  )
}