'use server'

import { revalidatePath } from 'next/cache'

export async function revalidatePageAction(path: string) {
  // Purges the data cache for the specific path on the server
  revalidatePath(path) 
}
