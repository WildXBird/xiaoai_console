export type Notification = {
    id: string,
    time: Date,
    brief: string,
    title: string,
    summary: string,
    url: URL,
    picture: URL|string,
}