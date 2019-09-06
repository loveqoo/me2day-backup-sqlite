export interface People {
  id: string
  nick_name: string
  profile_path: string
}

export interface Post {
  id: number
  content: string
  writer: string
  created_at: number
  hash_code: number
}


export interface Comment {
  id: number
  content: string
  writer: string
  post_id: number
  created_at: number
}

export interface Tag {
  id: string
}

export interface PostTag {
  post_id: number,
  tag_id: string
}