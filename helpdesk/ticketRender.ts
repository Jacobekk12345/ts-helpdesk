import { priorityOrder, TicketType } from './ticket.ts';
import { TicketStorage } from './ticketStorage.ts';

export class TicketRenderer extends TicketStorage {
    renderTickets(): void {
        this.ticketList.innerHTML = "";

        let filteredTickets: TicketType[] = this.filterTicketsByStatus(this.statusElement.value);

        // Sort a copy so the original tickets stay in ID order.
        let sortedTickets: TicketType[] = [...filteredTickets].sort(
            (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
        );

        sortedTickets.forEach(ticket => {
            this.createTicketDiv(ticket);
        });

        document.getElementById("showing").textContent = sortedTickets.length;
        document.getElementById("totalTickets").textContent = this.tickets.length;

        if (sortedTickets.length === 0) {
            this.ticketList.textContent = "no tickets to show!";
        }
    }

    createTicketDiv(ticket: TicketType): void {
        let newTicketDiv: HTMLElement = document.createElement("div");
        newTicketDiv.id = ticket.id;
        newTicketDiv.className = "ticketDiv";

        let titleLabel: HTMLElement = document.createElement("p");
        titleLabel.textContent = ticket.title;
        titleLabel.className = "ticketTitle";

        let priorityLabel: HTMLElement = document.createElement("p");
        priorityLabel.textContent = `Priority: ${ticket.priority}`;
        priorityLabel.className = "ticketPriority";

        let statusLabel: HTMLElement = document.createElement("p");
        statusLabel.className = "ticketStatus";

        let statusSelect: HTMLElement = document.createElement("select");
        statusSelect.className = "ticketStatusSelect";
        statusSelect.id = `statusSelect${ticket.id}`;

        const optionNew: Option = new Option("New", "new");
        const optionDoing: Option = new Option("Doing", "doing");
        const optionDone: Option = new Option("Done", "done");

        statusSelect.add(optionNew);
        statusSelect.add(optionDoing);
        statusSelect.add(optionDone);

        statusSelect.value = ticket.status;

        statusLabel.textContent = "Status: ";
        statusLabel.appendChild(statusSelect);

        const removeLabel: HTMLElement = document.createElement("p");
        removeLabel.className = "removeLabel";
        removeLabel.textContent = "Remove";

        newTicketDiv.appendChild(titleLabel);
        newTicketDiv.appendChild(priorityLabel);
        newTicketDiv.appendChild(statusLabel);
        newTicketDiv.appendChild(removeLabel);

        this.ticketList.appendChild(newTicketDiv);

        statusSelect.addEventListener("change", () => {
            ticket.status = statusSelect.value;
            this.saveToStorage();
        });

        removeLabel.addEventListener("click", () => {
            this.removeTicket(ticket.id);
            this.renderTickets();
        });
    }
}
