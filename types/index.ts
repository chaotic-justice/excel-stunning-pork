export type NewUser = {
  name: string
  /**
   * @format email
   */
  email: string
  id?: number | undefined
  createdAt?: string | undefined
  updatedAt?: string | undefined
}

export type NewDocument = {
  name: string
  groupId: number
  id?: number | undefined
}
