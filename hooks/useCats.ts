'use client'

import { useEffect, useState } from 'react'
import { Cat, CatState } from '@/types/cat'

// API ключ для доступа к сервису с котиками
const API_KEY = 'live_L38QKF0Hn0OQH3plfB5qIrP5pBX8cD1vIyss5Qri6fELFs8m8K2VmTHfIYrqM3AO'
// Количество котиков, загружаемых за один запрос
const LIMIT = 20

export function useCats() {
  // Инициализация состояния приложения
  const [state, setState] = useState<CatState>({
    cats: [],
    favorites: new Set(),
    loading: false,
    page: 1,
  })

    // Загрузка избранных котиков из localStorage при монтировании компонента
    useEffect(() => {
      const savedFavorites = localStorage.getItem('catFavorites')
      if (savedFavorites) {
        setState(prev => ({
          ...prev,
          favorites: new Set(JSON.parse(savedFavorites))
        }))
      }
    }, [])

  // Сохранение избранных котиков в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem('catFavorites', JSON.stringify(Array.from(state.favorites)))
  }, [state.favorites])

  // Функция загрузки дополнительных котиков
  const loadMoreCats = async () => {
    if (state.loading) return; // Ждём инициализации favorites

    setState(prev => ({ ...prev, loading: true }))

    try {
      const response = await fetch(
        `https://api.thecatapi.com/v1/images/search?limit=${LIMIT}&page=${state.page}`,
        {
          headers: {
            'x-api-key': API_KEY
          }
        }
      )
      const newCats: Cat[] = await response.json()

      setState(prev => ({
        ...prev,
        cats: [...prev.cats, ...newCats],
        page: prev.page + 1,
        loading: false
      }))
    } catch (error) {
      console.error('Ошибка загрузки котиков:', error)
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  // Функция для добавления/удаления котика из избранного
  const toggleFavorite = (catId: string) => {
    setState(prev => {
      const newFavorites = new Set(prev.favorites)
      if (newFavorites.has(catId)) {
        newFavorites.delete(catId)
      } else {
        newFavorites.add(catId)
      }
      return { ...prev, favorites: newFavorites }
    })
  }

  // Загрузка первой порции котиков при монтировании компонента
  useEffect(() => {
    loadMoreCats()
  }, [])

  return {
    cats: state.cats,
    favorites: state.favorites,
    loading: state.loading,
    loadMoreCats,
    toggleFavorite
  }
}
