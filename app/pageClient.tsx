'use client'

import { useState } from 'react'
import { useCats } from '@/hooks/useCats'
import { CatGrid } from '@/components/cat-grid'
import { cn } from '@/lib/utils'

export default function PageClient() {
  // Получаем все необходимые данные и функции из хука useCats
  const { cats, favorites, loading, loadMoreCats, toggleFavorite } = useCats()
  // Состояние для отслеживания активной вкладки
  const [activeTab, setActiveTab] = useState('all')

  // Фильтруем котиков для отображения избранных
  const favoriteCats = cats.filter(cat => favorites.has(cat.id))

  return (
    <div className="min-h-screen flex flex-col">
      {/* Хедер с навигацией */}
      <header className="bg-[#2196F3] text-white">
        <nav className="max-w-7xl mx-auto px-4">
          <div className="flex justify-start space-x-6 py-3">
            <button
              onClick={() => setActiveTab('all')}
              className={cn(
                "text-white/90 hover:text-white transition-colors",
                activeTab === 'all' && "text-white font-medium"
              )}
            >
              Все котики
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={cn(
                "text-white/90 hover:text-white transition-colors",
                activeTab === 'favorites' && "text-white font-medium"
              )}
            >
              Любимые котики
            </button>
          </div>
        </nav>
      </header>

      {/* Основной контент */}
      <main className="flex-1 bg-white">
        <div className="max-w-7xl mx-auto py-6">
          {activeTab === 'all' ? (
            <CatGrid
              cats={cats}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onLoadMore={loadMoreCats}
              loading={loading}
            />
          ) : (
            <CatGrid
              cats={favoriteCats}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          )}
        </div>
      </main>
    </div>
  )
}
