export interface Image {
  original: string
  thumbnail: string
}

export interface Location {
  name: string
  link: string
  image: string
}

export interface Embed {
  src: string
  thumbnail: string
}

export interface Timestamp {
  year: number
  month: number
  day: number
  hour: number
  minute: number
}

export interface People {
  id: string
  nickname: string
  profile: string
}

export interface Comment {
  writer: People
  content: string
  timestamp: Timestamp
}

export interface Post {
  writer: People
  content: string
  tag: string[]
  metoo: People[]
  timestamp: Timestamp
  images: Image[]
  location: Location
  embed: Embed
  comments: Comment[]
}