'use client'

import { useEffect, useState } from 'react'
import { Cat, CatState } from '@/types/cat'

// API ключ для доступа к сервису с котиками
const API_KEY = 'live_L38QKF0Hn0OQH3plfB5qIrP5pBX8cD1vIyss5Qri6fELFs8m8K2VmTHfIYrqM3AO'
// Количество котиков, загружаемых за один запрос
const LIMIT = 20

export function useCats() {
  const [state, setState] = useState<CatState>({
    cats: [],
    favorites: new Set(),
    loading: false,
    page: 1,
  })

  const favoritesLoadedRef = useRef(false)

  // Загрузка избранных котиков из localStorage при монтировании компонента
  useEffect(() => {
    const savedFavorites = localStorage.getItem("catFavorites")
    if (savedFavorites) {
      const favorites = new Set(JSON.parse(savedFavorites))
      setState((prev) => ({
        ...prev,
        favorites,
      }))
      if (!favoritesLoadedRef.current) {
        loadFavoriteCats(favorites)
        favoritesLoadedRef.current = true
      }
    }
  }, [])

  // Сохранение избранных котиков в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem("catFavorites", JSON.stringify(Array.from(state.favorites)))
  }, [state.favorites])

  // Функция загрузки любимых котиков
  const loadFavoriteCats = async (favorites: Set<string>) => {
    setState((prev) => ({ ...prev, loading: true }))
    try {
      const favoriteCatsPromises = Array.from(favorites).map((id) =>
        fetch(`https://api.thecatapi.com/v1/images/${id}`, {
          headers: { "x-api-key": API_KEY },
        }).then((res) => res.json()),
      )
      const favoriteCats = await Promise.all(favoriteCatsPromises)
      setState((prev) => ({
        ...prev,
        cats: [...favoriteCats.map((cat) => ({ ...cat, isFavorite: true })), ...prev.cats],
        loading: false,
      }))
    } catch (error) {
      console.error("Ошибка загрузки любимых котиков:", error)
      setState((prev) => ({ ...prev, loading: false }))
    }
  }

  // Функция загрузки дополнительных котиков
  const loadMoreCats = async () => {
    if (state.loading) return

    setState((prev) => ({ ...prev, loading: true }))

    try {
      const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=${LIMIT}&page=${state.page}`, {
        headers: {
          "x-api-key": API_KEY,
        },
      })
      const newCats: Cat[] = await response.json()

      setState((prev) => ({
        ...prev,
        cats: [...prev.cats, ...newCats.map((cat) => ({ ...cat, isFavorite: prev.favorites.has(cat.id) }))],
        page: prev.page + 1,
        loading: false,
      }))
    } catch (error) {
      console.error("Ошибка загрузки котиков:", error)
      setState((prev) => ({ ...prev, loading: false }))
    }
  }

  // Функция для добавления/удаления котика из избранного
  const toggleFavorite = (catId: string) => {
    setState((prev) => {
      const newFavorites = new Set(prev.favorites)
      const isFavorite = newFavorites.has(catId)
      if (isFavorite) {
        newFavorites.delete(catId)
      } else {
        newFavorites.add(catId)
      }
      const newCats = prev.cats.map((cat) => (cat.id === catId ? { ...cat, isFavorite: !isFavorite } : cat))
      return { ...prev, favorites: newFavorites, cats: newCats }
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
    toggleFavorite,
  }
}
