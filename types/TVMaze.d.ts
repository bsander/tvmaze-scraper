export namespace TVMaze {
  interface Show {
    id: number
    name: string
  }

  interface CastMember {
    id: number
    name: string
    birthday?: string
  }

  type CastList = {
    person: CastMember
  }[]

  type ShowList = Show[]
}
