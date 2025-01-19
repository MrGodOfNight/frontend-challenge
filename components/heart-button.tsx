'use client'

import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

// Интерфейс пропсов для кнопки избранного
interface HeartButtonProps {
  isFavorite: boolean  // Флаг, показывающий находится ли котик в избранном
  onClick: () => void  // Функция-обработчик клика
}

export function HeartButton({ isFavorite, onClick }: HeartButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "absolute top-2 right-2 p-2 rounded-full bg-black/50 transition-colors",
        "hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white"
      )}
    >
      <Heart
        className={cn(
          "w-5 h-5 transition-colors",
          isFavorite ? "fill-red-500 text-red-500" : "text-white"
        )}
      />
    </button>
  )
}
