export interface People {
  id: string
  nick_name: string
  profile_path: string
}

export interface Post {
  id: number
  content: string
  writer: string
  created_at: string
  hash_code: number
}

export interface Comment {
  id: number
  content: string
  writer: string
  post_id: number
  created_at: number
}

export interface Location {
  name: string
  link: string
  image_path: string
  post_id: number
}

export interface Image {
  id: number
  original: string
  thumbnail: string
  post_id: number
}

export interface Embed {
  id: number
  src: string
  thumbnail: string
  post_id: number
}

export interface Tag {
  id: string
}

export interface PostTag {
  post_id: number
  tag_id: string
}