export interface Image {
  original: string
  thumbnail: string
}

export interface Location {
  name: string
  link: string
  image_path: string
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
  content: Content
  timestamp: Timestamp
}

export interface Anchor {
  title: string
  url: string
  domain: string
}

export interface Content {
  body: string
  anchors: Anchor[]
}

export interface Post {
  writer: People
  content: Content
  tags: string[]
  metoo: People[]
  timestamp: Timestamp
  images: Image[]
  location: Location
  embed: Embed
  comments: Comment[]
  file_path: string
}