import { Helpdesk, feedbackLabel } from './helpdesk.ts';
import {TicketType} from './ticket.ts'

document.getElementById("title").focus();

const helpdesk: Helpdesk = new Helpdesk();

helpdesk.renderTickets();

document.getElementById("submitButton").addEventListener('click', (e) => {
    e.preventDefault(); // prevents reload on enter

    feedbackLabel.textContent = "";

    let title: string = document.getElementById("title").value.trim();

    if (title.length < 3 || title.length > 80) {
        feedbackLabel.textContent = "tickets title must have between 3 and 80 characters";
        return;
    }

    let ticket: TicketType = {
        id: helpdesk.currentId++,
        title: title,
        priority: document.getElementById("priority").value,
        status: "new"
    }

    document.getElementById("title").value = "";
    document.getElementById("priority").value = "low";

    helpdesk.addTicket(ticket);

    helpdesk.renderTickets();
});

helpdesk.statusElement.addEventListener('change', () => {
    helpdesk.renderTickets();
});

const fileInput: object = document.getElementById("importInput");

// async lets us use await while the selected file is being read.
async function handleImport(event: object): void {
    const file: object = event.target.files[0];

    if (!file) {
        return;
    }

    try {
        // file.text() returns a Promise with the file's text.
        const importData: string = await file.text();

        alert(helpdesk.import(importData));
    }
    catch (error) {
        console.error("Could not read the import file", error);
        alert("Could not read the file. Please try again.");
    }

    // Clear the input so the same file can be selected again.
    fileInput.value = "";
}

fileInput.addEventListener("change", (event) => {
    handleImport(event);
});

document.getElementById("exportLabel").addEventListener('click', () => {
    prompt("Your export JSON", JSON.stringify(helpdesk.tickets));
});
