export type NikodexComment = {
    id: number,
    content: string,
    author_id: number,
    post_date: string
    user: {
        username: string
    }
}