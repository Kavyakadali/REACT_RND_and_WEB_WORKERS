// // public/worker.js
// let data = [];

// self.onmessage = (e) => {
//   try {
//     console.log('Worker received message:', e.data);
//     if (e.data.type === 'init') {
//       data = e.data.data || [];
//       console.log('Worker initialized with', data.length, 'records');
//       self.postMessage({ type: 'init', data });
//     } else if (e.data.type === 'search') {
//       const searchTerm = e.data.searchTerm?.toLowerCase() || '';
//       console.log('Worker searching for:', searchTerm);
//       if (!searchTerm) {
//         self.postMessage({ type: 'search', data });
//         return;
//       }
//       const results = data.filter((record) =>
//         Object.values(record).some((field) =>
//           String(field).toLowerCase().includes(searchTerm)
//         )
//       );
//       console.log('Worker found', results.length, 'results');
//       self.postMessage({ type: 'search', data: results });
//     } else {
//       throw new Error(`Unknown message type: ${e.data.type}`);
//     }
//   } catch (error) {
//     const errorMsg = error instanceof Error ? error.message : 'Unknown error in Web Worker';
//     console.error('Worker error:', error);
//     self.postMessage({ type: 'error', error: errorMsg });
//   }
// };

// public/comlink-worker.js
// This file should be placed in your public directory

// Import Comlink from CDN
importScripts('https://unpkg.com/comlink/dist/umd/comlink.js');

class SearchWorker {
  constructor() {
    this.data = [];
    console.log('SearchWorker class instantiated');
  }

  async initialize(records) {
    console.log('Initialize called with records:', records.length);
    this.data = records;
    console.log('Comlink Worker initialized with', this.data.length, 'records');
    return true; // Return something to confirm success
  }

  async search(searchTerm) {
    console.log('Comlink Worker searching for:', searchTerm);
    
    if (!searchTerm || searchTerm.trim() === '') {
      console.log('Empty search term, returning all data');
      return this.data;
    }

    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    const results = this.data.filter((record) => {
      return Object.values(record).some((field) => {
        return String(field).toLowerCase().includes(lowerSearchTerm);
      });
    });

    console.log('Comlink Worker found', results.length, 'results');
    return results;
  }

  async getAllRecords() {
    console.log('getAllRecords called, returning', this.data.length, 'records');
    return this.data;
  }

  // Test method to verify worker is working
  async ping() {
    console.log('Ping received in worker');
    return 'pong';
  }
}

console.log('Worker script loaded, creating SearchWorker instance');
const searchWorker = new SearchWorker();
console.log('Exposing searchWorker via Comlink');
Comlink.expose(searchWorker);