if (typeof Dexie === 'undefined') console.error("Dexie.js missing.");

class BeholdStore {
    constructor() {
        // Critical: Unique database name for the new project
        this.db = new Dexie("BeholdYourGodDB");
        this.db.version(1).stores({ insights: '++id, voice, title, *tags, created_at' });
    }
    async init() {
        if (!this.db.isOpen()) await this.db.open();
        const count = await this.db.insights.count();
        if (count === 0) {
            // Generic seed data to initialize the DB without theology specifics
            await this.db.insights.add({
                voice: "System", 
                title: "Welcome to Behold Your God",
                text: "The database is initialized and ready for import.",
                tags: ["System"], 
                created_at: new Date().toISOString()
            });
        }
    }
    async getAll() { return await this.db.insights.orderBy('created_at').reverse().toArray(); }
    async getByVoice(voice) { return await this.db.insights.where('voice').equals(voice).toArray(); }
    async add(data) { return await this.db.insights.add({ ...data, created_at: new Date().toISOString() }); }
}

window.store = new BeholdStore();
