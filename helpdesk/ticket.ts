export const priorityOrder: object = {
    high: 1,
    normal: 2,
    low: 3
}

export const statuses: string[] = ['new', 'doing', 'done'];

export type TicketType = {
    id: number,
    title: string,
    priority: "low", "normal", "high",
    status: "new", "done", "doing"
}
