export interface Cat {
  id: string 
  url: string
  width: number
  height: number
  isFavorite: boolean
}

export interface CatState {
  cats: Cat[] 
  favorites: Set<string>
  loading: boolean
  page: number
}

