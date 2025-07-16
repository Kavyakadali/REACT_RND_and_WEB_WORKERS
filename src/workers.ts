// // src/worker.ts
// interface Record {
//     id: number;
//     firstName: string;
//     lastName: string;
//     email: string;
//     phone: string;
//     address: string;
//     age: number;
//     occupation: string;
//     company: string;
//     membership: 'Premium' | 'Standard';
//   }
  
//   interface WorkerMessage {
//     type: 'init' | 'search' | 'error';
//     data?: Record[];
//     searchTerm?: string;
//     error?: string;
//   }
  
//   let data: Record[] = [];
  
//   self.onmessage = (e: MessageEvent<WorkerMessage>) => {
//     try {
//       console.log('Worker received message:', e.data); // Debug
//       if (e.data.type === 'init') {
//         data = e.data.data || [];
//         console.log('Worker initialized with', data.length, 'records'); // Debug
//         self.postMessage({ type: 'init', data } as WorkerMessage);
//       } else if (e.data.type === 'search') {
//         const searchTerm = e.data.searchTerm?.toLowerCase() || '';
//         console.log('Worker searching for:', searchTerm); // Debug
//         if (!searchTerm) {
//           self.postMessage({ type: 'search', data } as WorkerMessage);
//           return;
//         }
//         const results = data.filter((record) =>
//           Object.values(record).some((field) =>
//             String(field).toLowerCase().includes(searchTerm)
//           )
//         );
//         console.log('Worker found', results.length, 'results'); // Debug
//         self.postMessage({ type: 'search', data: results } as WorkerMessage);
//       } else {
//         throw new Error(`Unknown message type: ${e.data.type}`);
//       }
//     } catch (error) {
//       const errorMsg = error instanceof Error ? error.message : 'Unknown error in Web Worker';
//       console.error('Worker error:', error); // Debug
//       self.postMessage({ type: 'error', error: errorMsg } as WorkerMessage);
//     }
//   };

// public/comlink-worker.js
// This file should be placed in your public directory

// Import Comlink from CDN since we can't use npm imports in a public worker file
// src/comlink-worker.ts
import * as Comlink from 'comlink';

interface UserRecord {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  age: number;
  occupation: string;
  company: string;
  membership: 'Premium' | 'Standard';
}

class SearchWorker {
  private data: UserRecord[] = [];

  async initialize(records: UserRecord[]): Promise<void> {
    this.data = records;
    console.log('Comlink Worker initialized with', this.data.length, 'records');
  }

  async search(searchTerm: string): Promise<UserRecord[]> {
    console.log('Comlink Worker searching for:', searchTerm);
    
    if (!searchTerm) {
      return this.data;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    const results = this.data.filter((record) =>
      Object.values(record).some((field) =>
        String(field).toLowerCase().includes(lowerSearchTerm)
      )
    );

    console.log('Comlink Worker found', results.length, 'results');
    return results;
  }

  async getAllRecords(): Promise<UserRecord[]> {
    return this.data;
  }
}

const searchWorker = new SearchWorker();
Comlink.expose(searchWorker);