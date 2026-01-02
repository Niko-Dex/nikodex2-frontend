// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { User } from "$lib/types/user";
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    interface PageData {
      currentUser?: User | undefined;
    }
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
