import { priorityOrder, statuses, TicketType } from './ticket.ts';
import { TicketRenderer } from './ticketRender.ts';

export const feedbackLabel: object = document.getElementById("feedback");

export class Helpdesk extends TicketRenderer {
    constructor() {
        super();
        this.storageKey: symbol = Symbol("helpdeskData");
        this.tickets: TicketType[] = [];
        this.currentId: number = 1;
        this.statusElement: object = document.getElementById("status");
        this.ticketList: object = document.getElementById("list");
        this.loadFromStorage();
    }

    addTicket(ticket: TicketType): boolean {
        feedbackLabel.textContent = "";

        if (this.tickets.length < 1000) {
            this.tickets.push(ticket);
            this.saveToStorage();
            return true;
        }

        feedbackLabel.textContent = "too many tickets!";
        return false;
    }

    getTickets(): TicketType[] {
        return this.tickets;
    }

    removeTicket(id: number): void | boolean {
        let left = 0,
            right = this.tickets.length - 1;

        while (left <= right) {
            let pivot = Math.floor((left + right) / 2);
            let ticket = this.tickets[pivot];

            if (ticket.id === id) {
                this.tickets.splice(pivot, 1);
                this.saveToStorage();
                return true;
            }
            else if (ticket.id > id) {
                right = pivot - 1;
            }
            else {
                left = pivot + 1;
            }
        }

        return false;
    }

    getTicketAmount(): number {
        return this.tickets.length;
    }

    filterTicketsByStatus(status: string): TicketType[] {
        if (status === "all")
            return this.tickets;

        if (!(statuses.includes(status))) {
            return [];
        }

        return this.tickets.filter(ticket => ticket.status === status);
    }

    import(importData: object | string) {
        let data: TicketType[];

        try {
            data = JSON.parse(importData);
        }
        catch (error) {
            return "invalid JSON file";
        }

        if (data.length > 1000)
            return "too many tickets in the file";

        // Keep tickets in ID order because removeTicket uses binary search.
        data.sort((a, b) => a.id - b.id);

        for (let i = 1; i < data.length; i++) {
            if (data[i].id === data[i - 1].id)
                return "ticket IDs must be unique";
        }

        this.tickets = data;
        this.currentId = data.length > 0
            ? data[data.length - 1].id + 1
            : 1;

        this.saveToStorage();
        this.renderTickets();

        return "import successful";
    }
}
