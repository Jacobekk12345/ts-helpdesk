type StorageData = {
    data: object,
    currentId: number
}

export class TicketStorage {
    saveToStorage(): void {
        const data: StorageData = {
            tickets: this.tickets,
            currentId: this.currentId
        };
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    loadFromStorage(): void {
        const raw: object = localStorage.getItem(this.storageKey);
        if (!raw) return;

        try {
            const data: StorageData = JSON.parse(raw);
            this.tickets = data.tickets ?? [];
            this.currentId = data.currentId ?? 1;
        } catch (e) {
            console.error("Corrupted storage data", e);
            localStorage.removeItem(this.storageKey);
        }
    }
}
